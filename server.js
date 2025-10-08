const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// API for Paper 1
app.get("/api/paper1", (req, res) => {
  res.sendFile(path.join(__dirname, "data1.json"));
});

// API for Paper 2
app.get("/api/paper2", (req, res) => {
  res.sendFile(path.join(__dirname, "data.json"));
});

// SPA wildcard route for React/Vanilla JS routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
