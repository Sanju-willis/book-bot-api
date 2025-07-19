"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)(); // Load env vars
exports.default = {
    schema: "./src/db/schema",
    out: "./drizzle",
    dialect: "postgresql", // ✅ needed for Supabase/PostgreSQL
    dbCredentials: {
        url: process.env.DATABASE_URL, // ✅ works for Supabase
    },
};
