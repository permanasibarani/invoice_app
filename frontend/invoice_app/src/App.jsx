import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import InvoiceForm from "./components/InvoiceForm"; // Pastikan path ini sesuai
import InvoiceHistory from "./components/InvoiceHistory"; // Pastikan path ini sesuai
import Report from "./components/Report";
import { Button } from "@mui/material";

function App() {
  const [activeLink, setActiveLink] = useState("/create-invoice");

  return (
    <Router>
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "30px 0 0",
        }}
      >
        <Link to="/create-invoice" style={{ marginRight: "15px" }}>
          <Button
            variant="contained"
            style={{
              backgroundColor:
                activeLink === "/create-invoice" ? "#8360c3" : "white",
              color: activeLink === "/create-invoice" ? "white" : "#8360c3",
            }}
            onClick={() => setActiveLink("/create-invoice")}
          >
            Buat Invoice
          </Button>
        </Link>
        <Link to="/invoice-history" style={{ marginRight: "15px" }}>
          <Button
            variant="contained"
            style={{
              backgroundColor:
                activeLink === "/invoice-history" ? "#8360c3" : "white",
              color: activeLink === "/invoice-history" ? "white" : "#8360c3",
            }}
            onClick={() => setActiveLink("/invoice-history")}
          >
            Invoice History
          </Button>
        </Link>
        <Link to="/report">
          <Button
            variant="contained"
            style={{
              backgroundColor: activeLink === "/report" ? "#8360c3" : "white",
              color: activeLink === "/report" ? "white" : "#8360c3",
            }}
            onClick={() => setActiveLink("/report")}
          >
            Report
          </Button>
        </Link>
      </nav>
      <Routes>
        <Route path="/create-invoice" element={<InvoiceForm />} />
        <Route path="/invoice-history" element={<InvoiceHistory />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;
