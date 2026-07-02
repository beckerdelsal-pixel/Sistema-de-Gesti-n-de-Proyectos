package com.krakedev.proyectos.services;

import com.krakedev.proyectos.entidades.Usuario;
import com.krakedev.proyectos.repositories.UsuarioRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UsuarioService {
	@Autowired
    private UsuarioRepository usuarioRepository;

    // Registrar usuario aplicando hash unidireccional
    public Usuario registrarUsuario(Usuario usuario) {
        // Encriptar la contraseña antes de guardarla en la BD
        String hashedPassword = BCrypt.hashpw(usuario.getPassword(), BCrypt.gensalt());
        usuario.setPassword(hashedPassword);
        return usuarioRepository.save(usuario);
    }

    // Lógica segura de autenticación/Login
    public Optional<Usuario> autenticar(String username, String password) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(username);
        
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // Validar de forma segura la contraseña usando BCrypt
            if (BCrypt.checkpw(password, usuario.getPassword())) {
                return Optional.of(usuario);
            }
        }
        return Optional.empty();
    }
}
