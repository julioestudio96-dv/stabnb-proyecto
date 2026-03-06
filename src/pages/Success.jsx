import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import propertiesLocales from '../data/properties'; 
import { supabase } from '../supabaseClient'; 

const Success = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [info, setInfo] = useState(null);

    useEffect(() => {
        const cargarDetalles = async () => {
            // 1. Primero buscamos en el archivo local (data/properties.js)
            const local = propertiesLocales.find((item) => String(item.id) === String(id));
            
            if (local) {
                setInfo(local);
            } else {
                // 2. Si no es local, buscamos en la tabla de anfitriones de Colombia
                const { data, error } = await supabase
                    .from('properties_host') // <-- Cambiado a tu tabla correcta
                    .select('*')
                    .eq('id', id)
                    .maybeSingle();

                if (data) {
                    setInfo(data);
                }
            }
        };
        
        cargarDetalles();
    }, [id]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
                
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
                    ✓
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Reserva Confirmada!</h1>
                <p className="text-gray-500 mb-8">
                    Tu estadía en <span className="font-semibold text-black">{info?.title || "Cargando..."}</span> está lista. 
                    Hemos enviado los detalles a tu correo electrónico.
                </p>

                <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Código de reserva:</span>
                        <span className="font-mono font-bold uppercase text-rose-500">
                            STAY-{id.slice(0,4)}-{Math.floor(Math.random() * 9000) + 1000}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Ubicación:</span>
                        <span className="font-medium">{info?.location || "Colombia"}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <button 
                        onClick={() => navigate('/home')}
                        className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
                    >
                        Explorar más lugares
                    </button>
                    
                    <button 
                        onClick={() => navigate('/my-bookings')} 
                        className="w-full bg-white text-gray-700 py-4 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition-all"
                    >
                        Ver mis reservas
                    </button>
                </div>
            </div>
        </div>
    );    
};

export default Success;