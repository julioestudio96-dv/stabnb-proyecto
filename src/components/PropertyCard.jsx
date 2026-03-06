import React from "react";
import { Link } from "react-router-dom";

function PropertyCard({ info }) {
  // --- LÓGICA DE DETECCIÓN MEJORADA ---
  // 1. Verificamos si tiene host_id (creado por usuario)
  // 2. O si el ID es un UUID (letras y números largos, típico de Supabase)
  // 3. O si tiene el campo user_id
  const esReciente = info.host_id || info.user_id || isNaN(info.id);

  return (
  <>
    <div className="cursor-pointer group">
      {/* Navegación al detalle */}
      <Link to={`/property-details/${info.id}`}>
        <div className="overflow-hidden rounded-xl relative">
          <img
            src={info.image_url}
            className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
            alt={info.title}
          />
          
          {/* OPCIONAL: Etiqueta visual sobre la foto para que resalte más */}
          {esReciente && (
            <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">
              NUEVO
            </div>
          )}
        </div>
      </Link>

      <div className="mt-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-base truncate w-3/4 text-gray-800">
            {info.title}
          </h3>
          <span className="text-sm">⭐ {info.rating || "Nuevo"}</span>
        </div>

        <p className="text-gray-500 text-sm flex items-center gap-1">
          <span>📍</span> {info.location}, Colombia
        </p>

        {/* ETIQUETA DEBAJO DE LA UBICACIÓN */}
        {esReciente ? (
          <p className="text-blue-600 text-[11px] font-bold mt-1 uppercase tracking-wider">
            ✨ Publicado recientemente
          </p>
        ) : (
          /* Espacio reservado para que no se mueva el precio */
          <div className="h-5"></div>
        )}

        <p className="mt-1">
          <span className="font-bold text-gray-900">${info.price}</span>
          <span className="text-gray-600 text-sm"> noche</span>
        </p>
      </div>
    </div>
  </>
  );
}

export default PropertyCard;