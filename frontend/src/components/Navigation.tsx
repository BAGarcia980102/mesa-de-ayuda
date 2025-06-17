import React from 'react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/assets/logo.png"
                alt="Logo de la empresa"
                className="h-16 w-auto"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = '/assets/logo.svg';
                }}
              />
              <span className="ml-4 text-3xl font-bold text-gray-800">Mesa de Ayuda</span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-8">
            <Link
              to="/requests/register"
              className="flex items-center px-3 py-2 text-gray-700 hover:bg-orange-100 hover:text-orange-600 rounded-md transition-colors duration-200"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Registrar Solicitud
            </Link>

            <Link
              to="/requests/list"
              className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Solicitudes Registradas
            </Link>

            <Link
              to="/requests/technician"
              className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Solicitudes por Técnico
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
