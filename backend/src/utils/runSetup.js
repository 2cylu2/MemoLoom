import fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url';
import { executeQuery } from './snowflakeConnector.js';
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setup() {
    const sqlFile = path.join(__dirname, 'setupTables.sql');
    const sqlText = fs.readFileSync(sqlFile, 'utf8');

    try {
        console.log("Running Snowflake setup...");
        const statements = sqlText.split(';')
            .map(s => s.trim())
            .filter(Boolean);

        for (const stmt of statements) {
            await executeQuery(stmt);
            console.log("Executed:", stmt.substring(0, 50), "...");
        }

        console.log("Snowflake tables created successfully.");
    } catch (err) {
        console.error("Setup failed:", err);
    }
}

setup();
