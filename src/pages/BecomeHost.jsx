import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { supabase } from "../supabaseClient"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BecomeHost = () => {
    const navigate = useNavigate();

    // Estado inicial del formulario para alojamientos en Colombia
    const [formData, setFormData] = useState({
        title: "",
        location: "",
        price: "",
        description: "",
        image_url: "",
        rating: 5.0,
        gallery: ["", "", "", ""],
    });

    // Actualiza el estado al escribir en los inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Maneja las URLs de la galería adicional
    const handleGalleryChange = (index, value) => {
        const newGallery = [...formData.gallery];
        newGallery[index] = value;
        setFormData({ ...formData, gallery: newGallery });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Obtenemos el usuario autenticado
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError || !user) {
                alert("Debes iniciar sesión para publicar tu propiedad en Colombia.");
                return;
            }

            // Inserción en 'properties_host' usando host_id para vincular al usuario
            const { data: propertyData, error: propError } = await supabase
                .from("properties_host") 
                .insert([
                    {
                        title: formData.title,
                        location: formData.location,
                        price: parseFloat(formData.price),
                        description: formData.description,
                        image_url: formData.image_url,
                        rating: formData.rating,
                        user_id: user.id, // Vinculación correcta para Mis Publicaciones
                    },
                ])
                .select();

            if (propError) throw propError;

            const propertyId = propertyData[0].id;

            // Guardar fotos de la galería si existen
            const validGallery = formData.gallery.filter((url) => url.trim() !== "");

            if (validGallery.length > 0) {
                const galleryRows = validGallery.map((url) => ({
                    property_id: propertyId,
                    url: url,
                }));

                const { error: galleryError } = await supabase
                    .from("property_images") 
                    .insert(galleryRows);

                if (galleryError) {
                    console.warn("Propiedad creada, pero error en galería:", galleryError.message);
                }
            }

            // Redirección tras éxito
            navigate("/host-success");
        } catch (error) {
            console.error("Error detallado:", error);
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
                                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase">Precio (COP/USD)</label>
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
                            className="w-full bg-rose-500 text-white py-5 rounded-2xl font-bold text-xl hover:bg-rose-600 shadow-lg"
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