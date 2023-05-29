const app = require("./app.js");
const { config } = require("dotenv");
const { db } = require('./db/db.js');

config();

db.sequelize.sync().then(() => {
  console.log("db has been re sync")
});

app.listen(process.env.PORT || 3333, () => console.log("Server running"));

async function failGracefully() {
  console.log("Something is gonna blow up.");
  process.exit(0);
}

process.on("SIGTERM", failGracefully);
process.on("SIGINT", failGracefully);
