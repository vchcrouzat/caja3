import initSqlJs from 'sql.js';

let db: any = null;

export async function initDatabase() {
  if (!db) {
    const SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });
    db = new SQL.Database();
    
    // Crear tablas
    db.run(`
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
  }
  return db;
}

export async function executeQuery(query: string, params: any[] = []): Promise<any[]> {
  const database = await initDatabase();
  try {
    const stmt = database.prepare(query);
    stmt.bind(params);
    
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

export async function executeUpdate(query: string, params: any[] = []): Promise<void> {
  const database = await initDatabase();
  try {
    const stmt = database.prepare(query);
    stmt.bind(params);
    stmt.run();
    stmt.free();
  } catch (error) {
    console.error('Error executing update:', error);
    throw error;
  }
}