// Converts a 6-digit hex color to rgba(r, g, b, 1).
// Shared by catalog.js and each theme's defaults file.
export function h(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 1)`;
}
