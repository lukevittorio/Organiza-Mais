import { StyleSheet } from "react-native";

const estiloPlanejamento = StyleSheet.create({
    // Estilização Geral;
    gradient: {
        flex: 1, // Cobrindo toda a tela;
    },

    container: {
        flex: 1,
        paddingHorizontal: '25%',
        paddingTop: '25%',
        paddingBottom: '110%',
        alignItems: 'center',
    },

    // Título;
    titulo: {
        color: '#fffdff',
        fontSize: 48,
        paddingBottom: '5%',
    },

    // Box;
    containerbox: {
        backgroundColor: '#fffdff',
        borderRadius: 50,
        padding: '8%',
        alignItems: "center",
        marginVertical: '2%',
        width: '100%',
        height: '100%',
    },

    centralizar: {
        width: '100%',
        alignItems: "center",
    },

    mes: {
        color: '#038C8C',
        fontSize: 36,
        paddingBottom: '4%',
    },

    containerinfo: {
        backgroundColor: '#AEFF5B42',
        borderRadius: 20,
        paddingVertical: '4%',
        alignItems: "center",
        width: '100%',
        marginBottom: '5%',
    },

    textoinfo: {
        color: '#2B520342',
        fontSize: 20,
        paddingBottom: '3%',
    },

    valorinfo: {
        color: '#0E3939',
        fontSize: 24,
    },

    // Botão;
    botao: {
        backgroundColor: '#038C8C',
        paddingVertical: '5%',
        borderRadius: 20,
        marginTop: '3%',
        alignItems: 'center',
        width: '100%',
    },

    botaoTexto: {
        color: "#B4FAF3",
        fontSize: 20,
        textAlign: "center",
    },

    botaoExcluir: {
        backgroundColor: '#B3261E',
        paddingVertical: '5%',
        borderRadius: 20,
        marginTop: '3%',
        alignItems: 'center',
        width: '100%',
    },

    botaoTextoExcluir: {
        color: "#fbbbb8ff",
        fontSize: 20,
        textAlign: "center",
    },

    containerBotoesPlanejamento: {
        justifyContent: 'center',
        width: '100%',
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContainer: {
        width: '90%',
        backgroundColor: '#fffdff',
        borderRadius: 25,
        padding: '5%',
        elevation: 10,
    },

    modalTitulo: {
        fontSize: 26,
        color: '#038C8C',
        textAlign: 'center',
        marginBottom: '5%',
    },

    modalSubtitulo: {
        fontSize: 20,
        color: '#0E3939',
        textAlign: 'center',
        marginBottom: '3%',
    },

    modalInput: {
        borderWidth: 1,
        borderColor: '#038C8C',
        borderRadius: 15,
        padding: '5%',
        fontSize: 18,
        color: '#0E3939',
        marginBottom: '6%',
    },

    modalBotoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    modalBotao: {
        flex: 1,
        marginHorizontal: '1.5%',
        paddingVertical: '4%',
        borderRadius: 15,
        alignItems: 'center',
    },

    modalTextoBotao: {
        color: '#fffdff',
        fontSize: 18,
    },

    // Sem planejamento;
    semPlanejamento: {
        flex: 1,       
        width: '100%',
        alignItems: 'center',   
        justifyContent: 'center',
    },

    textoSemPlanejamento: {
        fontSize: 20,
        color: '#333',
        opacity: 0.7,
        textAlign: 'center',
    },

});

export default estiloPlanejamento;