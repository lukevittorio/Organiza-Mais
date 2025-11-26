import { StyleSheet } from "react-native";

const estiloHome = StyleSheet.create({
    // Estilização Geral;
    gradient: {
        flex: 1, // Cobrindo toda a tela;
    },

    container: {
        flex: 0.6,
        backgroundColor: '#fffdff',
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        paddingTop: '9%',
    },

    // Header;
    containerheader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: '5%',
        width: '100%',
    },

    img: {
        width: 70,
        height: 70,
        flexShrink: 0,
        borderRadius: 40,
    },

    textoHeader: {
        color: '#0E3939',
        fontSize: 26,
        flexShrink: 1,
        flexGrow: 1,
        marginLeft: '43%',
    },

    // Saldo;
    containersaldo: {
        alignItems: "center",
        margin: '4%',
    },

    titulosaldo: {
        color: '#038C8C',
        fontSize: 36,
    },

    saldo: {
        fontSize: 32,
    },

    saldoPositivo: {
        color: '#0E3939'
    },

    saldoNegativo: {
        color: '#ce1515ff'
    },

    linhaSaldoOculto: {
        width: 100,
        height: 32,
        backgroundColor: "rgba(0,0,0,0.15)",
        borderRadius: 6,
    },

    // Scroll;
    scrollContent: {
        flex: 3,
        paddingHorizontal: '5%',
        paddingVertical: '7%',
    },

    // Box;
    containerbox: {
        backgroundColor: '#fffdff',
        borderRadius: 50,
        padding: '6%',
        alignItems: "center",
        marginVertical: '4%',
    },

    // Transações;
    textoTransacoes: {
        fontSize: 20,
        textAlign: 'center',
        color: '#0E3939',
    },

    // Gráfico;
    graficoContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        justifyContent: "flex-start",
        paddingLeft: '52%',
    },

    graficoWrapper: {
        flex: 3,
        alignItems: "center",
    },

    graficoLegenda: {
        flex: 200,
        justifyContent: "center",
    },

    legendaItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },

    legendaQuadrado: {
        width: 14,
        height: 14,
        borderRadius: 3,
        marginRight: 8,
    },

    legendaTexto: {
        fontSize: 12,
        color: "#0E3939",
    },

    // Planejamento;
    textoplanejamento: {
        fontSize: 24,
        textAlign: 'center',
        color: '#79C704',
    },

    saldoplanejamento: {
        fontSize: 24,
        textAlign: 'center',
        color: '#0E3939',
    },

    textoSemPlanejamento: {
        fontSize: 20,
        color: "#0E3939",
        textAlign: "center",
    },

    planejamentoPositivo: {
        color: '#0E3939'
    },

    planejamentoNegativo: {
        color: '#ce1515ff'
    },

    containerDevendo: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
});

export default estiloHome;