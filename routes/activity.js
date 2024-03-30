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
    
    // atualiza dados na DE

    // sfmcToken = await SFMCClient2.getToken();
    // console.log('sfmcToken', sfmcToken);


    // await axios.post(`https://${process.env.SFMC_SUBDOMAIN}.auth.marketingcloudapis.com/v2/token`,
    //   {
    //     "client_id": process.env.SFMC_CLIENT_ID,
    //     "client_secret": process.env.SFMC_CLIENT_SECRET,
    //     "grant_type": "client_credentials",
    //     "account_id": process.env.SFMC_ACCOUNT_ID
    //   }
    // ).then(response => {
    //   console.log('sfmc token response:', response);
    // }).catch(error => console.log('sfmc token error:', error))

    await SFClient.saveData(process.env.DATA_EXTENSION_EXTERNAL_KEY, [
      {
        keys: {
          Id: id,
          SubscriberKey: data.inArguments[0].contactKey,
        },
        values: {
          Event: data.inArguments[0].idAgendamento,
          Text: data.inArguments[0].StatusAgendamento,
        },
      },
    ]);



    await SFClient.saveData('3118D3BD-F6F5-4B67-8FFA-FC21E66811D6X', [
      {
        keys: {
          Id: id,
        },
        values: {
          ActivityID: data.activityId,
          PayloadReceived: dataReceived,
          ErrorMessage: 'teste',
        },
      },
    ]).then(response => { 
      console.log('response save data: ', response.body)
      console.log('response save data: ', response)
     })
  } catch (error) {
    if (!sfmcToken) {
      try {
        sfmcToken = await SFMCClient2.getToken();
      } catch (error) {
        console.log(error);
      }
    }
    if (sfmcToken) {

    }

    logger.error(error);
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
