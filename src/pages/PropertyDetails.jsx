import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import propertiesLocales from "../data/properties"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PropertyDetails = ({ noches = 1, datosBusqueda }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- FUNCIÓN DE FORMATEO UNIFICADA ---
    const fM = (valor) => `$${parseFloat(valor || 0).toFixed(2)}`;

    useEffect(() => {
        const fetchProperty = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("properties_host")
                    .select("*")
                    .eq("id", id)
                    .maybeSingle();

                if (data) {
                    const galleryLinks = data.gallery && data.gallery.length > 0 
                        ? data.gallery 
                        : [data.image_url, data.image_url, data.image_url, data.image_url];

                    setInfo({ ...data, gallery: galleryLinks });
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.log("Error buscando en DB, intentando locales...", err);
            }

            const localMatch = propertiesLocales.find((item) => String(item.id) === String(id));
            setInfo(localMatch || null);
            setLoading(false);
        };

        fetchProperty();
    }, [id]);

    const handleContinuarPago = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
            navigate(`/booking/${info.id}`);
        } else {
            const confirmar = window.confirm(
                "¡Casi listo! Para continuar con tu reserva en Colombia, debes iniciar sesión.\n\n¿Quieres ir a iniciar sesión ahora?"
            );
            if (confirmar) {
                await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: { redirectTo: window.location.href }
                });
            }
        }
    };

    if (loading) return <div className="p-20 text-center font-bold text-rose-500 text-xl">Cargando alojamiento en Colombia...</div>;

    if (!info) return (
        <div className="p-20 text-center">
            <h2 className="text-2xl font-bold">Propiedad no encontrada</h2>
            <Link to="/home" className="text-rose-500 underline mt-4 block">Volver al inicio</Link>
        </div>
    );

    // Cálculo del total para el widget
    const totalCalculado = info.price * (noches || 1);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-4 md:pt-6">
                
                {/* CABECERA */}
                <div className="mb-4 md:mb-6">
                    <Link to="/home">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-all group">
                            <span className="group-hover:-translate-x-1 transition-transform">←</span>
                            <p className="font-medium">Volver</p>
                        </button>
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-semibold mt-2">{info.title}</h1>
                    <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm underline font-medium mt-2">
                        <span>
                            ⭐ {info.rating || 'Nuevo'} ·{" "}
                            <span className="text-green-600 no-underline">Puntuación excelente</span> ·{" "}
                            {info.location}
                        </span>
                    </div>
                </div>

                {/* GALERÍA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-xl overflow-hidden shadow-md">
                    <div className="h-75 md:h-112.5">
                        <img
                            src={info.image_url}
                            className="w-full h-full object-cover transition duration-500 hover:brightness-90 cursor-pointer"
                            alt={info.title}
                        />
                    </div>
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

                {/* CONTENIDO Y WIDGET */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8 mb-10">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="border-b pb-6">
                            <h2 className="text-2xl font-semibold flex items-center gap-2">
                                <span>📋</span> Resumen de tu elección
                            </h2>
                            <p className="text-gray-600 mt-2 italic">
                                {info.description}
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
                                    <p className="text-lg font-medium">{info.rating || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* WIDGET DE RESERVA FORMATEADO */}
                    <div className="relative">
                        <div className="border rounded-2xl p-6 shadow-xl bg-white sticky top-28 border-rose-100">
                            <div className="mb-6 flex justify-between items-center">
                                {/* CAMBIO: Precio por noche con decimales */}
                                <span className="text-3xl font-bold">{fM(info.price)}</span>
                                <span className="text-gray-500 text-sm">/ noche</span>
                            </div>

                            <button 
                                onClick={handleContinuarPago}
                                className="w-full bg-rose-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-rose-600 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2">
                                <span>💳</span> Continuar al pago
                            </button>

                            <div className="mt-6 space-y-4 border-t pt-4">
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span className="underline italic">Subtotal por {noches} noches</span>
                                    {/* CAMBIO: Subtotal formateado */}
                                    <span className="font-medium text-black">{fM(totalCalculado)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-2xl pt-4 border-t border-gray-100">
                                    <span>Total</span>
                                    {/* CAMBIO: Total final destacado */}
                                    <span className="text-rose-600">{fM(totalCalculado)}</span>
                                </div>
                                <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest">Impuestos incluidos en Colombia</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PropertyDetails;