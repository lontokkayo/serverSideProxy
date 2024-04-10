const FtpSrv = require('ftp-srv');
const path = require('path');
const fs = require('fs');

// Define the host and port for the FTP server
const hostname = '0.0.0.0';
const port = 7001;

// Define the root directory for the FTP server
const ftpRoot = path.join(__dirname, 'ftpFolder');

// Ensure the root directory exists
if (!fs.existsSync(ftpRoot)) {
    fs.mkdirSync(ftpRoot, { recursive: true });
}

// Define your desired username and password
const USERNAME = 'jackall';
const PASSWORD = 'U2FsdGVkX18WCFA/fjC/fB6DMhtOOIL/xeVF2tD2b7c=';

const ftpServer = new FtpSrv({
    url: `ftp://${hostname}:${port}`,
    pasv_url: hostname,
    anonymous: false, // Disable anonymous access
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

ftpServer.listen()
    .then(() => {
        console.log(`FTP Server running at ftp://${hostname}:${port}`);
    });