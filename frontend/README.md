# Reconocimiento de Gatos
Este proyecto es un sistema web que detecta la raza de un gato a partir de una foto. Reconoce 6 razas: Bengal, Bombay, British, Russian, Siamese y Sphynx.

## Tecnologías
- TensorFlow / Keras: modelo entrenado con transfer learning (MobileNetV2 preentrenada en ImageNet, con fine-tuning)
- Flask: API backend
- React: frontend
- Dataset de razas de gatos propio, con aproximadamente 200-250 imágenes por raza (inspirado en `https://www.robots.ox.ac.uk/~vgg/data/pets/`)

## Estructura del proyecto
```
backend/
├── dataset/          # una carpeta por raza, con sus imágenes
├── modelo/           # se genera al entrenar (modelo_raza_gatos.h5 y classes.json)
├── entrenar.py
└── api.py
frontend/
└── src/App.jsx
```

## Cómo usar
1. Cloná el repositorio en `https://github.com/ValentinoVerdi/reconocimiento-raza-gatos`
2. Instalá las dependencias:
   - Backend: `pip install tensorflow flask flask-cors pillow numpy`
   - Frontend: `npm install` dentro de `frontend/`
3. Poné las imágenes en `backend/dataset/`, una carpeta por raza (`Bengal`, `Bombay`, `British`, `Russian`, `Siamese`, `Sphynx`)
4. Corré `python3 backend/entrenar.py` desde la raíz del proyecto
5. Se va a generar la carpeta `backend/modelo/` con `modelo_raza_gatos.h5` y `classes.json`
6. Corré el backend con `cd backend && python3 api.py`
7. Corré el frontend con `npm run dev` dentro de `frontend/`
8. Subí una imagen y verificá la raza del gato

## Cómo funciona
- **Entrenamiento:** se usa MobileNetV2 como base y se entrena en dos fases: primero solo la capa final nueva, y después se afinan las últimas capas de la red con una tasa de aprendizaje baja. Se aplica data augmentation (giros, zoom, rotaciones, brillo) y un 20% de las imágenes se reserva para validación.
- **Preprocesamiento:** las imágenes se redimensionan a 224x224 y se normalizan con `preprocess_input` de MobileNetV2. Tiene que ser el mismo en `entrenar.py` y en `api.py`.
- **Resultado:** la API devuelve la raza más probable, su confianza y el top 3 de razas. Si la confianza es menor al 50%, el frontend muestra "desconocida".

## Notas
- Si cambiás el dataset o las razas, tenés que volver a entrenar el modelo.
- El modelo siempre elige entre sus 6 razas, así que con una foto que no es un gato puede devolver igualmente un resultado (suele ser con baja confianza).
