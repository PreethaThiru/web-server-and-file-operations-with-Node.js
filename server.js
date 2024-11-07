const http = require('http');
const fs = require('fs');
const path = require('path');

// Handle incoming requests
const requestHandler = (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // Serve the CSS file
  if (pathname === '/style.css') {
    res.writeHead(200, { 'Content-Type': 'text/css' });
    fs.createReadStream(path.join(__dirname, 'style.css')).pipe(res);
    return;
  }

  // Serve the main HTML page
  if (pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(path.join(__dirname, 'index.html')).pipe(res);
    return;
  }

  // Handle reading from the file
  if (pathname === '/read') {
    fs.readFile('example.txt', 'utf8', (err, data) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(`
        <div class="container">
          <h2>File Contents</h2>
          <p>${err || !data ? 'No data available in the file.' : data}</p>
          <a href="/">Back to Home</a>
        </div>
      `);
      res.end();
    });
    return;
  }

  // Handle writing to the file
  if (pathname === '/write') {
    const data = parsedUrl.searchParams.get('data');
    fs.writeFile('example.txt', data, (err) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(`
        <div class="container">
          <h2>${err ? 'Error writing to file.' : 'Data written successfully!'}</h2>
          <a href="/">Back to Home</a>
        </div>
      `);
      res.end();
    });
    return;
  }

  // Handle editing the file
  if (pathname === '/edit') {
    const newData = parsedUrl.searchParams.get('newData');
    fs.writeFile('example.txt', newData, (err) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(`
        <div class="container">
          <h2>${err ? 'Error editing file.' : 'File edited successfully!'}</h2>
          <a href="/">Back to Home</a>
        </div>
      `);
      res.end();
    });
    return;
  }

  // Handle deleting the file content
  if (pathname === '/delete') {
    fs.readFile('example.txt', 'utf8', (err, data) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      if (err || !data) {
        // No data to delete
        res.write(`
          <div class="container">
            <h2>No data to delete.</h2>
            <a href="/">Back to Home</a>
          </div>
        `);
        res.end();
      } else {
        // Data exists, proceed to clear file contents
        fs.writeFile('example.txt', '', (writeErr) => {
          res.write(`
            <div class="container">
              <h2>${writeErr ? 'Error deleting file content.' : 'File content deleted successfully!'}</h2>
              <a href="/">Back to Home</a>
            </div>
          `);
          res.end();  // Ensure res.end() only executes after file content is cleared
        });
      }
    });
    return;
  }

  // Handle 404 - Not Found
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.write(`<div class="container"><h2>404 - Not Found</h2></div>`);
  res.end();
};

// Create HTTP server and listen on port 3001
const server = http.createServer(requestHandler);
server.listen(3001, () => {
  console.log('Server running at http://localhost:3001/');
});


