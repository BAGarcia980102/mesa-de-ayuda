-- Agregar columna technician_id a la tabla requests
ALTER TABLE requests ADD COLUMN IF NOT EXISTS technician_id INTEGER REFERENCES technicians(id);

-- Actualizar la función assignRequestToTechnician para usar technician_id
CREATE OR REPLACE FUNCTION assign_request_to_technician(
    request_id INTEGER,
    technician_id INTEGER
) RETURNS VOID AS $$
BEGIN
    UPDATE requests 
    SET technician_id = technician_id
    WHERE id = request_id;
END;
$$ LANGUAGE plpgsql;
