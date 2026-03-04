import { useNavigate } from "react-router-dom"
import React from "react";

export default function Intro() {

const navigate = useNavigate();

return (
    <>
        <div className="h-screen flex flex-col items-center justify-center bg-linear-to-r from-rose-500 to-red-400 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Staybnb</h1>

        <p className="mb-8 text-lg">Encuentra o Publica tu próximo alojamiento</p>

        <button
            onClick={() => navigate("/home")}
            className="bg-white text-rose-500 cursor-pointer px-8 py-3 rounded-full font-semibold hover:scale-120 transition text-lg">
            Iniciar
        </button>
        </div>
    </>
);
}
