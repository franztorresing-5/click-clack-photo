import {  MessageCircle, Sparkles } from 'lucide-react';
import Image from 'next/image';
import CounterGallery from './components/CounterGallery';
import EventsCascade from './components/EventsCascade';
import Navbar from './components/Navbar';

// ==========================================
// 1. CONFIGURACIÓN CENTRALIZADA (CLICKCLACK PHOTO)
// ==========================================
const siteConfig = {
  name: "ClickClack Photo",
  tagline: "Capturamos la esencia de tus momentos más importantes.",
  description: "Estudio de fotografía profesional especializado en retratos, sesiones conceptuales, bodas y eventos especiales.",
  whatsapp: {
    number: "5215533112528", // Reemplaza con el número real del estudio
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

const Hero = () => (
  <section id="inicio" className="relative min-h-screen flex items-center justify-center bg-[#8A8A8A] overflow-hidden pt-20">
    {/* Fondo decorativo con gradiente y efecto neutro */}
    <div className="absolute inset-0 bg-linear-to-b from-[#616161]/20 via-[#1c1c1c]/50 to-[#0f0f0f] pointer-events-none" />

    <div className="container mx-auto px-6 pb-10 relative z-10 text-center max-w-4xl flex flex-col items-center">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#616161]/30 border border-[#8A8A8A]/40 text-[#DBDBDB] text-xs font-medium tracking-widest uppercase mb-6">
        <Sparkles size={14} /> Estudio Fotográfico Deportivo
      </div>
      <div className="flex w-full flex-col items-center gap-5 lg:flex-row">
        <h1 className="text-4xl md:text-7xl lg:w-[30%] font-bold text-white mb-6 tracking-tight leading-tight"
        >
          CLICK CLACK <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FFFFFF] via-[#DBDBDB] to-[#8A8A8A]">PHOTO.</span>
        </h1>

        <Image
          src="/90d.webp"
          alt="ClickClack Photo"
          width={800}
          height={800}
          className="h-auto object-contain drop-shadow-2xl md:w-[70%] lg:w-28rem"
          sizes="(min-width: 1024px) 28rem, (min-width: 768px) 70vw, 100vw"
          preload
        />
      </div>

      <p className="mb-10 max-w-2xl text-base leading-relaxed font-light text-[#B3B3B3] md:text-xl">
        {siteConfig.description}
      </p>

      <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-white text-black hover:bg-[#DBDBDB] rounded-full font-bold text-3xl transition-colors text-center shadow-lg"
        >
          Cotizar Sesión
        </a>
        <a
          href="#portafolio"
          className="px-8 py-4 bg-[#616161]/20 hover:bg-[#616161]/40 text-white rounded-full font-bold text-3xl transition-colors border border-[#616161]/40 text-center"
        >
          Ver Portafolio
        </a>
        <a
          href={siteConfig.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visitar Instagram de ClickClack Photo"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#616161]/40 bg-[#616161]/20 px-8 py-4 text-center font-medium text-white transition-colors hover:bg-[#616161]/40"
        >
          <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
        </a>

      </div>
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
      whatsappNumber={siteConfig.whatsapp.number}
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
  <div className="fixed right-6 bottom-6 z-50">
    <a
      href={getWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar a ClickClack Photo por WhatsApp"
      className="flex items-center justify-center rounded-full bg-emerald-600 p-3 text-white shadow-2xl transition-transform duration-300 hover:scale-110 hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
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
      <Navbar bookingHref={getWhatsAppLink()} />
      <Hero />
      <Portfolio />
      <Events />
      <Contact />
      <Footer />
      <WhatsAppFloating />
    </main>
  );
}
