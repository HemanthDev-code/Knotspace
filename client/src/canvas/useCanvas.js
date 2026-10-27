import { useRef, useState } from "react";

export default function useCanvas(activeTool) {
  const [shapes, setShapes] = useState([]);
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const [draftShape, setDraftShape] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState(null);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [moveOffset, setMoveOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const getCanvasPoint = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const saveHistory = (nextShapes) => {
    setPast((current) => [...current, shapes]);
    setFuture([]);
    setShapes(nextShapes);
  };

  const saveMoveHistory = () => {
    setPast((current) => [...current, shapes]);
    setFuture([]);
  };

  const handlePointerDown = (event) => {
    if (activeTool !== "rectangle" && activeTool !== "circle") return;

    const point = getCanvasPoint(event);
    event.currentTarget.setPointerCapture(event.pointerId);

    setDrawStart(point);
    setDraftShape({
      id: crypto.randomUUID(),
      type: activeTool,
      x: point.x,
      y: point.y,
      width: 0,
      height: 0,
    });
    setIsDrawing(true);
  };

  const handlePointerMove = (event) => {
    if (isMoving && selectedShapeId) {
      const point = getCanvasPoint(event);

      setShapes((current) =>
        current.map((shape) =>
          shape.id === selectedShapeId
            ? {
                ...shape,
                x: point.x - moveOffset.x,
                y: point.y - moveOffset.y,
              }
            : shape,
        ),
      );

      return;
    }

    if (!isDrawing || !drawStart) return;

    const point = getCanvasPoint(event);

    setDraftShape((current) => {
      if (!current) return null;

      return {
        ...current,
        x: Math.min(drawStart.x, point.x),
        y: Math.min(drawStart.y, point.y),
        width: Math.abs(point.x - drawStart.x),
        height: Math.abs(point.y - drawStart.y),
      };
    });
  };

  const handlePointerUp = () => {
    if (isMoving) {
      setIsMoving(false);
      return;
    }

    if (!isDrawing || !draftShape) return;

    if (draftShape.width > 2 && draftShape.height > 2) {
      saveHistory([...shapes, draftShape]);
    }

    setDraftShape(null);
    setDrawStart(null);
    setIsDrawing(false);
  };

  const handleKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
      event.preventDefault();
      if (event.shiftKey) handleRedo();
      else handleUndo();
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
      event.preventDefault();
      handleRedo();
      return;
    }

    if (event.key !== "Delete" && event.key !== "Backspace") return;

    const tag = event.target.tagName;
    if (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      event.target.isContentEditable
    ) {
      return;
    }

    if (!selectedShapeId) return;

    event.preventDefault();
    saveHistory(shapes.filter((shape) => shape.id !== selectedShapeId));
    setSelectedShapeId(null);
  };

  const handleUndo = () => {
    if (past.length === 0) return;

    const previousShapes = past[past.length - 1];
    setPast((current) => current.slice(0, -1));
    setFuture((current) => [...current, shapes]);
    setShapes(previousShapes);
    setSelectedShapeId(null);
  };

  const handleRedo = () => {
    if (future.length === 0) return;

    const nextShapes = future[future.length - 1];
    setFuture((current) => current.slice(0, -1));
    setPast((current) => [...current, shapes]);
    setShapes(nextShapes);
    setSelectedShapeId(null);
  };

  return {
    shapes,
    setShapes,
    past,
    future,
    draftShape,
    isDrawing,
    drawStart,
    selectedShapeId,
    setSelectedShapeId,
    isMoving,
    setIsMoving,
    moveOffset,
    setMoveOffset,
    canvasRef,
    getCanvasPoint,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleKeyDown,
    handleUndo,
    handleRedo,
    saveHistory,
    saveMoveHistory,
  };
}
