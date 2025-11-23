import { StyleSheet } from "react-native";

const estiloCadastro = StyleSheet.create({
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
        paddingTop: '15%',
    },

    // Texto;
    containertexto: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: '13%',
    },

    texto: {
        color: '#038C8C',
        fontSize: 40,
    },

    // Botão;
    botao: {
        backgroundColor: '#038C8C',
        paddingVertical: '4%',
        paddingHorizontal: '5%',
        borderRadius: 25,
        marginBottom: '6%',
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

    textologin: {
        color: '#038C8C',
        fontSize: 16,
    },

    input: {
        flexDirection: 'row', 
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#038C8C',
        borderRadius: 25,
        paddingHorizontal: "6%",
        paddingVertical: '5%',
        marginBottom: '6%',
        backgroundColor: '#038C8C20'
    },

    inputdentro: {
        flex: 1,
        fontSize: 21,
        color: '#038C8C',
    },
});

export default estiloCadastro;