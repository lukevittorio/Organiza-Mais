import { StyleSheet } from "react-native";

const estiloInicial = StyleSheet.create({
    // Estilização Geral;
    gradient: {
        flex: 1, // Cobrindo toda a tela;
    },

    container: {
        flex: 1,
    },

    // Texto;
    containertexto: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: '13%',
    },

    texto: {
        color: '#fffdff',
        fontSize: 40,
    },

    // Botão;
    botao: {
        backgroundColor: '#fffdff',
        paddingVertical: '3%',
        paddingHorizontal: '30%',
        borderRadius: 25,
        marginBottom: '9%',
        alignItems: 'center',
    },

    botaoTexto: {
        color: "#038C8C",
        fontSize: 32,
        textAlign: "center",
    },

    // Imagem;
    img: {
        width: '100%',
        height: '78%',
    },
});

export default estiloInicial;