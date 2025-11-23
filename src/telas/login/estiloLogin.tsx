import { StyleSheet } from "react-native";

const estiloLogin = StyleSheet.create({
    // Estilização Geral;
    gradient: {
        flex: 1, // Cobrindo toda a tela;
    },

    container: {
        flex: 3,
        backgroundColor: '#fffdff',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        paddingHorizontal: '40%',
        paddingTop: '60%',
    },

    // Texto;
    containertexto: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: '13%',
    },

    texto: {
        color: '#79C704',
        fontSize: 40,
    },

    // Botão;
    botao: {
        backgroundColor: '#79C704',
        paddingVertical: '4%',
        paddingHorizontal: '5%',
        borderRadius: 25,
        marginBottom: '8%',
        alignItems: 'center',
    },

    botaoTexto: {
        color: "#fffdff",
        fontSize: 32,
        textAlign: "center",
    },

    // Imagem;
    containerimg: {
        flex: 1,
        marginTop: '10%',
    },

    img: {
        width: '100%',
        height: '57%',
    },

    // Textos acima;
    textocima: {
        color: '#fffdff',
        fontSize: 36,
    },

    containertextocima: {
        alignItems: "center",
        paddingBottom: '13%',
    },

    // Forms;
    containerforms:{
        marginBottom: '2%',
    },

    espaco: {
        alignItems: "center",
        paddingTop: '0.3%',
    },

    textocadastro: {
        color: '#79C704',
        fontSize: 16,
    },

    input: {
        flexDirection: 'row', 
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#79C704',
        borderRadius: 25,
        paddingHorizontal: "6%",
        paddingVertical: '7%',
        marginBottom: '10%',
        backgroundColor: '#79c70419'
    },

    inputdentro: {
        flex: 1,
        fontSize: 21,
        color: '#79C704',
    },
});

export default estiloLogin;