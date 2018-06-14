var jwt = require('jsonwebtoken');
var moment = require('moment');

module.exports = {

   friendlyName: 'Refresh Token',

   description: 'Look up the specified token, refresh and return',

   exits: {
      tokenNotFound: {
        description: 'Token must be specified.',
        responseType: 'notFound'
      },
      invalidToken: {
        description: 'Specified token was not found.',
        responseType: 'notFound'
      },
   },

   fn: async function (inputs, exits) {

      var token = this.req.headers["x-token"];
      if( !token ){
          return exits.tokenNotFound();
      }

      var dbToken = await Token.findOne({ token_value: token }).populate('client');
      if( !dbToken ){
          return exits.invalidToken();
      }

      var clientId = dbToken.client.id;
      await Token.destroy({ client: clientId });

      var tokenVal = jwt.sign({ client_id: clientId }, sails.config.crypto.secretKey);
      var expires_at = moment().add(sails.config.custom.tokenExpireMinutes, 'm').toDate();

      var tokenObj = { token_value:tokenVal, expires_at: expires_at, client: clientId };
      var newToken = await Token.create( tokenObj ).fetch();

      return exits.success(newToken);
   }
};
