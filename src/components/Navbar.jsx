import React, { useEffect, useState } from "react";
import Staylogo from "../assets/Staylogo.png";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const dropMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const sessionUser = session?.user || null;
      setUser(sessionUser);
      if (sessionUser) {
        syncProfile(sessionUser);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const sessionUser = session?.user || null;
      setUser(sessionUser);
      if (event === "SIGNED_IN" && sessionUser) {
        syncProfile(sessionUser);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/home',
      },
    });
    if (error) console.log('Error al iniciar sesión con Google:', error.message);
  }

  const handleProtectedAction = (path) => {
    setIsOpen(false);
    if (user) {
      navigate(path);
    } else {
      alert("¡Hola! Debes iniciar sesión para acceder a esta sección.");
      loginWithGoogle();
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    navigate("/home");
  }

  const syncProfile = async (user) => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        id: user.id, 
        email_pro: user.email,
        nombre_pro: user.user_metadata?.full_name || 'Usuario Colombia'
      }, { onConflict: 'id' });

    if (error) console.error("Error sincronizando perfil:", error.message);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="flex justify-between items-center px-4 md:px-8 py-4">
        {/* LOGO */}
        <Link to="/home">
          <img src={Staylogo} alt="Logo" className="h-10 md:h-20 w-auto object-contain cursor-pointer" />
        </Link>

        {/* MENU DERECHO */}
        <div className="flex items-center gap-4 relative">
          
          <button 
            onClick={() => handleProtectedAction("/becomehost")}
            className="font-medium hover:bg-gray-100 px-4 py-2 rounded-full transition cursor-pointer hidden md:block"
          >
            Conviértete en anfitrión
          </button>

          <div className="flex items-center gap-2 border rounded-full p-2 cursor-pointer hover:shadow-md transition" onClick={dropMenu}>
            <span className="ml-1 text-gray-600">☰</span>
            <span className="text-xl">{user ? "✅" : "👤"}</span>
          </div>

          {/* DROPDOWN UNIFICADO */}
          {isOpen && (
            <div className="absolute top-14 right-0 w-64 bg-white shadow-2xl border border-gray-100 rounded-2xl py-3 z-50">
              <div className="flex flex-col">
                
                {/* ESTADO DE CUENTA */}
                {!user ? (
                  <button onClick={loginWithGoogle} className="text-left px-5 py-3 hover:bg-gray-50 font-bold text-sm flex items-center gap-3 cursor-pointer">
                    <span>🔑</span> Iniciar sesión
                  </button>
                ) : (
                  <div className="px-5 py-3 text-[11px] text-gray-400 border-b mb-1">
                    SESIÓN: <span className="text-black font-semibold uppercase">{user.email.split('@')[0]}</span>
                  </div>
                )}

                {/* OPCIONES CON ICONOS UNIFORMES */}
                <button 
                  onClick={() => handleProtectedAction("/my-bookings")}
                  className="w-full text-left px-5 py-3 hover:bg-gray-50 text-sm transition flex items-center gap-3 cursor-pointer"
                >
                  <span className="text-lg">📅</span> Mis reservas
                </button>

                <button 
                  onClick={() => handleProtectedAction("/myposts")} // <-- Cambia esto también
                  className="w-full text-left px-5 py-3 hover:bg-gray-50 text-sm transition flex items-center gap-3 cursor-pointer"
                >
                  <span className="text-lg">🏠</span> Mis publicaciones
                </button>

                <button 
                  onClick={() => handleProtectedAction("/becomehost")}
                  className="w-full text-left px-5 py-3 hover:bg-gray-50 text-sm transition flex items-center gap-3 cursor-pointer"
                >
                  <span className="text-lg">✨</span> Pon tu espacio en Staybnb
                </button>

                <hr className=" border-gray-100" />

                <button className="text-left px-5 py-3 hover:bg-gray-50 text-sm transition flex items-center gap-3 cursor-pointer">
                  <span className="text-lg">🎧</span> Centro de ayuda
                </button>

                {user && (
                  <button 
                    onClick={logout} 
                    className="text-left px-5 py-3 hover:bg-red-50 text-sm text-red-500 font-bold border-t mt-1 flex items-center gap-3 cursor-pointer"
                  >
                    <span>🚪</span> Cerrar sesión
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;