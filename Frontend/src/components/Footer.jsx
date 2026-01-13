import React from 'react';

/**
 * Footer component.
 * 
 * A comprehensive footer with links and company information.
 * 
 * @returns {JSX.Element} Footer section
 */
export default function Footer() {
  return (
    <footer className="bg-primary-darkest border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary-accent rounded-lg flex items-center justify-center text-white font-bold">
                M
              </div>
              <span className="text-xl font-bold text-white">Marketplace</span>
            </div>
            <p className="text-primary-light text-sm leading-relaxed mb-6">
              La plataforma líder para encontrar y contratar servicios profesionales de alta calidad. Conectamos talento con oportunidades.
            </p>
            <div className="flex gap-4">
              {/* Social Icons Placeholders */}
              <div className="w-8 h-8 bg-white/5 rounded-full hover:bg-primary-accent/20 transition-colors cursor-pointer"></div>
              <div className="w-8 h-8 bg-white/5 rounded-full hover:bg-primary-accent/20 transition-colors cursor-pointer"></div>
              <div className="w-8 h-8 bg-white/5 rounded-full hover:bg-primary-accent/20 transition-colors cursor-pointer"></div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white font-semibold mb-6">Plataforma</h3>
            <ul className="space-y-4">
              <li><a href="/services" className="text-primary-light hover:text-primary-accent text-sm transition-colors">Explorar servicios</a></li>
              <li><a href="#" className="text-primary-light hover:text-primary-accent text-sm transition-colors">Categorías</a></li>
              <li><a href="#" className="text-primary-light hover:text-primary-accent text-sm transition-colors">Cómo funciona</a></li>
              <li><a href="#" className="text-primary-light hover:text-primary-accent text-sm transition-colors">Regístrate</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-6">Soporte</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-primary-light hover:text-primary-accent text-sm transition-colors">Centro de ayuda</a></li>
              <li><a href="#" className="text-primary-light hover:text-primary-accent text-sm transition-colors">Contacto</a></li>
              <li><a href="#" className="text-primary-light hover:text-primary-accent text-sm transition-colors">FAQ</a></li>
              <li><a href="#" className="text-primary-light hover:text-primary-accent text-sm transition-colors">Disputas</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-6">Legal</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-primary-light hover:text-primary-accent text-sm transition-colors">Privacidad</a></li>
              <li><a href="#" className="text-primary-light hover:text-primary-accent text-sm transition-colors">Términos de uso</a></li>
              <li><a href="#" className="text-primary-light hover:text-primary-accent text-sm transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center">
          <p className="text-primary-light text-xs">
            © 2026 Marketplace. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
