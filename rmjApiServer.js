const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');
const axios = require('axios');
// const moment = require('moment');
const moment = require('moment-timezone');
// Path to your Firebase service account file
// const serviceAccountPath = './samplermj-testreceiver-firebase-adminsdk-ytong-09460be72c.json';
const serviceAccountPath = './samplermj-firebase-adminsdk-43mxb-3723a82c00.json';
// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
  // Add other configuration variables like databaseURL, storageBucket if needed
});

// Get a Firestore instance
const db = admin.firestore();

const app = express();
const port = 7000;

const corsOptions = {
  allowedHeaders: ['Content-Type', 'username', 'accessKey'],
  origin: function (origin, callback) {
    const allowedOrigins = ['http://153.122.121.214', 'http://153.122.122.149'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Origin is allowed
    } else {
      callback(new Error('Not allowed by CORS')); // Origin is not allowed
    }
  }
};

app.use(cors(corsOptions));
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


const dataOptions = [
  { value: 47, name: "Power Windows", fieldTitle: "InteriorPoWi" },
  { value: 48, name: "Power Seats", fieldTitle: "InteriorPoSe" },
  { value: 15, name: "Leather Seats", fieldTitle: "InteriorLeSe" },
  { value: 14, name: "Child Seats", fieldTitle: "InteriorChSe" },
  { value: 34, name: "Third Row Seats", fieldTitle: "InteriorThRoSe" },
  { value: 32, name: "Power Mirrors", fieldTitle: "InteriorPoMi" },
  { value: 20, name: "Rear Window Wiper", fieldTitle: "InteriorReWiWi" },
  { value: 49, name: "Tinted Glasses", fieldTitle: "InteriorTiGl" },
  { value: 31, name: "Power Door Locks", fieldTitle: "InteriorPoDoLo" },
  { value: 19, name: "Rear Window Defroster", fieldTitle: "InteriorReWiDe" },
  { value: 30, name: "Alloy Wheels", fieldTitle: "ExteriorAlWh" },
  { value: 33, name: "Sunroof", fieldTitle: "ExteriorSuRo" },
  { value: 5, name: "Power Sliding Door", fieldTitle: "ExteriorPoSlDo" },
  { value: 4, name: "Side Airbag", fieldTitle: "SafetySystemSiAi" },
  { value: 2, name: "Driver Airbag", fieldTitle: "SafetySystemDrAi" },
  { value: 3, name: "Passenger Airbag", fieldTitle: "SafetySystemPaAi" },
  { value: 1, name: "Anti-lock Braking System", fieldTitle: "SafetySystemAnBrSy" },
  { value: 24, name: "CD Changer", fieldTitle: "ComfortCDCh" },
  { value: 12, name: "Tilt Steering Wheel", fieldTitle: "ComfortTiStWh" },
  { value: 26, name: "Premium Audio System", fieldTitle: "ComfortPrAuSy" },
  { value: 29, name: "Hard Disk Drive", fieldTitle: "ComfortHDD" },
  { value: 11, name: "Remote Keyless System", fieldTitle: "ComfortReKeSy" },
  { value: 7, name: "Air Conditioner Rear", fieldTitle: "ComfortAiCoRe" },
  { value: 6, name: "Air Conditioner Front", fieldTitle: "ComfortAiCoFr" },
  { value: 8, name: "Cruise Speed Control", fieldTitle: "ComfortCrSpCo" },
  { value: 23, name: "AM/FM Stereo", fieldTitle: "ComfortAMFMSt" },
  { value: 22, name: "AM/FM Radio", fieldTitle: "ComfortAMFMRa" },
  { value: 9, name: "Navigational System GPS", fieldTitle: "ComfortNaSyGPS" },
  { value: 13, name: "Digital Speedometer", fieldTitle: "ComfortDiSp" },
  { value: 28, name: "DVD Player", fieldTitle: "ComfortDVDPl" },
  { value: 10, name: "Power Steering", fieldTitle: "ComfortPoSt" },
  { value: 25, name: "CD Player", fieldTitle: "ComfortCDPl" },
  { value: 43, name: "Performance-Rated Tires", fieldTitle: "SellingPointsPeRaTi" },
  { value: 44, name: "Upgraded Audio System", fieldTitle: "SellingPointsUpAuSy" },
  { value: 36, name: "Customized Wheels", fieldTitle: "SellingPointsCuWh" },
  { value: 38, name: "Maintenance History Available", fieldTitle: "SellingPointsMaHiAv" },
  { value: 37, name: "Fully Loaded", fieldTitle: "SellingPointsFuLo" },
  { value: 42, name: "One Owner History", fieldTitle: "SellingPointsOnOwHi" },
  { value: 40, name: "Brand New Tires", fieldTitle: "SellingPointsBrNeTi" },
  { value: 39, name: "Repainted Body", fieldTitle: "SellingPointsReBo" },
  { value: 45, name: "Non-Smoking Previous Owner", fieldTitle: "SellingPointsNoSmPr" },
  { value: 46, name: "Turbo Engine", fieldTitle: "SellingPointsTuEn" },
  { value: 41, name: "No Accident History", fieldTitle: "SellingPointsNoAcHi" }
];




const dataMaker = [
  {
    value: 0,
    name: "Select",
    fieldTitle: "maker"
  },
  {
    value: 43,
    name: "Toyota",
    fieldTitle: "maker"
  },
  {
    value: 42,
    name: "Nissan",
    fieldTitle: "maker"
  },
  {
    value: 50,
    name: "Honda",
    fieldTitle: "maker"
  },
  {
    value: 51,
    name: "Mitsubishi",
    fieldTitle: "maker"
  },
  {
    value: 60,
    name: "Mercedes-Benz",
    fieldTitle: "maker"
  },
  {
    value: 59,
    name: "BMW",
    fieldTitle: "maker"
  },
  {
    value: 48,
    name: "Mazda",
    fieldTitle: "maker"
  },
  {
    value: 46,
    name: "Subaru",
    fieldTitle: "maker"
  },
  {
    value: 58,
    name: "Volkswagen",
    fieldTitle: "maker"
  },
  {
    value: 47,
    name: "Suzuki",
    fieldTitle: "maker"
  },
  {
    value: 20,
    name: "Land Rover",
    fieldTitle: "maker"
  },
  {
    value: 49,
    name: "Isuzu",
    fieldTitle: "maker"
  },
  {
    value: 57,
    name: "Audi",
    fieldTitle: "maker"
  },
  {
    value: 33,
    name: "Ford",
    fieldTitle: "maker"
  },
  {
    value: 44,
    name: "Daihatsu",
    fieldTitle: "maker"
  },
  {
    value: 41,
    name: "Lexus",
    fieldTitle: "maker"
  },
  {
    value: 10,
    name: "Alfa Romeo",
    fieldTitle: "maker"
  },
  {
    value: 4,
    name: "AMG",
    fieldTitle: "maker"
  },
  {
    value: 23,
    name: "Aston Martin",
    fieldTitle: "maker"
  },
  {
    value: 21,
    name: "Bentley",
    fieldTitle: "maker"
  },
  {
    value: 7,
    name: "BMW Alpina",
    fieldTitle: "maker"
  },
  {
    value: 29,
    name: "Buick",
    fieldTitle: "maker"
  },
  {
    value: 25,
    name: "Cadillac",
    fieldTitle: "maker"
  },
  {
    value: 26,
    name: "Chevrolet",
    fieldTitle: "maker"
  },
  {
    value: 35,
    name: "Chrysler",
    fieldTitle: "maker"
  },
  {
    value: 1,
    name: "Citroen",
    fieldTitle: "maker"
  },
  {
    value: 15,
    name: "Daimler",
    fieldTitle: "maker"
  },
  {
    value: 30,
    name: "Dodge",
    fieldTitle: "maker"
  },
  {
    value: 39,
    name: "Donkervoort",
    fieldTitle: "maker"
  },
  {
    value: 8,
    name: "Ferrari",
    fieldTitle: "maker"
  },
  {
    value: 13,
    name: "Fiat",
    fieldTitle: "maker"
  },
  {
    value: 62,
    name: "Hino",
    fieldTitle: "maker"
  },
  {
    value: 27,
    name: "Hummer",
    fieldTitle: "maker"
  },
  {
    value: 40,
    name: "Hyundai",
    fieldTitle: "maker"
  },
  {
    value: 18,
    name: "Jaguar",
    fieldTitle: "maker"
  },
  {
    value: 34,
    name: "Jeep",
    fieldTitle: "maker"
  },
  {
    value: 12,
    name: "Lamborghini",
    fieldTitle: "maker"
  },
  {
    value: 11,
    name: "Lancia",
    fieldTitle: "maker"
  },
  {
    value: 31,
    name: "Lincoln",
    fieldTitle: "maker"
  },
  {
    value: 16,
    name: "Lotus",
    fieldTitle: "maker"
  },
  {
    value: 9,
    name: "Maserati",
    fieldTitle: "maker"
  },
  {
    value: 6,
    name: "Maybach",
    fieldTitle: "maker"
  },
  {
    value: 32,
    name: "Mercury",
    fieldTitle: "maker"
  },
  {
    value: 14,
    name: "MG",
    fieldTitle: "maker"
  },
  {
    value: 56,
    name: "Mini",
    fieldTitle: "maker"
  },
  {
    value: 64,
    name: "Mitsubishi Fuso",
    fieldTitle: "maker"
  },
  {
    value: 45,
    name: "Mitsuoka",
    fieldTitle: "maker"
  },
  {
    value: 24,
    name: "Morgan",
    fieldTitle: "maker"
  },
  {
    value: 66,
    name: "Nissan diesel",
    fieldTitle: "maker"
  },
  {
    value: 54,
    name: "Opel",
    fieldTitle: "maker"
  },
  {
    value: 61,
    name: "Other",
    fieldTitle: "maker"
  },
  {
    value: 3,
    name: "Peugeot",
    fieldTitle: "maker"
  },
  {
    value: 38,
    name: "Pontiac",
    fieldTitle: "maker"
  },
  {
    value: 55,
    name: "Porsche",
    fieldTitle: "maker"
  },
  {
    value: 2,
    name: "Renault",
    fieldTitle: "maker"
  },
  {
    value: 22,
    name: "Rolls-Royce",
    fieldTitle: "maker"
  },
  {
    value: 19,
    name: "Rover",
    fieldTitle: "maker"
  },
  {
    value: 37,
    name: "Saab",
    fieldTitle: "maker"
  },
  {
    value: 28,
    name: "Saturn",
    fieldTitle: "maker"
  },
  {
    value: 5,
    name: "Smart",
    fieldTitle: "maker"
  },
  {
    value: 53,
    name: "Tommykairazz",
    fieldTitle: "maker"
  },
  {
    value: 17,
    name: "TVR",
    fieldTitle: "maker"
  },
  {
    value: 36,
    name: "Volvo",
    fieldTitle: "maker"
  },
  {
    value: 52,
    name: "ZEROSPORTS",
    fieldTitle: "maker"
  },
  {
    value: 65,
    name: "フィアット",
    fieldTitle: "maker"
  }
  
];


