const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 5000;
const HOST = "0.0.0.0";
const PUBLIC_ROOT = __dirname;

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  // Add cache control headers to prevent caching
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  // Parse and normalize the URL to prevent directory traversal
  let requestPath;
  try {
    requestPath = decodeURIComponent(req.url.split("?")[0]);
  } catch (e) {
    // Malformed URL encoding - reject request
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end("<h1>400 - Bad Request</h1>", "utf-8");
    return;
  }

  // Normalize the path and build safe file path
  // Prepend '.' to prevent absolute path interpretation
  let filePath = path.normalize(path.join(PUBLIC_ROOT, "." + requestPath));

  // Security check: ensure the resolved path is within PUBLIC_ROOT
  // Use path.relative to check for directory boundary escape
  const relativePath = path.relative(PUBLIC_ROOT, filePath);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    res.writeHead(403, { "Content-Type": "text/html" });
    res.end("<h1>403 - Forbidden</h1>", "utf-8");
    return;
  }

  // Check if path is a directory first
  fs.stat(filePath, (statErr, stats) => {
    if (statErr) {
      if (statErr.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 - File Not Found</h1>", "utf-8");
        return;
      }
      res.writeHead(500);
      res.end("Server Error", "utf-8");
      return;
    }

    // If it's a directory, append index.html
    if (stats.isDirectory()) {
      filePath = path.join(filePath, "index.html");

      // Re-verify the path is still safe after appending index.html
      const relativePathAfterJoin = path.relative(PUBLIC_ROOT, filePath);
      if (
        relativePathAfterJoin.startsWith("..") ||
        path.isAbsolute(relativePathAfterJoin)
      ) {
        res.writeHead(403, { "Content-Type": "text/html" });
        res.end("<h1>403 - Forbidden</h1>", "utf-8");
        return;
      }
    }

    // Get the file extension
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || "application/octet-stream";

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === "ENOENT") {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end("<h1>404 - File Not Found</h1>", "utf-8");
        } else {
          res.writeHead(500);
          res.end(`Server Error: ${error.code}`, "utf-8");
        }
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content, "utf-8");
      }
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});
