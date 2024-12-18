import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { executeQuery, executeUpdate } from '../db/database';

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email: string;
  direccion: string;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    email: '',
    direccion: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    const result = await executeQuery('SELECT * FROM clientes');
    setClientes(result);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await executeUpdate(
        `UPDATE clientes 
         SET nombre = ?, apellido = ?, dni = ?, telefono = ?, email = ?, direccion = ?
         WHERE id = ?`,
        [formData.nombre, formData.apellido, formData.dni, formData.telefono, 
         formData.email, formData.direccion, editingId]
      );
    } else {
      await executeUpdate(
        `INSERT INTO clientes (nombre, apellido, dni, telefono, email, direccion)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [formData.nombre, formData.apellido, formData.dni, formData.telefono, 
         formData.email, formData.direccion]
      );
    }
    
    setFormData({
      nombre: '',
      apellido: '',
      dni: '',
      telefono: '',
      email: '',
      direccion: ''
    });
    setEditingId(null);
    await cargarClientes();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      await executeUpdate('DELETE FROM clientes WHERE id = ?', [id]);
      await cargarClientes();
    }
  };

  // ... resto del código del componente igual ...
}