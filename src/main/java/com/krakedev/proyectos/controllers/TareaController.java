package com.krakedev.proyectos.controllers;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.krakedev.proyectos.entidades.Tarea;
import com.krakedev.proyectos.services.TareaService;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(
    origins = "http://localhost:5173", 
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE},
    allowedHeaders = {"Authorization", "Content-Type"}
)
public class TareaController {
	@Autowired
    private TareaService tareaService;

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')") 
	public ResponseEntity<?> crearTarea(@RequestBody Tarea tarea) {
	    try {
	        String prio = tarea.getPrioridad();
	        
	       
	        if (prio == null || (!prio.equals("ALTA") && !prio.equals("MEDIA") && !prio.equals("BAJA"))) {
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                    .body(Map.of(
	                        "status", 400,
	                        "error", "Validación Fallida",
	                        "mensaje", "La prioridad de la tarea es obligatoria y debe ser estrictamente: ALTA, MEDIA o BAJA."
	                    ));
	        }
	        
	        Tarea nuevaTarea = tareaService.guardar(tarea);
	        return new ResponseEntity<>(nuevaTarea, HttpStatus.CREATED);
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(Map.of("error", e.getMessage()));
	    }
	}

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> listarTareas() {
        try {
            List<Tarea> tareas = tareaService.obtenerTodas();
            return new ResponseEntity<>(tareas, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
