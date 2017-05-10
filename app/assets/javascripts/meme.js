$(function() {

  var imageUpload = $("#image-upload");
  var remoteURL = $('#remote-meme-url');
  var canvas = new fabric.Canvas('canvas');
  var reader = new FileReader();
  var MAX_WIDTH = 500;
  var MAX_HEIGHT = 400;
  canvas.setHeight(MAX_HEIGHT);
  canvas.setWidth(MAX_WIDTH);
  
  document.getElementById("image-upload").onchange = function handleImage(e) {
    reader.onload = function(event) {
      $('#upload-area').addClass('hidden');
      $('#canvas-area').removeClass('hidden');
      $('.meme-alteration').removeClass('disable-div');
      drawImage(reader.result);
      canvas.renderAll();
    }
    reader.readAsDataURL(e.target.files[0]);
    setTimeout(function() { 
      createTopTextBox("Enter Top Text...");
      createBottomTextBox("Enter Bottom Text...");
      
      document.getElementById("top-text").value = "Enter Top Text..."
      document.getElementById('top-color').value = '#ffffff';
      document.getElementById('top-color').value = '#ffffff';
      document.getElementById("bottom-text").value = "Enter Bottom Text..."
      document.getElementById('bottom-color').value = '#ffffff';
      document.getElementById('top-font-size-select').value = "" + textBoxTop.fontSize;
      document.getElementById('bottom-font-size-select').value = "" + textBoxBottom.fontSize;
      $('#top-center-align').addClass('active');
      $('#bottom-center-align').addClass('active');
      canvas.setActiveObject(textBoxTop);
    }, 200);
    
  }
  
  $('#remote-meme-url').on('input', function() {
    input = $(this).val();
    $('#upload-area').addClass('hidden');
    $('#canvas-area').removeClass('hidden');
    $('.meme-alteration').removeClass('disable-div');
    drawImage(input);
    canvas.renderAll();
    setTimeout(function() { 
      createTopTextBox("Enter Top Text...");
      createBottomTextBox("Enter Bottom Text...");
      
      document.getElementById("top-text").value = "Enter Top Text..."
      document.getElementById('top-color').value = '#ffffff';
      document.getElementById("bottom-text").value = "Enter Bottom Text..."
      document.getElementById('bottom-color').value = '#ffffff';
      document.getElementById('top-font-size-select').value = "" + textBoxTop.fontSize;
      document.getElementById('bottom-font-size-select').value = "" + textBoxBottom.fontSize;
      $('#top-center-align').addClass('active');
      $('#bottom-center-align').addClass('active');
      canvas.setActiveObject(textBoxTop);
    }, 200);
  });
  
  // On submit, change the meme/remote-URL value to the dataURL of the canvas
  $('form').submit(function(e) {
    var dataURL = canvas.toDataURL("image/png;base64;");
    if (remoteURL.val() === "" ) {
      $('#meme-image').val(dataURL);
    } else {
      remoteURL.val("");
      remoteURL.prop('disabled', true);
      $('#meme-image').val(dataURL);
    }
  });
  
  // clear the canvas and draw the image + text on each key stroke
  document.getElementById("top-text").onkeyup = function() {
    drawMeme();
  }
    
  // clear the canvas and draw the image + text on each key stroke
  document.getElementById("bottom-text").onkeyup = function() {
    drawMeme();
  }
  
  // Make the top font size selection both a dropdown and an input field
  var topFontSizeSelect = $('#top-font-size-select')
  topFontSizeSelect.editableSelect({ 
    filter: false,
    effects: 'fade'
  });
  
  var topSelectValue;
  $('#top-font-size-select').on('keyup', function(e){
    if (e.keyCode !== 13) {
      topSelectValue = this.value;
    } else {
      // The editable select throws the various options into an unordered list
      // First, create an HTML collection of all of the li items
      // Then, create an array out of the HTML collection
      var listOptionHTMLCollection = document.getElementById('top-font-size-div').getElementsByTagName("li");
      var listOptionArray = [].slice.call(listOptionHTMLCollection);
      var index;
      var optionExists = false;
      // Iterate over each option to determine where to add the input
      for (var i = 0; i < listOptionArray.length; i++) {
        if (topSelectValue === 1 * listOptionArray[i].innerHTML) {
          optionExists = true;
          break;
        }
        if (topSelectValue < 1 * listOptionArray[i].innerHTML) {
          index = i;
          break;
        }
        index = i + 1;
      }
      
      if (!optionExists) {
        $('#top-font-size-select').editableSelect('add', "" + topSelectValue, index);
      }
      document.getElementById('top-font-size-select').value = topSelectValue;
      drawMeme();
      $('#top-font-size-select').editableSelect('hide');
    }
  });
  
  // Change the top font size when selected
  topFontSizeSelect.on('select.editable-select', function(e) {
    drawMeme();
  });
  
  // Make the bottom font size selection both a dropdown and an input field
  var bottomFontSizeSelect = $('#bottom-font-size-select')
  bottomFontSizeSelect.editableSelect({ 
    filter: false,
    effects: 'fade'
  });
  
  var bottomSelectValue;
  $('#bottom-font-size-select').on('keyup', function(e){
    if (e.keyCode !== 13) {
      bottomSelectValue = this.value;
    } else {
      // The editable select throws the various options into an unordered list
      // First, create an HTML collection of all of the li items
      // Then, create an array out of the HTML collection
      var listOptionHTMLCollection = document.getElementById('bottom-font-size-div').getElementsByTagName("li");
      var listOptionArray = [].slice.call(listOptionHTMLCollection);
      var index;
      var optionExists = false;
      // Iterate over each option to determine where to add the input
      for (var i = 0; i < listOptionArray.length; i++) {
        if (bottomSelectValue === 1 * listOptionArray[i].innerHTML) {
          optionExists = true;
          break;
        }
        if (bottomSelectValue < 1 * listOptionArray[i].innerHTML) {
          index = i;
          break;
        }
        index = i + 1;
      }
      
      if (!optionExists) {
        $('#bottom-font-size-select').editableSelect('add', "" + bottomSelectValue, index);
      }
      document.getElementById('bottom-font-size-select').value = bottomSelectValue;
      drawMeme();
      $('#bottom-font-size-select').editableSelect('hide');
    }
  });
  
  // Change the bottom font size when selected
  bottomFontSizeSelect.on('select.editable-select', function(e) {
    drawMeme();
  });
  
  // Change the top font style when selected
  $("#top-font-style-select").on('change', function() {
    drawMeme();
  });
  
  // Change the bottom font style when selected
  $("#bottom-font-style-select").on('change', function() {
    drawMeme();
  });
  
  $("#top-color").on('input', function() {
    drawMeme();
  });
  
  $("#bottom-color").on('input', function() {
    drawMeme();
  });
  
  // Function that creates the top text box
  function createTopTextBox(text) {
    var textBoxConfig = {
      fontSize: 20,
      fontFamily: 'Arial',
      height: 60,
      top: 20,
      left: 0,
      width: canvas.width,
      textAlign: 'center',
    }
    textBoxTop = new fabric.Textbox(text, textBoxConfig);
    textBoxTop.setColor('white');
    textBoxTop.lockMovementX = true;
    canvas.add(textBoxTop);
  }
  
  // Function that creates the bottom text box
  function createBottomTextBox(text) {
    var textBoxConfig = {
      fontSize: 20,
      fontFamily: 'Arial',
      height: 60,
      top: canvas.height - 40,
      left: 0,
      width: canvas.width,
      textAlign: 'center',
    }
    textBoxBottom = new fabric.Textbox(text, textBoxConfig);
    textBoxBottom.setColor('white');
    textBoxBottom.lockMovementX = true;
    canvas.add(textBoxBottom);
  }

  // Toggle top bold option
  var topBold = $('#top-bold');
  topBold.on('click', function() {
    if(topBold.hasClass('active')) {
      topBold.removeClass('active');
    } else {
      topBold.addClass('active');
    }
    drawMeme();
  });
  
  // Toggle bottom bold option
  var bottomBold = $('#bottom-bold');
  bottomBold.on('click', function() {
    if(bottomBold.hasClass('active')) {
      bottomBold.removeClass('active');
    } else {
      bottomBold.addClass('active');
    }
    drawMeme();
  });
  
  // Toggle top italic option
  var topItalic = $('#top-italic');
  topItalic.on('click', function() {
    if(topItalic.hasClass('active')) {
      topItalic.removeClass('active');
    } else {
      topItalic.addClass('active');
    }
    drawMeme();
  });
  
  // Toggle bottom italic option
  var bottomItalic = $('#bottom-italic');
  bottomItalic.on('click', function() {
    if(bottomItalic.hasClass('active')) {
      bottomItalic.removeClass('active');
    } else {
      bottomItalic.addClass('active');
    }
    drawMeme();
  });
    
  // Toggle top align options
  var topLeftAlign = $('#top-left-align');
  var topCenterAlign = $('#top-center-align');
  var topRightAlign = $('#top-right-align');
  topLeftAlign.on('click', function() {
    if(!topLeftAlign.hasClass('active')) {
      topLeftAlign.addClass('active');
      topCenterAlign.removeClass('active');
      topRightAlign.removeClass('active');
    }
    drawMeme();
  });
  
  topCenterAlign.on('click', function() {
    if(!topCenterAlign.hasClass('active')) {
      topCenterAlign.addClass('active');
      topLeftAlign.removeClass('active');
      topRightAlign.removeClass('active');
    }
    drawMeme();
  });
  
  topRightAlign.on('click', function() {
    if(!topRightAlign.hasClass('active')) {
      topRightAlign.addClass('active');
      topLeftAlign.removeClass('active');
      topCenterAlign.removeClass('active');
    }
    drawMeme();
  });
  
  // Toggle bottom align options
  var bottomLeftAlign = $('#bottom-left-align');
  var bottomCenterAlign = $('#bottom-center-align');
  var bottomRightAlign = $('#bottom-right-align');
  bottomLeftAlign.on('click', function() {
    if(!bottomLeftAlign.hasClass('active')) {
      bottomLeftAlign.addClass('active');
      bottomCenterAlign.removeClass('active');
      bottomRightAlign.removeClass('active');
    }
    drawMeme();
  });
  
  bottomCenterAlign.on('click', function() {
    if(!bottomCenterAlign.hasClass('active')) {
      bottomCenterAlign.addClass('active');
      bottomLeftAlign.removeClass('active');
      bottomRightAlign.removeClass('active');
    }
    drawMeme();
  });
  
  bottomRightAlign.on('click', function() {
    if(!bottomRightAlign.hasClass('active')) {
      bottomRightAlign.addClass('active');
      bottomLeftAlign.removeClass('active');
      bottomCenterAlign.removeClass('active');
    }
    drawMeme();
  });
  
  var startOverButton = $('#start-over-button');
  startOverButton.on('click', function() {
    canvas.clear();
    var urlInput = document.getElementById('remote-meme-url');
    urlInput.value = null;
    $('#image-upload').filestyle('clear');
    $('#upload-area').removeClass('hidden');
    $('#canvas-area').addClass('hidden');
    $('.meme-alteration').addClass('disable-div');
  })
  
    
  function drawMeme() {
    var topText = document.getElementById("top-text").value;
    var topTextColor = document.getElementById('top-color').value;
    var bottomText = document.getElementById("bottom-text").value;
    var bottomTextColor = document.getElementById('bottom-color').value;
    var topTextSize = document.getElementById('top-font-size-select').value;
    var topTextStyle = $('#top-font-style-select option:selected').val();
    var bottomTextSize = document.getElementById('bottom-font-size-select').value;
    var bottomTextStyle = $('#bottom-font-style-select option:selected').val();
    canvas.clear();
    if (reader.result != null) {
      url = reader.result;
    } else {
      url = $('#remote-meme-url').val();
    }
    drawImage(url);    
    createTopTextBox(topText);
    textBoxTop.setColor(topTextColor);
    textBoxTop.setFontSize(Number(topTextSize));
    textBoxTop.setFontFamily(topTextStyle);
    createBottomTextBox(bottomText);
    textBoxBottom.setColor(bottomTextColor);
    textBoxBottom.setFontSize(Number(bottomTextSize));
    textBoxBottom.setFontFamily(bottomTextStyle);
    
    if(topBold.hasClass('active')) {
      textBoxTop.fontWeight = 'bold';
    } else {
      textBoxTop.fontWeight = 'normal';
    };
    
    if(bottomBold.hasClass('active')) {
      textBoxBottom.fontWeight = 'bold';
    } else {
      textBoxBottom.fontWeight = 'normal';
    };
    
    if(topItalic.hasClass('active')) {
      textBoxTop.fontStyle = 'italic';
    } else {
      textBoxTop.fontStyle = 'normal';
    };
    
    if(bottomItalic.hasClass('active')) {
      textBoxBottom.fontStyle = 'italic';
    } else {
      textBoxBottom.fontStyle = 'normal';
    };
    
    if(topLeftAlign.hasClass('active')) {
      textBoxTop.textAlign = "left"
    } else if(topCenterAlign.hasClass('active')) {
      textBoxTop.textAlign = "center"
    } else {
      textBoxTop.textAlign = "right"
    }
    
    if(bottomLeftAlign.hasClass('active')) {
      textBoxBottom.textAlign = "left"
    } else if(bottomCenterAlign.hasClass('active')) {
      textBoxBottom.textAlign = "center"
    } else {
      textBoxBottom.textAlign = "right"
    }
    
    canvas.renderAll();
  }
  
  // Function that draws the image to the canvas
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
        width: imgObject.width,
        crossOrigin: "anonymous"
      });
      image.selectable = false;
      // image.setCrossOrigin("anonymous")
      
      canvas.add(image);
      canvas.sendToBack(image);
    }
  }
  
  // Function that resizes the image to fit the canvas
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

//Saving these functions for later:
// function dataURLtoBlob(dataURL) {
//     // Decode the dataURL
//     var binary = atob(dataURL.split(',')[1]);
    
//     // Create 8-bit unsigned array
//     var array = [];
//     for(var i = 0; i < binary.length; i++) {
//       array.push(binary.charCodeAt(i));
//     }
    
//     // Return the Blob object
//     return new Blob([new Uint8Array(array)], {type: 'image/png'});
//   }
  // $('form').submit(function(e) {
  //   var dataURL = canvas.toDataURL("image/png;base64;");
  //   if (remoteURL === null) {
  //     $('#meme').val(dataURL);
  //   } else {
  //     $('#remote-meme-url').val(dataURL);
  //   }
    
  //   // var form = document.getElementById('meme-form')
  //   // var formData = new FormData();
  //   // formData.append("image", blob);
  //   // console.log(formData);
  //   // $.ajax({
  //   //   type: 'POST',
  //   //   url: $(this).attr('action'),
  //   //   data: formData,
  //   //   processData: false,
  //   //   contentType: false,
  // });

//   });