const socket = io("/");
const videoGrid = document.getElementById("video-grid");

const myPeer = new Peer(undefined, {
  host: "peerjs-server.herokuapp.com",
  secure: true,
  port: 443,
});
/* const myPeer = new Peer(undefined, {
  host: "peerjs-server.herokuapp.com",
  secure: true,
  port: 443,
}); */
myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});
const myVideo = document.createElement("video");
myVideo.muted = true;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideostream(myVideo, stream);
    myPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideostream(video, userVideoStream);
      });
    });
    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });
socket.on("user-disconnected", (userId) => {
  console.log(userId);
});

/* socket.on("user-connected", (userId) => {
  console.log("user connected front", userId);
}); */
function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideostream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });
}
function addVideostream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}
