const { response } = require('express');
const FuelRest = require('fuel-rest');

const options = {
  auth: {
    clientId: process.env.SFMC_CLIENT_ID,
    clientSecret: process.env.SFMC_CLIENT_SECRET,
    authOptions: {
      authVersion: 2,
      accountId: process.env.SFMC_ACCOUNT_ID,
    },
    authUrl: `https://${process.env.SFMC_SUBDOMAIN}.auth.marketingcloudapis.com/v2/token`,
  },
  origin: `https://${process.env.SFMC_SUBDOMAIN}.rest.marketingcloudapis.com/`,
  globalReqOptions: {
  },
};

const client = new FuelRest(options);

/**
 * Save data in DE
 * @param externalKey
 * @param data
 * @returns {?Promise}
 */
const saveData = async (externalKey, data) => client.post({
  uri: `/hub/v1/dataevents/key:${externalKey}/rowset`,
  headers: {
    'Content-Type': 'application/json',
  },
  json: true,
  body: data,
});

/**
 * Get data of journey
 * @param interactionKey
 * @returns {?Promise}
 */
const getJourneyInfo = async (interactionKey) => {
  const bodyResponse = await client.get({
    uri: `/interaction/v1/interactions/key:${interactionKey}/`,
    headers: {
      'Content-Type': 'application/json',
    },
    json: true,
  })
    .then((resp) => resp.body);
  return bodyResponse;
};

/**
 * Save data in DE
 * @param externalKey
 * @param data
 * @returns {?Promise}
 */
const updateJourney = async (interactionKey, data) => {
  const apiResponse = client.put({
    uri: `/interaction/v1/interactions/key:${interactionKey}/`,
    headers: {
      'Content-Type': 'application/json',
    },
    json: true,
    body: data,
  })
    .then((resp) => resp);
  return apiResponse;
};

module.exports = {
  client,
  saveData,
  getJourneyInfo,
  updateJourney,
};
