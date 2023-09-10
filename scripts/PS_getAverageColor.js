const getAverageColor = function () {
  const doc = app.activeDocument;
  const x = 1;
  const y = 1;

  //flatten the document - destructive
  doc.flatten();
  // create a selection that gets everything
  doc.selection.selectAll();
  //copy the image in the selection
  doc.selection.copy();
  //paste the selection
  doc.paste();
  // apply the average filter
  doc.activeLayer.applyAverage();
  //get a sample from the new layer
  app.activeDocument.colorSamplers.removeAll();
  const pointSample = doc.colorSamplers.add([x - 1, y - 1]);
  //put the colors in an array for use later
  const rgb = [
    Math.round(pointSample.color.rgb.red),
    Math.round(pointSample.color.rgb.green),
    Math.round(pointSample.color.rgb.blue),
  ];
  //remove the layer //commented out for now.
  //doc.activeLayer.remove();
}

getAverageColor();
