import { StyleSheet } from "react-native";

const estiloPerfil = StyleSheet.create({
    // Estilização Geral;
    gradient: {
        flex: 1, // Cobrindo toda a tela;
    },

    container: {
        flex: 1,
        paddingHorizontal: '25%',
        paddingVertical: '1%',
    },

    // Foto;
    img: {
        width: 240,
        height: 240,
        borderRadius: 125,
    },

    // Conteúdo;
    containerconteudo: {
        alignItems: "center",
        margin: '1%',
    },

    tituloperfil: {
        color: '#fffdff',
        fontSize: 64,
        paddingBottom: '2%',
    },

    nometexto: {
        color: '#0E3939',
        fontSize: 40,
        paddingTop: '2%',
    },

    emailtexto: {
        color: '#0E3939',
        fontSize: 24,
        paddingTop: '2%',
    },

    // Botão;
    botao: {
        backgroundColor: '#fffdff',
        paddingVertical: '3%',
        paddingHorizontal: '6%',
        borderRadius: 25,
        marginBottom: '4%',
        alignItems: 'center',
    },

    botaoTexto: {
        color: "#038C8C",
        fontSize: 36,
        textAlign: "center",
    },

    // Texto;
    containerbotao: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: '3%',
    },

    // Modal;
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalBox: {
        width: "85%",
        backgroundColor: "#fffdff",
        padding: '8%',
        borderRadius: 16,
    },

    modalTitulo: {
        fontSize: 24,
        fontWeight: "900",
        marginBottom: '8%',
        color: "#0E3939",
    },

    input: {
        width: "100%",
        backgroundColor: "#f1f1f1",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        fontSize: 15,
        color: "#0E3939",
    },

    modalButton: {
        backgroundColor: "#0E3939",
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 10,
        alignItems: "center",
    },

    modalButtonText: {
        color: "#fffdff",
        fontSize: 18,
        fontWeight: "800",
    },

    fechar: {
        marginTop: 12,
        textAlign: "center",
        color: "#666",
        fontSize: 18,
    },

    // Input senha - Modal;
    inputSenhaContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f1f1f1",
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 10,
    },

    inputSenha: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 15,
        color: "#0E3939",
    },

    // Botões alteração;
    botoesLinha: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 10,
    },

    botaoAcao: {
        flex: 1,
        backgroundColor: "#155c5cff",
        paddingVertical: 8,
        marginHorizontal: 5,
        borderRadius: 12,
        alignItems: "center",
    },

    botaoAcaoTexto: {
        color: "#fffdff",
        fontSize: 18,
        fontWeight: "600",
    },

    // Data cadastro;
    info: {
        fontSize: 16,
        color: "#0E3939",
        marginTop: 6,
    },

    // Botão excluir;
    botaoExcluir: {
        backgroundColor: "#CC0000",
        paddingVertical: 12,
        paddingHorizontal: '8%',
        borderRadius: 15,
        alignItems: "center",
    },

    botaoExcluirTexto: {
        color: "#fffdff",
        fontSize: 16,
        textAlign: "center",
        fontWeight: "700",
    },

});

export default estiloPerfil;