const express = require("express");
const path = require("path");
const app = express();

// Render provides port via process.env.PORT
const PORT = process.env.PORT || 3000;

// --------------------
// Serve static files
// --------------------
app.use(express.static(path.join(__dirname, "public")));

// --------------------
// API endpoints for JSON data
// --------------------

// Paper 2 (existing app)
app.get("/api/data", (req, res) => {
  res.sendFile(path.join(__dirname, "data.json"));
});

// Paper 1 (new data)
app.get("/api/data1", (req, res) => {
  res.sendFile(path.join(__dirname, "data1.json"));
});

// --------------------
// Catch-all route for SPA (index.html)
// --------------------
// Correct wildcard syntax for Express 4+ and path-to-regexp
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// --------------------
// Start the server
// --------------------
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
