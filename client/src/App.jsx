
import { useRef, useState } from 'react'
import './App.css'

const tools = [
  { id: 'select', label: 'Select', icon: 'hand' },
  { id: 'hand', label: 'Move canvas', icon: '✥' },
  { id: 'rectangle', label: 'Rectangle', icon: '▱' },
  { id: 'circle', label: 'Circle', icon: '○' },
  { id: 'arrow', label: 'Arrow', icon: '↗' },
  { id: 'text', label: 'Text', icon: 'T' },
]

function App() {
  const [activeTool, setActiveTool] = useState('select')

  
  const [shapes, setShapes] = useState([])

  
  const [past, setPast] = useState([])
  const [future, setFuture] = useState([])


  const [draftShape, setDraftShape] = useState(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const [drawStart, setDrawStart] = useState(null)
  const canvasRef = useRef(null)

  const [selectedShapeId, setSelectedShapeId] = useState(null)
  const [isMoving, setIsMoving] = useState(false)
  const [moveOffset, setMoveOffset] = useState({ x: 0, y: 0 })
    
  
  const getCanvasPoint = (event) => {
    const rect = canvasRef.current.getBoundingClientRect()

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }



  const handlePointerDown = (event) => {
    if (activeTool !== 'rectangle' && activeTool !== 'circle') return

    const point = getCanvasPoint(event)
    event.currentTarget.setPointerCapture(event.pointerId)

    setDrawStart(point)
    setDraftShape({
      id: crypto.randomUUID(),
      type: activeTool,
      x: point.x,
      y: point.y,
      width: 0,
      height: 0,
    })

    setIsDrawing(true)
  }



  const handlePointerMove = (event) => {
    if (isMoving && selectedShapeId) {
      const point = getCanvasPoint(event)

      setShapes((current) =>
        current.map((shape) =>
          shape.id === selectedShapeId
            ? {
                ...shape,
                x: point.x - moveOffset.x,
                y: point.y - moveOffset.y,
              }
            : shape
        )
      )

      return
    }

    if (!isDrawing || !drawStart) return

    const point = getCanvasPoint(event)

    setDraftShape((current) => {
      if (!current) return null

      return {
        ...current,
        x: Math.min(drawStart.x, point.x),
        y: Math.min(drawStart.y, point.y),
        width: Math.abs(point.x - drawStart.x),
        height: Math.abs(point.y - drawStart.y),
      }
    })
  }




  const handlePointerUp = () => {
    if (isMoving) {
      setIsMoving(false)
      return
    }

    if (!isDrawing || !draftShape) return

    if (draftShape.width > 2 && draftShape.height > 2) {
      saveHistory([...shapes, draftShape])
    }

    setDraftShape(null)
    setDrawStart(null)
    setIsDrawing(false)
  }

  
const handleKeyDown = (event) => {

  
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
    event.preventDefault()

    if (event.shiftKey) {
      handleRedo()
    } else {
      handleUndo()
    }

    return
  }

  if (
    (event.ctrlKey || event.metaKey) &&
    event.key.toLowerCase() === 'y'
  ) {
    event.preventDefault()
    handleRedo()
    return
  }


  if (event.key !== 'Delete' && event.key !== 'Backspace') return

  // Don't delete shapes while typing in an input or text area.
  const tag = event.target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target.isContentEditable) {
    return
  }

  if (!selectedShapeId) return

  event.preventDefault()

  saveHistory(
  shapes.filter((shape) => shape.id !== selectedShapeId)
  )

  setSelectedShapeId(null)
}


const handleUndo = () => {
  if (past.length === 0) return

  const previousShapes = past[past.length - 1]

  setPast((current) => current.slice(0, -1))
  setFuture((current) => [...current, shapes])
  setShapes(previousShapes)
  setSelectedShapeId(null)
}

const handleRedo = () => {
  if (future.length === 0) return

  const nextShapes = future[future.length - 1]

  setFuture((current) => current.slice(0, -1))
  setPast((current) => [...current, shapes])
  setShapes(nextShapes)
  setSelectedShapeId(null)
}

