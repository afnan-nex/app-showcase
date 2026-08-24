PROMPT C — ADVANCED JAVASCRIPT FLOWPILOT

Implement an actual client-side workflow simulation engine.

DATA MODEL:
Workflow:
- id
- name
- description
- nodes
- connections
- variables
- createdAt
- updatedAt

NODE:
- id
- type
- position
- inputs
- outputs
- configuration

GRAPH ENGINE:
Allow arbitrary node connections.

Prevent invalid connections when possible.

EXECUTION ENGINE:
Starting from a trigger, traverse the graph.

Implement simulated behavior for:

Trigger:
starts workflow

Transform:
changes data

Condition:
branches execution

Filter:
removes items

Delay:
pauses simulation

HTTP Request:
simulate request result

Notification:
create simulated notification

Output:
stores resulting data

EXECUTION:
Show a live execution log.

Display:
- execution ID
- timestamps
- node status
- input
- output
- errors

VARIABLES:
Allow expressions such as:
{{name}}
{{email}}

Create variable interpolation.

TEMPLATES:
Create predefined workflows users can clone.

PERSISTENCE:
Use IndexedDB.

IMPORT/EXPORT:
Export workflows as JSON.

WORKFLOW HISTORY:
Save previous versions.

Allow restoring an earlier version.

EDITOR:
Implement:
- node selection
- drag
- resize where relevant
- connector creation
- multi-select
- duplicate
- delete
- keyboard shortcuts

Add command palette.