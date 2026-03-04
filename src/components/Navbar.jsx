import React, { useState } from "react";
import Staylogo from "../assets/staylogo.png";
import { Link } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dropMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <header className=" top-0 z-50 bg-white border-b">
        <div className="flex justify-between items-center px-4 md:px-8 py-4">
          {/* LOGO */}
          <Link to="/home">
            <img
              src={Staylogo}
              alt="StayBnB Logo"
              className="h-10 md:h-20 w-auto object-contain cursor-pointer"
            />
          </Link>

          {/* USER MENU */}
          <div className="flex items-center gap-4">
            {/* BOTÓN ANFITRIÓN: Al hacer clic, abre el modal */}
            <Link to="/becomehost">
              <button className="font-medium hover:bg-gray-100 px-4 py-2 rounded-full transition cursor-pointer">
                Conviértete en anfitrión
              </button>
            </Link>

            <div
              className="
              flex items-center gap-2
              border rounded-full
              p-2 cursor-pointer
              hover:shadow-md
              transition
            "
              onClick={dropMenu}
            >
              <span>☰</span>
              <span className="text-xl">👤</span>
            </div>

            {/* 3. MENÚ DESPLEGABLE (Dropdown) */}
            <div
              className={
                isOpen
                  ? "absolute top-14 right-0 w-60 bg-white shadow-xl border border-gray-100 rounded-xl py-2 z-100 animate-in fade-in duration-200"
                  : "hidden"
              }
            >
              <div className="flex flex-col">
                {/* Opciones de Inicio */}
                <button className="text-left px-4 py-2 hover:bg-gray-50 font-bold text-sm transition cursor-pointer">
                  Regístrate o Inicia sesión
                </button>
                <hr className=" border-gray-100" />
                {/* Opciones Secundarias */}
                <Link to="/becomehost" onClick={() => setIsOpen(false)}>
                  <button className="w-full text-left px-4 py-1 hover:bg-gray-50 text-sm transition cursor-pointer">
                    Pon tu espacio en Staybnb
                  </button>
                </Link>
                <Link to="/my-bookings" onClick={() => setIsOpen(false)}>
                <button className="w-full text-left px-4 py-1 hover:bg-gray-50 text-sm transition cursor-pointer">
                  Mis reservas
                </button>
                </Link>
                <button className="text-left px-4 py-1 hover:bg-gray-50 text-sm transition cursor-pointer">
                  Centro de ayuda
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* COMPONENTE DEL MODAL: Se renderiza fuera del header para evitar problemas de capas (z-index) */}
    </>
  );
}

export default Navbar;
