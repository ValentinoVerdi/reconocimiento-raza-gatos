# Reconocimiento de Gatos
Este proyecto es un sistema web que detecta la raza de un gato, usando:
-TensorFlow (modelo entrenado)
-Flask (API backend)
-React (frontend)
-Dataset tomado de `https://www.robots.ox.ac.uk/~vgg/data/pets/`

## Cómo usar
1. Cloná el repositorio en `https://github.com/ValentinoVerdi/reconocimiento-raza-gatos`
2. Instalá dependencias en `backend/` y `frontend/` con `npm install`
3. Corré `python3 backend/entrenar.py`
4. Se te va a generar la carpeta `modelo` 
5. Corré el backend con `python3 api.py`
6. Corré el frontend con `npm run dev`
7. Subí una imagen y verificá la raza del gato
