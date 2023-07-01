//this script will create a dialogue box for naming files correctly.

#target photoshop;

// choose your folder
const outputFolder = "~/Documents/apps/michaelgrills/src/paintings";

// check if the folder exists if not make it.
const makeFolder = function (folderStr) {

  if (!Folder(folderStr).exists) {
    new Folder(folderStr).create();
  };

};

makeFolder(outputFolder);

// get average color
const getAverageColor = function () {
  const doc = app.activeDocument;
  const x = 1;
  const y = 1;

  doc.flatten();

  doc.selection.selectAll();

  doc.selection.copy();

  doc.paste();

  doc.activeLayer.applyAverage();

  const pointSample = doc.colorSamplers.add([x - 1, y - 1]);
  const rgb = [
    Math.round(pointSample.color.rgb.red),
    Math.round(pointSample.color.rgb.green),
    Math.round(pointSample.color.rgb.blue),
  ];

  doc.activeLayer.remove();
  return rgb;
}

// saveName takes in all the info and creates a file name out of it
// first checks that all the info is there
// then changes any spaces in titles to have "-"
// Then it writes out the file name

const saveName = function (title, artistFName, artistLName, height, width, depth, price, frame) {
  if (!title || !artistFName || !artistLName || !height || !width || !depth || !price) {
    alert("Your missing information");
    return false;
  }

  const averageColor = getAverageColor();

  const realTitle = title.replace(" ", "-", "g");

  if (frame) {
    frame = "Framed";
  } else {
    frame = "unframed";
  }

  //the file name
  jpgFile = new File(outputFolder + "/" + realTitle + "-by_" + artistFName + "-" + artistLName + "-h" + height + "-w" + width + "-d" + depth + "-" + frame + "-p" + price + "-" + averageColor[0] + "_" + averageColor[1] + "_" + averageColor[2] + ".jpeg");
  alert("Saving as: " + jpgFile);
  // jpg options
  jpgSaveOptions = new JPEGSaveOptions();
  jpgSaveOptions.embedColorProfile = true;
  jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
  jpgSaveOptions.matte = MatteType.NONE;
  jpgSaveOptions.quality = 8;

  app.activeDocument.saveAs(jpgFile, jpgSaveOptions, true, Extension.LOWERCASE);

  return true;
};

// Dialogue Window
const margin = 10;
const width = 500;
const height = 400;
const rowHeight = 30;
const labelWidth = 80;
const lrgTextboxWidth = width - labelWidth;
const smlTextboxWidth = 3;
const groupWidth = width - margin;
const groupHeight = (margin * 2) + rowHeight;
const labelPlacement = [margin, margin, labelWidth, rowHeight];
const inputPlacement = [margin + labelWidth, margin - 2, lrgTextboxWidth, 0];
const dialogSize = [0, 0, width, height];
const dlg = new Window("dialog", "Painting File Name", dialogSize, { closeButton: true });

// Title Group
const inputTitleGroup = dlg.add("panel", [margin, margin, groupWidth, groupHeight]);
inputTitleGroup.add("statictext", labelPlacement, "Title:");
const titleText = inputTitleGroup.add("edittext", inputPlacement, "");
titleText.active = true;

// Artist First Name Group
const inputFirstNameGroup = dlg.add("panel", [margin, margin + groupHeight, groupWidth, groupHeight * 2]);
inputFirstNameGroup.add("statictext", labelPlacement, "First Name:");
const firstNameText = inputFirstNameGroup.add("edittext", inputPlacement, "Michael");

// Artist Last Name Group
const inputLastNameGroup = dlg.add("panel", [margin, margin + (groupHeight * 2), groupWidth, groupHeight * 3]);
inputLastNameGroup.add("statictext", labelPlacement, "Last Name:");
const lastNameText = inputLastNameGroup.add("edittext", inputPlacement, "Grills");

// Height,Width,Depth Group
const HWDGroup = dlg.add("panel", [margin, margin + (groupHeight * 3), groupWidth, groupHeight * 4]);
const heightGroup = HWDGroup.add("group", [0, 0, 160, groupHeight]);
const widthGroup = HWDGroup.add("group", [160, 0, 320, groupHeight]);
const depthGroup = HWDGroup.add("group", [320, 0, 480, groupHeight]);
heightGroup.add("statictext", labelPlacement, "Height In:");
widthGroup.add("statictext", labelPlacement, "Width In:");
depthGroup.add("statictext", labelPlacement, "Depth In:");
const heightText = heightGroup.add("edittext", [margin + labelWidth, margin - 2, smlTextboxWidth, 0]);
const widthText = widthGroup.add("edittext", [margin + labelWidth, margin - 2, smlTextboxWidth, 0]);
const depthText = depthGroup.add("edittext", [margin + labelWidth, margin - 2, smlTextboxWidth, 0]);

// Price Group
const priceGroup = dlg.add("panel", [margin, margin + (groupHeight * 4), groupWidth, groupHeight * 5]);
priceGroup.add("statictext", labelPlacement, "Price $:");
const priceText = priceGroup.add("edittext", [margin + labelWidth, margin - 2, 50, 0]);

// Extras Group
const extrasGroup = dlg.add("panel", [margin, margin + (groupHeight * 5), groupWidth, groupHeight * 6]);
const frameGroup = extrasGroup.add("group", [0, 0, 240, groupHeight]);
//const availGroup = extrasGroup.add("group",[240,0,480,groupHeight]);
const frameCheck = frameGroup.add("checkbox", [margin + labelWidth, margin - 2, smlTextboxWidth, 0], "Framed?");
//const availCheck = availGroup.add("checkbox", [margin + labelWidth, margin-2, smlTextboxWidth, 0], "Available?");

// Buttons Group
const buttonsGroup = dlg.add("group", [margin, margin + (groupHeight * 6), groupWidth, groupHeight * 7.5]);
buttonsGroup.alignment = "center";
const okGroup = buttonsGroup.add("group", [0, 0, 240, groupHeight]);
const cancelGroup = buttonsGroup.add("group", [240, 0, 480, groupHeight]);
const okbutton = okGroup.add("button", [10, 0, 220, groupHeight], "Ok");
const cancelbutton = cancelGroup.add("button", [10, 0, 220, groupHeight], "Cancel");

okbutton.onClick = function () {
  if (app.documents.length > 0) {
    const saved = saveName(titleText.text, firstNameText.text, lastNameText.text, heightText.text, widthText.text, depthText.text, frameCheck.value, priceText.text);
    if (saved) {
      alert("You did it.");
      dlg.hide();
    }
  } else {
    alert("You must have an open document.");
  }
}

dlg.center();
dlg.show();
