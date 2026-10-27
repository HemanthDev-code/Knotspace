
import { useRef, useState } from 'react'
import Canvas from './canvas/Canvas'
import useCanvas from './canvas/useCanvas'
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
  
  const canvasState = useCanvas(activeTool)

  const {
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
  } = canvasState


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

          <Canvas
            shapes={shapes}
            draftShape={draftShape}
            selectedShapeId={selectedShapeId}
            activeTool={activeTool}
            isMoving={isMoving}
            canvasRef={canvasRef}
            getCanvasPoint={getCanvasPoint}
            handlePointerDown={handlePointerDown}
            handlePointerMove={handlePointerMove}
            handlePointerUp={handlePointerUp}
            setSelectedShapeId={setSelectedShapeId}
            setIsMoving={setIsMoving}
            setMoveOffset={setMoveOffset}
            saveMoveHistory={saveMoveHistory}
          />



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
