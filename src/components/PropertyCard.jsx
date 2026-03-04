import React from "react";
import { Link } from "react-router-dom";

function PropertyCard({info}) {  //<-- Aqui vamos a recibir la info de cada propiedad como props, para mostrarla en el card -->


  return (
    <>
      <div className="cursor-pointer group">
        <Link to={`/property-details/${info.id}`}>
          <img
            src={info.image_url}
            className="w-full h-64 object-cover rounded-xl group-hover:scale-105 transition"
            alt={info.title}
          />
        </Link>

        <div className="mt-2">
          <div className="flex justify-between">
            <h3 className="font-semibold text-base truncate">{info.title}</h3>
            <span className="text-sm">⭐ {info.rating}</span>
          </div>

          {/* LÍNEA AGREGADA: UBICACIÓN */}
          <p className="text-gray-500 text-sm flex items-center gap-1">
            <span>📍</span> {info.location}
            </p> 

          <p className="text-gray-400 text-xs">Publicado recientemente</p>

          <p className="mt-1">
            <span className="font-semibold">${info.price.toLocaleString()}</span> noche
          </p>
      </div>
      </div>
    </>
  );
}

export default PropertyCard;
