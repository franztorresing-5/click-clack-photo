'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Menu, X, Camera, Sparkles, Phone, Mail } from 'lucide-react';
import Image from 'next/image';
import CounterGallery from './components/CounterGallery';
import EventsCascade from './components/EventsCascade';

// ==========================================
// 1. CONFIGURACIÓN CENTRALIZADA (CLICKCLACK PHOTO)
// ==========================================
const siteConfig = {
  name: "ClickClack Photo",
  tagline: "Capturamos la esencia de tus momentos más importantes.",
  description: "Estudio de fotografía profesional especializado en retratos, sesiones conceptuales, bodas y eventos especiales.",
  whatsapp: {
    number: "5215555555555", // Reemplaza con el número real del estudio
    message: "Hola ClickClack Photo, vi su página web y me gustaría solicitar información sobre sus paquetes de fotografía.",
  },
  instagramUrl: "https://www.instagram.com/clickclack_photo/",

  // Categorías del portafolio (Fotos destacadas)
  portfolio: [
    { title: "Retratos de Estudio", category: "Retrato", imagePath: "/ftdes/1.webp" },
    { title: "Sesiones de Pareja", category: "Parejas", imagePath: "/ftdes/2.webp" },
    { title: "Bodas & Eventos", category: "Eventos", imagePath: "/ftdes/3.webp" },
    { title: "Bodas & Eventos", category: "Eventos", imagePath: "/ftdes/4.webp" },
    { title: "Moda & Editorial", category: "Conceptual", imagePath: "/ftdes/5.webp" }
  ],

  // Próximos eventos o locaciones especiales del fotógrafo
  upcomingEvents: [
    {
      date: "28 de Noviembre, 2026",
      title: "Sesiones Navideñas en Estudio",
      location: "Estudio Principal - CDMX",
      status: "Cupos Limitados"
    },
    {
      date: "10 de Diciembre, 2026",
      title: "Mini Sesiones de Retrato Express",
      location: "Parque Central / Locación Externa",
      status: "Abiertas"
    },
    {
      date: "15 de Enero, 2027",
      title: "Masterclass de Fotografía de Retrato",
      location: "Ciudad de México",
      status: "Próximamente"
    }
  ]
};

const getWhatsAppLink = (customMsg?: string) => {
  const message = customMsg || siteConfig.whatsapp.message;
  return `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(message)}`;
};

