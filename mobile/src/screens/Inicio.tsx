import { ActivityIndicator, Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { cores, fonte, HERO_HOME } from "../config";
import { Treino } from "../types";

interface Props {
  treinos: Treino[];
  carregando: boolean;
  recarregar: () => Promise<void>;
  onSelecionar: (treino: Treino) => void;
  onTrocarTab: () => void;
}

function abreviarDia(dia: string | null | undefined): string {
  if (!dia) return "—";
  const primeira = dia.trim().split(" ")[0] ?? "";
  return primeira.slice(0, 3).toUpperCase();
}

const PLACEHOLDER =
  "https://placehold.co/240x240/151610/3A3B2E/png?text=%20";

export default function Inicio({
  treinos,
  carregando,
  recarregar,
  onSelecionar,
  onTrocarTab,
}: Props) {
  const primeiro = treinos.length > 0 ? treinos[0] : null;
  const totalExercicios = treinos.reduce(
    (soma, treino) => soma + (treino.exercicios?.length ?? 0),
    0
  );

  return (
    <View style={estilos.tela}>
      <ScrollView
        contentContainerStyle={estilos.rolagem}
        refreshControl={
          <RefreshControl
            refreshing={carregando}
            onRefresh={() => void recarregar()}
            tintColor="#C9F24D"
          />
        }
      >
        <View style={estilos.cabecalhoFrase}>
          <Text style={estilos.pergunta}>O próximo passo é seu:</Text>
        </View>

        {primeiro ? (
          <View style={estilos.chips}>
            <View style={estilos.chipLima}>
              <Text style={estilos.textoChipLima}>HOJE</Text>
            </View>
            <Pressable style={estilos.chip} onPress={onTrocarTab}>
              <Text style={estilos.textoChip}>{primeiro.nome}</Text>
              <Text style={estilos.textoChipForte}>›</Text>
            </Pressable>
          </View>
        ) : null}

        <Pressable style={estilos.hero} onPress={onTrocarTab}>
          <Image source={{ uri: HERO_HOME }} style={estilos.fotoHero} resizeMode="cover" />
          <View style={estilos.veuHero} />
          <View style={estilos.conteudoHero}>
            <Text style={estilos.mencao}>Confiança move a determinação</Text>
            <Text style={estilos.tituloHero}>{"ENCONTRE\nSEU PULSO."}</Text>
            <Text style={estilos.subHero}>
              Treine com precisão. Repita o que funciona.
            </Text>
          </View>
        </Pressable>

        <View style={estilos.secaoLinha}>
          <Text style={estilos.tituloSecao}>Treinos da semana</Text>
          <Pressable onPress={onTrocarTab}>
            <Text style={estilos.acaoSecao}>VER TUDO</Text>
          </Pressable>
        </View>

        <View style={estilos.rachoSemana}>
          {treinos.slice(0, 4).map((treino) => {
            const foto = treino.exercicios?.[0]?.imagemUrl;
            return (
              <Pressable
                key={treino.id}
                style={estilos.itemSemana}
                onPress={() => onSelecionar(treino)}
              >
                <Image
                  source={{ uri: foto && foto.trim() ? foto : PLACEHOLDER }}
                  style={estilos.fotoSemana}
                />
                <Text style={estilos.labelSemana}>{abreviarDia(treino.dia)}</Text>
                <Text style={estilos.statusSemana}>
                  {treino.id % 2 === 0 ? "PENDENTE" : "CONCLUÍDO"}
                </Text>
                <Text style={estilos.resumoSemana}>
                  {treino.exercicios?.length ?? 0} exercícios
                </Text>
              </Pressable>
            );
          })}
          {treinos.length === 0 && !carregando ? (
            <Text style={estilos.vazioSemana}>Cadastre um treino para começar.</Text>
          ) : null}
        </View>

        <View style={estilos.secaoLinha}>
          <Text style={estilos.tituloSecao}>Treinos do mês</Text>
        </View>

        <View style={estilos.grade}>
          {treinos.map((treino) => {
            const foto = treino.exercicios?.[0]?.imagemUrl;
            return (
              <Pressable
                key={treino.id}
                style={estilos.cardMes}
                onPress={() => onSelecionar(treino)}
              >
                <Image
                  source={{ uri: foto && foto.trim() ? foto : PLACEHOLDER }}
                  style={estilos.fotoMes}
                  resizeMode="cover"
                />
                <View style={estilos.veuMes} />
                <View style={estilos.conteudoMes}>
                  <Text style={estilos.nomeMes}>{treino.nome}</Text>
                  <Text style={estilos.tagMes}>{abreviarDia(treino.dia)} • {treino.exercicios?.length ?? 0} exercícios</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={estilos.rodapeResumo}>
          <Text style={estilos.numeroResumo}>{treinos.length}</Text>
          <Text style={estilos.labelResumo}>
            treinos ativos • {totalExercicios} exercícios no plano
          </Text>
          <Text style={estilos.indicador}>‹ ›</Text>
        </View>

        <View style={estilos.rodape}>
          <Text style={estilos.rodapeMarca}>⚡ PULSO</Text>
          <Text style={estilos.rodapeTexto}>
            Foco de base. Progressão de força.{"\n"}Detalhes abaixo: cadência controlada,
            8-15 em profundidade, retorno controlado.
          </Text>
        </View>
      </ScrollView>

      {carregando && treinos.length === 0 ? (
        <View style={estilos.fundoCarregando}>
          <ActivityIndicator color={cores.lima} />
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
  rolagem: {
    paddingBottom: 40,
  },
  cabecalhoFrase: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  pergunta: {
    color: cores.texto,
    fontSize: fonte.grande,
    fontWeight: "800",
  },
  chips: {
    paddingHorizontal: 20,
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
  },
  chipLima: {
    backgroundColor: cores.lima,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  textoChipLima: {
    color: cores.preto,
    fontSize: fonte.pequena,
    fontWeight: "700",
    letterSpacing: 1,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  textoChip: {
    color: cores.texto,
    fontSize: fonte.pequena,
    fontWeight: "600",
  },
  textoChipForte: {
    color: cores.cinza,
    fontSize: fonte.pequena,
  },
  hero: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 14,
    overflow: "hidden",
    height: 300,
    backgroundColor: cores.card,
  },
  fotoHero: {
    ...StyleSheet.absoluteFillObject,
  },
  veuHero: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  conteudoHero: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-end",
  },
  mencao: {
    color: cores.texto,
    fontSize: fonte.micro,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  tituloHero: {
    color: cores.texto,
    fontSize: 40,
    fontWeight: "900",
    lineHeight: 42,
  },
  subHero: {
    color: cores.cinza,
    fontSize: fonte.pequena,
    marginTop: 10,
  },
  secaoLinha: {
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tituloSecao: {
    color: cores.texto,
    fontSize: fonte.titulo,
    fontWeight: "800",
  },
  acaoSecao: {
    color: cores.lima,
    fontSize: fonte.micro,
    letterSpacing: 2,
  },
  rachoSemana: {    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 14,
  },
  itemSemana: {
    width: 84,
  },
  fotoSemana: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: cores.card,
  },
  labelSemana: {
    color: cores.texto,
    fontSize: fonte.pequena,
    fontWeight: "700",
    marginTop: 8,
  },
  statusSemana: {
    color: cores.lima,
    fontSize: fonte.micro,
    letterSpacing: 1,
    marginTop: 2,
  },
  resumoSemana: {
    color: cores.cinza,
    fontSize: fonte.micro,
    marginTop: 2,
  },
  vazioSemana: {
    color: cores.cinza,
    fontSize: fonte.normal,
  },
  grade: {
    paddingHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  cardMes: {
    width: "48%",
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: cores.card,
    position: "relative",
  },
  fotoMes: {
    ...StyleSheet.absoluteFillObject,
  },
  veuMes: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  conteudoMes: {
    flex: 1,
    padding: 10,
    justifyContent: "flex-end",
  },
  chipDia: {
    display: "none",
  },
  nomeMes: {
    color: cores.texto,
    fontSize: fonte.pequena,
    fontWeight: "700",
  },
  tagMes: {
    color: cores.cinza,
    fontSize: fonte.micro,
    letterSpacing: 1,
    marginTop: 2,
  },
  rodapeResumo: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  numeroResumo: {
    color: cores.lima,
    fontSize: fonte.display,
    fontWeight: "900",
  },
  labelResumo: {
    color: cores.texto,
    fontSize: fonte.pequena,
    flex: 1,
  },
  indicador: {
    color: cores.cinza,
    fontSize: fonte.titulo,
  },
  rodape: {
    paddingHorizontal: 20,
    marginTop: 28,
  },
  rodapeMarca: {
    color: cores.texto,
    fontWeight: "800",
    letterSpacing: 3,
    fontSize: fonte.pequena,
  },
  rodapeTexto: {
    color: cores.cinza,
    fontSize: fonte.micro,
    lineHeight: 18,
    marginTop: 8,
  },
  fundoCarregando: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(11,12,9,0.6)",
  },
});
