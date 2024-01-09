//@ts-check
const http = require("http");
const dotenv = require('dotenv');
const { addToWaitlist } = require("./libs/routeControllers");
const { initDB } = require("./libs/db");

dotenv.config();

const PORT = process.env.PORT;

/**
 * 
 * @param {import("http").IncomingMessage} req 
 * @param {import("http").ServerResponse} res 
 */
function requestHandler(req, res) {
    switch (req.method) {
        case 'POST':
            if(req.url == '/add-to-waitlist')
                addToWaitlist(req, res)
            break;
        default:
            res.writeHead(405, {'Content-Type': 'text/html'})
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