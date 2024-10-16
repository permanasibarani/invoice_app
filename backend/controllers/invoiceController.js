const Invoice = require("../models/Modules/InvoicesModule/invoices");
const Product = require("../models/Modules/ProductsModule/products"); // Impor model Product
const ProductsSold = require("../models/Modules/ProductsSoldModule/ProductsSold"); // Impor model ProductsSold
const { Op } = require("sequelize"); // Ensure Sequelize and Op are imported
const sequelize = require("../models/database"); // Import your database config

exports.createInvoice = async (req, res) => {
  const { customer_name, sales_name, payment_type, products, notes, date } =
    req.body; // Ambil data dari request body

  try {
    // Validate and process the date
    let createdTimestamp;
    const today = new Date();
    const todayString = today.toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (date) {
      // Since date from frontend is already in "YYYY-MM-DD" format, we can directly create a new Date object
      const inputDate = new Date(date);
      const inputDateString = inputDate.toISOString().split("T")[0]; // Convert to 'YYYY-MM-DD' format for comparison

      // Validate future date
      if (inputDate > today) {
        return res
          .status(400)
          .json({ message: "Date cannot be in the future." });
      }
      createdTimestamp = inputDate;
    } else {
      // Default to current timestamp if no date provided
      createdTimestamp = today;
    }
    console.log("Whatsupp");
    console.log(notes);
    // Create Invoice
    const newInvoice = await Invoice.create({
      customer_name: customer_name,
      sales_name: sales_name,
      payment_type: payment_type,
      catatan: notes || null, // Include notes or default to null
      created_timestamp: createdTimestamp.toISOString(), // Convert to timestamp format
    });

    // Loop through each product, check stock, save product to ProductsSold, and update stock
    for (const product of products) {
      const { product_id, quantity } = product; // Ambil product_id dan quantity dari setiap produk
      const productExists = await Product.findByPk(product_id);

      if (!productExists) {
        // Jika produk tidak ditemukan, hapus invoice yang sudah dibuat dan kembalikan error
        await newInvoice.destroy();
        return res
          .status(404)
          .json({ message: `Product with ID ${product_id} not found.` });
      }

      // Check if there is enough stock
      if (productExists.stock < quantity) {
        // Jika stok tidak mencukupi, hapus invoice dan kembalikan error
        await newInvoice.destroy();
        return res.status(400).json({
          message: `Insufficient stock for Product ID ${product_id}. Available stock: ${productExists.stock}`,
        });
      }

      // Save to ProductsSold
      await ProductsSold.create({
        invoice_id: newInvoice.invoice_id,
        product_id,
        quantity,
        total: productExists.price * quantity,
      });

      // Decrease product stock
      productExists.stock -= quantity;
      await productExists.save();
    }

    // Respond with the created invoice
    res.status(201).json(newInvoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// invoiceController.js
exports.getInvoices = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default values
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await Invoice.findAndCountAll({
      limit: parseInt(limit),
      offset: offset,
      include: [
        {
          model: ProductsSold,
          include: [
            {
              model: Product,
            },
          ],
        },
      ],
      order: [['created_timestamp', 'DESC']], // Sort by created_timestamp in descending order
    });

    res.status(200).json({
      totalInvoices: count,
      invoices: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getSalesByDate = async (req, res) => {
  const { date } = req.query; // Get the date parameter from the query

  try {
    if (!date) {
      return res.status(400).json({ message: "Date is required." });
    }

    // Adjust the date format for comparison
    const inputDate = new Date(date);
    const today = new Date();

    // Validate future date
    if (inputDate > today) {
      return res.status(400).json({ message: "Date cannot be in the future." });
    }

    // Initialize structure to hold hourly sales data
    const hourlySales = new Array(24).fill(0); // Array to hold sales data for each hour

    // Fetch all invoices for the specified date
    const invoices = await Invoice.findAll({
      where: {
        created_timestamp: {
          [Op.gte]: new Date(`${date}T00:00:00.000Z`), // Start of the day
          [Op.lt]: new Date(`${date}T23:59:59.999Z`), // End of the day
        },
      },
      include: [
        {
          model: ProductsSold,
          attributes: ["total"],
        },
      ],
    });

    // Process each invoice to accumulate sales data
    invoices.forEach((invoice) => {
      const hour = new Date(invoice.created_timestamp).getHours(); // Get hour of the invoice
      const totalForInvoice = invoice.ProductsSolds.reduce(
        (sum, item) => sum + item.total,
        0
      );
      hourlySales[hour] += totalForInvoice; // Accumulate total sales for that hour
    });

    // Prepare response data
    const responseData = hourlySales.map((total, index) => ({
      x: new Date(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate(),
        index
      ), // Date object for correct hour
      y: total,
    }));

    res.status(200).json(responseData); // Send the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getSalesByMonth = async (req, res) => {
  const { month, year } = req.query; // Get month and year from the query

  try {
    if (!month || !year) {
      return res.status(400).json({ message: "Month and Year are required." });
    }

    // Create the start and end date for the month
    const startDate = new Date(year, month - 1, 1); // Month is zero-based in JavaScript
    const endDate = new Date(year, month, 1); // Start of the next month

    // Initialize sales data for days in the month
    const salesData = Array.from(
      { length: new Date(year, month, 0).getDate() },
      (_, index) => ({
        x: index + 1, // 1 to 30
        y: 0, // Initialize sales amount to zero
      })
    );

    // Fetch all invoices for the specified month
    const invoices = await Invoice.findAll({
      where: {
        created_timestamp: {
          [Op.gte]: startDate, // Start of the month
          [Op.lt]: endDate, // Start of the next month
        },
      },
      include: [
        {
          model: ProductsSold,
          attributes: ["total"],
        },
      ],
    });

    // Process each invoice to accumulate sales data
    invoices.forEach((invoice) => {
      const invoiceDate = new Date(invoice.created_timestamp);
      const day = invoiceDate.getDate(); // Get the day of the month (1-30)
      const totalForInvoice = invoice.ProductsSolds.reduce(
        (sum, item) => sum + item.total,
        0
      );

      // Update the corresponding salesData for that day
      const index = day - 1; // Since index is 0-based
      salesData[index].y += totalForInvoice; // Accumulate total sales for that day
    });

    res.status(200).json(salesData); // Send the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getSalesByYear = async (req, res) => {
  console.log("Hello nigga");
  const { year } = req.query; // Get the year parameter from the query

  try {
    if (!year) {
      return res.status(400).json({ message: "Year is required." });
    }

    // Define the array for sales data
    const salesData = [];

    // Initialize salesData for each month and quarter
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    for (let i = 0; i < months.length; i++) {
      for (let j = 1; j <= 4; j++) {
        salesData.push({
          x: months[i] + ` Q${j}`,
          y: 0, // Initialize sales amount to zero
        });
      }
    }

    // Loop through each month and calculate total sales for each quarter
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const startDate = new Date(year, monthIndex, 1); // Start of the month
      const endDate = new Date(year, monthIndex + 1, 1); // Start of the next month

      // Fetch all invoices for the specified month
      const invoices = await Invoice.findAll({
        where: {
          created_timestamp: {
            [Op.gte]: startDate, // Start of the month
            [Op.lt]: endDate, // Start of the next month
          },
        },
        include: [
          {
            model: ProductsSold,
            attributes: ["total"],
          },
        ],
      });

      // Process each invoice to accumulate sales data per quarter
      invoices.forEach((invoice) => {
        const totalForInvoice = invoice.ProductsSolds.reduce(
          (sum, item) => sum + item.total,
          0
        );

        const quarter = Math.floor(monthIndex / 3); // Determine the quarter for the month
        const quarterIndex = monthIndex * 4 + quarter; // Calculate the index for salesData
        salesData[quarterIndex].y += totalForInvoice; // Accumulate total sales for that quarter
      });
    }

    // Respond with the formatted sales data
    res.status(200).json(salesData); // Send total sales grouped by month and quarter
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getInvoiceDetail = async (req, res) => {
  const { invoice_id } = req.query; // Get the invoice_id from the query

  if (!invoice_id) {
    return res.status(400).json({ message: "Invoice ID is required." });
  }

  try {
    const invoiceDetail = await Invoice.findOne({
      where: { invoice_id: invoice_id },
      include: [
        {
          model: ProductsSold,
          include: [
            {
              model: Product,
              attributes: ["product_name", "price"], // Include necessary fields from Product
            },
          ],
        },
      ],
    });

    if (!invoiceDetail) {
      return res.status(404).json({ message: "Invoice not found." });
    }

    const total_harga = invoiceDetail.ProductsSolds.reduce(
      (sum, item) => sum + item.total,
      0
    );

    // Format the response
    const response = {
      invoice_id: invoiceDetail.invoice_id,
      customer_name: invoiceDetail.customer_name,
      sales_name: invoiceDetail.sales_name,
      transaction_time: invoiceDetail.created_timestamp,
      payment_type: invoiceDetail.payment_type,
      items: invoiceDetail.ProductsSolds.map((item) => ({
        product_name: item.Product.product_name,
        quantity: item.quantity,
        unit_price: item.Product.price,
      })),
      total_harga: total_harga,
    };

    return res.status(200).json(response); // Return the formatted response
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
