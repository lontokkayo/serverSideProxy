const ftp = require("basic-ftp");

async function listFTPContents() {
    const client = new ftp.Client();
    client.ftp.verbose = true; // Enable verbose logging to see the details of the connection

    try {
        await client.access({
            host: "rmj-api.duckdns.org",
            user: "jackall",
            password: "U2FsdGVkX18WCFA/fjC/fB6DMhtOOIL/xeVF2tD2b7c=", // Use the decrypted password here
            // secure: false // Set to true if your server supports FTPS
        });
        
        console.log("Current directory:", await client.pwd());
        const list = await client.list("/");
        console.log(list);
    }
    catch (err) {
        console.error(err);
    }
    client.close();
}

listFTPContents();
