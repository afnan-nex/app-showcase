# FlowPilot — Visual Workflow Automation Engine

**FlowPilot** is an ultra-fast, zero-dependency browser-based visual workflow automation application built with Vanilla JavaScript, HTML5 Canvas/SVG, and modern CSS. Inspired by professional developer tools like n8n, Make, and Zapier, FlowPilot provides an infinite canvas with a real client-side simulation engine, variable interpolation, branching logic, IndexedDB persistence, and interactive debugging tools.

---

## 🚀 Key Features

### 1. 🎨 Infinite Visual Canvas & Graph Editor
- **Infinite Pan & Zoom**: Smooth mouse wheel zooming (20% to 250%), middle-click panning, and `Space + Drag`.
- **Interactive Minimap**: Real-time 2D minimap canvas with draggable viewport rectangle.
- **Customizable Grid**: Engineering dot grid and line grid with configurable 24px snapping.
- **SVG Bezier Connectors**: Smooth cubic Bezier curves with directional arrows, midpoint deletion buttons, and animated data pulses during execution.
- **Marquee Multi-Selection**: Click and drag on canvas background to box-select multiple nodes simultaneously.
- **Node Manipulation**: Multi-node drag with grid snapping, duplicate (`Ctrl+D`), copy/paste (`Ctrl+C` / `Ctrl+V`), and delete (`Delete` / `Backspace`).

### 2. ⚡ Client-Side Graph Simulation Engine
- **Full Graph Topology**: DAG traversal starting from triggers/entrypoints with cycle detection.
- **Branching Logic**: True/False conditional routing with condition rules builder (`==`, `!=`, `>`, `<`, `contains`, `regex`).
- **Speed Regulation**: Instant, 200ms, 400ms, 1s, and 2s step delays.
- **Step-by-Step Debugger**: Step next (`⏭ Step`) to step through execution node by node.
- **Isolated Step Testing**: "Test Step" button to execute any individual node with custom/mock input.
- **Dynamic Variable Interpolation**: Evaluates `{{name}}`, `{{$input.userEmail}}`, `{{$vars.apiKey}}`, `{{$node['Name'].output}}`, and custom JavaScript expressions.

### 3. 📦 12 Specialized Node Types
1. **Manual Trigger (`⚡`)**: Starts flow manually or with customizable JSON payload.
2. **Schedule Trigger (`⏱️`)**: Simulated interval or cron timer (`*/5 * * * *`).
3. **Webhook Receiver (`🪝`)**: Simulated HTTP endpoint with method, path, and incoming mock payload.
4. **HTTP Request (`🌐`)**: Simulated or live API fetch with status codes, headers, and simulated latency.
5. **Code / Transform (`🔄`)**: Sandboxed JavaScript evaluation (`$input`, `$vars`, `$nodes`, `$context`).
6. **Condition (`🔀`)**: Multi-rule evaluator with dedicated **True** and **False** output branches.
7. **Data Filter (`🔍`)**: Filter array items or validate object properties.
8. **Delay / Wait (`⏳`)**: Real-time async pause simulation with countdown.
9. **Send Email (`✉️`)**: Simulated transactional email dispatch saved to an in-app Sent Emails inbox.
10. **Notification Alert (`🔔`)**: Interactive in-app toasts, Slack mocks, and alerts.
11. **Database Simulation (`💾`)**: CRUD operations (`Find`, `Insert`, `Update`, `Delete`, `Count`) backed by IndexedDB.
12. **Output / Sink (`🏁`)**: Workflow data aggregator with 1-click JSON export and auto-download.

### 4. 🗄️ Persistence, History & Developer Tooling
- **IndexedDB Persistence**: Workflows, execution histories, and simulated database tables are stored locally in the browser.
- **Version Snapshots**: Save named workflow version snapshots and restore previous revisions with 1-click.
- **Simulated Database Inspector**: Visual table viewer and editor for `orders`, `users`, `logs`, etc.
- **Simulated Email Inbox**: Inspect all emails dispatched during simulations.
- **Command Palette (`Ctrl+K`)**: Raycast-style instant fuzzy command launcher for actions, nodes, and templates.
- **Pre-Built Enterprise Templates**:
  - *E-Commerce Order Processing Pipeline* (Webhook → Condition → VIP Bonus → DB Insert → Receipt Email)
  - *User Onboarding & Welcome Sequence* (Trigger → Profile Enrich → DB Insert → Delay → Welcome Email)
  - *API Polling & Health Alert Router* (Schedule → HTTP Health Check → Condition → Incident Alert)
  - *Lead Scoring & Enrichment Workflow* (Inbound Lead → Score Transform → Condition → VIP Sales Alert)
- **Theme Support**: Precision Dark mode and clean Light mode.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + K` / `Cmd + K` | Open Command Palette |
| `Ctrl + Enter` | Run Workflow Simulation |
| `Ctrl + Z` | Undo |
| `Ctrl + Y` / `Ctrl + Shift + Z` | Redo |
| `Ctrl + D` | Duplicate Selected Node(s) |
| `Ctrl + C` / `Ctrl + V` | Copy / Paste Node(s) |
| `Delete` / `Backspace` | Delete Selected Node(s) / Connections |
| `Ctrl + A` | Select All Nodes |
| `Shift + 1` | Fit Workflow to Canvas View |
| `Space + Drag` | Pan Infinite Canvas |
| `Mouse Wheel` | Zoom Canvas (at cursor) |
| `?` | Show Keyboard Shortcuts Cheat Sheet |

---

## 🛠️ Tech Stack
- **HTML5 & CSS3** (Custom Properties, Flexbox, CSS Grid, Hardware-accelerated transforms)
- **Vanilla JavaScript (ES6+)** (Zero external dependencies)
- **SVG & HTML5 Canvas** (Dynamic cubic Bezier connectors & Minimap)
- **IndexedDB** (Client-side persistent database)

---

## 🏃 Running the Application
Open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari). No build tools, Node servers, or backend services required.
