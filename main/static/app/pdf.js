// //---------------------ADD IMAGE TO CANVAS FUNC-------------------------------
// var element = $('#expression-block'); // global variable
// var getCanvas; // global variable
// var getImage;

// $('#btnConvert').on('click', function () {
//   console.log('converter');
//   html2canvas(element, {
//     allowTaint: true,
//     logging: true,
//     windowWidth: element.scrollWidth,
//     windowHeight: element.scrollHeight,
//     onrendered: function (canvas) {
//       $('#container-canvas').append(canvas);
//       console.log(canvas);
//       getCanvas = canvas;
//       getImage = getCanvas.toDataURL('image/png');
//       console.log(getImage);
//     },
//   });
// });

function getImage(id) {
  //var testdiv = document.getElementById("testdiv");
  let myImage;
  html2canvas($('#all-canvas'), {
    onrendered: function (canvas) {
      // canvas is the final rendered <canvas> element
      myImage = canvas.toDataURL('image/png');
      getImageToCanvas(id, myImage);
    },
  });
}

function getImageToCanvas(id, image) {
  // GET THE IMAGE.
  var img = new Image();
  img.src = `${image}`;

  // WAIT TILL IMAGE IS LOADED.
  img.onload = function () {
    fill_canvas(id, img); // FILL THE CANVAS WITH THE IMAGE.
  };

  function fill_canvas(id, img) {
    // CREATE CANVAS CONTEXT.
    let konva = document.querySelector(`#page-${id}`);
    let cont = konva.getContext('2d');
    img.height = cont.height;
    img.width = cont.width;
    cont.drawImage(img, 0, 0, 400, 300); // DRAW THE IMAGE TO THE CANVAS.
    cont.save();
  }
}

let pageNo = 1;
let page = document.querySelector('#addpage');
page.addEventListener('click', function () {
  console.log('adding page');
  console.log(pageNo);
  var app = `<div class="col-md-3" style="float:center; padding-left: 10px; display: flex; flex-direction: column">
        <span>Page ${pageNo}</span>
        
        <canvas id='page-${pageNo}' style="border: 1px solid" width="400" height="300"></canvas>
      </div>`;
  $('#pages').append(app);

  // document.querySelector(
  //   '#pages'
  // ).innerHTML += `<div class="col-md-3" style="float:center; padding-left: 10px; display: flex; flex-direction: column">
  //       <span>Page ${pageNo}</span>
  //       <canvas id='page-${pageNo}' style="border: 1px solid" width="400" height="300"></canvas>
  //     </div>`;
  getImage(pageNo);
  // getImageToCanvas(pageNo, image);
  pageNo += 1;
});

// let page = document.querySelector('.removepage');
// let getId = document.querySelector('.removepage').id;
// console.log('getting id of remove element', getId);
// page.addEventListener('click', function () {
//   console.log('removing page');
//   $('#pages').removeChild(page);
// });
