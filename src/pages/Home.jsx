import React, { useState } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import PropertyGrid from "../components/PropertyGrid";
import Footer from "../components/Footer";

export default function Home({ datosBusqueda, setDatosBusqueda }) {
// Filtro que se aplica al darle clic a la lupa
const [filtroFinal, setFiltroFinal] = useState("");

const ejecutarBusqueda = () => {
    // OBJETIVO: Al buscar, el destino se guarda en filtroFinal para el Grid
    const destino = datosBusqueda.donde || "";
    setFiltroFinal(destino.trim());
    
    // Feedback visual para el usuario en Colombia
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
        {/* PASO CLAVE: Aquí SearchBar llena la "nube" que usará PropertyDetails más adelante */}
        <SearchBar 
            datos={datosBusqueda}
            setDatos={setDatosBusqueda}
            onSearch={ejecutarBusqueda} 
        />
        
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <PropertyGrid filtro={filtroFinal} />
        </section>
        </main>
        <Footer />
    </div>
    </>
);
}