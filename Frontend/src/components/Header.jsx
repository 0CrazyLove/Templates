import React from 'react';
export default function Header() {
  return (
    <header className="bg-primary-dark shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary-lightest">ServiceHub</h1>
        <nav>
          <a href="#" className="text-primary-light hover:text-primary-lightest px-3 py-2">Servicios</a>
          <a href="#" className="text-primary-light hover:text-primary-lightest px-3 py-2">Acerca de</a>
          <a href="#" className="text-primary-light hover:text-primary-lightest px-3 py-2">Contacto</a>
        </nav>
        <div>
          <a href="#" className="text-primary-light hover:text-primary-lightest px-3 py-2">Iniciar Sesión</a>
          <a href="#" className="bg-primary-accent hover:bg-opacity-80 text-white px-4 py-2 rounded-md">Registrarse</a>
        </div>
      </div>
    </header>
  );
}