function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      resolve(reader.result);
    });
    reader.addEventListener('error', (err) => {
      reject(err);
    });
    if (file) {
      reader.readAsText(file);
    } else {
      resolve('');
    }
  });
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      resolve(reader.result);
    });
    reader.addEventListener('error', (err) => {
      reject(err);
    });
    if (file) {
      reader.readAsDataURL(file);
    } else {
      resolve('');
    }
  });
}

const saveByteArray = (function () {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  return function (data, name, mimeType) {
    const blob = new Blob(data, {type: mimeType});
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
  };
})();

function saveSvgStringToFile(svgString) {
  saveByteArray([svgString], 'out.svg', 'image/svg+xml');
}

function parseSvgStringToDom(svgString) {
  const parser = new DOMParser();
  return parser.parseFromString(svgString, 'image/svg+xml');
}