const saveHistory = (nextShapes) => {
  setPast((current) => [...current, shapes])
  setFuture([])
  setShapes(nextShapes)
}




  return (
    <main className="workspace" onKeyDown={handleKeyDown} tabIndex={0}>
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">K</span>
          <span>Knotspace</span>
          <span className="beta">BETA</span>
        </div>

        <div className="board-name">Untitled board</div>

        <div className="topbar-actions">
          <span className="save-status">● All changes saved</span>
          <button className="share-button" type="button">
            Share
          </button>
        </div>
      </header>

      <section className="editor">
        <aside className="sidebar">
          <p className="panel-label">WORKSPACE</p>
          <button className="board-item" type="button">
            <span>▦</span> My first board
          </button>

          <div className="sidebar-divider" />

          <p className="panel-label">BOARD TOOLS</p>
          <div className="tool-list">
            {tools.map((tool) => (
              <button
                key={tool.id}
                type="button"
                className={`tool-button ${
                  activeTool === tool.id ? 'active' : ''
                }`}
                onClick={() => setActiveTool(tool.id)}
              >
                <span className="tool-icon">
                  {tool.id === 'select' ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M8 11V5a2 2 0 0 1 4 0v5-3a2 2 0 0 1 4 0v3-2a2 2 0 0 1 4 0v7a7 7 0 0 1-7 7h-1a6 6 0 0 1-4.5-2L4 15a2 2 0 0 1 3-2l2 2" />
                    </svg>
                  ) : (
                    tool.icon
                  )}
                </span>
                <span>{tool.label}</span>
              </button>
            ))}
          </div>

          <div className="sidebar-note">
            <span>✦</span>
            <p>AI design assistant</p>
            <small>Coming in a future milestone</small>
          </div>
        </aside>

        <section className="canvas-area">
          <div className="canvas-toolbar">
            <div>
              <h1>My first board</h1>
              <p>Think together. Connect the dots.</p>
            </div>
            <span className="tool-indicator">
              Active tool: {tools.find((tool) => tool.id === activeTool)?.label}
            </span>
          </div>


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

                    onClick={(event) => {
                      event.stopPropagation()
                      setSelectedShapeId(shape.id)
                    }}
                    
                    onPointerDown={(event) => {
                      if (activeTool !== 'select') return

                      event.stopPropagation()

                      const point = getCanvasPoint(event)

                      setSelectedShapeId(shape.id)
                      setPast((current) => [...current, shapes])
                      setFuture([])
                      setIsMoving(true)
                      setMoveOffset({
                        x: point.x - shape.x,
                        y: point.y - shape.y,
                      })

                      event.currentTarget.setPointerCapture(event.pointerId)
                    }}

                    style={{
                      cursor:
                        activeTool === 'select'
                          ? isMoving
                            ? 'grabbing'
                            : 'grab'
                          : 'inherit',
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

                    onClick={(event) => {
                      event.stopPropagation()
                      setSelectedShapeId(shape.id)
                    }}
                    
                    onPointerDown={(event) => {
                      if (activeTool !== 'select') return

                      event.stopPropagation()

                      const point = getCanvasPoint(event)

                      setSelectedShapeId(shape.id)
                      setPast((current) => [...current, shapes])
                      setFuture([])
                      setIsMoving(true)
                      setMoveOffset({
                        x: point.x - shape.x,
                        y: point.y - shape.y,
                      })

                      event.currentTarget.setPointerCapture(event.pointerId)
                    }}
                    style={{
                      cursor:
                        activeTool === 'select'
                          ? isMoving
                            ? 'grabbing'
                            : 'grab'
                          : 'inherit',
                    }}

                  />
                )
              )}

              {draftShape && (
                draftShape.type === 'rectangle' ? (
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
                  />
                )
              )}
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


          <footer className="canvas-footer">
            <span>Knotspace Canvas</span>
            <span>100% zoom</span>
          </footer>
        </section>
      </section>
    </main>
  )
}

export default App
