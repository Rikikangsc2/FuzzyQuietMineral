const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

const DATA_FILE = 'global.json';

const readData = () => {
  if (fs.existsSync(DATA_FILE)) {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  }
  return {};
};

const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
};

app.get('/write/:userId', (req, res) => {
  const { userId } = req.params;
  const json = req.query.json;

  if (!json) {
    return res.status(400).send('Missing json query parameter');
  }

  const data = readData();
  data[userId] = JSON.parse(json);
  writeData(data);

  res.send(`Data for user ${userId} has been written`);
});

app.get('/read/:userId', (req, res) => {
  const { userId } = req.params;
  const data = readData();

  if (data[userId]) {
    res.json(data[userId]);
  } else {
    res.status(404).send(`No data found for user ${userId}`);
  }
});

app.get('/delete/:userId', (req, res) => {
  const { userId } = req.params;
  const data = readData();

  if (data[userId]) {
    delete data[userId];
    writeData(data);
    res.send(`Data for user ${userId} has been deleted`);
  } else {
    res.status(404).send(`No data found for user ${userId}`);
  }
});

app.get('/', (req, res) => {
  res.send(`
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <title>API Documentation</title>
  </head>
  <body>
    <div class="container mt-5">
      <h1 class="mb-4">API Documentation</h1>
      <h2>Endpoints</h2>
      <ul>
        <li><code>GET /write/:userId?json=</code></li>
        <li><code>GET /read/:userId</code></li>
        <li><code>GET /delete/:userId</code></li>
        <li><code>GET /</code></li>
      </ul>
      <h2>Examples</h2>
      <h3>Python</h3>
      <pre><code>
import requests

# Write data
response = requests.get('http://localhost:3000/write/user1?json={"key": "value"}')
print(response.text)

# Read data
response = requests.get('http://localhost:3000/read/user1')
print(response.json())

# Delete data
response = requests.get('http://localhost:3000/delete/user1')
print(response.text)
      </code></pre>
      <h3>Node.js with Axios</h3>
      <pre><code>
const axios = require('axios');

axios.get('http://localhost:3000/write/user1', {
  params: {
    json: JSON.stringify({ key: 'value' })
  }
}).then(response => {
  console.log(response.data);
});

axios.get('http://localhost:3000/read/user1')
  .then(response => {
    console.log(response.data);
  });

axios.get('http://localhost:3000/delete/user1')
  .then(response => {
    console.log(response.data);
  });
      </code></pre>
      <h3>cURL</h3>
      <pre><code>
# Write data
curl "http://localhost:3000/write/user1?json={\"key\":\"value\"}"

# Read data
curl "http://localhost:3000/read/user1"

# Delete data
curl "http://localhost:3000/delete/user1"
      </code></pre>
    </div>
  </body>
</html>
  `);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});