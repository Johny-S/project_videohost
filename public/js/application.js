// import { URL } from "url"
const startButton = document.querySelector('.start');
const rec = document.querySelector('.rec');
const recProc = document.querySelector('.rec-proc');
const show = document.querySelector('.show');
const recPlus = document.querySelector('.rec-plus');

const video = document.querySelector('.video');
console.log(video);

const download = document.querySelector('.download');

let recBlobs = [];
// Таймер
const timerBox = document.getElementById('timer');

const startTimer = {
  timer: null,
  go(time, mediaRecorder) {
    let sec = `${time}`;
    timerBox.innerHTML = sec;
    this.timer = setInterval(() => {
      sec = +sec < 11 ? `0${sec - 1}` : `${sec - 1}`;
      timerBox.innerHTML = sec;
      if (sec === '00') {
        clearInterval(this.timer);
        goStop(mediaRecorder);
      }
    }, 1e3);
  },
  stop() {
    clearInterval(this.timer);
    timerBox.innerHTML = '00';
  }
};

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

startButton.onclick = () => {
  userStream();
  startButton.classList.toggle('hidden');
  rec.classList.toggle('hidden');
};

const goRec = mediaRecorder => {
  // rec.style.background = 'red';
  rec.style.color = 'red';
  rec.innerHTML = '&#149 rec &#149';
  rec.onclick = () => goStop(mediaRecorder);
  mediaRecorder.start(1e10);
  mediaRecorder.ondataavailable = e => recBlobs.push(e.data);
  console.log('MediaRecorder started', mediaRecorder);
  mediaRecorder.requestData();
  console.log(mediaRecorder.state);
  // stop.disabled = false;
  // rec.disabled = true;
  startTimer.go(10, mediaRecorder);
};

const goStop = mediaRecorder => {
  mediaRecorder.stop();
  rec.onclick = () => goRec(mediaRecorder);
  // rec.style.background = '';
  rec.style.color = '';
  rec.innerHTML = 'rec';
  startTimer.stop();
  console.log(mediaRecorder.state);
  console.log('recorder stopped');
  console.log(recBlobs);
};

const goStream = stream => {
  const mediaRecorder = new MediaRecorder(stream);

  rec.onclick = () => {
    goRec(mediaRecorder);
    rec.classList.toggle('hidden');
    recProc.classList.toggle('hidden');
  };

  recProc.onclick = () => {
    goStop(mediaRecorder);
    recProc.classList.toggle('hidden');
    show.classList.toggle('hidden');

    let stream = video.srcObject;
    let tracks = stream.getTracks();

    tracks.forEach(e => {
      e.stop();
    });
  };

  show.onclick = () => {
    show.classList.toggle('hidden');
    recPlus.classList.toggle('hidden');
    download.classList.toggle('hidden');

    let link = document.createElement('a');
    link.href = URL.createObjectURL(recBlobs[1]);

    video.src = link.href;
  };

  recPlus.onclick = () => {
    rec.classList.toggle('hidden');
    recPlus.classList.toggle('hidden');
    download.classList.toggle('hidden');
  };

  video.srcObject = stream;
};

const userStream = () => {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true
    })
    .then(goStream);
};

download.addEventListener('click', async e => {
  e.preventDefault();
  console.log('send');

  let fd = new FormData();
  fd.append('recfile', recBlobs[1], 'recfile');

  const response = await fetch('/upload', {
    method: 'POST',
    body: fd,
    headers: {
      Accept: 'application/jsone'
    }
  });
});

// download.onclick = () => {
//   let link = document.createElement('a');
//   link.download = 'hello.webm';
//   link.href = URL.createObjectURL(recBlobs[1]);

//   link.click();

//   URL.revokeObjectURL(link.href);
// };
