const { response } = require('express');
const axios = require('axios');

const getToken = async () => axios.post(`https://${process.env.SFMC_SUBDOMAIN}.auth.marketingcloudapis.com/v2/tokena`,
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
  console.log('sfmc token error:', error);
  throw 'SFMC token error: ' + error;
})


module.exports = {
  getToken,
};
