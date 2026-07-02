package com.krakedev.proyectos.services;

import java.util.List;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;


import com.krakedev.proyectos.entidades.Proyecto;
import com.krakedev.proyectos.repositories.ProyectoRepository;

@Service
public class ProyectoService {
	@Autowired
    private ProyectoRepository proyectoRepository;

    public Proyecto guardar(Proyecto proyecto) {
        return proyectoRepository.save(proyecto);
    }

    public List<Proyecto> obtenerTodos() {
        return proyectoRepository.findAll();
    }

    public Optional<Proyecto> obtenerPorId(int id) {
        return proyectoRepository.findById(id);
    }

    public Proyecto actualizar(int id, Proyecto proyectoDetalles) {
        return proyectoRepository.findById(id).map(proyecto -> {
            proyecto.setNombre(proyectoDetalles.getNombre());
            proyecto.setDescripcion(proyectoDetalles.getDescripcion());
            proyecto.setFechaInicio(proyectoDetalles.getFechaInicio());
            return proyectoRepository.save(proyecto);
        }).orElseThrow(() -> new RuntimeException("Proyecto no encontrado con ID: " + id));
    }

    public void eliminar(int id) {
        if (proyectoRepository.existsById(id)) {
            proyectoRepository.deleteById(id);
        } else {
            throw new RuntimeException("Proyecto no encontrado con ID: " + id);
        }
    }
    public long contarTotalProyectos() {
        return proyectoRepository.count();
    }
    
   
}
