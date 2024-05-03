const ftp = require("basic-ftp");
const path = require('path'); // Correctly declare the path module

async function uploadFile(ftpDetails, localFilePath, remoteFilePath) {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        await client.access({
            host: ftpDetails.host,
            port: ftpDetails.port,
            user: ftpDetails.user,
            password: ftpDetails.password,
            secure: ftpDetails.secure,
        });
        await client.uploadFrom(localFilePath, remoteFilePath);
        console.log(`Uploaded ${localFilePath} to ${remoteFilePath}`);
    } catch (error) {
        console.error("Failed to upload file:", error);
    }

    client.close();
}

const ftpDetails = {
    host: "127.0.0.1",
    port: 7001,
    user: "jackall",
    password: "U2FsdGVkX18WCFA/fjC/fB6DMhtOOIL/xeVF2tD2b7c=",
    secure: false,
};
// Define local paths for the files to upload
const localFile1Path = path.join(__dirname, 'emailServer.js');
const localFile2Path = path.join(__dirname, 'server.js');


// Upload files sequentially or concurrently based on your preference
async function uploadFiles() {
    await uploadFile(ftpDetails, localFile1Path, 'vehicle_state/emailServer.js');
}

uploadFiles().then(() => {
    console.log("Files uploaded successfully.");
}).catch(error => {
    console.error("An error occurred during the file uploads:", error);
});