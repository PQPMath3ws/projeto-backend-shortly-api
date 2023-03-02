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
                                    const dbSQL = "Q1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgInVzZXJzIgooCiAgICAiaWQiIFNFUklBTCBOT1QgTlVMTCBQUklNQVJZIEtFWSwKICAgICJuYW1lIiBWQVJDSEFSKDEyMCkgTk9UIE5VTEwsCiAgICAiZW1haWwiIFZBUkNIQVIoMTIwKSBOT1QgTlVMTCwKICAgICJwYXNzd29yZCIgVkFSQ0hBUig3MikgTk9UIE5VTEwsCiAgICAiY3JlYXRlZCIgVElNRVNUQU1QVFogTk9UIE5VTEwgREVGQVVMVCBOT1coKSwKICAgICJ1cGRhdGVkIiBUSU1FU1RBTVBUWiBOVUxMCik7CgpDUkVBVEUgVFlQRSBhdXRoZW50aWNhdGlvblNjaGVtZU5hbWVUeXBlIEFTIEVOVU0KKAogICAgJ0Jhc2ljJywKICAgICdCZWFyZXInLAogICAgJ0RpZ2VzdCcsCiAgICAnSE9CQScsCiAgICAnT0F1dGgnCik7CgpDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyAiYXV0aGVudGljYXRpb25zIgooCiAgICAiaWQiIFNFUklBTCBOT1QgTlVMTCBQUklNQVJZIEtFWSwKICAgICJ0b2tlbiIgVkFSQ0hBUigzMDApIE5PVCBOVUxMLAogICAgInR5cGUiIGF1dGhlbnRpY2F0aW9uU2NoZW1lTmFtZVR5cGUgTk9UIE5VTEwgREVGQVVMVCAnQmVhcmVyJywKICAgICJjcmVhdGVkIiBUSU1FU1RBTVBUWiBOT1QgTlVMTCBERUZBVUxUIE5PVygpLAogICAgImV4cGlyZV9kYXRlIiBUSU1FU1RBTVBUWiBOT1QgTlVMTCwKICAgIENPTlNUUkFJTlQgInVzZXJfaWQiIEZPUkVJR04gS0VZKCJpZCIpIFJFRkVSRU5DRVMgInVzZXJzIigiaWQiKQopOwoKQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgInNob3J0ZW5fdXJscyIKKAogICAgImlkIiBTRVJJQUwgTk9UIE5VTEwgUFJJTUFSWSBLRVksCiAgICAic2hvcnRlbl91cmwiIFZBUkNIQVIoMTApIE5PVCBOVUxMLAogICAgIm9yaWdpbmFsX3VybCIgVkFSQ0hBUigyNTUpIE5PVCBOVUxMLAogICAgImNyZWF0ZWQiIFRJTUVTVEFNUFRaIE5PVCBOVUxMIERFRkFVTFQgTk9XKCksCiAgICBDT05TVFJBSU5UICJ1c2VyX2lkIiBGT1JFSUdOIEtFWSgiaWQiKSBSRUZFUkVOQ0VTICJ1c2VycyIoImlkIikKKTsKCgpDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyAic2hvcnRlbl91cmxzX3Zpc2l0cyIKKAogICAgImlkIiBTRVJJQUwgTk9UIE5VTEwgUFJJTUFSWSBLRVksCiAgICAiaXBfYWRkcmVzcyIgVkFSQ0hBUig0MCkgTk9UIE5VTEwsCiAgICAidXNlcl9hZ2VudCIgVkFSQ0hBUigxNjApIE5PVCBOVUxMLAogICAgImFjY2Vzc2VkX2luIiBUSU1FU1RBTVBUWiBOT1QgTlVMTCBERUZBVUxUIE5PVygpLAogICAgQ09OU1RSQUlOVCAic2hvcnRlbl91cmxfaWQiIEZPUkVJR04gS0VZKCJpZCIpIFJFRkVSRU5DRVMgInNob3J0ZW5fdXJscyIoImlkIikKKTs=";
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