package com.krakedev.proyectos.controllers;

import com.krakedev.proyectos.entidades.Usuario;
import com.krakedev.proyectos.security.JwtUtil;
import com.krakedev.proyectos.services.UsuarioService;
import com.krakedev.proyectos.services.TokenBlacklistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
//import org.springframework.web.bind.annotation.RequestMethod;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
//@CrossOrigin(
  //  origins = "http://localhost:5173", 
    //methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE},
    //allowedHeaders = {"Authorization", "Content-Type"}
//)
public class AuthController {
	@Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private TokenBlacklistService blacklistService;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        try {
            Usuario nuevoUsuario = usuarioService.registrarUsuario(usuario);
            return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
        String username = credenciales.get("username");
        String password = credenciales.get("password");

        Optional<Usuario> usuarioOpt = usuarioService.autenticar(username, password);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // Generación real del token firmado digitalmente con sus claims
            String token = jwtUtil.generarToken(usuario.getUsername(), usuario.getRol());
            
            return ResponseEntity.ok(Map.of(
                "token", token,
                "username", usuario.getUsername(),
                "rol", usuario.getRol()
            ));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales incorrectas"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            // Invalida el token guardándolo en la blacklist
            blacklistService.agregarAListaNegra(token);
            SecurityContextHolder.clearContext();
            return ResponseEntity.ok(Map.of("mensaje", "Sesión cerrada correctamente. Token invalidado."));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Formato de cabecera inválido"));
    }

    // Hito 3.4: Lee la identidad directamente desde el contexto oficial de Spring Security
    @GetMapping("/perfil")
    public ResponseEntity<?> verPerfil() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = principal.toString();
        
        return ResponseEntity.ok(Map.of(
            "username", username,
            "estado", "Autenticado mediante Spring Security Context"
        ));
    }
}
