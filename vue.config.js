const fs = require('fs');
const path = require('path');

const privateKey  = fs.readFileSync(path.join(__dirname, 'api/sslcert/private.key'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'api/sslcert/cert.pem'), 'utf8');

module.exports = {
    devServer: {
        host: '192.168.0.143',
        port: '8081',
        https: {
            key: privateKey,
            cert: certificate,
        },
        disableHostCheck: true,
    },
};