const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the Angular app
const distPath = path.join(__dirname, "dist", "vhodly-app", "browser");
app.use(express.static(distPath));

// Handle Angular routing - return index.html for all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Get port from environment variable or use default
const PORT = process.env.PORT || 4200;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Serving files from: ${distPath}`);
});
