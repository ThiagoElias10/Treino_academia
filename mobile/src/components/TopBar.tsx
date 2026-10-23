import { Pressable, StyleSheet, Text, View } from "react-native";
import { cores, fonte } from "../config";

interface Props {
  tab: "inicio" | "treinos";
  onTrocar: (quem: "inicio" | "treinos") => void;
}

export default function TopBar({ tab, onTrocar }: Props) {
  return (
    <View style={estilos.fundo}>
      <View style={estilos.colunaMarca}>
        <View style={estilos.marca}>
          <Text style={estilos.sinal}>⚡</Text>
          <Text style={estilos.logo}>PULSO</Text>
          <Text style={estilos.descritor}>PERFORMANCE</Text>
        </View>
        <View style={estilos.avatar}>
          <Text style={estilos.textoAvatar}>T</Text>
        </View>
      </View>

      <View style={estilos.abas}>
        <Pressable style={estilos.aba} onPress={() => onTrocar("inicio")}>
          <Text style={[estilos.abaTexto, tab === "inicio" && estilos.abaAtiva]}>
            Início
          </Text>
          {tab === "inicio" ? <View style={estilos.linhaAba} /> : null}
        </Pressable>
        <Pressable style={estilos.aba} onPress={() => onTrocar("treinos")}>
          <Text style={[estilos.abaTexto, tab === "treinos" && estilos.abaAtiva]}>
            Treinos
          </Text>
          {tab === "treinos" ? <View style={estilos.linhaAba} /> : null}
        </Pressable>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    backgroundColor: cores.fundo,
    paddingTop: 54,
    paddingHorizontal: 20,
  },
  colunaMarca: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  marca: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  sinal: {
    color: cores.lima,
    fontSize: 14,
    marginRight: 6,
  },
  logo: {
    color: cores.texto,
    fontWeight: "800",
    fontSize: fonte.titulo,
    letterSpacing: 3,
  },
  descritor: {
    color: cores.cinza,
    fontSize: fonte.micro,
    letterSpacing: 2,
    marginLeft: 8,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: cores.borda,
    alignItems: "center",
    justifyContent: "center",
  },
  textoAvatar: {
    color: cores.lima,
    fontSize: fonte.normal,
    fontWeight: "700",
  },
  abas: {
    flexDirection: "row",
    gap: 24,
    marginTop: 18,
  },
  aba: {
    paddingBottom: 10,
  },
  abaTexto: {
    color: cores.cinza,
    fontSize: fonte.normal,
  },
  abaAtiva: {
    color: cores.texto,
    fontWeight: "700",
  },
  linhaAba: {
    marginTop: 6,
    height: 2,
    backgroundColor: cores.lima,
    borderRadius: 1,
  },
});
