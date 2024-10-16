import React, { useEffect, useState } from "react";
import {
  TextField,
  Autocomplete,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Grid,
  Container,
  Skeleton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const InvoiceForm = () => {
  const [customerName, setCustomerName] = useState("");
  const [salesPersonName, setSalesPersonName] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [paymentType, setPaymentType] = useState("cash");
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [addedProducts, setAddedProducts] = useState([]);

  const [errorFields, setErrorFields] = useState({
    customerName: false,
    salesPersonName: false,
    paymentType: false,
    products: false,
  });

  const [loading, setLoading] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/products/getProducts"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const validateFields = () => {
    const errors = {
      customerName: !customerName,
      salesPersonName: !salesPersonName,
      paymentType: !paymentType,
      products: addedProducts.length === 0,
    };

    setErrorFields(errors);

    // Return specific error messages
    if (errors.customerName) {
      return { valid: false, message: "Customer Name is required." };
    }
    if (errors.salesPersonName) {
      return { valid: false, message: "Sales Person Name is required." };
    }
    if (errors.paymentType) {
      return { valid: false, message: "Payment Type is required." };
    }
    if (errors.products) {
      return { valid: false, message: "Please add at least one product." };
    }

    return { valid: true };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate
    const validation = validateFields();
    if (!validation.valid) {
      setSuccessMessage(validation.message);
      setSnackOpen(true);
      return;
    }

    const invoiceData = {
      customer_name: customerName,
      sales_name: salesPersonName,
      payment_type: paymentType,
      notes: notes,
      products: addedProducts.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
      date: date,
    };

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/invoices/postInvoice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invoiceData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to send invoice");
      }
      setSuccessMessage("Invoice submitted successfully!");
    } catch (error) {
      console.log("Error posting invoice:", error);
      setSuccessMessage("Invoice submission failed.");
    } finally {
      setLoading(false);
      setSnackOpen(true);
      resetForm();
    }
  };

  const resetForm = () => {
    setCustomerName("");
    setSalesPersonName("");
    setNotes("");
    setDate("");
    setPaymentType("cash");
    setAddedProducts([]);
    setErrorFields({
      customerName: false,
      salesPersonName: false,
      paymentType: false,
      products: false,
    });
  };

  const handleProductChange = (event, value) => {
    if (value) {
      const existingProductIndex = addedProducts.findIndex(
        (item) => item.product_id === value.product_id
      );

      if (existingProductIndex !== -1) {
        // If the product already exists, update its quantity
        const newAddedProducts = [...addedProducts];
        newAddedProducts[existingProductIndex].quantity += quantity; // Increment the existing quantity
        setAddedProducts(newAddedProducts);
      } else {
        // If the product doesn't exist, create a new entry
        const newProduct = {
          product: value,
          quantity,
          product_id: value.product_id,
        };
        setAddedProducts((prev) => [newProduct, ...prev]);
      }

      // Reset the quantity to 1 after adding or updating
      setQuantity(1);
      event.target.value = ""; // Clear the input
    }
  };

  const handleQuantityChange = (index, qty) => {
    const newQuantity = Math.max(
      0,
      Math.min(qty, addedProducts[index].product.stock)
    ); // Perubahan untuk menentukan quantity

    if (newQuantity === 0) {
      // Jika quantity 0, hapus produk dari daftar
      const newAddedProducts = addedProducts.filter((_, i) => i !== index);
      setAddedProducts(newAddedProducts);
    } else {
      const newAddedProducts = [...addedProducts];
      newAddedProducts[index].quantity = newQuantity; // Tetapkan nilai quantity baru
      setAddedProducts(newAddedProducts);
    }
  };

  const calculateTotalAmount = () => {
    return addedProducts.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
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
        <Typography
          variant="h4"
          align="center"
          style={{ marginBottom: "30px", marginTop: "10px" }}
          gutterBottom
        >
          Buat Invoice
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} style={{ paddingRight: "8px" }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nama Pelanggan"
                    variant="outlined"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    error={errorFields.customerName}
                    helperText={errorFields.customerName ? "Please Input" : ""}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nama Sales"
                    variant="outlined"
                    value={salesPersonName}
                    onChange={(e) => setSalesPersonName(e.target.value)}
                    required
                    error={errorFields.salesPersonName}
                    helperText={
                      errorFields.salesPersonName ? "Please Input" : ""
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <TextField
                    type="date"
                    variant="outlined"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    style={{ flexGrow: 1 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={errorFields.paymentType}
                  >
                    <InputLabel>Payment Type</InputLabel>
                    <Select
                      value={paymentType}
                      onChange={(e) => setPaymentType(e.target.value)}
                      label="Payment Type"
                    >
                      <MenuItem value="cash">Cash</MenuItem>
                      <MenuItem value="credit">Credit</MenuItem>
                      <MenuItem value="others">Others</MenuItem>
                    </Select>
                    {errorFields.paymentType && (
                      <Typography variant="caption" color="red">
                        Please select a payment type.
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Catatan (Opsional)"
                    variant="outlined"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    options={products}
                    getOptionLabel={(option) => option.product_name}
                    onChange={handleProductChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Produk"
                        variant="outlined"
                        error={errorFields.products}
                        helperText={
                          errorFields.products
                            ? "Please add at least one product."
                            : ""
                        }
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </form>
          </Grid>
          <Grid item xs={12} md={6} style={{ paddingLeft: "8px" }}>
            <Box
              style={{
                maxHeight: "395px",
                overflowY: "auto",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                padding: "8px",
                paddingTop: "1px",
              }}
            >
              {addedProducts.length > 0 ? (
                addedProducts.map((item, index) => (
                  <Card
                    key={index}
                    style={{
                      display: "flex",
                      marginTop: "10px",
                      padding: "10px",
                      width: "100%", // Memastikan Card mengikuti lebar maksimum
                      maxHeight: "100px",
                      flexShrink: 0,
                    }}
                  >
                    <CardMedia
                      style={{
                        width: "60px",
                        height: "60px",
                        marginRight: "16px",
                      }}
                    >
                      <Skeleton variant="rectangular" width={75} height={75} />
                    </CardMedia>
                    <CardContent
                      style={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        padding: "8px",
                        paddingTop: "0px",
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        {item.product.product_name}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        Harga: Rp. {item.product.price}
                      </Typography>
                      <Typography variant="body2">
                        Stok: {item.product.stock}
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{ fontWeight: "bold", marginTop: "5px" }}
                      >
                        Total: Rp. {item.product.price * item.quantity}
                      </Typography>
                    </CardContent>
                    <Box
                      display="flex"
                      alignItems="center"
                      style={{ marginLeft: "auto" }}
                    >
                      <Typography style={{ marginRight: "8px" }}>
                        Qty:
                      </Typography>
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(index, e.target.value)
                        }
                        InputProps={{
                          inputProps: {
                            // Mencegah quantity menjadi 0
                            max: item.product.stock,
                          },
                          style: { width: "70px" },
                        }}
                      />
                    </Box>
                  </Card>
                ))
              ) : (
                <Typography variant="body1" style={{ margin: "8px" }}>
                  Tidak ada produk yang ditambahkan
                </Typography>
              )}
            </Box>

            <Grid
              item
              xs={12}
              style={{
                marginTop: "16px",
                textAlign: "right",
                width: "100%",
                paddingRight: "8px",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Total Harga: Rp. {calculateTotalAmount()}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Mengirim..." : "Kirim Invoice"}
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={() => setSnackOpen(false)}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity={successMessage.includes("success") ? "success" : "error"}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InvoiceForm;
