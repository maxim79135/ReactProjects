export const polarToX = (angle, distance) =>
  Math.cos(angle - Math.PI / 2) * distance;
export const polarToY = (angle, distance) =>
  Math.sin(angle - Math.PI / 2) * distance;

function pathDefinition(points: number[][]) {
  let d = "M" + points[0][0].toFixed(4) + "," + points[0][1].toFixed(4);
  for (let i = 1; i < points.length; i++) {
    d += "L" + points[i][0].toFixed(4) + "," + points[i][1].toFixed(4);
  }
  return d + "z";
}
export default pathDefinition;
