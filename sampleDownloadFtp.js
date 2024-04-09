const express = require('express');
const ftp = require("basic-ftp");

const app = express();
const port = 3000;

async function downloadAllFromFTP(remoteDirectory) {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        await client.access({
            host: "control.realmotor.jp",
            user: "matsuoka",
            password: "kobayashi",
            secure: false // Set to true if you want to use FTPS
        });

        // Change to the specified directory where the files are stored
        await client.cd(remoteDirectory);
        const fileList = await client.list();
        const localDir = "./downloads";

        for (const file of fileList) {
            if (file.type === ftp.FileType.File) {
                const localFilePath = `${localDir}/${file.name}`;
                await client.downloadTo(localFilePath, file.name);
                console.log(`${file.name} has been downloaded successfully.`);
            }
        }
    } catch (error) {
        console.error("Failed to download files: ", error);
    }

    client.close();
}

// Adjusted for the specific directory
const remoteDirectory = "/vehicle_state";
downloadAllFromFTP(remoteDirectory);


app.get('/download-ftp', async (req, res) => {
    const remoteDirectory = "/home/linkage-date/ftp-public/";
    await downloadAllFromFTP(remoteDirectory);
    res.send("Download process initiated. Check server logs for progress.");
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
