// api/models/Client.js

var SHA256 = require("crypto-js/sha256");

/*
 *  Represents a client with access to the API
 */
module.exports = {

  attributes: {
    name: { type: 'string', required: true },
    description: { type: 'string' },
    client_key: { type: 'string', required: true },
    client_secret: { type: 'string', required: true },
    token: {
      collection:'token',
      via: 'client'
    }
  },

  labels: {
    name: {
      title: "Name"
    },
    description: {
      title: "Description"
    },
    client_key: {
      title: "Client Key"
    },
    client_secret: {
      title: 'Client Secret'
    },

    // Override toJSON method to remove password from API
    toJSON: function() {
      var obj = this.toObject();
      delete obj.client_secret;
      return obj;
    }

  },

};
