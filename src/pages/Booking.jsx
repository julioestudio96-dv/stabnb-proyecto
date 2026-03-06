import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import propertiesLocales from '../data/properties'; 
import { supabase } from '../supabaseClient'; 
import Footer from '../components/Footer';

const Booking = ({ noches: nochesIniciales = 1, datosBusqueda: datosIniciales = { llegada: '', salida: '', huespedes: 1 } }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [metodoPago, setMetodoPago] = useState('tarjeta');

    const [editando, setEditando] = useState(false);
    const [datosEditados, setDatosEditados] = useState(datosIniciales);
    const [nochesActuales, setNochesActuales] = useState(nochesIniciales);

    const [tarjetaInfo, setTarjetaInfo] = useState({ numero: '', vence: '', cvv: '' });
    const [celularNequi, setCelularNequi] = useState('');

    const fM = (valor) => `$${parseFloat(valor || 0).toLocaleString('es-CO')}`;

    // Cálculos
    const precioBase = parseFloat(info?.price || 0);
    const subtotal = precioBase * nochesActuales;
    const tarifaServicio = subtotal * 0.10; 
    const total = subtotal + tarifaServicio;

    const recalcularNoches = (llegada, salida) => {
        const fechaIn = new Date(llegada);
        const fechaOut = new Date(salida);
        const diferencia = fechaOut - fechaIn;
        const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
        return dias > 0 ? dias : 1;
    };

    const handleGuardarCambios = () => {
        const nuevasNoches = recalcularNoches(datosEditados.llegada, datosEditados.salida);
        setNochesActuales(nuevasNoches);
        setEditando(false);
    };

    const handleConfirmarReserva = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user;

            if (!user) {
                alert("Debes iniciar sesión para confirmar tu reserva.");
                return;
            }

            if (metodoPago === 'tarjeta' && (!tarjetaInfo.numero || !tarjetaInfo.vence || !tarjetaInfo.cvv)) {
                alert("Por favor completa todos los datos de la tarjeta.");
                return;
            }

            // --- GENERACIÓN DE REFERENCIA ÚNICA ---
            const timestamp = Date.now();
            const transaccionRef = metodoPago === 'nequi' 
                ? `NEQUI-${celularNequi}-${timestamp}` 
                : `TRX-${timestamp}-${Math.floor(Math.random() * 1000)}`;

            const ultimosCuatro = metodoPago === 'tarjeta' ? tarjetaInfo.numero.slice(-4) : 'N/A';

            // --- INSERCIÓN EN BASE DE DATOS ---
            const { data: nuevaReserva, error } = await supabase
                .from('bookings')
                .insert([
                    {
                        // IMPORTANTE: Convertimos ID a número para evitar conflictos de tipo
                        property_id: parseInt(id), 
                        guest_id: user.id,
                        total_price: parseFloat(total.toFixed(2)), 
                        check_in: datosEditados.llegada || new Date().toISOString().split('T')[0],
                        check_out: datosEditados.salida || new Date().toISOString().split('T')[0],
                        payment_method: metodoPago,
                        card_last_four: ultimosCuatro,
                        transaction_id: transaccionRef
                    }
                ])
                .select(); // Forzamos a que devuelva la fila creada

            if (error) throw error;
            
            // Si llegamos aquí, la reserva existe en Supabase
            console.log("Reserva guardada con éxito:", nuevaReserva);
            navigate(`/success/${id}`);

        } catch (error) {
            console.error("Error detallado:", error);
            alert(`Error de Supabase: ${error.message}`);
        }
    };

    useEffect(() => {
        const cargarPropiedad = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('properties_host') 
                .select('*')
                .eq('id', id)
                .maybeSingle();

            if (data) {
                setInfo(data);
            } else {
                const local = propertiesLocales.find((item) => String(item.id) === String(id));
                setInfo(local);
            }
            setLoading(false);
        };
        cargarPropiedad();
    }, [id]);

    if (loading) return <div className="p-20 text-center font-bold text-rose-500">Verificando disponibilidad en Colombia...</div>;
    if (!info) return <div className="p-20 text-center">Ups, no encontramos los detalles de la propiedad.</div>;

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            {/* ... Resto de tu JSX igual que antes ... */}
            <header className="border-b sticky top-0 bg-white z-50">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">✕</button>
                    <h1 className="text-lg md:text-2xl font-semibold">Confirmar y pagar</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-6 md:py-12">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                    
                    <div className="flex-1 order-2 lg:order-1">
                        <section className="mb-8">
                            <h2 className="text-xl md:text-2xl font-semibold mb-6">Tu viaje</h2>
                            <div className="space-y-6">
                                <div className="flex justify-between items-start">
                                    {editando ? (
                                        <div className="flex gap-2 w-full mr-4">
                                            <input type="date" className="border p-2 rounded-lg text-sm w-full" value={datosEditados.llegada} onChange={(e) => setDatosEditados({...datosEditados, llegada: e.target.value})} />
                                            <input type="date" className="border p-2 rounded-lg text-sm w-full" value={datosEditados.salida} onChange={(e) => setDatosEditados({...datosEditados, salida: e.target.value})} />
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="font-semibold text-sm">Fechas</p>
                                            <p className="text-gray-600 text-sm">{datosEditados.llegada || 'No seleccionadas'} al {datosEditados.salida || 'No seleccionadas'}</p>
                                        </div>
                                    )}
                                    {!editando && <button onClick={() => setEditando(true)} className="underline font-semibold text-sm">Editar</button>}
                                </div>

                                <div className="flex justify-between items-start">
                                    {editando ? (
                                        <input type="number" min="1" className="border p-2 rounded-lg text-sm w-full mr-4" value={datosEditados.huespedes} onChange={(e) => setDatosEditados({...datosEditados, huespedes: parseInt(e.target.value)})} />
                                    ) : (
                                        <div>
                                            <p className="font-semibold text-sm">Huéspedes</p>
                                            <p className="text-gray-600 text-sm">{datosEditados.huespedes} {datosEditados.huespedes === 1 ? 'persona' : 'personas'}</p>
                                        </div>
                                    )}
                                    {!editando && <button onClick={() => setEditando(true)} className="underline font-semibold text-sm">Editar</button>}
                                </div>

                                {editando && (
                                    <button onClick={handleGuardarCambios} className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold">Guardar cambios</button>
                                )}
                            </div>
                        </section>

                        <hr className="my-8 border-gray-200" />

                        <section className="mb-8">
                            <h2 className="text-xl md:text-2xl font-semibold mb-6">Pagar con</h2>
                            <div className="space-y-4">
                                <div onClick={() => setMetodoPago('tarjeta')} className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${metodoPago === 'tarjeta' ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <span>💳</span>
                                        <span className="font-medium">Tarjeta de crédito o débito</span>
                                    </div>
                                    {metodoPago === 'tarjeta' && (
                                        <div className="mt-4 space-y-3">
                                            <input type="text" placeholder="Número de tarjeta" className="w-full p-3 border rounded-lg" value={tarjetaInfo.numero} onChange={(e) => setTarjetaInfo({ ...tarjetaInfo, numero: e.target.value })} />
                                            <div className="flex gap-4">
                                                <input type="text" placeholder="MM/YY" maxLength="5" className="w-1/2 p-3 border rounded-lg" value={tarjetaInfo.vence} onChange={(e) => setTarjetaInfo({ ...tarjetaInfo, vence: e.target.value })} />
                                                <input type="password" placeholder="CVV" maxLength="3" className="w-1/2 p-3 border rounded-lg" value={tarjetaInfo.cvv} onChange={(e) => setTarjetaInfo({ ...tarjetaInfo, cvv: e.target.value })} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div onClick={() => setMetodoPago('nequi')} className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${metodoPago === 'nequi' ? 'border-[#da0081] bg-rose-50/30' : 'border-gray-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <span>📱</span>
                                        <span className="font-bold text-[#da0081]">NEQUI</span>
                                    </div>
                                    {metodoPago === 'nequi' && (
                                        <div className="mt-4">
                                            <input className="w-full p-3 border border-[#da0081]/30 rounded-lg focus:ring-1 focus:ring-[#da0081]" type="tel" placeholder="Número de celular" value={celularNequi} onChange={(e) => setCelularNequi(e.target.value)} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        <button onClick={handleConfirmarReserva} className="w-full md:w-auto px-12 bg-rose-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-rose-600 transition shadow-lg active:scale-95">
                            {metodoPago === 'nequi' ? 'Pagar con Nequi' : 'Confirmar Reserva'}
                        </button>
                    </div>

                    <aside className="flex-1 order-1 lg:order-2">
                        <div className="border border-gray-200 rounded-2xl p-6 sticky top-28 shadow-md bg-white">
                            <div className="flex gap-4 mb-6 pb-6 border-b">
                                <img src={info.image_url} className="w-28 h-28 object-cover rounded-xl" alt={info.title} />
                                <div className="flex flex-col justify-center">
                                    <p className="text-sm font-semibold text-gray-800">{info.title}</p>
                                    <p className="text-xs text-gray-600">⭐ {info.rating || 'Nuevo'}</p>
                                </div>
                            </div>
                            
                            <h3 className="text-lg font-semibold mb-4">Detalles del pago</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>{fM(precioBase)} x {nochesActuales} noches</span>
                                    <span>{fM(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span className="underline italic">Tarifa de servicio Staybnb</span>
                                    <span>{fM(tarifaServicio)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-gray-900 border-t pt-4 text-xl">
                                    <span>Total (COP)</span>
                                    <span className="text-rose-600">{fM(total)}</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Booking;