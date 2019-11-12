// import { URL } from "url"

const startButton = document.querySelector('.start');
const rec = document.querySelector('.rec');
const stop = document.querySelector('.stop');
const download = document.querySelector('.download');

// проверка поддерживает ли браузер navigator.mediaDevices.getUserMedia
const hasGetUserMedia = () => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

if (hasGetUserMedia()) {
  console.log('works');
} else {
  alert('Your brouser is not supported video stream');
}

// доступ к камере

let recBlobs = [];

const video = document.querySelector('video');
console.log(video);

startButton.onclick = () => userStream();

const userStream = () =>
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true
    })
    .then(stream => {
      const mediaRecorder = new MediaRecorder(stream);

      rec.onclick = () => {
        mediaRecorder.start(10000000000);
        mediaRecorder.ondataavailable = e => recBlobs.push(e.data);
        console.log('MediaRecorder started', mediaRecorder);
        mediaRecorder.requestData();
        console.log(mediaRecorder.state);
        rec.style.background = 'red';
        stop.disabled = false;
        rec.disabled = true;
      };

      stop.onclick = () => {
        mediaRecorder.stop();
        console.log(mediaRecorder.state);
        console.log('recorder stopped');
        rec.style.background = '';
        rec.style.color = '';
        stop.disabled = true;
        rec.disabled = false;
        console.log(recBlobs);
      };

      video.srcObject = stream;
    });

download.onclick = () => {
  let link = document.createElement('a');
  link.download = 'hello.webm';
  link.href = URL.createObjectURL(recBlobs[1]);

  link.click();

  URL.revokeObjectURL(link.href);
};
