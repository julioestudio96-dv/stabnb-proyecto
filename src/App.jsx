import { Routes, Route } from "react-router-dom";
import React, { useState} from "react";
import { Link } from "react-router-dom";
import Intro from "./pages/Intro";
import Home from "./pages/Home";
import PropertyDetails from "./pages/PropertyDetails";
import Booking from "./pages/Booking";
import BecomeHost from "./pages/BecomeHost";
import Success from "./pages/Success";
import HostSuccess from "./pages/Hostsuccess";
import MyBookings from "./pages/MyBookings";

export default function App() {

  //nube donde guardamos datos de SEARCHBAR
  const [datosBusqueda, setDatosBusqueda] = useState({
    donde: "",
    llegada: "",
    salida: "",
    huespedes: 1,
  });

  //funcion calcular n de noche
  const calcularNoches = () => {
    if (!datosBusqueda.llegada || !datosBusqueda.salida) return 1;
    const inincio = new Date(datosBusqueda.llegada);
    const fin = new Date(datosBusqueda.salida);
    const diferencia = fin - inincio;
    const dias = diferencia / (1000 * 60 * 60 * 24);
    return dias > 0 ? dias : 1; //si elige fechas locas minimo 1 noche, 
  }

  const noches = calcularNoches();


  return (
    <Routes>
      {/* RUTA DE SEGURIDAD: Por si el usuario escribe una URL que no existe */}
      <Route path="*" element={<div className="text-center py-20">Página no encontrada</div>} />

      {/* PRIMERA PANTALLA */}
      <Route path="/" element={<Intro/>} />

      {/* PAGINA PRINCIPAL */}
      <Route path="/home" element={
        <Home
        datosBusqueda={datosBusqueda}
        setDatosBusqueda={setDatosBusqueda}
        />} />

      {/* DETALLES DE PROPIEDAD */}
      <Route path="/property-details/:id" element={
        <PropertyDetails
        noches={noches}
        datosBusqueda={datosBusqueda}
        />} />

      {/* PAGINA DE RESERVA */}
      <Route path="/booking" element={
        <Booking
        noches={noches}
        datosBusqueda={datosBusqueda}
        />} />

      {/* PAGINA DE ANFITRION */}
      <Route path="/becomehost" element={<BecomeHost/>} />


      <Route path="/booking/:id" element={
        <Booking 
        noches={noches}
        datosBusqueda={datosBusqueda}
        />} />

      <Route path="/success/:id" element={<Success />} />

      <Route path="/host-success" element={<HostSuccess />} />

      <Route path="/my-bookings" element={<MyBookings />} />.
      
    </Routes>
  );
}


