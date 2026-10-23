package com.treinoapp.api.controller;

import com.treinoapp.api.model.Exercicio;
import com.treinoapp.api.model.Treino;
import com.treinoapp.api.repository.ExercicioRepository;
import com.treinoapp.api.repository.TreinoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/treinos")
public class TreinoController {

    private final TreinoRepository treinoRepository;
    private final ExercicioRepository exercicioRepository;

    public TreinoController(TreinoRepository treinoRepository, ExercicioRepository exercicioRepository) {
        this.treinoRepository = treinoRepository;
        this.exercicioRepository = exercicioRepository;
    }

    @GetMapping
    public List<Treino> listarTodos() {
        return treinoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Treino> buscarPorId(@PathVariable Long id) {
        return treinoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Treino> criar(@RequestBody Treino treino) {
        treino.setId(null);
        treino.getExercicios().forEach(exercicio -> exercicio.setTreino(treino));
        Treino salvo = treinoRepository.save(treino);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PostMapping("/{id}/exercicios")
    public ResponseEntity<Exercicio> adicionarExercicio(@PathVariable Long id,
                                                        @RequestBody Exercicio exercicio) {
        return treinoRepository.findById(id)
                .map(treino -> {
                    exercicio.setId(null);
                    exercicio.setTreino(treino);
                    Exercicio salvo = exercicioRepository.save(exercicio);
                    return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Treino> atualizar(@PathVariable Long id, @RequestBody Treino treino) {
        return treinoRepository.findById(id)
                .map(existente -> {
                    existente.setNome(treino.getNome());
                    existente.setDescricao(treino.getDescricao());
                    existente.setDia(treino.getDia());
                    Treino atualizado = treinoRepository.save(existente);
                    return ResponseEntity.ok(atualizado);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (!treinoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        treinoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
