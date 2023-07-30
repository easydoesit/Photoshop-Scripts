// Save the current preferences
var startRulerUnits = app.preferences.rulerUnits;
var startTypeUnits = app.preferences.typeUnits;

// Set Photoshop to use pixels and display no dialogs
app.preferences.rulerUnits = Units.PIXELS;
app.preferences.typeUnits = TypeUnits.PIXELS;

// get the files setup. Num of layers and doc width and height.
var layerNum = app.activeDocument.layers.length;
var docWidth = app.activeDocument.width;
var docHeight = app.activeDocument.height;

// figure out how many rows and columns are required.
var rows = Math.round(Math.sqrt(layerNum));
var columns = Math.ceil(layerNum / rows);

// Active layer counter
var i = 0;

// Dialogue box setup.
var staticTextSize = [10, 10, 300, 100];
var dialogSize = [0, 0, 340, 600];

// Translate Layer Function takes deltaX and Y and moves the layers to the righ spot.
function translateActiveLayer(deltaX, deltaY) {
  var desc = new ActionDescriptor();
  var ref = new ActionReference();
  ref.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
  desc.putReference(charIDToTypeID('null'), ref);
  var coords = new ActionDescriptor();
  coords.putUnitDouble(charIDToTypeID('Hrzn'), charIDToTypeID('#Pxl'), deltaX);
  coords.putUnitDouble(charIDToTypeID('Vrtc'), charIDToTypeID('#Pxl'), deltaY);
  desc.putObject(charIDToTypeID('T   '), charIDToTypeID('Ofst'), coords);
  executeAction(charIDToTypeID('move'), desc, DialogModes.NO);
};

// automatic layout trys to make the sprite sheet have the same number of rows and columns
function automaticLayout() {
  app.activeDocument.resizeCanvas(docWidth * columns, docHeight * rows, AnchorPosition.TOPLEFT);

  for (var rowCount = 1; rowCount <= rows; rowCount++) {
    for (var colCount = 1; colCount <= columns; colCount++) {
      i++;
      if (layerNum >= i) {
        app.activeDocument.activeLayer = activeDocument.layers[layerNum - i];
        translateActiveLayer(docWidth * (colCount - 1), docHeight * (rowCount - 1));
      };
    };
  };
};

// manual layout take the users input and makes rows and columns based on that
function manualLayout() {
  app.activeDocument.resizeCanvas(docWidth * columns, docHeight * rows, AnchorPosition.TOPLEFT);

  for (var rowCount = 1; rowCount <= rows; rowCount++) {
    for (var colCount = 1; colCount <= columns; colCount++) {
      i++;
      if (layerNum >= i) {
        app.activeDocument.activeLayer = activeDocument.layers[layerNum - i];
        translateActiveLayer(docWidth * (colCount - 1), docHeight * (rowCount - 1));
      };
    };
  };
};


//UI Controls
// Confim Set
function showConfirm() {
  dlg.msgConfirm = dlg.add('statictext', staticTextSize, 'Complete', { multiline: true });
};

//Automatic Set
function hideAuto() {
  dlg.msgAuto.hide() + dlg.btnContinue.hide();
};

function showAuto() {
  dlg.msgAuto = dlg.add('statictext', staticTextSize, 'The sprite frames will be arranged in ' + columns + 'columns and ' + rows + ' rows.\rThe sprite sheet will be ' + columns * docWidth + ' wide and ' + rows * docHeight + 'tall. \r\rContinue?', { multiline: true });
  dlg.btnContinue = dlg.add('button', [120, 170, 220, 190], 'Continue', { name: 'Continue' });
  dlg.btnContinue.onClick = function () {
    automaticLayout();
    hideAuto();
    showConfirm();
  };
};

//Manual Set
function hideMan() {
  dlg.msgMan.hide() + dlg.columnsText.hide() + dlg.columnsInput.hide() + dlg.rowsText.hide() + dlg.rowsInput.hide();
};

function hideMan2() {
  dlg.msgConfMan.hide() + dlg.btnContinue.hide()
};

function showConfirmMan() {
  dlg.msgConfMan = dlg.add('statictext', staticTextSize, 'The sprite frames will be arranged in\r' + columns + ' columns and ' + rows + ' rows.\r\rThe sprite sheet will be\r' + columns * docWidth + ' wide and ' + rows * docHeight + '  tall. \r\rContinue?', { multiline: true });
  dlg.btnContinue.onClick = function () {
    manualLayout();
    hideMan2();
    showConfirm();
  };
};

function showMan() {
  columns = prompt("How Many Columns", 2);
  rows = prompt("How Many Rows", 1);
  var totalframes = columns * rows;
  dlg.msgMan = dlg.add('statictext', staticTextSize, 'There are ' + totalframes + ' total frames.');
  dlg.columnsText = dlg.add('statictext', [10, 40, 70, 30], 'Columns');
  dlg.columnsInput = dlg.add('edittext', [70, 38, 100, 64], layerNum);
  dlg.columnsInput.onChanging = function () {
    columns = this.text;
  };
  dlg.rowsText = dlg.add('statictext', [10, 76, 70, 76], 'Rows');
  dlg.rowsInput = dlg.add('edittext', [70, 74, 100, 100], 1);
  dlg.rowsInput.onChanging = function () {
    rows = this.text;
  };
  dlg.btnContinue = dlg.add('button', [120, 170, 220, 190], 'Continue', { name: 'Continue' });
  dlg.btnContinue.onClick = function () {
    hideMan();
    showConfirmMan();
  };
};

//New Window
var dlg = new Window('dialog', 'Sprite Sheet Maker', dialogSize);
dlg.msgWelcome = dlg.add('statictext', staticTextSize, 'Welcome To SpriteMaker\r\rPlease Select Auto or Manual\r\rClick Close to Cancel', { multiline: true });
dlg.btnAuto = dlg.add('button', [10, 170, 110, 190], 'Auto', { name: 'Auto' });
dlg.btnMan = dlg.add('button', [120, 170, 220, 190], 'Manual', { name: 'Manual' });
dlg.btnCancel = dlg.add('button', [230, 170, 330, 190], 'Close', { name: 'cancel' });

function hideStart() {
  dlg.msgWelcome.hide() + dlg.btnAuto.hide() + dlg.btnMan.hide();
};


//Starting Button Controls
dlg.btnCancel.onClick = function () {
  return dlg.close();
};

dlg.btnAuto.onClick = function () {
  hideStart();
  showAuto();
};

dlg.btnMan.onClick = function () {
  hideStart();
  showMan();
};


dlg.center();
dlg.show();
