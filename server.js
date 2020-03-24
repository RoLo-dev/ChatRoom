const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const server = http.createServer(app);

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));