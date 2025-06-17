import React, { useState, useEffect, useRef } from 'react';
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
  technician_id: number;
  latitude?: number;
  longitude?: number;
}

interface Technician {
  id: number;
  name: string;
}

const TechnicianRequests: React.FC = () => {
  // Estados principales del componente
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<string>('');
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Estado para geolocalización
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const locationInterval = useRef<NodeJS.Timeout>();

  // Solicitar permisos de geolocalización al montar el componente
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setLocationPermission(permission.state);
        
        // Escuchar cambios en los permisos
        permission.onchange = () => {
          setLocationPermission(permission.state);
        };
      } catch (error) {
        setLocationPermission('denied');
        setLocationError('Error al solicitar permisos de geolocalización');
      }
    };

    requestLocationPermission();

    // Limpiar el intervalo cuando el componente se desmonte
    return () => {
      if (locationInterval.current) {
        clearInterval(locationInterval.current);
      }
    };
  }, []);

  // Función para actualizar el estado basado en geolocalización
  const checkLocationAndUpdateStatus = async (requestId: number, latitude: number, longitude: number) => {
    try {
      const response = await api.requests.updateStatusByLocation(requestId, latitude, longitude);
      
      if (response.status === 'En progreso') {
        // Actualizar el estado local
        setRequests(prevRequests => 
          prevRequests.map(prevRequest => 
            prevRequest.id === requestId ? { ...prevRequest, status: 'En progreso' } : prevRequest
          )
        );
      }
    } catch (error) {
      console.error('Error en actualización automática:', error);
      setLocationError('Error al verificar ubicación');
    }
  };

  // Iniciar el intervalo de verificación de ubicación para cada solicitud
  useEffect(() => {
    if (locationPermission === 'granted' && selectedTechnician) {
      // Limpiar cualquier intervalo anterior
      if (locationInterval.current) {
        clearInterval(locationInterval.current);
      }

      // Iniciar nuevo intervalo
      locationInterval.current = setInterval(async () => {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          // Verificar ubicación para cada solicitud
          requests.forEach(req => {
            if (req.status === 'En camino' && req.latitude && req.longitude) {
              checkLocationAndUpdateStatus(req.id, position.coords.latitude, position.coords.longitude);
            }
          });
        } catch (error) {
          console.error('Error al obtener ubicación:', error);
          setLocationError('Error al obtener ubicación');
        }
      }, 30000); // Verificar cada 30 segundos
    }

    return () => {
      if (locationInterval.current) {
        clearInterval(locationInterval.current);
      }
    };
  }, [locationPermission, selectedTechnician, requests]);

  // Cargar lista de técnicos al montar el componente
  useEffect(() => {
    const loadTechnicians = async () => {
      try {
        const technicians = await api.requests.getTechnicians();
        console.log('Técnicos recibidos:', technicians);
        setTechnicians(technicians);
      } catch (err) {
        console.error('Error al cargar técnicos:', err);
        setError('Error al cargar la lista de técnicos');
      }
    };

    loadTechnicians();
  }, []);

  // Cargar solicitudes del técnico seleccionado
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError('');
      
      try {
        if (!selectedTechnician) {
          setError('Por favor, seleccione un técnico');
          setLoading(false);
          return;
        }

        const requests = await api.requests.getByTechnicianId(parseInt(selectedTechnician));
        console.log('Solicitudes recibidas:', requests);
        setRequests(requests);
      } catch (err: any) {
        console.error('Error detallado:', err);
        
        // Mostrar detalles del error si están disponibles
        if (err.response?.data?.error && err.response?.data?.details) {
          setError(`${err.response.data.error}: ${err.response.data.details}`);
        } else {
          setError('Error al obtener las solicitudes');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [selectedTechnician]);

  // Función para actualizar el estado manualmente
  const handleStatusUpdate = async (requestId: number, newStatus: string) => {
    try {
      const response = await api.requests.updateStatus(requestId, newStatus);
      
      // Actualizar el estado local
      setRequests(prevRequests => 
        prevRequests.map(prevRequest => 
          prevRequest.id === requestId ? { ...prevRequest, status: newStatus } : prevRequest
        )
      );
    } catch (err: any) {
      console.error('Error actualizando estado:', err);
      setError('Error al actualizar el estado de la solicitud');
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

  console.log('Técnicos en estado:', technicians);
  console.log('Selected technician:', selectedTechnician);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600" />
          Solicitudes por Técnico
        </h1>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

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
              onClick={async () => {
                if (!selectedTechnician || selectedTechnician === '') {
                  setError('Por favor selecciona un técnico');
                  return;
                }

                try {
                  setLoading(true);
                  setError('');
                  const requests = await api.requests.getByTechnicianId(parseInt(selectedTechnician));
                  console.log('Solicitudes recibidas:', requests);
                  setRequests(requests);
                } catch (err: any) {
                  console.error('Error detallado:', err);
                  if (err.response?.data?.error && err.response?.data?.details) {
                    setError(`${err.response.data.error}: ${err.response.data.details}`);
                  } else {
                    setError('Error al cargar las solicitudes');
                  }
                  setRequests([]);
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Cargando...' : 'Buscar Solicitudes'}
            </button>
          </div>
        </div>

        {/* Estado de geolocalización */}
        {(locationPermission === 'denied' || locationError) && (
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">
              {locationPermission === 'denied' 
                ? 'Por favor, habilite los permisos de geolocalización para que el sistema pueda detectar automáticamente cuando llegue al destino.' 
                : locationError}
            </span>
          </div>
        )}

        {/* Estado de carga */}
        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        )}

        {/* Lista de solicitudes */}
        {requests.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Solicitudes asignadas a {technicians.find(t => t.id === parseInt(selectedTechnician))?.name || 'Técnico'} ({requests.length})
            </h2>
            <div className="space-y-4">
              {requests.map((req: Request) => (
                <div key={req.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {req.company_name}
                    </h3>
                    <div className={`px-2 py-1 rounded-full text-sm ${getStatusColor(req.status)}`}>
                      {getStatusIcon(req.status)} {req.status}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Dirección:</p>
                      <p className="text-gray-900">{req.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contacto:</p>
                      <p className="text-gray-900">{req.contact_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Teléfono:</p>
                      <p className="text-gray-900">{req.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tipo de solicitud:</p>
                      <p className="text-gray-900">{req.request_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Fecha:</p>
                      <p className="text-gray-900">{formatDate(req.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Técnico asignado:</p>
                      <p className="text-gray-900">{req.assigned_to}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado actual:
                    </label>
                    <select
                      value={req.status}
                      onChange={(e) => handleStatusUpdate(req.id, e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                    >
                      <option value="En camino">En camino</option>
                      <option value="En progreso">En progreso</option>
                      <option value="Terminado">Terminado</option>
                    </select>
                  </div>

                  <div className="mt-4">
                    <dt className="text-sm font-medium text-gray-500">Documentos a llevar</dt>
                    <dd className="mt-1 text-sm text-gray-900 flex flex-wrap gap-2">
                      {(Array.isArray(req.documents_to_carry) ? req.documents_to_carry : []).map((doc: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md"
                        >
                          {doc}
                        </span>
                      ))}
                    </dd>
                  </div>

                  {req.observations && req.observations.trim() && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-800 mb-2">Observaciones</h4>
                      <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-md">
                        {req.observations}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : !loading && selectedTechnician ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No hay solicitudes asignadas
            </h3>
            <p className="text-gray-500">
              El técnico {selectedTechnician} no tiene solicitudes asignadas actualmente.
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Por favor, selecciona un técnico para ver sus solicitudes.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicianRequests;
