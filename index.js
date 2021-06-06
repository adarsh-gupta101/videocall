const express = require("express");
const app = express();
const { v4: uuidV4 } = require("uuid");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cors = require("cors");

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.use("/peerjs", peerServer);
app.set("view engine", "ejs");
app.use(express.static("public"));
/* app.use(cors()); */
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});
app.get("/tes", (rr, res) => {
  res.send("hi");
});
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    console.log(roomId, userId);
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
    /* socket.on("message", (message) => { 
      io.to(roomId).emit("createMessage", message, userName);
    }); */
  });
  socket.on("disconnect", () => {
    console.log("user-disconnected");
  });
});

server.listen(process.env.PORT ||3000, () => {
  console.log("server running in port 3000");
});
