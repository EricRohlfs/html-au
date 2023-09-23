const http = require('http');
const querystring = require('querystring');
const url = require('url');

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // You can specify specific origins instead of '*'
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Add the allowed HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Add the allowed headers
  // CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(204); // No content for preflight requests
    res.end();
    return;
  }
  if (req.method === 'POST') {
    let body = '';

    // Read the data from the request
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        // Parse the POST data as JSON
        const postData = JSON.parse(body);

        // Check if the data has the expected keys
        //if (postData.firstname && postData.lastname) {
        if (postData) {
          postData.userid = '123456'
          const result = postData

          // Set the Content-Type header to indicate JSON response
          res.setHeader('Content-Type', 'application/json');

          // Send the JSON response
          res.end(JSON.stringify(result));
          return
        } else {
          // Data format is not as expected
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Invalid data format. Expected {firstname: "jane", lastname: "doe"}\n');
        }
      } catch (error) {
        // JSON parsing error
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Error parsing JSON data\n');
      }
    });
  } else if (req.method === 'GET') {
    const parsedUrl = url.parse(req.url, true);

    // Get query string parameters from the parsed URL
    const queryParams = parsedUrl.query;

    // Access individual query parameters
    const firstname = queryParams.firstname;
    const lastname = queryParams.lastname;
    //const userid = queryParams.userid;
    const userid = '99887711'

    // Do something with the parameters (e.g., send a JSON response)
    const responseData = {
      firstname: firstname,
      lastname: lastname,
      userid: userid
    };
    res.setHeader('Content-Type', 'application/json');

    // Send the JSON response
    res.end(JSON.stringify(responseData));

  } else {
  // Unsupported HTTP method
  res.writeHead(405, { 'Content-Type': 'text/plain' });
  res.end('Method not allowed\n');
}
});

const port = 8081; // You can change this to the port you want to use
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});