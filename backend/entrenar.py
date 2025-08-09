# backend/entrenar.py
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping
import os
import json


# Parámetros
IMG_SIZE = (150, 150)
BATCH_SIZE = 32
EPOCHS = 30
DATASET_DIR = 'backend/dataset'

# Preparar generadores de datos con validación 20%
datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)

train_gen = datagen.flow_from_directory(
    DATASET_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='training',
    shuffle=True
)

val_gen = datagen.flow_from_directory(
    DATASET_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation',
    shuffle=True
)

num_classes = len(train_gen.class_indices)
print(f'Número de clases: {num_classes}')
print('Clases:', train_gen.class_indices)

# Definir modelo CNN simple
model = Sequential([
    Conv2D(32, (3,3), activation='relu', input_shape=(*IMG_SIZE, 3)),
    MaxPooling2D(2,2),
    Conv2D(64, (3,3), activation='relu'),
    MaxPooling2D(2,2),
    Conv2D(128, (3,3), activation='relu'),
    MaxPooling2D(2,2),
    Flatten(),
    Dense(128, activation='relu'),
    Dropout(0.5),
    Dense(num_classes, activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

early_stop = EarlyStopping(
    monitor='val_loss',
    patience=5,  # cuántas épocas espera sin mejora
    restore_best_weights=True
)

# Entrenar modelo
model.fit(
    train_gen,
    epochs=EPOCHS,
    validation_data=val_gen,
    callbacks=[early_stop]
)

# Guardar modelo entrenado
os.makedirs('backend/modelo', exist_ok=True)
model.save('backend/modelo/modelo_raza_gatos.h5')
print('Modelo guardado en modelo/modelo_raza_gatos.h5')

# Guardar mapeo índice -> clase en JSON
class_indices = train_gen.class_indices
classes = {v: k for k, v in class_indices.items()}  # invertimos diccionario

with open('backend/modelo/classes.json', 'w') as f:
    json.dump(classes, f)

print('Archivo classes.json guardado en modelo/classes.json')