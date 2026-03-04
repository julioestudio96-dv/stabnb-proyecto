import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HostSuccess = () => {
return (
    <div className="min-h-screen bg-white flex flex-col">
    <Navbar />
    
    <main className="grow flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6 p-8">
        
        <div className="flex justify-center">
            <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center text-5xl animate-bounce shadow-sm">
            ✅
            </div>
        </div>

        <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">¡Anuncio Publicado!</h1>
            <p className="text-gray-500 text-lg leading-tight">
            Tu propiedad ya está registrada y lista para recibir a sus primeros huéspedes.
            </p>
        </div>

        <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 text-sm text-gray-600 italic">
            "Tu espacio se verá increíble en nuestro buscador. ¡Prepárate para las reservas!"
        </div>

        <div className="flex flex-col gap-3 pt-4">
            <Link to="/home">
            <button className="w-full bg-rose-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-rose-600 transition-all active:scale-95 shadow-lg shadow-rose-100">
                Ir al Inicio
            </button>
            </Link>
            
            <Link to="/become-host">
            <button className="w-full bg-white text-gray-700 py-4 rounded-2xl font-bold text-lg border border-gray-200 hover:bg-gray-50 transition-all">
                Publicar otra propiedad
            </button>
            </Link>
        </div>

        </div>
    </main>

    <Footer />
    </div>
);
};

export default HostSuccess;