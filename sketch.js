
const video = document.getElementById('video')
let url = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/";

Promise.all([
faceapi.nets.faceRecognitionNet.loadFromUri(url + 'face_recognition_model-weights_manifest.json'),
faceapi.nets.faceLandmark68Net.loadFromUri(url + 'face_landmark_68_model-weights_manifest.json'),
faceapi.nets.ssdMobilenetv1.loadFromUri(url + 'ssd_mobilenetv1_model-weights_manifest.json')
]).then(console.log('Model loaded'))
  .then(startVideo)


function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

if (video) {
video.addEventListener ('play', async () => {

  // const container = document.createElement("div")
  // container.style.position = "relative"
  // document.body.append(container)
  const labeledFaceDescriptors = await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
  
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = {width: video.width, height: video.height}
  faceapi.matchDimensions(canvas, displaySize)
  
  setInterval(async () => {

        const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box     
      const drawBox = new faceapi.draw.DrawBox(box, {label: result.toString()})
      drawBox.draw(canvas)
    })

    
    
  }, 100 )
  
    })

}



// async function start() {
//   const container = document.createElement("div")
//   container.style.position = "relative"
//   document.body.append(container)
  
  
  
//   let image
//   let canvas
  
//   document.body.append('Loaded')
//   imageUpload.addEventListener("change", async () => {
//     if (image) image.remove()
//     if (canvas) canvas.remove()
//     image = await faceapi.bufferToImage(imageUpload.files[0])
//     container.append(image)
//     canvas = faceapi.createCanvasFromMedia(image)
//     container.append(canvas)
//     const displaySize = {width: image.width, height: image.height}
//     faceapi.matchDimensions(canvas, displaySize)
    
    
    
//     })
//   })
// }

function loadLabeledImages(){
  const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark']
  return Promise.all(
  labels.map(async label => {
    const descriptions = []
    for (let i=1; i<= 2; i++){
      const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/WebDevSimplified/Face-Recognition-JavaScript/master/labeled_images/${label}/${i}.jpg`)
      const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
      descriptions.push(detections.descriptor)
    }
    
    return new faceapi.LabeledFaceDescriptors(label, descriptions)
  })
  )
}


function setup() {
  // createCanvas(400, 400);
}

function draw() {
  // background(220);
}
