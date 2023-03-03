import { closePostgresPoolAndClient, getPostgresClient, openPostgresClient, openPostgresPool, releaseClient } from "../config/database.js";

async function createDatabaseStructure(database_url_with_db) {
    await openPostgresClient(async (error) => {
        if (error) {
            if (error.code === "3D000") {
                await closePostgresPoolAndClient(async (error) => {
                    if (error) throw new Error(error);
                    openPostgresPool(`${database_url_with_db.split("/").slice(0, database_url_with_db.split("/").length - 1).join("/")}/postgres`);
                    await openPostgresClient(async (error) => {
                        if (error) throw new Error(error);
                        try {
                            await getPostgresClient().query("CREATE DATABASE shortly_db;");
                            await closePostgresPoolAndClient(async (error) => {
                                if (error) throw new Error(error);
                                openPostgresPool(database_url_with_db);
                                await openPostgresClient(async (error) => {
                                    if (error) throw new Error(error);
                                    const dbSQL = "Q1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgInVzZXJzIgooCiAgICAiaWQiIFNFUklBTCBOT1QgTlVMTCBQUklNQVJZIEtFWSwKICAgICJuYW1lIiBWQVJDSEFSKDEyMCkgTk9UIE5VTEwsCiAgICAiZW1haWwiIFZBUkNIQVIoMTIwKSBOT1QgTlVMTCwKICAgICJwYXNzd29yZCIgVkFSQ0hBUig3MikgTk9UIE5VTEwsCiAgICAiY3JlYXRlZEF0IiBUSU1FU1RBTVBUWiBOT1QgTlVMTCBERUZBVUxUIE5PVygpLAogICAgInVwZGF0ZWQiIFRJTUVTVEFNUFRaIE5VTEwKKTsKCkNSRUFURSBUWVBFIGF1dGhlbnRpY2F0aW9uU2NoZW1lTmFtZVR5cGUgQVMgRU5VTQooCiAgICAnQmFzaWMnLAogICAgJ0JlYXJlcicsCiAgICAnRGlnZXN0JywKICAgICdIT0JBJywKICAgICdPQXV0aCcKKTsKCkNSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTICJhdXRoZW50aWNhdGlvbnMiCigKICAgICJpZCIgU0VSSUFMIE5PVCBOVUxMIFBSSU1BUlkgS0VZLAogICAgInRva2VuIiBWQVJDSEFSKDMwMCkgTk9UIE5VTEwsCiAgICAidHlwZSIgYXV0aGVudGljYXRpb25TY2hlbWVOYW1lVHlwZSBOT1QgTlVMTCBERUZBVUxUICdCZWFyZXInLAogICAgImNyZWF0ZWRBdCIgVElNRVNUQU1QVFogTk9UIE5VTEwgREVGQVVMVCBOT1coKSwKICAgICJleHBpcmVfZGF0ZSIgVElNRVNUQU1QVFogTk9UIE5VTEwsCiAgICAidXNlcl9pZCIgU0VSSUFMIE5PVCBOVUxMIFJFRkVSRU5DRVMgInVzZXJzIigiaWQiKQopOwoKQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgInNob3J0ZW5fdXJscyIKKAogICAgImlkIiBTRVJJQUwgTk9UIE5VTEwgUFJJTUFSWSBLRVksCiAgICAic2hvcnRlbl91cmwiIFZBUkNIQVIoMTApIE5PVCBOVUxMLAogICAgIm9yaWdpbmFsX3VybCIgVkFSQ0hBUigyNTUpIE5PVCBOVUxMLAogICAgImNyZWF0ZWRBdCIgVElNRVNUQU1QVFogTk9UIE5VTEwgREVGQVVMVCBOT1coKSwKICAgICJ1c2VyX2lkIiBTRVJJQUwgTk9UIE5VTEwgUkVGRVJFTkNFUyAidXNlcnMiKCJpZCIpCik7CgoKQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgInNob3J0ZW5fdXJsc192aXNpdHMiCigKICAgICJpZCIgU0VSSUFMIE5PVCBOVUxMIFBSSU1BUlkgS0VZLAogICAgImlwX2FkZHJlc3MiIFZBUkNIQVIoNDApIE5PVCBOVUxMLAogICAgInVzZXJfYWdlbnQiIFZBUkNIQVIoMTYwKSBOT1QgTlVMTCwKICAgICJhY2Nlc3NlZF9pbiIgVElNRVNUQU1QVFogTk9UIE5VTEwgREVGQVVMVCBOT1coKSwKICAgICJzaG9ydGVuX3VybF9pZCIgU0VSSUFMIE5PVCBOVUxMIFJFRkVSRU5DRVMgInNob3J0ZW5fdXJscyIoImlkIikKKTsKCkFMVEVSIFRBQkxFICJhdXRoZW50aWNhdGlvbnMiIEFERCBDT05TVFJBSU5UICJma191c2VyX2lkIiBGT1JFSUdOIEtFWSgidXNlcl9pZCIpIFJFRkVSRU5DRVMgInVzZXJzIigiaWQiKTsKCkFMVEVSIFRBQkxFICJzaG9ydGVuX3VybHMiIEFERCBDT05TVFJBSU5UICJma191c2VyX2lkIiBGT1JFSUdOIEtFWSgidXNlcl9pZCIpIFJFRkVSRU5DRVMgInVzZXJzIigiaWQiKTsKCkFMVEVSIFRBQkxFICJzaG9ydGVuX3VybHNfdmlzaXRzIiBBREQgQ09OU1RSQUlOVCAiZmtfc2hvcnRlbl91cmxfaWQiIEZPUkVJR04gS0VZKCJzaG9ydGVuX3VybF9pZCIpIFJFRkVSRU5DRVMgInNob3J0ZW5fdXJscyIoImlkIik7";
                                    const b64Decoded = Buffer.from(dbSQL, "base64").toString("utf-8");
                                    try {
                                        await getPostgresClient().query(b64Decoded);
                                        releaseClient();
                                    } catch (error) {
                                        throw new Error(error);
                                    }
                                });
                            });
                        } catch (error) {
                            throw new Error(error);
                        }
                    });
                });
                console.log("Informações do banco postgres criadas com sucesso!");
            } else {
                throw new Error(error);
            }
        } else {
            console.log("Banco de dados já inicializado!");
            releaseClient();
        }
    });
}

export default createDatabaseStructure;