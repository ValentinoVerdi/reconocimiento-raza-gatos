##Script para separar por razas las imagenes que vienen del dataset
import os
import shutil

ruta_images = 'backend/oxford-iiit-pet/images'
ruta_destino = 'backend/dataset'

if not os.path.exists(ruta_destino):
    os.makedirs(ruta_destino)

for archivo in os.listdir(ruta_images):
    if archivo.endswith('.jpg') or archivo.endswith('.png'):
        raza = archivo.split('_')[0]
        carpeta_raza = os.path.join(ruta_destino, raza)
        if not os.path.exists(carpeta_raza):
            os.makedirs(carpeta_raza)
        shutil.copy(os.path.join(ruta_images, archivo), carpeta_raza)
