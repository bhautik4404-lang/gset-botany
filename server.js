// server.js
const express = require("express");
const path = require("path");
const app = express();

// ✅ Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// ✅ Serve both JSON data files (Paper 1 & Paper 2)
app.get("/data.json", (req, res) => {
  res.sendFile(path.join(__dirname, "data.json"));
});

app.get("/data1.json", (req, res) => {
  res.sendFile(path.join(__dirname, "data1.json"));
});

// ✅ Default route → serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
