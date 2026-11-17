'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

const navLinks = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#portafolio', label: 'Portafolio' },
  { href: '#eventos', label: 'Próximos Eventos' },
  { href: '#contacto', label: 'Contacto' },
];

export default function Navbar({ bookingHref }: { bookingHref: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className={`fixed top-0 z-50 w-full transition-colors duration-300 ${scrolled ? 'border-b border-[#616161]/30 bg-[#8A8A8A]/90 py-4 backdrop-blur-md' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto flex items-center justify-between px-6">
        <a href="#inicio" aria-label="ClickClack Photo, ir al inicio" onClick={closeMenu} className="shrink-0">
          <Image
            src="/clickclackphotowhite.png"
            alt="ClickClack Photo"
            width={691}
            height={435}
            sizes="(min-width: 768px) 7rem, 6rem"
            className="h-auto w-24 object-contain md:w-35"
            preload
          />
        </a>
        <nav aria-label="Navegación principal" className="hidden items-center gap-8 text-xl font-medium text-[#ece4e4] md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-white">{link.label}</a>
          ))}
          <a href={bookingHref} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white px-5 py-2.5 text-xs font-bold tracking-wider text-black uppercase transition-colors hover:bg-[#DBDBDB]">
            Agendar Sesión
          </a>
        </nav>

        <button
          type="button"
          className="text-white md:hidden"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <nav id="mobile-navigation" aria-label="Navegación móvil" className="absolute top-full left-0 flex w-full flex-col gap-4 border-b border-[#616161]/30 bg-[#1c1c1c] px-6 py-6 shadow-2xl md:hidden">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={closeMenu} className="text-[#DBDBDB] transition-colors hover:text-white">{link.label}</a>
          ))}
          <a href={bookingHref} target="_blank" rel="noopener noreferrer" onClick={closeMenu} className="text-[#DBDBDB] transition-colors hover:text-white">Agendar Sesión</a>
        </nav>
      )}
    </header>
  );
}
