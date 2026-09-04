"use client";

import { useCallback, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { getBeatPhase } from "@/lib/heartbeat";
import { colors } from "@/lib/theme";
import { FAILING_INDEX, LOOP, WATCHER, ease, mix, span } from "./machineData";

/* ============================================================================
   THE MACHINE — WebGL
   ----------------------------------------------------------------------------
   An exploded axonometric drawing that happens to be in 3D. Hairlines, flat
   unlit plates, projection lines dropped to a baseline — the same drawing
   language as the rest of the site, given depth.

   Deliberately NOT: glowing spheres, chrome, wireframe blobs, floating cubes.
   Everything here is a labelled part of a system that content.json describes.

   All animation is read from a single scroll progress ref inside useFrame, so
   scrolling this scene causes zero React re-renders.
   ========================================================================= */

/*
 * react-hooks/immutability is disabled for this file on purpose. Everything
 * below the Canvas animates by writing into geometry buffers and object3D
 * transforms that were allocated once in useMemo — that is the whole point of
 * the render loop. Satisfying the rule would mean reallocating vertex arrays
 * sixty times a second, which is the opposite of what it exists to prevent.
 */
/* eslint-disable react-hooks/immutability */

const PAPER = new THREE.Color(colors.machine.paper);
const PLATE = new THREE.Color(colors.machine.plate);
const LINE = new THREE.Color(colors.machine.line);
const DIM = new THREE.Color(colors.machine.dim);
const LIVE = new THREE.Color(colors.machine.live);
const ALARM = new THREE.Color(colors.machine.alarm);

const PLATE_W = 1.62;
const PLATE_H = 0.62;
const SEGMENTS = 168;
const BASELINE = -3.15;

/** the stacked, "it's just one thing" arrangement */
const stackedAt = (index: number, count: number): THREE.Vector3 =>
  new THREE.Vector3(0, 0, (index - (count - 1) / 2) * 0.085);

function buildOutline(color: THREE.Color, opacity: number) {
  const w = PLATE_W / 2;
  const h = PLATE_H / 2;
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-w, -h, 0),
    new THREE.Vector3(w, -h, 0),
    new THREE.Vector3(w, h, 0),
    new THREE.Vector3(-w, h, 0),
  ]);
  const material = new THREE.LineBasicMaterial({
    color: color.clone(),
    transparent: true,
    opacity,
  });
  return new THREE.LineLoop(geometry, material);
}

function buildPolyline(points: number, color: THREE.Color, opacity: number) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array((points + 1) * 3), 3),
  );
  const material = new THREE.LineBasicMaterial({
    color: color.clone(),
    transparent: true,
    opacity,
  });
  return new THREE.Line(geometry, material);
}

