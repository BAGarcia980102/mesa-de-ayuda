import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Definir colores para cada tipo de solicitud
const requestTypeColors = {
  'servicio técnico': 'bg-blue-100 text-blue-800',
  'entrega': 'bg-green-100 text-green-800',
  'otros': 'bg-gray-100 text-gray-800',
  'recogida': 'bg-pink-100 text-pink-800',
  'default': 'bg-gray-100 text-gray-800'
};

// Obtener color para un tipo de solicitud
const getTypeColor = (type: string) => {
  const normalizedType = type.toLowerCase().trim();
  return requestTypeColors[normalizedType] || requestTypeColors['default'];
};

interface Request {
  id: number;
  company_name: string;
  address: string;
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
}

const RequestList: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/requests');
        setRequests(response.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar las solicitudes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg className="animate-spin -ml-1 mr-3 h-12 w-12 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-600">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-red-800">Error al cargar las solicitudes</h3>
          <div className="mt-1 text-sm text-red-700">
            <p>{error}</p>
          </div>
          <div className="mt-4">
            <Link
              to="/requests/register"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Registrar nueva solicitud
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Solicitudes Registradas</h2>
        <Link
          to="/requests/register"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Registrar nueva solicitud
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{request.company_name}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(request.request_type)}`}>
                  {request.request_type}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Fecha</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(request.created_at).toLocaleDateString('es-CO', {
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
                  <dd className="mt-1 text-sm text-gray-900">{request.address}</dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Contacto</dt>
                  <dd className="mt-1 text-sm text-gray-900">{request.contact_name}</dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                  <dd className="mt-1 text-sm text-gray-900">{request.phone}</dd>
                </div>

                {request.request_type.toLowerCase() !== 'servicio técnico' && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Tarea a Realizar</dt>
                    <dd className="mt-1 text-sm text-gray-900">{request.task_to_perform}</dd>
                  </div>
                )}

                {request.request_type.toLowerCase() === 'servicio técnico' && (
                  <>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Referencia de Impresora</dt>
                      <dd className="mt-1 text-sm text-gray-900">{request.reference}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Activo Fijo</dt>
                      <dd className="mt-1 text-sm text-gray-900">{request.asset_tag}</dd>
                    </div>
                  </>
                )}

                <div>
                  <dt className="text-sm font-medium text-gray-500">Observaciones</dt>
                  <dd className="mt-1 text-sm text-gray-900">{request.fault_description}</dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Documentos</dt>
                  <dd className="mt-1 text-sm text-gray-900">{request.documents_to_carry}</dd>
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
