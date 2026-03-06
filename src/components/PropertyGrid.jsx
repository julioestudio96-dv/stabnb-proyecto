import React, { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import propertiesLocales from "../data/properties"; 
import { supabase } from "../supabaseClient"; 

function PropertyGrid({ filtro }) {
  const [loading, setLoading] = useState(true);
  const [listaFinal, setListaFinal] = useState([]);

  useEffect(() => {
    const obtenerPropiedades = async () => {
      setLoading(true);
      try {
        // 1. Buscamos en la nueva tabla 'properties_host'
        // Traemos todo: el título, precio, foto principal y el array 'gallery'
        const { data: dataSupabase, error } = await supabase
          .from('properties_host') 
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // 2. Combinamos: [Nuevas de Supabase] + [Las 20 de properties.js]
        // No necesitamos mapear imágenes porque ya vienen como array
        setListaFinal([...dataSupabase, ...propertiesLocales]);

      } catch (error) {
        console.error("Error cargando propiedades:", error.message);
        // Si falla la red, al menos mostramos las locales para que no se vea vacío
        setListaFinal(propertiesLocales);
      } finally {
        setLoading(false);
      }
    };

    obtenerPropiedades();
  }, []);

  // FILTRO: Funciona igual para locales y base de datos
  const propiedadesFiltradas = listaFinal.filter((item) => {
    if (!filtro) return true;
    const busqueda = filtro.toLowerCase().trim();
    return (
      item.title?.toLowerCase().includes(busqueda) ||
      item.location?.toLowerCase().includes(busqueda)
    );
  });

  return (
    <div className="px-4 md:px-8 mt-8 mb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading ? (
          /* Tu Spinner de carga con estilo Rose */
          <div className="col-span-full flex flex-col items-center gap-2 py-10">
            <div className="flex items-center bg-rose-600 text-white px-6 py-3 rounded-full shadow-lg">
              <span className="font-semibold text-sm">Buscando hogares en Colombia...</span>
              <svg className="ml-3 h-5 w-5 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>
        ) : (
          propiedadesFiltradas.length > 0 ? (
            propiedadesFiltradas.map((item) => (
              // Usamos una combinación de ID y título para la KEY por si hay IDs repetidos entre local y DB
              <PropertyCard key={`${item.id}-${item.title}`} info={item} />
            ))
          ) : (
            /* Tu estado vacío con diseño */
            <div className="col-span-full text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <span className="text-5xl mb-4 block">🏝️</span>
              <h3 className="text-xl font-bold text-gray-800">No hay resultados</h3>
              <p className="text-gray-500 mt-2">
                No encontramos nada para "<span className="font-semibold text-rose-500">{filtro}</span>".
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default PropertyGrid;