import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Navbar } from './components/Navbar';
import { ProyectosPanel } from './components/ProyectosPanel';

function App() {
    const [rol, setRol] = useState(null);
    const [vistaActual, setVistaActual] = useState('ver'); // Controla pestañas: 'ver', 'gestionar', 'tareas'

    useEffect(() => {
        // Al arrancar, verifica si hay sesión previa persistida localmente
        const savedRol = localStorage.getItem('rol');
        const savedToken = localStorage.getItem('token');
        if (savedRol && savedToken) {
            setRol(savedRol);
        }
    }, []);

    // Si no está autenticado, renderiza de forma estricta la interfaz de acceso
    if (!rol) {
        return <Login onLoginSuccess={(userRol) => setRol(userRol)} />;
    }

    // Si ya inició sesión con éxito, renderiza el ecosistema operacional
    return (
        <div>
            <Navbar rol={rol} vistaActual={vistaActual} setVistaActual={setVistaActual} onLogout={() => setRol(null)} />
            <ProyectosPanel vistaActual={vistaActual} setVistaActual={setVistaActual} />
        </div>
    );
}

export default App;