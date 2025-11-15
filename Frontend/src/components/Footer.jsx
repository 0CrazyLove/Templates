import React from 'react';
export default function Footer() {
return (
<footer className="bg-primary-dark text-primary-lightest py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-around">
          <div className="text-center">
            <h4 className="font-bold mb-2">ServiceHub</h4>
            <p className="text-sm">&copy; 2025 ServiceHub. Todos los derechos reservados.</p>
          </div>
          <div className="text-center">
            <h4 className="font-bold mb-2">Navegación</h4>
            <ul>
              <li><a href="#" className="hover:text-primary-accent">Servicios</a></li>
              <li><a href="#" className="hover:text-primary-accent">Acerca de</a></li>
              <li><a href="#" className="hover:text-primary-accent">Contacto</a></li>
            </ul>
          </div>
          <div className="text-center">
            <h4 className="font-bold mb-2">Legal</h4>
            <ul>
              <li><a href="#" className="hover:text-primary-accent">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-primary-accent">Política de Privacidad</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
