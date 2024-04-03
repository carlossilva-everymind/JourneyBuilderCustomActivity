const { v1: Uuidv1 } = require('uuid');
const JWT = require('../utils/jwtDecoder');
const SFClient = require('../utils/sfmc-client');
const logger = require('../utils/logger');
// const https = require('https');
const axios = require('axios');
const SFMCClient2 = require('../utils/sfmc-client2');

/*
  Arquivo de configuração das rotas do backend da atividade customizada
*/

/**
 * The Journey Builder calls this method for each contact processed by the journey.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.execute = async (req, res) => {
  // decode data
  const data = JWT(req.body);
  console.log('Execute - Dados decodificados: ', data)
  logger.info(data);

  const dataReceived = JSON.stringify(data, null, 0);
  console.log('dataReceived', dataReceived);

  const {
    idAgendamento,
    StatusAgendamento,
    dataExtensionID,
    confirmacaoText,
    confirmacaoBoolean } = data.inArguments[0];

  let sfmcToken;

  try {
    const id = Uuidv1();

    let authToken;

    // chamada para token do motion
    const headers = {
      "client_id": "adbb826a4a4a4f1f955d91125f066d65",
      "client_secret": "B2fb771Fee944f8DB3B6D18e284f528d",
      "grant_type": "CLIENT_CREDENTIALS"
    }
    let authResponse = await axios.post('https://oauth-app-hml.br-s1.cloudhub.io/token', null, {
      headers
    })
      .then(response => {
        console.log(response.data);
        authToken = response.data.access_token;
        return response.data;
      }).catch(error => {
        console.error(error);
      });
    console.log('authResponse', authResponse);
    console.log('authToken', authToken);

    // chamada para motion confirmação
    let postBody = {
      status: StatusAgendamento
    }
    console.log('post body motion: ', postBody);
    let responseMotion = await axios.put('https://proxy-motion-hml.br-s1.cloudhub.io/appointment/' + idAgendamento,
      postBody,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    )
      .then(response => {
        console.log('Response:', response.data);
      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          let { data, status, headers } = error.response;
          // throw `Error at motion call: Response: ${JSON.stringify(data)} - Response Status ${status}`
        } else if (error.request) {
          // The request was made but no response was received
          throw `Error at motion call: Request: ${JSON.stringify(error.request)}`
        } else {
          // Something happened in setting up the request that triggered an Error
          throw `Error at motion call: ${JSON.stringify(error.message)}`
        }
      });

    // atualiza dados na DE
    await SFClient.saveDataByID(dataExtensionID, [
      {
        keys: {
          codigoAgendamentoMotion: idAgendamento,
        },
        values: {
          [confirmacaoText]: 'CANCELADO_teste', // utilizar a resposta do motion
          [confirmacaoBoolean]: false, // utilizar resposta do motion
        },
      },
    ]).then(response => {
      if (response.res.statusCode >= 400) {
        throw `Error Updating Status to entry DE: ${JSON.stringify(response.body)}`
      }
    });


  } catch (error) {
    logger.error(error);
    console.log('Error: ', error);
    const id = Uuidv1();
    let errorPostBody = [
      {
        keys: {
          Id: id,
        },
        values: {
          ActivityID: data.activityId,
          PayloadReceived: dataReceived,
          ErrorMessage: JSON.stringify(error),
        },
      },
    ]
    // esse id por ir para variavel de ambiente
    await SFClient.saveData('3118D3BD-F6F5-4B67-8FFA-FC21E66811D6', errorPostBody).then(response => {
      if (response.res.statusCode >= 400) {
        logger.error(`Error adding to error DE request body: ${JSON.stringify(errorPostBody)}`)
        logger.error(`Error adding to error DE response: ${JSON.stringify(response.body)}`)
      }
    });
  }

  res.status(200).send({
    status: 'ok',
  });
};

/**
 * Endpoint that receives a notification when a user saves the journey.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.save = (req, res) => {
  res.status(200).send({
    success: true,
  });
};

/**
 *  Endpoint that receives a notification when a user publishes the journey.
 * @param req
 * @param res
 */
exports.publish = (req, res) => {
  res.status(200).send({
    status: 'ok',
  });
};

/**
 *  Endpoint that receives a notification when a user publishes the journey.
 * @param req
 * @param res
 */
exports.unpublish = (req, res) => {
  res.status(200).send({
    status: 'ok',
  });
};

/**
 * Endpoint that receives a notification when a user performs
 * some validation as part of the publishing process.
 * @param req
 * @param res
 */
exports.validate = async (req, res) => {
  res.status(200).send({
    success: true,
  });
};

/**
 * Endpoint that receives a notification when a user performs
 * some validation as part of the publishing process.
 * @param req
 * @param res
 */
exports.stop = (req, res) => {
  res.status(200).send({
    success: true,
  });
};
/**
 * Endpoint that receives a notification when a user performs
 * some validation as part of the publishing process.
 * @param req
 * @param res
 */
exports.testsave = (req, res) => {
  res.status(200).send({
    success: true,
  });
};
