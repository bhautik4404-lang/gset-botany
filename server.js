const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 10000;

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, "public")));

// API route for Paper 1
app.get("/api/paper1", (req, res) => {
  const filePath = path.join(__dirname, "data1.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to load Paper 1 data" });
    res.json(JSON.parse(data));
  });
});

// API route for Paper 2 (existing)
app.get("/api/paper2", (req, res) => {
  const filePath = path.join(__dirname, "data.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to load Paper 2 data" });
    res.json(JSON.parse(data));
  });
});

// Catch-all route for SPA (fixed)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
