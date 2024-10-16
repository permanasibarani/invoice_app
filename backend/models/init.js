const sequelize = require("./database"); // Import SQLite connection (or Sequelize connection)
require("./relation"); // Import relations

const Customer = require("./Modules/CustomerModule/customers");
const SalesPerson = require("./Modules/SalesPersonModule/salesPerson");
const Product = require("./Modules/ProductsModule/products");
const Invoice = require("./Modules/InvoicesModule/invoices");
const ProductsSold = require("./Modules/ProductsSoldModule/ProductsSold");

const addProducts = async () => {
  // Array of products to be added
  const products = [
    {
      product_name: "Dancow",
      product_picture_url: "url_to_dancow",
      price: Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000,
      stock: Math.floor(Math.random() * (50 - 30 + 1)) + 30,
    },
    // Add other products similarly...
    {
      product_name: "Fanta",
      product_picture_url: "url_to_fanta",
      price: Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000,
      stock: Math.floor(Math.random() * (50 - 30 + 1)) + 30,
    },
    {
      product_name: "Coca-cola",
      product_picture_url: "url_to_coca_cola",
      price: Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000,
      stock: Math.floor(Math.random() * (50 - 30 + 1)) + 30,
    },
    // Add additional products as needed
  ];

  try {
    const result = await Product.bulkCreate(products);
    console.log(`${result.length} products have been added successfully.`);
  } catch (error) {
    console.error("Error adding products:", error);
  }
};

const productIDs = [
  "000ce902-3ef9-4e02-a9ae-9fsdds26364c9",
  "000ce902-3ef9-4e02-a9ae-9fbc526364c9",
  "11d1090b-887b-41c2-9390-aa84d24da593",
  "487a3d91-5c8d-4810-b607-a44c379b198e",
];

// Function to add dummy invoices
const addDummyInvoices = async () => {
  const today = new Date("2024-10-16T00:00:00.000Z"); // Starting date for invoices
  const numInvoices = 100; // Number of invoices to create

  for (let i = 0; i < numInvoices; i++) {
    const invoiceDate = new Date(today.getTime() + i * 3600 * 1000); // Spread invoices throughout the day

    // Create the invoice
    const newInvoice = await Invoice.create({
      invoice_number: invoiceDate.getTime(), // You could generate an ID or number as needed
      customer_name: `Customer ${i + 1}`,
      sales_name: `Sales Person ${i + 1}`,
      payment_type: "cash",
      created_timestamp: invoiceDate.toISOString(), // Ensure the date format is correct
    });

    // Create associated products sold records
    const productsSoldRecords = productIDs.slice(0, 2).map((product_id) => ({
      invoice_id: newInvoice.invoice_id,
      product_id,
      quantity: Math.floor(Math.random() * 5) + 1, // Random quantity between 1 and 5
      total: Math.floor(Math.random() * 100000) + 1000, // Random total for each product sold
    }));

    await ProductsSold.bulkCreate(productsSoldRecords); // Save all products sold linked to invoice
  }
};

const addInvoicesByMonth = async (month, year, numInvoices) => {
  const startDate = new Date(year, month - 1, 1); // Bulan dimulai dari 0 (Januari = 0)
  const endDate = new Date(year, month, 0); // Hari terakhir bulan yang ditentukan
  const daysInMonth = endDate.getDate(); // Total hari di bulan itu

  // Loop untuk menambahkan numInvoices
  for (let i = 0; i < numInvoices; i++) {
    // Pilih hari acak antara 1 sampai daysInMonth
    const randomDay = Math.floor(Math.random() * daysInMonth) + 1; // Random day
    const invoiceDate = new Date(year, month - 1, randomDay); // Buat date object

    // Create the invoice
    const newInvoice = await Invoice.create({
      invoice_number: invoiceDate.getTime(), // Anda dapat membuat ID atau nomor yang diperlukan
      customer_name: `Customer ${i + 1}`,
      sales_name: `Sales Person ${i + 1}`,
      payment_type: "cash",
      created_timestamp: invoiceDate.toISOString(), // Pastikan format tanggal benar
    });

    // Create associated products sold records
    const productsSoldRecords = productIDs.slice(0, 2).map((product_id) => ({
      invoice_id: newInvoice.invoice_id,
      product_id,
      quantity: Math.floor(Math.random() * 5) + 1, // Kuantitas acak antara 1 dan 5
      total: Math.floor(Math.random() * 100000) + 1000, // Total acak untuk setiap produk yang terjual
    }));

    await ProductsSold.bulkCreate(productsSoldRecords); // Simpan produk yang terjual terkait dengan invoice
  }

  console.log(`${numInvoices} invoices added for ${month}/${year}.`);
};

const addInvoicesByYear = async (year, numInvoices) => {
  const monthsInYear = 12; // Jumlah bulan dalam setahun

  for (let i = 0; i < numInvoices; i++) {
    // Pilih bulan acak antara 0 (Januari) hingga 11 (Desember)
    const randomMonth = Math.floor(Math.random() * monthsInYear);

    // Pilih hari acak berdasarkan bulan dan tahun
    const daysInMonth = new Date(year, randomMonth + 1, 0).getDate(); // Dapatkan jumlah hari di bulan tersebut
    const randomDay = Math.floor(Math.random() * daysInMonth) + 1; // Random day from 1 to daysInMonth

    // Buat objek tanggal untuk invoice
    const invoiceDate = new Date(year, randomMonth, randomDay); // Buat date object

    // Create the invoice
    const newInvoice = await Invoice.create({
      invoice_number: invoiceDate.getTime(), // Anda dapat membuat ID atau nomor yang diperlukan
      customer_name: `Customer ${i + 1}`,
      sales_name: `Sales Person ${i + 1}`,
      payment_type: "cash",
      created_timestamp: invoiceDate.toISOString(), // Pastikan format tanggal benar
    });

    // Create associated products sold records
    const productsSoldRecords = productIDs.slice(0, 2).map((product_id) => ({
      invoice_id: newInvoice.invoice_id,
      product_id,
      quantity: Math.floor(Math.random() * 5) + 1, // Kuantitas acak antara 1 dan 5
      total: Math.floor(Math.random() * 100000) + 1000, // Total acak untuk setiap produk yang terjual
    }));

    await ProductsSold.bulkCreate(productsSoldRecords); // Simpan produk yang terjual terkait dengan invoice
  }

  console.log(`${numInvoices} invoices added for ${year}.`);
};

const init = async () => {
  try {
    await sequelize.sync({ force: false }); // Set force: true only for development
    console.log("All tables have been synced!");
    addDummyInvoices();
    // await addProducts();
    await addInvoicesByMonth(10, 2024, 200);
    await addInvoicesByYear(2024, 200);
  } catch (error) {
    console.error("Error syncing tables:", error);
  }
};

init(); // Run the initialization function
