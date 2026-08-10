# GLB asset slots

The hero scene renders procedural stand-ins wherever a real model is not yet
available. Each stand-in occupies a **reserved transform** — drop a `.glb` in
here, point the slot at it, and the model appears in exactly the same position,
rotation and scale. No scene surgery, no layout shift.

## How to fill a slot

1. Export the model as `.glb` (Draco or meshopt compression is fine — `useGLTF`
   handles both) and place it in this directory.
2. Open `three/model-slots.ts` and set that slot's `url`:

   ```ts
   heroMonolithLeft: {
     id: "hero-monolith-left",
     url: "/models/hero-monolith-left.glb", // ← add this line
     position: [-6.4, -1.2, -3.4],
     ...
   }
   ```

3. Nothing else changes. `<ModelSlot>` loads the GLB inside the existing
   `<Suspense>` boundary and drops the procedural stand-in.

## Current slots

| Slot id               | Position            | Scale | Intended asset                                                     |
| --------------------- | ------------------- | ----- | ------------------------------------------------------------------ |
| `hero-monolith-left`  | `-6.4, -1.2, -3.4`  | 1.55  | Left foreground form — stacked-brick or machine-housing silhouette |
| `hero-monolith-right` | `7.1, 1.4, -5.2`    | 2.10  | Right background structure — gantry, frame or conveyor section     |
| `hero-core`           | `0, -2.6, -1.2`     | 0.95  | Centre-low accent form — sensor head or edge device                |

## Budget

The hero holds a 60fps target on integrated graphics. Keep each model under
roughly **150k triangles** and **2 material slots**, with textures at 1024px or
smaller. The scene is unlit by design — baked colour reads correctly, PBR maps
mostly will not.

Do not delete a slot to "clean up": the procedural stand-in is part of the
composition, not scaffolding. Leave `url` undefined instead.
