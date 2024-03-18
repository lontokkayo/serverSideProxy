const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');

// Path to your Firebase service account file
const serviceAccountPath = './samplermj-testreceiver-firebase-adminsdk-ytong-09460be72c.json';

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
    // Add other configuration variables like databaseURL, storageBucket if needed
});

// Get a Firestore instance
const db = admin.firestore();

const app = express();
const port = 7000;

app.use(cors({
    allowedHeaders: ['Content-Type', 'username', 'accessKey'],
    origin: '*' // Adjust this as needed for security
}));
// Initialize Firebase Admin


// // Middleware
app.use(bodyParser.json());


const validateCredentials = async (req, res, next) => {
    const username = req.headers.username || req.headers['username']; // Adjust based on actual use
    const accessKey = req.headers.accesskey || req.headers['accessKey']; // Adjust based on actual use
    if (!username || !accessKey) {
        return res.status(400).send({ message: 'Missing credentials' });
    }

    try {
        const userDoc = await db.collection('users').doc(username).get();
        if (!userDoc.exists) {
            return res.status(401).send({ message: 'User not found' });
        }

        const user = userDoc.data();
        if (username === user.username && accessKey === user.accessKey) {
            next(); // Credentials are valid, proceed to the next middleware or route handler
        } else {
            return res.status(401).send({ message: 'Invalid credentials', credentials: `${username}, ${accessKey}`, });
        }
    } catch (error) {
        return res.status(500).send({ message: 'Error verifying credentials', error: error.message });
    }
};

// Routes
app.post('/addVehicleData', validateCredentials, async (req, res) => {
    const { documentData, documentId } = req.body; // Extract documentData from request body
    try {
        // Use documentId as the Firestore document ID
        await db.collection('vehicleCollection').doc(`${documentId}`).set(documentData);
        res.status(200).send({ message: 'Document added successfully', id: documentId });
    } catch (error) {
        res.status(500).send({ message: 'Error adding document', error: error.message });
    }
});

app.post('/updateVehicleData', validateCredentials, async (req, res) => {
    const { documentData, documentId } = req.body;
    try {
        // Use the 'set' method with 'merge' set to true to update the document
        await db.collection('vehicleCollection').doc(`${documentId}`).set(documentData, { merge: true });
        res.status(200).send({ message: 'Document updated successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error updating document', error: error.message });
    }
});

app.post('/addCustomerData', validateCredentials, async (req, res) => {
    const { documentData, documentId } = req.body; // Extract documentData from request body
    try {
        // Use documentId as the Firestore document ID
        await db.collection('customerCollection').doc(`${documentId}`).set(documentData);
        res.status(200).send({ message: 'Document added successfully', id: documentId });
    } catch (error) {
        res.status(500).send({ message: 'Error adding document', error: error.message });
    }
});

app.post('/updateCustomerData', validateCredentials, async (req, res) => {
    const { documentData, documentId } = req.body;
    try {
        // Use the 'set' method with 'merge' set to true to update the document
        await db.collection('customerCollection').doc(`${documentId}`).set(documentData, { merge: true });
        res.status(200).send({ message: 'Document updated successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error updating document', error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// const net = require('net');
// const client = new net.Socket();
// const address = '153.122.121.214';

// client.connect(port, address, () => {
//     console.log('Connected to server!');
//     client.end(); // Close the connection when done
// });

// client.on('error', (error) => {
//     console.error('Connection error: ' + error.message);
// });