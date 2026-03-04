import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import propertiesLocales from "../data/properties"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MyBookings = () => {
const [bookings, setBookings] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchMyBookings = async () => {
    setLoading(true);
    try {
        // 1. Traer las reservas de Supabase
        const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

        if (error) throw error;

        // 2. Cruzar los datos con la info local de las propiedades
        const bookingsConDetalles = data.map((reserva) => {
        const detallePropiedad = propertiesLocales.find(
            (p) => String(p.id) === String(reserva.property_id)
        );
        return { ...reserva, propiedad: detallePropiedad };
        });

        setBookings(bookingsConDetalles);
    } catch (err) {
        console.error("Error al obtener reservas:", err.message);
    } finally {
        setLoading(false);
    }
    };


    
    fetchMyBookings();
}, []);

return (
    <div className="min-h-screen bg-white flex flex-col">
    <Navbar />
    
    <main className="grow max-w-5xl mx-auto w-full px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Mis viajes</h1>

        {loading ? (
        <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
            <p className="mt-4 text-gray-500">Cargando tus aventuras...</p>
        </div>
        ) : bookings.length === 0 ? (
        <div className="text-left border-t pt-10">
            <h2 className="text-2xl font-semibold">Aún no hay viajes reservados</h2>
            <p className="text-gray-500 mt-2 mb-6">
            ¡Es hora de desempolvar las maletas y empezar a planear tu próxima estancia!
            </p>
            <button className="border border-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
            Empezar a buscar
            </button>
        </div>
        ) : (
        <div className="space-y-6">
            {bookings.map((item) => (
            <div 
                key={item.id} 
                className="flex flex-col md:flex-row border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition bg-white"
            >
                {/* Imagen de la propiedad */}
                <div className="w-full md:w-72 h-48">
                <img 
                    src={item.propiedad?.image_url || "https://via.placeholder.com/300"} 
                    alt={item.propiedad?.title}
                    className="w-full h-full object-cover"
                />
                </div>

                {/* Detalles de la reserva */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800">
                        {item.propiedad?.title || "Propiedad de Staybnb"}
                    </h3>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                        Confirmada
                    </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">{item.propiedad?.location}, Colombia</p>
                    
                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Llegada</p>
                        <p className="font-medium text-gray-700">{item.check_in}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Salida</p>
                        <p className="font-medium text-gray-700">{item.check_out}</p>
                    </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Pago total</p>
                    <p className="text-lg font-bold text-rose-500">${Number(item.total_price).toLocaleString()}</p>
                    </div>
                    <p className="text-[10px] text-gray-300 font-mono">ID: #{item.id.toString().slice(0,8)}</p>
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