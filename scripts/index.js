window.addEventListener('load', main);

function main() {
  buildGlobalVariables();

  const global = window.__global;
  global.filepicker.addEventListener('change', getAndParseSvg);
  global.saveButton.addEventListener('click', saveSvgFile);
}

function buildGlobalVariables() {
  window.__global = {
    filepicker: document.getElementById('filepicker'),
    imagesEditor: document.getElementById('imageseditor'),
    saveButton: document.getElementById('savebutton'),
    svgDom: null,
  };
}

function saveSvgFile() {
  const global = window.__global;
  if (global.svgDom) {
    const svgString = global.svgDom.documentElement.outerHTML;
    saveSvgStringToFile(svgString);
  }
}

function getAndParseSvg() {
  const global = window.__global;
  const [file] = global.filepicker.files;
  readFileAsText(file)
    .then(parseSvgToGlobalSvgDom)
    .then(removeWatermarkIfAny)
    .then(renderImagesEditor)
    .catch(handleError);
}

function parseSvgToGlobalSvgDom(svgText) {
  const global = window.__global;
  const svgDom = parseSvgStringToDom(svgText);
  global.svgDom = svgDom;
}

function removeWatermarkIfAny() {
  const global = window.__global;
  const svgDom = global.svgDom;
  const watermark = svgDom.querySelector('svg > svg');
  if (watermark) {
    watermark.remove();
  }
}

function renderImagesEditor() {
  const global = window.__global;
  const svgDom = global.svgDom;
  const imageNodes = svgDom.querySelectorAll('image');
  global.imagesEditor.innerHTML = '';
  imageNodes.forEach((imageNode, i) => {
    global.imagesEditor.appendChild(
      buildImagesEditorSectionFromImageNode(imageNode, i)
    );
  });
}

function buildImagesEditorSectionFromImageNode(imageNode, i) {
  const oldSrc = imageNode.getAttribute('xlink:href');
  const editorSection = document.createElement('div');
  editorSection.classList.add('editor-section');

  const oldPreviewContainer = document.createElement('div');
  oldPreviewContainer.classList.add('old-preview');
  const oldPreviewImage = document.createElement('img');
  oldPreviewImage.src = oldSrc;
  oldPreviewContainer.appendChild(oldPreviewImage);

  const newPreviewContainer = document.createElement('div');
  newPreviewContainer.classList.add('new-preview');
  const newPreviewImage = document.createElement('img');
  newPreviewImage.src = '#';
  newPreviewContainer.appendChild(newPreviewImage);

  const newSrcPickerContainer = document.createElement('div');
  newSrcPickerContainer.classList.add('new-src-picker');
  const newSrcPickerInput = document.createElement('input');
  newSrcPickerInput.type = 'file';
  newSrcPickerInput.addEventListener('change', buildHandlerForNewSrcPickerChange(
    imageNode,
    newSrcPickerInput,
    newPreviewImage,
  ));
  newSrcPickerContainer.appendChild(newSrcPickerInput);

  editorSection.appendChild(oldPreviewContainer);
  editorSection.appendChild(newSrcPickerContainer);
  editorSection.appendChild(newPreviewContainer);
  return editorSection;
}

function buildHandlerForNewSrcPickerChange(imageNode, newSrcPickerInput, newPreview) {
  return function() {
    const [file] = newSrcPickerInput.files;
    readFileAsDataURL(file)
      .then((base64URL) => {
        newPreview.src = base64URL;
        imageNode.setAttribute('xlink:href', base64URL);
      })
      .catch(handleError);
  }
}

function handleError(err) {
  console.error(err);
}
