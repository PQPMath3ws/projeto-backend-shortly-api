import * as dotenv from "dotenv";

import createDatabaseStructure from "./services/database.js";
import initializeServer from "./config/express.js";
import { openPostgresPool } from "./config/database.js";

dotenv.config();

(async function initialize() {
    openPostgresPool(process.env.DATABASE_URL);
    await createDatabaseStructure(process.env.DATABASE_URL);
    await initializeServer();
    console.log("Servidor inicializado com sucesso!");
})();