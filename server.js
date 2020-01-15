import r from "rethinkdb";
import dotenv from "dotenv";

// eslint-disable-next-line no-unused-vars
const conf = dotenv.config();

const client = new tmi.client({
    identity: {
      username: process.env.BOT_USERNAME,
      password: process.env.OAUTH_TOKEN
    },
    channels: [process.env.CHANNEL_NAME]
  });
  
  const rtdb_u = r.table("users");