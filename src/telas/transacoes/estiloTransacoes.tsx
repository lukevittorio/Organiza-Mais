import { StyleSheet } from "react-native";

const estiloTransacoes = StyleSheet.create({
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
        padding: '10%',
        alignItems: 'flex-start',
        marginVertical: '2%',
        width: '100%',
        height: '100%',
    },

    resumo: {
        color: '#038C8C',
        fontSize: 36,
        paddingBottom: '6%',
        alignItems: 'center',
    },

    centralizar: {
        width: '100%',
        alignItems: "center",
    },

    containertransacoes: {
        paddingVertical: '1%',
        flex: 0,
        flexDirection: 'row',
        alignItems: "center",
    },

    valortransacao: {
        color: '#0E3939',
        fontSize: 24,
        paddingRight: '3%',
    },

    categoriatransacaoReceita: {
        color: '#2B520342',
        fontSize: 16,
        alignSelf: 'center',
    },

    categoriaReceita: {
        backgroundColor: '#adff5b42',
        paddingVertical: '3%',
        paddingHorizontal: '8%',
        borderRadius: 10,
    },

    categoriatransacaoDespesa: {
        color: '#0E393947',
        fontSize: 16,
        alignSelf: 'center',
    },

    categoriaDespesa: {
        backgroundColor: '#6ED6CB37',
        paddingVertical: '3%',
        paddingHorizontal: '8%',
        borderRadius: 10,
    },

    // Botão;
    botaoRec: {
        backgroundColor: '#adff5b42',
        paddingVertical: '3%',
        paddingHorizontal: '8%',
        borderRadius: 10,
        marginTop: '9%',
        width: '100%',
    },

    botaoDesp: {
        backgroundColor: '#6ED6CB37',
        paddingVertical: '3%',
        paddingHorizontal: '8%',
        borderRadius: 10,
        marginTop: '3%',
        width: '100%',
    },

    botaoTextoRec: {
        color: "#2B520342",
        fontSize: 16,
        textAlign: "center",
    },

    botaoTextoDesp: {
        color: "#0E393947",
        fontSize: 16,
        textAlign: "center",
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

    // Funções de editar e excluir;
    deleteButton: {
        fontSize: 24,
    },

    editButton: {
        paddingRight: '4%',
        fontSize: 24,
    },

    functions: {
        flexDirection: 'row',
        alignItems: "center",
        padding: '4%',
    },

    // Sem transação adicionada;
    centralizarTexto: {
        flex: 1,       
        width: '100%',
        alignItems: 'center',   
        justifyContent: 'center',
    },

    texto: {
        fontSize: 20,
        color: '#333',
        opacity: 0.7,
        textAlign: 'center',
    },

});

export default estiloTransacoes;