# backend/api.py
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
from flask_cors import CORS
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import numpy as np
import os
import json

app = Flask(__name__)
CORS(app)

# Cargar modelo entrenado
model_path = 'modelo/modelo_raza_gatos.h5'
model = load_model(model_path)

# Cargar clases de razas 
classes_path = 'modelo/classes.json'
if os.path.exists(classes_path):
    with open(classes_path, 'r') as f:
        clases = json.load(f)
else:
    clases = []

def preparar_imagen(imagen):
    imagen = imagen.convert("RGB").resize((224, 224))
    array = img_to_array(imagen)
    array = preprocess_input(array)
    return np.expand_dims(array, axis=0)

@app.route('/predict', methods=['POST'])
def predict():
    if 'imagen' not in request.files:
        return jsonify({'error': "No se encontró archivo 'imagen'"}), 400

    archivo = request.files['imagen']
    imagen = Image.open(archivo)
    preparada = preparar_imagen(imagen)
    preds = model.predict(preparada)[0]
    top3 = np.argsort(preds)[::-1][:3]
    indice = int(top3[0])
    return jsonify({
        'raza': clases.get(str(indice), "desconocida"),
        'confianza': float(preds[indice]),
        'top3': [{'raza': clases.get(str(int(i))), 'confianza': float(preds[i])} for i in top3]
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
