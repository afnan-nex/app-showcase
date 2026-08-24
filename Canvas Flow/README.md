# CanvasFlow — Infinite Collaborative Whiteboard & Architecture Diagramming

A high-performance, zero-dependency, static infinite whiteboard web application engineered with vanilla HTML5, CSS3, ES6 Modules, Canvas 2D, and IndexedDB.

Designed and refined for distributed systems engineers, software architects, product designers, and teams who need a fast, responsive, local-first diagramming and brainstorming canvas.

---

## Key Highlights

- **Local-First & Zero Dependencies**: 100% client-side vanilla JavaScript with ES6 modules. No Node runtime required at serve time, no PHP, no npm build step. Deploys statically onto GitHub Pages or any static CDN.
- **Dual-Layer Canvas Architecture**:
  - **Main Canvas (`#canvas-main`)**: Vector-accelerated scene graph with frustum culling, dynamic grid rendering (dots/lines), and HiDPI retina DPR scaling.
  - **Overlay Canvas (`#canvas-overlay`)**: Real-time transformation gizmo (8 resize handles + 1 rotation stem), smart magnetic alignment guides, connector anchor highlights, and freehand eraser trail.
- **Smart Shape Connectors**: Dynamic anchor binding (`top`, `right`, `bottom`, `left`, `center`) with curved Bezier, straight, and stepped orthogonal routing that follow shapes as they move or resize.
- **Full Drawing Toolkit**:
  - Shapes: Rectangles, Rounded Rectangles, Ellipses/Circles, Decision Diamonds
  - Connectors & Lines: Orthogonal, Bezier curved, and straight arrows with custom arrowheads
  - Freehand & Highlighting: Catmull-Rom spline smoothed pencil and semi-transparent fluorescent highlighter
  - Text & Sticky Notes: Multi-line rich text editor with markdown-like styling and pastel color presets
  - Image Imports: Drag-and-drop or clipboard paste (`Ctrl+V`) for PNG, JPEG, SVG, WebP with aspect ratio locks
  - Eraser Tool: Path collision detection for fast stroke and shape erasure
- **Inspector & Properties Panel**: Contextual inspector with sliders, color swatches, stroke widths, opacity, dash patterns, multi-selection alignment (left, center, right, top, middle, bottom), and equal distribution.
- **Multi-Board Manager & IndexedDB Persistence**:
  - Local database (`canvasflow_db`) with automatic debounced saving.
  - Graceful fallback to `localStorage` when IndexedDB is restricted.
  - Board switcher menu with quick create, duplicate, and board management modal.
- **Export & Interoperability Engine**:
  - High-res PNG export with custom scale multipliers (1x, 2x Retina, 3x High-Res) and background choices (Theme, Transparent, Pure White).
  - SVG vector export with XML namespace and dynamic connector anchor resolution.
  - `.canvasflow.json` document export and import with validation schema.
  - Direct browser print styling.
- **Accessibility & Responsive Polish**:
  - Full keyboard accessibility with `:focus-visible` rings and ARIA attributes (`role="toolbar"`, `role="dialog"`, `aria-haspopup`, `aria-expanded`, `aria-live`).
  - Mobile & tablet responsive layouts down to 320px screens with touch pinch-to-zoom and two-finger pan gestures.
  - `prefers-reduced-motion` compliance.

---

## Keyboard Shortcuts Quick Reference