const dataModel = [

  {
    value: "1432",
    name: "86"
  },
  {
    value: "650",
    name: "ALLEX"
  },
  {
    value: "644",
    name: "ALLION"
  },
  {
    value: "648",
    name: "ALPHARD"
  },
  {
    value: "649",
    name: "ALPHARD HYBRID"
  },
  {
    value: "646",
    name: "ALTEZZA"
  },
  {
    value: "647",
    name: "ALTEZZA GITA"
  },
  {
    value: "1427",
    name: "AQUA"
  },
  {
    value: "645",
    name: "ARISTO"
  },
  {
    value: "665",
    name: "AURIS"
  },
  {
    value: "641",
    name: "AVALON"
  },
  {
    value: "642",
    name: "AVENSIS"
  },
  {
    value: "643",
    name: "AVENSIS WAGON"
  },
  {
    value: "626",
    name: "bB"
  },
  {
    value: "627",
    name: "bB OPEN DECK"
  },
  {
    value: "785",
    name: "BELTA"
  },
  {
    value: "778",
    name: "BLADE"
  },
  {
    value: "779",
    name: "BREVIS"
  },
  {
    value: "777",
    name: "BRIZZARD"
  },
  {
    value: "1618",
    name: "C-HR"
  },
  {
    value: "674",
    name: "CALDINA"
  },
  {
    value: "675",
    name: "CALDINA VAN"
  },
  {
    value: "692",
    name: "CAMI"
  },
  {
    value: "668",
    name: "CAMRY"
  },
  {
    value: "669",
    name: "CAMRY GRACIA"
  },
  {
    value: "670",
    name: "CAMRY GRACIA WAGON"
  },
  {
    value: "1417",
    name: "CAMRY HYBRID"
  },
  {
    value: "671",
    name: "CARINA"
  },
  {
    value: "672",
    name: "CARINA ED"
  },
  {
    value: "673",
    name: "CARINA SURF"
  },
  {
    value: "690",
    name: "CAVALIER"
  },
  {
    value: "691",
    name: "CAVALIER COUPE"
  },
  {
    value: "740",
    name: "CELICA"
  },
  {
    value: "741",
    name: "CELICA CONVERTIBLE"
  },
  {
    value: "742",
    name: "CELSIOR"
  },
  {
    value: "743",
    name: "CENTURY"
  },
  {
    value: "754",
    name: "CHASER"
  },
  {
    value: "705",
    name: "CLASSIC"
  },
  {
    value: "711",
    name: "COASTER"
  },
  {
    value: "719",
    name: "COMFORT"
  },
  {
    value: "677",
    name: "COROLLA"
  },
  {
    value: "680",
    name: "COROLLA AXIO"
  },
  {
    value: "682",
    name: "COROLLA CERES"
  },
  {
    value: "684",
    name: "COROLLA FIELDER"
  },
  {
    value: "678",
    name: "COROLLA FX"
  },
  {
    value: "679",
    name: "COROLLA II"
  },
  {
    value: "687",
    name: "COROLLA LEVIN"
  },
  {
    value: "688",
    name: "COROLLA LEVIN HATCHBACK"
  },
  {
    value: "686",
    name: "COROLLA RUMION"
  },
  {
    value: "685",
    name: "COROLLA RUNX"
  },
  {
    value: "681",
    name: "COROLLA SPACIO"
  },
  {
    value: "683",
    name: "COROLLA VAN"
  },
  {
    value: "689",
    name: "COROLLA WAGON"
  },
  {
    value: "714",
    name: "CORONA"
  },
  {
    value: "717",
    name: "CORONA COUPE"
  },
  {
    value: "716",
    name: "CORONA EXIV"
  },
  {
    value: "718",
    name: "CORONA PREMIO"
  },
  {
    value: "715",
    name: "CORONA SF"
  },
  {
    value: "712",
    name: "CORSA"
  },
  {
    value: "713",
    name: "CORSA SEDAN"
  },
  {
    value: "710",
    name: "CRESTA"
  },
  {
    value: "694",
    name: "CROWN ATHLETE"
  },
  {
    value: "696",
    name: "CROWN CONFORT"
  },
  {
    value: "695",
    name: "CROWN ESTATE"
  },
  {
    value: "698",
    name: "CROWN HARDTOP"
  },
  {
    value: "699",
    name: "CROWN HYBRID"
  },
  {
    value: "701",
    name: "CROWN MAJESTA"
  },
  {
    value: "702",
    name: "CROWN ROYAL"
  },
  {
    value: "697",
    name: "CROWN SEDAN"
  },
  {
    value: "700",
    name: "CROWN VAN"
  },
  {
    value: "703",
    name: "CROWN WAGON"
  },
  {
    value: "676",
    name: "CURREN"
  },
  {
    value: "720",
    name: "CYNOS"
  },
  {
    value: "721",
    name: "CYNOS CONVERTIBLE"
  },
  {
    value: "756",
    name: "DUET"
  },
  {
    value: "748",
    name: "DYNA"
  },
  {
    value: "1545",
    name: "Esquire"
  },
  {
    value: "1546",
    name: "EsquireHybrid"
  },
  {
    value: "660",
    name: "ESTIMA"
  },
  {
    value: "661",
    name: "ESTIMA EMINA"
  },
  {
    value: "662",
    name: "ESTIMA HYBRID"
  },
  {
    value: "663",
    name: "ESTIMA LUCIDA"
  },
  {
    value: "628",
    name: "FJ CRUISER"
  },
  {
    value: "772",
    name: "FUNCARGO"
  },
  {
    value: "667",
    name: "GAIA"
  },
  {
    value: "704",
    name: "GRACIA"
  },
  {
    value: "1601",
    name: "GRANACE"
  },
  {
    value: "706",
    name: "GRAND HIACE"
  },
  {
    value: "707",
    name: "GRANVIA"
  },
  {
    value: "768",
    name: "HARRIER"
  },
  {
    value: "769",
    name: "HARRIER HYBRID"
  },
  {
    value: "760",
    name: "HIACE"
  },
  {
    value: "1672",
    name: "Hiace Commuter"
  },
  {
    value: "763",
    name: "HIACE REGIUS"
  },
  {
    value: "761",
    name: "HIACE TRUCK"
  },
  {
    value: "762",
    name: "HIACE VAN"
  },
  {
    value: "764",
    name: "HILUX"
  },
  {
    value: "765",
    name: "HILUX SURF"
  },
  {
    value: "651",
    name: "IPSUM"
  },
  {
    value: "629",
    name: "iQ"
  },
  {
    value: "640",
    name: "ISIS"
  },
  {
    value: "630",
    name: "ist"
  },
  {
    value: "1686",
    name: "JapanTaxi"
  },
  {
    value: "708",
    name: "KLUGER"
  },
  {
    value: "709",
    name: "KLUGER HYBRID"
  },
  {
    value: "805",
    name: "LAND CRUISER 100"
  },
  {
    value: "806",
    name: "LAND CRUISER 200"
  },
  {
    value: "807",
    name: "LAND CRUISER 60"
  },
  {
    value: "808",
    name: "LAND CRUISER 70"
  },
  {
    value: "809",
    name: "LAND CRUISER 80"
  },
  {
    value: "810",
    name: "LAND CRUISER CYGNUS"
  },
  {
    value: "811",
    name: "LAND CRUISER PRADO"
  },
  {
    value: "797",
    name: "LITEACE"
  },
  {
    value: "799",
    name: "LITEACE NOAH"
  },
  {
    value: "800",
    name: "LITEACE NOAH VAN"
  },
  {
    value: "798",
    name: "LITEACE TRUCK"
  },
  {
    value: "801",
    name: "LITEACE VAN"
  },
  {
    value: "791",
    name: "MARK II BLIT"
  },
  {
    value: "789",
    name: "MARK II HARDTOP"
  },
  {
    value: "787",
    name: "MARK II QUALIS"
  },
  {
    value: "788",
    name: "MARK II SEDAN"
  },
  {
    value: "790",
    name: "MARK II VAN"
  },
  {
    value: "792",
    name: "MARK II WAGON"
  },
  {
    value: "793",
    name: "MARK X"
  },
  {
    value: "794",
    name: "MARK X ZIO"
  },
  {
    value: "795",
    name: "MASTER ACE SURF"
  },
  {
    value: "796",
    name: "MEGA CRUISER"
  },
  {
    value: "1554",
    name: "Mirai"
  },
  {
    value: "633",
    name: "MR SPIDER"
  },
  {
    value: "632",
    name: "MR-S"
  },
  {
    value: "631",
    name: "MR2"
  },
  {
    value: "758",
    name: "NADIA"
  },
  {
    value: "759",
    name: "NOAH"
  },
  {
    value: "1496",
    name: "NOAH HYBRID"
  },
  {
    value: "664",
    name: "OPA"
  },
  {
    value: "666",
    name: "ORIGIN"
  },
  {
    value: "766",
    name: "PASSO"
  },
  {
    value: "767",
    name: "PASSO SETTE"
  },
  {
    value: "1440",
    name: "PIXIS EPOCH"
  },
  {
    value: "1612",
    name: "Pixis Joy"
  },
  {
    value: "1585",
    name: "Pixis Mega"
  },
  {
    value: "1418",
    name: "PIXIS SPACE"
  },
  {
    value: "1438",
    name: "PIXIS TRUCK"
  },
  {
    value: "1437",
    name: "PIXIS VAN"
  },
  {
    value: "773",
    name: "PLATZ"
  },
  {
    value: "786",
    name: "PORTE"
  },
  {
    value: "780",
    name: "PREMIO"
  },
  {
    value: "774",
    name: "PRIUS"
  },
  {
    value: "776",
    name: "PRIUS ALPHA"
  },
  {
    value: "775",
    name: "PRIUS EX"
  },
  {
    value: "783",
    name: "PROBOX"
  },
  {
    value: "784",
    name: "PROBOX VAN"
  },
  {
    value: "781",
    name: "PROGRES"
  },
  {
    value: "782",
    name: "PRONARD"
  },
  {
    value: "693",
    name: "QUICK DELIVERY"
  },
  {
    value: "803",
    name: "RACTIS"
  },
  {
    value: "802",
    name: "RAUM"
  },
  {
    value: "634",
    name: "RAV4"
  },
  {
    value: "635",
    name: "RAV4 EV"
  },
  {
    value: "812",
    name: "REGIUS"
  },
  {
    value: "813",
    name: "REGIUS ACE"
  },
  {
    value: "1617",
    name: "Roomy"
  },
  {
    value: "804",
    name: "RUSH"
  },
  {
    value: "636",
    name: "SAI"
  },
  {
    value: "736",
    name: "SCEPTER"
  },
  {
    value: "737",
    name: "SCEPTER COUPE"
  },
  {
    value: "738",
    name: "SCEPTER WAGON"
  },
  {
    value: "739",
    name: "SERA"
  },
  {
    value: "724",
    name: "SIENTA"
  },
  {
    value: "1584",
    name: "sienta hybrid"
  },
  {
    value: "744",
    name: "SOARER"
  },
  {
    value: "745",
    name: "SOARER AEROCABIN"
  },
  {
    value: "1441",
    name: "SPADE"
  },
  {
    value: "727",
    name: "SPARKY"
  },
  {
    value: "728",
    name: "SPRINTER"
  },
  {
    value: "729",
    name: "SPRINTER CARIB"
  },
  {
    value: "730",
    name: "SPRINTER CIELO"
  },
  {
    value: "734",
    name: "SPRINTER MARINO"
  },
  {
    value: "731",
    name: "SPRINTER TRUENO"
  },
  {
    value: "732",
    name: "SPRINTER TRUENO HATCHBACK"
  },
  {
    value: "733",
    name: "SPRINTER VAN"
  },
  {
    value: "735",
    name: "SPRINTER WAGON"
  },
  {
    value: "726",
    name: "STARLET"
  },
  {
    value: "722",
    name: "SUCCEED"
  },
  {
    value: "723",
    name: "SUCCEED VAN"
  },
  {
    value: "725",
    name: "SUPRA"
  },
  {
    value: "1616",
    name: "Tank"
  },
  {
    value: "746",
    name: "TERCEL"
  },
  {
    value: "747",
    name: "TERCEL SEDAN"
  },
  {
    value: "755",
    name: "TOURING HIACE"
  },
  {
    value: "749",
    name: "TOWNACE"
  },
  {
    value: "751",
    name: "TOWNACE NOAH"
  },
  {
    value: "752",
    name: "TOWNACE NOAH VAN"
  },
  {
    value: "750",
    name: "TOWNACE TRUCK"
  },
  {
    value: "753",
    name: "TOWNACE VAN"
  },
  {
    value: "757",
    name: "TOYOACE"
  },
  {
    value: "652",
    name: "VANGUARD"
  },
  {
    value: "656",
    name: "VELLFIRE"
  },
  {
    value: "1416",
    name: "VELLFIRE HYBRID"
  },
  {
    value: "657",
    name: "VEROSSA"
  },
  {
    value: "770",
    name: "VISTA"
  },
  {
    value: "771",
    name: "VISTA ARDEO"
  },
  {
    value: "654",
    name: "VITZ"
  },
  {
    value: "659",
    name: "VOLTZ"
  },
  {
    value: "658",
    name: "VOXY"
  },
  {
    value: "1497",
    name: "VOXY HYBRID"
  },
  {
    value: "639",
    name: "WILL CYPHA"
  },
  {
    value: "637",
    name: "WiLL Vi"
  },
  {
    value: "638",
    name: "WiLL VS"
  },
  {
    value: "655",
    name: "WINDOM"
  },
  {
    value: "653",
    name: "WISH"
  }

  ,
  {
    value: 487,
    name: "180SX",
    fieldTitle: "Nissan"
  },
  {
    value: 488,
    name: "AD",
    fieldTitle: "Nissan"
  },
  {
    value: 491,
    name: "AD EXPERT",
    fieldTitle: "Nissan"
  },
  {
    value: 489,
    name: "AD MAX",
    fieldTitle: "Nissan"
  },
  {
    value: 490,
    name: "AD MAX WAGON",
    fieldTitle: "Nissan"
  },
  {
    value: 492,
    name: "AD VAN",
    fieldTitle: "Nissan"
  },
  {
    value: 493,
    name: "AD WAGON",
    fieldTitle: "Nissan"
  },
  {
    value: 1588,
    name: "Atlas",
    fieldTitle: "Nissan"
  },
  {
    value: 507,
    name: "AUSTER",
    fieldTitle: "Nissan"
  },
  {
    value: 499,
    name: "AVENIR",
    fieldTitle: "Nissan"
  },
  {
    value: 500,
    name: "AVENIR CARGO",
    fieldTitle: "Nissan"
  },
  {
    value: 563,
    name: "BASSARA",
    fieldTitle: "Nissan"
  },
  {
    value: 494,
    name: "Be-1",
    fieldTitle: "Nissan"
  },
  {
    value: 585,
    name: "BLUEBIRD",
    fieldTitle: "Nissan"
  },
  {
    value: 586,
    name: "BLUEBIRD ARX",
    fieldTitle: "Nissan"
  },
  {
    value: 589,
    name: "BLUEBIRD HARDTOP",
    fieldTitle: "Nissan"
  },
  {
    value: 591,
    name: "BLUEBIRD MAXIMA",
    fieldTitle: "Nissan"
  },
  {
    value: 587,
    name: "BLUEBIRD OZ",
    fieldTitle: "Nissan"
  },
  {
    value: 588,
    name: "BLUEBIRD SYLPHY",
    fieldTitle: "Nissan"
  },
  {
    value: 590,
    name: "BLUEBIRD VAN",
    fieldTitle: "Nissan"
  },
  {
    value: 592,
    name: "BLUEBIRD WAGON",
    fieldTitle: "Nissan"
  },
  {
    value: 512,
    name: "CARAVAN",
    fieldTitle: "Nissan"
  },
  {
    value: 511,
    name: "CARAVAN",
    fieldTitle: "Nissan"
  },
  {
    value: 542,
    name: "CEDRIC",
    fieldTitle: "Nissan"
  },
  {
    value: 543,
    name: "CEDRIC SEDAN",
    fieldTitle: "Nissan"
  },
  {
    value: 544,
    name: "CEDRIC VAN",
    fieldTitle: "Nissan"
  },
  {
    value: 545,
    name: "CEDRIC WAGON",
    fieldTitle: "Nissan"
  },
  {
    value: 546,
    name: "CEFIRO",
    fieldTitle: "Nissan"
  },
  {
    value: 547,
    name: "CEFIRO WAGON",
    fieldTitle: "Nissan"
  },
  {
    value: 551,
    name: "CHERRY",
    fieldTitle: "Nissan"
  },
  {
    value: 529,
    name: "CIMA",
    fieldTitle: "Nissan"
  },
  {
    value: 1627,
    name: "CIMA HYBRID",
    fieldTitle: "Nissan"
  },
  {
    value: 1589,
    name: "CIVILIAN",
    fieldTitle: "Nissan"
  },
  {
    value: 1525,
    name: "CIVILIAN BUS",
    fieldTitle: "Nissan"
  },
  {
    value: 516,
    name: "CLIPPER",
    fieldTitle: "Nissan"
  },
  {
    value: 518,
    name: "CLIPPER RIO",
    fieldTitle: "Nissan"
  },
  {
    value: 517,
    name: "CLIPPER TRUCK",
    fieldTitle: "Nissan"
  },
  {
    value: 1590,
    name: "CONDOR",
    fieldTitle: "Nissan"
  },
  {
    value: 519,
    name: "CREW",
    fieldTitle: "Nissan"
  },
  {
    value: 513,
    name: "CUBE",
    fieldTitle: "Nissan"
  },
  {
    value: 514,
    name: "CUBE CUBIC",
    fieldTitle: "Nissan"
  },
  {
    value: 1477,
    name: "DAYZ",
    fieldTitle: "Nissan"
  },
  {
    value: 1501,
    name: "DAYZ ROOX",
    fieldTitle: "Nissan"
  },
  {
    value: 556,
    name: "DUALIS",
    fieldTitle: "Nissan"
  },
  {
    value: 550,
    name: "DUTSUN",
    fieldTitle: "Nissan"
  },
  {
    value: 506,
    name: "ELGRAND",
    fieldTitle: "Nissan"
  },
  {
    value: 503,
    name: "EXPERT",
    fieldTitle: "Nissan"
  },
  {
    value: 577,
    name: "FAIRLADY Z",
    fieldTitle: "Nissan"
  },
  {
    value: 578,
    name: "FAIRLADY Z CONVERTIBLE",
    fieldTitle: "Nissan"
  },
  {
    value: 579,
    name: "FAIRLADY Z ROADSTER",
    fieldTitle: "Nissan"
  },
  {
    value: 574,
    name: "FIGARO",
    fieldTitle: "Nissan"
  },
  {
    value: 575,
    name: "FUGA",
    fieldTitle: "Nissan"
  },
  {
    value: 576,
    name: "FUGA HYBRID",
    fieldTitle: "Nissan"
  },
  {
    value: 509,
    name: "GAZELLE",
    fieldTitle: "Nissan"
  },
  {
    value: 520,
    name: "GLORIA",
    fieldTitle: "Nissan"
  },
  {
    value: 521,
    name: "GLORIA SEDAN",
    fieldTitle: "Nissan"
  },
  {
    value: 522,
    name: "GLORIA VAN",
    fieldTitle: "Nissan"
  },
  {
    value: 523,
    name: "GLORIA WAGON",
    fieldTitle: "Nissan"
  },
  {
    value: 495,
    name: "GT-R",
    fieldTitle: "Nissan"
  },
  {
    value: 599,
    name: "HOMY",
    fieldTitle: "Nissan"
  },
  {
    value: 600,
    name: "HOMY COACH",
    fieldTitle: "Nissan"
  },
  {
    value: 561,
    name: "HYPERMINI",
    fieldTitle: "Nissan"
  },
  {
    value: 501,
    name: "INFINITY Q45",
    fieldTitle: "Nissan"
  },
  {
    value: 530,
    name: "JUKE",
    fieldTitle: "Nissan"
  },
  {
    value: 510,
    name: "KIX",
    fieldTitle: "Nissan"
  },
  {
    value: 610,
    name: "LAFESTA",
    fieldTitle: "Nissan"
  },
  {
    value: 611,
    name: "LAFESTA HIGHWAYSTAR",
    fieldTitle: "Nissan"
  },
  {
    value: 613,
    name: "LANGLEY",
    fieldTitle: "Nissan"
  },
  {
    value: 1539,
    name: "LANGLEY-",
    fieldTitle: "Nissan"
  },
  {
    value: 612,
    name: "LARGO",
    fieldTitle: "Nissan"
  },
  {
    value: 1445,
    name: "LATIO",
    fieldTitle: "Nissan"
  },
  {
    value: 624,
    name: "LAUREL",
    fieldTitle: "Nissan"
  },
  {
    value: 625,
    name: "LAUREL SPIRIT",
    fieldTitle: "Nissan"
  },
  {
    value: 614,
    name: "LEAF",
    fieldTitle: "Nissan"
  },
  {
    value: 622,
    name: "LEOPARD",
    fieldTitle: "Nissan"
  },
  {
    value: 623,
    name: "LEOPARD J.FERRIE",
    fieldTitle: "Nissan"
  },
  {
    value: 616,
    name: "LIBERTA VILLA",
    fieldTitle: "Nissan"
  },
  {
    value: 615,
    name: "LIBERTY",
    fieldTitle: "Nissan"
  },
  {
    value: 618,
    name: "LUCINO",
    fieldTitle: "Nissan"
  },
  {
    value: 620,
    name: "LUCINO COUPE",
    fieldTitle: "Nissan"
  },
  {
    value: 619,
    name: "LUCINO S-RV",
    fieldTitle: "Nissan"
  },
  {
    value: 604,
    name: "MACRA C PLUS C",
    fieldTitle: "Nissan"
  },
  {
    value: 601,
    name: "MARCH",
    fieldTitle: "Nissan"
  },
  {
    value: 602,
    name: "MARCH BOX",
    fieldTitle: "Nissan"
  },
  {
    value: 603,
    name: "MARCH CABRIOLET",
    fieldTitle: "Nissan"
  },
  {
    value: 605,
    name: "MAXIMA",
    fieldTitle: "Nissan"
  },
  {
    value: 606,
    name: "MISTRAL",
    fieldTitle: "Nissan"
  },
  {
    value: 608,
    name: "MOCO",
    fieldTitle: "Nissan"
  },
  {
    value: 607,
    name: "MURANO",
    fieldTitle: "Nissan"
  },
  {
    value: 559,
    name: "NOTE",
    fieldTitle: "Nissan"
  },
  {
    value: 1626,
    name: "NT100Clipper",
    fieldTitle: "Nissan"
  },
  {
    value: 1625,
    name: "NV100Clipper",
    fieldTitle: "Nissan"
  },
  {
    value: 1544,
    name: "NV100Clipper Rio",
    fieldTitle: "Nissan"
  },
  {
    value: 1619,
    name: "NV150 ADVAN",
    fieldTitle: "Nissan"
  },
  {
    value: 496,
    name: "NV200 VANETTE",
    fieldTitle: "Nissan"
  },
  {
    value: 497,
    name: "NV200 VANETTE VAN",
    fieldTitle: "Nissan"
  },
  {
    value: 1628,
    name: "NV350 Caravan",
    fieldTitle: "Nissan"
  },
  {
    value: 498,
    name: "NX COUPE",
    fieldTitle: "Nissan"
  },
  {
    value: 508,
    name: "OTTI",
    fieldTitle: "Nissan"
  },
  {
    value: 562,
    name: "PAO",
    fieldTitle: "Nissan"
  },
  {
    value: 573,
    name: "PINO",
    fieldTitle: "Nissan"
  },
  {
    value: 593,
    name: "PRAIRIE",
    fieldTitle: "Nissan"
  },
  {
    value: 594,
    name: "PRAIRIE JOY",
    fieldTitle: "Nissan"
  },
  {
    value: 595,
    name: "PRAIRIE LIBERTY",
    fieldTitle: "Nissan"
  },
  {
    value: 596,
    name: "PRESAGE",
    fieldTitle: "Nissan"
  },
  {
    value: 598,
    name: "PRESEA",
    fieldTitle: "Nissan"
  },
  {
    value: 597,
    name: "PRESIDENT",
    fieldTitle: "Nissan"
  },
  {
    value: 581,
    name: "PRIMERA",
    fieldTitle: "Nissan"
  },
  {
    value: 580,
    name: "PRIMERA",
    fieldTitle: "Nissan"
  },
  {
    value: 582,
    name: "PRIMERA CAMINOWAGON",
    fieldTitle: "Nissan"
  },
  {
    value: 583,
    name: "PRIMERA HATCHBACK",
    fieldTitle: "Nissan"
  },
  {
    value: 584,
    name: "PRIMERA WAGON",
    fieldTitle: "Nissan"
  },
  {
    value: 568,
    name: "PULSAR",
    fieldTitle: "Nissan"
  },
  {
    value: 569,
    name: "PULSAR EXA",
    fieldTitle: "Nissan"
  },
  {
    value: 570,
    name: "PULSAR SEDAN",
    fieldTitle: "Nissan"
  },
  {
    value: 571,
    name: "PULSAR SERIE",
    fieldTitle: "Nissan"
  },
  {
    value: 572,
    name: "PULSAR SERIE S-RV",
    fieldTitle: "Nissan"
  },
  {
    value: 515,
    name: "QUEST",
    fieldTitle: "Nissan"
  },
  {
    value: 1603,
    name: "Quon",
    fieldTitle: "Nissan"
  },
  {
    value: 609,
    name: "RASHEEN",
    fieldTitle: "Nissan"
  },
  {
    value: 621,
    name: "RNESSA",
    fieldTitle: "Nissan"
  },
  {
    value: 617,
    name: "ROOX",
    fieldTitle: "Nissan"
  },
  {
    value: 505,
    name: "S-CARGO",
    fieldTitle: "Nissan"
  },
  {
    value: 528,
    name: "SAFARI",
    fieldTitle: "Nissan"
  },
  {
    value: 548,
    name: "SERENA",
    fieldTitle: "Nissan"
  },
  {
    value: 549,
    name: "SERENA CARGO",
    fieldTitle: "Nissan"
  },
  {
    value: 531,
    name: "SILVIA",
    fieldTitle: "Nissan"
  },
  {
    value: 533,
    name: "SILVIA CONVERTIBLE",
    fieldTitle: "Nissan"
  },
  {
    value: 532,
    name: "SILVIA VARIETTA",
    fieldTitle: "Nissan"
  },
  {
    value: 534,
    name: "SKYLINE",
    fieldTitle: "Nissan"
  },
  {
    value: 1515,
    name: "SKYLINE  HYBRID",
    fieldTitle: "Nissan"
  },
  {
    value: 535,
    name: "SKYLINE 3DOOR HT",
    fieldTitle: "Nissan"
  },
  {
    value: 538,
    name: "SKYLINE COUPE",
    fieldTitle: "Nissan"
  },
  {
    value: 539,
    name: "SKYLINE CROSSOVER",
    fieldTitle: "Nissan"
  },
  {
    value: 536,
    name: "SKYLINE GT-R",
    fieldTitle: "Nissan"
  },
  {
    value: 537,
    name: "SKYLINE GT-R SEDAN",
    fieldTitle: "Nissan"
  },
  {
    value: 1538,
    name: "SKYLINE HYBRID",
    fieldTitle: "Nissan"
  },
  {
    value: "541",
    name: "STAGEA",
    fieldTitle: "Nissan"
  },
  {
    value: "540",
    name: "STANZA",
    fieldTitle: "Nissan"
  },
  {
    value: "524",
    name: "SUNNY",
    fieldTitle: "Nissan"
  },
  {
    value: "526",
    name: "SUNNY CALIFORNIA",
    fieldTitle: "Nissan"
  },
  {
    value: "525",
    name: "SUNNY RZ-1",
    fieldTitle: "Nissan"
  },
  {
    value: "527",
    name: "SUNNY TRUCK",
    fieldTitle: "Nissan"
  },
  {
    value: "1541",
    name: "SUNNY-TRUCK",
    fieldTitle: "Nissan"
  },
  {
    value: "1455",
    name: "SYLPHY",
    fieldTitle: "Nissan"
  },
  {
    value: "552",
    name: "TEANA",
    fieldTitle: "Nissan"
  },
  {
    value: "557",
    name: "TERRANO",
    fieldTitle: "Nissan"
  },
  {
    value: "558",
    name: "TERRANO REGULUS",
    fieldTitle: "Nissan"
  },
  {
    value: "553",
    name: "TIIDA",
    fieldTitle: "Nissan"
  },
  {
    value: "554",
    name: "TIIDA LATIO",
    fieldTitle: "Nissan"
  },
  {
    value: "555",
    name: "TINO",
    fieldTitle: "Nissan"
  },
  {
    value: "564",
    name: "VANETTE",
    fieldTitle: "Nissan"
  },
  {
    value: "567",
    name: "VANETTE LARGO",
    fieldTitle: "Nissan"
  },
  {
    value: "565",
    name: "VANETTE SERENA",
    fieldTitle: "Nissan"
  },
  {
    value: "566",
    name: "VANETTE TRUCK",
    fieldTitle: "Nissan"
  },
  {
    value: "560",
    name: "VIOLET",
    fieldTitle: "Nissan"
  },
  {
    value: "502",
    name: "WINGROAD",
    fieldTitle: "Nissan"
  },
  {
    value: "504",
    name: "X-TRAIL",
    fieldTitle: "Nissan"
  },
  {
    value: "1580",
    name: "X-TRAIL HYBRID",
    fieldTitle: "Nissan"
  },
  {
    value: "1540",
    name: "リベルタビラ",
    fieldTitle: "Nissan"
  },
  {
    "value": 1699,
    "name": "N-VAN",
    "fieldTitle": "Honda"
  },
  {
    "value": 1102,
    "name": "AIRWAVE",
    "fieldTitle": "Honda"
  },
  {
    "value": 1073,
    "name": "CR-V",
    "fieldTitle": "Honda"
  },
  {
    "value": 1140,
    "name": "FIT",
    "fieldTitle": "Honda"
  },
  {
    "value": 1144,
    "name": "FIT HYBRID",
    "fieldTitle": "Honda"
  },
  {
    "value": 1474,
    "name": "CANTER",
    "fieldTitle": "Mitsubishi"
  },
  {
    "value": 1183,
    "name": "COLT",
    "fieldTitle": "Mitsubishi"
  },
  {
    "value": 1200,
    "name": "DELICA D5",
    "fieldTitle": "Mitsubishi"
  },
  {
    "value": 1523,
    "name": "FIGHTER",
    "fieldTitle": "Mitsubishi"
  },
  {
    "value": 1524,
    "name": "FIGHTER MIGNON",
    "fieldTitle": "Mitsubishi"
  },
  {
    "value": 1169,
    "name": "OUTLANDER",
    "fieldTitle": "Mitsubishi"
  },
  {
    "value": 1210,
    "name": "PAJERO",
    "fieldTitle": "Mitsubishi"
  },
  {
    "value": 1213,
    "name": "PAJERO MINI",
    "fieldTitle": "Mitsubishi"
  },
  {
    "value": 1166,
    "name": "RVR",
    "fieldTitle": "Mitsubishi"
  },
  {
    "value": 1380,
    "name": "B CLASS",
    "fieldTitle": "Mercedes-Benz"
  },
  {
    "value": 1387,
    "name": "C CLASS WAGON",
    "fieldTitle": "Mercedes-Benz"
  },
  {
    "value": 1385,
    "name": "C-CLASS",
    "fieldTitle": "Mercedes-Benz"
  },
  {
    "value": 1388,
    "name": "E CLASS",
    "fieldTitle": "Mercedes-Benz"
  },
  {
    "value": 1395,
    "name": "M CLASS",
    "fieldTitle": "Mercedes-Benz"
  },
  {
    "value": 1343,
    "name": "1 SERIES",
    "fieldTitle": "BMW"
  },
  {
    "value": 1560,
    "name": "2 SERIES ACTIVE TOURER",
    "fieldTitle": "BMW"
  },
  {
    "value": 1346,
    "name": "3 SERIES",
    "fieldTitle": "BMW"
  },
  {
    "value": 1363,
    "name": "X1",
    "fieldTitle": "BMW"
  },
  {
    "value": 1364,
    "name": "X3",
    "fieldTitle": "BMW"
  },
  {
    "value": 1365,
    "name": "X5",
    "fieldTitle": "BMW"
  },
  {
    "value": 985,
    "name": "ATENZA",
    "fieldTitle": "Mazda"
  },
  {
    "value": 1576,
    "name": "Atenza wagon",
    "fieldTitle": "Mazda"
  },
  {
    "value": 1028,
    "name": "BONGO TRUCK",
    "fieldTitle": "Mazda"
  },
  {
    "value": 1029,
    "name": "BONGO VAN",
    "fieldTitle": "Mazda"
  },
  {
    "value": 1431,
    "name": "CX-5",
    "fieldTitle": "Mazda"
  },
  {
    "value": 1010,
    "name": "DEMIO",
    "fieldTitle": "Mazda"
  },
  {
    "value": 1009,
    "name": "TITAN",
    "fieldTitle": "Mazda"
  },
  {
    "value": 1011,
    "name": "TRIBUTE",
    "fieldTitle": "Mazda"
  },
  {
    "value": 1026,
    "name": "VERISA",
    "fieldTitle": "Mazda"
  },
  {
    "value": 913,
    "name": "FORESTER",
    "fieldTitle": "Subaru"
  },
  {
    "value": 889,
    "name": "IMPREZA",
    "fieldTitle": "Subaru"
  },
  {
    "value": 892,
    "name": "IMPREZA ANESIS",
    "fieldTitle": "Subaru"
  },
  {
    "value": 896,
    "name": "IMPREZA HATCHBACK",
    "fieldTitle": "Subaru"
  },
  {
    "value": 891,
    "name": "IMPREZA XV",
    "fieldTitle": "Subaru"
  },
  {
    "value": 924,
    "name": "LEGACY TOURING WAGON",
    "fieldTitle": "Subaru"
  },
  {
    "value": 1698,
    "name": "levorg",
    "fieldTitle": "Subaru"
  },
  {
    "value": 1322,
    "name": "GOLF",
    "fieldTitle": "Volkswagen"
  },
  {
    "value": 1332,
    "name": "TIGUAN",
    "fieldTitle": "Volkswagen"
  },
  {
    "value": 1446,
    "name": "UP!",
    "fieldTitle": "Volkswagen"
  },
  {
    "value": 953,
    "name": "CARRY",
    "fieldTitle": "Suzuki"
  },
  {
    "value": 935,
    "name": "ESCUDO",
    "fieldTitle": "Suzuki"
  },
  {
    "value": 936,
    "name": "EVERY",
    "fieldTitle": "Suzuki"
  },
  {
    "value": 959,
    "name": "SWIFT",
    "fieldTitle": "Suzuki"
  },
  {
    "value": 1518,
    "name": "ELF TRUCK",
    "fieldTitle": "Isuzu"
  },
  {
    "value": 1521,
    "name": "FORWARD",
    "fieldTitle": "Isuzu"
  },
  {
    "value": 1594,
    "name": "giga",
    "fieldTitle": "Isuzu"
  },
  {
    "value": 361,
    "name": "Escape",
    "fieldTitle": "Ford"
  },
  {
    "value": 848,
    "name": "BEGO",
    "fieldTitle": "Daihatsu"
  },
  {
    "value": 839,
    "name": "DELTA WAGON",
    "fieldTitle": "Daihatsu"
  },
  {
    "value": 832,
    "name": "TERIOS KID",
    "fieldTitle": "Daihatsu"
  },
  {
    "value": 478,
    "name": "IS",
    "fieldTitle": "Lexus"
  },
  {
    "value": 482,
    "name": "LS",
    "fieldTitle": "Lexus"
  },
  {
    "value": 1605,
    "name": "LX",
    "fieldTitle": "Lexus"
  },
  {
    "value": 484,
    "name": "RX",
    "fieldTitle": "Lexus"
  },
  {
    "value": 1587,
    "name": "dutro",
    "fieldTitle": "Hino"
  },
  {
    "value": 1592,
    "name": "liesse2",
    "fieldTitle": "Hino"
  },
  {
    "value": 1593,
    "name": "profia",
    "fieldTitle": "Hino"
  },
  {
    "value": 1516,
    "name": "Ranger",
    "fieldTitle": "Hino"
  },
  {
    "value": 1515,
    "name": "Rosa",
    "fieldTitle": "Mitsubishi Fuso"
  },
  {
    "value": 1595,
    "name": "Super Great",
    "fieldTitle": "Mitsubishi Fuso"
  },
  {
    "value": 414,
    "name": "240",
    "fieldTitle": "Volvo"
  },
  {
    "value": 422,
    "name": "240 ESTATE",
    "fieldTitle": "Volvo"
  },
  {
    "value": 415,
    "name": "480",
    "fieldTitle": "Volvo"
  },
  {
    "value": 416,
    "name": "740",
    "fieldTitle": "Volvo"
  },
  {
    "value": 423,
    "name": "740 ESTATE",
    "fieldTitle": "Volvo"
  },
  {
    "value": 417,
    "name": "760",
    "fieldTitle": "Volvo"
  },
  {
    "value": 424,
    "name": "760 ESTATE",
    "fieldTitle": "Volvo"
  },
  {
    "value": 418,
    "name": "780",
    "fieldTitle": "Volvo"
  },
  {
    "value": 419,
    "name": "850",
    "fieldTitle": "Volvo"
  },
  {
    "value": 425,
    "name": "850 ESTATE",
    "fieldTitle": "Volvo"
  },
  {
    "value": 420,
    "name": "940",
    "fieldTitle": "Volvo"
  },
  {
    "value": 426,
    "name": "940 ESTATE",
    "fieldTitle": "Volvo"
  },
  {
    "value": 421,
    "name": "960",
    "fieldTitle": "Volvo"
  },
  {
    "value": 427,
    "name": "960 ESTATE",
    "fieldTitle": "Volvo"
  },
  {
    "value": 428,
    "name": "C30",
    "fieldTitle": "Volvo"
  },
  {
    "value": 429,
    "name": "C70",
    "fieldTitle": "Volvo"
  },
  {
    "value": 430,
    "name": "C70 CABRIOLET",
    "fieldTitle": "Volvo"
  },
  {
    "value": 431,
    "name": "S40",
    "fieldTitle": "Volvo"
  },
  {
    "value": 432,
    "name": "S60",
    "fieldTitle": "Volvo"
  },
  {
    "value": 433,
    "name": "S70",
    "fieldTitle": "Volvo"
  },
  {
    "value": 434,
    "name": "S80",
    "fieldTitle": "Volvo"
  },
  {
    "value": 435,
    "name": "S90",
    "fieldTitle": "Volvo"
  },
  {
    "value": 436,
    "name": "V40",
    "fieldTitle": "Volvo"
  },
  {
    "value": 1536,
    "name": "V40クロスカントリー",
    "fieldTitle": "Volvo"
  },
  {
    "value": 437,
    "name": "V50",
    "fieldTitle": "Volvo"
  },
  {
    "value": 438,
    "name": "V60",
    "fieldTitle": "Volvo"
  },
  {
    "value": 1656,
    "name": "V60クロスカントリー",
    "fieldTitle": "Volvo"
  },
  {
    "value": 439,
    "name": "V70",
    "fieldTitle": "Volvo"
  },
  {
    "value": 440,
    "name": "V70XC",
    "fieldTitle": "Volvo"
  },
  {
    "value": 441,
    "name": "V90",
    "fieldTitle": "Volvo"
  },
  {
    "value": 1657,
    "name": "V90クロスカントリー",
    "fieldTitle": "Volvo"
  },
  {
    "value": 1696,
    "name": "XC40",
    "fieldTitle": "Volvo"
  },
  {
    "value": 442,
    "name": "XC60",
    "fieldTitle": "Volvo"
  },
  {
    "value": 443,
    "name": "XC70",
    "fieldTitle": "Volvo"
  },
  {
    "value": 444,
    "name": "XC90",
    "fieldTitle": "Volvo"
  },
  {
    "value": 474,
    "name": "CT",
    "fieldTitle": "Lexus"
  },
  {
    "value": 475,
    "name": "GS",
    "fieldTitle": "Lexus"
  },
  {
    "value": 1606,
    "name": "GS F",
    "fieldTitle": "Lexus"
  },
  {
    "value": 476,
    "name": "GS HYBRID",
    "fieldTitle": "Lexus"
  },
  {
    "value": 477,
    "name": "HS",
    "fieldTitle": "Lexus"
  },
  {
    "value": 478,
    "name": "IS",
    "fieldTitle": "Lexus"
  },
  {
    "value": 480,
    "name": "IS CONVERTIBLE",
    "fieldTitle": "Lexus"
  },
  {
    "value": 479,
    "name": "IS F",
    "fieldTitle": "Lexus"
  },
  {
    "value": 1629,
    "name": "LC",
    "fieldTitle": "Lexus"
  },
  {
    "value": 1630,
    "name": "LCハイブリッド",
    "fieldTitle": "Lexus"
  },
  {
    "value": 481,
    "name": "LFA",
    "fieldTitle": "Lexus"
  },
  {
    "value": 482,
    "name": "LS",
    "fieldTitle": "Lexus"
  },
  {
    "value": 483,
    "name": "LS HYBRID",
    "fieldTitle": "Lexus"
  },
  {
    "value": 1605,
    "name": "LX",
    "fieldTitle": "Lexus"
  },
  {
    "value": 1624,
    "name": "NX",
    "fieldTitle": "Lexus"
  },
  {
    "value": 1542,
    "name": "NXハイブリッド",
    "fieldTitle": "Lexus"
  },
  {
    "value": 1535,
    "name": "NXハイブリッド",
    "fieldTitle": "Lexus"
  },
  {
    "value": 1551,
    "name": "RC",
    "fieldTitle": "Lexus"
  },
  {
    "value": 1553,
    "name": "RC F",
    "fieldTitle": "Lexus"
  },
  {
    "value": 1552,
    "name": "RCハイブリッド",
    "fieldTitle": "Lexus"
  },
  {
    "value": 484,
    "name": "RX",
    "fieldTitle": "Lexus"
  },
  {
    "value": 485,
    "name": "RX HYBRID",
    "fieldTitle": "Lexus"
  },
  {
    "value": 486,
    "name": "SC",
    "fieldTitle": "Lexus"
  },
  {
    "value": 1527,
    "name": "ＩＳハイブリッド",
    "fieldTitle": "Lexus"
  }
]

