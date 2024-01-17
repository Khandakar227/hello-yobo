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

/**
 * @param {(data:string) => void} callback 
 */
function getUsers(callback) {
    db.all(`select id, name, email, submission_date from WaitlistUsers`, [], (err, rows) => {
        if (err) throw err;
        let data = `<style>table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
            padding: 4px;
          }</style>
        <table>
        <tr><td>ID</td><td>Name</td><td>Email</td><td>Submission Date</td></tr>`;
        rows.forEach(row => {
            data+="<tr>";
            
            data+="<td>"+row.id+"</td>";
            data+="<td>"+row.name+"</td>";
            data+="<td>"+row.email+"</td>";
            data+="<td>"+row.submission_date+"</td>";
            
            data+="</tr>";
        })
        data += "</table>";
        callback(data);
    })
}

module.exports = {
    initDB,
    insertUser,
    getUsers,
}