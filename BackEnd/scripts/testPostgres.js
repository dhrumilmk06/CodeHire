import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
    connectionString: "postgresql://postgres:Dkpost$27@localhost:5432/CodeHire",
});

async function testConnection() {
    try {
        await client.connect();
        console.log("✅ Successfully connected to PostgreSQL!");
        const res = await client.query('SELECT current_database();');
        console.log("Current Database:", res.rows[0].current_database);
        await client.end();
    } catch (err) {
        console.error("❌ Connection failed:", err.message);
    }
}

testConnection();
