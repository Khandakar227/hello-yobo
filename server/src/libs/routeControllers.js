const { ServerResponse } = require('http');
const { insertUser, getUsers } = require('./db');
const { config } = require('dotenv');

config()
/**
 * @param {import('http').IncomingMessage} req 
 * @param {import('http').ServerResponse} res 
 */
function addToWaitlist(req, res) {
    let data = '';
    req.on('data', (stream) => {
        data += stream;
    })
    req.on('end', async () => {
        try {
            const emailRgx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            const json = JSON.parse(data);

            res.setHeader('Content-type', 'application/json')

            if (!json.name || !json.email || !emailRgx.test(json.email)) {
                res.writeHead(401);
                return res.end(JSON.stringify({error: true, message: "Invalid email or name"}))
            }
            insertUser(json.name, json.email)
            .then(() => res.end(JSON.stringify({error: false, message: "Success"})))
            .catch(e => handleWaitlistError(e, res))

        } catch (error) {
            console.log("Error on add to Waitlist", error.message)
            res.writeHead(500)
            res.end(JSON.stringify({error: true, message: "Error occured on the server"}))
        }
    })
}


/**
 * @param {import('http').IncomingMessage} req 
 * @param {import('http').ServerResponse} res 
 */
function getWaitlist(req, res) {
    const authorization = req.headers.authorization
    if(!authorization) {
        res.writeHead(403)
        return res.end("Forbidden")
    }
    const token = authorization.split(" ")[1]
    if(token !== process.env.AUTH_TOKEN) {
        res.writeHead(403)
        return res.end("Forbidden")
    }
    getUsers((data) => {
        res.writeHead(200, { "Content-type": "text/html" })
        res.end(data)
    })
}

/**
 * @param {string} error
 * @param {import('http').ServerResponse} res 
 */
function handleWaitlistError(error, res) {
    if ((error)?.includes('UNIQUE'))
        return res.end(
            JSON.stringify({error: true, message: "The email is already used"})
        )
}

module.exports = {
    addToWaitlist,
    getWaitlist,
}