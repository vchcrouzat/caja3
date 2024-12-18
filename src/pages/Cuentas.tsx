import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import db from '../db/schema';

interface Cuenta {
  id: number;
  cliente_id: number;
  numero_cuenta: string;
  tipo_cuenta: string;
  saldo: number;
  fecha_apertura: string;
  nombre_cliente?: string;
}

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
}

export default function Cuentas() {
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [formData, setFormData] = useState({
    cliente_id: '',
    numero_cuenta: '',
    tipo_cuenta: '',
    saldo: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    cargarCuentas();
    cargarClientes();
  }, []);

  const cargarCuentas = () => {
    const result = db.prepare(`
      SELECT cuentas.*, clientes.nombre || ' ' || clientes.apellido as nombre_cliente
      FROM cuentas
      JOIN clientes ON cuentas.cliente_id = clientes.id
    `).all();
    setCuentas(result);
  };

  const cargarClientes = () => {
    const result = db.prepare('SELECT id, nombre, apellido FROM clientes').all();
    setClientes(result);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      db.prepare(`
        UPDATE cuentas 
        SET cliente_id = ?, numero_cuenta = ?, tipo_cuenta = ?, saldo = ?
        WHERE id = ?
      `).run(
        formData.cliente_id,
        formData.numero_cuenta,
        formData.tipo_cuenta,
        formData.saldo,
        editingId
      );
    } else {
      db.prepare(`
        INSERT INTO cuentas (cliente_id, numero_cuenta, tipo_cuenta, saldo)
        VALUES (?, ?, ?, ?)
      `).run(
        formData.cliente_id,
        formData.numero_cuenta,
        formData.tipo_cuenta,
        formData.saldo
      );
    }
    
    setFormData({
      cliente_id: '',
      numero_cuenta: '',
      tipo_cuenta: '',
      saldo: ''
    });
    setEditingId(null);
    cargarCuentas();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta cuenta?')) {
      db.prepare('DELETE FROM cuentas WHERE id = ?').run(id);
      cargarCuentas();
    }
  };

  const handleEdit = (cuenta: Cuenta) => {
    setFormData({
      cliente_id: cuenta.cliente_id.toString(),
      numero_cuenta: cuenta.numero_cuenta,
      tipo_cuenta: cuenta.tipo_cuenta,
      saldo: cuenta.saldo.toString()
    });
    setEditingId(cuenta.id);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Gestión de Cuentas</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cliente</label>
            <select
              value={formData.cliente_id}
              onChange={(e) => setFormData({...formData, cliente_id: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre} {cliente.apellido}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Número de Cuenta</label>
            <input
              type="text"
              value={formData.numero_cuenta}
              onChange={(e) => setFormData({...formData, numero_cuenta: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Cuenta</label>
            <select
              value={formData.tipo_cuenta}
              onChange={(e) => setFormData({...formData, tipo_cuenta: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Seleccione tipo de cuenta</option>
              <option value="Ahorro">Ahorro</option>
              <option value="Corriente">Corriente</option>
              <option value="Plazo Fijo">Plazo Fijo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Saldo Inicial</label>
            <input
              type="number"
              step="0.01"
              value={formData.saldo}
              onChange={(e) => setFormData({...formData, saldo: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            {editingId ? 'Actualizar Cuenta' : 'Agregar Cuenta'}
          </button>
        </div>
      </form>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número de Cuenta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Apertura</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cuentas.map((cuenta) => (
              <tr key={cuenta.id}>
                <td className="px-6 py-4 whitespace-nowrap">{cuenta.nombre_cliente}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cuenta.numero_cuenta}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cuenta.tipo_cuenta}</td>
                <td className="px-6 py-4 whitespace-nowrap">${cuenta.saldo.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(cuenta.fecha_apertura).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(cuenta)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cuenta.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}