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
  const [concluido, setConcluido] = useState<Set<number>>(new Set());
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
    await api.excluirExercicio(aExcluir.id);
    setExercicios((lista) => lista.filter((item) => item.id !== aExcluir.id));
    setAExcluir(null);
  }

  function concluirTreino() {
    const todos = exercicios.map((item) => item.id);
    setConcluido(new Set([...todos]));
  }

  function alternarConcluido(id: number) {
    setConcluido((conjunto) => {
      const novo = new Set(conjunto);
      if (novo.has(id)) {
        novo.delete(id);
      } else {
        novo.add(id);
      }
      return novo;
    });
  }

  const total = exercicios.length;
  const feitos = exercicios.filter((item) => concluido.has(item.id)).length;

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

      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={estilos.cabecalhoTreino}>
          <Text style={estilos.textoFeitas}>CONTAS NO TREINO</Text>
          <Text style={estilos.textoFeitas}>
            {String(feitos).padStart(2, "0")}/{String(total).padStart(2, "0")} concluídos
          </Text>
        </View>

        <View style={estilos.chips}>
          <View style={estilos.chipLima}>
            <Text style={estilos.textoChipLima}>ATIVO DIAS: SEMANA INTEIRA</Text>
          </View>
        </View>

        {treino.descricao ? (
          <View style={estilos.descricao}>
            <Text style={estilos.textoDescricao}>{treino.descricao}</Text>
          </View>
        ) : null}

        <Text style={estilos.subtitulo}>Seu treino, na ordem</Text>

        <FlatList
          data={exercicios}
          keyExtractor={(item) => String(item.id)}
          scrollEnabled={false}
          renderItem={({ item, index }) => {
            const foto = item.imagemUrl;
            return (
              <View style={estilos.exercicio}>
                <Pressable
                  style={estilos.toqueExercicio}
                  onPress={() => abrirEdicao(item)}
                >
                  <Text style={estilos.indice}>
                    {String(index + 1).padStart(2, "0")}
                  </Text>
                  <Image
                    source={{
                      uri:
                        foto && foto.trim()
                          ? foto
                          : "https://placehold.co/240x240/151610/3A3B2E/png?text=%20",
                    }}
                    style={estilos.foto}
                  />
                  <View style={estilos.info}>
                    <Text style={estilos.nome}>{item.nome}</Text>
                    <View style={estilos.linhaMeta}>
                      <Text style={estilos.rotuloMeta}>SERIES</Text>
                      <Text style={estilos.meta}>
                        {item.series} × {item.repeticoes}
                      </Text>
                      <Text style={estilos.rotuloMeta}>KGS</Text>
                      <Text style={estilos.meta}>{item.carga ?? "—"}</Text>
                    </View>
                    <Text style={estilos.nota}>
                      {item.observacao ??
                        (item.grupoMuscular
                          ? `${item.grupoMuscular}: cadência controlada, mantém a respiração.`
                          : "Cadência controlada, mantém a respiração.")}
                    </Text>
                  </View>
                  <Pressable
                    style={[
                      estilos.check,
                      concluido.has(item.id) && estilos.checkAtivo,
                    ]}
                    onPress={() => alternarConcluido(item.id)}
                    hitSlop={8}
                  />
                </Pressable>
              </View>
            );
          }}
        />

        {total === 0 ? (
          <Text style={estilos.vazio}>
            Nenhum exercício. Toque em ＋ para adicionar.
          </Text>
        ) : null}

        <View style={estilos.espacoBarra} />
      </ScrollView>

      <View style={estilos.barraConcluir}>
        <Pressable style={estilos.botaoConcluir} onPress={concluirTreino}>
          <Text style={estilos.textoConcluir}>Marcar todos como feitos</Text>
          <Text style={estilos.contadorConcluir}>
            {String(feitos).padStart(2, "0")} ✓
          </Text>
        </Pressable>
      </View>

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
              placeholder="Ex.: Rosca direta na barra"
              placeholderTextColor={cores.cinza}
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
              placeholder="Ex.: 12 kg (10/15 rs)"
              placeholderTextColor={cores.cinza}
              style={estilos.input}
            />
            <Text style={estilos.label}>GRUPO MUSCULAR</Text>
            <TextInput
              value={form.grupoMuscular}
              onChangeText={(v) => setForm({ ...form, grupoMuscular: v })}
              placeholder="Ex.: Triceps"
              placeholderTextColor={cores.cinza}
              style={estilos.input}
            />
            <Text style={estilos.label}>URL DA IMAGEM</Text>
            <TextInput
              value={form.imagemUrl}
              onChangeText={(v) => setForm({ ...form, imagemUrl: v })}
              placeholder="Cole aqui a URL da imagem"
              placeholderTextColor={cores.cinza}
              style={estilos.input}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={estilos.label}>OBSERVAÇÃO / NOTA</Text>
            <TextInput
              value={form.observacao}
              onChangeText={(v) => setForm({ ...form, observacao: v })}
              placeholder="Ex.: Descanse 105 s entre as séries."
              placeholderTextColor={cores.cinza}
              style={estilos.input}
              multiline
            />
          </ScrollView>
          <View style={estilos.linhaBotoes}>
            {editando ? (
              <Pressable
                style={estilos.botaoQuadrado}
                onPress={() => setAExcluir(editando)}
              >
                <Text style={estilos.iconeExcluir}>🗑</Text>
              </Pressable>
            ) : null}
            <Pressable
              style={estilos.botaoNeutro}
              onPress={() => setFormAberto(false)}
            >
              <Text style={estilos.textoBotaoNeutro}>CANCELAR</Text>
            </Pressable>
            <Pressable
              style={estilos.botaoAcao}
              onPress={salvarExercicio}
              disabled={salvando}
            >
              {salvando ? (
                <ActivityIndicator color={cores.preto} />
              ) : (
                <Text style={estilos.textoBotaoAcao}>SALVAR</Text>
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
                style={estilos.botaoNeutro}
                onPress={() => setAExcluir(null)}
              >
                <Text style={estilos.textoBotaoNeutro}>CANCELAR</Text>
              </Pressable>
              <Pressable style={estilos.botaoAcao} onPress={excluirExercicio}>
                <Text style={estilos.textoBotaoAcao}>EXCLUIR</Text>
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
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 12,
  },
  voltar: {
    color: cores.texto,
    fontSize: 24,
  },
  titulo: {
    color: cores.texto,
    fontSize: fonte.titulo,
    fontWeight: "800",
    flex: 1,
  },
  textoBotaoAdd: {
    color: cores.preto,
    fontSize: 20,
    fontWeight: "800",
  },
  botaoAdd: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: cores.lima,
    alignItems: "center",
    justifyContent: "center",
  },
  conteudo: {
    paddingHorizontal: 20,
    gap: 14,
  },
  cabecalhoTreino: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  textoFeitas: {
    color: cores.cinza,
    fontSize: fonte.pequena,
  },
  chips: {
    flexDirection: "row",
    gap: 10,
  },
  chipLima: {
    alignSelf: "flex-start",
    backgroundColor: cores.lima,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  textoChipLima: {
    color: cores.preto,
    fontSize: fonte.micro,
    fontWeight: "800",
    letterSpacing: 1,
  },
  descricao: {
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
    padding: 14,
  },
  textoDescricao: {
    color: cores.texto,
    fontSize: fonte.normal,
    lineHeight: 20,
  },
  subtitulo: {
    color: cores.texto,
    fontSize: fonte.titulo,
    fontWeight: "800",
    marginTop: 8,
  },
  exercicio: {
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
  },
  toqueExercicio: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
  },
  indice: {
    color: cores.lima,
    fontSize: fonte.normal,
    fontWeight: "800",
    width: 24,
  },
  foto: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: cores.card2,
  },
  info: {
    flex: 1,
  },
  nome: {
    color: cores.texto,
    fontWeight: "700",
    fontSize: fonte.normal,
  },
  linhaMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  rotuloMeta: {
    color: cores.cinza,
    fontSize: 9,
    letterSpacing: 1,
  },
  meta: {
    color: cores.texto,
    fontSize: fonte.pequena,
    fontWeight: "700",
    marginRight: 10,
  },
  nota: {
    color: cores.cinza,
    fontSize: fonte.micro,
    lineHeight: 15,
    marginTop: 4,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: cores.borda,
  },
  checkAtivo: {
    backgroundColor: cores.lima,
    borderColor: cores.lima,
  },
  vazio: {
    color: cores.cinza,
    textAlign: "center",
    marginTop: 16,
  },
  espacoBarra: {
    height: 90,
  },
  barraConcluir: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    paddingBottom: 34,
    backgroundColor: "rgba(11,12,9,0.95)",
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  botaoConcluir: {
    backgroundColor: cores.lima,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  textoConcluir: {
    color: cores.preto,
    fontWeight: "800",
    fontSize: fonte.normal,
    letterSpacing: 0.4,
  },
  contadorConcluir: {
    color: cores.preto,
    fontWeight: "800",
    fontSize: fonte.normal,
  },
  telaModal: {
    flex: 1,
    backgroundColor: cores.fundo,
    padding: 24,
    paddingTop: 60,
  },
  tituloModal: {
    color: cores.texto,
    fontSize: fonte.grande,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 12,
  },
  form: {
    paddingBottom: 12,
  },
  label: {
    color: cores.cinza,
    fontSize: fonte.pequena,
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.card,
    borderRadius: 8,
    color: cores.texto,
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
  botaoQuadrado: {
    width: 48,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  iconeExcluir: {
    fontSize: 18,
  },
  botaoNeutro: {
    flex: 1,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  botaoAcao: {
    flex: 1,
    backgroundColor: cores.lima,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  textoBotaoNeutro: {
    color: cores.texto,
    fontWeight: "700",
    letterSpacing: 1,
  },
  textoBotaoAcao: {
    color: cores.preto,
    fontWeight: "800",
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
    color: cores.texto,
    fontSize: fonte.normal,
    lineHeight: 22,
  },
});
