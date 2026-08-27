/**
 * GameSmith - Automated Verification Test Suite
 * Tests 2D physics, collision algorithms, event rule evaluator, and project serialization.
 */

import { checkAABB, checkCollision, updatePhysics } from './js/engine/physics.js';
import { EventEngine } from './js/engine/events.js';
import { TEMPLATES } from './js/editor/templates.js';

console.log('--- 1. Testing AABB Box Collision Detection ---');
const boxA = { x: 100, y: 100, width: 50, height: 50, hasCollider: true, isSolid: true };
const boxB = { x: 130, y: 120, width: 50, height: 50, hasCollider: true, isSolid: true };
const boxC = { x: 300, y: 300, width: 50, height: 50, hasCollider: true, isSolid: true };

const colAB = checkAABB(boxA, boxB);
const colAC = checkAABB(boxA, boxC);
console.log('Box A & B Collision:', colAB.collided, 'Normal:', colAB.normal, 'Overlap:', colAB.overlap);
console.log('Box A & C Collision:', colAC.collided);
if (!colAB.collided || colAC.collided) throw new Error('AABB collision algorithm failed');

console.log('\n--- 2. Testing Circle-Circle & Circle-Box Collisions ---');
const circleA = { x: 100, y: 100, width: 40, height: 40, colliderShape: 'circle', hasCollider: true };
const circleB = { x: 125, y: 110, width: 40, height: 40, colliderShape: 'circle', hasCollider: true };
const colCircles = checkCollision(circleA, circleB);
console.log('Circle-Circle Collision:', colCircles.collided, 'Overlap:', colCircles.overlap);
if (!colCircles.collided) throw new Error('Circle-circle collision failed');

const colCircleBox = checkCollision(circleA, boxA);
console.log('Circle-Box Collision:', colCircleBox.collided);
if (!colCircleBox.collided) throw new Error('Circle-box collision failed');

console.log('\n--- 3. Testing 2D Physics Gravity & Solid Floor Separation ---');
const dynamicPlayer = {
  id: 'p1',
  x: 100,
  y: 100,
  width: 30,
  height: 40,
  vx: 0,
  vy: 0,
  physicsType: 'dynamic',
  hasCollider: true,
  isSolid: false,
  gravityScale: 1
};
const staticFloor = {
  id: 'f1',
  x: 50,
  y: 135,
  width: 200,
  height: 40,
  physicsType: 'static',
  hasCollider: true,
  isSolid: true
};

const objects = [dynamicPlayer, staticFloor];
console.log('Initial Player Y:', dynamicPlayer.y, 'vy:', dynamicPlayer.vy);
updatePhysics(objects, 980, 1/60);
console.log('After 1 tick Player Y:', dynamicPlayer.y, 'vy:', dynamicPlayer.vy, 'isGrounded:', dynamicPlayer.isGrounded);
if (!dynamicPlayer.isGrounded) throw new Error('Solid floor grounding physics failed');

console.log('\n--- 4. Testing Visual Event Rule Evaluator ---');
const mockRuntime = {
  isFirstFrame: false,
  playerObj: dynamicPlayer,
  currentScene: { bounds: { width: 1280, height: 720 } },
  spawnParticles: () => {},
  showHUDMessage: (msg) => console.log('HUD MESSAGE:', msg),
  restartScene: () => {},
  changeScene: () => {}
};

const engine = new EventEngine(mockRuntime);
const testVariables = { score: 0, coins: 0 };
const testCoin = { id: 'c1', tag: 'coin', x: 100, y: 100, width: 20, height: 20, hasCollider: true };
const activeObjects = [dynamicPlayer, testCoin];

const rules = [
  {
    id: 'r1',
    enabled: true,
    trigger: { type: 'on_collision', objectId: 'p1', targetType: 'coin' },
    actions: [
      { type: 'change_variable', variable: 'score', operation: 'add', value: 100 },
      { type: 'change_variable', variable: 'coins', operation: 'add', value: 1 },
      { type: 'destroy_object', targetId: 'context.target' }
    ]
  }
];

const collisions = [{ a: dynamicPlayer, b: testCoin, normal: { x: 1, y: 0 }, overlap: 5 }];
engine.evaluateRules(rules, activeObjects, collisions, testVariables, 1/60);

console.log('Evaluated Variables:', testVariables);
console.log('Remaining Objects Count (Expected 1):', activeObjects.length);
if (testVariables.score !== 100 || testVariables.coins !== 1 || activeObjects.length !== 1) {
  throw new Error('Event rule evaluation failed');
}

console.log('\n--- 5. Testing Game Templates Validity ---');
for (const [key, tmpl] of Object.entries(TEMPLATES)) {
  console.log(`Template: ${tmpl.name} (Scenes: ${tmpl.scenes.length}, Objects: ${tmpl.scenes[0].objects.length}, Rules: ${tmpl.scenes[0].events.length})`);
  if (!tmpl.id || !tmpl.scenes || tmpl.scenes.length === 0) throw new Error(`Template ${key} is invalid`);
}

console.log('\n=============================================');
console.log('ALL GAMESMITH ENGINES & TESTS PASSED 100%!');
console.log('=============================================');