// ==========================================
// 2. COMPONENTES DE LA PÁGINA
// ==========================================

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#8A8A8A]/90 backdrop-blur-md border-b border-[#616161]/30 py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#" className="text-xl font-serif text-white tracking-widest uppercase">
          CLICK<span className="text-[#616161]">CLACKphoto</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center text-sm font-medium text-[#DBDBDB]">
          <a href="#inicio" className="hover:text-white transition-colors">Inicio</a>
          <a href="#portafolio" className="hover:text-white transition-colors">Portafolio</a>
          <a href="#eventos" className="hover:text-white transition-colors">Próximos Eventos</a>
          <a href="#contacto" className="hover:text-white transition-colors">Contacto</a>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-white text-black hover:bg-[#DBDBDB] rounded-full transition-colors font-bold text-xs uppercase tracking-wider"
          >
            Agendar Sesión
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-[#1c1c1c] border-b border-[#616161]/30 py-6 px-6 flex flex-col gap-4 shadow-2xl"
          >
            <a href="#inicio" onClick={() => setIsOpen(false)} className="text-[#DBDBDB] hover:text-white">Inicio</a>
            <a href="#portafolio" onClick={() => setIsOpen(false)} className="text-[#DBDBDB] hover:text-white">Portafolio</a>
            <a href="#eventos" onClick={() => setIsOpen(false)} className="text-[#DBDBDB] hover:text-white">Próximos Eventos</a>
            <a href="#contacto" onClick={() => setIsOpen(false)} className="text-[#DBDBDB] hover:text-white">Contacto</a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Hero = () => (
  <section id="inicio" className="relative min-h-screen flex items-center justify-center bg-[#8A8A8A] overflow-hidden pt-20">
    {/* Fondo decorativo con gradiente y efecto neutro */}
    <div className="absolute inset-0 bg-linear-to-b from-[#616161]/20 via-[#1c1c1c]/50 to-[#0f0f0f] pointer-events-none" />

    <div className="container mx-auto px-6 pb-10 relative z-10 text-center max-w-4xl flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#616161]/30 border border-[#8A8A8A]/40 text-[#DBDBDB] text-xs font-medium tracking-widest uppercase mb-6"
      >
        <Sparkles size={14} /> Estudio Fotográfico Deportivo
      </motion.div>
      <motion.div 
      initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      className="flex  w-full flex-col lg:flex-row items-center  gap-5">
        <h1 className="text-4xl md:text-7xl lg:w-[30%] font-bold text-white mb-6 tracking-tight leading-tight"
        >
          CLICK CLACK <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FFFFFF] via-[#DBDBDB] to-[#8A8A8A]">PHOTO.</span>
        </h1>

        <Image
          src="/90d.webp"
          alt="Logotipo Sarhè Consultores"
          width={800}
          height={800}
          className="md:w-[70%] lg:w-28rem lg:pl-40 h-auto object-contain drop-shadow-2xl"
          priority
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-base md:text-xl text-[#B3B3B3] mb-10 max-w-2xl font-light leading-relaxed"
      >
        {siteConfig.description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
      >
        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-white text-black hover:bg-[#DBDBDB] rounded-full font-medium transition-colors text-center shadow-lg"
        >
          Cotizar Sesión
        </a>
        <a
          href="#portafolio"
          className="px-8 py-4 bg-[#616161]/20 hover:bg-[#616161]/40 text-white rounded-full font-medium transition-colors border border-[#616161]/40 text-center"
        >
          Ver Portafolio
        </a>
      </motion.div>
    </div>
  </section>
);

const Portfolio = () => (
  <section id="portafolio" className="pt-24 bg-[#616161] relative z-10">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Fotos Destacadas</h2>
        <p className="text-[#DBDBDB] max-w-lg mx-auto">Una muestra de nuestro trabajo en distintas categorías y estilos fotográficos.</p>
      </div>
    </div>

    {/* Galería de columnas contrarias: usa las fotos de siteConfig.portfolio.
        Cuando agregues tus imágenes reales en public/img/, se muestran solas (imagePath). */}
    <CounterGallery items={siteConfig.portfolio} heading="Portafolio" />
  </section>
);

const Events = () => (
  <section id="eventos" className="bg-[#8A8A8A] relative border-t border-[#616161]/20">
    {/* Las tarjetas entran en cascada con el scroll (ver components/EventsCascade.tsx) */}
    <EventsCascade
      events={siteConfig.upcomingEvents}
      getLink={(event) => getWhatsAppLink(`Hola, me interesa apartar mi lugar para el evento: ${event.title}`)}
      skipHref="#contacto"
      skipLabel="Saltar a Contacto"
    >
      <div className="text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Próximos Eventos</h2>
        {/* max-sm:sr-only: en celular se oculta visualmente (accesible) para que quepan las 3 tarjetas */}
        <p className="text-[#8A8A8A] max-w-lg mx-auto max-sm:sr-only">Fechas especiales, locaciones y disponibilidad para sesiones programadas.</p>
      </div>
    </EventsCascade>
  </section>
);

const Contact = () => (
  <section id="contacto" className="py-24 bg-[#616161] border-t border-[#616161]/20">
    <div className="container mx-auto px-6 max-w-4xl text-center">
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">¿Listo para agendar tu sesión?</h2>
      <p className="text-lg text-[#B3B3B3] mb-10 max-w-xl mx-auto font-light">
        Escríbenos directamente por WhatsApp para conocer disponibilidad, paquetes y resolver cualquier duda.
      </p>

      <div className="flex flex-wrap justify-center gap-6 mb-12">
        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-[#B3B3B3] text-black font-bold rounded-full hover:bg-[#DBDBDB] transition-colors shadow-lg text-lg"
        >
          <MessageCircle size={22} /> Hablar por WhatsApp
        </a>

      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-12 bg-[#0A0A0A] border-t border-[#616161]/20">
    <div className="container mx-auto px-6 text-center">
      <h3 className="lg:text-6xl font-serif text-white tracking-widest uppercase mb-2">
        CLICK<span className="text-[#8A8A8A]">CLACKphoto</span>
      </h3>
      <p className="text-[#8A8A8A] text-sm mb-6">{siteConfig.tagline}</p>

      <div className="flex justify-center gap-6 mb-8 text-sm text-[#B3B3B3]">
        <a href="#inicio" className="hover:text-white transition-colors">Inicio</a>
        <a href="#portafolio" className="hover:text-white transition-colors">Portafolio</a>
        <a href="#eventos" className="hover:text-white transition-colors">Eventos</a>
        <a href="#contacto" className="hover:text-white transition-colors">Contacto</a>
      </div>

      <p className="text-xs text-[#616161]">
        © 2026 {siteConfig.name}. Todos los derechos reservados.
      </p>
    </div>
  </footer>
);

const WhatsAppFloating = () => (
  <div className="fixed bottom-6 right-6 z-50">
    <a
      href="https://wa.me/525667885958?text=Hola,%20me%20gustaría%mas%20informacion,%20por%20favor."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-26 right-10 z-50 bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-120 flex items-center justify-center"
      title="Contáctanos por WhatsApp"
    >
      {/* Puedes usar un ícono de WhatsApp de lucide-react o SVG */}
      <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    </a>
  </div>
);

// ==========================================
// 3. EXPORTACIÓN PRINCIPAL (PAGE)
// ==========================================

export default function Home() {
  return (
    <main className="bg-[#111111] min-h-screen text-white font-sans selection:bg-white selection:text-black scroll-smooth">
      <Navbar />
      <Hero />
      <Portfolio />
      <Events />
      <Contact />
      <Footer />
      <WhatsAppFloating />
    </main>
  );
}