function Assembly({ progress }: { progress: RefObject<number> }) {
  const all = useMemo(() => [...LOOP, WATCHER], []);

  const groupRef = useRef<THREE.Group>(null);
  const nodeRefs = useRef<(THREE.Group | null)[]>([]);
  const plateRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const lampRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const labelRefs = useRef<(THREE.Mesh | null)[]>([]);
  const noteRefs = useRef<(THREE.Mesh | null)[]>([]);

  /* --- imperative line work: hairlines are cheaper and more on-brand than
         any tube or extruded stroke, and they update per frame for free ---- */
  const draw = useMemo(() => {
    const curvePoints = LOOP.map(() => new THREE.Vector3());
    // low tension: the links read as a drawn circuit rather than as a blob
    const curve = new THREE.CatmullRomCurve3(curvePoints, true, "catmullrom", 0.24);

    const loop = buildPolyline(SEGMENTS, LINE, 0);
    const tail = buildPolyline(18, LIVE, 0);
    tail.material.linewidth = 1;

    const outlines = [...LOOP, WATCHER].map(() => buildOutline(LINE, 0));

    // projection lines dropped to a baseline, as in an engineering drawing
    const drops = [...LOOP, WATCHER].map(() => buildPolyline(1, DIM, 0));

    const baseline = buildPolyline(1, DIM, 0);

    // the watcher's sightlines: dashed, because it is only looking
    const sightlines = [1, 2, 3, 4].map(() => {
      const line = buildPolyline(1, LINE, 0);
      const material = new THREE.LineDashedMaterial({
        color: LINE.clone(),
        transparent: true,
        opacity: 0,
        dashSize: 0.09,
        gapSize: 0.12,
      });
      line.material.dispose();
      line.material = material;
      return line;
    });

    const head = new THREE.Mesh(
      new THREE.BoxGeometry(0.11, 0.11, 0.11),
      new THREE.MeshBasicMaterial({ color: LIVE.clone(), transparent: true, opacity: 0 }),
    );

    return {
      curve,
      curvePoints,
      loop,
      tail,
      outlines,
      drops,
      baseline,
      sightlines,
      head,
    };
  }, []);

  // scratch vectors — nothing is allocated inside the frame loop
  const scratch = useMemo(
    () => ({
      v: new THREE.Vector3(),
      w: new THREE.Vector3(),
      target: new THREE.Vector3(),
      color: new THREE.Color(),
    }),
    [],
  );

  useFrame((state, delta) => {
    const p = progress.current ?? 0;
    const d = Math.min(delta, 0.05);
    const { v, w, color } = scratch;

    /* ---- phase windows (mirrored in machineData BEATS) ------------------ */
    const separate = ease(span(p, 0.15, 0.42));
    const failing = span(p, 0.56, 0.68);
    const resetting = span(p, 0.73, 0.86);
    const recovered = span(p, 0.86, 0.95);
    const running = Math.max(span(p, 0.4, 0.5) - failing + recovered, 0);

    /* ---- 1. where every part currently is ------------------------------- */
    all.forEach((node, i) => {
      const group = nodeRefs.current[i];
      if (!group) return;

      const stacked = stackedAt(i, all.length);
      // the watcher separates last, and reluctantly
      const stagger = i === all.length - 1 ? 0.55 : 1 - i * 0.06;
      const t = ease(Math.min(1, separate * (0.7 + stagger * 0.5)));

      v.set(
        mix(stacked.x, node.at[0], t),
        mix(stacked.y, node.at[1], t),
        mix(stacked.z, node.at[2], t),
      );

      // the stage that stops answering detaches and tumbles forward
      if (i === FAILING_INDEX) {
        const fell = failing * (1 - ease(resetting));
        v.x += fell * 0.55;
        v.y -= fell * 2.05;
        v.z += fell * 1.35;
        group.rotation.z = -fell * 0.62;
        group.rotation.x = fell * 0.38;
      }

      group.position.copy(v);

      // the watcher turns to face the part that failed
      if (node.id === WATCHER.id) {
        const aim = Math.max(failing, resetting) * (1 - recovered * 0.85);
        group.rotation.z = aim * -0.26;
        group.rotation.y = aim * 0.42;
      }

      if (i < LOOP.length) draw.curvePoints[i].copy(v);
    });

    /* ---- 2. the loop itself --------------------------------------------- */
    const loopArray = draw.loop.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i <= SEGMENTS; i += 1) {
      draw.curve.getPoint(i / SEGMENTS, w);
      loopArray[i * 3] = w.x;
      loopArray[i * 3 + 1] = w.y;
      loopArray[i * 3 + 2] = w.z;
    }
    draw.loop.geometry.attributes.position.needsUpdate = true;
    draw.loop.geometry.computeBoundingSphere();
    draw.loop.material.opacity = separate * 0.72;

    /* ---- 3. the pulse: one lap per real second, from the site heartbeat -- */
    const nodeT = FAILING_INDEX / LOOP.length;
    const stalledAt = nodeT - 0.055;
    const alive = span(p, 0.38, 0.44);

    let beat = getBeatPhase();
    if (failing > 0.35 && resetting < 0.6) {
      // it doesn't stop dead — it keeps arriving at a door nobody opens
      beat = stalledAt + Math.sin(state.clock.elapsedTime * 9) * 0.006;
    }

    draw.curve.getPoint((beat + 1) % 1, w);
    draw.head.position.copy(w);
    const headVisible = alive * (1 - failing * 0.35);
    draw.head.material.opacity = headVisible;
    draw.head.material.color.copy(failing > 0.35 && resetting < 0.6 ? ALARM : LIVE);
    draw.head.rotation.y += d * 1.6;
    draw.head.rotation.x += d * 1.1;

    const tailArray = draw.tail.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i <= 18; i += 1) {
      const t = (((beat - (1 - i / 18) * 0.075) % 1) + 1) % 1;
      draw.curve.getPoint(t, w);
      tailArray[i * 3] = w.x;
      tailArray[i * 3 + 1] = w.y;
      tailArray[i * 3 + 2] = w.z;
    }
    draw.tail.geometry.attributes.position.needsUpdate = true;
    draw.tail.geometry.computeBoundingSphere();
    draw.tail.material.opacity = headVisible * 0.8;
    draw.tail.material.color.copy(draw.head.material.color);

    /* ---- 4. per-part state: lamps, plates, labels ------------------------ */
    all.forEach((node, i) => {
      const lamp = lampRefs.current[i];
      const plate = plateRefs.current[i];
      const outline = draw.outlines[i];
      const label = labelRefs.current[i]?.material as
        | THREE.MeshBasicMaterial
        | undefined;
      const note = noteRefs.current[i]?.material as
        | THREE.MeshBasicMaterial
        | undefined;

      const isWatcher = node.id === WATCHER.id;
      const isFailed = i === FAILING_INDEX && failing > 0.4 && resetting < 0.55;
      const isDownstream =
        !isWatcher && i > FAILING_INDEX && failing > 0.5 && resetting < 0.55;

      // the pulse lighting each stage as it arrives
      const distance = isWatcher
        ? 1
        : Math.abs(((beat - i / LOOP.length + 1.5) % 1) - 0.5);
      const lit = headVisible * Math.max(0, 1 - distance / 0.06);

      if (lamp) {
        color.copy(DIM);
        if (lit > 0) color.lerp(LIVE, lit);
        if (isWatcher && (failing > 0.4 || resetting > 0)) {
          color.copy(ALARM).lerp(DIM, 1 - Math.max(failing, resetting));
        }
        if (isFailed) color.copy(ALARM);
        lamp.color.copy(color);
        lamp.opacity = separate * (isFailed || lit > 0 ? 1 : 0.75);
      }

      if (plate) plate.opacity = separate * (isDownstream ? 0.25 : 0.78);

      const inkOpacity =
        separate * (isDownstream ? 0.3 : 1) * (isWatcher ? 0.86 : 1);
      if (outline) {
        outline.material.opacity = inkOpacity * 0.85;
        (outline.material as THREE.LineBasicMaterial).color.copy(
          isFailed ? ALARM : LINE,
        );
      }
      if (label) {
        label.opacity = inkOpacity;
        label.color.copy(isFailed ? ALARM : PAPER);
      }
      if (note) note.opacity = inkOpacity * 0.55;

      // projection line down to the baseline
      const drop = draw.drops[i];
      const dropArray = drop.geometry.attributes.position.array as Float32Array;
      const group = nodeRefs.current[i];
      if (group) {
        dropArray[0] = group.position.x;
        dropArray[1] = group.position.y - PLATE_H / 2;
        dropArray[2] = group.position.z;
        dropArray[3] = group.position.x;
        dropArray[4] = BASELINE;
        dropArray[5] = group.position.z;
        drop.geometry.attributes.position.needsUpdate = true;
        drop.geometry.computeBoundingSphere();
        drop.material.opacity = separate * 0.3 * (isFailed ? 2 : 1);
        drop.material.color.copy(isFailed ? ALARM : DIM);
      }
    });

    /* ---- 5. the baseline the drawing is projected onto ------------------- */
    const baseArray = draw.baseline.geometry.attributes.position
      .array as Float32Array;
    baseArray[0] = -5.8;
    baseArray[1] = BASELINE;
    baseArray[2] = 1.7;
    baseArray[3] = 5.4;
    baseArray[4] = BASELINE;
    baseArray[5] = -2.5;
    draw.baseline.geometry.attributes.position.needsUpdate = true;
    draw.baseline.material.opacity = separate * 0.3;

    /* ---- 6. the watcher's sightlines ------------------------------------ */
    const watcherGroup = nodeRefs.current[all.length - 1];
    draw.sightlines.forEach((line, index) => {
      const targetIndex = index + 1;
      const targetGroup = nodeRefs.current[targetIndex];
      if (!watcherGroup || !targetGroup) return;

      const array = line.geometry.attributes.position.array as Float32Array;
      array[0] = watcherGroup.position.x;
      array[1] = watcherGroup.position.y;
      array[2] = watcherGroup.position.z;

      const isTheOne = targetIndex === FAILING_INDEX;
      const reach = isTheOne ? Math.max(failing, ease(resetting)) : 1;
      array[3] = mix(watcherGroup.position.x, targetGroup.position.x, reach);
      array[4] = mix(watcherGroup.position.y, targetGroup.position.y, reach);
      array[5] = mix(watcherGroup.position.z, targetGroup.position.z, reach);

      line.geometry.attributes.position.needsUpdate = true;
      line.geometry.computeBoundingSphere();
      line.computeLineDistances();

      const material = line.material as THREE.LineDashedMaterial;
      const urgent = isTheOne ? Math.max(failing, resetting) : 0;
      material.opacity = separate * mix(0.16, 0.75, urgent);
      material.color.copy(color.copy(LINE).lerp(ALARM, urgent));
      // the sightline stops blinking and becomes a command
      material.dashSize = mix(0.09, 0.6, urgent);
    });

    /* ---- 7. framing -----------------------------------------------------
       The camera dollies out as the object comes apart: you start close
       enough to believe it is one thing, and end far enough to see it isn't.
       The assembly is held high in the frame so the captions always have the
       bottom band to themselves. */
    if (groupRef.current) {
      const g = groupRef.current;
      g.rotation.y = mix(-0.52, 0.14, ease(span(p, 0, 1))) + state.pointer.x * 0.06;
      g.rotation.x = mix(0.4, -0.05, ease(span(p, 0, 0.6))) - state.pointer.y * 0.04;
      g.position.y = mix(0.15, 1.15, ease(span(p, 0.08, 0.5)));
      g.position.x = mix(0, 0.2, ease(span(p, 0.08, 0.5)));
      g.scale.setScalar(1 - recovered * 0.05);
    }
    state.camera.position.z = mix(13, 20.2, ease(span(p, 0.05, 0.48)));
    state.camera.updateProjectionMatrix();

    void running;
  });

  return (
    <group ref={groupRef}>
      <primitive object={draw.loop} />
      <primitive object={draw.tail} />
      <primitive object={draw.head} />
      <primitive object={draw.baseline} />
      {draw.drops.map((drop, i) => (
        <primitive key={`drop-${i}`} object={drop} />
      ))}
      {draw.sightlines.map((line, i) => (
        <primitive key={`sight-${i}`} object={line} />
      ))}

      {all.map((node, i) => (
        <group
          key={node.id}
          ref={(element) => {
            nodeRefs.current[i] = element;
          }}
        >
          {/* the plate */}
          <mesh>
            <planeGeometry args={[PLATE_W, PLATE_H]} />
            <meshBasicMaterial
              ref={(material) => {
                plateRefs.current[i] = material;
              }}
              color={PLATE}
              transparent
              opacity={0}
              toneMapped={false}
            />
          </mesh>

          <primitive object={draw.outlines[i]} />

          {/* status lamp, top-left corner, like a rack unit */}
          <mesh position={[-PLATE_W / 2 + 0.13, PLATE_H / 2 - 0.13, 0.001]}>
            <planeGeometry args={[0.075, 0.075]} />
            <meshBasicMaterial
              ref={(material) => {
                lampRefs.current[i] = material;
              }}
              color={DIM}
              transparent
              opacity={0}
              toneMapped={false}
            />
          </mesh>

          <Text
            ref={(mesh) => {
              labelRefs.current[i] = mesh as unknown as THREE.Mesh;
            }}
            font="/fonts/plex-mono-500.woff"
            fontSize={0.155}
            letterSpacing={0.15}
            anchorX="left"
            anchorY="middle"
            position={[-PLATE_W / 2 + 0.26, 0.075, 0.002]}
          >
            {node.label}
            <meshBasicMaterial
              attach="material"
              color={PAPER}
              transparent
              opacity={0}
              toneMapped={false}
            />
          </Text>

          <Text
            ref={(mesh) => {
              noteRefs.current[i] = mesh as unknown as THREE.Mesh;
            }}
            font="/fonts/plex-mono-500.woff"
            fontSize={0.105}
            letterSpacing={0.12}
            anchorX="left"
            anchorY="middle"
            position={[-PLATE_W / 2 + 0.26, -0.135, 0.002]}
          >
            {node.note}
            <meshBasicMaterial
              attach="material"
              color={PAPER}
              transparent
              opacity={0}
              toneMapped={false}
            />
          </Text>
        </group>
      ))}
    </group>
  );
}

export default function MachineCanvas({
  progress,
  active,
  onExhausted,
}: {
  progress: RefObject<number>;
  active: boolean;
  /** called when WebGL has failed enough times to stop trying */
  onExhausted: () => void;
}) {
  // A lost GL context must never leave an opaque canvas sitting on top of the
  // scene. Remounting against a fresh <canvas> gets a fresh context, which
  // also covers real-world losses: GPU resets, suspended tabs, driver hiccups.
  const [generation, setGeneration] = useState(0);

  const handleLost = useCallback(
    (event: Event) => {
      event.preventDefault();
      setGeneration((current) => {
        if (current >= 2) {
          onExhausted();
          return current;
        }
        return current + 1;
      });
    },
    [onExhausted],
  );

  return (
    <Canvas
      key={generation}
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 10.4], fov: 26 }}
      style={{ pointerEvents: "none" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", handleLost, {
          once: true,
        });
      }}
    >
      <Assembly progress={progress} />
    </Canvas>
  );
}
