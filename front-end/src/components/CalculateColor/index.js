const CalculateColor = (value, min, max, colorType) => {
  const normalizedValue = (value - min) / (max - min);
  let red = 0, green = 0, blue = 0;

  switch (colorType) {
    case "temperature": // Màu đỏ cho nhiệt độ
      red = Math.min(255, Math.max(0, 255 * normalizedValue));
      green = 50;
      blue = 50;
      break;
    case "humidity": // Màu xanh nước biển cho độ ẩm
      red = 50;
      green = 100;
      blue = Math.min(255, Math.max(0, 255 * normalizedValue));
      break;
    case "light": // Màu vàng cho ánh sáng
      red = Math.min(255, Math.max(0, 255 * normalizedValue));
      green = Math.min(255, Math.max(0, 255 * normalizedValue));
      blue = 50;
      break;
    default:
      break;
  }

  return `rgb(${red}, ${green}, ${blue})`;
};

export default CalculateColor;
