import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import propertiesLocales from "../data/properties"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PropertyDetails = ({ noches, datosBusqueda }) => {
const { id } = useParams();
const [info, setInfo] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchProperty = async () => {
    setLoading(true);
    try {
        // 1. Intentar buscar en Supabase
        const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("id", Number(id))
        .maybeSingle();

        if (data) {
        // Adaptamos los datos de Supabase para que tengan el campo 'gallery'
        setInfo({
            ...data,
            gallery: data.gallery || [data.image_url, data.image_url, data.image_url, data.image_url]
        });
        setLoading(false);
        return;
        }
    } catch (err) {
        console.log("Buscando en locales...");
    }

    // 2. Buscar en locales si no está en Supabase
    const localMatch = propertiesLocales.find((item) => String(item.id) === String(id));
    setInfo(localMatch || null);
    setLoading(false);
    };

    fetchProperty();
}, [id]);

if (loading) return <div className="p-20 text-center font-bold text-rose-500">Cargando tu próximo destino...</div>;

if (!info) return (
    <div className="p-20 text-center">
    <h2 className="text-2xl font-bold">Propiedad no encontrada</h2>
    <Link to="/" className="text-rose-500 underline mt-4 block">Volver al inicio</Link>
    </div>
);

const total = info.price * noches;

return (
    <div className="min-h-screen bg-white">
    <Navbar />
    <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-4 md:pt-6">
        
        {/* CABECERA (Tu estilo original) */}
        <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">{info.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm underline font-medium mt-2">
            <span>
            ⭐ {info.rating} ·{" "}
            <span className="text-green-600 no-underline">Puntuación buena</span> ·{" "}
            {info.location}
            </span>
        </div>
        </div>

        {/* GALERÍA DE IMÁGENES (Tu estilo de 5 fotos) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-xl overflow-hidden shadow-md">
        {/* 1. Imagen Principal */}
        <div className="h-75 md:h-112.5">
            <img
            src={info.image_url}
            className="w-full h-full object-cover transition duration-500 hover:brightness-90 cursor-pointer"
            alt={info.title}
            />
        </div>

        {/* 2. Grilla de la derecha (4 fotos) */}
        <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 h-112.5">
            {info.gallery && info.gallery.slice(0, 4).map((fotoUrl, index) => (
            <img
                key={index}
                src={fotoUrl}
                className="w-full h-full object-cover hover:opacity-90 transition duration-500 cursor-pointer"
                alt={`Vista interior ${index + 1}`}
            />
            ))}
        </div>
        </div>

        {/* CONTENIDO Y WIDGET (Tu estilo original) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
        
        {/* COLUMNA IZQUIERDA */}
        <div className="lg:col-span-2 space-y-8">
            <div className="border-b pb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
                <span>📋</span> Resumen de tu elección
            </h2>
            <p className="text-gray-600 mt-2 italic">
                {info.description || `Has seleccionado: ${info.title}`}
            </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 border p-4 rounded-xl shadow-sm">
                <span className="text-2xl">📍</span>
                <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Ubicación</p>
                <p className="text-lg font-medium">{info.location}, Colombia</p>
                </div>
            </div>
            <div className="flex items-center gap-4 border p-4 rounded-xl shadow-sm">
                <span className="text-2xl">⭐</span>
                <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Calificación</p>
                <p className="text-lg font-medium">{info.rating} / 5.0</p>
                </div>
            </div>
            </div>

            <div className="pt-4 bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300 text-gray-700 leading-relaxed">
            <h3 className="font-semibold text-lg mb-2">🏠 Sobre este alojamiento</h3>
            Esta propiedad ofrece una experiencia única con un precio de <strong>${info.price.toLocaleString()}</strong> por noche. 
            Incluye todas las comodidades verificadas para tu estancia en <strong>{info.location}</strong>.
            </div>
        </div>

        {/* COLUMNA DERECHA: WIDGET DE RESERVA */}
        <div className="relative">
            <div className="border rounded-2xl p-6 shadow-xl bg-white sticky top-28 border-rose-100">
            <div className="mb-6 flex justify-between items-center">
                <span className="text-3xl font-bold">${info.price.toLocaleString()}</span>
                <span className="text-gray-500 text-sm">/ noche</span>
            </div>

            <Link to={`/booking/${info.id}`}>
                <button className="w-full bg-rose-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-rose-600 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2">
                <span>💳</span> Continuar al pago
                </button>
            </Link>

            <div className="mt-6 space-y-4 border-t pt-4">
                <div className="flex justify-between text-gray-600">
                <span className="underline">Precio x {noches} noches</span>
                <span className="font-medium">${(info.price * noches).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                <span className="underline">Gastos de gestión</span>
                <span className="text-green-600 font-medium">¡Gratis!</span>
                </div>
                <div className="flex justify-between font-bold text-2xl pt-4 border-t border-gray-100">
                <span>Total</span>
                <span className="text-rose-600">${total.toLocaleString()}</span>
                </div>
            </div>
            </div>
        </div>
        </div>
    </main>
    <div className="mt-20">
        <Footer />
    </div>
    </div>
);
};

export default PropertyDetails;