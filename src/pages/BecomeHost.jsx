import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // IMPORTANTE: Para ir al Success
import { supabase } from "../supabaseClient"; // IMPORTANTE: Para guardar datos en Supabase
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BecomeHost = () => {
const navigate = useNavigate();

// Ajustamos el estado para que coincida con tus tablas
const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
    image_url: "", // Foto principal
    rating: 5.0, // Rating por defecto
    gallery: ["", "", "", ""], // Array para las 4 fotos extras
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
    // 1. Insertar en la tabla 'properties'
    const { data: propertyData, error: propError } = await supabase
        .from("properties")
        .insert([
        {
            title: formData.title,
            location: formData.location,
            price: parseFloat(formData.price),
            description: formData.description,
            image_url: formData.image_url,
            rating: formData.rating,
        },
        ])
        .select(); // Obtenemos los datos insertados para sacar el ID

    if (propError) throw propError;

    const propertyId = propertyData[0].id;

    // 2. Insertar en la tabla 'property_images' (Galería)
    // Filtramos los links que no estén vacíos
    const validGallery = formData.gallery.filter((url) => url.trim() !== "");

    if (validGallery.length > 0) {
        const galleryRows = validGallery.map((url) => ({
        property_id: propertyId,
        url: url,
        }));

        const { error: galleryError } = await supabase
        .from("property_images")
        .insert(galleryRows);

        if (galleryError) throw galleryError;
    }

    // Si todo sale bien, vamos al éxito
    navigate("/host-success");
    } catch (error) {
    console.error("Error publicando:", error.message);
    alert("Hubo un error al publicar: " + error.message);
    }
};
return (
    <>
    <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-gray-100">
            <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Publica tu espacio
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
                Completa los datos para recibir huéspedes
            </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase ml-1">
                Título del anuncio
                </label>
                <input
                type="text"
                name="title" // Coincide con la tabla
                placeholder="Ej: Estudio moderno tipo suite"
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                onChange={handleChange}
                required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase ml-1">
                    Ubicación
                </label>
                <input
                    type="text"
                    name="location"
                    placeholder="Ej: Cali, Colombia"
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase ml-1">
                    Precio por noche ($)
                </label>
                <input
                    type="number"
                    name="price"
                    placeholder="150"
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                    onChange={handleChange}
                    required
                />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase ml-1">
                Descripción Detallada
                </label>
                <textarea
                name="description"
                rows="4"
                placeholder="Cuéntanos sobre los baños, camas, servicios..."
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none transition-all resize-none"
                onChange={handleChange}
                required
                ></textarea>
            </div>

            <div className="pt-4 space-y-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest border-b pb-2">
                Fotos del alojamiento
                </h3>
                <input
                type="text"
                name="image_url" // Foto principal
                placeholder="URL de la Foto Principal"
                className="w-full p-4 bg-rose-50/50 border-2 border-dashed border-rose-100 rounded-2xl focus:border-rose-500 outline-none transition-all text-sm"
                onChange={handleChange}
                required
                />
                <div className="grid grid-cols-2 gap-3">
                {formData.gallery.map((url, index) => (
                    <input
                    key={index}
                    type="text"
                    placeholder={`Foto Galería ${index + 1}`}
                    className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-xs"
                    value={url}
                    onChange={(e) =>
                        handleGalleryChange(index, e.target.value)
                    }
                    />
                ))}
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-rose-500 text-white py-5 rounded-2xl font-bold text-xl hover:bg-rose-600 transition-all active:scale-[0.98] shadow-lg shadow-rose-200 mt-4"
            >
                Publicar Alojamiento
            </button>
            </form>
        </div>
        </main>
        <Footer />
    </div>
    </>
);
};

export default BecomeHost;
