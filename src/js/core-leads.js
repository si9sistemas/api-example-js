/**
 * CORE-LEADS | SI9 SISTEMAS
 */
const rootApi = "https://api.si9sistemas.com.br/imobilsi9-api";
// const rootApi = "http://192.168.0.111:2222/imobilsi9-api";
const staticTokenImonov = null;
const staticNameCookie = null;
const actionCore = null;
const clidados = null;

/***
 * Está função a seguir retornará o Token automaticamente sendo ele da Session ou Request
 */
const generateTokenFn = async (refresh) => {
    if (refresh)
        console.log("REFRESH  ==>>>> ", refresh);

    if (window.sessionStorage.tokenLeadsImonov && !refresh) {

        let tokenImonov = JSON.parse(window.sessionStorage.tokenLeadsImonov);

        let date2 = new Date(),                          // data atual
            date1 = new Date(tokenImonov.dataTimeToken); // data geração do token sessionStorage
        let diffMs = (date2 - date1);
        let diffHrs = Math.floor((diffMs % 86400000) / 3600000);
        let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
        let diff = diffHrs + 'h ' + diffMins + 'm';
        console.log("TEMPO DE VIDA TOKEN SESSION :" + diff + " | " + diffMs / 1000 + " segundos");

        if ( (diffMs / 1000) > tokenImonov.result.expires_in || (diffMs / 1000) < -0 ) {
            /***
             * Refresh Token
             * let tokenSendRefresh = "bearer " + tokenImonov.result.refresh_token; // Refresh para Login
             */
            window.sessionStorage.removeItem('tokenLeadsImonov');

            tokenImonov = await getSessionAuth(imonovLeads.staticTokenImonov);
            console.log("IF REFRESH TOKEN => ",tokenImonov);
        }

        tokenImonov.origem = "storage";
        return await tokenImonov;

    } else {

        /***
         * If se a solicitação veio de um Refresh Token ou se é Novo Token
         * */
        let tokenLeadsImo = refresh ? refresh : imonovLeads.staticTokenImonov;

        let myHeaders = new Headers();
        myHeaders.append("Authorization", tokenLeadsImo);

        let requestOptions = {
            method: 'POST',
            headers: myHeaders
        };

        let urlAuthToken =
            rootApi + "/oauth/token?" +
            "grant_type=password" +
            "&username=" + imonovLeads.staticUserSi9 +
            "&password=" + imonovLeads.staticPassSi9;

        const response = (await fetch(urlAuthToken, requestOptions).then(handleErrors));

        // let tpOrigem = refresh ? 'refresh': 'request';

        return {result: await response, origem: 'request'};
    }
};


/***
 * Função que faz o envio do contato para o backend
 */
const sendContactFn = async (tokenSession1hora) => {
    let myHeaders = new Headers();
    let tokenSendAcess = tokenSession1hora.result.token_type.toString() + " " +
        tokenSession1hora.result.access_token.toString();
    myHeaders.append("Authorization", tokenSendAcess);
    myHeaders.append("Content-Type", "application/json");

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(imonovLeads.clidados)
    };

    fetch(rootApi + "/lead", requestOptions)
        .then(handleErrors)
        .then(result => {

            /***
             * TODO precisa ser refatorado conforme a LGPD caso o usuário não queira gravar dados.
             * Salvando os dados do Cookie
             */
            console.log("retornou interessado => ",result);


            if (result.id) {
                setCookieSessionFn(imonovLeads.staticNameCookie, result.id.toString());
            }

            var retornarNome = imonovLeads.clidados.name ? imonovLeads.clidados.name : imonovLeads.clidados.email;

            document.getElementById("imonov-lead-msg").innerHTML = '' +
                '<div class="alert alert-success alert-dismissible fade show" role="alert">\n' +
                '  <strong>Olá! ' + retornarNome + '</strong> Seu contato foi enviado com sucesso!\n' +
                '  <button type="button" onclick="closeMsgSuccessImoLead()" ' +
                'class="close" data-dismiss="alert" aria-label="Close">\n' +
                '    <span aria-hidden="true">&times;</span>\n' +
                '  </button>\n' +
                '</div>';
            return result;
        })
        .catch(error => {
            console.log(error);
        });
};


