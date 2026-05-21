import app from "./app"
import config from "./config";
import { initDB } from "./db";

const main = () => {
  app.listen(config.port, () => {
    initDB();
    console.log(`App listening on port ${config.port}`);
  })
};

main();