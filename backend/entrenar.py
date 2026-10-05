# backend/entrenar.py
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.models import Model
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping
import os
import json

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
DATASET_DIR = 'backend/dataset'

# Augmentation solo en entrenamiento
train_datagen = ImageDataGenerator(
    preprocessing_function=preprocess_input,
    validation_split=0.2,
    rotation_range=20,
    width_shift_range=0.1,
    height_shift_range=0.1,
    zoom_range=0.2,
    horizontal_flip=True,
    brightness_range=(0.8, 1.2),
)
val_datagen = ImageDataGenerator(
    preprocessing_function=preprocess_input,
    validation_split=0.2,
)

train_gen = train_datagen.flow_from_directory(
    DATASET_DIR, target_size=IMG_SIZE, batch_size=BATCH_SIZE,
    class_mode='categorical', subset='training', shuffle=True, seed=42
)
val_gen = val_datagen.flow_from_directory(
    DATASET_DIR, target_size=IMG_SIZE, batch_size=BATCH_SIZE,
    class_mode='categorical', subset='validation', shuffle=False, seed=42
)

num_classes = len(train_gen.class_indices)
print('Clases:', train_gen.class_indices)

# Modelo base preentrenado
base = MobileNetV2(input_shape=(*IMG_SIZE, 3), include_top=False, weights='imagenet')
base.trainable = False

x = GlobalAveragePooling2D()(base.output)
x = Dropout(0.3)(x)
out = Dense(num_classes, activation='softmax')(x)
model = Model(base.input, out)

early_stop = EarlyStopping(monitor='val_loss', patience=4, restore_best_weights=True)

# Fase 1: entrenar solo la cabeza
model.compile(optimizer=tf.keras.optimizers.Adam(1e-3),
              loss='categorical_crossentropy', metrics=['accuracy'])
model.fit(train_gen, epochs=15, validation_data=val_gen, callbacks=[early_stop])

# Fase 2: fine-tuning de las últimas capas
base.trainable = True
for layer in base.layers[:-30]:
    layer.trainable = False

model.compile(optimizer=tf.keras.optimizers.Adam(1e-5),
              loss='categorical_crossentropy', metrics=['accuracy'])
model.fit(train_gen, epochs=15, validation_data=val_gen, callbacks=[early_stop])

# Guardar
os.makedirs('backend/modelo', exist_ok=True)
model.save('backend/modelo/modelo_raza_gatos.h5')

classes = {v: k for k, v in train_gen.class_indices.items()}
with open('backend/modelo/classes.json', 'w') as f:
    json.dump(classes, f)

print('Modelo y classes.json guardados en backend/modelo/')