/**
 * GameSmith - 2D Physics & Collision Engine
 * Provides Euler physics integration, AABB/Circle collision resolution, and behavior controllers.
 */

export function updatePhysics(objects, gravityY = 980, dt = 1/60, worldBounds = { width: 1280, height: 720 }) {
  const activeObjs = objects.filter(o => o.visible !== false);

  // 1. Apply Forces & Integrate Velocity -> Position
  for (const obj of activeObjs) {
    if (obj.physicsType === 'static' || !obj.physicsType || obj.physicsType === 'none') {
      continue;
    }

    obj.isGrounded = false;

    // Apply gravity to dynamic objects
    if (obj.physicsType === 'dynamic') {
      const gScale = obj.gravityScale !== undefined ? obj.gravityScale : 1;
      obj.vy = (obj.vy || 0) + gravityY * gScale * dt;
    }

    // Apply friction
    const friction = obj.friction !== undefined ? obj.friction : 0.9;
    obj.vx = (obj.vx || 0) * Math.pow(friction, dt * 60);

    // Limit max velocity
    const maxV = obj.maxSpeed || 800;
    obj.vx = Math.max(-maxV, Math.min(maxV, obj.vx));
    obj.vy = Math.max(-1200, Math.min(1200, obj.vy));

    // Update X position
    obj.x += obj.vx * dt;

    // Update Y position
    obj.y += obj.vy * dt;
  }

  // 2. Collision Detection & Solid Resolution
  const collisions = [];

  for (let i = 0; i < activeObjs.length; i++) {
    const a = activeObjs[i];
    if (!a.hasCollider) continue;

    for (let j = i + 1; j < activeObjs.length; j++) {
      const b = activeObjs[j];
      if (!b.hasCollider) continue;

      const hit = checkCollision(a, b);
      if (hit.collided) {
        collisions.push({ a, b, normal: hit.normal, overlap: hit.overlap });

        // Resolve solid physics separation if at least one is solid
        if (a.isSolid && b.isSolid) {
          resolveSolidOverlap(a, b, hit.normal, hit.overlap);
        } else if (a.isSolid && b.physicsType === 'dynamic') {
          resolveOneWayOverlap(b, a, hit.normal, hit.overlap);
        } else if (b.isSolid && a.physicsType === 'dynamic') {
          resolveOneWayOverlap(a, b, hit.normal, hit.overlap);
        }
      }
    }
  }

  return collisions;
}

export function checkCollision(a, b) {
  const isCircleA = a.colliderShape === 'circle';
  const isCircleB = b.colliderShape === 'circle';

  if (!isCircleA && !isCircleB) {
    return checkAABB(a, b);
  } else if (isCircleA && isCircleB) {
    return checkCircleCircle(a, b);
  } else if (isCircleA) {
    return checkCircleBox(a, b);
  } else {
    const res = checkCircleBox(b, a);
    return { collided: res.collided, normal: { x: -res.normal.x, y: -res.normal.y }, overlap: res.overlap };
  }
}

// Axis-Aligned Bounding Box (AABB)
export function checkAABB(a, b) {
  const halfW_a = a.width / 2;
  const halfH_a = a.height / 2;
  const halfW_b = b.width / 2;
  const halfH_b = b.height / 2;

  const centerA_x = a.x + halfW_a;
  const centerA_y = a.y + halfH_a;
  const centerB_x = b.x + halfW_b;
  const centerB_y = b.y + halfH_b;

  const dx = centerB_x - centerA_x;
  const dy = centerB_y - centerA_y;

  const ox = halfW_a + halfW_b - Math.abs(dx);
  const oy = halfH_a + halfH_b - Math.abs(dy);

  if (ox > 0 && oy > 0) {
    if (ox < oy) {
      const normalX = dx > 0 ? 1 : -1;
      return { collided: true, normal: { x: normalX, y: 0 }, overlap: ox };
    } else {
      const normalY = dy > 0 ? 1 : -1;
      return { collided: true, normal: { x: 0, y: normalY }, overlap: oy };
    }
  }

  return { collided: false, normal: { x: 0, y: 0 }, overlap: 0 };
}

// Circle-Circle
function checkCircleCircle(a, b) {
  const radiusA = Math.min(a.width, a.height) / 2;
  const radiusB = Math.min(b.width, b.height) / 2;

  const centerA_x = a.x + a.width / 2;
  const centerA_y = a.y + a.height / 2;
  const centerB_x = b.x + b.width / 2;
  const centerB_y = b.y + b.height / 2;

  const dx = centerB_x - centerA_x;
  const dy = centerB_y - centerA_y;
  const dist = Math.hypot(dx, dy);

  if (dist < radiusA + radiusB) {
    const overlap = radiusA + radiusB - dist;
    const nx = dist > 0 ? dx / dist : 1;
    const ny = dist > 0 ? dy / dist : 0;
    return { collided: true, normal: { x: nx, y: ny }, overlap };
  }

  return { collided: false, normal: { x: 0, y: 0 }, overlap: 0 };
}

// Circle-Box
function checkCircleBox(circle, box) {
  const radius = Math.min(circle.width, circle.height) / 2;
  const circleX = circle.x + circle.width / 2;
  const circleY = circle.y + circle.height / 2;

  // Closest point on box
  const clampX = Math.max(box.x, Math.min(circleX, box.x + box.width));
  const clampY = Math.max(box.y, Math.min(circleY, box.y + box.height));

  const dx = clampX - circleX;
  const dy = clampY - circleY;
  const dist = Math.hypot(dx, dy);

  if (dist < radius) {
    const overlap = radius - dist;
    const nx = dist > 0 ? dx / dist : 1;
    const ny = dist > 0 ? dy / dist : 0;
    return { collided: true, normal: { x: nx, y: ny }, overlap };
  }

  return { collided: false, normal: { x: 0, y: 0 }, overlap: 0 };
}

function resolveSolidOverlap(a, b, normal, overlap) {
  const isStaticA = a.physicsType === 'static' || !a.physicsType;
  const isStaticB = b.physicsType === 'static' || !b.physicsType;

  if (isStaticA && isStaticB) return;

  if (isStaticA) {
    resolveOneWayOverlap(b, a, { x: -normal.x, y: -normal.y }, overlap);
  } else if (isStaticB) {
    resolveOneWayOverlap(a, b, normal, overlap);
  } else {
    // Both dynamic: split overlap
    const half = overlap / 2;
    a.x -= normal.x * half;
    a.y -= normal.y * half;
    b.x += normal.x * half;
    b.y += normal.y * half;
  }
}

function resolveOneWayOverlap(dynamicObj, staticObj, normal, overlap) {
  dynamicObj.x -= normal.x * overlap;
  dynamicObj.y -= normal.y * overlap;

  // If hitting from top (falling onto ground)
  if (normal.y > 0) {
    dynamicObj.vy = 0;
    dynamicObj.isGrounded = true;
  } else if (normal.y < 0) {
    // Hitting ceiling
    dynamicObj.vy = Math.max(0, dynamicObj.vy);
  }

  if (normal.x !== 0) {
    dynamicObj.vx = 0;
  }
}
