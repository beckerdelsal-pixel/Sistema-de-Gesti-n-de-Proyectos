import React, { useState, useEffect } from 'react';

export const ProyectosPanel = ({ vistaActual, setVistaActual }) => {
    const [proyectos, setProyectos] = useState([]);
    const [nuevoProyecto, setNuevoProyecto] = useState({ nombre: '', descripcion: '' });
    const [alertMessage, setAlertMessage] = useState({ text: '', type: '' });

    const token = localStorage.getItem('token');
    const userRol = localStorage.getItem('rol');

    useEffect(() => {
        cargarProyectos();
    }, []);

    const cargarProyectos = async () => {
        try {
            const response = await fetch('http://localhost:8085/api/proyectos', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                throw new Error('Error al cargar el catálogo de proyectos');
            }
            const data = await response.json();
            setProyectos(data);
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleCrearProyecto = async (e) => {
        e.preventDefault();
        setAlertMessage({ text: '', type: '' });

        
        try {
            

            const response = await fetch('http://localhost:8085/api/proyectos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
        nombre: nuevoProyecto.nombre, 
        descripcion: nuevoProyecto.descripcion,
        fechaInicio: new Date().toISOString().split('T')[0]
    })
            });

            // ⛔ CAPTURA DEL ERROR 403 FORBIDDEN REQUERIDA EN LA FASE 2.2
            if (response.status === 403) {
                setAlertMessage({ 
                    text: '⛔ ALERTA DE SEGURIDAD 403 FORBIDDEN: Tu usuario asignado con rol USER no posee autorización en el backend para realizar inserciones.', 
                    type: 'error' 
                });
                return;
            }

            if (response.ok) {
                setAlertMessage({ text: '🎉 Proyecto insertado y sincronizado con éxito.', type: 'success' });
                setNuevoProyecto({ nombre: '', descripcion: '' });
                cargarProyectos(); 
            }else {
                const errorData = await response.text();
            console.error("Detalle del error del servidor:", errorData);
            setAlertMessage({ text: 'Error 400: Revisa los campos enviados.', type: 'error' });
        }
        } catch (err) {
            setAlertMessage({ text: 'Fallo crítico en la comunicación asíncrona.', type: 'error' });
        }
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
            
            {/* Alerta Visual Requerida */}
            {alertMessage.text && (
                <div style={{ 
                    padding: '15px', 
                    marginBottom: '25px', 
                    borderRadius: '6px', 
                    backgroundColor: alertMessage.type === 'error' ? '#f8d7da' : '#d4edda', 
                    color: alertMessage.type === 'error' ? '#721c24' : '#155724',
                    border: `1px solid ${alertMessage.type === 'error' ? '#f5c6cb' : '#c3e6cb'}`,
                    fontWeight: 'bold'
                }}>
                    {alertMessage.text}
                </div>
            )}

            {/* Simulación del examen: Botón trampa para que el USER fuerce la vista y pruebe el 403 */}
            {userRol === 'USER' && (
                <div style={{ marginBottom: '20px', backgroundColor: '#fff3cd', padding: '12px', borderRadius: '5px', border: '1px solid #ffeeba' }}>
                    <p style={{ margin: '0 0 10px 0', color: '#856404', fontSize: '14px' }}><strong>Modo Simulación de Ataque/Burlar Frontend:</strong> Como eres USER, el Navbar oculta el botón. Presiona aquí para forzar la exposición del formulario protegido y evaluar el backend:</p>
                    <button onClick={() => setVistaActual(vistaActual === 'gestionar' ? 'ver' : 'gestionar')} style={{ backgroundColor: '#856404', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                        {vistaActual === 'gestionar' ? 'Ocultar Formulario Forzado' : 'Exponer Formulario Protegido'}
                    </button>
                </div>
            )}

            {/* Formulario de registro seguro (Solo ADMIN o si se fuerza la vista) */}
            {(vistaActual === 'gestionar') && (
                <div style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '8px', marginBottom: '30px', backgroundColor: '#f8fafc' }}>
                    <h3 style={{ marginTop: 0, color: '#1e293b' }}>Registrar Nuevo Proyecto (Área Protegida)</h3>
                    <form onSubmit={handleCrearProyecto} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1', minWidth: '200px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Nombre del Proyecto:</label>
                            <input type="text" value={nuevoProyecto.nombre} onChange={(e) => setNuevoProyecto({...nuevoProyecto, nombre: e.target.value})} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ flex: '2', minWidth: '300px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Descripción Detallada:</label>
                            <input type="text" value={nuevoProyecto.descripcion} onChange={(e) => setNuevoProyecto({...nuevoProyecto, descripcion: e.target.value})} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                        </div>
                        <button type="submit" style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', height: '36px' }}>
                            Guardar Cambios
                        </button>
                    </form>
                </div>
            )}

            {/* Vista condicional para la pestaña de crear tareas adicionales */}
            {vistaActual === 'tareas' && (
                <div style={{ padding: '20px', border: '1px solid #bee3f8', backgroundColor: '#ebf8ff', borderRadius: '6px', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0, color: '#2b6cb0' }}>Módulo de Tareas Exclusivo para Administradores</h3>
                    <p style={{ fontSize: '14px', color: '#2c5282' }}>Interfaz de creación de tareas asíncronas enlazada al rol ADMIN de manera exitosa.</p>
                </div>
            )}

            {/* Tabla estructurada y responsiva de datos */}
            <h3 style={{ color: '#1e293b' }}>Catálogo de Proyectos Existentes (GET /api/proyectos)</h3>
            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#3b82f6', color: 'white' }}>
                            <th style={{ padding: '12px 15px', borderBottom: '1px solid #e2e8f0' }}>ID</th>
                            <th style={{ padding: '12px 15px', borderBottom: '1px solid #e2e8f0' }}>Nombre del Proyecto</th>
                            <th style={{ padding: '12px 15px', borderBottom: '1px solid #e2e8f0' }}>Descripción del Catálogo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proyectos.length === 0 ? (
                            <tr>
                                <td colSpan="3" style={{ padding: '15px', textAlign: 'center', color: '#64748b' }}>Cargando catálogo seguro o no hay registros...</td>
                            </tr>
                        ) : (
                            proyectos.map((p) => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                                    <td style={{ padding: '12px 15px', fontWeight: 'bold', color: '#475569' }}>{p.id}</td>
                                    <td style={{ padding: '12px 15px', color: '#334155' }}>{p.nombre}</td>
                                    <td style={{ padding: '12px 15px', color: '#64748b' }}>{p.descripcion}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};