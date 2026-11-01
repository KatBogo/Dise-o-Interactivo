# Bulevar Diverso

Museo digital y juego de exploración del Bulevar del Río (Cali). Esta carpeta es la **página web ya construida**: se puede publicar tal cual con GitHub Pages para que cualquier persona la vea desde el navegador.

## Publicarla en GitHub Pages (sin instalar nada)

1. Entrá a [github.com](https://github.com) y creá un repositorio nuevo, **público**, por ejemplo `bulevar-diverso`. No marques "Add a README".
2. En el repositorio vacío, hacé clic en **"uploading an existing file"** (o **Add file → Upload files**).
3. Abrí esta carpeta en el explorador de archivos, **entrá en ella**, seleccioná **todo lo que hay adentro** (Ctrl + A: `assets`, `models`, `index.html`, `404.html`, `door.jpg`, `README.md`, `.nojekyll`) y arrastralo a la página de GitHub. Esperá a que terminen de cargar todos y hacé **Commit changes**.
   - Importante: **no** arrastres la carpeta `bulevar-diverso-github` entera. En el repositorio, `index.html` tiene que quedar a la vista apenas lo abrís, no dentro de otra carpeta.
   - No subas el proyecto de código (`src`, `node_modules`, `package.json`…): GitHub Pages solo muestra esta carpeta ya construida.
4. Andá a **Settings → Pages**. En **Source** escogé **Deploy from a branch**, rama **main**, carpeta **/ (root)** y **Save**.
5. Esperá uno o dos minutos y recargá esa página de Settings: arriba aparece el enlace, del estilo
   **`https://TU-USUARIO.github.io/bulevar-diverso/`**. Ese es el enlace para compartir.
   - Si ves un 404, esperá un par de minutos más (la pestaña **Actions** muestra cuándo termina "pages build and deployment").
   - Si sale la página en blanco o solo el texto de este README, revisá que `index.html` y la carpeta `assets` estén en la raíz del repositorio.

## Verla en tu computador

Abrir `index.html` con doble clic **no funciona** (los navegadores no dejan cargar el modelo 3D desde archivos locales). Hay que servir la carpeta, por ejemplo:

```bash
npx serve .
```

y abrir la dirección que aparece (por ejemplo `http://localhost:3000`).

## Notas

- Funciona en Chrome, Edge, Firefox y Safari recientes, en computador y celular. Necesita WebGL.
- El sonido y la voz de Chonti arrancan con el primer clic o toque en la página (así lo exigen los navegadores). Se activan y desactivan arriba a la derecha.
- La voz usa las voces en español instaladas en el equipo; en Edge suenan más naturales.
- Para actualizar la página después de cambiar el proyecto: en la carpeta del código, `npm run github`, y volvé a subir el contenido de `bulevar-diverso-github/`.
