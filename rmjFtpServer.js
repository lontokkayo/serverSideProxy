const FtpSrv = require('ftp-srv');
const express = require('express');
const bodyParser = require('body-parser');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');
const fs = require('fs');
// require('dotenv').config();
// FTP Server Setup
const ftpHostname = '0.0.0.0';
const ftpPort = 7001;
const ftpRoot = path.join(__dirname, 'ftpFolder');

// HTTP Server Setup
const httpPort = 7002; // HTTP server port
const app = express();
app.use(bodyParser.json());

if (!fs.existsSync(ftpRoot)) {
    fs.mkdirSync(ftpRoot, { recursive: true });
}

const USERNAME = 'jackall';
const PASSWORD = 'U2FsdGVkX18WCFA/fjC/fB6DMhtOOIL/xeVF2tD2b7c=';

const ftpServer = new FtpSrv({
    url: `ftp://${ftpHostname}:${ftpPort}`,
    pasv_url: ftpHostname,
    anonymous: false,
    root: ftpRoot,
});

ftpServer.on('login', ({ username, password }, resolve, reject) => {
    if (username === USERNAME && password === PASSWORD) {
        console.log("Authenticated successfully");
        resolve({ root: ftpRoot });
    } else {
        console.log("Authentication failed");
        reject(new Error('Invalid username or password'));
    }
});

ftpServer.listen().then(() => {
    console.log(`FTP Server running at ftp://${ftpHostname}:${ftpPort}`);
});

// CSV Append Feature
const csvFilePath = path.join(ftpRoot, 'sales_info.csv');

const csvWriter = createObjectCsvWriter({
    path: csvFilePath,
    header: [
        { id: 'column1', title: 'Column 1' },
        { id: 'column2', title: 'Column 2' },
        // Define additional columns as needed
    ],
    append: true,
});

app.post('/append-csv', async (req, res) => {
    // Extract credentials; in a real scenario, consider using headers or more secure methods
    const { username, password, data } = req.body;

    // Simple authentication check
    if (username !== USERNAME || password !== PASSWORD) {
        return res.status(401).send('Authentication failed: Invalid username or password');
    }

    try {
        // Assuming the actual CSV data is contained in a 'data' field in the request body
        await csvWriter.writeRecords([data]);
        res.send('Data appended successfully to CSV.');
    } catch (error) {
        console.error('Failed to append data to CSV:', error);
        res.status(500).send('Failed to append data to CSV.');
    }
});

app.listen(httpPort, () => {
    console.log(`HTTP Server for CSV append running at http://localhost:${httpPort}`);
});
