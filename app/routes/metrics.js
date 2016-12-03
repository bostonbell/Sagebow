const serveFile = require('../utilities/serving.js').serveFile,
      debugMessage = require('../utilities/debug.js').debugMessage,
      express = require('express'),
      router = express.Router();

//
// TODO: SEPERATE OUT!!
const redisConn = require('redis').createClient(),
      bcrypt = require('bcryptjs');
//
//

// Setup Static Serve
//
// Serves the static markup for the setup page.
router.get('/metrics', function(req, res) {
    debugMessage("Recieved a GET on /setup.");
    serveFile('metrics.html', res);
});

module.exports = router;