package com.krakedev.proyectos.services;

import org.springframework.stereotype.Service;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistService {
	private final Set<String> blacklist = ConcurrentHashMap.newKeySet();

    public void agregarAListaNegra(String token) {
        blacklist.add(token);
    }

    public boolean isTokenEnListaNegra(String token) {
        return blacklist.contains(token);
    }
}
