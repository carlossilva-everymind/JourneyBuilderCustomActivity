const { v1: Uuidv1 } = require('uuid');
const JWT = require('../utils/jwtDecoder');
const SFClient = require('../utils/sfmc-client');
const logger = require('../utils/logger');

/**
 * The Journey Builder calls this method for each contact processed by the journey.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.execute = async (req, res) => {
  // decode data
  const data = JWT(req.body);

  logger.info(data);

  try {
    const id = Uuidv1();

    await SFClient.saveData(process.env.DATA_EXTENSION_EXTERNAL_KEY, [
      {
        keys: {
          Id: id,
          SubscriberKey: data.inArguments[0].contactKey,
        },
        values: {
          Event: data.inArguments[0].DropdownOptions,
          Text: data.inArguments[0].Text,
        },
      },
    ]);
  } catch (error) {
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
  // decode data
  const data = JWT(req.body);
  console.log('Validating', data);
  const { activityObjectID } = data;

  try {
    const journeyInfo = await SFClient.getJourneyInfo(data.interactionKey);
    const regex = /%%(.*)%%/g;
    const { metaData: { eventDefinitionKey } } = journeyInfo.triggers[0];
    /* console.log('Atividades da jornada: ', journeyInfo.activities);
    console.log('EventDefinitionKey', eventDefinitionKey);
    console.log('activityObjectID', activityObjectID); */
    for (let i = 0; i < journeyInfo.activities.length; i += 1) {
      if (journeyInfo.activities[i].id === activityObjectID) {
        const [inArguments] = journeyInfo.activities[i].arguments.execute.inArguments;
        console.log('inArguments', inArguments);
        Object.keys(inArguments).forEach((key) => {
          inArguments[key] = inArguments[key].replace(regex, `Event.${eventDefinitionKey}.$1`);
        });
        console.log(`inArguments da atividade ${activityObjectID}:`, inArguments);
        journeyInfo.activities[i].arguments.execute.inArguments = inArguments;
      }
    }
    //console.log('journeyInfo', journeyInfo);
    //const updateJourneyResponse = await SFClient.updateJourney(data.interactionKey, journeyInfo);
    //console.log('Resposta da API do mkt cld:', JSON.stringify(updateJourneyResponse.body));
  } catch (error) {
    logger.error(error);
  }

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
