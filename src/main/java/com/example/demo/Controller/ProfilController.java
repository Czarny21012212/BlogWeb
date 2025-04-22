package com.example.demo.Controller;

import com.example.demo.Service.ProfilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProfilController {
    private final ProfilService profilService;

    @Autowired
    public ProfilController(ProfilService profilService) {
        this.profilService = profilService;
    }


}
