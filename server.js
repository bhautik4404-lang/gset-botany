const express = require("express");
const path = require("path");
const app = express();

// Render requires using process.env.PORT
const PORT = process.env.PORT || 10000;

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// API endpoint for Paper 1
app.get("/api/paper1", (req, res) => {
  res.sendFile(path.join(__dirname, "data1.json"));
});

// API endpoint for Paper 2
app.get("/api/paper2", (req, res) => {
  res.sendFile(path.join(__dirname, "data.json"));
});

// Catch-all route to serve index.html for any other path
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
