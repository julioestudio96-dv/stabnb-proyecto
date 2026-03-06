import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { supabase } from "../supabaseClient"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BecomeHost = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        location: "",
        price: "",
        description: "",
        image_url: "",
        rating: 5.0,
        gallery: ["", "", "", ""],
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGalleryChange = (index, value) => {
        const newGallery = [...formData.gallery];
        newGallery[index] = value;
        setFormData({ ...formData, gallery: newGallery });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError || !user) {
                alert("Debes iniciar sesión para publicar en Colombia.");
                return;
            }

            // 1. Filtramos las URLs de la galería que no estén vacías
            const validGallery = formData.gallery.filter((url) => url.trim() !== "");

            // 2. Insertamos TODO en una sola tabla (properties_host)
            // Esto evita el error de la tabla 'property_images' que no existe
            const { error: propError } = await supabase
                .from("properties_host") 
                .insert([
                    {
                        title: formData.title,
                        location: formData.location,
                        price: parseFloat(formData.price),
                        description: formData.description,
                        image_url: formData.image_url,
                        rating: formData.rating,
                        user_id: user.id,
                        gallery: validGallery // <-- Guardamos el array de fotos aquí mismo
                    },
                ]);

            if (propError) throw propError;

            alert("¡Alojamiento publicado con éxito en Colombia! 🇨🇴");
            navigate("/home"); 

        } catch (error) {
            console.error("Error al publicar:", error.message);
            alert("Error al publicar: " + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="grow flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-gray-100">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Publica tu espacio en Colombia
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* INPUTS DE TEXTO */}
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Título</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Ej: Cabaña en el Tayrona"
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Ubicación</label>
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="Ej: Santa Marta"
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Precio (COP)</label>
                                <input
                                    type="number"
                                    name="price"
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Descripción</label>
                            <textarea
                                name="description"
                                rows="3"
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none"
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        {/* SECCIÓN DE FOTOS */}
                        <div className="pt-4 space-y-4">
                            <h3 className="text-sm font-bold text-gray-800 uppercase border-b pb-2">Fotos</h3>
                            <input
                                type="text"
                                name="image_url"
                                placeholder="URL Imagen Principal"
                                className="w-full p-4 bg-rose-50/50 border-2 border-dashed border-rose-100 rounded-2xl outline-none"
                                onChange={handleChange}
                                required
                            />
                            <div className="grid grid-cols-2 gap-3">
                                {formData.gallery.map((url, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        placeholder={`Foto extra ${index + 1}`}
                                        className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs"
                                        value={url}
                                        onChange={(e) => handleGalleryChange(index, e.target.value)}
                                    />
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-rose-500 text-white py-5 rounded-2xl font-bold text-xl hover:bg-rose-600 shadow-lg active:scale-95 transition-all"
                        >
                            Publicar Alojamiento
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BecomeHost;