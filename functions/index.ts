export const hex2Rgb = (hex: string) =>
  hex.match(/\w\w/g)?.map((x) => parseInt(x, 16)) || [];

export const hexToRgb = (hex: string) => {
  const [r, g, b] = hex2Rgb(hex.replace("#", ""));
  return `rgb(${r}, ${g}, ${b})`;
};

export const hexToRgba = (hex: string, alpha: number) => {
  const [r, g, b] = hex2Rgb(hex.replace("#", ""));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
