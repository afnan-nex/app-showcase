/**
 * FlowPilot Graph Topology & Validation Engine
 */

class WorkflowGraph {
  constructor(workflow) {
    this.workflow = workflow;
    this.nodes = new Map();
    this.connections = [];
    this.adjacency = new Map(); // fromNodeId -> [{ toNodeId, fromPortId, toPortId, connectionId }]
    this.inDegree = new Map(); // toNodeId -> [{ fromNodeId, fromPortId, toPortId, connectionId }]

    this.buildGraph();
  }

  buildGraph() {
    this.nodes.clear();
    this.adjacency.clear();
    this.inDegree.clear();
    this.connections = this.workflow.connections || [];

    // Index all nodes
    (this.workflow.nodes || []).forEach(node => {
      this.nodes.set(node.id, node);
      this.adjacency.set(node.id, []);
      this.inDegree.set(node.id, []);
    });

    // Populate adjacency and in-degree maps
    this.connections.forEach(conn => {
      if (this.nodes.has(conn.fromNodeId) && this.nodes.has(conn.toNodeId)) {
        this.adjacency.get(conn.fromNodeId).push({
          toNodeId: conn.toNodeId,
          fromPortId: conn.fromPortId || 'output',
          toPortId: conn.toPortId || 'input',
          connectionId: conn.id
        });

        this.inDegree.get(conn.toNodeId).push({
          fromNodeId: conn.fromNodeId,
          fromPortId: conn.fromPortId || 'output',
          toPortId: conn.toPortId || 'input',
          connectionId: conn.id
        });
      }
    });
  }

  /**
   * Find entry point trigger node(s) in workflow
   */
  getTriggerNodes() {
    const triggerTypes = ['trigger', 'schedule', 'webhook'];
    const triggers = [];

    // 1. Nodes with trigger types
    for (const [id, node] of this.nodes.entries()) {
      if (triggerTypes.includes(node.type)) {
        triggers.push(node);
      }
    }

    // 2. If no explicit trigger types found, find nodes with in-degree 0
    if (triggers.length === 0) {
      for (const [id, node] of this.nodes.entries()) {
        const inConns = this.inDegree.get(id) || [];
        if (inConns.length === 0) {
          triggers.push(node);
        }
      }
    }

    return triggers;
  }

  /**
   * Get downstream targets from a node, optionally filtered by port ID (e.g. 'true'/'false')
   */
  getNextNodes(nodeId, outputPortId = null) {
    const edges = this.adjacency.get(nodeId) || [];
    if (!outputPortId) {
      return edges.map(e => ({
        node: this.nodes.get(e.toNodeId),
        connection: e
      }));
    }

    return edges
      .filter(e => e.fromPortId === outputPortId)
      .map(e => ({
        node: this.nodes.get(e.toNodeId),
        connection: e
      }));
  }

  /**
   * Get upstream sources for a node
   */
  getUpstreamNodes(nodeId) {
    const edges = this.inDegree.get(nodeId) || [];
    return edges.map(e => ({
      node: this.nodes.get(e.fromNodeId),
      connection: e
    }));
  }

  /**
   * Detect cycles using depth-first search
   */
  detectCycle() {
    const visited = new Set();
    const recStack = new Set();

    const isCyclicUtil = (nodeId) => {
      visited.add(nodeId);
      recStack.add(nodeId);

      const neighbors = this.adjacency.get(nodeId) || [];
      for (const edge of neighbors) {
        const nextId = edge.toNodeId;
        if (!visited.has(nextId) && isCyclicUtil(nextId)) {
          return true;
        } else if (recStack.has(nextId)) {
          return true;
        }
      }

      recStack.delete(nodeId);
      return false;
    };

    for (const nodeId of this.nodes.keys()) {
      if (!visited.has(nodeId)) {
        if (isCyclicUtil(nodeId)) return true;
      }
    }

    return false;
  }

  /**
   * Validate a proposed connection between two ports
   */
  validateConnection(fromNodeId, fromPortId, toNodeId, toPortId) {
    // 1. Cannot connect node to itself
    if (fromNodeId === toNodeId) {
      return { valid: false, reason: 'Cannot connect a node to itself.' };
    }

    // 2. Both nodes must exist
    const fromNode = this.nodes.get(fromNodeId);
    const toNode = this.nodes.get(toNodeId);
    if (!fromNode || !toNode) {
      return { valid: false, reason: 'One or both nodes do not exist.' };
    }

    // 3. Prevent duplicate identical connection
    const exists = this.connections.some(c => 
      c.fromNodeId === fromNodeId && 
      c.fromPortId === fromPortId && 
      c.toNodeId === toNodeId && 
      c.toPortId === toPortId
    );
    if (exists) {
      return { valid: false, reason: 'Connection already exists.' };
    }

    return { valid: true };
  }
}

window.WorkflowGraph = WorkflowGraph;
