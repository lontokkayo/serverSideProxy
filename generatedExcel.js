const express = require('express');
const QRCode = require('qrcode');
const ExcelJS = require('exceljs');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');


const app = express();
const upload = multer(); // for parsing multipart/form-data
const port = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.post('/generate-excel', upload.none(), async (req, res) => {
    // Extracting fields from request body
    const {
        invoiceNumber, issuingDate, shippedFrom, shippedTo, placeOfDelivery, CFS,
        buyerName, buyerAddress, buyerEmail, buyerContact, buyerFax,
        notifyName, notifyAddress, notifyEmail, notifyContact, notifyFax,
        bankName, branchName, swiftcode, bankAddress, nameOfAccountHolder, accountNumber, dueDate,
        fobText, freightText, inspectionText, fobAmount, freightAmount, inspectionAmount,
        usedVehicle, carName, chassisNumber, color, displacement, mileage, fuel, transmission, notes,
        qrCodeData
    } = req.body;

    // Path to your Excel template
    const templatePath = path.join(__dirname, '/rmj_blank_invoice_excel.xlsx');

    // Load the Excel template
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    // Get the first worksheet
    const worksheet = workbook.getWorksheet(1); // or use workbook.getWorksheet('YourSheetName');
    const qrImageBuffer = await QRCode.toBuffer(qrCodeData);

    const imageId = workbook.addImage({
        buffer: qrImageBuffer,
        extension: 'png',
    });

    worksheet.addImage(imageId, {
        tl: { col: 0.5, row: 16.5 }, // This positions the top-left of the image in cell A17
        ext: { width: 80, height: 80 } // Adjust width and height as needed
    });
    // Mapping text to specific cells
    worksheet.getCell('B1').value = invoiceNumber;
    worksheet.getCell('B2').value = issuingDate;
    worksheet.getCell('B5').value = shippedFrom;
    worksheet.getCell('B6').value = shippedTo;
    worksheet.getCell('B7').value = placeOfDelivery;
    worksheet.getCell('B8').value = CFS;

    worksheet.getCell('A11').value = buyerName;
    worksheet.getCell('A12').value = buyerAddress;
    worksheet.getCell('A13').value = buyerEmail;
    worksheet.getCell('A14').value = buyerContact;
    worksheet.getCell('A15').value = buyerFax;

    worksheet.getCell('B11').value = notifyName;
    worksheet.getCell('B12').value = notifyAddress;
    worksheet.getCell('B13').value = notifyEmail;
    worksheet.getCell('B14').value = notifyContact;
    worksheet.getCell('B15').value = notifyFax;

    worksheet.getCell('E2').value = bankName;
    worksheet.getCell('E3').value = branchName;
    worksheet.getCell('E4').value = swiftcode;
    worksheet.getCell('E5').value = bankAddress;
    worksheet.getCell('E6').value = nameOfAccountHolder;
    worksheet.getCell('E7').value = accountNumber;
    worksheet.getCell('E8').value = dueDate;

    worksheet.getCell('D11').value = fobText;
    worksheet.getCell('D12').value = freightText;
    worksheet.getCell('D13').value = inspectionText;
    worksheet.getCell('E11').value = fobAmount;
    worksheet.getCell('E12').value = freightAmount;
    worksheet.getCell('E13').value = inspectionAmount;

    worksheet.getCell('D15').value = usedVehicle;
    worksheet.getCell('D16').value = carName;
    worksheet.getCell('D17').value = chassisNumber;
    worksheet.getCell('D18').value = color;
    worksheet.getCell('D19').value = displacement;
    worksheet.getCell('D20').value = mileage;
    worksheet.getCell('D21').value = fuel;
    worksheet.getCell('D22').value = transmission;
    worksheet.getCell('D23').value = notes;

    const customFileName = `Invoice No. ${req.body.invoiceNumber} Excel.xlsm`; // Construct the filename with the invoice number

    // Prepare the response
    res.setHeader('Content-Type', 'application/vnd.ms-excel.sheet.macroEnabled.12');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURI(customFileName)}"`); // Encode the filename to ensure it's valid for HTTP headers
    await workbook.xlsx.write(res);
    res.end();
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