const dataPorts = [
  { port: "Nagoya", portID: "N", value: 0 },
  { port: "Nagoya", portID: "N", value: 1 },
  { port: "Kobe", portID: "K", value: 2 },
  { port: "Nagoya", portID: "N", value: 3 },
  { port: "Yokohama", portID: "Y", value: 4 },
  { port: "Kyushu", portID: "F", value: 5 },
  { port: "Nagoya", portID: "N", value: 6 },
  { port: "Nagoya", portID: "N", value: 7 },
  { port: "Nagoya", portID: "N", value: 8 },
  { port: "Nagoya", portID: "N", value: 9 },
  { port: "Nagoya", portID: "N", value: 10 },
  { port: "Nagoya", portID: "N", value: 11 },
  { port: "Nagoya", portID: "N", value: 12 },
  { port: "Nagoya", portID: "N", value: 13 },
  { port: "Nagoya", portID: "N", value: 14 },
  { port: "Nagoya", portID: "N", value: 15 },
  { port: "Nagoya", portID: "N", value: 16 },
  { port: "Nagoya", portID: "N", value: 17 },
  { port: "Nagoya", portID: "N", value: 18 },
  { port: "Nagoya", portID: "N", value: 19 },
  { port: "Nagoya", portID: "N", value: 20 },
  { port: "Nagoya", portID: "N", value: 21 },
  { port: "Nagoya", portID: "N", value: 22 },
  { port: "Nagoya", portID: "N", value: 23 },
  { port: "Nagoya", portID: "N", value: 24 },
  { port: "Nagoya", portID: "N", value: 25 },
  { port: "Nagoya", portID: "N", value: 26 },
  { port: "Nagoya", portID: "N", value: 27 },
  { port: "Nagoya", portID: "N", value: 28 },
  { port: "Nagoya", portID: "N", value: 29 },
  { port: "Nagoya", portID: "N", value: 30 },
  { port: "Nagoya", portID: "N", value: 31 },
  { port: "Nagoya", portID: "N", value: 32 },
  { port: "Nagoya", portID: "N", value: 33 },
  { port: "Nagoya", portID: "N", value: 34 },
  { port: "Nagoya", portID: "N", value: 35 },
  { port: "Nagoya", portID: "N", value: 36 },
  { port: "Nagoya", portID: "N", value: 37 },
  { port: "Nagoya", portID: "N", value: 38 },
  { port: "Nagoya", portID: "N", value: 39 },
  { port: "Nagoya", portID: "N", value: 40 },
  { port: "Nagoya", portID: "N", value: 41 },
  { port: "Nagoya", portID: "N", value: 42 },
  { port: "Nagoya", portID: "N", value: 43 }
];

