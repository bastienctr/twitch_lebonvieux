import r from "rethinkdb";
import dotenv from "dotenv";
import ioc from "socket.io";

const io = ioc(3002);
io.origins(["*:*"]);

// eslint-disable-next-line no-unused-vars
const conf = dotenv.config();

const rtdb_m = r.table("music");

io.on('connect', socket => {
    r.connect({
        db: process.env.RTDB_DB,
        host: process.env.RTDB_HOST,
        port: process.env.RTDB_PORT
      }, (err, conn) => {
        rtdb_m.changes().run(conn, (err, cursor) => {
            cursor.each((err, e) => {
                if (e.old_val == null && e.new_val) {
                    socket.emit("new_music", e.new_val);
                }
            });
        });
    });
});

