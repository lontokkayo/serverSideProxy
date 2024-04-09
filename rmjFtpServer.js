const express = require('express');
const basicAuth = require('express-basic-auth');
const firebaseAdmin = require('firebase-admin');
const archiver = require('archiver');
const serviceAccount = require('./samplermj-firebase-adminsdk-43mxb-3723a82c00.json');

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    storageBucket: "samplermj.appspot.com"
});

const bucket = firebaseAdmin.storage().bucket();
const app = express();

// Basic authentication
const myAuthorizer = (username, password) => {
    return basicAuth.safeCompare(username, 'rmj-jackall') && basicAuth.safeCompare(password, 'Y7bwoHzY2J');
};

app.use(basicAuth({
    authorizer: myAuthorizer,
    challenge: true,
    unauthorizedResponse: req => '401 Unauthorized'
}));

// Route to download all files in the specified folder
app.get('/vehicle_state', async (req, res) => {
    try {
        const [files] = await bucket.getFiles({ prefix: 'vehicle_state/' });

        if (files.length === 0) {
            return res.status(404).send('No files found in the specified folder.');
        }

        // Generate a timestamp-based name for the ZIP file
        const timestamp = new Date().toISOString().replace(/[\W_]+/g, '');
        const zipFileName = `${timestamp}.zip`;

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);

        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        archive.on('error', (err) => {
            throw err;
        });

        archive.pipe(res);

        files.forEach(file => {
            // Extract the file name after the 'vehicle_state/' prefix
            const fileName = file.name.replace('vehicle_state/', '');

            console.log(`Processing file: ${fileName}`);

            // Ensure the file name is not empty before appending it to the archive
            if (typeof fileName === 'string' && fileName.trim() !== '') {
                const stream = file.createReadStream();
                archive.append(stream, { name: fileName });
            } else {
                console.error(`Invalid file name encountered: ${file.name}`);
            }
        });

        // Finalize the archive, which will trigger the download
        archive.finalize();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing your request.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

