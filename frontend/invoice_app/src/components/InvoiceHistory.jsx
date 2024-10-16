import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom"; // Import for page navigation

const InvoiceHistory = () => {
  const [invoices, setInvoices] = useState([]);
  const [snackOpen, setSnackOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [invoicesPerPage, setInvoicesPerPage] = useState(9); // Set default to a valid option
  const [totalInvoices, setTotalInvoices] = useState(0); // Total invoices count
  const [modalOpen, setModalOpen] = useState(false); // State for modal
  const [selectedInvoice, setSelectedInvoice] = useState(null); // Selected invoice for modal

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const navigate = useNavigate(); // Hook for navigation

  // Fetch Invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(
          `https://invoiceapp-production-0bd7.up.railway.app/api/invoices/getInvoices?page=${currentPage}&limit=${invoicesPerPage}`
        ); // Fetch with pagination parameters
        if (!response.ok) {
          throw new Error("Failed to fetch invoices");
        }
        const data = await response.json();
        setInvoices(data.invoices);
        setTotalInvoices(data.totalInvoices); // Store total invoices count
      } catch (error) {
        console.error("Error fetching invoices:", error);
        setSnackOpen(true);
        setSuccessMessage("Error fetching invoices");
      }
    };

    fetchInvoices();
  }, [currentPage, invoicesPerPage]); // Depend on current page and invoices per page

  const handlePageChange = (direction) => {
    setCurrentPage((prevPage) => {
      const totalPages = Math.ceil(totalInvoices / invoicesPerPage); // Calculate total pages based on total invoices
      if (direction === "next" && prevPage < totalPages) {
        return prevPage + 1; // Go to next page
      } else if (direction === "prev" && prevPage > 1) {
        return prevPage - 1; // Go to previous page
      }
      return prevPage; // Stay on the same page if at limits
    });
  };

  const handleCardClick = async (invoiceId) => {
    try {
      const response = await fetch(
        `https://invoiceapp-production-0bd7.up.railway.app/api/invoices/getInvoiceDetail?invoice_id=${invoiceId}`
      );
      if (!response.ok) throw new Error("Failed to fetch Invoice details");
      const data = await response.json();
      setSelectedInvoice(data); // Set the selected invoice for display in the modal
      setModalOpen(true); // Open the modal
    } catch (error) {
      console.error(error);
      setSnackOpen(true);
      setSuccessMessage("Error fetching invoice details"); // Handle error
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Close modal
    setSelectedInvoice(null); // Clear selected invoice
  };

  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth={false} style={{ width: "1000px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Invoice History
        </Typography>
        <FormControl
          variant="outlined"
          style={{ marginTop: "16px", marginBottom: "16px", width: "200px" }}
        >
          <InputLabel>Rows per page</InputLabel>
          <Select
            value={invoicesPerPage}
            onChange={(e) => setInvoicesPerPage(e.target.value)}
            label="Rows per page"
          >
            <MenuItem value={9}>9</MenuItem>
            <MenuItem value={18}>18</MenuItem>
            <MenuItem value={27}>27</MenuItem>
          </Select>
        </FormControl>
        <Grid container spacing={1}>
          {invoices.map((invoice) => (
            <Grid item xs={12} sm={6} md={4} key={invoice.invoice_id}>
              <Card
                style={{
                  height: "200px",
                  padding: "16px",
                  boxSizing: "border-box",
                  cursor: "pointer", // Add a pointer cursor
                  transition: "transform 0.2s", // Smooth transition
                }}
                onClick={() => handleCardClick(invoice.invoice_id)} // Call on click
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                } // Hover effect
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                } // Reset effect
              >
                <CardContent>
                  <Typography variant="h5" component="div">
                    Invoice No. {invoice.invoice_id.substring(0, 8)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tanggal:{" "}
                    {new Date(invoice.created_timestamp).toLocaleDateString(
                      "en-GB"
                    )}
                  </Typography>
                  <Typography color="text.secondary">
                    Nama Pelanggan: {invoice.customer_name}
                  </Typography>
                  <Typography color="text.secondary">
                    Sold by: {invoice.sales_name}
                  </Typography>
                  <Typography color="text.secondary">
                    Payment Type: {invoice.payment_type}
                  </Typography>
                  <Typography variant="h6" style={{ fontWeight: "bold" }}>
                    Total Harga: Rp.{" "}
                    {invoice.ProductsSolds.reduce(
                      (sum, item) => sum + item.total,
                      0
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Pagination Controls */}
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
          >
            &lt; Prev
          </Button>
          <Typography>{`Page ${currentPage} of ${Math.ceil(
            totalInvoices / invoicesPerPage
          )}`}</Typography>
          <Button
            onClick={() => handlePageChange("next")}
            disabled={currentPage >= Math.ceil(totalInvoices / invoicesPerPage)}
          >
            Next &gt;
          </Button>
        </div>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackOpen}
          autoHideDuration={6000}
          onClose={() => setSnackOpen(false)}
        >
          <MuiAlert
            onClose={() => setSnackOpen(false)}
            severity="error"
            sx={{ width: "100%" }}
          >
            {successMessage}
          </MuiAlert>
        </Snackbar>

        {/* Modal for Invoice Details */}
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={modalOpen}>
            <Box
              style={{
                padding: 20,
                outline: "none",
                backgroundColor: "white",
                margin: "auto",
                maxWidth: 500,
              }}
            >
              <Typography variant="h6">Invoice Details</Typography>
              <Typography>ID: {selectedInvoice?.invoice_id}</Typography>
              <Typography>
                Nama Pembeli: {selectedInvoice?.customer_name}
              </Typography>
              <Typography>Nama Sales: {selectedInvoice?.sales_name}</Typography>
              <Typography>
                Tanggal Transaksi:{" "}
                {new Date(selectedInvoice?.transaction_time).toLocaleDateString(
                  "en-GB"
                )}
              </Typography>
              <Typography>
                Payment Type: {selectedInvoice?.payment_type}
              </Typography>
              <Typography variant="h6" style={{ marginTop: 20 }}>
                Items:
              </Typography>
              {selectedInvoice?.items.map((item, index) => (
                <Typography key={index}>
                  {`${item.product_name} - Rp. ${item.unit_price} x ${
                    item.quantity
                  } = Rp. ${item.unit_price * item.quantity}`}
                </Typography>
              ))}
              <Typography variant="h6" style={{ marginTop: 20 }}>
                Total Harga: Rp. {selectedInvoice?.total_harga}
              </Typography>
            </Box>
          </Fade>
        </Modal>
      </Container>
    </Box>
  );
};

export default InvoiceHistory;
