/**
 * FlowPilot Workflow Simulation Engine
 * Graph traversal, execution queue, branching, speed regulation, step-by-step debugging
 */

class SimulationEngine {
  constructor() {
    this.status = 'idle'; // 'idle', 'running', 'paused', 'completed', 'error', 'aborted'
    this.workflow = null;
    this.graph = null;
    this.currentExecution = null;
    this.speedDelay = 400; // ms delay between steps
    this.stepMode = false;
    this.stepPromiseResolver = null;
    this.listeners = new Map();
    this.abortController = null;
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    const list = this.listeners.get(event) || [];
    this.listeners.set(event, list.filter(cb => cb !== callback));
  }

  emit(event, ...args) {
    const list = this.listeners.get(event) || [];
    list.forEach(cb => {
      try {
        cb(...args);
      } catch (err) {
        console.error(`[SimulationEngine] Event error (${event}):`, err);
      }
    });
  }

  setSpeed(delayMs) {
    this.speedDelay = Math.max(0, parseInt(delayMs, 10) || 400);
  }

  /**
   * Run entire workflow simulation
   */
  async runWorkflow(workflow, options = {}) {
    if (this.status === 'running') {
      console.warn('Simulation is already running.');
      return;
    }

    this.workflow = workflow;
    this.graph = new WorkflowGraph(workflow);
    this.stepMode = !!options.stepMode;
    this.status = 'running';
    this.abortController = new AbortController();

    const executionId = 'exec_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 4);
    this.currentExecution = {
      id: executionId,
      workflowId: workflow.id,
      workflowName: workflow.name,
      status: 'running',
      timestamp: new Date().toISOString(),
      startTime: Date.now(),
      endTime: null,
      durationMs: 0,
      steps: [],
      nodeOutputs: {},
      finalOutputs: {},
      variables: { ...(workflow.variables || {}) }
    };

    this.emit('start', this.currentExecution);
    this.emit('log', {
      type: 'info',
      message: `Execution started (${executionId})`,
      timestamp: new Date().toISOString()
    });

    // Check for cycles
    if (this.graph.detectCycle()) {
      const err = new Error('Cycle detected in workflow graph. Flow cannot proceed.');
      this.handleExecutionError(err);
      return this.currentExecution;
    }

    // Identify entry trigger nodes
    const triggerNodes = this.graph.getTriggerNodes();
    if (triggerNodes.length === 0) {
      const err = new Error('No trigger or starting node found in workflow.');
      this.handleExecutionError(err);
      return this.currentExecution;
    }

    try {
      // Execution Queue: array of { node, inputData, fromConnectionId }
      const queue = triggerNodes.map(t => ({
        node: t,
        inputData: {},
        fromConnectionId: null
      }));

      const executedNodeIds = new Set();

      while (queue.length > 0) {
        if (this.abortController.signal.aborted) {
          this.status = 'aborted';
          this.currentExecution.status = 'aborted';
          break;
        }

        // Check if paused or step mode
        if (this.stepMode) {
          this.emit('waitingForStep', queue[0]);
          await new Promise(resolve => {
            this.stepPromiseResolver = resolve;
          });
          if (this.abortController.signal.aborted) break;
        } else if (this.speedDelay > 0) {
          await new Promise(r => setTimeout(r, this.speedDelay));
          if (this.abortController.signal.aborted) break;
        }

        const currentTask = queue.shift();
        const { node, inputData, fromConnectionId } = currentTask;

        // Execute node
        const stepResult = await this.executeNode(node, inputData, fromConnectionId);

        if (stepResult.error) {
          // Execution failure in step
          this.emit('log', {
            type: 'error',
            nodeId: node.id,
            nodeTitle: node.title,
            message: `Node "${node.title}" failed: ${stepResult.error}`,
            timestamp: new Date().toISOString()
          });

          this.handleExecutionError(new Error(`Node "${node.title}" failed: ${stepResult.error}`));
          return this.currentExecution;
        }

        executedNodeIds.add(node.id);

        // Find next downstream nodes
        const nextEdges = this.graph.getNextNodes(node.id, stepResult.outputPort);

        for (const edge of nextEdges) {
          // Animate connector flow
          this.emit('connectionActive', {
            connectionId: edge.connection.connectionId,
            fromNodeId: node.id,
            toNodeId: edge.node.id,
            branch: stepResult.outputPort
          });

          queue.push({
            node: edge.node,
            inputData: stepResult.data,
            fromConnectionId: edge.connection.connectionId
          });
        }
      }

      if (this.status !== 'aborted' && this.status !== 'error') {
        this.status = 'completed';
        this.currentExecution.status = 'success';
      }
    } catch (err) {
      this.handleExecutionError(err);
    } finally {
      this.currentExecution.endTime = Date.now();
      this.currentExecution.durationMs = this.currentExecution.endTime - this.currentExecution.startTime;

      // Save execution to IndexedDB
      try {
        await window.flowDB.saveExecution(this.currentExecution);
      } catch (e) {
        console.warn('Could not save execution to IndexedDB:', e);
      }

      this.emit('complete', this.currentExecution);
      this.emit('log', {
        type: this.currentExecution.status === 'success' ? 'success' : 'warning',
        message: `Execution ${this.currentExecution.id} finished with status: ${this.currentExecution.status} in ${this.currentExecution.durationMs}ms`,
        timestamp: new Date().toISOString()
      });
    }

    return this.currentExecution;
  }