const dataBuyer = [
  { value: 10, name: 'Yusuke' },
  { value: 7, name: 'Yamazaki' },
  { value: 12, name: 'Piyapan' },
  { value: 21, name: 'Masa' },
  { value: 24, name: 'Arai' },
  { value: 25, name: 'Sato' },
  { value: 90, name: 'Domestic' },
]
const dataSteering = [
  { value: 1, name: 'Left' },
  { value: 2, name: 'Right' }
]

const dataTransmission = [
  { value: 1, name: 'Automatic' },
  { value: 2, name: 'Manual' }
];

const dataSales = [
  { name: "Select", value: 0 },
  { name: "Abdi", value: 42, id: 'A' },
  { name: "ARITA", value: 44, id: '' },
  { name: "Booking担当", value: 17, id: '' },
  { name: "genio nishiki", value: 1, id: '' },
  { name: "Justin", value: 43, id: '' },
  { name: "matsubara", value: 37, id: '' },
  { name: "matsuoka＆HD", value: 35, id: '' },
  { name: "matsuoka＆自販", value: 34, id: '' },
  { name: "Miha Matsuoka", value: 4, id: '' },
  { name: "Miha Matsuoka(三利)", value: 38, id: '' },
  { name: "s.uchida", value: 3, id: '' },
  { name: "sakai", value: 18, id: '' },
  { name: "sugiura", value: 22, id: '' },
  { name: "tanaka", value: 41, id: '' },
  { name: "Yusuke", value: 14, id: 'F' },
  { name: "yamazaki", value: 36, id: '' },
  { name: "Yanagisawa", value: 24, id: '' },
  { name: "松岡＆直販＆ＡＳ", value: 28, id: '' },
  { name: "直販＆ＡＳ", value: 29, id: '' }
];

