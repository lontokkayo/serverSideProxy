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
// app.use(bodyParser.json());




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




// app.use((req, res, next) => {
//   if (req.method === 'POST') {
//       let data = '';
//       req.on('data', chunk => {
//           data += chunk;
//       });
//       req.on('end', () => {
//           try {
//               req.body = JSON.parse(data);
//           } catch (e) {
//               console.error('Could not parse JSON:', e);
//               req.body = data; // Even if it's not JSON, pass the data along for further inspection
//           }
//           next();
//       });
//   } else {
//       next();
//   }
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  // JSONP requests use query parameters, not the request body
  let jsonData = req.query;

  // No need to parse jsonData from a string; it's already an object thanks to Express parsing query parameters
  try {
    // Your actual business logic here
    if (!jsonData.action_cd || !jsonData.stock_no) {
      throw new Error("Missing 'action_cd' or 'stock_no' in query data");
    }

    let resultMessage;
    const docRef = db.collection('vehicleData').doc(jsonData.stock_no);

    switch (jsonData.action_cd) {
      case 'insert':
        await docRef.create(jsonData);
        resultMessage = `Document inserted with ID: ${jsonData.stock_no}`;
        break;
      case 'update':
        await docRef.set(jsonData, { merge: true });
        resultMessage = `Document updated with ID: ${jsonData.stock_no}`;
        break;
      case 'delete':
        await docRef.delete();
        resultMessage = `Document deleted with ID: ${jsonData.stock_no}`;
        break;
      default:
        throw new Error(`Invalid 'action_cd' value: ${jsonData.action_cd}`);
    }

    // JSONP response requires wrapping the response in a callback function
    const callback = req.query.callback; // Or 'jsonp' or whatever your client sends
    if (callback) {
      res.type('text/javascript');
      res.send(`${callback}(${JSON.stringify({ result: resultMessage })})`);
    } else {
      // Fallback for non-JSONP requests, though typical for GET, it's less common
      res.json({ result: resultMessage });
    }

  } catch (error) {
    console.error('Error processing request:', error);
    // Normally JSONP errors are also sent back wrapped in the callback
    const callback = req.query.callback;
    if (callback) {
      res.type('text/javascript');
      res.send(`${callback}(${JSON.stringify({ error: error.message, requestData: jsonData })})`);
    } else {
      res.status(500).json({
        error: error.message,
        requestData: jsonData
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
