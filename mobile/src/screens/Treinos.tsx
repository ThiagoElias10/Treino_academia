import { useState } from "react";
import {
  ActivityIndicator,
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
import { cores, fonte, HERO_TREINOS } from "../config";
import { Treino } from "../types";

interface Props {
  treinos: Treino[];
  carregando: boolean;
  recarregar: () => Promise<void>;
  onSelecionar: (treino: Treino) => void;
  onTrocarTab?: () => void;
}

interface FormTreino {
  nome: string;
  dia: string;
  descricao: string;
}

export default function Treinos({
  treinos,
  carregando,
  recarregar,
  onSelecionar,
}: Props) {
  const [formAberto, setFormAberto] = useState(false);
  const [treinoEditando, setTreinoEditando] = useState<Treino | null>(null);
  const [form, setForm] = useState<FormTreino>({ nome: "", dia: "", descricao: "" });
  const [salvando, setSalvando] = useState(false);
  const [aExcluir, setAExcluir] = useState<Treino | null>(null);

  const totalExercicios = treinos.reduce(
    (soma, treino) => soma + (treino.exercicios?.length ?? 0),
    0
  );

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
      await recarregar();
    } finally {
      setSalvando(false);
    }
  }

  async function excluirTreino() {
    if (!aExcluir) return;
    await api.excluirTreino(aExcluir.id);
    setAExcluir(null);
    await recarregar();
  }

  return (
    <View style={estilos.tela}>
      <ScrollView contentContainerStyle={estilos.rolagem}>
        <View style={estilos.secao}>
          <Text style={estilos.tituloSequencia}>Seus treinos</Text>
          <Pressable style={estilos.botaoPlano} onPress={abrirNovoTreino}>
            <Text style={estilos.textoBotaoPlano}>+ ADICIONAR</Text>
          </Pressable>
        </View>

        <Pressable style={estilos.hero}>
          <Image source={{ uri: HERO_TREINOS }} style={estilos.fotoHero} resizeMode="cover" />
          <View style={estilos.veuHero} />
          <View style={estilos.conteudoHero}>
            <Text style={estilos.rodapeHero}>{"FORÇA\nDE BASE."}</Text>
            <Text style={estilos.subHero}>
              {treinos.length} dias • {totalExercicios} exercícios • cadência 3-0-1
            </Text>
          </View>
        </Pressable>

        {carregando && treinos.length === 0 ? (
          <View style={estilos.centro}>
            <ActivityIndicator color={cores.lima} />
          </View>
        ) : treinos.length === 0 ? (
          <Text style={estilos.vazio}>
            Nenhum treino cadastrado. Toque em + ADICIONAR.
          </Text>
        ) : (
          <View style={estilos.lista}>
            {treinos.map((treino, indice) => {
              const foto = treino.exercicios?.[0]?.imagemUrl;
              return (
                <View key={treino.id} style={estilos.cartaoTreino}>
                  <Pressable
                    style={estilos.toqueTreino}
                    onPress={() => onSelecionar(treino)}
                  >
                    <Text style={estilos.indiceTreino}>
                      {String(indice + 1).padStart(2, "0")}
                    </Text>
                    <Image
                      source={{
                        uri:
                          foto && foto.trim()
                            ? foto
                            : "https://placehold.co/240x240/151610/3A3B2E/png?text=%20",
                      }}
                      style={estilos.fotoTreino}
                    />
                    <View style={estilos.infoTreino}>
                      <Text style={estilos.nomeTreino}>{treino.nome}</Text>
                      <Text style={estilos.metaTreino}>
                        {String(treino.exercicios?.length ?? 0).padStart(2, "0")}{" "}
                        exercícios
                      </Text>
                      <Text style={estilos.notaTreino}>
                        {treino.dia
                          ? `Manter a ${
                              treino.dia.toLowerCase()
                            }: descanso 45-60 s entre as séries.`
                          : "Definir dia da semana."}
                      </Text>
                    </View>
                    <View style={estilos.acoesTreino}>
                      <Pressable onPress={() => abrirEditarTreino(treino)} hitSlop={8}>
                        <Text style={estilos.iconeTreino}>✎</Text>
                      </Pressable>
                      <Pressable onPress={() => setAExcluir(treino)} hitSlop={8}>
                        <Text style={estilos.iconeTreino}>×</Text>
                      </Pressable>
                    </View>
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

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
            placeholderTextColor={cores.cinza}
            style={estilos.input}
          />
          <Text style={estilos.label}>DIA / HORÁRIO</Text>
          <TextInput
            value={form.dia}
            onChangeText={(v) => setForm({ ...form, dia: v })}
            placeholder="Ex.: Segunda-feira • 07:00"
            placeholderTextColor={cores.cinza}
            style={estilos.input}
          />
          <Text style={estilos.label}>DESCRIÇÃO</Text>
          <TextInput
            value={form.descricao}
            onChangeText={(v) => setForm({ ...form, descricao: v })}
            placeholder="Objetivo, descansos, observações"
            placeholderTextColor={cores.cinza}
            style={estilos.input}
            multiline
          />
          <View style={estilos.linhaBotoes}>
            <Pressable
              style={estilos.botaoNeutro}
              onPress={() => setFormAberto(false)}
            >
              <Text style={estilos.textoBotaoNeutro}>CANCELAR</Text>
            </Pressable>
            <Pressable
              style={estilos.botaoAcao}
              onPress={salvarTreino}
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
              Excluir o treino "{aExcluir?.nome}" e todos os seus exercícios?
            </Text>
            <View style={estilos.linhaBotoes}>
              <Pressable
                style={estilos.botaoNeutro}
                onPress={() => setAExcluir(null)}
              >
                <Text style={estilos.textoBotaoNeutro}>CANCELAR</Text>
              </Pressable>
              <Pressable style={estilos.botaoAcao} onPress={excluirTreino}>
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
  rolagem: {
    paddingBottom: 40,
  },
  secao: {
    paddingHorizontal: 20,
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tituloSequencia: {
    color: cores.texto,
    fontSize: fonte.titulo,
    fontWeight: "800",
  },
  botaoPlano: {
    backgroundColor: cores.lima,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  textoBotaoPlano: {
    color: cores.preto,
    fontSize: fonte.pequena,
    fontWeight: "800",
    letterSpacing: 1,
  },
  hero: {
    marginHorizontal: 20,
    marginTop: 18,
    borderRadius: 14,
    overflow: "hidden",
    height: 190,
    backgroundColor: cores.card,
  },
  fotoHero: {
    ...StyleSheet.absoluteFillObject,
  },
  veuHero: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  conteudoHero: {
    flex: 1,
    padding: 18,
    justifyContent: "flex-end",
  },
  rodapeHero: {
    color: cores.texto,
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 34,
  },
  subHero: {
    color: cores.cinza,
    fontSize: fonte.pequena,
    marginTop: 8,
    letterSpacing: 1,
  },
  centro: {
    marginTop: 40,
    alignItems: "center",
  },
  vazio: {
    color: cores.cinza,
    textAlign: "center",
    marginTop: 30,
    paddingHorizontal: 24,
  },
  lista: {
    paddingHorizontal: 20,
    marginTop: 18,
    gap: 12,
  },
  cartaoTreino: {
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
  },
  toqueTreino: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  indiceTreino: {
    color: cores.lima,
    fontWeight: "800",
    fontSize: fonte.normal,
    width: 24,
  },
  fotoTreino: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: cores.card2,
  },
  infoTreino: {
    flex: 1,
  },
  nomeTreino: {
    color: cores.texto,
    fontWeight: "700",
    fontSize: fonte.normal,
  },
  metaTreino: {
    color: cores.cinza,
    fontSize: fonte.pequena,
    marginTop: 2,
  },
  notaTreino: {
    color: cores.cinza,
    fontSize: fonte.micro,
    marginTop: 4,
    lineHeight: 15,
  },
  acoesTreino: {
    gap: 10,
    alignItems: "center",
  },
  iconeTreino: {
    color: cores.cinza,
    fontSize: 18,
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
    marginBottom: 20,
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
  linhaBotoes: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
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