const dataBodyType = [
  { value: 1, name: 'Coupe' },
  { value: 2, name: 'Open' },
  { value: 3, name: 'Sedan' },
  { value: 4, name: 'Wagon' },
  { value: 5, name: 'Hatchback' },
  { value: 6, name: 'Van' },
  { value: 7, name: 'Truck' },
  { value: 8, name: 'SUV' },
  { value: 9, name: 'Bus' }
];

const dataColor = [
  { label: "Beige", colorValue: "Beige", value: 1 },
  { label: "Black", colorValue: "Black", value: 2 },
  { label: "Blue", colorValue: "Blue", value: 3 },
  { label: "Bronze", colorValue: "Bronze", value: 4 },
  { label: "Brown", colorValue: "Brown", value: 5 },
  { label: "Burgundy", colorValue: "Burgundy", value: 6 },
  { label: "Champagne", colorValue: "Champagne", value: 7 },
  { label: "Charcoal", colorValue: "Charcoal", value: 8 },
  { label: "Cream", colorValue: "Cream", value: 9 },
  { label: "Dark Blue", colorValue: "Dark Blue", value: 10 },
  { label: "Gold", colorValue: "Gold", value: 11 },
  { label: "Gray", colorValue: "Gray", value: 12 },
  { label: "Green", colorValue: "Green", value: 13 },
  { label: "Maroon", colorValue: "Maroon", value: 14 },
  { label: "Off White", colorValue: "Off White", value: 15 },
  { label: "Orange", colorValue: "Orange", value: 16 },
  { label: "Pearl", colorValue: "Pearl", value: 17 },
  { label: "Pewter", colorValue: "Pewter", value: 18 },
  { label: "Pink", colorValue: "Pink", value: 19 },
  { label: "Purple", colorValue: "Purple", value: 20 },
  { label: "Red", colorValue: "Red", value: 21 },
  { label: "Silver", colorValue: "Silver", value: 22 },
  { label: "Tan", colorValue: "Tan", value: 23 },
  { label: "Teal", colorValue: "Teal", value: 24 },
  { label: "Titanium", colorValue: "Titanium", value: 25 },
  { label: "Turquoise", colorValue: "Turquoise", value: 26 },
  { label: "White", colorValue: "White", value: 27 },
  { label: "Yellow", colorValue: "Yellow", value: 28 },
  { label: "Other", colorValue: "Other", value: 29 }
];

