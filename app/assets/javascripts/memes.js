$(function() {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var MAX_WIDTH = 350;
  
  function dataURLtoBlob(dataURL) {
    var binary = atob(dataURL.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/png'});
  }
  
  $('form').submit(function(e) {
    e.preventDefault()
    var canvas = document.getElementById("canvas");
    var dataURL = canvas.toDataURL("image/png");
    var file = dataURLtoBlob(dataURL);
    var form = document.getElementById('meme-form')
    var formData = new FormData(form);
    $.ajax({
      type: 'POST',
      url: $(this).attr('action'),
      data: formData,
      contentType: false,
      dataType: "JSON"
    }).success(function(json){
      console.log("success", json);
    });
  });
  
  // $('form').submit(function( event ) {
  //   // event.preventDefault();
  //   // Convert canvas image to Base64
  //   console.log("TRIGGERED!")
  //   var canvas = document.getElementById("canvas");
  //   var dataURL = canvas.toDataURL("image/png");
  //   console.log("The dataURL propoerty of the canvas is: ",dataURL)
  //   $('#meme-upload')[0].files[0]= dataURL;
  //   // console.log("The current value is: ", curValue)
  //   // $('#remote-meme-url')[0].value = dataURL;
    
  // });
  
  function imgPrev(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      
      reader.onload = function(e) {
        createCanvas(e.target.result);
      }
      reader.readAsDataURL(input.files[0]);
    }
  }
  
  function urlPrev(input) {
    createCanvas(input);
  }
  
  function createCanvas(input) {
    var image = new Image();
    // image.crossOrigin = "Anonymous";
    image.onload = function() {
      if (image.width > MAX_WIDTH) {
        image.height *= MAX_WIDTH / image.width;
        image.width = MAX_WIDTH;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);
      
    }
    image.src = input;
  
  }
  // function to clear the canvas
  function clearCanvas(canvas) {
    var ctx = canvas.getContext('2d'); // gets reference to the canvas context
    ctx.beginPath(); // clear existing drawing paths
    ctx.save(); // store the current transformation matrix
    
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore(); // restore the transform
  }
  
  
  // adds text to the canvas, on multiple lines
  // ctx = reference to the canvas context
  // x = horizontal position for where to start adding text
  // y = vertixal position for where to start adding text
  // maxTextWidth = maximum width of the text line
  // lineHeight = height of the line
  function addTextToCanvas(ctx, text, x, y, maxTextWidth, lineHeight) {
    // splits the text into separate words so you can wrap on a new line if maxTextWidth exceeded
    var words = text.split(' ');
    var numWords = words.length;
    var addtxt = "";
    
    for(var n=0; n < numWords; n++) {
      var txtLine = addtxt + words[n] + " ";
      var metrics = ctx.measureText(txtLine);
      var txtWidth = metrics.width;
      if (txtWidth > maxTextWidth && n > 0) {
        ctx.fillText(addtxt, x, y);
        addtxt = words[n] + " ";
        y = lineHeight;
      }
      else addtxt = txtLine;
    }
    // adds the text to the canvas (sets text color, font type, and size)
    ctx.fillStyle = "white";
    ctx.font = "bold 17px sans-serif";
    ctx.textAlign = 'center'
    ctx.fillText(addtxt, x, y);
  }
  
  var maxTextWidth = canvas.width - 10;
  var lineHeight = 25;
  
  
  document.getElementById("top-text").onkeyup = function() {
    
    document.getElementById("placeholder").className = "hidden";
    document.getElementById("canvas").className = "show";
    clearCanvas(canvas);
    var memeUpload = $('#meme-upload')[0].files[0];
    console.log("The meme upload is: ", memeUpload);
    if (localFileReader.result != "") {
      url = localFileReader.result;
    } else {
      url = $("#remote-meme-url").val();
    }
    
    var image = new Image();
    image.src = url;
    if (image.width > MAX_WIDTH) {
      image.height *= MAX_WIDTH / image.width;
      image.width = MAX_WIDTH;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0, image.width, image.height);
    
    var x_pos = canvas.width / 2;
    var y_pos = 15;
    
    addTextToCanvas(ctx, this.value, x_pos, y_pos, maxTextWidth, lineHeight);
    
    var bottomText = document.getElementById("bottom-text").value;
    addTextToCanvas(ctx, bottomText, x_pos, canvas.height - 15, maxTextWidth, lineHeight);
  }
  
  document.getElementById("bottom-text").onkeyup = function() {
    document.getElementById("placeholder").className = "hidden";
    document.getElementById("canvas").className = "show";
    clearCanvas(canvas);
    
    if (localFileReader.result != "") {
      url = localFileReader.result;
    } else {
      url = $("#remote-meme-url").val();
    }
    
    var image = new Image();
    image.src = url;
    if (image.width > MAX_WIDTH) {
      image.height *= MAX_WIDTH / image.width;
      image.width = MAX_WIDTH;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0, image.width, image.height);
    
    var x_pos = canvas.width / 2;
    var y_pos = canvas.height - 15;
    
    addTextToCanvas(ctx, this.value, x_pos, y_pos, maxTextWidth, lineHeight);
    
    var topText = document.getElementById("top-text").value;
    addTextToCanvas(ctx, topText, x_pos, 15, maxTextWidth, lineHeight);
    
  }
  
  var localFileReader = new FileReader();
  
  $("#meme-upload").change(function() {
    document.getElementById("placeholder").className = "hidden";
    document.getElementById("canvas").className = "show";
    imgPrev(this);
    localFileReader.readAsDataURL(this.files[0]);
    
  });

  $("#remote-meme-url").on('input', function() {
    document.getElementById("placeholder").className = "hidden";
    document.getElementById("canvas").className = "show";
    input = $(this).val();
    urlPrev(input);
    
  });
  
});