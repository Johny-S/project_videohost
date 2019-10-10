
const rec = document.querySelector('.rec')
const stop = document.querySelector('.stop')
const info = document.querySelector('.info')

// проверка поддерживает ли браузер navigator.mediaDevices.getUserMedia
const hasGetUserMedia = () => {
  return !!(navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia);
}
if (hasGetUserMedia()) {
  console.log('works');
} else {
  alert('Your brouser is not supported video stream');
}


// доступ к камере


const video = document.querySelector('video');
console.log(video);
const userStream = () => navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
}).then((stream) => {
  const mediaRecorder = new MediaRecorder(stream);

  let recBlobs = [];
  function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
      recBlobs.push(event.data);   
    }
  }

  rec.onclick = function () {
    mediaRecorder.start(10);
    mediaRecorder.ondataavailable = handleDataAvailable;
    console.log('MediaRecorder started', mediaRecorder);
    mediaRecorder.requestData();
    console.log(mediaRecorder.state);
    rec.style.background = "red";
    stop.disabled = false;
    rec.disabled = true;
  }

  stop.onclick = async function () {
    mediaRecorder.stop();
    console.log(mediaRecorder.state);
    console.log("recorder stopped");
    rec.style.background = "";
    rec.style.color = "";
    stop.disabled = true;
    rec.disabled = false;
    console.log(recBlobs);
    const videoURL = window.URL.createObjectURL(recBlobs);
  }

  video.srcObject = stream
});

info.onclick = function () {
  let myStream = mediaRecorder.stream;
}

const startButton = document.querySelector('.start')
console.log(startButton);

startButton.addEventListener('click', () => {
  userStream();
})

