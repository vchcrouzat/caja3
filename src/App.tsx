import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Clientes from './pages/Clientes';
import Cuentas from './pages/Cuentas';
import Gastos from './pages/Gastos';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="cuentas" element={<Cuentas />} />
          <Route path="gastos" element={<Gastos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;