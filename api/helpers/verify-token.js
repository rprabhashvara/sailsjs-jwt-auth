var moment = require('moment');

module.exports = {

  friendlyName: 'Verify Token',


  description: 'Verifies a Token and returns the client',


  inputs: {

    token: {
      type: 'string',
      example: '',
      description: 'Client Token',
      required: true
    }

  },

  exits: {
    tokenNotFound: {
      description: 'No token found',
    },
    tokenExpired: {
      description: 'Token was expired'
    }
  },


  fn: async function (inputs, exits) {

    var token = await Token.findOne({ token_value: inputs.token }).populate('client');
    if( !token ){
        return exits.tokenNotFound();
    }

    var currentTime = moment().toDate();
    var expires_at = moment(token.expires_at).toDate();

    if( currentTime >= expires_at ){
        return exits.tokenExpired();
    }

    var client = token.client;

    return exits.success( client );

  }

};
