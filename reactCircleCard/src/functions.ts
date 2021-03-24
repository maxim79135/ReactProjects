export const polarToX = (angle, distance) => Math.cos(angle - Math.PI / 2) * distance;
export const polarToY = (angle, distance) => Math.sin(angle - Math.PI / 2) * distance;