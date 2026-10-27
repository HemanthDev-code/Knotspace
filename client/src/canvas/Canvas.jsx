
function Canvas({
  shapes,
  draftShape,
  selectedShapeId,
  activeTool,
  isMoving,
  canvasRef,
  getCanvasPoint,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  setSelectedShapeId,
  setIsMoving,
  setMoveOffset,
  saveMoveHistory,
}) {
  return (
    <div className="canvas">
      <svg
        ref={canvasRef}
        onClick={() => setSelectedShapeId(null)}
        className="canvas-surface"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          cursor:
            activeTool === 'rectangle' || activeTool === 'circle'
              ? 'crosshair'
              : activeTool === 'select'
                ? isMoving
                  ? 'grabbing'
                  : 'grab'
                : 'default',
        }}
      >
        {shapes.map((shape) =>
          shape.type === 'rectangle' ? (
            <rect
              key={shape.id}
              x={shape.x}
              y={shape.y}
              width={shape.width}
              height={shape.height}
              rx="6"
              fill="#E3CAA5"
              fillOpacity="0.55"
              stroke={selectedShapeId === shape.id ? '#704D39' : '#AD8B73'}
              strokeWidth={selectedShapeId === shape.id ? 3 : 2}
              style={{
                cursor:
                  activeTool === 'select'
                    ? isMoving
                      ? 'grabbing'
                      : 'grab'
                    : 'inherit',
              }}
              onClick={(event) => {
                event.stopPropagation()
                setSelectedShapeId(shape.id)
              }}
              onPointerDown={(event) => {
                if (activeTool !== 'select') return

                event.stopPropagation()
                const point = getCanvasPoint(event)

                setSelectedShapeId(shape.id)
                saveMoveHistory()
                setIsMoving(true)
                setMoveOffset({
                  x: point.x - shape.x,
                  y: point.y - shape.y,
                })

                event.currentTarget.setPointerCapture(event.pointerId)
              }}
            />
          ) : (
            <ellipse
              key={shape.id}
              cx={shape.x + shape.width / 2}
              cy={shape.y + shape.height / 2}
              rx={shape.width / 2}
              ry={shape.height / 2}
              fill="#CEAB93"
              fillOpacity="0.4"
              stroke={selectedShapeId === shape.id ? '#704D39' : '#AD8B73'}
              strokeWidth={selectedShapeId === shape.id ? 3 : 2}
              style={{
                cursor:
                  activeTool === 'select'
                    ? isMoving
                      ? 'grabbing'
                      : 'grab'
                    : 'inherit',
              }}
              onClick={(event) => {
                event.stopPropagation()
                setSelectedShapeId(shape.id)
              }}
              onPointerDown={(event) => {
                if (activeTool !== 'select') return

                event.stopPropagation()
                const point = getCanvasPoint(event)

                setSelectedShapeId(shape.id)
                saveMoveHistory()
                setIsMoving(true)
                setMoveOffset({
                  x: point.x - shape.x,
                  y: point.y - shape.y,
                })

                event.currentTarget.setPointerCapture(event.pointerId)
              }}
            />
          )
        )}

        {draftShape &&
          (draftShape.type === 'rectangle' ? (
            <rect
              x={draftShape.x}
              y={draftShape.y}
              width={draftShape.width}
              height={draftShape.height}
              rx="6"
              fill="#E3CAA5"
              fillOpacity="0.55"
              stroke="#AD8B73"
              strokeWidth="2"
              strokeDasharray="5 4"
              pointerEvents="none"
            />
          ) : (
            <ellipse
              cx={draftShape.x + draftShape.width / 2}
              cy={draftShape.y + draftShape.height / 2}
              rx={draftShape.width / 2}
              ry={draftShape.height / 2}
              fill="#CEAB93"
              fillOpacity="0.4"
              stroke="#AD8B73"
              strokeWidth="2"
              strokeDasharray="5 4"
              pointerEvents="none"
            />
          ))}
      </svg>

      {shapes.length === 0 && !draftShape && (
        <div className="empty-state">
          <div className="empty-icon">◇</div>
          <h2>Your ideas start here</h2>
          <p>
            Choose Rectangle or Circle, then click and drag
            on the canvas to draw your first shape.
          </p>
          <span className="canvas-hint">
            Your shapes will appear here.
          </span>
        </div>
      )}
    </div>
  )
}

export default Canvas