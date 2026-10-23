import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { api } from "./api";
import { cores, fonte, HERO_IMAGEM } from "./config";
import { Treino } from "./types";
import DetalheTreino from "./screens/DetalheTreino";

interface FormTreino {
  nome: string;
  dia: string;
  descricao: string;
}

export default function App() {
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [treinoSelecionado, setTreinoSelecionado] = useState<Treino | null>(null);

  const [formAberto, setFormAberto] = useState(false);
  const [treinoEditando, setTreinoEditando] = useState<Treino | null>(null);
  const [form, setForm] = useState<FormTreino>({ nome: "", dia: "", descricao: "" });
  const [salvando, setSalvando] = useState(false);

  const [aExcluir, setAExcluir] = useState<Treino | null>(null);

  const carregar = useCallback(async () => {
    try {
      setErro(null);
      setCarregando(true);
      setTreinos(await api.listarTreinos());
    } catch {
      setErro("Não foi possível conectar à API. Verifique o API_URL em src/config.ts");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  function abrirNovoTreino() {
    setTreinoEditando(null);
    setForm({ nome: "", dia: "", descricao: "" });
    setFormAberto(true);
  }

  function abrirEditarTreino(treino: Treino) {
    setTreinoEditando(treino);
    setForm({
      nome: treino.nome,
      dia: treino.dia ?? "",
      descricao: treino.descricao ?? "",
    });
    setFormAberto(true);
  }

  async function salvarTreino() {
    if (!form.nome.trim() || salvando) return;
    try {
      setSalvando(true);
      const dados = {
        nome: form.nome.trim(),
        dia: form.dia.trim() || null,
        descricao: form.descricao.trim() || null,
      };
      if (treinoEditando) {
        await api.atualizarTreino(treinoEditando.id, dados);
      } else {
        await api.criarTreino(dados);
      }
      setFormAberto(false);
      await carregar();
    } finally {
      setSalvando(false);
    }
  }

  async function excluirTreino() {
    if (!aExcluir) return;
    try {
      await api.excluirTreino(aExcluir.id);
      setAExcluir(null);
      await carregar();
    } finally {
      setSalvando(false);
    }
  }

  if (treinoSelecionado) {
    return <DetalheTreino treino={treinoSelecionado} onVoltar={() => void carregar()} />;
  }

  return (
    <View style={estilos.tela}>
      <Image source={{ uri: HERO_IMAGEM }} style={estilos.hero} resizeMode="cover" />
      <View style={estilos.heroOverlay}>
        <Text style={estilos.heroTitulo}>TREINOS</Text>
        <Text style={estilos.heroSubtitulo}>FOCO • DISCIPLINA • RESULTADOS</Text>
      </View>

      <Pressable style={estilos.botaoNovo} onPress={abrirNovoTreino}>
        <Text style={estilos.textoBotaoNovo}>＋ NOVO TREINO</Text>
      </Pressable>

      {carregando ? (
        <ActivityIndicator color="#FFFFFF" style={{ marginTop: 24 }} />
      ) : erro ? (
        <View style={{ padding: 24 }}>
          <Text style={estilos.erro}>{erro}</Text>
          <Pressable onPress={carregar} style={estilos.botaoTentar}>
            <Text style={estilos.textoLinha}>TENTAR NOVAMENTE</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={treinos}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={estilos.lista}
          renderItem={({ item }) => (
            <View style={estilos.card}>
              <Pressable
                style={estilos.cardToque}
                onPress={() => setTreinoSelecionado(item)}
              >
                <Text style={estilos.nomeTreino}>{item.nome}</Text>
                {item.dia ? <Text style={estilos.dia}>{item.dia}</Text> : null}
                <Text style={estilos.contagem}>
                  {item.exercicios?.length ?? 0} exercícios
                </Text>
              </Pressable>
              <View style={estilos.acoesCard}>
                <Pressable onPress={() => abrirEditarTreino(item)} hitSlop={8}>
                  <Text style={estilos.iconeAcao}>✎</Text>
                </Pressable>
                <Pressable onPress={() => setAExcluir(item)} hitSlop={8}>
                  <Text style={estilos.iconeAcao}>✕</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}

      {/* Modal: criar / editar treino */}
      <Modal visible={formAberto} animationType="slide">
        <View style={estilos.telaModal}>
          <Text style={estilos.tituloModal}>
            {treinoEditando ? "EDITAR TREINO" : "NOVO TREINO"}
          </Text>
          <Text style={estilos.label}>NOME</Text>
          <TextInput
            value={form.nome}
            onChangeText={(v) => setForm({ ...form, nome: v })}
            placeholder="Ex.: Superiores A"
            placeholderTextColor={cores.textoSuave}
            style={estilos.input}
          />
          <Text style={estilos.label}>DIA / HORÁRIO</Text>
          <TextInput
            value={form.dia}
            onChangeText={(v) => setForm({ ...form, dia: v })}
            placeholder="Ex.: Segunda-feira • 07:00"
            placeholderTextColor={cores.textoSuave}
            style={estilos.input}
          />
          <Text style={estilos.label}>DESCRIÇÃO</Text>
          <TextInput
            value={form.descricao}
            onChangeText={(v) => setForm({ ...form, descricao: v })}
            placeholder="Ex.: Objetivo: Hipertrofia. Descanse 1 min entre cada série."
            placeholderTextColor={cores.textoSuave}
            style={estilos.input}
            multiline
          />
          <View style={estilos.linhaBotoes}>
            <Pressable style={estilos.botaoSecundario} onPress={() => setFormAberto(false)}>
              <Text style={estilos.textoBotaoT}>CANCELAR</Text>
            </Pressable>
            <Pressable style={estilos.botaoPrincipal} onPress={salvarTreino} disabled={salvando}>
              {salvando ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={estilos.textoBotaoP}>SALVAR</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal: confirmar exclusão */}
      <Modal visible={aExcluir !== null} animationType="fade" transparent>
        <View style={estilos.fundoDialog}>
          <View style={estilos.dialog}>
            <Text style={estilos.textoDialog}>
              Excluir o treino "{aExcluir?.nome}" e todos os seus exercícios?
            </Text>
            <View style={estilos.linhaBotoes}>
              <Pressable style={estilos.botaoSecundario} onPress={() => setAExcluir(null)}>
                <Text style={estilos.textoBotaoT}>CANCELAR</Text>
              </Pressable>
              <Pressable style={estilos.botaoPrincipal} onPress={excluirTreino}>
                <Text style={estilos.textoBotaoP}>EXCLUIR</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  hero: {
    height: 210,
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
    padding: 20,
  },
  heroTitulo: {
    color: cores.branco,
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 4,
  },
  heroSubtitulo: {
    color: cores.textoSuave,
    fontSize: 11,
    letterSpacing: 3,
    marginTop: 6,
  },
  botaoNovo: {
    alignSelf: "flex-end",
    margin: 20,
    marginBottom: 8,
    backgroundColor: cores.branco,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  textoBotaoNovo: {
    color: cores.preto,
    fontWeight: "700",
    letterSpacing: 1,
  },
  lista: {
    padding: 20,
    paddingTop: 8,
    gap: 12,
  },
  card: {
    flexDirection: "row",
    backgroundColor: cores.card,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: 10,
  },
  cardToque: {
    flex: 1,
    padding: 16,
  },
  acoesCard: {
    gap: 14,
    padding: 16,
    justifyContent: "center",
    borderLeftWidth: 1,
    borderLeftColor: cores.borda,
  },
  iconeAcao: {
    color: cores.branco,
    fontSize: 18,
  },
  nomeTreino: {
    color: cores.branco,
    fontSize: fonte.titulo,
    fontWeight: "700",
  },
  dia: {
    color: cores.textoSuave,
    fontSize: fonte.normal,
    marginTop: 2,
  },
  contagem: {
    color: cores.textoSuave,
    fontSize: 11,
    marginTop: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  erro: {
    color: cores.branco,
    fontSize: fonte.normal,
    textAlign: "center",
    lineHeight: 22,
  },
  botaoTentar: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: cores.branco,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  textoLinha: {
    color: cores.branco,
    fontWeight: "700",
    letterSpacing: 1,
  },
  telaModal: {
    flex: 1,
    backgroundColor: cores.fundo,
    padding: 24,
    paddingTop: 60,
  },
  tituloModal: {
    color: cores.branco,
    fontSize: fonte.grande,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 20,
  },
  label: {
    color: cores.textoSuave,
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: cores.branco,
    borderRadius: 8,
    color: cores.branco,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  linhaBotoes: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  botaoSecundario: {
    flex: 1,
    borderWidth: 1,
    borderColor: cores.branco,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  botaoPrincipal: {
    flex: 1,
    backgroundColor: cores.branco,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  textoBotaoT: {
    color: cores.branco,
    fontWeight: "700",
    letterSpacing: 1,
  },
  textoBotaoP: {
    color: cores.preto,
    fontWeight: "700",
    letterSpacing: 1,
  },
  fundoDialog: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  dialog: {
    backgroundColor: cores.card,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    width: "100%",
  },
  textoDialog: {
    color: cores.branco,
    fontSize: fonte.normal,
    lineHeight: 22,
  },
});
