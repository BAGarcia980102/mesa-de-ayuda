import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface RequestFormData {
  companyName: string;
  address: string;
  contactName: string;
  phone: string;
  requestType: string;
  reference: string;
  isClientOwned: boolean;
  assetTag: string;
  faultDescription: string;
  taskToPerform: string;
  documentsToCarry: string;
}

const RegisterRequest: React.FC = () => {
  const [formData, setFormData] = useState<RequestFormData>({
    companyName: '',
    address: '',
    contactName: '',
    phone: '',
    requestType: '',
    reference: '',
    isClientOwned: false,
    assetTag: '',
    faultDescription: '',
    taskToPerform: '',
    documentsToCarry: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? target.checked : value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/requests', formData);
      alert('Solicitud registrada exitosamente');
      setFormData({
        companyName: '',
        address: '',
        contactName: '',
        phone: '',
        requestType: '',
        reference: '',
        isClientOwned: false,
        assetTag: '',
        faultDescription: '',
        taskToPerform: '',
        documentsToCarry: ''
      });
    } catch (error) {
      console.error(error);
      alert('Error al registrar la solicitud');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Registrar Solicitud</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Empresa o Razón Social:</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Dirección:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Nombre Contacto:</label>
          <input
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Teléfono:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Tipo de Diligencia:</label>
          <select
            name="requestType"
            value={formData.requestType}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Seleccione una opción</option>
            <option value="Servicio Técnico">Servicio Técnico</option>
            <option value="Entrega">Entrega</option>
            <option value="Recogida">Recogida</option>
            <option value="Diligencias Bancarias">Diligencias Bancarias</option>
            <option value="Otros">Otros</option>
          </select>
        </div>

        {formData.requestType === 'Servicio Técnico' && (
          <>
            <div>
              <label className="block font-medium">Referencia:</label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isClientOwned"
                checked={formData.isClientOwned}
                onChange={handleChange}
              />
              <label className="font-medium">¿Propia del TYS?</label>
            </div>

            {formData.isClientOwned && (
              <div>
                <label className="block font-medium">Activo Fijo:</label>
                <input
                  type="text"
                  name="assetTag"
                  value={formData.assetTag}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            )}

            <div>
              <label className="block font-medium">Falla que Presenta:</label>
              <textarea
                name="faultDescription"
                value={formData.faultDescription}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              ></textarea>
            </div>
          </>
        )}

        {formData.requestType &&
          formData.requestType !== 'Servicio Técnico' && (
            <>
              <div>
                <label className="block font-medium">Diligencia a Realizar:</label>
                <input
                  type="text"
                  name="taskToPerform"
                  value={formData.taskToPerform}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block font-medium">Documentos a llevar:</label>
                <input
                  type="text"
                  name="documentsToCarry"
                  value={formData.documentsToCarry}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </>
          )}

        <button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded"
        >
          Registrar Solicitud
        </button>
      </form>
    </div>
  );
};

export default RegisterRequest;
