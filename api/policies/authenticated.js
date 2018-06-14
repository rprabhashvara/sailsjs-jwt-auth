// policies/authenticated.js

module.exports = async function(req, res, next) {

  // get token from header an validate it
  var token = req.headers["x-token"];

  function send401() {
    res.send(401, {err: 'E_TOKEN_REQUIRED', message: 'Token required'});
  }

  function sendTokenExpired(){
    res.send(401, {err: 'E_TOKEN_EXPIRED', message: 'Token expired'});
  }

  // validate we have all params
  if(!token) return send401();

  // validate token and set req.Client if we have a valid token
  var client = await sails.helpers.verifyToken(token).
                    intercept('tokenNotFound', function(data){ return send401() }).
                    intercept('tokenExpired', function(data){ return sendTokenExpired() });
  if( client ){
    req.Client = client;
    // get and set mask here with the use of a helper
    next();
  }

};
