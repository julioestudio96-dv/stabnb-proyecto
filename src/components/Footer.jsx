import React from 'react'

function Footer() {
return (
    <>
    <footer className="bg-white border-t border-gray-200 mt-10">
    
    <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Columna 1 */}
        <div>
            <h3 className="font-semibold text-gray-800 mb-3">
            Staybnb
            </h3>
            <p className="text-gray-500 text-sm">
            Encuentra alojamientos únicos y experiencias increíbles en todo el mundo.
            </p>
        </div>

        {/* Columna 2 */}
        <div>
            <h3 className="font-semibold text-gray-800 mb-3">
            Soporte
            </h3>

            <ul className="space-y-2 text-sm text-gray-500">
            <li className="hover:text-gray-800 cursor-pointer">
                Centro de ayuda
            </li>
            <li className="hover:text-gray-800 cursor-pointer">
                Información de seguridad
            </li>
            <li className="hover:text-gray-800 cursor-pointer">
                Cancelaciones
            </li>
            </ul>
        </div>

        {/* Columna 3 */}
        <div>
            <h3 className="font-semibold text-gray-800 mb-3">
            Empresa
            </h3>

            <ul className="space-y-2 text-sm text-gray-500">
            <li className="hover:text-gray-800 cursor-pointer">
                Acerca de
            </li>
            <li className="hover:text-gray-800 cursor-pointer">
                Contacto
            </li>
            <li className="hover:text-gray-800 cursor-pointer">
                Términos y condiciones
            </li>
            </ul>
        </div>

        </div>

        {/* Línea inferior */}
        <div className="border-t border-gray-200 mt-8 pt-6 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center">
        
        <p>
            © {new Date().getFullYear()} Staybnb. Todos los derechos reservados.
        </p>

        <div className="flex gap-4 mt-3 md:mt-0">
            <span className="hover:text-gray-600 cursor-pointer">
            Privacidad
            </span>
            <span className="hover:text-gray-600 cursor-pointer">
            Términos
            </span>
            <span className="hover:text-gray-600 cursor-pointer">
            Cookies
            </span>
        </div>

        </div>

    </div>

    </footer>

</>
  )
}
export default Footer
