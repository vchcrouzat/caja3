import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import db from '../db/schema';

interface Gasto {
  id: number;
  descripcion: string;
  monto: number;
  fecha: string;
  categoria: string;
}

export default function Gastos() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [formData, setFormData] = useState({
    descripcion: '',
    monto: '',
    categoria: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    cargarGastos();
  }, []);

  const cargarGastos = () => {
    const result = db.prepare('SELECT * FROM gastos ORDER BY fecha DESC').all();
    setGastos(result);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      db.prepare(`
        UPDATE gastos 
        SET descripcion = ?, monto = ?, categoria = ?
        WHERE id = ?
      `).run(
        formData.descripcion,
        formData.monto,
        formData.categoria,
        editingId
      );
    } else {
      db.prepare(`
        INSERT INTO gastos (descripcion, monto, categoria)
        VALUES (?, ?, ?)
      `).run(
        formData.descripcion,
        formData.monto,
        formData.categoria
      );
    }
    
    setFormData({
      descripcion: '',
      monto: '',
      categoria: ''
    });
    setEditingId(null);
    cargarGastos();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este gasto?')) {
      db.prepare('DELETE FROM gastos WHERE id = ?').run(id);
      cargarGastos();
    }
  };

  const handleEdit = (gasto: Gasto) => {
    setFormData({
      descripcion: gasto.descripcion,
      monto: gasto.monto.toString(),
      categoria: gasto.categoria
    });
    setEditingId(gasto.id);
  };

  const categorias = [
    'Servicios',
    'Suministros',
    'Mantenimiento',
    'Personal',
    'Marketing',
    'Otros'
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Registro de Gastos</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <input
              type="text"
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Monto</label>
            <input
              type="number"
              step="0.01"
              value={formData.monto}
              onChange={(e) => setFormData({...formData, monto: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <select
              value={formData.categoria}
              onChange={(e) => setFormData({...formData, categoria: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            {editingId ? 'Actualizar Gasto' : 'Regist rar Gasto'}
          </button>
        </div>
      </form>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {gastos.map((gasto) => (
              <tr key={gasto.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(gasto.fecha).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{gasto.descripcion}</td>
                <td className="px-6 py-4 whitespace-nowrap">{gasto.categoria}</td>
                <td className="px-6 py-4 whitespace-nowrap">${gasto.monto.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(gasto)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(gasto.id)}
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