const dataDriveType = [
  { value: 1, name: "2-wheel drive" },
  { value: 2, name: "4-wheel drive" }
];

const dataFuelType = [
  { value: 1, name: 'Gasoline' },
  { value: 2, name: 'Diesel' },
  { value: 3, name: 'Rotary' },
  { value: 4, name: 'Hybrid' },
  { value: 5, name: 'Electricity' }
];


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


function categorizeOptions(options_cds, dataOptions) {
  // Initialize categories
  const categories = {
    interior: {},
    exterior: {},
    safetySystem: {},
    comfort: {},
    sellingPoints: {}
  };

  // Initialize all possible fields within categories to false
  dataOptions.forEach(option => {
    if (option.fieldTitle.startsWith("Interior")) {
      categories.interior[option.fieldTitle] = false;
    } else if (option.fieldTitle.startsWith("Exterior")) {
      categories.exterior[option.fieldTitle] = false;
    } else if (option.fieldTitle.startsWith("SafetySystem")) {
      categories.safetySystem[option.fieldTitle] = false;
    } else if (option.fieldTitle.startsWith("Comfort")) {
      categories.comfort[option.fieldTitle] = false;
    } else if (option.fieldTitle.startsWith("SellingPoints")) {
      categories.sellingPoints[option.fieldTitle] = false;
    }
  });

  // Set the corresponding fieldTitle to true based on options_cds
  options_cds.forEach(cd => {
    const matchedOption = dataOptions.find(item => item.value === cd);
    if (matchedOption) {
      if (matchedOption.fieldTitle.startsWith("Interior")) {
        categories.interior[matchedOption.fieldTitle] = true;
      } else if (matchedOption.fieldTitle.startsWith("Exterior")) {
        categories.exterior[matchedOption.fieldTitle] = true;
      } else if (matchedOption.fieldTitle.startsWith("SafetySystem")) {
        categories.safetySystem[matchedOption.fieldTitle] = true;
      } else if (matchedOption.fieldTitle.startsWith("Comfort")) {
        categories.comfort[matchedOption.fieldTitle] = true;
      } else if (matchedOption.fieldTitle.startsWith("SellingPoints")) {
        categories.sellingPoints[matchedOption.fieldTitle] = true;
      }
    }
  });

  return categories;
}

