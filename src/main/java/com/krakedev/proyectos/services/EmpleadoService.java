package com.krakedev.proyectos.services;

import com.krakedev.proyectos.entidades.Empleado;
import com.krakedev.proyectos.repositories.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EmpleadoService {
	@Autowired
    private EmpleadoRepository empleadoRepository;

    public Empleado guardar(Empleado empleado) {
        return empleadoRepository.save(empleado);
    }

    public List<Empleado> obtenerTodos() {
        return empleadoRepository.findAll();
    }

    public Optional<Empleado> obtenerPorId(int id) {
        return empleadoRepository.findById(id);
    }

    public Empleado actualizar(int id, Empleado empleadoDetalles) {
        return empleadoRepository.findById(id).map(empleado -> {
            empleado.setNombre(empleadoDetalles.getNombre());
            empleado.setCargo(empleadoDetalles.getCargo());
            return empleadoRepository.save(empleado);
        }).orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + id));
    }

    public void eliminar(int id) {
        if (empleadoRepository.existsById(id)) {
            empleadoRepository.deleteById(id);
        } else {
            throw new RuntimeException("Empleado no encontrado con ID: " + id);
        }
    }
}
