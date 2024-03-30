const { response } = require('express');
const axios = require('axios');

const getToken = async () => {
  axios.post(`https://${process.env.SFMC_SUBDOMAIN}.auth.marketingcloudapis.com/v2/tokena`,
    {
      "client_id": process.env.SFMC_CLIENT_ID,
      "client_secret": process.env.SFMC_CLIENT_SECRET,
      "grant_type": "client_credentials",
      "account_id": process.env.SFMC_ACCOUNT_ID
    }
  ).then(response => {
    console.log('sfmc token response:', response.data);
    return response.data;
  }).catch(error => {
    throw 'SFMC token error: ' + error;
  })
}

// const insertDataInDataExtension = async () => axios.post(`/hub/v1/dataevents/key:${externalKey}/rowset`)


module.exports = {
  getToken,
};