async function prepareCurrentDate() {
  try {
    // Await the fetchCurrentDate function to get the actual date string
    const updatedDate = await fetchCurrentDate();
    const formattedData = {
      updatedDate: updatedDate,
      dateAdded: updatedDate,
    };
    console.log(formattedData);
    return formattedData;
  } catch (error) {
    console.error('Error preparing data:', error);
  }
}

// async function fetchCurrentDate() {
//   try {
//     const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Tokyo');
//     const { datetime } = response.data;
//     const formattedTime = moment(datetime).format('YYYY/MM/DD [at] HH:mm:ss');
//     console.log(formattedTime); // For demonstration
//     return formattedTime;
//   } catch (error) {
//     console.error('Error fetching or formatting the time:', error);
//     throw error; // Rethrow or handle error as needed
//   }
// }

async function fetchCurrentDate() {
  try {
    const response = await axios.get('https://worldtimeapi.org/api/timezone/UTC'); // Fetch UTC time
    const utcDatetime = response.data.datetime;
    // Convert to Asia/Tokyo time zone or any other time zone you're interested in
    const formattedTime = moment(utcDatetime).tz('Asia/Tokyo').format('YYYY/MM/DD [at] HH:mm:ss');
    console.log(formattedTime); // For demonstration
    return formattedTime;
  } catch (error) {
    console.error('Error fetching or formatting the time:', error);
    throw error;
  }
}


