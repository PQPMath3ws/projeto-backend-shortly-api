import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";

import { closePostgresPoolAndClient } from "./database.js";

import AllRoutes from "../routes/AllRoutes.js";
import RankingRoutes from "../routes/Ranking.js";
import SignRoutes from "../routes/Sign.js";
import UrlsRoutes from "../routes/Urls.js";
import UsersRoutes from "../routes/Users.js";

dotenv.config();

const app = express();
let server = null;

async function onShutDownServer() {
    if (server) {
        closePostgresPoolAndClient((error) => {
            if (error) console.log(error);
            server.close(() => {
                process.exit(0);
            });
        });
    }
}

async function initializeServer() {
    if (!server) {
        app.use(cors());
        app.use(express.json());

        app.use(RankingRoutes);
        app.use(SignRoutes);
        app.use(UrlsRoutes);
        app.use(UsersRoutes);
        app.use(AllRoutes);

        server = app.listen(process.env.PORT || 5000);
    }

    process.on("SIGTERM", async () => await onShutDownServer());
    process.on("SIGINT", async () => await onShutDownServer());
}

export default initializeServer;
