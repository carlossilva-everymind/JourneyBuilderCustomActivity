const { response } = require('express');
const axios = require('axios');

const baseURL = `https://${process.env.SFMC_SUBDOMAIN}.rest.marketingcloudapis.com/`;

const getToken = async () => {
  return axios.post(`https://${process.env.SFMC_SUBDOMAIN}.auth.marketingcloudapis.com/v2/tokena`,
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

const insertDataInDataExtension = async (authToken, DEExternalKey, bodyData) => {
  return axios.post(`${baseURL}hub/v1/dataevents/key:${DEExternalKey}/rowset`,
    bodyData,
    {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }).then(response => {
      console.log('sfmc insert data response:', response.data);
      return response.data;
    }).catch(error => {
      throw 'SFMC insert data error: ' + error;
    })
}


module.exports = {
  getToken,
  insertDataInDataExtension,
};