async function formatVehicleData(jsonData) {





  const falseOptionsFieldTitles = dataOptions.reduce((acc, option) => {
    acc[option.fieldTitle] = false;
    return acc;
  }, {});

  const currentDateInfo = await prepareCurrentDate();



  // Initialize fieldTitlesForVehicle with false values for each option fieldTitle
  let fieldTitlesForVehicle = { ...falseOptionsFieldTitles }; // Assuming falseOptionsFieldTitles is defined elsewhere or you initialize this object with default false values for each option
  // Example of parsing and formatting a specific field. You'll need to adapt this based on your actual data structures and requirements.
  // Parse the option_cds string into an array of numbers if it's a string. Otherwise, use it directly.
  const options_cds = Array.isArray(jsonData.option_cds) ? jsonData.option_cds :
    typeof jsonData.option_cds === 'string' ? JSON.parse(jsonData.option_cds) :
      [];

  options_cds.forEach(cd => {
    const matchedOption = dataOptions.find(item => item.value === cd);
    if (matchedOption) {
      // Set the corresponding fieldTitle to true
      fieldTitlesForVehicle[matchedOption.fieldTitle] = true;
    }
  });

  // Assuming categorizeOptions is defined and works correctly,
  // you can now safely call it with options_cds
  const categorizedOptions = categorizeOptions(options_cds, dataOptions);

  // Similar logic can be applied for maker, model, body type, etc., based on your existing logic
  // Maker
  const matchedMaker = dataMaker.find(item => item.value.toString() === jsonData.m_as_maker_id);
  const makerName = matchedMaker ? matchedMaker.name.toUpperCase() : 'Others';

  // Model
  const matchedModel = dataModel.find(item => item.value.toString() === jsonData.m_as_model_id);
  const modelName = matchedModel ? matchedModel.name.toUpperCase() : 'Others';

  // Body Type
  const matchedBodyType = dataBodyType.find(item => item.value.toString() === jsonData.m_as_bodytype_id);
  const bodyTypeName = matchedBodyType ? matchedBodyType.name : 'Others';

  // Reference Number and Buyer
  const referenceNumber = jsonData.reference_no || 'Others';
  const lastNumber = referenceNumber.split("-").pop();
  const matchedBuyer = dataBuyer.find(item => item.value === parseInt(lastNumber));
  const buyerName = matchedBuyer ? matchedBuyer.name : 'Unknown';



  // Drive Type
  const matchedDriveType = dataDriveType.find(item => item.value.toString() === jsonData.m_as_drivetype_id);
  const driveType = matchedDriveType ? matchedDriveType.name : '';

  // Exterior Color
  const matchedExteriorColor = dataColor.find(item => item.value.toString() === jsonData.exterior_color_cd);
  const exteriorColor = matchedExteriorColor ? matchedExteriorColor.colorValue : '';

  // Fuel Type
  const matchedFuel = dataFuelType.find(item => item.value.toString() === jsonData.m_as_fueltype_id);
  const fuel = matchedFuel ? matchedFuel.name : '';

  // Port
  const matchedPort = dataPorts.find(item => item.value.toString() === jsonData.storage_yard_cd);
  const portName = matchedPort ? matchedPort.port : '';
  const portID = matchedPort ? matchedPort.portID : '';

  // Sales Person
  const matchedSales = dataSales.find(item => item.value.toString() === jsonData.sales_person_charge_id);
  const sales = matchedSales ? matchedSales.name : '';
  const salesID = matchedSales ? matchedSales.id : '';

  //reg year
  const regYearId = jsonData.registration_year;
  const regYear = regYearId;
  //reg year


  // Steering
  const matchedSteering = dataSteering.find(item => item.value.toString() === jsonData.m_as_steering_id);
  const steering = matchedSteering ? matchedSteering.name : '';

  // Transmission
  const matchedTransmission = dataTransmission.find(item => item.value.toString() === jsonData.m_as_transmission_id);
  const transmission = matchedTransmission ? matchedTransmission.name : '';

  //chassis number
  const chassisId = jsonData.frame_number;
  const chassisNumber = chassisId
  //chassis number


  const lengthId = jsonData.length;
  const widthId = jsonData.width;
  const heightId = jsonData.height;

  const dimensionHeight = Number(heightId / 10)
  const dimensionWidth = Number(widthId / 10)
  const dimensionLength = Number(lengthId / 10)
  const dimensionCubicMeters = ((Number(dimensionHeight) * Number(dimensionWidth) * Number(dimensionLength)) / 1000000).toFixed(2)

  //memo
  const memo = jsonData.memo;
  //memo

  //door
  const doorId = jsonData.door_cnt;
  const doors = doorId;
  //door


  //displacement
  const displacementId = jsonData.displacement;
  const displacement = displacementId;
  //displacement

  //exterior color

  //fob orig price
  const fobOrigPriceId = jsonData.fob_price;
  const fobOrigPrice = fobOrigPriceId;
  //fob orig price

  //fob price
  const fobPriceId = jsonData.fob_regular_price;
  const fobPrice = fobPriceId;
  //fob price

  //mileage
  const mileageId = jsonData.mileage;
  const mileage = mileageId;
  //mileage

  //model code
  const modelCodeId = jsonData.model_code;
  const modelCode = modelCodeId;
  //model code

  //number of seats
  const numberOfSeatsId = jsonData.number_of_passengers;
  const numberOfSeats = numberOfSeatsId
  //number of seats


  //purchase price
  const purchasePriceId = jsonData.stock_price;
  const purchasedPrice = purchasePriceId;
  //purcase price

  //reg year
  const regMonthId = jsonData.registration_month;
  const regMonth = regMonthId;
  //reg year

  //stock id
  const stockIdTop = jsonData.stock_no;
  const stockID = stockIdTop
  //stock id


  // const currentDateInfo = prepareCurrentDate();
  // Compiling all formatted data
  const formattedData = {
    // ...jsonData, // Original data
    options_cds, // Transformed options
    jackall_id: jsonData.stock_id,
    make: makerName.toUpperCase(), // Assuming variables like makerName are defined elsewhere in your code
    model: modelName.toUpperCase(),
    bodyType: bodyTypeName,
    carName: `${regYear} ${makerName.toUpperCase()} ${modelName.toUpperCase()}`,
    referenceNumber: referenceNumber,
    buyerID: lastNumber,
    buyer: buyerName,
    chassisNumber: chassisNumber,
    dimensionWidth: `${dimensionWidth}`,
    dimensionHeight: `${dimensionHeight}`,
    dimensionLength: `${dimensionLength}`,
    dimensionCubicMeters: `${dimensionCubicMeters}`,
    memo: memo,
    doors: doors,
    driveType: driveType,
    engineDisplacement: displacement,
    exteriorColor: exteriorColor,
    fobOrigPrice: fobOrigPrice,
    fobPrice: fobPrice,
    fuel: fuel,
    mileage: mileage,
    modelCode: modelCode,
    numberOfSeats: numberOfSeats,
    port: port,
    portID: portID,
    purchasedPrice: purchasedPrice,
    regYear: regYear,
    regMonth: regMonth,
    sales: sales,
    salesID: salesID,
    steering: steering,
    stockID: stockID,
    stockStatus: "On-Sale",
    transmission: transmission,
    ...fieldTitlesForVehicle, // Spread the fieldTitles into the vehicle object
    ...categorizedOptions,
    updatedDate: currentDateInfo.updatedDate, // Correctly include the updatedDate
    dateAdded: currentDateInfo.dateAdded, // And dateAdded
    keywords: [
      jsonData.stock_id,
      makerName.toUpperCase(),
      modelName.toUpperCase(),
      bodyTypeName,
      `${regYear} ${makerName.toUpperCase()} ${modelName.toUpperCase()}`,
      `${regYear}`,
      `${regYear} ${makerName.toUpperCase()}`,
      `${makerName.toUpperCase()} ${modelName.toUpperCase()}`,
      referenceNumber,
      lastNumber,
      buyerName,
      chassisNumber,
      stockID,
    ]
  };

  // Additional fields (e.g., chassisNumber, dimensions) are assumed to be direct mappings and do not require transformation.
  // They can be added directly to the `formattedData` object as needed.

  return formattedData;
}

app.get('/', async (req, res) => {
  // JSONP requests use query parameters, not the request body
  let jsonData = req.query;

  // No need to parse jsonData from a string; it's already an object thanks to Express parsing query parameters
  try {
    // Your actual business logic here
    if (!jsonData.action_cd || !jsonData.stock_no) {
      throw new Error("Missing 'action_cd' or 'stock_no' in query data");
    }

    const formattedData = await formatVehicleData(jsonData);

    let resultMessage;
    const docRef = db.collection('VehicleProducts').doc(jsonData.stock_no);

    switch (jsonData.action_cd) {
      case 'insert':
        await docRef.create(formattedData);
        resultMessage = `Document inserted with ID: ${jsonData.stock_no}`;
        break;
      case 'update':
        await docRef.set(formattedData, { merge: true });
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
