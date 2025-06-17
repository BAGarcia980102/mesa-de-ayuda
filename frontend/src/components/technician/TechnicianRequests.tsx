import { useState, useEffect } from 'react';
import { api } from '../../api/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface Request {
  id: number;
  company_name: string;
  address: string;
  contact_name: string;
  phone: string;
  type: string;
  reference: string;
  asset_tag: string;
  is_client_owned: boolean;
  fault_description: string;
  task_to_perform: string;
  documents_to_carry: string[];
  observations?: string;
  status: string;
  created_at: string;
}

interface Technician {
  id: number;
  name: string;
}

export default function TechnicianRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await api.requests.getTechnicians();
        setTechnicians(response.data);
      } catch (err) {
        console.error('Error fetching technicians:', err);
      }
    };
    fetchTechnicians();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.requests.getByTechnicianId(parseInt(selectedTechnician));
      setRequests(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las solicitudes');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTechnician) {
      setError('Por favor, seleccione un técnico.');
      return;
    }
    fetchRequests();
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Mis Solicitudes</h2>
      <form onSubmit={handleSubmit} className="mb-4 flex items-center justify-center space-x-4">
        <select
          value={selectedTechnician}
          onChange={(e) => setSelectedTechnician(e.target.value)}
          className="p-2 border rounded"
          required
        >
          <option value="">Seleccione un técnico</option>
          {technicians.map((tech) => (
            <option key={tech.id} value={tech.id.toString()}>
              {tech.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Consultar'}
        </button>
      </form>

      {error && (
        <p className="text-center text-red-500 mb-4">{error}</p>
      )}

      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req.id}>
              <CardHeader>
                <CardTitle>Solicitud #{req.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p><strong>Empresa:</strong> {req.company_name}</p>
                  <p><strong>Dirección:</strong> {req.address}</p>
                  <p><strong>Contacto:</strong> {req.contact_name}</p>
                  <p><strong>Teléfono:</strong> {req.phone}</p>
                  <p><strong>Tipo de Solicitud:</strong> {req.type}</p>

                  {req.type === 'Servicio Técnico' ? (
                    <>
                      <p><strong>Referencia del Equipo:</strong> {req.reference || 'N/A'}</p>
                      {req.is_client_owned && (
                        <p><strong>Activo Fijo:</strong> {req.asset_tag || 'N/A'}</p>
                      )}
                      <p><strong>Descripción del Problema:</strong> {req.fault_description || 'N/A'}</p>
                      <div>
                        <strong>Documentos a llevar:</strong>
                        <ul className="list-disc pl-5">
                          {req.documents_to_carry.map((doc, index) => (
                            <li key={index}>{doc}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <p><strong>Tarea a Realizar:</strong> {req.task_to_perform || 'N/A'}</p>
                      <div>
                        <strong>Documentos a llevar:</strong>
                        <ul className="list-disc pl-5">
                          {req.documents_to_carry.map((doc, index) => (
                            <li key={index}>{doc}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}

                  {req.observations && (
                    <p><strong>Observaciones:</strong> {req.observations}</p>
                  )}

                  <p><strong>Estado:</strong> {req.status}</p>
                  <p><strong>Fecha de Creación:</strong> {format(new Date(req.created_at), 'PPP')}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No hay solicitudes asignadas.</p>
      )}
    </div>
  );
}
