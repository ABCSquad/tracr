console.log('page refreshed');
/*
-----------------Initialization of elements-----------------
*/

//Drawing canvas initialization
const canvas = document.getElementById('draw');
canvas.width = 1280;
canvas.height = 720;
const context = canvas.getContext('2d');

//Camera canvas initialization
const cam = document.getElementById('canvas');
cam.width = 1280;
cam.height = 720;
const ctx = cam.getContext('2d');

//Video element
const video = document.getElementById('video');

/*
-----------------Mediapipe Hands start-----------------
*/

//Mapping result image to canvas
function onResults(results) {
  ctx.save();
  ctx.clearRect(0, 0, cam.width, cam.height);
  ctx.drawImage(results.image, 0, 0, cam.width, cam.height);
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
        color: '#00FF00',
        lineWidth: 5,
      });
      drawLandmarks(ctx, landmarks, { color: '#FF0000', lineWidth: 2 });
    }
  }
  if (results.multiHandLandmarks != undefined) {
    let x1 = results.multiHandLandmarks[0][8]['x'];
    let x2 = results.multiHandLandmarks[0][12]['x'];
    let y1 = results.multiHandLandmarks[0][8]['y'];
    let y2 = results.multiHandLandmarks[0][12]['y'];
    let x3 = results.multiHandLandmarks[0][0]['x'];
    let y3 = results.multiHandLandmarks[0][0]['y'];
    //console.log(Math.sqrt((x1-x2)**2 + (y1-y2)**2));
    if (
      Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2) >
      0.3 * Math.sqrt((x1 - x3) ** 2 + (y1 - y3) ** 2)
    ) {
      draw_hand(results, x1, y1);
    } else {
      stop_hand(results);
    }
  } else {
    is_drawing = false;
  }
  ctx.restore();
}

//Using mediapipe hands (CDN)
const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`;
  },
});
hands.setOptions({
  selfieMode: true,
  maxNumHands: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.5,
});
hands.onResults(onResults);

//Instantiating camera to video element
const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 1280,
  height: 720,
});

/*
-----------------Drawing section start-----------------
*/

let draw_color = 'black';
let draw_width = '3';
let is_drawing = false;

let restore_array = [];
let index = -1;

function change_color(elmnt, clr) {
  console.log('Colour changed to ' + clr);
  draw_color = clr;
}

canvas.addEventListener('touchstart', start_mouse, false); //touchstart event occurs when the user touches an element
canvas.addEventListener('touchmove', draw_mouse, false); //touchmove occurs when the user moves the finger across the screen
canvas.addEventListener('mousedown', start_mouse, false); //mousedown event occurs when a user presses a mouse button over an element
canvas.addEventListener('mousemove', draw_mouse, false); //mousemove event occurs when the pointer is moving while it is over an element

canvas.addEventListener('touchend', stop_mouse, false); //touchend occurs when the user removes the finger from an element
canvas.addEventListener('mouseup', stop_mouse, false); //mouseup event occurs when a user releases a mouse button over an element
canvas.addEventListener('mouseout', stop_mouse, false); //mouseout event occurs when the mouse pointer is moved out of an element

/*
Mousedown => Index only
Mouseup => Index+Middle
Mouseout => results.multiHandLandmarks!=undefined
Mousemove => Obviously hand move
*/

function start_mouse(event) {
  is_drawing = true;
  context.beginPath();
  context.moveTo(
    event.clientX - canvas.offsetLeft,
    event.clientY - canvas.offsetTop
  );
  event.preventDefault();
}

function draw_mouse(event) {
  if (is_drawing) {
    context.lineTo(
      event.clientX - canvas.offsetLeft,
      event.clientY - canvas.offsetTop
    );
    context.strokeStyle = draw_color;
    context.lineWidth = draw_width;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.stroke();
  }
  event.preventDefault();
}

function stop_mouse(event) {
  if (is_drawing) {
    context.stroke();
    context.closePath();
    is_drawing = false;
  }
  event.preventDefault();

  if (event.type != 'mouseout') {
    restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
    index += 1;
  }
  console.log(restore_array);
}

function draw_hand(results, x1, y1) {
  if (is_drawing == false) {
    is_drawing = true;
    context.beginPath();
    context.moveTo(
      Math.abs(x1 * canvas.width - canvas.offsetLeft),
      Math.abs(y1 * canvas.height - canvas.offsetTop)
    );
    console.log(
      'Move to ' +
        Math.abs(x1 * canvas.width - canvas.offsetLeft) +
        ' ' +
        Math.abs(y1 * canvas.height - canvas.offsetTop)
    );
  }

  if (is_drawing) {
    context.lineTo(
      Math.abs(x1 * canvas.width - canvas.offsetLeft),
      Math.abs(y1 * canvas.height - canvas.offsetTop)
    );
    console.log(
      'Line to ' +
        Math.abs(x1 * canvas.width - canvas.offsetLeft) +
        ' ' +
        Math.abs(y1 * canvas.height - canvas.offsetTop)
    );
    context.strokeStyle = draw_color;
    context.lineWidth = draw_width;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.stroke();
  }
}

function stop_hand(results, x1, y1) {
  if (is_drawing) {
    context.stroke();
    context.closePath();
    is_drawing = false;
  }

  //if (results.multiHandLandmarks != undefined) {
  restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
  index += 1;
  //console.log(restore_array);
  //}
}

function clear_canvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  restore_array = [];
  index = -1;
}

function undo_last() {
  if (index <= 0) {
    clear_canvas();
  } else {
    index -= 1;
    restore_array.pop();
    context.putImageData(restore_array[index], 0, 0);
  }
}

////////////////////CAM ON/OFF + FORM PART///////////////////////////////

document.addEventListener('DOMContentLoaded', function () {
  var checkbox = document.querySelector('input[type="checkbox"]');

  checkbox.addEventListener('change', function () {
    if (checkbox.checked) {
      // do this
      camon();
      console.log('Checked');
    } else {
      // do that
      camoff();
      console.log('Not checked');
    }
  });
});

//Turn off the camera
function camoff() {
  console.log('helloo');
  const video = document.querySelector('#video');
  const mediaStream = video.srcObject;
  const tracks = mediaStream.getTracks();
  tracks[0].stop();
  tracks.forEach((track) => track.stop());
  document.getElementById('canvas').style.opacity = '0';
}

//Turn on the camera
function camon() {
  console.log('bye');
  const camera = new Camera(video, {
    onFrame: async () => {
      await hands.send({ image: video });
    },
    width: 1280,
    height: 720,
  });
  camera.start();
  document.getElementById('canvas').style.opacity = '1';
}

// Submit post on submit
$(document).on('submit', '#form1', function (e) {
  var canva;
  canva = document.getElementById('draw');
  document.getElementById('captured_image').value =
    canva.toDataURL('image/png');
  dataUrl = document.getElementById('captured_image').value;
  e.preventDefault();
  $.ajax({
    type: 'POST',
    url: '',
    data: {
      dataURL: $('#captured_image').val(),
      csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
    },
    success: function () {},
  });
});

//Send the image data
var canva;
function save() {
  console.log('in');
}