const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");

// Function to ensure the local directory exists
function ensureLocalDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

async function downloadFiles(ftpDetails, filesToDownload, remoteDirPath, localDirPath) {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        // Ensure the local directory exists or create it
        ensureLocalDir(localDirPath);

        await client.access(ftpDetails);
        await client.cd(remoteDirPath); // Navigate to the remote directory

        // Download specific files
        for (let file of filesToDownload) {
            const localFilePath = path.join(localDirPath, file);
            const remoteFilePath = path.join(remoteDirPath, file);
            await client.downloadTo(localFilePath, remoteFilePath);
            console.log(`Downloaded ${remoteFilePath} to ${localFilePath}`);
        }
    } catch (error) {
        console.error("Failed to download files:", error);
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

const ftpDetails = {
    host: "rmj-api.duckdns.org",
    // port: 990,
    user: "jackall",
    password: 'U2FsdGVkX18WCFA/fjC/fB6DMhtOOIL/xeVF2tD2b7c=',
    secure: false,
};


// const ftpDetails = {
//     host: "test.rebex.net",
//     // port: 7001, // Match the server's port
//     user: "anonymous",
//     password: "anonymous",
//     secure: false, // Keep it false since the server is set up without encryption
// };

// const ftpDetails = {
//     url: "control.realmotor.jp",
//     // port: 7001, // Match the server's port
//     user: "rmj-jackall",
//     password: "od7hIcWkz3",
//     secure: false, // Keep it false since the server is set up without encryptio n
// };

const remoteDirPath = "/"; // Update to the correct path
const localDirPath = "./downloaded"; // This directory will be created if it doesn't exist
const filesToDownload = ["sales_info.csv", "clients.csv"];

downloadFiles(ftpDetails, filesToDownload, remoteDirPath, localDirPath);
