import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Definir tipos para los tipos de solicitud
const requestTypes = ['servicio técnico', 'entrega', 'otros', 'recogida'] as const;

type RequestType = typeof requestTypes[number];

// Definir colores para cada tipo de solicitud
const requestTypeColors: Record<RequestType, string> = {
  'servicio técnico': 'bg-blue-100 text-blue-800',
  'entrega': 'bg-green-100 text-green-800',
  'otros': 'bg-gray-100 text-gray-800',
  'recogida': 'bg-pink-100 text-pink-800'
} as const;

// Obtener color para un tipo de solicitud
const getTypeColor = (type: string): string => {
  const normalizedType = type.toLowerCase().trim() as RequestType;
  return requestTypeColors[normalizedType] || 'bg-gray-100 text-gray-800';
};

interface Request {
  id: number;
  company_name: string;
  contact_name: string;
  phone: string;
  request_type: string;
  reference: string;
  is_client_owned: boolean;
  asset_tag: string;
  fault_description: string;
  task_to_perform: string;
  documents_to_carry: string;
  created_at: string;
  assigned_to: string | null;
  status: string;
  address: string;  // Agregado para mantener consistencia con el código existente
}

const technicians = [
  'DANIEL DIAZ',
  'ANDERSSON FLOR',
  'BREYNER LONDOÑO',
  'LUIS ÑAÑEZ',
  'CARLOS LUJAN',
  'ANA ORTIZ'
];

const RequestList: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedTechnicians, setSelectedTechnicians] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/requests');
      console.log('Response data:', response.data);
      setRequests(response.data);
    } catch (error) {
      console.error('Error details:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data);
        setError(`Error al cargar las solicitudes: ${error.response?.data?.error || 'Error desconocido'}`);
      } else {
        console.error('Network error:', error);
        setError('Error de red al cargar las solicitudes');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (id: number) => {
    const selectedTech = selectedTechnicians[id];
    if (!selectedTech) {
      alert('Por favor, selecciona un técnico.');
      return;
    }

    try {
      await axios.put(`http://localhost:5001/api/requests/${id}/assign`, { technicianName: selectedTech });
      alert('Técnico asignado exitosamente.');
      fetchRequests(); // Refresca la lista
    } catch (error) {
      console.error(error);
      alert('Error al asignar el técnico.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Solicitudes Registradas</h2>
        <Link
          to="/requests/register"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Registrar nueva solicitud
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{req.company_name}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(req.request_type)}`}>
                  {req.request_type}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Fecha</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(req.created_at).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Dirección</dt>
                  <dd className="mt-1 text-sm text-gray-900">{req.address}</dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Contacto</dt>
                  <dd className="mt-1 text-sm text-gray-900">{req.contact_name}</dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                  <dd className="mt-1 text-sm text-gray-900">{req.phone}</dd>
                </div>

                {req.request_type.toLowerCase() !== 'servicio técnico' && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Tarea a Realizar</dt>
                    <dd className="mt-1 text-sm text-gray-900">{req.task_to_perform}</dd>
                  </div>
                )}

                {req.request_type.toLowerCase() === 'servicio técnico' && (
                  <>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Referencia de Impresora</dt>
                      <dd className="mt-1 text-sm text-gray-900">{req.reference}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Activo Fijo</dt>
                      <dd className="mt-1 text-sm text-gray-900">{req.asset_tag}</dd>
                    </div>
                  </>
                )}

                <div>
                  <dt className="text-sm font-medium text-gray-500">Descripción de Fallo</dt>
                  <dd className="mt-1 text-sm text-gray-900">{req.fault_description}</dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Documentos a Llevar</dt>
                  <dd className="mt-1 text-sm text-gray-900">{req.documents_to_carry}</dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Estado</dt>
                  <dd className="mt-1 text-sm text-gray-900">{req.status}</dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Técnico Asignado</dt>
                  <dd className="mt-1 text-sm text-gray-900">{req.assigned_to || '-'}</dd>
                </div>

                <div className="flex justify-between">
                  <select
                    value={selectedTechnicians[req.id] || ''}
                    onChange={(e) =>
                      setSelectedTechnicians({
                        ...selectedTechnicians,
                        [req.id]: e.target.value
                      })
                    }
                    className="p-1 border rounded mr-2"
                  >
                    <option value="">Selecciona un técnico</option>
                    {technicians.map((tech) => (
                      <option key={tech} value={tech}>
                        {tech}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleAssign(req.id)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 rounded"
                  >
                    Asignar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestList;
