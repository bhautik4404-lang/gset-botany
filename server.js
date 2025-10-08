const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 10000;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// APIs for Paper 1 and Paper 2
app.get("/api/paper1", (req, res) => {
  res.sendFile(path.join(__dirname, "data1.json"));
});

app.get("/api/paper2", (req, res) => {
  res.sendFile(path.join(__dirname, "data.json"));
});

// Safe wildcard route for frontend
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
