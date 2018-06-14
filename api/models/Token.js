// api/models/Token.js

/*
 *  Represents a JWT Token
 */
 module.exports = {

   attributes: {
     token_value: { type: 'string', required: true },
     expires_at: { type: 'string', required: true },
     client: {
       model:'client',
       unique: true
     }
   },

   labels: {
     token_value: {
       title: "Token Value"
     },
     expires_at: {
       title: "Expires At"
     },

   },

 };
