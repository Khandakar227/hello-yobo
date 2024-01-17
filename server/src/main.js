//@ts-check
const http = require("http");
const dotenv = require('dotenv');
const { addToWaitlist, getWaitlist } = require("./libs/routeControllers");
const { initDB } = require("./libs/db");

dotenv.config();

const PORT = process.env.PORT;

/**
 * 
 * @param {import("http").IncomingMessage} req 
 * @param {import("http").ServerResponse} res 
 */
function requestHandler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');

    switch (req.method) {
        case 'OPTIONS':
            res.writeHead(200);
            res.end();
            break;
        case 'POST':
            if (req.url == '/add-to-waitlist')
                addToWaitlist(req, res)
            break;
        case 'GET':
            if (req.url == '/get-waitlist')
                getWaitlist(req, res)
            break;
        default:
            res.writeHead(405, { 'Content-Type': 'text/html' })
            res.end("Method not allowed");
            break;
    }
}

http
    .createServer(requestHandler)
    .listen(PORT, () => {
        initDB()
        console.log("Server is running on port ", PORT)
    })

