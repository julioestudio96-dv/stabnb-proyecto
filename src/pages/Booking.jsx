import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import propertiesLocales from '../data/properties'; // Renombrado para claridad
import { supabase } from '../supabaseClient'; 
import Footer from '../components/Footer';

const Booking = ({ noches, datosBusqueda }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [metodoPago, setMetodoPago] = useState('tarjeta');

const handleConfirmarReserva = async () => {
    try {
        // Aquí podrías agregar lógica para guardar la reserva en Supabase
        const { data, error } = await supabase
            .from('bookings')
            .insert([
                {
                    property_id: id,                  // ID de la propiedad
                    user_email: "usuario@ejemplo.com", // Por ahora manual hasta tener Auth
                    total_price: String(total),               // El total que calculaste
                    check_in: datosBusqueda.llegada,  // Fecha de entrada
                    check_out: datosBusqueda.salida   // Fecha de salida
                }
            ]);
            if (error) throw error;
            // Si todo va bien, redirigimos a la página de éxito
            navigate(`/success/${id}`);
        } catch (error) {
            console.error("Error al guardar la reserva:", error.message);
            alert("Hubo un error al confirmar tu reserva. Por favor, intenta de nuevo.");
        }
};

    useEffect(() => {
        const cargarPropiedad = async () => {
            setLoading(true);
            
            // 1. Intentar buscar en Supabase primero
            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .eq('id', id)
                .single();

            if (data) {
                setInfo(data);
            } else {
                // 2. Si no está en Supabase, buscar en el archivo local
                const local = propertiesLocales.find((item) => item.id === Number(id));
                setInfo(local);
            }
            setLoading(false);
        };

        cargarPropiedad();
    }, [id]);

    // Cálculos dinámicos
    const precioBase = info?.price || 0;
    const subtotal = precioBase * noches;
    const tarifaServicio = subtotal * 0.10; // 10% del subtotal
    const total = subtotal + tarifaServicio;

    if (loading) return <div className="p-20 text-center font-bold">Verificando disponibilidad...</div>;
    if (!info) return <div className="p-20 text-center">Ups, no encontramos los detalles de esta propiedad.</div>;

    const handlePago = () => {
        navigate(`/success/${id}`);
    };

return (
    <>
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <header className="border-b sticky top-0 bg-white z-50">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
                    >
                        <span className="text-xl">✕</span>
                    </button>
                    <h1 className="text-lg md:text-2xl font-semibold">Confirmar y pagar</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-6 md:py-12">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                    
                    {/* SECCIÓN IZQUIERDA: TU VIAJE Y PAGO */}
                    <div className="flex-1 order-2 lg:order-1">
                        <section className="mb-8">
                            <h2 className="text-xl md:text-2xl font-semibold mb-6">Tu viaje</h2>
                            <div className="space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-sm">Fechas</p>
                                        <p className="text-gray-600 text-sm italic">
                                            {datosBusqueda.llegada || 'No seleccionada'} al {datosBusqueda.salida || 'No seleccionada'}
                                        </p>
                                    </div>
                                    <button onClick={() => navigate('/home')} className="underline font-semibold text-sm hover:text-black">Editar</button>
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-sm">Huéspedes</p>
                                        <p className="text-gray-600 text-sm">
                                            {datosBusqueda.huespedes} {datosBusqueda.huespedes === 1 ? 'persona' : 'personas'} se alojarán aquí.
                                        </p>
                                    </div>
                                    <button onClick={() => navigate('/home')} className="underline font-semibold text-sm hover:text-black">Editar</button>
                                </div>
                            </div>
                        </section>

                        <hr className="my-8 border-gray-200" />

                        {/* MÉTODOS DE PAGO */}
                        <section className="mb-8">
                            <h2 className="text-xl md:text-2xl font-semibold mb-6">Pagar con</h2>
                            <div className="space-y-4">
                                {/* TARJETA */}
                                <div 
                                    onClick={() => setMetodoPago('tarjeta')} 
                                    className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                                        metodoPago === 'tarjeta' ? 'border-black bg-gray-50' : 'border-gray-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">💳</span>
                                        <span className="font-medium">Tarjeta de crédito o débito</span>
                                    </div>
                                    {metodoPago === 'tarjeta' && (
                                        <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-1 duration-300">
                                            <input type="text" placeholder="Número de tarjeta" className="w-full p-3 border border-gray-300 rounded-lg outline-rose-500" />
                                            <div className="flex gap-3">
                                                <input type="text" placeholder="MM/AA" className="w-1/2 p-3 border border-gray-300 rounded-lg outline-rose-500" />
                                                <input type="text" placeholder="CVV" className="w-1/2 p-3 border border-gray-300 rounded-lg outline-rose-500" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* NEQUI */}
                                <div 
                                    onClick={() => setMetodoPago('nequi')} 
                                    className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                                        metodoPago === 'nequi' ? 'border-[#da0081] bg-rose-50/30' : 'border-gray-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">📱</span>
                                        <span className="font-bold text-[#da0081]">NEQUI</span>
                                    </div>
                                    {metodoPago === 'nequi' && (
                                        <div className="mt-4 animate-in fade-in duration-300">
                                            <input type="tel" placeholder="Número de celular" className="w-full p-3 border border-[#da0081]/30 rounded-lg outline-[#da0081]" />
                                            <p className="text-[10px] text-gray-500 mt-2">Recibirás un mensaje en tu app Nequi para autorizar el pago.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        <button 
                            onClick={handleConfirmarReserva} 
                            className="w-full md:w-auto px-12 bg-rose-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-rose-600 transition shadow-lg active:scale-95"
                        >
                            {metodoPago === 'nequi' ? 'Pagar con Nequi' : 'Confirmar Reserva'}
                        </button>
                    </div>

                    {/* SECCIÓN DERECHA: RESUMEN DE PRECIOS */}
                    <aside className="flex-1 order-1 lg:order-2">
                        <div className="border border-gray-200 rounded-2xl p-6 sticky top-28 shadow-md bg-white">
                            <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                                <img 
                                    src={info.image_url} 
                                    className="w-28 h-28 object-cover rounded-xl"
                                    alt={info.title} 
                                />
                                <div className="flex flex-col justify-center">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{info.location}</p>
                                    <p className="text-sm font-semibold text-gray-800 leading-snug">{info.title}</p>
                                    <p className="text-xs mt-2 text-gray-600">⭐ {info.rating || 'Nuevo'}</p>
                                </div>
                            </div>
                            
                            <h3 className="text-lg font-semibold mb-4 text-gray-900">Detalles del pago</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>${precioBase.toLocaleString()} x {noches} noches</span>
                                    <span>${subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span className="underline">Tarifa de servicio Staybnb</span>
                                    <span>${tarifaServicio.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between font-bold text-gray-900 border-t pt-4 text-xl">
                                    <span>Total</span>
                                    <span className="text-rose-600">${total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />
        </div>
    </>
);
};

export default Booking;