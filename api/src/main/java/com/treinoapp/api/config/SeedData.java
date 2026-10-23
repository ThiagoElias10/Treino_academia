package com.treinoapp.api.config;

import com.treinoapp.api.model.Exercicio;
import com.treinoapp.api.model.Treino;
import com.treinoapp.api.repository.TreinoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SeedData {

    @Bean
    public CommandLineRunner criarTreinosDeExemplo(TreinoRepository treinoRepository) {
        return args -> {
            if (treinoRepository.count() > 0) {
                return;
            }

            Treino superioresA = criarTreino(
                    "Superiores A",
                    "Segunda-feira • 07:00",
                    "Objetivo: Hipertrofia. Descanse 1 min entre cada série.");
            adicionar(superioresA, "Supino Reto com Barra", 4, 10, "20kg", "Peito");
            adicionar(superioresA, "Desenvolvimento com Halteres", 4, 10, "12kg", "Ombros");
            adicionar(superioresA, "Triceps Corda na Polia", 4, 12, "15kg", "Triceps");
            adicionar(superioresA, "Rosca 45 com Halteres", 3, 12, "10kg", "Biceps");
            adicionar(superioresA, "Elevação Lateral", 4, 12, "8kg", "Ombros");

            Treino inferioresA = criarTreino(
                    "Inferiores A",
                    "Terça-feira • 07:00",
                    "Objetivo: Hipertrofia. Descanse 1min30 entre as séries basais.");
            adicionar(inferioresA, "Agachamento Livre", 4, 12, "30kg", "Pernas");
            adicionar(inferioresA, "Leg Press 45", 4, 12, "60kg", "Pernas");
            adicionar(inferioresA, "Mesa Flexora", 4, 12, "30kg", "Posterior");
            adicionar(inferioresA, "Panturrilha Em Pé", 4, 15, "40kg", "Panturrilha");

            Treino superioresB = criarTreino(
                    "Superiores B",
                    "Quinta-feira • 07:00",
                    "Objetivo: Costas e biceps. Use o esquema 10-10-8-6 nas séries principais.");
            adicionar(superioresB, "Puxada Frontal", 4, 10, "35kg", "Costas");
            adicionar(superioresB, "Remada Curvada", 4, 10, "25kg", "Costas");
            adicionar(superioresB, "Rosca Direta", 4, 12, "12kg", "Biceps");
            adicionar(superioresB, "Biceps Alternado", 3, 12, "10kg", "Biceps");

            Treino inferioresB = criarTreino(
                    "Inferiores B",
                    "Sexta-feira • 07:00",
                    "Objetivo: Posterior e quadriceps. Descanse 1 min entre as séries.");
            adicionar(inferioresB, "Terra nos Ombros (Stiff)", 4, 10, "30kg", "Posterior");
            adicionar(inferioresB, "Extensora", 4, 12, "40kg", "Quadriceps");
            adicionar(inferioresB, "Afundo com Halteres", 4, 12, "10kg", "Pernas");
            adicionar(inferioresB, "Panturrilha Sentado", 4, 15, "60kg", "Panturrilha");

            treinoRepository.saveAll(List.of(superioresA, inferioresA, superioresB, inferioresB));
        };
    }

    private Treino criarTreino(String nome, String dia, String descricao) {
        Treino treino = new Treino();
        treino.setNome(nome);
        treino.setDia(dia);
        treino.setDescricao(descricao);
        return treino;
    }

    private void adicionar(Treino treino, String nome, int series, int repeticoes,
                           String carga, String grupoMuscular) {
        Exercicio exercicio = new Exercicio();
        exercicio.setNome(nome);
        exercicio.setSeries(series);
        exercicio.setRepeticoes(repeticoes);
        exercicio.setCarga(carga);
        exercicio.setGrupoMuscular(grupoMuscular);
        exercicio.setTreino(treino);
        treino.getExercicios().add(exercicio);
    }
}
