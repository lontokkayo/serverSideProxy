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


// Middleware
app.use(bodyParser.json());


// const validateCredentials = async (req, res, next) => {
//     const username = req.headers.username || req.headers['username']; // Adjust based on actual use
//     const accessKey = req.headers.accesskey || req.headers['accessKey']; // Adjust based on actual use
//     if (!username || !accessKey) {
//         return res.status(400).send({ message: 'Missing credentials' });
//     }

//     try {
//         const userDoc = await db.collection('users').doc(username).get();
//         if (!userDoc.exists) {
//             return res.status(401).send({ message: 'User not found' });
//         }

//         const user = userDoc.data();
//         if (username === user.username && accessKey === user.accessKey) {
//             next(); // Credentials are valid, proceed to the next middleware or route handler
//         } else {
//             return res.status(401).send({ message: 'Invalid credentials', credentials: `${username}, ${accessKey}`, });
//         }
//     } catch (error) {
//         return res.status(500).send({ message: 'Error verifying credentials', error: error.message });
//     }
// };

// // Routes
// app.post('/addVehicleData', validateCredentials, async (req, res) => {
//     const { documentData, documentId } = req.body; // Extract documentData from request body
//     try {
//         // Use documentId as the Firestore document ID
//         await db.collection('vehicleCollection').doc(`${documentId}`).set(documentData);
//         res.status(200).send({ message: 'Document added successfully', id: documentId });
//     } catch (error) {
//         res.status(500).send({ message: 'Error adding document', error: error.message });
//     }
// });

// app.post('/updateVehicleData', validateCredentials, async (req, res) => {
//     const { documentData, documentId } = req.body;
//     try {
//         // Use the 'set' method with 'merge' set to true to update the document
//         await db.collection('vehicleCollection').doc(`${documentId}`).set(documentData, { merge: true });
//         res.status(200).send({ message: 'Document updated successfully' });
//     } catch (error) {
//         res.status(500).send({ message: 'Error updating document', error: error.message });
//     }
// });

// app.post('/addCustomerData', validateCredentials, async (req, res) => {
//     const { documentData, documentId } = req.body; // Extract documentData from request body
//     try {
//         // Use documentId as the Firestore document ID
//         await db.collection('customerCollection').doc(`${documentId}`).set(documentData);
//         res.status(200).send({ message: 'Document added successfully', id: documentId });
//     } catch (error) {
//         res.status(500).send({ message: 'Error adding document', error: error.message });
//     }
// });

// app.post('/updateCustomerData', validateCredentials, async (req, res) => {
//     const { documentData, documentId } = req.body;
//     try {
//         // Use the 'set' method with 'merge' set to true to update the document
//         await db.collection('customerCollection').doc(`${documentId}`).set(documentData, { merge: true });
//         res.status(200).send({ message: 'Document updated successfully' });
//     } catch (error) {
//         res.status(500).send({ message: 'Error updating document', error: error.message });
//     }
// });

// // Start the server
// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
// });



// Initialize Firebase Admin with service account
const serviceAccount = require('./samplermj-testreceiver-firebase-adminsdk-ytong-09460be72c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Use raw parser for all bodies, regardless of content type
app.use(bodyParser.raw({ type: '*/*' }));

app.post('/', async (req, res) => {
  try {
    // Convert the raw buffer to a string
    const rawString = req.body.toString();

    // Attempt to manually correct the JSON formatting
    const correctedString = rawString
      // Add quotes around keys
      .replace(/([,{])(\s*)([A-Za-z0-9_]+)(\s*):/g, '$1"$3":')
      // Turn stringified arrays into real arrays
      .replace(/"\[(.*?)\]"/g, (match, p1) => `[${p1}]`);

    let data;
    try {
      data = JSON.parse(correctedString);
    } catch (error) {
      // If JSON is still not well-formed, send an error
      return res.status(400).send('Badly formatted JSON');
    }

    const docRef = await db.collection('vehicleCollection').add(data);
    res.status(200).send(`Document added with ID: ${docRef.id}`);
  } catch (error) {
    console.error('Error adding document: ', error);
    res.status(500).send('Error adding document: ' + error.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});