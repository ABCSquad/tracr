// //---------------------ADD IMAGE TO CANVAS FUNC-------------------------------

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
let ideez = [];
let page = document.querySelector('#addpage');
page.addEventListener('click', function () {
  console.log('adding page');
  console.log(pageNo);
  var app = `<div class="col-md-3 parent" style="float:center; padding-left: 10px; display: flex; flex-direction: column">
        <span>page ${pageNo}</span>
        <button class='del-button' name ='${pageNo}' id='remove-${pageNo}' onclick="removeDiv(this)"><i class="fa fas fa-trash"></i></button>
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
  ideez.push(pageNo);
  pageNo += 1;
  console.log('this is arr', ideez);
});

function removeDiv(elem) {
  $(elem).parent('div').remove();
  let popped = ideez.pop(elem.name);
  pageNo -= 1;
}
