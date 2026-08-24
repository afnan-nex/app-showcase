PROMPT C — ADVANCED JAVASCRIPT CANVASFLOW

Upgrade CanvasFlow into a highly functional frontend application using advanced vanilla JavaScript.

IMPLEMENT A REAL DOCUMENT MODEL:

Create a centralized application state containing:
- current board
- objects
- selected objects
- active tool
- viewport
- history
- clipboard
- layers
- settings

Use immutable snapshots or equivalent state management for undo/redo.

UNDO/REDO:
Support:
- object creation
- object deletion
- moving
- resizing
- rotation
- style changes
- text changes
- grouping
- layer changes

KEYBOARD SHORTCUTS:
Implement:
- V select
- H hand
- R rectangle
- E ellipse
- L line
- A arrow
- P pencil
- T text
- Ctrl/Cmd+Z
- Ctrl/Cmd+Shift+Z
- Ctrl/Cmd+C
- Ctrl/Cmd+V
- Ctrl/Cmd+D
- Delete
- Ctrl/Cmd+A
- Escape

SELECTION ENGINE:
Implement:
- click selection
- shift multi-select
- drag selection rectangle
- bounding box
- resize handles
- rotation handle
- snapping
- alignment guides

CANVAS ENGINE:
Support:
- smooth zoom
- wheel zoom
- pinch zoom
- mouse pan
- touch pan
- viewport restoration

SNAPPING:
Implement snapping to:
- grid
- object edges
- object centers
- alignment guides

PERSISTENCE:
Use IndexedDB for boards and localStorage for preferences.

Support:
- automatic saving
- last-opened board
- board duplication
- board deletion
- board rename
- recovery after refresh

IMPORT/EXPORT:
Implement JSON serialization/deserialization.

PNG export should render the current board to an image.

ADVANCED STATES:
Handle:
- empty board
- loading board
- malformed imported data
- unsupported object type
- storage errors

PERFORMANCE:
Do not redraw the entire application unnecessarily.

Use requestAnimationFrame where appropriate.

Support large boards containing hundreds or thousands of objects reasonably well.

Add a command palette opened with Ctrl/Cmd+K containing searchable actions.

Everything must function without a server.