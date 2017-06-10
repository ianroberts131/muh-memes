$(document).on("turbolinks:load", function() {
  // Make sure this javascript file only loads on the users show page
  if($(".users.show").length === 0) {
    return;
  }
  
  // This is supposed to help with image/object blurring
  fabric.Image.prototype.strokeWidth = 0;
  fabric.Object.prototype.objectCaching = false;
  
  // Fixes the renderText function to draw outline OUTSIDE of text, rather than inside
  fabric.Text.prototype._renderText = function(ctx) {
    this._renderTextFill(ctx);
    this._renderTextStroke(ctx);
    this._renderTextFill(ctx);
  };
  
  var imageUpload = $("#image-upload");
  var remoteURL = $('#remote-meme-url');
  var canvas = new fabric.Canvas('canvas', {
    isDrawingMode: false
  });
  var reader = new FileReader();
  var MAX_WIDTH = 400;
  var MAX_HEIGHT = 400;
  canvas.setHeight(MAX_HEIGHT);
  canvas.setWidth(MAX_WIDTH);
  
  // Drag and Drop File Upload
  document.getElementById('upload-area').addEventListener('dragover', function(e) {
    // prevent browser from trying to open file directly
    e.preventDefault();
    // prevent event from bubbling up the DOM
    e.stopPropagation();
    // add effect on dragover event
    $("#upload-area").addClass('dragover');
  });
  
  document.getElementById('upload-area').addEventListener('dragleave', function(e) {
    // prevent browser from trying to open file directly
    e.preventDefault();
    // prevent event from bubbling up the DOM
    e.stopPropagation();
    // remove effect from dragover event
    $("#upload-area").removeClass('dragover');
  });
  
  document.getElementById('upload-area').addEventListener('drop', function(e) {
     // prevent browser from trying to open file directly
    e.preventDefault();
    // prevent event from bubbling up the DOM
    e.stopPropagation();
    // remove effect from dragover event
    $("#upload-area").removeClass('dragover');
      reader.onload = function(event) {
        $('#upload-area').addClass('hidden');
        $('#canvas-area').removeClass('hidden');
        $('.meme-alteration').removeClass('disable-div');
        drawImage(reader.result);
        canvas.renderAll();
      }
      files = e.dataTransfer.files[0];
      reader.readAsDataURL(files);
  })
  
  // Click File Upload
  document.getElementById("image-upload").onchange = function handleImage(e) {
    reader.onload = function(event) {
      $('#upload-area').addClass('hidden');
      $('#canvas-area').removeClass('hidden');
      $('.meme-alteration').removeClass('disable-div');
      drawImage(reader.result);
      canvas.renderAll();
    }
    reader.readAsDataURL(e.target.files[0]);
  }
  
  $('#remote-meme-url').on('input', function() {
    input = $(this).val();
    $('#upload-area').addClass('hidden');
    $('#canvas-area').removeClass('hidden');
    $('.meme-alteration').removeClass('disable-div');
    drawImage(input);
    canvas.renderAll();
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
  
  // Text from text box mirrored in the text input fields
  // Clears other text box if initial prompt still present to mimick placeholders
  canvas.on("text:changed", function(e) {
    var element = e.target;
    if (element === textBoxTop) {
      document.getElementById("top-text").value = textBoxTop.getText();
      if (textBoxBottom.getText() === "Enter Bottom Text...") {
        textBoxBottom.setText("");
      }
    } else if (element === textBoxBottom) {
      document.getElementById("bottom-text").value = textBoxBottom.getText();
      if (textBoxTop.getText() === "Enter Top Text...") {
        textBoxTop.setText("");
      }
    }
  });
  
  // clear the canvas and draw the image + text on each key stroke
  $("#top-text").on("change keyup select input", function() {
    drawMeme();
  });
    
  // clear the canvas and draw the image + text on each key stroke
  $("#bottom-text").on("change keyup select input", function() {
    drawMeme();
  });
  
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
      fontSize: 36,
      height: 60,
      fontFamily: 'Impact',
      stroke: "black",
      strokeWidth: 5,
      top: 20,
      left: 0,
      width: canvas.width,
      textAlign: 'center',
    }
      
      textBoxTop = new fabric.Textbox(text, textBoxConfig);
      setTimeout(function(){
        document.getElementById('top-font-style-select').value = "Impact-Outline";
        textBoxTop.lockMovementX = true;
        canvas.add(textBoxTop);
        textBoxTop.setFontFamily("Impact");
        textBoxTop.setColor('white');
      }, 300);
      
  }
  
  // Function that creates the bottom text box
  function createBottomTextBox(text) {
    var textBoxConfig = {
      fontSize: 36,
      height: 60,
      fontFamily: 'Impact',
      top: canvas.height - 60,
      left: 0,
      width: canvas.width,
      stroke: 'black',
      strokeWidth: 5,
      textAlign: 'center',
    }
    
    textBoxBottom = new fabric.Textbox(text, textBoxConfig);
    setTimeout(function(){
      textBoxBottom.setColor('white');
      document.getElementById('bottom-font-style-select').value = "Impact-Outline";
      textBoxBottom.lockMovementX = true;
      canvas.add(textBoxBottom);
    }, 300);
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
  
  var startOverButton = $('#start-over-button');
  startOverButton.on('click', function() {
    canvas.clear();
    canvas.isDrawingMode = false;
    $("#text-input").removeClass("hidden");
    $("#free-draw-options").addClass("hidden");
    $("#drawing-mode-button-wrapper").removeClass("hidden");
    $("#drawing-mode-label").removeClass("hidden");
    $("#drawing-mode-button-off-wrapper").addClass("hidden");
    $("#drawing-line-width").val("2");
    $("#line-width-value").html("2");
    $("#drawing-color").val("#FFFFFF");
    var urlInput = document.getElementById('remote-meme-url');
    document.getElementById("top-text").value = ""
    document.getElementById("top-text").placeholder = "Enter Top Text..."
    document.getElementById('top-color').value = '#ffffff';
    document.getElementById('top-color').value = '#ffffff';
    document.getElementById("bottom-text").value = ""
    document.getElementById("bottom-text").placeholder = "Enter Bottom Text..."
    document.getElementById('bottom-color').value = '#ffffff';
    document.getElementById('top-font-size-select').value = 26;
    document.getElementById('top-font-style-select').value = "Impact-Outline";
    document.getElementById('bottom-font-size-select').value = 26;
    document.getElementById('bottom-font-style-select').value = "Impact-Outline";
    $('#image-upload').filestyle('clear');
    $('#upload-area').removeClass('hidden');
    $('#canvas-area').addClass('hidden');
    $('.meme-alteration').addClass('disable-div');
  });
  
  var drawModeButton = $("#drawing-mode-button-wrapper");
  var drawModeButtonOff = $("#drawing-mode-button-off");
  var drawMode = $("#drawing-mode-selector");
  var drawColor = $("#drawing-color");
  var drawLineWidth = $("#drawing-line-width");
  
  drawModeButton.on('click', function() {
    $("#drawing-mode-selector").val("Pencil");
    $("#drawing-line-width").val("2");
    $("#line-width-value").html("2");
    $("#drawing-color").val("#FFFFFF");
    if (textBoxTop.getText() === "Enter Top Text...") {
      textBoxTop.setText("");
    }
    if (textBoxBottom.getText() === "Enter Bottom Text...") {
      textBoxBottom.setText("");
    }
    canvas.isDrawingMode = !canvas.isDrawingMode;
    if(canvas.isDrawingMode) {
      $("#text-input").addClass("hidden");
      $("#free-draw-options").removeClass("hidden");
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.color = drawColor.val();
      canvas.freeDrawingBrush.width = parseInt(drawLineWidth.val(), 10) || 2;
      $("#drawing-mode-button-wrapper").addClass("hidden");
      $("#drawing-mode-label").addClass("hidden");
      $("#drawing-mode-button-off-wrapper").removeClass("hidden");
    } else {
      $("#text-input").removeClass("hidden");
      $("#free-draw-options").addClass("hidden");
      $("#drawing-mode-button-wrapper").removeClass("hidden");
      $("#drawing-mode-label").removeClass("hidden");
      $("#drawing-mode-button-off-wrapper").addClass("hidden");
    }
  });
  
  drawModeButtonOff.on('click', function() {
    $("#select-objects").removeClass("selection-mode-color");
    $("#select-objects").html("Select Objects");
    canvas.isDrawingMode = false;
    $("#text-input").removeClass("hidden");
    $("#free-draw-options").addClass("hidden");
    $("#drawing-mode-button-wrapper").removeClass("hidden");
    $("#drawing-mode-label").removeClass("hidden");
    $("#drawing-mode-button-off-wrapper").addClass("hidden");
  });
  
  var vLinePatternBrush = new fabric.PatternBrush(canvas);
    vLinePatternBrush.getPatternSrc = function() {

      var patternCanvas = fabric.document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = 10;
      var ctx = patternCanvas.getContext('2d');

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.lineTo(10, 5);
      ctx.closePath();
      ctx.stroke();

      return patternCanvas;
    };

    var hLinePatternBrush = new fabric.PatternBrush(canvas);
    hLinePatternBrush.getPatternSrc = function() {

      var patternCanvas = fabric.document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = 10;
      var ctx = patternCanvas.getContext('2d');

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(5, 10);
      ctx.closePath();
      ctx.stroke();

      return patternCanvas;
    };

    var squarePatternBrush = new fabric.PatternBrush(canvas);
    squarePatternBrush.getPatternSrc = function() {

      var squareWidth = 10, squareDistance = 2;

      var patternCanvas = fabric.document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
      var ctx = patternCanvas.getContext('2d');

      ctx.fillStyle = this.color;
      ctx.fillRect(0, 0, squareWidth, squareWidth);

      return patternCanvas;
    };

    var diamondPatternBrush = new fabric.PatternBrush(canvas);
    diamondPatternBrush.getPatternSrc = function() {

      var squareWidth = 10, squareDistance = 5;
      var patternCanvas = fabric.document.createElement('canvas');
      var rect = new fabric.Rect({
        width: squareWidth,
        height: squareWidth,
        angle: 45,
        fill: this.color
      });

      var canvasWidth = rect.getBoundingRectWidth();

      patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
      rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

      var ctx = patternCanvas.getContext('2d');
      rect.render(ctx);

      return patternCanvas;
    };
  
  $("#drawing-mode-selector").on('change', function() {
    if (this.value === 'Hline') {
      canvas.freeDrawingBrush = vLinePatternBrush;
    }
    else if (this.value === 'Vline') {
      canvas.freeDrawingBrush = hLinePatternBrush;
    }
    else if (this.value === 'Square') {
      canvas.freeDrawingBrush = squarePatternBrush;
    }
    else if (this.value === 'Diamond') {
      canvas.freeDrawingBrush = diamondPatternBrush;
    }
    else if (this.value === 'Texture') {
      canvas.freeDrawingBrush = texturePatternBrush;
    }
    else {
      canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](canvas);
    }
    
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = $("#drawing-color").val();
      canvas.freeDrawingBrush.width = parseInt($("#drawing-line-width").val(), 10) || 2;
    }
  })
  
  $("#drawing-color").on("change", function() {
    if(canvas.isDrawingMode) {
      canvas.freeDrawingBrush.color = this.value;
    }
  });
  
  $("#drawing-line-width").on("change", function() {
    if(canvas.isDrawingMode) {
      canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 2;
      $("#line-width-value").html(this.value);
    }
  });
  
  $("#drawing-mode-filter").on("change", function() {
    var filter;
    if (this.value === "Grayscale") {
      filter = new fabric.Image.filters.Grayscale();
    } else if (this.value === "Invert") {
        filter = new fabric.Image.filters.Invert();
    } else if (this.value === "Sepia") {
        filter = new fabric.Image.filters.Sepia();
    } else if (this.value === "Sepia2") {
        filter = new fabric.Image.filters.Sepia2();
    } else if (this.value === "Blur") {
        filter = new fabric.Image.filters.Convolute({
          matrix: [1/9, 1/9, 1/9,
                   1/9, 1/9, 1/9,
                   1/9, 1/9, 1/9]
        });
    } else if (this.value === "Sharpen") {
        filter = new fabric.Image.filters.Convolute({
          matrix: [0, -1, 0,
                   -1, 5, -1,
                   0, -1, 0]
        });
    } else if (this.value === "Emboss") {
        filter = new fabric.Image.filters.Convolute({
          matrix: [ 1,   1,  1,
                    1, 0.7, -1,
                   -1,  -1, -1]
        });
    }
    canvas.forEachObject(function(obj) {
      if(obj.type === "image") {
        obj.filters = [];
        if (this.value === "None") { return }
        obj.filters.push(filter);
        obj.applyFilters(function() {
          obj.canvas.renderAll();
        });
      }
    });
  })
  
  $("#select-objects").on("click", function() {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    if(canvas.isDrawingMode) {
      $("#select-objects").removeClass("selection-mode-color");
      $("#select-objects").html("Select Objects");
    } else {
      $("#select-objects").addClass("selection-mode-color");
      $("#select-objects").html("Exit Selection Mode");
    }
  });
  
  $("#delete-objects").on("click", function() {
    if(!canvas.isDrawingMode) {
      deleteObjects();
    }
  });
  
  $(document).keydown(function(e) {
    if(e.keyCode === 46 && !canvas.isDrawingMode) {
      deleteObjects();
    }   
  });
  
  function deleteObjects() {
    var activeObject = canvas.getActiveObject();
    var activeGroup = canvas.getActiveGroup();
    if(activeObject && activeObject != textBoxTop && activeObject != textBoxBottom) {
      if (confirm("Are you sure you want to delete this object?")) {
        canvas.remove(activeObject);
      }
    } else if (activeGroup) {
      if (confirm("Are you sure you want to delete these objects?")) {
        var objectsInGroup = activeGroup.getObjects();
        canvas.discardActiveGroup();
        objectsInGroup.forEach(function(object) {
          if(object != textBoxTop && object != textBoxBottom)
          canvas.remove(object);
        });
      }
    }
  }
  
  function drawMeme() {
    var topText = document.getElementById("top-text").value;
    var topTextColor = document.getElementById('top-color').value;
    var bottomText = document.getElementById("bottom-text").value;
    var bottomTextColor = document.getElementById('bottom-color').value;
    var topTextSize = document.getElementById('top-font-size-select').value;
    var topTextStyle = $('#top-font-style-select option:selected').val();
    var bottomTextSize = document.getElementById('bottom-font-size-select').value;
    var bottomTextStyle = $('#bottom-font-style-select option:selected').val();
    // canvas.clear();
    // if (reader.result != null) {
    //   url = reader.result;
    // } else {
    //   url = $('#remote-meme-url').val();
    // }
    // drawImage(url);
    textBoxTop.setText(topText)
    textBoxTop.setColor(topTextColor);
    textBoxTop.setFontSize(Number(topTextSize));
    if ($('#top-font-style-select option:selected').val() === "Impact-Outline") {
      textBoxTop.setFontFamily("Impact");
      textBoxTop.stroke = "black";
      textBoxTop.strokeWidth = 5;
    } else {
      textBoxTop.setFontFamily(topTextStyle);
      textBoxTop.stroke = null;
    }
    textBoxBottom.setText(bottomText)
    textBoxBottom.setColor(bottomTextColor);
    textBoxBottom.setFontSize(Number(bottomTextSize));
    
    if ($('#bottom-font-style-select option:selected').val() === "Impact-Outline") {
      textBoxBottom.setFontFamily("Impact");
      textBoxBottom.stroke = "black";
      textBoxBottom.strokeWidth = 5;
    } else {
      textBoxBottom.setFontFamily(bottomTextStyle);
      textBoxBottom.stroke = null;
    }
    
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
    
    canvas.renderAll();
  }
  
  // Function that draws the image to the canvas
  function drawImage(input) {
    canvas.clear();
    var imgObject = new Image();
    imgObject.src = input;
    imgObject.onload = function() {
      var exif = EXIF.readFromBinaryFile(base64ToArrayBuffer(reader.result));
      var orientation = exif.Orientation
      if(orientation === 5 || orientation === 6 || orientation === 7 || orientation === 8) {
        resizeFlippedImage(imgObject);
      } else {
        resizeImage(imgObject)
      }
      var image = new fabric.Image(imgObject);
      var left = 0;
      var top = 0;
      var angle = 0;
      var scaleX = 1;
      var scaleY = 1;
      // If there is exif data, set the transformations
      switch(orientation){
        case 2:
        // horizontal flip
          left = 0;
          top = 0;
          scaleX = -1;
          scaleY = 1;
          break;
        case 3:
          // 180° rotate left
          left = image.width;
          top = image.height;
          angle = 180;
          break;
        case 4:
          // vertical flip
          left = 0;
          top = 0;
          scaleX = 1;
          scaleY = -1;
          break;
        case 5:
          // vertical flip + 90 rotate right
          canvas.setWidth(image.height);
          canvas.setHeight(image.width);
          left = image.height;
          top = 0;
          angle = 90;
          scaleX = 1;
          scaleY = -1;
          break;
        case 6:
          // 90° rotate right
          canvas.setWidth(image.height);
          canvas.setHeight(image.width);
          left = image.height;
          top = 0;
          angle = 90;
          break;
        case 7:
          // horizontal flip + 90 rotate right
          canvas.setWidth(image.height);
          canvas.setHeight(image.width);
          left = image.height;
          top = 0;
          angle = 90;
          scaleX = -1;
          scaleY = 1;
          break;
        case 8:
          // 90° rotate left
          canvas.setWidth(image.height);
          canvas.setHeight(image.width);
          left = 0;
          top = image.width;
          angle = -90;
          break;
      }
      image.set({
        left: left,
        top: top,
        angle: angle,
        scaleX: scaleX,
        scaleY: scaleY,
        padding: 0,
        height: imgObject.height,
        width: imgObject.width,
        crossOrigin: "anonymous"
      });
      image.selectable = false;
      // image.setCrossOrigin("anonymous")
      
      canvas.add(image);
      canvas.sendToBack(image);
      createTopTextBox("Enter Top Text...");
      createBottomTextBox("Enter Bottom Text...");
      
      document.getElementById("top-text").placeholder = "Enter Top Text..."
      document.getElementById('top-color').value = '#ffffff';
      document.getElementById('top-color').value = '#ffffff';
      document.getElementById("bottom-text").placeholder = "Enter Bottom Text..."
      document.getElementById('bottom-color').value = '#ffffff';
      document.getElementById('top-font-size-select').value = "" + textBoxTop.fontSize;
      document.getElementById('bottom-font-size-select').value = "" + textBoxBottom.fontSize;
      canvas.setActiveObject(textBoxTop);
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
  
  function resizeFlippedImage(image) {
    if (image.height > image.width) {
      if (image.height > MAX_WIDTH) {
          image.width *= MAX_WIDTH / image.height;
          image.height = MAX_WIDTH;
        }
        
    } else {
      if (image.width > MAX_HEIGHT) {
        image.height *= MAX_HEIGHT / image.width;
        image.width = MAX_HEIGHT;
      }
    }
    canvas.setWidth(image.width);
    canvas.setHeight(image.height);
  }
  
  function base64ToArrayBuffer (base64) {
    base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
    var binaryString = atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
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