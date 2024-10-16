import React, { useEffect, useState } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  Snackbar,
  TextField,
  Box,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Report = () => {
  const [selectedDate, setSelectedDate] = useState(""); // State for selected date or year
  const [salesData, setSalesData] = useState([]); // State for fetched sales data
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [snackOpen, setSnackOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchType, setSearchType] = useState("date"); // State for selected search type

  const options = {
    theme: "light2",
    animationEnabled: true,
    zoomEnabled: true,
    title: {
      text: "Sales Graph",
    },
    data: [
      {
        type: "area",
        dataPoints: salesData, // Use fetched dataPoints
      },
    ],
  };

  // Fetch sales data on button click
  const handleGenerate = async () => {
    setLoading(true); // Show loading
    try {
      let url;
      if (searchType === "date") {
        url = `http://localhost:5000/api/invoices/getSalesByDate?date=${selectedDate}`;
      } else if (searchType === "month") {
        const month = selectedDate.substring(5, 7); // Get month from date string
        const year = selectedDate.substring(0, 4); // Get year from date string
        url = `http://localhost:5000/api/invoices/getSalesByMonth?month=${month}&year=${year}`;
      } else if (searchType === "year") {
        const year = selectedDate; // Get year from the text input
        url = `http://localhost:5000/api/invoices/getSalesByYear?year=${year}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch sales data");
      }
      const data = await response.json();
      // Format data as required for the chart
      console.log(searchType);
      let formattedData;
      if (searchType === "year") {
        formattedData = data.map((item) => ({
          label: item.x, // Use 'label' for year search
          y: item.y, // Keep y value as it is
        }));
      } else {
        formattedData = data.map((item) => ({
          x:
            searchType === "month" || searchType === "year"
              ? item.x // Directly use item.x for month and year
              : new Date(item.x), // Convert x to Date object if searching by date
          y: item.y,
        }));
      }
      setSalesData(formattedData); // Update sales data for chart
      setSuccessMessage("Data fetched successfully!"); // Set success message
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setSuccessMessage("Failed to fetch sales data."); // Set error message
    } finally {
      setLoading(false); // Hide loading
      setSnackOpen(true); // Show notification
    }
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
      <Container
        maxWidth={false}
        style={{ width: "1000px", marginTop: "30px", marginBottom: "100px" }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          marginBottom="16px"
        >
          <Typography variant="h6">Search by:</Typography>
          <FormControl component="fieldset">
            <RadioGroup
              row
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value);
                setSelectedDate(""); // Reset date when changing the search type
              }}
            >
              <FormControlLabel
                value="date"
                control={<Radio />}
                label="By Date"
              />
              <FormControlLabel
                value="month"
                control={<Radio />}
                label="By Month"
              />
              <FormControlLabel
                value="year"
                control={<Radio />}
                label="By Year"
              />
            </RadioGroup>
          </FormControl>

          <TextField
            type={
              searchType === "year"
                ? "text"
                : searchType === "month"
                ? "month"
                : "date"
            }
            variant="outlined"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ marginBottom: "16px", width: "200px" }}
            label={`Search by ${searchType}`}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Loading..." : "Generate"}
          </Button>
        </Box>
        <div style={{ marginTop: "30px" }}>
          <CanvasJSChart options={options} />
        </div>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={() => setSnackOpen(false)}
      >
        <MuiAlert
          onClose={() => setSnackOpen(false)}
          severity={successMessage.includes("success") ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {successMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default Report;
