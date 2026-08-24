PROMPT C — ADVANCED JAVASCRIPT DATALENS

Implement a complete frontend data-analysis engine.

IMPORT:
Support:
- CSV
- JSON

Parse files in the browser.

AUTO-DETECT:
Determine column data types.

DATA CLEANING:
Allow:
- rename columns
- remove columns
- remove duplicates
- trim whitespace
- replace values
- convert types
- handle blanks

FILTER ENGINE:
Support multiple conditions:
- equals
- contains
- greater than
- less than
- between

SORTING:
Sort ascending/descending.

AGGREGATION:
Support:
- sum
- average
- min
- max
- count
- unique count

GROUPING:
Group datasets by selected columns.

CHART BUILDER:
User chooses:
- chart type
- x-axis
- y-axis
- grouping
- aggregation

Charts must update dynamically.

DASHBOARD:
Allow:
- add chart
- remove chart
- resize
- reorder
- rename dashboard

PERSISTENCE:
Save datasets, dashboards and user preferences in IndexedDB.

EXPORT:
Allow:
- CSV export
- JSON export
- dashboard print
- chart image export

Create project-style data pipelines locally.

Handle malformed files and invalid data gracefully.

Do not freeze the UI on large files; use efficient processing and chunking where appropriate.