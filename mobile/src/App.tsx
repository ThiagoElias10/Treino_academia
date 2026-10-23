import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { api } from "./api";
import { cores } from "./config";
import { Treino } from "./types";
import DetalheTreino from "./screens/DetalheTreino";
import Inicio from "./screens/Inicio";
import Treinos from "./screens/Treinos";
import TopBar from "./components/TopBar";

export default function App() {
  const [tela, setTela] = useState<"inicio" | "treinos">("inicio");
  const [treinoAberto, setTreinoAberto] = useState<Treino | null>(null);
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [carregando, setCarreando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    try {
      setErro(null);
      setTreinos(await api.listarTreinos());
    } catch {
      setErro("Sem conexão com a API. Verifique o API_URL em src/config.ts");
    } finally {
      setCarreando(false);
    }
  }, []);

  useEffect(() => {
    void recarregar();
  }, [recarregar]);

  if (treinoAberto) {
    return (
      <DetalheTreino
        treino={treinoAberto}
        onVoltar={() => {
          setTreinoAberto(null);
          void recarregar();
        }}
      />
    );
  }

  return (
    <View style={estilos.tela}>
      <TopBar tab={tela} onTrocar={setTela} />
      {tela === "inicio" ? (
        <Inicio
          treinos={treinos}
          carregando={carregando}
          recarregar={recarregar}
          onSelecionar={setTreinoAberto}
          onTrocarTab={() => setTela("treinos")}
        />
      ) : (
        <Treinos
          treinos={treinos}
          carregando={carregando}
          recarregar={recarregar}
          onSelecionar={setTreinoAberto}
          onTrocarTab={() => setTela("inicio")}
        />
      )}
      {erro ? (
        <View style={estilos.aviso}>
          <Text style={estilos.textoAviso}>{erro}</Text>
        </View>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  aviso: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    padding: 10,
  },
  textoAviso: {
    color: cores.cinza,
    fontSize: 12,
    textAlign: "center",
  },
});
