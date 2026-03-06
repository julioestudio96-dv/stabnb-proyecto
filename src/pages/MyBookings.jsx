import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import propertiesLocales from "../data/properties"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllBookings = async () => {
            setLoading(true);
            try {
                const { data: bookingsData, error: bErr } = await supabase
                    .from("bookings")
                    .select("*")
                    .order("created_at", { ascending: false });

                if (bErr) throw bErr;

                const { data: propertiesDB } = await supabase
                    .from("properties_host")
                    .select("*");

                const bookingsConInfo = bookingsData.map((reserva) => {
                    const pId = String(reserva.property_id);
                    const detalle = propertiesDB?.find(p => String(p.id) === pId) 
                                || propertiesLocales.find(p => String(p.id) === pId);
                    
                    return { ...reserva, propiedad: detalle };
                });

                setBookings(bookingsConInfo);
            } catch (err) {
                console.error("Error crítico al cargar:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllBookings();
    }, []);

    const handleDelete = async (bookingId) => {
        const confirmCancel = window.confirm("¿Estás seguro de que deseas cancelar esta reserva en Colombia? 🇨🇴");
        
        if (confirmCancel) {
            try {
                const { error } = await supabase
                    .from("bookings")
                    .delete()
                    .eq("id", bookingId);

                if (error) throw error;

                setBookings(prev => prev.filter(b => b.id !== bookingId));
                alert("Reserva cancelada correctamente.");
            } catch (error) {
                alert("Error al eliminar: " + error.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Navbar />
            <main className="grow max-w-5xl mx-auto w-full px-4 py-10">
                <h1 className="text-3xl font-bold mb-8 italic text-gray-800">Mis viajes</h1>

                {loading ? (
                    <div className="text-center py-20 italic text-gray-500">Cargando...</div>
                ) : bookings.length === 0 ? (
                    <div className="text-left border-t pt-10">
                        <h2 className="text-2xl font-semibold text-gray-400">No se encontraron reservas</h2>
                        <Link to="/home" className="text-rose-500 underline mt-4 inline-block">Explorar opciones</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {bookings.map((item) => (
                            <div key={item.id} className="relative flex flex-col md:flex-row border border-gray-200 rounded-3xl overflow-hidden shadow-sm bg-white p-5 gap-6 group transition-all hover:shadow-md">
                                
                                {/* BOTÓN DE ELIMINAR: Ahora tiene su propio espacio limpio en la esquina */}
                                <button 
                                    onClick={() => handleDelete(item.id)}
                                    className="absolute top-5 right-5 bg-gray-100 text-gray-400 p-2.5 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all z-10 border border-transparent hover:border-red-100 shadow-sm"
                                    title="Cancelar Reserva"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {/* Imagen con bordes más suaves */}
                                <div className="w-full md:w-64 h-44 bg-gray-100 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                                    <img 
                                        src={item.propiedad?.image_url || 'https://via.placeholder.com/400x300'} 
                                        alt="Propiedad"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex flex-col mb-2">
                                            {/* pr-16 asegura que el texto no se meta debajo del botón de borrar */}
                                            <h3 className="text-2xl font-bold text-gray-900 pr-16 leading-tight">
                                                {item.propiedad?.title || "Reserva de Colombia"}
                                            </h3>
                                            
                                            {/* ESTADO: Movido debajo del título para evitar colisiones */}
                                            <div className="mt-2">
                                                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-2.5 py-1 rounded-lg border border-green-100">
                                                    ● Confirmada
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <p className="text-gray-500 text-sm flex items-center gap-1 font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            {item.propiedad?.location || "Ubicación en Colombia"}
                                        </p>

                                        <div className="mt-5 flex gap-8 text-sm border-t border-gray-50 pt-4">
                                            <div className="flex flex-col">
                                                <span className="text-gray-400 font-bold uppercase text-[9px] tracking-widest mb-1">Llegada</span>
                                                <span className="font-semibold text-gray-700">{item.check_in || "---"}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-gray-400 font-bold uppercase text-[9px] tracking-widest mb-1">Salida</span>
                                                <span className="font-semibold text-gray-700">{item.check_out || "---"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end mt-4">
                                        <div>
                                            <span className="text-gray-400 text-[10px] font-bold uppercase block mb-0.5">Total pagado</span>
                                            <p className="text-2xl font-black text-rose-500">${item.total_price}</p>
                                        </div>
                                        {/* ID convertido a String para evitar el error de .slice() */}
                                        <p className="text-[9px] text-gray-300 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                            ID: {String(item.id).slice(0,8)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default MyBookings;