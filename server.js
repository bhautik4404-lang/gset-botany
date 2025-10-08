const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 10000;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// API endpoint for Paper data
app.get("/api/:paper", (req, res) => {
  const paper = req.params.paper; // paper1 or paper2
  const filePath = path.join(__dirname, `${paper}.json`);

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) return res.status(404).json({ error: "Paper not found" });

    try {
      res.json(JSON.parse(data));
    } catch (e) {
      res.status(500).json({ error: "Invalid JSON format" });
    }
  });
});

// SPA support
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
