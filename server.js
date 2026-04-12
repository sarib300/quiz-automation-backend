const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Test route
app.post("/api/create-form", async (req, res) => {
  try {
    const { title, questions, email, phones } = req.body;

    console.log("========== NEW REQUEST ==========");
    console.log("Title:", title);
    console.log("Instructor Email:", email);
    console.log("Phones:", phones);
    console.log("Questions Count:", questions.length);
    console.log("================================");

    // Send data to Google Apps Script
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzh2AzLcWx_lU_OOMIJ2tc-OJFX7C6SF8pr80z-Eag6ChKY8IUhrLWRvdcJpNHLz2k0Vw/exec";

    const fetchResponse = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, questions, email, phones }),
    });

    const result = await fetchResponse.json();
    res.json(result);

  } catch (error) {
    console.error("Error creating form:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Test POST route
app.post("/api/create-form", async (req, res) => {
  try {
    const payload = req.body;

    console.log("Sending data to Google Apps Script...");

    const response = await fetch(process.env.GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    res.json(result);

  } catch (error) {
    console.error("Error creating Google Form:", error);
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});