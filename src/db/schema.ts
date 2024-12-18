import Database from 'better-sqlite3';

const db = new Database('sistema.db');

// Crear tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    dni TEXT UNIQUE NOT NULL,
    telefono TEXT,
    email TEXT,
    direccion TEXT
  );

  CREATE TABLE IF NOT EXISTS cuentas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    numero_cuenta TEXT UNIQUE NOT NULL,
    tipo_cuenta TEXT NOT NULL,
    saldo DECIMAL(10,2) DEFAULT 0,
    fecha_apertura DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
  );

  CREATE TABLE IF NOT EXISTS gastos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descripcion TEXT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha DATE DEFAULT CURRENT_DATE,
    categoria TEXT NOT NULL
  );
`);

export default db;