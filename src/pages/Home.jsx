import React, { useState } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import PropertyGrid from "../components/PropertyGrid";
import Footer from "../components/Footer";

export default function Home({ datosBusqueda, setDatosBusqueda }) {
// Este estado es el que REALMENTE se le pasa al Grid para filtrar
const [filtroFinal, setFiltroFinal] = useState("");

// Esta función se activará desde el SearchBar al darle clic a la LUPA
const ejecutarBusqueda = () => {
    // 1. Usamos el valor actual de datosBusqueda.donde 
    // .trim() evita que busque si solo hay espacios
    const destino = datosBusqueda.donde || "";
    setFiltroFinal(destino.trim());
    
    // 2. Scroll suave
    window.scrollTo({
    top: 450, 
    behavior: 'smooth'
    });
};

return (
    <>
    <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">
        {/* Le pasamos la función ejecutarBusqueda al SearchBar */}
        <SearchBar 
            datos={datosBusqueda}
            setDatos={setDatosBusqueda}
            onSearch={ejecutarBusqueda} 
        />
        
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            {/* Ahora el Grid escucha a filtroFinal, no al input directo */}
            <PropertyGrid filtro={filtroFinal} />
        </section>
        </main>
        <Footer />
    </div>
    </>
);
}