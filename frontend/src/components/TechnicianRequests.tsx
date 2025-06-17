import React, { useState, useEffect } from 'react';
import { User, Building, Phone, MapPin, Calendar, AlertCircle, FileText, Wrench, Clock, CheckCircle } from 'lucide-react';
import { api } from '../api/api';

interface Request {
  id: number;
  company_name: string;
  address: string;
  contact_name: string;
  phone: string;
  request_type: string;
  reference?: string;
  asset_tag?: string;
  is_client_owned?: boolean;
  documents_to_carry: string[];
  fault_description?: string;
  task_to_perform?: string;
  observations?: string;
  status: string;
  created_at: string;
  assigned_to: string;
}

interface Technician {
  id: number;
  name: string;
}

const TechnicianRequests: React.FC = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<string>('');
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Cargar lista de técnicos al montar el componente
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        console.log('Solicitando técnicos a la API...');
        const technicians = await api.requests.getTechnicians();
        console.log('Técnicos recibidos:', technicians);
        
        if (!Array.isArray(technicians)) {
          console.error('La respuesta no es un array:', technicians);
          throw new Error('La respuesta de la API no es un array válido');
        }

        setTechnicians(technicians);
      } catch (err) {
        console.error('Error detallado:', err);
        setError('Error al cargar la lista de técnicos');
      }
    };

    fetchTechnicians();
  }, []);

  // Función para buscar solicitudes del técnico
  const handleSubmit = async () => {
    if (!selectedTechnician || selectedTechnician === '') {
      setError('Por favor selecciona un técnico');
      return;
    }

    const technicianId = parseInt(selectedTechnician);
    if (isNaN(technicianId)) {
      setError('ID de técnico inválido');
      return;
    }

    // Verificar que el ID sea un número positivo
    if (technicianId <= 0) {
      setError('ID de técnico inválido');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const requests = await api.requests.getByTechnicianId(technicianId);
      console.log('Solicitudes recibidas:', requests);
      setRequests(requests);
    } catch (err: any) {
      console.error('Error detallado:', err);
      
      // Mostrar detalles del error si están disponibles
      if (err.response?.data?.error && err.response?.data?.details) {
        setError(`Error: ${err.response.data.error}. Detalles: ${err.response.data.details}`);
      } else {
        setError('Error al cargar las solicitudes del técnico');
      }
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear fecha
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para obtener color del estado
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'en camino':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'en progreso':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'terminado':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Función para obtener ícono del estado
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return <Clock className="w-4 h-4" />;
      case 'en camino':
        return <User className="w-4 h-4" />;
      case 'en progreso':
        return <Wrench className="w-4 h-4" />;
      case 'terminado':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Logs de depuración
  console.log('Técnicos en estado:', technicians);
  console.log('Selected technician:', selectedTechnician);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600" />
          Solicitudes por Técnico
        </h1>

        {/* Formulario de selección */}
        <div className="mb-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="technician" className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Técnico
              </label>
              <select 
                id="technician" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedTechnician}
                onChange={(e) => setSelectedTechnician(e.target.value)}
                disabled={loading}
              >
                <option value="">-- Selecciona un técnico --</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id.toString()}>
                    {tech.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Cargando...' : 'Buscar Solicitudes'}
            </button>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Lista de solicitudes */}
      {requests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Solicitudes asignadas a {technicians.find(t => t.id === parseInt(selectedTechnician))?.name || 'Técnico'} ({requests.length})
          </h2>
          
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Header de la tarjeta */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">{request.company_name}</h3>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(request.status)}`}>
                  {getStatusIcon(request.status)}
                  {request.status}
                </div>
              </div>

              {/* Información de contacto */}
              <div className="grid md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{request.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{request.contact_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{request.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{formatDate(request.created_at)}</span>
                </div>
              </div>

              {/* Información específica según tipo */}
              <div className="border-t pt-4">
                <div className="mb-3">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    {request.request_type}
                  </span>
                </div>

                {request.request_type === 'Servicio Técnico' ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Información del Equipo</h4>
                      <div className="space-y-2 text-sm">
                        {request.reference && (
                          <div>
                            <span className="font-medium">Referencia:</span> {request.reference}
                          </div>
                        )}
                        {request.is_client_owned && request.asset_tag && (
                          <div>
                            <span className="font-medium">Activo Fijo:</span> {request.asset_tag}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Descripción de la Falla</h4>
                      <p className="text-sm text-gray-700">{request.fault_description}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Diligencia a Realizar</h4>
                    <p className="text-sm text-gray-700">{request.task_to_perform}</p>
                  </div>
                )}

                {/* Documentos a llevar */}
                {Array.isArray(request.documents_to_carry) && request.documents_to_carry.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Documentos a llevar
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {request.documents_to_carry.map((doc, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Observaciones */}
                {request.observations && request.observations.trim() && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-800 mb-2">Observaciones</h4>
                    <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-md">
                      {request.observations}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Estado vacío */}
      {!loading && requests.length === 0 && selectedTechnician && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No hay solicitudes asignadas
          </h3>
          <p className="text-gray-500">
            El técnico {selectedTechnician} no tiene solicitudes asignadas actualmente.
          </p>
        </div>
      )}
    </div>
  );
};

export default TechnicianRequests;
