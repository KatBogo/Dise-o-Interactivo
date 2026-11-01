# Bulevar Diverso

A digital museum / exploration game of the Bulevar del Río (Cali). It's built with **Next.js (App Router, client-only SPA)**, **React Three Fiber + drei**, **GSAP + ScrollTrigger**, **cannon-es** and **zustand**.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run github     # static site → bulevar-diverso-github/ (ready for GitHub Pages, see its README.md)
```

**Publishing.** `npm run github` (scripts/make-github-folder.mjs) builds a static export (`STATIC_EXPORT=1` → `output: 'export'`), makes every path relative (so it works from `usuario.github.io/<repo>/` or any sub-folder), renames `_next` to `assets` (GitHub Pages hides folders that start with `_`, so it works even if `.nojekyll` isn't uploaded) and adds `.nojekyll`. Upload the content of `bulevar-diverso-github/` to a repository and turn on Settings → Pages (branch main, root). Assets are referenced relative to the page (`models/chonti.glb`), never with a leading `/`.

## Experience flow

All of the flow lives in `src/store/useExperience.js` as a single `phase`:

```
loading ─► intro (ONE vertical scroll) ─────────────────► falling (AUTOMATIC) ─► guidePrompt ─► reveal ─► stage
cream       0–20  cream screen #FFFDF5: Chonti walks L→R     looks down, the floor     "¿Deseas que…"   soft clouds   camera LOCKED until
loader      20–30 he stops; the cream disappears and the     slides away, cannon-es                   dissipate     LUGARES / EVENTOS /
                  timeline appears BEHIND him                 drops him behind soft                                  RUTAS is picked
            30–80 the timeline slides DOWN (sunset); Chonti   clouds seen from ABOVE   clouds part → island
                  reads, curious, and hops at each new date   (cenital camera)         seen from above → 3/4 view
