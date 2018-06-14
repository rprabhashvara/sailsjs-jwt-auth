var jwt = require('jsonwebtoken');
var moment = require('moment');

module.exports = {

   friendlyName: 'Create Token',

   description: 'Look up the specified client, create a token and return',

   inputs: {
      client_key: {
        description: 'Client API Key',
        type: 'string',
        required: true
      },
      client_secret: {
        description: 'Client API Secrey',
        type: 'string',
        required: true
      }
   },

   exits: {
      clientNotFound: {
        description: 'No client with the specified Key was found in the database.',
        responseType: 'notFound'
      }
   },

   fn: async function (inputs, exits) {

      var client = await Client.findOne({ client_key: inputs.client_key, client_secret: inputs.client_secret }).populate('token');
      if( !client ){
          return exits.clientNotFound();
      }

      async function deleteTokens(tokens){
          const promises = tokens.map( async (item) => {
            await Token.destroy(item);
          })
          await Promise.all(promises);
      }

      await deleteTokens(client.token);

      var tokenVal = jwt.sign({ client_id: client.id }, sails.config.crypto.secretKey);
      var expires_at = moment().add(sails.config.custom.tokenExpireMinutes, 'm').toDate();

      var tokenObj = { token_value:tokenVal, expires_at: expires_at, client: client.id };
      var newToken = await Token.create( tokenObj ).fetch();

      return exits.success(newToken);
   }
};
