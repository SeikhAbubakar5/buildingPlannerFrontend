export function createLabelText(text, x, y) {
  return new fabric.Text(text, {
    left: x,
    top: y,
    fontSize: 14,
    fill: "red",
    selectable: false,
    evented: false,
  });
}

export function createArrowLine(x1, y1, x2, y2, color = "black") {
  const line = new fabric.Line([x1, y1, x2, y2], {
    stroke: color,
    strokeWidth: 2,
    selectable: false,
  });

  const angle = Math.atan2(y2 - y1, x2 - x1);
  const arrow = new fabric.Triangle({
    left: x2,
    top: y2,
    angle: (angle * 180) / Math.PI + 90,
    width: 10,
    height: 15,
    fill: color,
    originX: "center",
    originY: "center",
    selectable: false,
  });

  return [line, arrow];
}