```

The loader shows a short message (`ui.json → loader.welcome`) and an **"Empezar"** button (`loader.start`). Browsers only allow sound and speech after a click, key or touch (scrolling with the wheel doesn't count), so that click is what lets the music and Chonti's voice start right away; then the intro begins. "Sonido" and "Voz" ON/OFF are in the HUD from the first screen.

While Chonti falls and the clouds open there is no voice and no music: only a falling whistle, the air rushing past and the wind.

On `stage`, `mode` ∈ `lugares | eventos | rutas`. Any `mode` unlocks OrbitControls (360° drag/touch, zoom, inertia/damping). "Volver al mapa" goes back to the three diagonal slices. "← Línea del tiempo" (`backToTimeline`) returns to the intro right where the timeline starts (Chonti's walk is skipped), and scrolling to the end makes him fall onto the island again.

## Content = JSON (replace freely)

| File | What it holds |
|---|---|
| `src/content/timeline.json` | Timeline header and entries (`year`, `title`, `text`, `image`) |
| `src/content/places.json` | Places: `location {along, across}`, slides (card arrows), `story` (full text, scrolls inside the card), `placeholder`, **`model`** (GLB path or `null`), `scale` |
| `src/content/events.json` | Feria del libro, Alumbrado, Sucursal Fest |
| `src/content/routes.json` | Route categories, stops (optional `model`), and the community-wall seed routes |
| `src/content/ui.json` | UI copy, the 3 menu options, the guide prompt, and Chonti's narration lines |

`location.along` runs along the river (−20…20) and `location.across` is the distance from the river (+ = promenade bank, − = back bank). `src/data/content.js` converts these to 3D coordinates, so components never read the JSON directly.

**Placeholders.** Every place and stop renders a rounded procedural placeholder. To use your real model, put the `.glb` in `public/models/` and set `"model": "/models/xxx.glb"` in its JSON entry. `SwappableModel` loads it, centers it, fits it to the placeholder's size, and keeps every animation (emerge on the island, big interactive model in the focus view).

## Architecture

```
src/
├─ app/                     Next.js App Router
│  ├─ layout.jsx            next/font (Bebas Neue = titles, Poppins = text), metadata, no scroll restoration
│  ├─ page.jsx              single route
│  └─ ClientApp.jsx         dynamic(import, { ssr: false }) → client-only SPA
├─ BulevarApp.jsx           GSAP plugins, <Experience/> (WebGL) + <Interface/> (DOM)
├─ content/*.json           ALL editorial content (see above)
├─ data/content.js          JSON adapter · data/bulevarLayout.js: river and island math
├─ config.js                phases, scroll STAGES, FALL_AT, camera poses
├─ theme.js                 palette + mix/shade helpers
├─ store/useExperience.js   zustand store + introState (non-reactive scroll progress)
├─ three/
│  ├─ Experience.jsx        <Canvas> (dpr clamp, shadows, Suspense, Preload)
│  ├─ CameraRig.jsx         reveal dive · OrbitControls lock/unlock · responsive FOV and touch sensitivity
│  ├─ Atmosphere.jsx        Cali sky by hour (stars, moon, sun path) · plan and event skies · studio light during the intro
│  ├─ Weather.jsx           rain · Lightning.jsx (idle while the sky is always clear) · skyState.js: per-frame sky values
│  ├─ Clouds.jsx            SOFT clouds: instanced billboards + fbm noise shader (front bank, dive veil, ambient)
│  ├─ chonti/               ChontiModel (Assets GLB + subdivide.js), IntroScene, fallPhysics, GuideChonti (HUD)
│  ├─ island/Island.jsx     Bulevar island modeled on the real place: blue flowing river, the pedestrian Bulevar (over the Av. Colombia tunnel) on the south bank, Carrera 3 behind its buildings, Av. 1 Norte along the river on the north bank, calles that end at those roads, pedestrian bridges, street lamps on both sides of every street (they light up at night), trees that sway, rocky tips underneath
│  ├─ island/Traffic.jsx    traffic on routes that make sense (straight on, turning in from a calle, turning off into one), stopping at red lights
│  ├─ places/               PlaceModels (architectural placeholders + SwappableModel) · Places (always visible; hop + grow on select)
│  ├─ events/EventDecor.jsx every event builds itself up little by little (event clock + RiseParts/Rise): Feria (4 tent types, bookcases, racks, action figures, posters, leaves) · Alumbrado (Christmas everywhere: garlands along and across every street, bulbs on every roof edge and corner cascades, rings in the tree crowns, arches, light reindeer/trees/stars; ~3,000 twinkling 20-triangle bulbs in a few instanced draws) · Sucursal (5 stages with light rigs, dance floor, ferris wheel, picnic, confetti)
│  └─ routes/RouteLayer.jsx connected markers, route builder, animated path
├─ audio/sound.js          Web Audio engine: marimba de chonta, villancicos (December / Alumbrado), salsa, ambience, effects
└─ ui/                      Loader, IntroTimeline, GuidePrompt, StageUI, PlaceShowcase (LUGARES focus view), Hud, SkyPanel, SoundDirector,
                            Narrator (aria-live + voice), GuideBubble
```

## Key techniques

| Requirement | Where | How |
|---|---|---|
| Scroll-driven intro | `ui/IntroTimeline.jsx` | One GSAP timeline lasting exactly 100 units, scrubbed by ScrollTrigger over a 1000vh runway. Each tween sits at its scroll %. `onUpdate` writes the smoothed progress to `introState.progress`. |
| Timeline behind Chonti | `Atmosphere.jsx` + CSS | During the intro the WebGL canvas is transparent (`alpha`, `scene.background = null`) and sits above the DOM timeline, so the 3D Chonti stands in front of it. |
| Timeline | `ui/IntroTimeline.jsx` | A normal vertical reading: the title and every date (oldest first) form one big column that scrolls up as you scroll down; the date crossing the middle comes into focus and Chonti follows it with his head (`introState.focusY`). "Saltar intro" only skips Chonti's walk. |
| 3D synced to the scroll | `three/chonti/IntroScene.jsx` | Chonti's walk, stop, gaze and reading pose and the camera are pure functions of `introState.progress`, so the intro also plays backwards. |
| Automatic fall | `IntroScene.jsx` + `fallPhysics.js` | At `FALL_AT` (80%) the scroll locks and a GSAP choreography plays: he looks down (worried), wobbles, and the ledge slides away. Then cannon-es drops him and the camera CUTS to a cenital view that follows him into the sea of clouds (`CLOUD_SEA`). When he disappears below the clouds, the sea parts, the camera settles on the island and only THEN the guide question appears. |
| Soft clouds | `three/Clouds.jsx` | Camera-facing instanced quads with a fragment shader: baked fbm noise, soft falloff, light top / warm belly, fog-aware, no depth writes. While Chonti falls, three dense clusters follow his path (`SwallowClouds`) so he sinks into the clouds and they cover him little by little. A soft cloud floor fills the gaps. On reveal the sea PARTS radially from below the camera (the island appears from above), then the camera glides into the 3/4 view (`CameraRig`). |
| Sound | `audio/sound.js`, `ui/SoundDirector.jsx` | Everything synthesized with Web Audio (no files): calm marimba de chonta music, villancicos in December (Cali time) and during the Alumbrado (it opens with a synthesized approximation of the traditional "Tutaina" with maracas, then "Noche de paz", public domain, + an original aguinaldo; a real recording at `public/audio/tutaina.mp3` listed in `audio.json` is played instead), a salsa groove at the Sucursal Fest, rain / wind / birds / crickets / city ambience, thunder, UI sounds. Real recordings can be listed in `src/content/audio.json`. "Sonido ON/OFF" in the HUD. The voice prefers natural (neural) Spanish voices. |
| Real Cali sky | `data/caliSky.js`, `ui/SkyPanel.jsx`, `three/Atmosphere.jsx` | On the island the sky follows Cali's real clock (America/Bogota), always clear (the live weather was removed; `fetchCaliWeather` and the weather table remain in `caliSky.js`, unused). Keyframes by hour (madrugada → amanecer → mediodía → atardecer → noche estrellada) set sky, sun path, lights, fog, lit windows and street lamps. The top-left panel shows the island's hour and lets you change it (slider + Amanecer / Mediodía / Atardecer / Noche) or go back to Cali's hour. Until a plan is picked the island keeps one fixed bright morning (`PREVIEW_SKY`) and the panel is hidden; from the first plan on it shows Cali's real hour and the panel appears (`skyOf` / `skyIsLive` in the store). Each event still sets its own sky (`EVENT_SKY`); leaving the event gives Cali's hour back. |
| Sunset | `three/Atmosphere.jsx` + CSS `.tl-backdrop` | Sky dome shader (rosa → mango horizon, low sun with halo) that eases per event (Alumbrado = dusk). The intro timeline uses the same sunset as a CSS gradient with a sun and soft clouds. |
| Chonti's face & body | `three/chonti/chontiFace.js`, `ChontiModel.jsx` | The eye bumps of the GLB head are found on a front depth map, and eyes, brows, cheeks and mouths are attached on the surface. The six expressions of the character sheet (`happy` Feliz, `talking` Hablando, `surprised` Sorprendido, `angry` Enojado, `wink` Guiño, `calm` Tranquilo) blend smoothly, with talking and blinking. The clay look (`clayMaterial.js`) is a MeshPhysicalMaterial with sheen, a soft fresnel rim and procedural speckles. While reading the timeline, his head follows each date as it slides down. Body language (reading lean, curious head tilts, hops, waves) runs on the skeleton with joint `LIMITS`, so limbs never cross his head or belly. Colors and a clay shader with fine peel relief follow the reference sheet in `Assets/` (geometry untouched). 14 expressions (the sheet's 6 + laugh, love, sad, sleepy, excited, shy, thinking, scared); his hands are checked against an ellipsoid of the head every frame, so they stop at its surface. The crown is re-attached rigidly to the neck bone (slightly enlarged and lifted), so the head never pokes through it. As the guide he reacts to everything (choosing a plan, places, events — he dances at the Sucursal —, weather, night, hovering, clicks on him, inactivity) and his eyes follow the mouse. In the timeline his head follows each date and every new date gets a reaction in turn: open arms, thinking (hand under the chin) or scratching his head. Preview: `/?chonti&front&expr=surprised&pose=think` (`scratch`, `flail`…). |
| Camera lock/unlock | `three/CameraRig.jsx` | Locked until a category is chosen; once the visitor has explored one (`explored`), going back to the map keeps it free to move. Mounted only on stage. FOV, distance, rotate/zoom speed and damping adapt to aspect ratio and touch. |
| First choice | `ui/StageUI.jsx` (FilterHero) | The three plans fill the screen as transparent diagonal slices over the island (horizontal slanted bands on portrait). Each plan is one centred column on the centre line of its slice that leans exactly like the diagonal (`skewX(atan2(…))`, every line straightened back), so the text keeps its distance from both cuts; the tops are aligned and the bottom-left corner stays free for Chonti. The symbol (10%) has its own space above the name. Each slice tints the island with its ambience (green / night with stars / sunset), deep enough for the white labels. Chonti reads the options aloud. |
| Performance | `Experience.jsx`, `Clouds.jsx` | Adaptive pixel ratio (≤ 1.5, ≤ 1.25 on very large screens, 1 when the device struggles), shadows re-rendered a few times per second, clouds sampling a baked noise texture, lighter tree and head geometry, events that are off don't animate. |
| Menus | `ui/StageUI.jsx` | Lugares and Eventos are picked directly on the island (every 3D marker is an HTML button). RUTAS has its menu on the RIGHT (categories, "¿Querés crear tu ruta?", Muro comunitario). "Volver al mapa" sits next to the bottom menu. |
| Island models | `island/Island.jsx`, `places/PlaceModels.jsx`, `materials.js` | Low-poly but crisp: chamfered blocks with window grids, clay-tile hip roofs (`geo.hipRoof`) on colonial houses, balconies facing the river, faceted flat-shaded tree crowns. Landmarks: MUCIC (glass base, brick volume with fins), Gato de Tejada (faceted bronze + "novias"), Biblioteca Centenario (republican portico + pediment), La Tertulia (brick galleries + stepped open-air theatre). |
| LUGARES focus | `three/places/Places.jsx` + `ui/PlaceShowcase.jsx` | Every place stands on the island from the start; on select it does a little hop (dust ring) and grows. Then a backdrop-filter blurs and darkens the island, and a second small canvas above it shows the big model on the LEFT (drei `<Bounds>` frames it, autoRotate + 360° drag with inertia, ContactShadows). A card next to it has numbered slides; the story is split over them (`storyParts`, data/content.js), with the slide's short phrase in the background, so nothing scrolls. All slides share one grid cell, so the card keeps the tallest one's height. Buttons jump to the previous/next place without leaving the view. On mobile the model sits on top and the card below takes the room it needs. Phones: cards and sheets sit low, right above "Volver al mapa", Chonti stands on their top edge, and the island is centred (and zoomed out if needed) in the free gap above (`CameraRig` ViewShift). |
| Cards never hide the map | `CameraRig.jsx` (ViewShift) + `StageUI.jsx` | While a floating card is open the projection is shifted (`setViewOffset`) so the island is centred in the free part of the screen (left of the card on desktop, above the bottom sheet on phones). The event card can be folded into a small pill. |
| Accessibility | `ui/Narrator.jsx`, markers | aria-live narration and Web Speech voice: a boy — only male Spanish voices are used (known female ones, including Chrome's "Google español", are skipped while a male one exists), with a raised child's pitch, a lively rate and small per-sentence variations (questions and exclamations go up). Every new narration cuts the previous one, and he stops when what he was reading leaves the screen. Turning "Voz" ON makes Chonti appear like a magician in his corner (a cloud of smoke, sparkles, a spin) and say what's on screen; OFF makes him vanish the same way. The guide Chonti lives in his own small transparent canvas (`GuideChonti.jsx`, `.guide-layer`) above the plan filters and menus, so nothing tints or covers him. Opening a place, he reads the card and then the whole story. Chonti reads everything on screen: the timeline title and each date as it reaches the middle, the guide question, the plan options, places, events and routes. Every 3D point is also an HTML button: a bigger, raised orange pin with a pulse whose name shows on hover or focus. |

## Notes

- **Chonti** is exclusively the Blender model `Assets/personajechonti.glb`. `npm run dev` / `npm run build` run `scripts/sync-assets.mjs` first, which validates it and copies it to `public/models/chonti.glb` (the folder Next.js serves). If the export is empty or broken, it prints a warning and keeps the last valid model. Run it alone with `npm run sync-assets`.
  - **Head:** the GLB contains the head's low-poly cage, because the Subdivision Surface modifier isn't applied on export. `three/chonti/subdivide.js` applies Catmull–Clark (the same algorithm as Blender) to that cage. If you tick "Apply Modifiers" when exporting, you can remove that step.
  - **Colors:** the GLB has no materials, so `ChontiModel.jsx` colors it with the character sheet's palette.
  - **Animation:** there are no animation clips. Walking, reading, talking and falling rotate its own 18-bone rig (`RIG` / `poseChonti`). If you add clips in Blender, play them with drei's `useAnimations`.
  - **Dev preview:** `/?chonti`, `&walk`, `&front`, `&raw`.
- **Markers' HTML pins** use `three/ScreenHtml.jsx` instead of drei's `<Html>`: with React 19 drei unmounts its inner root during a render and Next.js shows it as an error on localhost.
- **Plan colours**: each slice of the selector is a moment of the day (Lugares a sunny day, Eventos the night, Rutas the sunset) and choosing a plan puts the island in that same moment (`MODE_SKY` in `data/caliSky.js`); the sky panel can change it or go back to Cali's hour. Events still bring their own sky (`EVENT_SKY`).
- **Chonti's outfits**: Alumbrado → Christmas hat, Feria del Libro → round glasses, Sucursal Fest → pink cap (`buildHats` in ChontiModel.jsx, glasses in chontiFace.js, `setAccessory` on the rig; preview `/?chonti&acc=santa|glasses|cap`). While he speaks he explains with both hands (`talk` in `poseChonti`); tapping him gives a short laugh (hands on his belly).
- **Tutaina**: `Assets/tutaina.mpeg` (an MP3) is copied to `public/audio/tutaina.mp3` by `scripts/sync-assets.mjs` and plays during the Alumbrado (`audio.json`); the synthesized version is the fallback.
- **Clouds** are puffy cumulus (soft ball shading, silver lining, smooth low-frequency outline). The sea of clouds and the timeline's soft clouds only appear in the last stretch of the timeline, before the fall.
- **Phones**: Chonti's walk takes 70vh of scroll instead of 200vh (`LENGTH_VH` / `RUNWAY_VH` in config.js).
- **Camera**: free to orbit, zoom and slide (pan) along the island; `KeepAbove` (CameraRig) keeps it over the tallest towers and the orbit centre over the island, so it never goes into a building or under the island.
- **Voice**: one voice, always a man's, the most natural the device has (neural first, then es-CO), used untouched (pitch / rate 1 — changing them is what sounds robotic). Edge's "Gonzalo (Natural) – Colombia" sounds best; Windows' own "Raúl / Pablo" are robotic by nature.
- **`npm run dev`** clears `.next` first (`scripts/clean-next.mjs`): a stale cache gives "Cannot find module './NN.js'" on localhost.
- **Community Wall** is stored per browser (localStorage). Sharing routes between users needs a backend; replace `saveRoute`/`wall` in the store.
- **Dev console:** `__bulevar.store.getState().skipIntro()`; `__bulevar.three()` returns the R3F state (camera, controls, scene).