async function handleErrors(response) {
    console.log(response);

    if(response.status === 401){
        window.sessionStorage.removeItem('tokenLeadsImonov');
        await getSessionAuth(imonovLeads.staticTokenImonov);
        // await enviarContatoFn();
        await getSessionAuth().then(result => {
            sendContactFn(result);
        });
    }

    if (!response.ok) {

        throw Error(response.statusText);
    }

    return response.json();
}


/***
 * SALVAR SESSÃO E ENVIAR CONTATO
 */
async function enviarContatoFn(objetoCliente) {
    imonovLeads.clidados = objetoCliente ? JSON.parse(JSON.stringify(objetoCliente)): imonovLeads.clidados;

    await getSessionAuth().then(result => {
        sendContactFn(result);
    });
}


/**
 * TODO precisa validar a questão do ';secure' que está programado para permitir uso do cookie somente com HTTPS
 * FUNÇÕES PARA VERIFICAR LOGIN COM COOKIE ATÉ 30 DIAS E BUSCAR INTERESSADO NO SISTEMA
 */
function setCookieSessionFn(chave, valor) {
    console.log('SET COOKIE SESSION',chave,valor);

    let isHttpServer = location.protocol !== 'https:' ? '' : ';secure';
    isHttpServer += '; isHttpOnly ; SameSite=Strict';
    let dadosCookie = chave.toString() + "=" +
        valor.toString() + ";max-age=2592000" + isHttpServer;
    document.cookie = dadosCookie;
}


function getCookieFn(name) {
    let dadosCookie = document.cookie;
    if (dadosCookie) {
        let objectCookies = dadosCookie.split(';');
        for (let i = 0; i < objectCookies.length; i++) {
            let itemCookie = objectCookies[i].split('=');
            if (itemCookie[0] === name && itemCookie[1] && itemCookie[1] !== '')
                return itemCookie[1];
        }
    }
}


function setFeedbackFn(id, feedback){

    // let idInteressado = getCookieFn(imonovLeads.staticNameCookie);
    // possibilidade de multiplos feedbacks quando ja houver informações na sessão

    if(window.sessionStorage.stgImmobileFeedbacks){
        let properties = JSON.parse(window.sessionStorage.stgImmobileFeedbacks);
        console.log(properties);
        properties.push({observation:feedback,propertyId:id});
        window.sessionStorage.stgImmobileFeedbacks = JSON.stringify(properties);
    }else{
        /***
         * init feedbacks
         */
        window.sessionStorage.stgImmobileFeedbacks = JSON.stringify([{observation:feedback,propertyId:id}]);
    }
}


function checkIfExistsFeedbackFn(idImmobile){
    let properties = JSON.parse(window.sessionStorage.stgImmobileFeedbacks),
        count = 0;
    for(let i=0;i < properties.length;i++){
        if(properties[i].propertyId === idImmobile)
            count++;
    }
    return count;
}

async function getSessionAuth(refresh) {
    let tokenSend = await generateTokenFn(refresh);

    console.log("Token Recebido: ", tokenSend);

    if (tokenSend.origem === 'request') {
        tokenSend.dataTimeToken = new Date();// Salvando a cata de gravação
        console.log("TOKEN SEND => ",tokenSend);
        window.sessionStorage.tokenLeadsImonov = JSON.stringify(tokenSend);
    }

    return await tokenSend;
}

const imonovLeads = {
    /*Token Estático*/
    rootApi: rootApi,
    staticTokenImonov: staticTokenImonov,
    staticNameCookie: staticNameCookie,
    actionCore: actionCore,
    clidados: clidados,


    /*Functions Module Auth*/
    generateToken: getSessionAuth,
    enviarContato: enviarContatoFn,


    /*Envio de lead após autenticado*/
    sendContact: sendContactFn,


    /*Manipulação dados Cookie*/
    setCookieSession: setCookieSessionFn,
    getCookie: getCookieFn,


    setFeedback: setFeedbackFn,
    checkIfExistsFeedback: checkIfExistsFeedbackFn
};

export {imonovLeads};