import React, { useState } from 'react';

export const Login = ({ onLoginSuccess }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Despacho asíncrono solicitado a /api/auth/login
            const response = await fetch('http://localhost:8085/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            if (!response.ok) {
                throw new Error('Credenciales inválidas o error de conexión');
            }

            const data = await response.json();
            
            // Persistencia Local de Sesión requerida en el Examen
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('rol', data.rol);

            // Notifica al componente raíz el éxito del login
            onLoginSuccess(data.rol);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '80px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)', fontFamily: 'sans-serif' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Iniciar Sesión</h2>
            {error && <div style={{ color: 'red', backgroundColor: '#fde8e8', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Usuario:</label>
                    <input type="text" name="username" value={credentials.username} onChange={handleChange} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Contraseña:</label>
                    <input type="password" name="password" value={credentials.password} onChange={handleChange} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
                </div>
                <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Ingresar al Sistema
                </button>
            </form>
        </div>
    );
};