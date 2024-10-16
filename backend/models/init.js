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
  "000ce902-3ef9-4e02-a9ae-9fbc526364c9",
  "0216d618-9a34-4972-bde7-de97411d2d65",
  "0559be85-65e1-46f4-9b68-776277fe609d",
  "0c8babe3-5e4c-44e8-a602-8d7d20a40755",
  "11d1090b-887b-41c2-9390-aa84d24da593",
  "1341b3db-2965-466f-9031-ff59073b5259",
  "149d993a-58d3-4bf3-881c-18595a012408",
  "17771a34-d074-472c-b695-3b7f93fc8674",
  "218e4260-0df8-4179-abcb-861edf8ce7ca",
  "22074624-7372-4346-8e82-bb3f8af44374",
  "235bd9b1-e4c1-4070-897e-198705a4dd60",
  "23b366d2-17a0-4a80-9bc6-a3a337f36c35",
  "248c8e56-5999-4eee-81ff-91d3e234b3de",
  "29296475-b362-4558-94b4-662765135a4f",
  "2f50acb6-159f-4854-9694-fa9f34f90b65",
  "3339a8f9-8f6f-4feb-9a84-805e15d918ec",
  "38ba6bd0-435d-4044-a5a6-73f59d95b9da",
  "3d0bb0f1-53da-4b26-b411-7de6fc09dbfe",
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

    // await addProducts(); // Call to add products
    // await addInvoicesByMonth(10, 2024, 200); // Adding random invoices
    // await addInvoicesByYear(2022, 200);
  } catch (error) {
    console.error("Error syncing tables:", error);
  }
};

init(); // Run the initialization function
