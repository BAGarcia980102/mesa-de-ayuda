-- Crear tabla de técnicos
CREATE TABLE IF NOT EXISTS technicians (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO technicians (name) VALUES 
    ('Pedro López'),
    ('María García'),
    ('Carlos Rodríguez'),
    ('Ana Martínez'),
    ('Luis Hernández');

-- Crear tabla de solicitudes
CREATE TABLE IF NOT EXISTS requests (
    id SERIAL PRIMARY KEY,
    request_type VARCHAR(50) NOT NULL,
    reference VARCHAR(100),
    company_name VARCHAR(100) NOT NULL,
    address VARCHAR(200) NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    is_client_owned BOOLEAN DEFAULT false,
    asset_tag VARCHAR(50),
    fault_description TEXT,
    task_to_perform TEXT,
    documents_to_carry TEXT[],
    status VARCHAR(20) DEFAULT 'Pendiente',
    technician_id INTEGER REFERENCES technicians(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    assigned_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
