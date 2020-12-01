import {imonovLeads} from './core-leads.min.js'


/***
 * CONFIGURAÇÃO DO MÓDULO DE LEADS
 */
imonovLeads.staticTokenImonov = ''; // TOKEN FORNECIDO PELA SI9 SISTEMAS
imonovLeads.staticNameCookie = 'deumnomeunicoeexclusivoparacadacoockie';
imonovLeads.staticUserSi9 = ""; // USER FORNECIDO PELA SI9 SISTEMAS
imonovLeads.staticPassSi9 = ""; // PASS FORNECIDO PELA SI9 SISTEMAS


/***
 * Functions visiveis
 */
window.actionEnviarContato = enviarContatoFn;       // Enviar Contado
window.setFeedbackImmobile = setFeedbackImmobileFn; // Contato (feedback imóvel)
window.fakeDados = fakeDadosFn;                     // Setar dados falsos para teste
window.closeMsgSuccessImoLead = closeMensageSuccess;// Limpa mensagem de sucesso request


/***
 * SE EXISTIR O COOKIE ENTÃO BUSQUE O INTERESSADO
 */
let idInteressadoByCookie = imonovLeads.getCookie(imonovLeads.staticNameCookie);

if (idInteressadoByCookie) {
    (async () => {
        await getInteressado(idInteressadoByCookie);
    })();
}

/***
 * Valida ação de envio caso não autorizado e persiste o envio
 */
async function handleErrors(response) {

    // Persistencia caso der erro 401
    if(response.status === 401){
        window.sessionStorage.removeItem('tokenLeadsImonov');
        await imonovLeads.generateToken();

        // Se houver cookie então busque
        if(idInteressadoByCookie)
            await getInteressado(idInteressadoByCookie);
        else
            enviarContatoFn();
    }

    if (!response.ok) {
        throw Error(response.statusText);
    }

    return response.json();
}


/***
 * Dados falsos para testar
 */
function fakeDadosFn() {
    var clienteFake = {
        name: "Vinícius Magnabosco",
        classification: "high",
        interestedIn: "buy",
        source: "46999838737",
        cellNumber: "46999838737",
        phoneNumber: "46999838737",
        email: "vh.magna@gmail.com",
        observation: "Teste Teste Teste Teste Teste Teste",
    }
    setInteressadoFn(clienteFake);
}


/***
 * DEFININDO A FUNÇÃO DE ENVIO DO BUTTON
 */
async function enviarContatoFn() {

    /***
     * Validar as informações antes de enviar
     */
    let cliente = {
        id: document.getElementById("idLeadSi9").value,
        name: document.getElementById("nameLeadSi9").value,
        classification: document.getElementById("classificationLeadSi9").value,
        interestedIn: document.getElementById("interestedInLeadSi9").value,
        source: document.getElementById("sourceLeadSi9").value,
        cellNumber: document.getElementById("cellNumberLeadSi9").value,
        phoneNumber: document.getElementById("phoneNumberLeadSi9").value,
        email: document.getElementById("emailLeadSi9").value,
        observation: document.getElementById("observationLeadSi9").value,
    }

    /***
     * Envia para o Core-Leads
     */
    await imonovLeads.enviarContato(cliente);
}


async function getInteressado(idInteressado) {
    let tokenSession1hora = await imonovLeads.generateToken();

    let tokenSendAcess = tokenSession1hora.result.token_type.toString() + " " +
        tokenSession1hora.result.access_token.toString();

    let myHeaders = new Headers();
    myHeaders.append("Authorization", tokenSendAcess);
    let requestOptions = {method: 'GET', headers: myHeaders};

    fetch("https://api.si9sistemas.com.br/imobilsi9-api/lead/" + idInteressado, requestOptions)
        .then(handleErrors)
        .then(async (response) => {
            let resultado = await response;

            /***
             * Manipulação Retorno Interessado
             */
            console.log('Retorno Interessado', resultado);

            setInteressadoFn(resultado);

        }).catch((error) => {
        console.log("catch => "+error)
    });
}


/***
 * TODO // ( tem que ver com o tio luiz para ele não retornar nem um
 * TODO // contato pessoal do interessado e conseguir identificar isso
 * TODO // com o id na hora de receber ... )
 */
function setInteressadoFn(resultado) {
    document.getElementById("idLeadSi9").value = resultado.id ? resultado.id : null;
    document.getElementById("nameLeadSi9").value = resultado.name ? resultado.name : null;
}


/***
 * DEFININDO A FUNÇÃO DE ENVIO FEEDBACK DENTRO DO IMÓVEL DO BUTTON
 */
async function setFeedbackImmobileFn(){

    let cliente = {
        name: document.getElementById("nameLeadSi9").value,
        classification: document.getElementById("classificationLeadSi9").value,
        interestedIn: document.getElementById("interestedInLeadSi9").value,
        source: null,
        cellNumber: document.getElementById("cellNumberLeadSi9").value,
        phoneNumber: document.getElementById("phoneNumberLeadSi9").value,
        email: document.getElementById("emailLeadSi9").value,
        observation: null,
        contacts: [{
            propertyId:document.getElementById("idImmobileProperty").value,
            observation:document.getElementById("immobilePropertyObs").value
        }]
    }

    await imonovLeads.enviarContato(cliente);
}


/***
 * Btn limpar mensagem retorno (ação não necessária)
 */
function closeMensageSuccess() {
    document.getElementById("imonov-lead-msg").innerHTML = "";
}
