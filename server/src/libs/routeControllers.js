const { ServerResponse } = require('http');
const { insertUser } = require('./db');

/**
 * 
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

            res.writeHead(200, { 'Content-type': 'application/json' })

            if (!json.name || !json.email || !emailRgx.test(json.email)) {
                res.writeHead(401);
                return res.end('{error: true, message: "Invalid email or name"}')
            }
            insertUser(json.name, json.email)
            .then(e => res.end(`{error: false, message: Success}`))
            .catch(e => handleWaitlistError(e, res))

        } catch (error) {
            console.log("Error on add to Waitlist", error.message)
            res.writeHead(500)
            res.end("Error occured on the server")
        }
    })
}
/**
 * @param {string} error
 * @param {import('http').ServerResponse} res 
 */
function handleWaitlistError(error, res) {
    if ((error || "").includes('UNIQUE')) return res.end('{error: true, message: "The email is already used"}')
}

module.exports = {
    addToWaitlist
}