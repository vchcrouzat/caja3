import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Wallet, Receipt } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Sistema de Gestión</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/clientes" 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center">
          <Users size={48} className="text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold">Gestión de Clientes</h2>
          <p className="text-gray-600 text-center mt-2">Administre la información de sus clientes</p>
        </Link>
        
        <Link to="/cuentas"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center">
          <Wallet size={48} className="text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold">Gestión de Cuentas</h2>
          <p className="text-gray-600 text-center mt-2">Administre las cuentas de los clientes</p>
        </Link>
        
        <Link to="/gastos"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center">
          <Receipt size={48} className="text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold">Registro de Gastos</h2>
          <p className="text-gray-600 text-center mt-2">Gestione los gastos de caja</p>
        </Link>
      </div>
    </div>
  );
}