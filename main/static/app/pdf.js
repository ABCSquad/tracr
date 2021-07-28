// //---------------------ADD IMAGE TO CANVAS FUNC-------------------------------

function getImage(id) {
  $('html,body').scrollTop(0);

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

// -------------------------PAGER----------------------------------
var pageNo = 1;

let ideez = [];
page = document.querySelector('#addpage');
page.addEventListener('click', function () {
  console.log('adding page');
  $('.show-png,.pngg').remove();
  console.log(pageNo);

  ideez.push(pageNo);

  var app = `<div class="col-md-3 parent" style="float:center; padding-left: 10px; display: flex; flex-direction: column">
        <span class='span-class' id='${pageNo}'>Page - ${
    ideez.indexOf(pageNo) + 1
  } > </span>
        <button class='del-button' name ='${pageNo}' id='remove-${pageNo}' onclick="removeDiv(this)"><i class="fa far fa-trash-alt"></i></button>
        <canvas class='pdf-canvas' id='page-${pageNo}' style="border: 1px solid; margin-bottom:20px" width="400" height="300"></canvas>
      </div>`;

  $('#pages').append(app);
  getImage(pageNo);
  console.log('this is arr', ideez);
  pageNo += 1;
  console.log('lengyth', ideez.length);
});

function removeDiv(elem) {
  $(elem).parent('div').remove();
  let i = 1;
  $('.span-class').each(function (index) {
    $(this).text(`Page - ${index + 1} >`);
  });
  let index = ideez.indexOf(parseInt(elem.name));
  if (index !== -1) {
    ideez.splice(index, 1);
  }
  console.log('lengyth', ideez.length);
}

//make the actual PDF

var pdf,
  page_section,
  HTML_Width,
  HTML_Height,
  top_left_margin,
  PDF_Width,
  PDF_Height,
  canvas_image_width,
  canvas_image_height;

function calculatePDF_height_width(selector, index) {
  page_section = $(selector).eq(index);
  HTML_Width = page_section.width();
  HTML_Height = page_section.height();
  top_left_margin = 15;
  PDF_Width = HTML_Width + top_left_margin * 2;
  PDF_Height = PDF_Width * 1.2 + top_left_margin * 2;
  canvas_image_width = HTML_Width;
  canvas_image_height = HTML_Height;
}

//Generate PDF
function generatePDF() {
  pdf = '';
  $('#downloadbtn').hide();
  $('#genmsg').show();

  var totalPages = ideez.length;
  console.log('totaaaaaaaaaaaal', totalPages);

  for (let i = 0; i <= totalPages; i++) {
    var allsel = `.pdf-canvas:eq(${i})`;
    console.log('alllllllllllllll', allsel);
    html2canvas($(allsel), {
      onrendered: function (canvas) {
        calculatePDF_height_width('.pdf-canvas', i);
        if (pdf == '') {
          pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
        } else {
          pdf.addPage(PDF_Width, PDF_Height);
        }
        var pageData = canvas.toDataURL('image/png', 1.0);
        pdf.addImage(
          pageData,
          'JPG',
          top_left_margin,
          top_left_margin,
          HTML_Width,
          HTML_Height
        );
      },
    });
  }
  let nameofpdf = getPdfName();

  setTimeout(function () {
    //Save PDF Doc
    pdf.save(nameofpdf);

    //Generate BLOB object
    var blob = pdf.output('blob');

    //Getting URL of blob object
    var blobURL = URL.createObjectURL(blob);

    //Setting download link
    var downloadLink = document.getElementById('pdf-download-link');
    downloadLink.href = blobURL;

    $('#sample-pdf').slideDown();
  }, 0);
  $('#genmsg').hide();
  $('#downloadbtn').show();
}

function getPdfName() {
  let today = new Date().toISOString().slice(0, 10);
  let defval = 'Notebook_' + today;
  let pdfname = prompt('Please enter PDF name', defval);
  return pdfname;
}
//TO DO
//1) MAKE AN ALERT---done
//3)MAKE DRAW LINES ADJUSTABLE
//2) COMPLETE PDF-----done
