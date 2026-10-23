import { API_URL } from "./config";
import { Exercicio, Treino } from "./types";

async function request<T>(path: string, metodo: string, corpo?: unknown): Promise<T> {
  const resposta = await fetch(`${API_URL}${path}`, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });
  if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status} em ${metodo} ${path}`);
  }
  if (resposta.status === 204) {
    return undefined as T;
  }
  return (await resposta.json()) as T;
}

export const api = {
  listarTreinos: () => request<Treino[]>("/api/treinos", "GET"),
  buscarTreino: (id: number) => request<Treino>(`/api/treinos/${id}`, "GET"),
  criarTreino: (treino: Partial<Treino>) => request<Treino>("/api/treinos", "POST", treino),
  atualizarTreino: (id: number, treino: Partial<Treino>) =>
    request<Treino>(`/api/treinos/${id}`, "PUT", treino),
  excluirTreino: (id: number) => request<void>(`/api/treinos/${id}`, "DELETE"),

  criarExercicio: (treinoId: number, exercicio: Partial<Exercicio>) =>
    request<Exercicio>(`/api/treinos/${treinoId}/exercicios`, "POST", exercicio),
  atualizarExercicio: (exercicioId: number, exercicio: Partial<Exercicio>) =>
    request<Exercicio>(`/api/exercicios/${exercicioId}`, "PUT", exercicio),
  atualizarImagem: (exercicioId: number, imagemUrl: string) =>
    request<Exercicio>(`/api/exercicios/${exercicioId}/imagem`, "PATCH", { imagemUrl }),
  excluirExercicio: (id: number) => request<void>(`/api/exercicios/${id}`, "DELETE"),
};