| Shortcut | Action |
| :--- | :--- |
| **V** | Select / Move Tool |
| **H** / **Space + Drag** | Hand / Pan Canvas |
| **R** | Rectangle Tool |
| **U** | Rounded Rectangle Tool |
| **E** | Ellipse / Circle Tool |
| **D** | Diamond / Decision Shape Tool |
| **A** | Arrow Tool |
| **L** | Line Tool |
| **C** | Smart Connector Tool |
| **P** | Freehand Pencil Tool |
| **Shift + P** / **M** | Highlighter Tool |
| **T** | Text Tool |
| **S** / **N** | Sticky Note Tool |
| **I** | Insert Image File |
| **X** | Eraser Tool |
| **Ctrl + Z** | Undo Action |
| **Ctrl + Shift + Z** | Redo Action |
| **Ctrl + C** / **Ctrl + V** | Copy / Paste Selected Objects |
| **Ctrl + X** | Cut Selected Objects |
| **Ctrl + D** / **Alt + Drag** | Duplicate Selected Objects |
| **Ctrl + A** | Select All Objects on Canvas |
| **Delete** / **Backspace** | Delete Selected Objects |
| **Ctrl + G** / **Ctrl + Shift + G** | Group / Ungroup Selected Objects |
| **Ctrl + L** | Lock / Unlock Selected Objects |
| **Ctrl + ]** / **Ctrl + [** | Bring to Front / Send to Back |
| **Ctrl + K** | Command Palette |
| **Ctrl + 0** | Reset Viewport Zoom to 100% |
| **Shift + 1** | Zoom to Fit All Canvas Content |
| **Shift + 2** | Zoom to Current Selection |
| **G** | Toggle Canvas Background Grid |
| **S** | Toggle Snapping & Smart Guides |
| **Shift + R** | Toggle Coordinate Rulers |
| **Arrow Keys** | Nudge Selected (10px with Shift) |

---

## Project Structure

```text
Canvas Flow/
├── index.html                 # Semantic application entry point & modal containers
├── README.md                  # Project documentation & reference
├── css/
│   ├── theme.css              # Design tokens, color palettes, dark/light themes, reset
│   ├── layout.css             # Viewport layout, tool rail, side panels, responsive breakpoints
│   ├── components.css         # Buttons, inputs, modals, command palette, toast notifications
│   └── canvas.css             # Canvas layers, rulers, cursors, minimap, quick context bar
└── js/
    ├── app.js                 # Application lifecycle orchestrator, event bus bindings
    ├── state/
    │   ├── state.js           # Central state store (board, selection, viewport, history)
    │   ├── document-model.js  # Object schema, factory creators, clone & validation
    │   ├── history.js         # Undo/redo stack and transactional state management
    │   ├── storage.js         # IndexedDB persistence & localStorage preferences fallback
    │   └── event-bus.js       # Decoupled pub/sub event dispatcher
    ├── renderer/
    │   └── canvas-renderer.js # HiDPI 2D canvas pipeline, frustum culling, overlays, rulers
    ├── tools/
    │   ├── tool-manager.js    # Pointer & touch gesture routing engine
    │   ├── base-tool.js       # Base abstract class for tools
    │   ├── select-tool.js     # Selection, multi-transform, rotation, marquee drag
    │   ├── shape-tool.js      # Rectangles, diamonds, ellipses, sticky notes
    │   ├── connector-tool.js  # Dynamic shape connection & anchor snapping
    │   ├── line-tool.js       # Straight lines & arrows
    │   ├── pencil-tool.js     # Freehand drawing & fluorescent highlighter
    │   ├── text-tool.js       # Text creation & inline editing activation
    │   ├── eraser-tool.js     # Intersection path & bounding box eraser
    │   └── pan-tool.js        # Canvas viewport pan & gesture navigation
    ├── ui/
    │   ├── toolbar.js         # Top navigation header & tool rail UI handlers
    │   ├── properties-panel.js# Dynamic contextual properties inspector
    │   ├── layers-panel.js    # Layer tree reordering, visibility & locking
    │   ├── minimap.js         # Real-time interactive overview minimap
    │   ├── rulers.js          # Synchronized coordinate rulers
    │   ├── context-menu.js    # Contextual right-click menu
    │   ├── command-palette.js # Fuzzy search modal for all actions & commands
    │   ├── modals.js          # Board manager, image export, and confirmation dialogs
    │   ├── toast.js           # Lightweight toast notification banners
    │   └── sample-board.js    # Starter architecture template
    └── utils/
        ├── math.js            # Vector math, bounding boxes, rotations, anchors, intersections
        └── svg-exporter.js    # Clean standalone SVG vector generation
```

---

## Static Hosting & Browser Compatibility

CanvasFlow requires no build step. To run locally or deploy:

- **Local Preview**: Open `index.html` via any local static server (e.g. `npx serve .`, VS Code Live Server, or Python's `python -m http.server 8080`).
- **Production Hosting**: Push directly to any static provider (GitHub Pages, Cloudflare Pages, Netlify, Vercel).
- **Supported Browsers**: Chrome/Edge (88+), Firefox (85+), Safari (14+), and mobile browsers with PointerEvents support.
