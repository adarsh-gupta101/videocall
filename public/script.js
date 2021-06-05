const socket = io("/");

const videogrid = document.getElementById("video-grid");

const myVideo = document.createElement("video");
myVideo.muted = true;
navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: { facingMode: "user" },
  })
  .then((stream) => {
    Addvideostream(myVideo, stream);
  });

const Addvideostream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videogrid.append(video);
};
