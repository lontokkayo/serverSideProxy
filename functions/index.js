const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment-timezone');
const axios = require('axios');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

admin.initializeApp();

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


const sendEmail = async (to, subject, htmlContent) => {
    try {
        const response = await fetch('http://rmjsmtp.duckdns.org:2000/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to,
                subject,
                htmlContent,
            }),
        });

        if (response.ok) {
            console.log('Email sent successfully');
        } else {
            console.error('Failed to send email');
        }
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


// exports.sendDueDateRemindersAndAddMessage = functions.pubsub.schedule('0 6 * * *')
//     .timeZone('Asia/Tokyo') // Ensures that the schedule follows Tokyo time.
//     .onRun(async context => {
// exports.sendDueDateRemindersAndAddMessage = functions.region('asia-northeast2').pubsub.schedule('every 24 hours').timeZone('Asia/Tokyo').onRun(async () => {
// exports.sendRemindersNotification = functions.region('asia-northeast2').pubsub.schedule('every 3 minutes').timeZone('Asia/Tokyo').onRun(async () => {
exports.sendRemindersNotification = functions.region('asia-northeast2').pubsub.schedule('0 0 * * *').timeZone('Asia/Tokyo').onRun(async () => {
    const promisesForPaymentReminder = [];
    const promisesForOrderItemReminder = [];
    // Get today's date in the format YYYY-MM-DD
    const firestoreTimestamp = admin.firestore.Timestamp.now();
    const firestoreDate = firestoreTimestamp.toDate();

    // Convert to Tokyo time
    const formattedTime = moment(firestoreDate).tz("Asia/Tokyo").format('YYYY/MM/DD [at] HH:mm:ss.SSS');
    const today = moment(firestoreDate).tz("Asia/Tokyo").format('YYYY-MM-DD');

    // Reference to the IssuedInvoice collection
    const issuedInvoicesRef = admin.firestore().collection('IssuedInvoice');

    // Query for documents with a dueDate of today or late,r and isCancelled is false (uncomment and use as needed)
    const snapshotForPaymentReminder = await issuedInvoicesRef
        .where('bankInformations.dueDate', '<=', today)
        // .where('stepIndicator.value', '==', 3)
        .where('isCancelled', '==', false)
        .where('orderPlaced', '==', true)
        .where('fullyPaid', '==', false)

        .get();



    if (snapshotForPaymentReminder.empty) {
        console.log('No matching documents for due date reminders.');
        return null;
    }

    snapshotForPaymentReminder.forEach(async doc => {
        const invoice = doc.data();
        // Retrieve the chatId from the document
        const chatId = invoice.chatId; // Assuming chatId is directly under the document
        if (!chatId) {
            console.log(`No chatId found for invoice ID: ${doc.id}`);
            return;
        }

        const htmlContent = `<html class="focus-outline-visible">
        <head>
        <title>Payment Reminder for Invoice No. ${doc.id}</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                padding: 10px;
                margin: 0;
            }
            .container {
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                margin: 20px auto;
                max-width: 600px;
                padding: 20px;
            }
            h2, .highlight {
                color: #FF0000; /* Red */
            }
            p {
                font-size: 16px;
                line-height: 1.6;
                margin: 10px 0 20px;
            }
            .signature {
                font-weight: bold;
                margin-top: 40px;
                text-align: left;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Payment Reminder</h2>
            <p><strong>Dear Valued Customer,</strong></p>
            <p>I hope this message finds you well.</p>
            
            <p>This is a gentle reminder about the upcoming payment due date for <strong>Invoice No. <span class="highlight">${doc.id}</span></strong>.</p>
    
            <p>We kindly request you to submit your payment proof at your earliest convenience to ensure continuity in our transaction.</p>
            
            <p>Please be aware that failure to meet the payment deadline may lead to cancellation of the transaction, which we hope to avoid.</p>
            
            <p>Please do not hesitate to contact us if you require any assistance or have questions.</p>
            
            <p>Thank you for your prompt attention to this matter.</p>
            
            <p class="signature">Best regards,<br>Real Motor Japan</p>
        </div>
    
    
    </body>
    </html>`;

        const messageText = `Payment Reminder

Dear Valued Customer,

I hope this message finds you well.
        
This is a gentle reminder about the upcoming payment due date for Invoice No. ${doc.id}. 

We kindly request you to submit your payment proof at your earliest convenience to ensure continuity in our transaction.
        
Please be aware that failure to meet the payment deadline may lead to cancellation of the transaction, which we hope to avoid.
        
Please do not hesitate to contact us if you require any assistance or have questions.

Thank you for your prompt attention to this matter.
        
Best regards,
Real Motor Japan`;

        // Construct the message to add to the 'messages' subcollection for the specific chat
        const addMessagePromise = admin.firestore().collection('chats').doc(chatId).collection('messages').add({
            text: messageText,
            sender: 'RMJ-Bot', // Adjust as per your sender identification strategy
            timestamp: formattedTime,
        });

        // Update the main chat document with the latest message details
        const updateChatPromise = admin.firestore().collection('chats').doc(chatId).update({
            lastMessageSender: 'RMJ-Bot',
            lastMessage: messageText,
            lastMessageDate: formattedTime,
            customerRead: false,
            // read: true,
            readBy: ['RMJ-Bot'],
        });

        await delay(500);
        promisesForPaymentReminder.push(sendEmail(invoice.customerEmail, `Payment Reminder | Due Date | ${today}`, htmlContent));

        promisesForPaymentReminder.push(addMessagePromise, updateChatPromise);
    });

    // Query for documents with a dueDate of today or later, and isCancelled is false (uncomment and use as needed)
    const snapshotForOrderItemReminder = await issuedInvoicesRef
        .where('bankInformations.dueDate', '>=', today)
        .where('isCancelled', '==', false)
        .where('orderPlaced', '==', false)
        .get();


    if (snapshotForOrderItemReminder.empty) {
        console.log('No matching documents for order item reminders.');
        return null;
    }

    snapshotForOrderItemReminder.forEach(async doc => {
        const invoice = doc.data();
        // Retrieve the chatId from the document
        const chatId = invoice.chatId; // Assuming chatId is directly under the document
        if (!chatId) {
            console.log(`No chatId found for invoice ID: ${doc.id}`);
            return;
        }

        const htmlContent = `<html class="focus-outline-visible">
        <head>
        <title>Place Order Reminder</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                padding: 10px;
                margin: 0;
            }
            .container {
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                margin: 20px auto;
                max-width: 600px;
                padding: 20px;
            }
            h2, .highlight {
                color: #FF0000; /* Red */
            }
            p {
                font-size: 16px;
                line-height: 1.6;
                margin: 10px 0 20px;
            }
            .signature {
                font-weight: bold;
                margin-top: 40px;
                text-align: left;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Place Order Reminder</h2>

            <p><strong>Dear Valued Customer,</strong></p>

            <p>I hope this message finds you well.</p>

            <p>It seems you still have a pending <strong><span class="highlight">Proforma Invoice</span></strong> on us.</p>
            
            <p>This is a gentle reminder to place an order for vehicle <strong>${invoice.carData.carName}</strong> with the chassis number <strong>${invoice.carData.chassisNumber}</strong> to see bank details in your invoice</p>
            
            <p>Please do not hesitate to contact us if you require any assistance or have questions.</p>
            
            <p>Thank you for your prompt attention to this matter.</p>
            
            <p class="signature">Best regards,<br>Real Motor Japan</p>
        </div>
    
    
    </body>
    </html>`;

        const messageText = `Place Order Reminder

Dear Valued Customer,

I hope this message finds you well.

It seems you still have a pending Proforma Invoice on us.

This is a gentle reminder to place an order for vehicle ${invoice.carData.carName} with the chassis number ${invoice.carData.chassisNumber} to see bank details in your invoice.

Please do not hesitate to contact us if you require any assistance or have questions.

Thank you for your prompt attention to this matter.

Best regards,
Real Motor Japan`;

        // Construct the message to add to the 'messages' subcollection for the specific chat
        const addMessagePromise = admin.firestore().collection('chats').doc(chatId).collection('messages').add({
            text: messageText,
            sender: 'RMJ-Bot', // Adjust as per your sender identification strategy
            timestamp: formattedTime,
        });

        // Update the main chat document with the latest message details
        const updateChatPromise = admin.firestore().collection('chats').doc(chatId).update({
            lastMessageSender: 'RMJ-Bot',
            lastMessage: messageText,
            lastMessageDate: formattedTime,
            customerRead: false,
            // read: true,
            readBy: ['RMJ-Bot'],
        });
        await delay(500);
        promisesForOrderItemReminder.push(sendEmail(invoice.customerEmail, `Place Order Reminder | ${today}`, htmlContent));

        promisesForOrderItemReminder.push(addMessagePromise, updateChatPromise);
    });


    // Wait for all the promises to resolve

    await Promise.all(promisesForOrderItemReminder).catch(error => console.error('Error processing invoices:', error));
    await Promise.all(promisesForPaymentReminder).catch(error => console.error('Error processing invoices:', error));
    console.log('Due date reminders and messages sent for non-cancelled invoices.');

    return null;



});
// exports.updateCurrencyRatesScheduled = functions.region('asia-northeast2').pubsub.schedule('every 1 minutes').timeZone('Asia/Tokyo').onRun(async () => {
exports.updateCurrencyRatesScheduled = functions.region('asia-northeast2').pubsub.schedule('0 0 * * *').timeZone('Asia/Tokyo').onRun(async () => {
    try {
        const response = await axios.get(
            `https://openexchangerates.org/api/latest.json?app_id=28a91b51aa36420f9cbd6fb04a52ddd9`
        );

        const rates = response.data.rates;
        const usdToJpy = 1 / rates.JPY; // Invert the rate to convert USD to JPY
        const JpyToUsd = rates.JPY / 1;



        const yenToDollar = Number(usdToJpy.toFixed(4)); // Move the toFixed here
        const dollarToYen = Number(JpyToUsd.toFixed(4));

        const usdToEur = 1 / rates.EUR;
        const eurToUsd = rates.EUR;

        const usdToGbp = 1 / rates.GBP;
        const gbpToUsd = rates.GBP;

        const usdToAud = 1 / rates.AUD;
        const audToUsd = rates.AUD;


        const usdToCad = 1 / rates.CAD;
        const cadToUsd = rates.CAD;

        // Convert Yen to other currencies indirectly through USD
        const yenToEuro = yenToDollar * eurToUsd; // Convert Yen to USD first, then to Euro
        const euroToYen = dollarToYen * usdToEur; // Convert Euro to USD first, then to Yen

        const yenToGbp = yenToDollar * gbpToUsd; // Convert Yen to USD first, then to Pound Sterling
        const gbpToYen = dollarToYen * usdToGbp; // Convert Pound Sterling to USD first, then to Yen

        const yenToAud = yenToDollar * audToUsd; // Convert Yen to USD first, then to Australian Dollars
        const audToYen = dollarToYen * usdToAud; // Convert Australian Dollars to USD first, then to Yen

        const yenToCad = yenToDollar * cadToUsd; // Convert Yen to USD first, then to Canadian Dollars
        const cadToYen = dollarToYen * usdToCad; // Convert Canadian Dollars to USD first, then to Yen

        // const timestamp = response.data.timestamp;
        // const lastUpdateDate = new Date(timestamp * 1000);

        // const formattedLastUpdate = lastUpdateDate.toLocaleString('en-US', {
        //     month: 'long',
        //     day: 'numeric',
        //     year: 'numeric',
        //     hour: 'numeric',
        //     minute: 'numeric',
        //     second: 'numeric',
        //     timeZoneName: 'short',
        // });

        const firestoreTimestamp = admin.firestore.Timestamp.now();
        const firestoreDate = firestoreTimestamp.toDate();

        // Convert and format to Tokyo time (GMT+9)
        const formattedLastUpdate = moment(firestoreDate).tz("Asia/Tokyo").format('MMMM D, YYYY [at] h:mm:ss A [GMT]Z');


        const newTodayCurrency = `1 JPY = ${yenToDollar} USD / 1 USD = ${dollarToYen} JPY\n1 JPY = ${yenToEuro.toFixed(4)} EUR / 1 EUR = ${euroToYen.toFixed(4)} JPY\n1 JPY = ${yenToAud.toFixed(4)} AUD / 1 AUD = ${audToYen.toFixed(4)} JPY\n1 JPY = ${yenToGbp.toFixed(4)} GBP / 1 GBP = ${gbpToYen.toFixed(4)} JPY\n1 JPY = ${yenToCad.toFixed(4)} CAD / 1 CAD = ${cadToYen.toFixed(4)} JPY\n`;

        // Prepare and format the data for Firestore
        const currencyData = {
            jpyToUsd: Number(usdToJpy),
            usdToJpy: Number(JpyToUsd),
            jpyToEur: yenToEuro,
            eurToJpy: euroToYen,
            jpyToGbp: yenToGbp,
            gbpToJpy: gbpToYen,
            jpyToAud: yenToAud,
            audToJpy: audToYen,
            usdToEur: eurToUsd,
            eurToUsd: usdToEur,
            usdToGbp: gbpToUsd,
            gbpToUsd: usdToGbp,
            usdToAud: audToUsd,
            audToUsd: usdToAud,
            cadToUsd: usdToCad,
            usdToCad: cadToUsd,
            jpyToCad: cadToYen,
            cadToJpy: yenToCad,
            todayCurrency: newTodayCurrency,
            timestampCurrency: 'Updated Last: ' + formattedLastUpdate,
        };

        // Update Firestore with new currency rates
        const currencyRef = admin.firestore().doc('currency/currency');
        await currencyRef.set(currencyData, { merge: true });

        console.log('Currency rates updated successfully.');
    } catch (error) {
        console.error('Error updating currency rates:', error);
    }
});

exports.resetCsvData = functions.region('asia-northeast2').pubsub.schedule('0 0 * * *').timeZone('Asia/Tokyo').onRun(async () => {
    try {


        // Clear CSV contents
        const clearClientsResponse = await fetch('https://rmj-api.duckdns.org/modifyCsv/reset-csv-clients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: "jackall",
                password: "U2FsdGVkX18WCFA/fjC/fB6DMhtOOIL/xeVF2tD2b7c=",
            }),
        });

        if (clearClientsResponse.ok) {
            console.log('Success', 'CSV contents have been cleared.');
        } else {
            console.log('Error', 'Failed to clear CSV contents.');
        }

        const clearSalesInfoResponse = await fetch('https://rmj-api.duckdns.org/modifyCsv/reset-csv-sales-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: "jackall",
                password: "U2FsdGVkX18WCFA/fjC/fB6DMhtOOIL/xeVF2tD2b7c=",
            }),
        });

        if (clearSalesInfoResponse.ok) {
            console.log('Success', 'CSV contents have been cleared.');
        } else {
            console.log('Error', 'Failed to clear CSV contents.');
        }
    } catch (error) {
        console.error(error);
        console.log('Error', 'An error occurred while managing CSV data.');
    }

});