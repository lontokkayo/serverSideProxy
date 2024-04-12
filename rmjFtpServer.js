const FtpSrv = require('ftp-srv');
const express = require('express');
const bodyParser = require('body-parser');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
// require('dotenv').config();
// FTP Server Setup
const ftpHostname = '0.0.0.0';
const ftpPort = 21;
// const ftpPort = 7001;
const ftpRoot = path.join(__dirname, 'ftpFolder');
const passivePorts = {
    min: 10000,
    max: 10100
};
// HTTP Server Setup
const httpPort = 7002; // HTTP server port
const app = express();

app.use(bodyParser.json());
app.use(cors());

if (!fs.existsSync(ftpRoot)) {
    fs.mkdirSync(ftpRoot, { recursive: true });
}

const USERNAME = 'jackall';
const PASSWORD = 'U2FsdGVkX18WCFA/fjC/fB6DMhtOOIL/xeVF2tD2b7c=';

const ftpServer = new FtpSrv({
    url: `ftp://${ftpHostname}:${ftpPort}`, // Ensure including the port here
    pasv_url: '34.97.28.40', // This needs to be reachable from client machines
    pasv_min: passivePorts.min,
    pasv_max: passivePorts.max,
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
const csvSalesInfoFilePath = path.join(ftpRoot, 'sales_info.csv');
const csvClientsFilePath = path.join(ftpRoot, 'clients.csv');

const csvSalesInfoWriter = createObjectCsvWriter({
    path: csvSalesInfoFilePath,
    header: [
        { id: 'id', title: 'id' },
        { id: 'stock_system_id', title: 'stock_system_id' },
        { id: 'sales_date', title: 'sales_date' },
        { id: 'fob', title: 'fob' },
        { id: 'freight', title: 'freight' },
        { id: 'insurance', title: 'insurance' },
        { id: 'inspection', title: 'inspection' },
        { id: 'cost_name1', title: 'cost_name1' },
        { id: 'cost1', title: 'cost1' },
        { id: 'cost_name2', title: 'cost_name2' },
        { id: 'cost2', title: 'cost2' },
        { id: 'cost_name3', title: 'cost_name3' },
        { id: 'cost3', title: 'cost3' },
        { id: 'cost_name4', title: 'cost_name4' },
        { id: 'cost4', title: 'cost4' },
        { id: 'cost_name5', title: 'cost_name5' },
        { id: 'cost5', title: 'cost5' },
        { id: 'coupon_discount', title: 'coupon_discount' },
        { id: 'price_discount', title: 'price_discount' },
        { id: 'subtotal', title: 'subtotal' },
        { id: 'clients', title: 'clients' }
    ],
    append: true,
    alwaysQuote: true
});

const csvClientsWriter = createObjectCsvWriter({
    path: csvSalesInfoFilePath,
    header: [
        { id: 'id', title: 'id' },
        { id: 'client_name', title: 'client_name' },
        { id: 'address', title: 'address' },
        { id: 'phone', title: 'phone' },
        { id: 'email', title: 'email' },
        { id: 'country_name', title: 'country_name' },
        { id: 'note', title: 'note' },
    ],
    append: true,
    alwaysQuote: true
});
//Write Contents clients.csv
app.post('/append-csv-clients', async (req, res) => {
    // Extract credentials; in a real scenario, consider using headers or more secure methods
    const { username, password, data } = req.body;

    // Simple authentication check
    if (username !== USERNAME || password !== PASSWORD) {
        return res.status(401).send('Authentication failed: Invalid username or password');
    }

    try {
        // Assuming the actual CSV data is contained in a 'data' field in the request body
        await csvClientsWriter.writeRecords([data]);
        res.send('Data appended successfully to CSV.');
    } catch (error) {
        console.error('Failed to append data to CSV:', error);
        res.status(500).send('Failed to append data to CSV.');
    }
});

//Write Contents sales_info.csv
app.post('/append-csv-sales-info', async (req, res) => {
    // Extract credentials; in a real scenario, consider using headers or more secure methods
    const { username, password, data } = req.body;

    // Simple authentication check
    if (username !== USERNAME || password !== PASSWORD) {
        return res.status(401).send('Authentication failed: Invalid username or password');
    }

    try {
        // Assuming the actual CSV data is contained in a 'data' field in the request body
        await csvSalesInfoWriter.writeRecords([data]);
        res.send('Data appended successfully to CSV.');
    } catch (error) {
        console.error('Failed to append data to CSV:', error);
        res.status(500).send('Failed to append data to CSV.');
    }
});


//Reset CSV Contents sales_info.csv
app.post('/reset-csv-sales-info', async (req, res) => {
    // Extract credentials; in a real scenario, consider using headers or more secure methods
    const { username, password } = req.body;

    // Simple authentication check
    if (username !== USERNAME || password !== PASSWORD) {
        return res.status(401).send('Authentication failed: Invalid username or password');
    }

    // Manually write the headers to the file
    const headers = 'id,stock_system_id,sales_date,fob,freight,insurance,inspection,cost_name1,cost1,cost_name2,cost2,cost_name3,cost3,cost_name4,cost4,cost_name5,cost5,coupon_discount,price_discount,subtotal,clients\n';

    try {
        fs.writeFile(csvSalesInfoFilePath, headers, (err) => {
            if (err) {
                console.error('Failed to reset CSV:', err);
                return res.status(500).send('Failed to reset CSV.');
            }
            res.send('CSV contents cleared, except for column titles.');
        });
    } catch (error) {
        console.error('Failed to manually reset CSV:', error);
        res.status(500).send('Failed to reset CSV.');
    }
});

//Reset CSV Contents clients.csv
app.post('/reset-csv-clients', async (req, res) => {
    // Extract credentials; in a real scenario, consider using headers or more secure methods
    const { username, password } = req.body;

    // Simple authentication check
    if (username !== USERNAME || password !== PASSWORD) {
        return res.status(401).send('Authentication failed: Invalid username or password');
    }

    // Manually write the headers to the file
    const headers = 'id,client_name,address,phone,email,country_name,note\n';

    try {
        fs.writeFile(csvClientsFilePath, headers, (err) => {
            if (err) {
                console.error('Failed to reset CSV:', err);
                return res.status(500).send('Failed to reset CSV.');
            }
            res.send('CSV contents cleared, except for column titles.');
        });
    } catch (error) {
        console.error('Failed to manually reset CSV:', error);
        res.status(500).send('Failed to reset CSV.');
    }
});


app.listen(httpPort, () => {
    console.log(`HTTP Server for CSV append running at http://localhost:${httpPort}`);
});
