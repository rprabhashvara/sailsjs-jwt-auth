module.exports = {

   friendlyName: 'Get Client',

   description: 'Returns the client',

   inputs: {
     client_key: {
       description: 'Client API Key',
       type: 'string',
       required: true
     }
   },

   exits: {
      notFound: {
        description: 'Client Not Found.',
        responseType: 'notFound'
      }
   },

   fn: async function (inputs, exits) {

      var client = await Client.findOne({ client_key: inputs.client_key });
      if( !client ){
          return exits.notFound();
      }

      return exits.success(client);
   }
};
