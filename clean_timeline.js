const fs = require("fs");

let html = fs.readFileSync("index.html", "utf8");

// Remove border-none from timeline items
html = html.replace(
  /<div class="timeline-item border-none reveal-item">/g,
  '<div class="timeline-item reveal-item">',
);
html = html.replace(
  /<div class="timeline-item border-none">/g,
  '<div class="timeline-item">',
);

fs.writeFileSync("index.html", html);
console.log("HTML timeline items cleaned up successfully");
