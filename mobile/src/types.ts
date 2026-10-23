export interface Exercicio {
  id: number;
  treinoId?: number;
  nome: string;
  series: number;
  repeticoes: number;
  carga?: string | null;
  grupoMuscular?: string | null;
  observacao?: string | null;
  imagemUrl?: string | null;
}

export interface Treino {
  id: number;
  nome: string;
  descricao?: string | null;
  dia?: string | null;
  exercicios: Exercicio[];
}
