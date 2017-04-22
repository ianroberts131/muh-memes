// $(function() {
//   var imageUpload = $("#image-upload");
//   var remoteURL = $('#remote-meme-url');
//   var canvas = document.getElementById("canvas");
//   var ctx = canvas.getContext("2d");
//   var MAX_WIDTH = 500;
//   var MAX_HEIGHT = 400;
//   var initialImage = '/assets/panda_placeholder.png';
//   window.onload = drawImage(initialImage);
  
//   // On submit, change the meme/remote-URL value to that dataURL of the canvas
//   $('form').submit(function(e) {
//     var dataURL = canvas.toDataURL("image/png;base64;");
//     console.log("The remote URL is: ", remoteURL);
//     if (remoteURL.val() === "" ) {
//       $('#meme').val(dataURL);
//     } else {
//       $('#remote-meme-url').val(dataURL);
//     }
//   });
  
//   // Local file upload image preview function
//   function imgPrev(input) {
//     if (input.files && input.files[0]) {
//       var reader = new FileReader();
      
//       reader.onload = function(e) {
//         drawImage(e.target.result);
//       }
//       reader.readAsDataURL(input.files[0]);
//     }
//   }
  
//   // Remote URL image preview function
//   function urlPrev(input) {
//     drawImage(input);
//   }
  
//   // Function that resizes the image to fit the canvs
//   function resizeImage(image) {
//     if (image.width > image.height) {
//       if (image.width > MAX_WIDTH) {
//           image.height *= MAX_WIDTH / image.width;
//           image.width = MAX_WIDTH;
//         }
        
//     } else {
//       if (image.height > MAX_HEIGHT) {
//         image.width *= MAX_HEIGHT / image.height;
//         image.height = MAX_HEIGHT;
//       }
//     }
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     canvas.width = image.width;
//     canvas.height = image.height;
//     ctx.drawImage(image, 0, 0, image.width, image.height);
//   }
  
//   // Function that draw the image to the canv
//   function drawImage(input) {
//     var image = new Image();
//     image.src = input;
//     // image.crossOrigin = "Anonymous";
//     image.onload = function() {
//       resizeImage(image);
//     }
//   }
  
//   // function to clear the canvas
//   function clearCanvas(canvas) {
//     var ctx = canvas.getContext('2d'); // gets reference to the canvas context
//     ctx.beginPath(); // clear existing drawing paths
//     ctx.save(); // store the current transformation matrix
    
//     // Use the identity matrix while clearing the canvas
//     ctx.setTransform(1, 0, 0, 1, 0, 0);
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.restore(); // restore the transform
//   }
  
  
//   // adds text to the canvas, on multiple lines
//   // ctx = reference to the canvas context
//   // x = horizontal position for where to start adding text
//   // y = vertixal position for where to start adding text
//   // maxTextWidth = maximum width of the text line
//   // lineHeight = height of the line
  
//   function addTextToCanvas(ctx, text, x, y, maxTextWidth, lineHeight) {
//     // splits the text into separate words so you can wrap on a new line if maxTextWidth exceeded
//     var words = text.split(' ');
//     var numWords = words.length;
//     var addtxt = "";
    
//     for(var n=0; n < numWords; n++) {
//       var txtLine = addtxt + words[n] + " ";
//       var metrics = ctx.measureText(txtLine);
//       var txtWidth = metrics.width;
//       if (txtWidth > maxTextWidth && n > 0) {
//         ctx.fillText(addtxt, x, y);
//         addtxt = words[n] + " ";
//         y = lineHeight;
//       }
//       else addtxt = txtLine;
//     }
//     // adds the text to the canvas (sets text color, font type, and size)
//     ctx.fillStyle = "white";
//     ctx.font = "bold 17px sans-serif";
//     ctx.textAlign = 'center'
//     ctx.fillText(addtxt, x, y);
//   }
  
//   var maxTextWidth = canvas.width - 10;
//   var lineHeight = 25;
  
//   document.getElementById("top-text").onkeyup = function() {
//     clearCanvas(canvas);

//     if (localFileReader.result != null) {
//       url = localFileReader.result;
//     } else {
//       url = $('#remote-meme-url').val();
//     }
    
//     var image = new Image();
//     image.src = url;
//     resizeImage(image);
    
//     var x_pos = canvas.width / 2;
//     var y_pos = 15;
    
//     addTextToCanvas(ctx, this.value, x_pos, y_pos, maxTextWidth, lineHeight);
    
//     var bottomText = document.getElementById("bottom-text").value;
//     addTextToCanvas(ctx, bottomText, x_pos, canvas.height - 15, maxTextWidth, lineHeight);
//   }
  
//   document.getElementById("bottom-text").onkeyup = function() {
//     clearCanvas(canvas);
    
//     if (localFileReader.result != null) {
//       url = localFileReader.result;
//     } else {
//       url = $('#remote-meme-url').val();
//     }
    
//     var image = new Image();
//     image.src = url;
//     resizeImage(image);
    
//     var x_pos = canvas.width / 2;
//     var y_pos = canvas.height - 15;
    
//     addTextToCanvas(ctx, this.value, x_pos, y_pos, maxTextWidth, lineHeight);
    
//     var topText = document.getElementById("top-text").value;
//     addTextToCanvas(ctx, topText, x_pos, 15, maxTextWidth, lineHeight);
    
//   }
  
//   var localFileReader = new FileReader();
  
//   imageUpload.change(function() {
//     imgPrev(this);
//     localFileReader.readAsDataURL(this.files[0]);
//     $('.meme-alteration-section').removeClass('hidden');
//     $('.meme-upload-section').addClass('hidden');
    
//   });

//   $('#remote-meme-url').on('input', function() {
//     input = $(this).val();
//     urlPrev(input);
//   });
  
// });

// //Saving these functions for later:
// // function dataURLtoBlob(dataURL) {
// //     // Decode the dataURL
// //     var binary = atob(dataURL.split(',')[1]);
    
// //     // Create 8-bit unsigned array
// //     var array = [];
// //     for(var i = 0; i < binary.length; i++) {
// //       array.push(binary.charCodeAt(i));
// //     }
    
// //     // Return the Blob object
// //     return new Blob([new Uint8Array(array)], {type: 'image/png'});
// //   }
//   // $('form').submit(function(e) {
//   //   var dataURL = canvas.toDataURL("image/png;base64;");
//   //   if (remoteURL === null) {
//   //     $('#meme').val(dataURL);
//   //   } else {
//   //     $('#remote-meme-url').val(dataURL);
//   //   }
    
//   //   // var form = document.getElementById('meme-form')
//   //   // var formData = new FormData();
//   //   // formData.append("image", blob);
//   //   // console.log(formData);
//   //   // $.ajax({
//   //   //   type: 'POST',
//   //   //   url: $(this).attr('action'),
//   //   //   data: formData,
//   //   //   processData: false,
//   //   //   contentType: false,
//   // });

// //   });