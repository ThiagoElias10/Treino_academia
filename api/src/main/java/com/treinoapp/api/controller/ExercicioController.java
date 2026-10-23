package com.treinoapp.api.controller;

import com.treinoapp.api.model.Exercicio;
import com.treinoapp.api.repository.ExercicioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exercicios")
public class ExercicioController {

    private final ExercicioRepository exercicioRepository;

    public ExercicioController(ExercicioRepository exercicioRepository) {
        this.exercicioRepository = exercicioRepository;
    }

    @GetMapping
    public List<Exercicio> listarTodos() {
        return exercicioRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exercicio> buscarPorId(@PathVariable Long id) {
        return exercicioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exercicio> atualizar(@PathVariable Long id, @RequestBody Exercicio exercicio) {
        return exercicioRepository.findById(id)
                .map(existente -> {
                    existente.setNome(exercicio.getNome());
                    existente.setSeries(exercicio.getSeries());
                    existente.setRepeticoes(exercicio.getRepeticoes());
                    existente.setCarga(exercicio.getCarga());
                    existente.setGrupoMuscular(exercicio.getGrupoMuscular());
                    existente.setObservacao(exercicio.getObservacao());
                    if (exercicio.getImagemUrl() != null) {
                        existente.setImagemUrl(exercicio.getImagemUrl());
                    }
                    Exercicio atualizado = exercicioRepository.save(existente);
                    return ResponseEntity.ok(atualizado);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/imagem")
    public ResponseEntity<Exercicio> atualizarImagem(@PathVariable Long id,
                                                     @RequestBody Map<String, String> body) {
        String novaUrl = body.get("imagemUrl");
        if (novaUrl == null) {
            return ResponseEntity.badRequest().build();
        }
        return exercicioRepository.findById(id)
                .map(existente -> {
                    existente.setImagemUrl(novaUrl);
                    return ResponseEntity.ok(exercicioRepository.save(existente));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (!exercicioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        exercicioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
