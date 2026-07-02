import React from 'react';

export const Navbar = ({ rol, onLogout, setVistaActual, vistaActual }) => {
    
    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        try {
            // Envío de la solicitud HTTP adjuntando el token Bearer en cabeceras
            await fetch('http://localhost:8085/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error al notificar la destrucción del token en el backend', error);
        } finally {
            // Limpieza absoluta de localStorage tras presionar Logout
            localStorage.clear();
            onLogout();
        }
    };

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', backgroundColor: '#2c3e50', color: 'white', alignItems: 'center', fontFamily: 'sans-serif' }}>
            <h3 style={{ margin: 0, color: '#ecf0f1' }}>Sistema Académico</h3>
            
            {/* Renderizado Condicional por Rol */}
            <div style={{ display: 'flex', gap: '15px' }}>
                <button 
                    onClick={() => setVistaActual('ver')} 
                    style={{ background: 'none', color: vistaActual === 'ver' ? '#3498db' : 'white', border: 'none', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    Ver Proyectos
                </button>
                
                {/* Accesos exclusivos para el rol ADMIN */}
                {rol === 'ADMIN' && (
                    <>
                        <button 
                            onClick={() => setVistaActual('gestionar')} 
                            style={{ background: 'none', color: vistaActual === 'gestionar' ? '#3498db' : 'white', border: 'none', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            Gestionar Proyectos
                        </button>
                        <button 
                            onClick={() => setVistaActual('tareas')} 
                            style={{ background: 'none', color: vistaActual === 'tareas' ? '#3498db' : 'white', border: 'none', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            Crear Tareas
                        </button>
                    </>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '14px', color: '#bdc3c7' }}>Rol Activo: <strong style={{ color: '#f1c40f' }}>{rol}</strong></span>
                <button onClick={handleLogout} style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Cerrar Sesión
                </button>
            </div>
        </nav>
    );
};