  /**
   * Execute single node isolated
   */
  async executeNode(node, inputData = {}, fromConnectionId = null) {
    const nodeStartTime = Date.now();
    const executor = NodeExecutors[node.type];

    const stepEntry = {
      id: 'step_' + Math.random().toString(36).substr(2, 6),
      nodeId: node.id,
      nodeType: node.type,
      nodeTitle: node.title || node.type,
      status: 'running',
      inputData: JSON.parse(JSON.stringify(inputData)),
      outputData: null,
      outputPort: null,
      error: null,
      durationMs: 0,
      timestamp: new Date().toISOString(),
      fromConnectionId
    };

    this.emit('nodeStart', { node, step: stepEntry });

    if (!executor) {
      stepEntry.status = 'error';
      stepEntry.error = `Unknown node type executor: ${node.type}`;
      stepEntry.durationMs = Date.now() - nodeStartTime;
      this.currentExecution.steps.push(stepEntry);
      this.emit('nodeError', { node, step: stepEntry, error: stepEntry.error });
      return stepEntry;
    }

    try {
      const execResult = await executor(node, inputData, {
        variables: this.currentExecution ? this.currentExecution.variables : (this.workflow ? this.workflow.variables : {}),
        nodeOutputs: this.currentExecution ? this.currentExecution.nodeOutputs : {},
        finalOutputs: this.currentExecution ? this.currentExecution.finalOutputs : {},
        executionId: this.currentExecution ? this.currentExecution.id : 'test_exec',
        onProgress: (prog) => this.emit('nodeProgress', { node, progress: prog })
      });

      stepEntry.status = 'success';
      stepEntry.outputData = execResult.data;
      stepEntry.outputPort = execResult.outputPort || 'output';
      stepEntry.durationMs = Date.now() - nodeStartTime;

      if (this.currentExecution) {
        this.currentExecution.nodeOutputs[node.id] = execResult.data;
        this.currentExecution.nodeOutputs[node.title] = execResult.data;
        this.currentExecution.steps.push(stepEntry);
      }

      this.emit('nodeSuccess', { node, step: stepEntry, result: execResult });
      return stepEntry;
    } catch (err) {
      stepEntry.status = 'error';
      stepEntry.error = err.message || 'Execution error';
      stepEntry.durationMs = Date.now() - nodeStartTime;

      if (this.currentExecution) {
        this.currentExecution.steps.push(stepEntry);
      }

      this.emit('nodeError', { node, step: stepEntry, error: err.message });
      return stepEntry;
    }
  }

  /**
   * Test a single node directly with custom or upstream mock input
   */
  async testSingleNode(node, mockInput = {}) {
    const testContext = {
      variables: this.workflow ? this.workflow.variables : {},
      nodeOutputs: {},
      finalOutputs: {},
      executionId: 'test_' + Date.now().toString(36)
    };

    const executor = NodeExecutors[node.type];
    if (!executor) throw new Error(`Unknown node type: ${node.type}`);

    const startTime = Date.now();
    try {
      const result = await executor(node, mockInput, testContext);
      return {
        success: true,
        durationMs: Date.now() - startTime,
        outputPort: result.outputPort,
        data: result.data
      };
    } catch (err) {
      return {
        success: false,
        durationMs: Date.now() - startTime,
        error: err.message
      };
    }
  }

  /**
   * Step Next in debug mode
   */
  stepNext() {
    if (this.stepPromiseResolver) {
      const resolve = this.stepPromiseResolver;
      this.stepPromiseResolver = null;
      resolve();
    }
  }

  /**
   * Stop / Abort current simulation
   */
  stopWorkflow() {
    if (this.abortController) {
      this.abortController.abort();
    }
    if (this.stepPromiseResolver) {
      this.stepPromiseResolver();
    }
    this.status = 'aborted';
    this.emit('aborted');
  }

  handleExecutionError(err) {
    this.status = 'error';
    if (this.currentExecution) {
      this.currentExecution.status = 'error';
      this.currentExecution.error = err.message;
    }
    this.emit('error', err);
  }
}

// Global Singleton
window.flowSimulation = new SimulationEngine();
