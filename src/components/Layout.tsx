import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Users, Wallet, Receipt, Home } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-600 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            <Home size={24} />
            Sistema CRUD
          </Link>
          <div className="flex gap-4">
            <Link to="/clientes" className="flex items-center gap-2 hover:text-indigo-200">
              <Users size={20} />
              Clientes
            </Link>
            <Link to="/cuentas" className="flex items-center gap-2 hover:text-indigo-200">
              <Wallet size={20} />
              Cuentas
            </Link>
            <Link to="/gastos" className="flex items-center gap-2 hover:text-indigo-200">
              <Receipt size={20} />
              Gastos
            </Link>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}