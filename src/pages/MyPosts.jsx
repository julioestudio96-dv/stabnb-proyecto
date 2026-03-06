import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const MyPosts = () => {
    const [myProperties, setMyProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
        setLoading(true);
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
            const { data, error } = await supabase
            .from("properties_host")
            .select("*")
            .eq("user_id", session.user.id)
            .order("created_at", { ascending: false });

            if (error) {
            console.error("Error:", error.message);
            } else {
            setMyProperties(data || []);
            }
        }
        setLoading(false);
        };

        fetchPosts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("¿Eliminar esta publicación permanentemente?")) {
        const { error } = await supabase
            .from("properties_host")
            .delete()
            .eq("id", id);

        if (!error) {
            setMyProperties(myProperties.filter((p) => p.id !== id));
        }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />

        <main className="row max-w-7xl mx-auto px-4 py-10 w-full">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 px-3">
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
                Mis Publicaciones
                </h1>
                <p className="text-gray-500 font-medium">
                Panel de administración de tus propiedades en Colombia.
                </p>
            </div>
            </div>

            {loading ? (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500"></div>
            </div>
            ) : myProperties.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
                {myProperties.map((prop) => (
                <div
                    key={prop.id}
                    className="bg-white border border-gray-100 rounded-3xl p-5 flex flex-col md:flex-row gap-6 items-center shadow-sm"
                >
                    <img
                    src={prop.image_url}
                    className="w-full md:w-56 h-40 object-cover rounded-2xl"
                    alt="Propiedad"
                    />

                    <div className="grow">
                    <span className="text-[10px] font-black bg-green-100 text-green-700 px-2 py-1 rounded uppercase tracking-widest">
                        Publicado
                    </span>
                    <h2 className="text-2xl font-bold text-gray-800 mt-2">
                        {prop.title}
                    </h2>
                    <p className="text-gray-500 text-sm italic">
                        📍 {prop.location}, Colombia
                    </p>
                    <p className="mt-3 text-xl font-black text-gray-900">
                        ${prop.price}{" "}
                        <span className="text-sm font-normal text-gray-400">
                        / noche
                        </span>
                    </p>
                    </div>

                    <div className="flex md:flex-col gap-2 w-full md:w-auto">
                    <Link
                        to={`/property-details/${prop.id}`}
                        className="flex-1 text-center px-6 py-2 bg-gray-100 rounded-xl text-sm font-bold hover:bg-gray-200 transition"
                    >
                        Ver
                    </Link>
                    <button
                        onClick={() => handleDelete(prop.id)}
                        className="flex-1 text-center px-6 py-2 text-red-500 text-sm font-bold hover:bg-red-50 rounded-xl transition"
                    >
                        Eliminar
                    </button>
                    </div>
                </div>
                ))}
            </div>
            ) : (
            <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-medium text-lg">
                Aún no has publicado nada.
                </p>
                <Link
                to="/becomehost"
                className="text-rose-500 font-black text-xl hover:underline mt-2 inline-block"
                >
                ¡Empieza ahora!
                </Link>
            </div>
            )}
        </main>

        <Footer />
        </div>
    );
    };

export default MyPosts;
