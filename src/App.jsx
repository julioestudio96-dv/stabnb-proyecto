import { Routes, Route, Navigate} from "react-router-dom";
import React, { useState, useEffect} from "react";
import { Link } from "react-router-dom";
import Intro from "./pages/Intro";
import Home from "./pages/Home";
import PropertyDetails from "./pages/PropertyDetails";
import Booking from "./pages/Booking";
import BecomeHost from "./pages/BecomeHost";
import Success from "./pages/Success";
import HostSuccess from "./pages/Hostsuccess";
import MyBookings from "./pages/MyBookings";
import MyPosts from "./pages/MyPosts"; // --- IMPORTACIÓN NUEVA PARA GESTIÓN ---
import { supabase } from "./supabaseClient";


export default function App() {
  
  // Función de Estado de session
  const [session, setSession] = useState(null);

  // Nube donde guardamos datos de SEARCHBAR
  const [datosBusqueda, setDatosBusqueda] = useState({
    donde: "",
    llegada: "",
    salida: "",
    huespedes: 1,
  });
  
  // Función para mantener la session activa (escucha login/logout)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Función calcular número de noches para Colombia
  const calcularNoches = () => {
    if (!datosBusqueda.llegada || !datosBusqueda.salida) return 1;
    const inincio = new Date(datosBusqueda.llegada);
    const fin = new Date(datosBusqueda.salida);
    const diferencia = fin - inincio;
    const dias = diferencia / (1000 * 60 * 60 * 24);
    return dias > 0 ? dias : 1; 
  }
  
  const noches = calcularNoches();

  return (
  <Routes>
    {/* --- 1. BIENVENIDA Y EXPLORACIÓN --- */}
    <Route path="/" element={<Intro/>} />
    
    <Route path="/home" element={
      <Home
        datosBusqueda={datosBusqueda}
        setDatosBusqueda={setDatosBusqueda}
      />} 
    />

    {/* --- 2. DETALLES Y RESERVAS --- */}
    <Route path="/property-details/:id" element={
      <PropertyDetails
        noches={noches}
        datosBusqueda={datosBusqueda}
      />} 
    />

    <Route path="/booking" element={
      <Booking
        noches={noches}
        datosBusqueda={datosBusqueda}
      />} 
    />
    
    <Route 
      path="/booking/:id" 
      element={ session ? (
        <Booking noches={noches}
        datosBusqueda={datosBusqueda}/>
      ) : ( 
        <Navigate to="/home" replace />
      )} 
    />

    <Route path="/success/:id" element={<Success />} />

    {/* --- 3. PERFIL, GESTIÓN Y ANFITRIÓN --- */}
    
    {/* Historial de viajes del usuario */}
    <Route path="/my-bookings" element={<MyBookings />} />

    {/* NUEVA RUTA: Gestión de propiedades publicadas por el usuario */}
    {/* Esta ruta debe ser igual a la del Navbar: /my-publications */}
    <Route 
      path="/myposts" // <-- Antes decía /my-publications
      element={ session ? (
        <MyPosts />
      ) : (
        <Navigate to="/home" replace />
      )} 
    />

    {/* Formulario para subir casas nuevas */}
    <Route path="/becomehost" element={<BecomeHost/>} />

    {/* Pantalla de éxito tras publicar casa */}
    <Route path="/host-success" element={<HostSuccess />} />

    {/* --- 4. SEGURIDAD --- */}
    <Route path="*" element={
      <div className="text-center py-20">
        <h1 className="text-4xl font-black text-rose-500">404</h1>
        <p className="text-gray-500">Página no encontrada en Colombia</p>
        <Link to="/home" className="text-blue-500 underline mt-4 block">Volver al inicio</Link>
      </div>
    } />
    
  </Routes>
  );
}