-- Agregar columnas de coordenadas a la tabla requests
ALTER TABLE requests
ADD COLUMN latitude DECIMAL(10,8),
ADD COLUMN longitude DECIMAL(11,8);
