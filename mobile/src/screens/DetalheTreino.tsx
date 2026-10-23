import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { api } from "../api";
import { cores, fonte } from "../config";
import { Exercicio, Treino } from "../types";

interface Props {
  treino: Treino;
  onVoltar: () => void;
}

interface FormEx {
  nome: string;
  series: string;
  repeticoes: string;
  carga: string;
  grupoMuscular: string;
  observacao: string;
  imagemUrl: string;
}

const VAZIO: FormEx = {
  nome: "",
  series: "3",
  repeticoes: "10",
  carga: "",
  grupoMuscular: "",
  observacao: "",
  imagemUrl: "",
};

export default function DetalheTreino({ treino, onVoltar }: Props) {
  const [exercicios, setExercicios] = useState<Exercicio[]>(treino.exercicios ?? []);
  const [concluidos, setConcluidos] = useState<Set<number>>(new Set());
  const [formAberto, setFormAberto] = useState(false);
  const [editando, setEditando] = useState<Exercicio | null>(null);
  const [form, setForm] = useState<FormEx>(VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [aExcluir, setAExcluir] = useState<Exercicio | null>(null);

  function abrirNovo() {
    setEditando(null);
    setForm(VAZIO);
    setFormAberto(true);
  }

  function abrirEdicao(exercicio: Exercicio) {
    setEditando(exercicio);
    setForm({
      nome: exercicio.nome,
      series: String(exercicio.series),
      repeticoes: String(exercicio.repeticoes),
      carga: exercicio.carga ?? "",
      grupoMuscular: exercicio.grupoMuscular ?? "",
      observacao: exercicio.observacao ?? "",
      imagemUrl: exercicio.imagemUrl ?? "",
    });
    setFormAberto(true);
  }

  async function salvarExercicio() {
    if (!form.nome.trim() || salvando) return;
    try {
      setSalvando(true);
      const dados = {
        nome: form.nome.trim(),
        series: parseInt(form.series, 10) || 0,
        repeticoes: parseInt(form.repeticoes, 10) || 0,
        carga: form.carga.trim() || null,
        grupoMuscular: form.grupoMuscular.trim() || null,
        observacao: form.observacao.trim() || null,
        imagemUrl: form.imagemUrl.trim() || null,
      };
      if (editando) {
        const atualizado = await api.atualizarExercicio(editando.id, dados);
        setExercicios((lista) =>
          lista.map((item) => (item.id === atualizado.id ? atualizado : item))
        );
      } else {
        const criado = await api.criarExercicio(treino.id, dados);
        setExercicios((lista) => [...lista, criado]);
      }
      setFormAberto(false);
    } finally {
      setSalvando(false);
    }
  }

  async function excluirExercicio() {
    if (!aExcluir || salvando) return;
    try {
      setSalvando(true);
      await api.excluirExercicio(aExcluir.id);
      setExercicios((lista) => lista.filter((item) => item.id !== aExcluir.id));
      setAExcluir(null);
    } finally {
      setSalvando(false);
    }
  }

  function alternarConcluido(id: number) {
    setConcluidos((conjunto) => {
      const novo = new Set(conjunto);
      if (novo.has(id)) {
        novo.delete(id);
      } else {
        novo.add(id);
      }
      return novo;
    });
  }

  return (
    <View style={estilos.tela}>
      <View style={estilos.cabecalho}>
        <Pressable onPress={onVoltar} hitSlop={12}>
          <Text style={estilos.voltar}>←</Text>
        </Pressable>
        <Text style={estilos.titulo} numberOfLines={1}>
          {treino.nome}
        </Text>
        <Pressable style={estilos.botaoAdd} onPress={abrirNovo} hitSlop={8}>
          <Text style={estilos.textoBotaoAdd}>＋</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={estilos.conteudo} stickyHeaderIndices={[0]}>
        <View style={estilos.tag}>
          <Text style={estilos.tagTexto}>{treino.nome}</Text>
        </View>

        {treino.descricao ? (
          <View style={estilos.descricao}>
            <Text style={estilos.descricaoTexto}>{treino.descricao}</Text>
          </View>
        ) : null}

        <FlatList
          data={exercicios}
          keyExtractor={(item) => String(item.id)}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={estilos.exercicio}>
              <Pressable
                style={estilos.exercicioToque}
                onPress={() => abrirEdicao(item)}
              >
                <Image
                  source={{
                    uri:
                      item.imagemUrl && item.imagemUrl.trim().length > 0
                        ? item.imagemUrl
                        : "https://placehold.co/120x120/000000/FFFFFF/png?text=%20",
                  }}
                  style={estilos.foto}
                />
                <View style={estilos.info}>
                  <Text style={estilos.nomeExercicio}>{item.nome}</Text>
                  <Text style={estilos.detalhe}>
                    {item.series}x {item.repeticoes} • {item.carga ?? ""}
                  </Text>
                  {item.grupoMuscular ? (
                    <Text style={estilos.grupo}>{item.grupoMuscular}</Text>
                  ) : null}
                </View>
                <Pressable
                  style={[estilos.check, concluidos.has(item.id) && estilos.checkAtivo]}
                  onPress={() => alternarConcluido(item.id)}
                  hitSlop={8}
                >
                  <Text
                    style={[
                      estilos.checkTexto,
                      concluidos.has(item.id) && estilos.checkTextoAtivo,
                    ]}
                  >
                    ✓
                  </Text>
                </Pressable>
              </Pressable>
            </View>
          )}
        />

        {exercicios.length === 0 ? (
          <Text style={estilos.vazio}>
            Nenhum exercício. Toque em ＋ para adicionar.
          </Text>
        ) : null}
      </ScrollView>

      <Modal visible={formAberto} animationType="slide">
        <View style={estilos.telaModal}>
          <Text style={estilos.tituloModal}>
            {editando ? "EDITAR EXERCÍCIO" : "NOVO EXERCÍCIO"}
          </Text>
          <ScrollView contentContainerStyle={estilos.form}>
            <Text style={estilos.label}>NOME</Text>
            <TextInput
              value={form.nome}
              onChangeText={(v) => setForm({ ...form, nome: v })}
              placeholder="Ex.: Rosca direita na barra"
              placeholderTextColor={cores.textoSuave}
              style={estilos.input}
            />
            <View style={estilos.linhaInputs}>
              <View style={{ flex: 1 }}>
                <Text style={estilos.label}>SÉRIES</Text>
                <TextInput
                  value={form.series}
                  onChangeText={(v) =>
                    setForm({ ...form, series: v.replace(/[^0-9]/g, "") })
                  }
                  keyboardType="number-pad"
                  style={estilos.input}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={estilos.label}>REPETIÇÕES</Text>
                <TextInput
                  value={form.repeticoes}
                  onChangeText={(v) =>
                    setForm({ ...form, repeticoes: v.replace(/[^0-9]/g, "") })
                  }
                  keyboardType="number-pad"
                  style={estilos.input}
                />
              </View>
            </View>
            <Text style={estilos.label}>CARGA</Text>
            <TextInput
              value={form.carga}
              onChangeText={(v) => setForm({ ...form, carga: v })}
              placeholder="Ex.: 3kg"
              placeholderTextColor={cores.textoSuave}
              style={estilos.input}
            />
            <Text style={estilos.label}>GRUPO MUSCULAR</Text>
            <TextInput
              value={form.grupoMuscular}
              onChangeText={(v) => setForm({ ...form, grupoMuscular: v })}
              placeholder="Ex.: Triceps"
              placeholderTextColor={cores.textoSuave}
              style={estilos.input}
            />
            <Text style={estilos.label}>URL DA IMAGEM</Text>
            <TextInput
              value={form.imagemUrl}
              onChangeText={(v) => setForm({ ...form, imagemUrl: v })}
              placeholder="Cole aqui a URL da imagem"
              placeholderTextColor={cores.textoSuave}
              style={estilos.input}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={estilos.label}>OBSERVAÇÃO</Text>
            <TextInput
              value={form.observacao}
              onChangeText={(v) => setForm({ ...form, observacao: v })}
              placeholder="Ex.: descanso 1min30"
              placeholderTextColor={cores.textoSuave}
              style={estilos.input}
              multiline
            />
          </ScrollView>
          <View style={estilos.linhaBotoes}>
            {editando ? (
              <Pressable
                style={estilos.botaoAcaoQuadrado}
                onPress={() => setAExcluir(editando)}
              >
                <Text style={estilos.iconeAcao}>🗑</Text>
              </Pressable>
            ) : null}
            <Pressable
              style={estilos.botaoSecundario}
              onPress={() => setFormAberto(false)}
            >
              <Text style={estilos.textoBotaoT}>CANCELAR</Text>
            </Pressable>
            <Pressable
              style={estilos.botaoPrincipal}
              onPress={salvarExercicio}
              disabled={salvando}
            >
              {salvando ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={estilos.textoBotaoP}>SALVAR</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={aExcluir !== null} animationType="fade" transparent>
        <View style={estilos.fundoDialog}>
          <View style={estilos.dialog}>
            <Text style={estilos.textoDialog}>
              Excluir o exercício "{aExcluir?.nome}"?
            </Text>
            <View style={estilos.linhaBotoes}>
              <Pressable
                style={estilos.botaoSecundario}
                onPress={() => setAExcluir(null)}
              >
                <Text style={estilos.textoBotaoT}>CANCELAR</Text>
              </Pressable>
              <Pressable style={estilos.botaoPrincipal} onPress={excluirExercicio}>
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
    paddingTop: 48,
  },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  voltar: {
    color: cores.branco,
    fontSize: 26,
  },
  titulo: {
    color: cores.branco,
    fontSize: fonte.titulo,
    fontWeight: "700",
    flex: 1,
  },
  botaoAdd: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: cores.branco,
    alignItems: "center",
    justifyContent: "center",
  },
  textoBotaoAdd: {
    color: cores.branco,
    fontSize: 18,
    fontWeight: "700",
  },
  conteudo: {
    padding: 20,
    gap: 12,
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: cores.branco,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagTexto: {
    color: cores.preto,
    fontWeight: "700",
    fontSize: 12,
    textTransform: "uppercase",
  },
  descricao: {
    backgroundColor: cores.card,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
  },
  descricaoTexto: {
    color: cores.texto,
    fontSize: fonte.normal,
    lineHeight: 20,
  },
  exercicio: {
    backgroundColor: cores.card,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: 10,
  },
  exercicioToque: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
  },
  foto: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: cores.preto,
  },
  info: {
    flex: 1,
  },
  nomeExercicio: {
    color: cores.branco,
    fontSize: fonte.normal,
    fontWeight: "700",
  },
  detalhe: {
    color: cores.textoSuave,
    fontSize: 12,
    marginTop: 2,
  },
  grupo: {
    color: cores.textoSuave,
    fontSize: 12,
    marginTop: 2,
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: cores.branco,
    alignItems: "center",
    justifyContent: "center",
  },
  checkAtivo: {
    backgroundColor: cores.branco,
  },
  checkTexto: {
    color: cores.branco,
    fontSize: 14,
    fontWeight: "700",
  },
  checkTextoAtivo: {
    color: cores.preto,
  },
  vazio: {
    color: cores.textoSuave,
    textAlign: "center",
    marginTop: 20,
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
    marginBottom: 12,
  },
  form: {
    gap: 2,
    paddingBottom: 12,
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
  linhaInputs: {
    flexDirection: "row",
    gap: 12,
  },
  linhaBotoes: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  botaoAcaoQuadrado: {
    width: 50,
    borderWidth: 1,
    borderColor: cores.branco,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  iconeAcao: {
    fontSize: 20,
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
