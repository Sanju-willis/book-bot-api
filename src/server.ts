// src\server.ts
import dotenv from "dotenv";
dotenv.config();

import { PORT } from "./config/env";
import app from "./app";

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
