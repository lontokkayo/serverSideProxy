const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");

// Function to ensure the local directory exists
function ensureLocalDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

async function downloadDirectory(ftpDetails, remoteDirPath, localDirPath) {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        // Ensure the local directory exists or create it
        ensureLocalDir(localDirPath);

        await client.access(ftpDetails);
        await client.cd(remoteDirPath); // Navigate to the remote directory

        // Download the entire directory to the local directory
        await client.downloadToDir(localDirPath, remoteDirPath);
        console.log(`Downloaded contents of ${remoteDirPath} to ${localDirPath}`);
    } catch (error) {
        console.error("Failed to download directory:", error);
    } finally {
        client.close();
    }
}

// const ftpDetails = {
//     host: "127.0.0.1",
//     // port: 7001,
//     user: "jackall",
//     password: 'U2FsdGVkX18WCFA/fjC/fB6DMhtOOIL/xeVF2tD2b7c=',
//     secure: false,
// };

// const ftpDetails = {
//     host: "test.rebex.net",
//     // port: 7001, // Match the server's port
//     user: "anonymous",
//     password: "anonymous",
//     secure: false, // Keep it false since the server is set up without encryption
// };

const ftpDetails = {
    url: "control.realmotor.jp",
    // port: 7001, // Match the server's port
    user: "rmj-jackall'",
    password: "Y7bwoHzY2J",
    secure: false, // Keep it false since the server is set up without encryption
};

const remoteDirPath = "/"; // Adjust as needed
const localDirPath = "./downloaded"; // This directory will be created if it doesn't exist

downloadDirectory(ftpDetails, remoteDirPath, localDirPath);
