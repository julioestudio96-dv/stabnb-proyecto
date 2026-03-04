import React from "react";

function SearchBar({ datos, setDatos, onSearch }) {

  const actualizar = (campo, valor) => {
    setDatos({
      ...datos,
      [campo]: valor,
    });
  };

  return (
    <>
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="bg-white shadow-lg border border-gray-200 rounded-3xl md:rounded-full p-2 flex flex-col md:flex-row items-center gap-2 transition-all">
          
          {/* DONDE */}
          <div className="w-full md:flex-[1.5] px-6 py-2 hover:bg-gray-100 rounded-2xl md:rounded-full cursor-pointer transition-colors">
            <label className="block text-[10px] md:text-xs font-black text-gray-900 uppercase">Dónde</label>
            <input
              type="text"
              placeholder="Explorar destinos"
              className="w-full bg-transparent text-sm focus:outline-none placeholder-gray-400 font-medium"
              value={datos.donde}
              onChange={(e) => actualizar("donde", e.target.value)}
            />
          </div>

          <div className="hidden md:block h-8 w-px bg-gray-200"></div>

          {/* LLEGADA */}
          <div className="w-full md:flex-1 px-6 py-2 hover:bg-gray-100 rounded-2xl md:rounded-full cursor-pointer transition-colors">
            <label className="block text-[10px] md:text-xs font-black text-gray-900 uppercase">Llegada</label>
            <input
              type="date"
              className="w-full bg-transparent text-sm focus:outline-none font-medium"
              value={datos.llegada}
              onChange={(e) => actualizar("llegada", e.target.value)}
            />
          </div>

          <div className="hidden md:block h-8 w-px bg-gray-200"></div>

          {/* SALIDA */}
          <div className="w-full md:flex-1 px-6 py-2 hover:bg-gray-100 rounded-2xl md:rounded-full cursor-pointer transition-colors">
            <label className="block text-[10px] md:text-xs font-black text-gray-900 uppercase">Salida</label>
            <input
              type="date"
              className="w-full bg-transparent text-sm focus:outline-none font-medium"
              value={datos.salida}
              onChange={(e) => actualizar("salida", e.target.value)}
            />
          </div>

          <div className="hidden md:block h-8 w-px bg-gray-200"></div>

          {/* QUIÉNES Y BOTÓN ÚNICO */}
          <div className="w-full md:flex-[1.2] px-6 py-2 hover:bg-gray-100 rounded-2xl md:rounded-full flex justify-between items-center transition-colors">
            <div className="flex-1">
              <label className="block text-[10px] md:text-xs font-black text-gray-900 uppercase">Quiénes</label>
              <input
                type="number"
                placeholder="¿Cuántos?"
                className="w-full bg-transparent text-sm focus:outline-none placeholder-gray-400 font-medium"
                value={datos.quienes}
                onChange={(e) => actualizar("quienes", e.target.value)}
              />
            </div>

            {/* ESTE ES EL BOTÓN ÚNICO QUE FUNCIONA PARA TODO */}
            <button 
              onClick={onSearch }
              className="bg-[#FF385C] hover:bg-[#E31C5F] text-white p-4 md:px-6 rounded-full md:rounded-full flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md w-full md:w-auto mt-2 md:mt-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="md:hidden font-bold">Buscar ahora</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchBar;