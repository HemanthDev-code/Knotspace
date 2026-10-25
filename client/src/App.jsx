
import { useState } from 'react'
import './App.css'

const tools = [
  { id: 'select', label: 'Select', icon: '↖' },
  { id: 'hand', label: 'Move canvas', icon: '✥' },
  { id: 'rectangle', label: 'Rectangle', icon: '▱' },
  { id: 'circle', label: 'Circle', icon: '○' },
  { id: 'arrow', label: 'Arrow', icon: '↗' },
  { id: 'text', label: 'Text', icon: 'T' },
]

function App() {
  const [activeTool, setActiveTool] = useState('select')

  
  const [shapes, setShapes] = useState([])
  const [draftShape, setDraftShape] = useState(null)
  const [isDrawing, setIsDrawing] = useState(false)

    
  const getCanvasPoint = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  const handlePointerDown = (event) => {
    if (activeTool !== 'rectangle' && activeTool !== 'circle') return

    const point = getCanvasPoint(event)

    event.currentTarget.setPointerCapture(event.pointerId)

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
    if (!isDrawing || !draftShape) return

    const point = getCanvasPoint(event)

    setDraftShape((current) => {
      if (!current) return null

      return {
        ...current,
        x: Math.min(current.x, point.x),
        y: Math.min(current.y, point.y),
        width: Math.abs(point.x - current.x),
        height: Math.abs(point.y - current.y),
      }
    })
  }

  const handlePointerUp = () => {
    if (!isDrawing || !draftShape) return

    if (draftShape.width > 2 && draftShape.height > 2) {
      setShapes((current) => [...current, draftShape])
    }

    setDraftShape(null)
    setIsDrawing(false)
  }



  return (
    <main className="workspace">
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
                <span className="tool-icon">{tool.icon}</span>
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
              className="canvas-surface"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{
                cursor:
                  activeTool === 'rectangle' || activeTool === 'circle'
                    ? 'crosshair'
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
                    stroke="#AD8B73"
                    strokeWidth="2"
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
                    stroke="#AD8B73"
                    strokeWidth="2"
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
