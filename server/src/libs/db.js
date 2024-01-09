//@ts-check
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./main.db');

function initDB() {
    db.run(`CREATE TABLE IF NOT EXISTS WaitlistUsers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        submission_date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
}

/**
 * @param {string} name 
 * @param {string} email 
 */
function insertUser(name, email) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO WaitlistUsers (name, email) VALUES (?, ?)`, [name, email], (err) => {
            if (err) {
                console.log('Error inserting user: ', err.message);
                reject(err.message)
            }
            resolve("")
        });
    })
}

module.exports = {
    initDB,
    insertUser,
}