import tmi from "tmi.js";
import fs from "fs";
import r from "rethinkdb";

import dotenv from "dotenv";

const conf = dotenv.config();

const client = new tmi.client({
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [process.env.CHANNEL_NAME]
});

const rtdb_u = r.table("users");

r.connect({
  db: process.env.RTDB_DB,
  host: process.env.RTDB_HOST,
  port: process.env.RTDB_PORT
}, (err, conn) => {
  client.on(
    'message',
    (target, context, msg, self) => onMessageHandler(target, context, msg, self, conn)
  );
  client.on('connected', onConnectedHandler);
  client.connect();
});

function onMessageHandler(target, context, msg, self, conn) {
  const message = msg.split(" ");

  if (self)
    return;

  if (msg.includes("tk") || msg.includes("thekairi") 
    || msg.include("thekairi78") || msg.include("tk78"))
    return client.say(target, "Dylan ne travaille plus pour TheKairi, et il n'est pas sa secrétaire"
    + " qui plus est, alors si vous avez des questions, posez les directement aux concernés, merci!"
    );

  switch (message[0]) {
    case "!addstyle":
      if (!context.mod) return;
      const userName = message[1];
      const pointsToAdd = parseInt(message[2]);

      return rtdb_u.filter({ name: userName }).run(conn)
        .then(cursor => cursor.toArray())
        .then(data => data.length == 0 ?
          rtdb_u.insert({
            name: userName,
            points: 10,
            grade: "Newbie",
            blames: 0,
            avertissements: 0
          }).run(conn, () => {
            client.say(
              target,
              "Okay, j'ai mis à jour les points de @"
              + userName
              + ", ce qui lui fait "
              + pointsToAdd + " points."
            );
          }) :
          rtdb_u.get(data[0].id).update({ points: data[0].points + pointsToAdd })
            .run(conn, () => {
              client.say(
                target,
                "Okay, j'ai mis à jour les points de @"
                + userName
                + ", ce qui lui fait "
                + data[0].points + pointsToAdd + " points."
              );
            })
        )
        .catch(console.error);
    case "!mespoints":
      return rtdb_u.filter({ name: context.username }).run(conn)
        .then(cursor => cursor.toArray())
        .then(data => data.length == 0 ? 
          client.say(target, "T'as pas encore de point mon bon vieux " + context.username + ", soit cool, fait de bonnes vannes et ça viendra.")
          :
          client.say(target, "On dirait bien que t'as " + data[0].points + " points mon bon vieux, je sais que tu peux mieux faire que ça. Prends exemple sur BNaiiru quoi.")
        )
        .catch(console.error);
    case "!points":
      client.say(target, "Ces points? Mon gars, c'est ta nouvelle raison de vivre. Tu vivras pour avoir ces points de style. Tu seras le nouveau Barney d'New York City mon grand.")
      break;
  }

}

function onConnectedHandler(addr, port) {
  console.log("[SRV] Connecté à ", addr, ":", port);
}