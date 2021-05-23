// var user = document.getElementById("user")
var video = document.getElementById("play")
var videoElem = document.getElementById("video")
var logElem = document.getElementById("log")
var uploadElem = document.getElementById("uploadElem")
var startElem = document.getElementById("start")
var stopElem = document.getElementById("stop")
var download = document.getElementById("download")
let recorder, stream; 
let audioTrack, videoTrack; 
var user = false 
const gdmOptions = {
    video: {
        cursor: "always"
    },
    audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
    }
}       
async function startCapture() {
    logElem.innerHTML = "";
    videoElem.classList.remove('hidden')
    video.classList.add('hidden')
    try {
        navigator.mediaDevices.getDisplayMedia({video:true})
            .then(displayStream =>{
                [videoTrack] = displayStream.getVideoTracks() 
                navigator.mediaDevices.getUserMedia({audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        sampleRate: 44100
                    }})
                    .then(audioStream=>{
                        [audioTrack] = audioStream.getAudioTracks()
                        stream = new MediaStream([videoTrack, audioTrack])                                
                        videoElem.srcObject = stream 
                        recorder = new MediaRecorder(stream)                                                
                        const chunks = []
                        recorder.ondataavailable = e => {
                            chunks.push(e.data)                                    
                        }
                        recorder.onstop = e => {    
                            // console.log(chunks.length)                
                            videoElem.classList.add('hidden')
                            video.classList.remove('hidden')
                            const completed = new Blob(chunks, {type: chunks[0].type})
                            video.src = URL.createObjectURL(completed)                                       
                            download.href = window.URL.createObjectURL(completed)                                        
                        }
                        recorder.start()
                        dumpOptionsInfo();
                    })
        })
    } catch(err) {
        console.error("Error: " + err);
    }
}

function uploadVideoResource() {

}

function dumpOptionsInfo() {
    const videoTrack = videoElem.srcObject.getVideoTracks()[0];
    
    console.log = msg => logElem.innerHTML += `${msg}<br>`;
    logElem.innerHTML = JSON.stringify(videoTrack.getSettings(), null, 2)
    console.info("Track settings:");
    console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
    console.info("Track constraints:");
    console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
}

// function toggle(){            
//     if(user == false) {
//         user = true
//         videoElem.srcObject = navigator.mediaDevices.getUserMedia({video:true})
//     }else {
//         user = false
//         videoElem.srcObject = stream
//     }
// }

// toggleElem.addEventListener('click', toggle())
function stopCapture(evt) {
    console.log(evt)
    let tracks = videoElem.srcObject.getTracks();
    tracks.forEach(track => track.stop());            
    recorder.stop()
    stream.getVideoTracks()[0].stop()            
    // videoElem.srcObject = null;
}


startElem.addEventListener("click", function(evt){
    startCapture()
}, false)    

stopElem.addEventListener("click", function(evt){
    stopCapture()
}, false)        