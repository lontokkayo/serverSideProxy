const FtpSrv = require('ftp-srv');
const hostname = '0.0.0.0'; // Use 0.0.0.0 for external connections
const port = 21;

const ftpServer = new FtpSrv({
    url: `ftp://${hostname}:${port}`,
    anonymous: true, // For simplicity, allowing anonymous access
});

ftpServer.on('login', ({ connection }, resolve, reject) => {
    console.log('User connected');
    // You can customize the user's root directory or permissions here
    resolve({ root: '/path/to/your/ftp/directory' }); // Ensure this directory exists
});

ftpServer.listen().then(() => {
    console.log(`FTP Server started at ftp://${hostname}:${port}`);
});

const chokidar = require('chokidar');

const watcher = chokidar.watch('/path/to/your/ftp/directory', { ignored: /^\./, persistent: true });

watcher
    .on('add', path => console.log(`File added: ${path}`))
    .on('change', path => console.log(`File changed: ${path}`))
    .on('unlink', path => console.log(`File removed: ${path}`));
