//this script will create a dialogue box for naming files correctly.

const doc = app.activeDocument;
//get the current title of the doc
const docTitleArr = doc.name.split(".");

//default artist name (you can change here)
firstName = "Michael"
lastName = "Grills"

// check if the folder exists if not make it.
const makeFolder = function (folderStr) {

  if (!Folder(folderStr).exists) {
    new Folder(folderStr).create();
  };

};

// check if number is an integer
const isInt = function (n) {
  return n % 1 === 0;
}

// get average color
const getAverageColor = function () {
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

const convertStringtoInt = function (numString) {
  const returnNum = parseInt(numString);
  return returnNum;
}

// saveName takes in all the info and creates a file name out of it
// first checks that all the info is there
// then changes any spaces in titles to have "-"
// Then it writes out the file name

const saveName = function (title, artistFName, artistLName, medium, height, width, depth, price, frame, saveLoc) {
  if (!title) {
    alert("You forgot the title");
    titleText.active = true;
    return false;
  }

  const realTitle = title.replace(" ", "-", "g");

  if (!artistFName) {
    alert("You forgot First Name");
    firstNameText.active = true;
    return false;
  }

  if (!artistLName) {
    alert("You forgot Last Name");
    lastNameText.active = true;
    return false;
  }

  if (!medium) {
    alert("You forgot the Medium");
    mediumText.active = true;
    return false;
  }

  const realMedium = medium.replace(" ", "-", "g");

  if (!height) {
    alert("Check Your Height Value \n Note it must be an integer");
    heightText.active = true;
    return false;
  } else {
    if (isNaN(height) || !isInt(height)) {
      alert("Height is not an Integer");
      heightText.active = true;
      return false;
    };
  };

  if (!width) {
    alert("Check Your Width Value \n Note it must be an integer");
    widthText.active = true;
    return false;
  } else {
    if (isNaN(width) || !isInt(width)) {
      alert("Width is not an Integer");
      widthText.active = true;
      return false;
    };
  };

  if (!depth) {
    alert("Check Your Depth Value \n Note it must be an integer");
    depthText.active = true;
    return false;
  } else {
    if (isNaN(depth) || !isInt(depth)) {
      alert("Depth is not an Integer");
      depthText.active = true;
      return false;
    };
  };

  if (!price) {
    alert("Check Your Price Value \n Note it must be an integer include cents");
    priceText.active = true;
    return false;
  } else {
    if (isNaN(price) || !isInt(price)) {
      priceText.active = true;
      alert("Price is not an Integer");
      return false;
    };
  };

  if (!saveLoc) {
    alert("You need to pick a save folder");
    saveLocationText.active = true;
    return false;
  } else {
    //saveLoc = saveLoc + "/" + realTitle;
    makeFolder(saveLoc);
  }

  const averageColor = getAverageColor();

  if (frame) {
    frame = true;
  } else {
    frame = false;
  }

  //the file name
  jpgFile = new File(saveLoc + "/" + realTitle + "_a" + artistFName + "-" + artistLName + "_m" + realMedium + "_h" + height + "_w" + width + "_d" + depth + "_f" + frame + "_p" + price * 100 + "_r" + averageColor[0] + "_g" + averageColor[1] + "_b" + averageColor[2] + ".jpeg");
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
const height = 500;
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
const titleText = inputTitleGroup.add("edittext", inputPlacement, docTitleArr[0]);
titleText.active = true;

// Artist First Name Group
const inputFirstNameGroup = dlg.add("panel", [margin, margin + groupHeight, groupWidth, groupHeight * 2]);
inputFirstNameGroup.add("statictext", labelPlacement, "First Name:");
const firstNameText = inputFirstNameGroup.add("edittext", inputPlacement, firstName);

// Artist Last Name Group
const inputLastNameGroup = dlg.add("panel", [margin, margin + (groupHeight * 2), groupWidth, groupHeight * 3]);
inputLastNameGroup.add("statictext", labelPlacement, "Last Name:");
const lastNameText = inputLastNameGroup.add("edittext", inputPlacement, lastName);

// Medium Group
const mediumGroup = dlg.add("panel", [margin, margin + (groupHeight * 3), groupWidth, groupHeight * 4]);
mediumGroup.add("statictext", labelPlacement, "Medium:");
const mediumText = mediumGroup.add("edittext", inputPlacement, "");


// Height,Width,Depth Group
const HWDGroup = dlg.add("panel", [margin, margin + (groupHeight * 4), groupWidth, groupHeight * 5]);
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
const priceGroup = dlg.add("panel", [margin, margin + (groupHeight * 5), groupWidth, groupHeight * 6]);
priceGroup.add("statictext", labelPlacement, "Price $:");
const priceText = priceGroup.add("edittext", [margin + labelWidth, margin - 2, 150, 0]);

// Extras Group
const extrasGroup = dlg.add("panel", [margin, margin + (groupHeight * 6), groupWidth, groupHeight * 7]);
const frameGroup = extrasGroup.add("group", [0, 0, 240, groupHeight]);
//const availGroup = extrasGroup.add("group",[240,0,480,groupHeight]);
const frameCheck = frameGroup.add("checkbox", [margin + labelWidth, margin - 2, smlTextboxWidth, 0], "Framed?");
//const availCheck = availGroup.add("checkbox", [margin + labelWidth, margin-2, smlTextboxWidth, 0], "Available?");

//Save location Group
const saveLocationGroup = dlg.add("panel", [margin, margin + (groupHeight * 7), groupWidth, groupHeight * 8]);
const saveLocButton = saveLocationGroup.add("button", [0, 6, 80, groupHeight - 20], "Save @");
const saveLocationText = saveLocationGroup.add("edittext", inputPlacement, "");

// Buttons Group
const buttonsGroup = dlg.add("group", [margin, margin + (groupHeight * 8), groupWidth, groupHeight * 9.5]);
buttonsGroup.alignment = "center";
const okGroup = buttonsGroup.add("group", [0, 0, 240, groupHeight]);
const cancelGroup = buttonsGroup.add("group", [240, 0, 480, groupHeight]);
const okbutton = okGroup.add("button", [10, 0, 220, groupHeight], "Ok");
const cancelbutton = cancelGroup.add("button", [10, 0, 220, groupHeight], "Cancel");

// button functions
saveLocButton.onClick = function () {
  saveLocationText.text = Folder.selectDialog("Choose a Folder");
}

okbutton.onClick = function () {
  if (app.documents.length > 0) {
    const saved = saveName(titleText.text, firstNameText.text, lastNameText.text, mediumText.text, heightText.text, widthText.text, depthText.text, priceText.text, frameCheck.value, saveLocationText.text);
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
