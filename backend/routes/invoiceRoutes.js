const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");

router.post("/postInvoice", invoiceController.createInvoice);
router.get("/getInvoices", invoiceController.getInvoices);
router.get("/getSalesByDate", invoiceController.getSalesByDate);
router.get("/getSalesByMonth", invoiceController.getSalesByMonth);
router.get("/getSalesByYear", invoiceController.getSalesByYear);
router.get("/getInvoiceDetail", invoiceController.getInvoiceDetail);

module.exports = router;
