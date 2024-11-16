const mysql = require('mysql2/promise');
const config = require('../config');

// Create a single connection (instead of a pool)
async function getConnection() {
    const connection = await mysql.createConnection(config.db);
    await connection.beginTransaction();  // Begin a transaction
    return connection;
}

// Query execution using single connection
async function query(connection, sql, params) {
    const [results] = await connection.execute(sql, params); // Use connection.execute() here
    return results;
}

module.exports = { getConnection, query };
