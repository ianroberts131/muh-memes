$(function() {
  var MAX_WIDTH = 150;
  var MAX_HEIGHT = 150;
  var canvas = new fabric.Canvas('avatar-canvas');
  var reader = new FileReader();
  document.getElementById('avatar-upload').onchange = function handleImage(e) {
    reader.onload = function(event) {
      $('#avatar-canvas-area').removeClass('hidden');
      $('#current-avatar').addClass('hidden');
      drawImage(reader.result);
      canvas.renderAll();
    }
    reader.readAsDataURL(e.target.files[0])
  }
  
  function drawImage(input) {
    canvas.clear();
    var imgObject = new Image();
    imgObject.src = input;
    imgObject.onload = function() {
      resizeImage(imgObject);
      var image = new fabric.Image(imgObject);
      image.set({
        angle: 0,
        padding: 0,
        height: imgObject.height,
        width: imgObject.width
      });
      image.selectable = false;
      canvas.add(image);
      canvas.sendToBack(image);
    }
  }
  
  function resizeImage(image) {
    if (image.width > image.height) {
      if (image.width > MAX_WIDTH) {
          image.height *= MAX_WIDTH / image.width;
          image.width = MAX_WIDTH;
        }
        
    } else {
      if (image.height > MAX_HEIGHT) {
        image.width *= MAX_HEIGHT / image.height;
        image.height = MAX_HEIGHT;
      }
    }
    canvas.setWidth(image.width);
    canvas.setHeight(image.height);
  }
  
});