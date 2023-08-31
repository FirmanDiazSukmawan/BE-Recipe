const { createClient } = require("redis");

// const client = createClient();
const client = createClient({ url: "redis://127.0.0.1:6379" });

client.on("error", err => console.log("Redis Client error", err));

client.connect();
// client.disconnect();

module.exports = client;