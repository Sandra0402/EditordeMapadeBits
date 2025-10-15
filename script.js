const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let originalImage = null;

const brightnessSlider = document.getElementById('brightnessRange');
const brightnessValueText = document.getElementById('brightnessValue');

// Cargar imagen
upload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
      applyBrightness(0); // Aplicar sin brillo inicial
      brightnessSlider.value = 0;
      brightnessValueText.textContent = '0';
    };
    img.src = event.target.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});

// Escala de grises
document.getElementById('grayscale').addEventListener('click', () => {
  if (!originalImage) return;
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = data[i + 1] = data[i + 2] = avg;
  }
  ctx.putImageData(imageData, 0, 0);
});

// Invertir colores
document.getElementById('invert').addEventListener('click', () => {
  if (!originalImage) return;
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
  ctx.putImageData(imageData, 0, 0);
});

// Distorsionar
document.getElementById('distort').addEventListener('click', () => {
  if (!originalImage) return;
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;
  let width = canvas.width;
  let height = canvas.height;

  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      const index = (y * width + x) * 4;
      const dx = Math.floor(Math.random() * 5) - 2;
      const dy = Math.floor(Math.random() * 5) - 2;
      const sx = Math.min(width - 1, Math.max(0, x + dx));
      const sy = Math.min(height - 1, Math.max(0, y + dy));
      const srcIndex = (sy * width + sx) * 4;

      data[index] = originalImage.data[srcIndex];
      data[index + 1] = originalImage.data[srcIndex + 1];
      data[index + 2] = originalImage.data[srcIndex + 2];
    }
  }

  ctx.putImageData(imageData, 0, 0);
});

// Brillo
brightnessSlider.addEventListener('input', () => {
  const value = parseInt(brightnessSlider.value, 10);
  brightnessValueText.textContent = value;
  applyBrightness(value);
});

// Aplicar brillo
function applyBrightness(value) {
  if (!originalImage) return;

  let imageData = new ImageData(
    new Uint8ClampedArray(originalImage.data),
    originalImage.width,
    originalImage.height
  );
  let data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, data[i] + value));     // R
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + value)); // G
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + value)); // B
  }

  ctx.putImageData(imageData, 0, 0);
}

// Restablecer imagen original
document.getElementById('reset').addEventListener('click', () => {
  if (originalImage) {
    ctx.putImageData(originalImage, 0, 0);
    brightnessSlider.value = 0;
    brightnessValueText.textContent = '0';
  }
});

// Descargar imagen
document.getElementById('download').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'imagen_editada.png';
  link.href = canvas.toDataURL();
  link.click();
});
