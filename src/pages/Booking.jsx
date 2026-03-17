import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Booking = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { 
        info: infoPropiedad, 
        datosBusqueda: datosIniciales, 
        noches: nochesIniciales 
    } = location.state || {};

    const [info, setInfo] = useState(infoPropiedad || null);
    const [loading, setLoading] = useState(!infoPropiedad);
    const [confirmando, setConfirmando] = useState(false);

    // --- ESTADOS DE EDICIÓN ---
    const [editandoFechas, setEditandoFechas] = useState(false);
    const [editandoHuespedes, setEditandoHuespedes] = useState(false);

    const [datosReserva, setDatosReserva] = useState(datosIniciales || {
        llegada: '',
        salida: '',
        huespedes: 1
    });

    const [noches, setNoches] = useState(nochesIniciales || 1);

    const fM = (valor) => `$${parseFloat(valor || 0).toFixed(2)}`;

    // Función para recalcular noches cuando cambian las fechas manualmente
    const calcularNoches = (llegada, salida) => {
        if (!llegada || !salida) return 1;
        const inicio = new Date(llegada);
        const fin = new Date(salida);
        const diferencia = fin - inicio;
        const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
        return dias > 0 ? dias : 1;
    };

    useEffect(() => {
        if (!info) {
            const fetchProperty = async () => {
                const { data } = await supabase.from("properties_host").select("*").eq("id", id).single();
                setInfo(data);
                setLoading(false);
            };
            fetchProperty();
        }
    }, [id, info]);

   // --- LÓGICA DE CÁLCULO INDEPENDIENTE ---
        const numHuespedes = parseInt(datosReserva.huespedes || 1);
        const personasExtra = numHuespedes > 1 ? (numHuespedes - 1) : 0;

        // LINEA 1: Alojamiento puro
        const precioBaseTotal = (info?.price || 0) * noches;

        // LINEA 2: Personas extra puro (valor fijo)
        const cargoExtraTotal = personasExtra * 5; 

        // TOTAL
        const totalFinal = precioBaseTotal + cargoExtraTotal;

    const handleConfirmarReserva = async () => {
        setConfirmando(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { alert("Inicia sesión"); setConfirmando(false); return; }

        const { error } = await supabase.from("bookings").insert([{
            property_id: id,
            guest_id: user.id,
            check_in: datosReserva.llegada,
            check_out: datosReserva.salida,
            total_price: totalFinal,
            guests: numHuespedes,
            //status: 'confirmed'
        }]);

        if (error) alert(error.message);
        else { alert("¡Reserva confirmada! 🎉"); 
            navigate(`/success/${id}`); }
        setConfirmando(false);
    };

    if (loading) return <div className="p-20 text-center font-bold text-rose-500">Cargando...</div>;

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 md:px-10 py-10">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="text-2xl hover:bg-gray-100 p-2 rounded-full transition-all">✕</button>
                    <h1 className="text-3xl font-bold">Confirmar y pagar</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-6">Tu viaje</h2>
                            
                            {/* SECCIÓN FECHAS EDITABLE */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex-1">
                                    <p className="font-bold">Fechas</p>
                                    {editandoFechas ? (
                                        <div className="flex gap-2 mt-2">
                                            <input 
                                                type="date" 
                                                className="border rounded p-1 text-sm"
                                                value={datosReserva.llegada}
                                                onChange={(e) => {
                                                    const nuevas = { ...datosReserva, llegada: e.target.value };
                                                    setDatosReserva(nuevas);
                                                    setNoches(calcularNoches(nuevas.llegada, nuevas.salida));
                                                }}
                                            />
                                            <input 
                                                type="date" 
                                                className="border rounded p-1 text-sm"
                                                value={datosReserva.salida}
                                                onChange={(e) => {
                                                    const nuevas = { ...datosReserva, salida: e.target.value };
                                                    setDatosReserva(nuevas);
                                                    setNoches(calcularNoches(nuevas.llegada, nuevas.salida));
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-gray-600">{datosReserva.llegada} al {datosReserva.salida}</p>
                                    )}
                                </div>
                                <button 
                                    onClick={() => setEditandoFechas(!editandoFechas)}
                                    className="font-semibold underline text-black hover:text-gray-600"
                                >
                                    {editandoFechas ? "Guardar" : "Editar"}
                                </button>
                            </div>

                            {/* SECCIÓN HUÉSPEDES EDITABLE */}
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <p className="font-bold">Huéspedes</p>
                                    {editandoHuespedes ? (
                                        <input 
                                            type="number" 
                                            min="1" 
                                            className="border rounded p-1 mt-2 w-20"
                                            value={datosReserva.huespedes}
                                            onChange={(e) => setDatosReserva({ ...datosReserva, huespedes: e.target.value })}
                                        />
                                    ) : (
                                        <p className="text-gray-600">{numHuespedes} huéspedes</p>
                                    )}
                                </div>
                                <button 
                                    onClick={() => setEditandoHuespedes(!editandoHuespedes)}
                                    className="font-semibold underline text-black hover:text-gray-600"
                                >
                                    {editandoHuespedes ? "Guardar" : "Editar"}
                                </button>
                            </div>
                        </section>

                        <hr className="border-gray-200" />
                        
                        {/* SECCIÓN PAGOS (IGUAL QUE ANTES) */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-6">Pagar con</h2>
                            <div className="space-y-4">
                                <div className="border-2 border-black rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-4"><span>💳</span><span className="font-medium">Tarjeta</span></div>
                                    <input type="text" placeholder="Número de tarjeta" className="w-full border p-3 rounded-lg mb-3" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input type="text" placeholder="MM/YY" className="border p-3 rounded-lg" />
                                        <input type="text" placeholder="CVV" className="border p-3 rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <button onClick={handleConfirmarReserva} disabled={confirmando} className="bg-rose-500 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-rose-600">
                            {confirmando ? "Procesando..." : "Confirmar Reserva"}
                        </button>
                    </div>

                    {/* TARJETA DE PRECIO (SE ACTUALIZA SOLA) */}
                    <div className="lg:sticky lg:top-28 h-fit">
                        <div className="border rounded-2xl p-6 shadow-sm bg-white border-gray-100">
                            <div className="flex gap-4 mb-6">
                                <img src={info.image_url} className="w-28 h-20 object-cover rounded-xl" alt="Propiedad" />
                                <div><p className="text-sm font-medium leading-tight">{info.title}</p></div>
                            </div>
                            <hr className="mb-6" />
                            <h2 className="text-xl font-semibold mb-4">Detalles del precio</h2>
                            <div className="space-y-4 text-sm">
                                {/* LÍNEA DE NOCHES */}
                                <div className="flex justify-between text-gray-700">
                                    <span className="underline italic text-sm">${info?.price} x {noches} noches</span>
                                    <span className="font-medium">{fM(precioBaseTotal)}</span>
                                </div>
                                {/* LÍNEA DE HUÉSPEDES */}
                                {personasExtra > 0 && (
                                    <div className="flex justify-between text-rose-500 text-sm italic">
                                        <span className="underline italic">Gastos por personas extra ({personasExtra} x $5.00)</span>
                                        <span className="font-medium">{fM(cargoExtraTotal)}</span>
                                    </div>
                                )}
                                {/* TOTAL FINAL */}
                                <div className="flex justify-between font-bold text-xl pt-4 border-t mt-4">
                                    <span>Total (USD)</span>
                                    <span className="text-rose-600">{fM(totalFinal)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Booking;