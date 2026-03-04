import React from "react";

function SearchBar({ datos, setDatos, onSearch }) {
  const actualizar = (campo, valor) => {
    setDatos({
      ...datos,
      [campo]: valor,
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      {/* Contenedor principal: Ajustamos el padding y el gap para mobile */}
      <div className="bg-white shadow-xl border border-gray-100 rounded-4xl md:rounded-full p-4 md:p-2 flex flex-col md:flex-row items-center gap-4 md:gap-0 transition-all">
        
        {/* DONDE */}
        <div className="w-full md:flex-[1.5] px-6 py-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors">
          <label className="block text-[10px] font-black text-gray-900 uppercase tracking-tighter">Dónde</label>
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
        <div className="w-full md:flex-1 px-6 py-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors">
          <label className="block text-[10px] font-black text-gray-900 uppercase tracking-tighter">Llegada</label>
          <input
            type="date"
            className="w-full bg-transparent text-sm focus:outline-none font-medium cursor-pointer"
            value={datos.llegada}
            onChange={(e) => actualizar("llegada", e.target.value)}
          />
        </div>

        <div className="hidden md:block h-8 w-px bg-gray-200"></div>

        {/* SALIDA */}
        <div className="w-full md:flex-1 px-6 py-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors">
          <label className="block text-[10px] font-black text-gray-900 uppercase tracking-tighter">Salida</label>
          <input
            type="date"
            className="w-full bg-transparent text-sm focus:outline-none font-medium cursor-pointer"
            value={datos.salida}
            onChange={(e) => actualizar("salida", e.target.value)}
          />
        </div>

        <div className="hidden md:block h-8 w-px bg-gray-200"></div>

        {/* QUIÉNES Y BOTÓN */}
        {/* En mobile, este div ocupa todo el ancho y el botón baja naturalmente */}
        <div className="w-full md:flex-[1.2] px-6 md:pl-6 md:pr-2 py-2 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 hover:bg-gray-100 md:hover:bg-transparent rounded-[24px] md:rounded-full transition-colors">
          <div className="flex-1">
            <label className="block text-[10px] font-black text-gray-900 uppercase tracking-tighter">Quiénes</label>
            <input
              type="number"
              placeholder="¿Cuántos?"
              className="w-full bg-transparent text-sm focus:outline-none placeholder-gray-400 font-medium"
              value={datos.quienes}
              onChange={(e) => actualizar("quienes", e.target.value)}
            />
          </div>

          {/* EL BOTÓN: Ahora con margen superior solo en mobile para separarlo si es necesario */}
          <button 
            onClick={onSearch}
            className="bg-[#FF385C] hover:bg-[#E31C5F] text-white transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 
                      /* Mobile: Botón ancho y abajo */
                      w-full py-4 rounded-2xl 
                      /* Desktop: Botón circular a la derecha */
                      md:w-12 md:h-12 md:rounded-full md:p-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 stroke-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="md:hidden font-bold text-base">Buscar ahora</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;