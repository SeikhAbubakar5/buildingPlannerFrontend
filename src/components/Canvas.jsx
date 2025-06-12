import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Toolbar from "./Toolbar";
import { createLabelText } from "../Utils/shapeUtils";

const API_BASE = "https://buildingplanner1.onrender.com/api/drawings";


const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [currentMode, setCurrentMode] = useState("select");
  const [annotationsVisible, setAnnotationsVisible] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [currentShape, setCurrentShape] = useState(null);

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas("canvas", {
      height: 600,
      width: 1000,
      backgroundColor: "#f9f9f9",
    });
    canvasRef.current = fabricCanvas;
    setCanvas(fabricCanvas);
    return () => fabricCanvas.dispose();
  }, []);

  const loadDrawing = (drawing) => {
    if (!canvas) return;

    canvas.clear();
    canvas.setBackgroundColor("#f3f3f3", () => canvas.renderAll());

    drawing.shapes.forEach((shape) => {
      let obj;
      const { coords, type, style } = shape;

      switch (type) {
        case "rect":
          obj = new fabric.Rect({ ...coords, ...style });
          break;
        case "circle":
          obj = new fabric.Circle({ ...coords, ...style });
          break;
        case "line":
          obj = new fabric.Line(
            coords.points || [coords.x1, coords.y1, coords.x2, coords.y2],
            { ...style }
          );
          break;
      }

      if (obj) canvas.add(obj);
    });

    canvas.renderAll();
  };
  useEffect(() => {
    if (canvas) {
      window.loadDrawingToCanvas = loadDrawing;
    }
  }, [canvas]);

  const setDrawingMode = (mode) => {
    setCurrentMode(mode);
    canvas.isDrawingMode = false;
    canvas.selection = mode === "select";
  };

  useEffect(() => {
    if (!canvas) return;

    const handleMouseDown = (opt) => {
      const { x, y } = canvas.getPointer(opt.e);
      setStartPoint({ x, y });

      if (["rect", "circle", "line"].includes(currentMode)) {
        setIsDrawing(true);

        let shape;
        if (currentMode === "rect") {
          shape = new fabric.Rect({
            left: x,
            top: y,
            width: 0,
            height: 0,
            stroke: "black",
            strokeWidth: 2,
            fill: "rgba(173,216,230,0.3)",
            selectable: false,
          });
        } else if (currentMode === "circle") {
          shape = new fabric.Circle({
            left: x,
            top: y,
            radius: 0,
            stroke: "black",
            strokeWidth: 2,
            fill: "rgba(144,238,144,0.3)",
            selectable: false,
          });
        } else if (currentMode === "line") {
          shape = new fabric.Line([x, y, x, y], {
            stroke: "black",
            strokeWidth: 2,
            selectable: false,
          });
        }

        canvas.add(shape);
        setCurrentShape(shape);
      }
    };

    const handleMouseMove = (opt) => {
      if (!isDrawing || !startPoint || !currentShape) return;

      const { x, y } = canvas.getPointer(opt.e);
      const dx = x - startPoint.x;
      const dy = y - startPoint.y;

      if (currentMode === "rect") {
        currentShape.set({
          width: Math.abs(dx),
          height: Math.abs(dy),
          left: dx < 0 ? x : startPoint.x,
          top: dy < 0 ? y : startPoint.y,
        });
      } else if (currentMode === "circle") {
        const radius = Math.sqrt(dx * dx + dy * dy) / 2;
        currentShape.set({
          radius,
          left: startPoint.x - radius,
          top: startPoint.y - radius,
        });
      } else if (currentMode === "line") {
        currentShape.set({ x2: x, y2: y });
      }

      canvas.renderAll();
    };

    const handleMouseUp = () => {
      if (!currentShape || !startPoint) return;

      if (annotationsVisible && currentMode !== "select") {
        const labelText =
          currentMode === "line"
            ? `${Math.round(Math.hypot(currentShape.x2 - currentShape.x1, currentShape.y2 - currentShape.y1))}`
            : currentMode === "rect"
              ? `${Math.round(currentShape.width)} x ${Math.round(currentShape.height)}`
              : `r = ${Math.round(currentShape.radius)}`;

        const label = createLabelText(
          labelText,
          currentShape.left + 10,
          currentShape.top - 10
        );

        canvas.add(label);
        currentShape.annotation = label;
      }

      setIsDrawing(false);
      setCurrentShape(null);
      setStartPoint(null);
    };

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
    };
  }, [canvas, currentMode, isDrawing, startPoint, currentShape, annotationsVisible]);

  const toggleAnnotations = () => {
    setAnnotationsVisible((prev) => {
      canvas.getObjects().forEach((obj) => {
        if (obj.annotation) {
          if (!prev) canvas.add(obj.annotation);
          else canvas.remove(obj.annotation);
        }
      });
      canvas.requestRenderAll();
      return !prev;
    });
  };

  const clearCanvas = () => {
    canvas.clear();
    canvas.setBackgroundColor("#f9f9f9", () => canvas.renderAll());
  };

  const saveDrawing = async () => {
    const title = prompt("Enter drawing title:");
    if (!title) return;

    const canvasObjects = canvas.getObjects().filter(obj => obj.type !== "text");

    const shapes = canvasObjects.map((obj) => ({
      id: obj.id || `${obj.type}_${Math.random().toString(36).substr(2, 9)}`,
      type: obj.type,
      coords: obj.toObject(),
      annotations: {
        label: obj.annotation?.text || "",
        dimension: "",
        visible: true,
      },
      style: {
        stroke: obj.stroke || "black",
        strokeWidth: obj.strokeWidth || 1,
        fill: obj.fill || "transparent",
      },
    }));

    try {
      await axios.post(API_BASE, { title, shapes });
      alert("Drawing saved successfully");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to save drawing");
    }
  };


  return (
    <div style={{ padding: "20px" }}>
      <Toolbar
        setDrawingMode={setDrawingMode}
        toggleAnnotations={toggleAnnotations}
        saveDrawing={saveDrawing}
        clearCanvas={clearCanvas}
      />
      <canvas id="canvas" />
    </div>
  );
};

export default DrawingCanvas;