// Endereço da API.
// - Celular com Expo Go (mesmo Wi-Fi do PC): http://SEU_IP:8080 (descubra com "ipconfig", campo IPv4)
export const API_URL = "http://192.168.0.117:8080";

// Emulador Android Studio:
// export const API_URL = "http://10.0.2.2:8080";

//_initialized imagens fixas (chumbadas no código):
// Banner da tela Início e banner da tela Treinos. As demais imagens do app
// vêm do banco (imagemUrl de cada exercício/treino, editáveis pela API).
export const HERO_HOME =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=75&sat=-100";

export const HERO_TREINOS =
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=75&sat=-100";

export const cores = {
  fundo: "#0B0C09",
  card: "#151610",
  card2: "#1D1E15",
  texto: "#FFFFFF",
  cinza: "#8F9080",
  borda: "#24261B",
  lima: "#C9F24D",
  limaSuave: "#E9FFB0",
  preto: "#0B0C09",
};

export const fonte = {
  micro: 10,
  pequena: 12,
  normal: 14,
  titulo: 18,
  grande: 26,
  display: 34,
};
