var logger = require('pomelo-logger').getLogger('log', __filename, process.pid);
module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

var portCfgOfWestEuro = [
    {
        x:6,
        y:9,
        port_name:'Lisbon',
        port_img:'res/Ports/lisbon.png',
        port_desc:'这里是里斯本，葡萄牙首都'
    },
    {
        x:18,
        y:17,
        port_name:'Sevilla',
        port_img:'res/Ports/Sevilla.png',
        port_desc:'这里是塞维利亚，西班牙首都'
    },
    {
        x:26,
        y:5,
        port_name:'Valencia',
        port_img:'res/Ports/Sevilla.png',
        port_desc:'这里是瓦伦西亚，西班牙港口'
    }
];

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = function(msg, session, next) {
  next(null, {code: 200, msg: 'game server is ok.'});
};

/**
 * Publish route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.publish = function(msg, session, next) {
	var result = {
		topic: 'publish',
		payload: JSON.stringify({code: 200, msg: 'publish message is ok.'})
	};
  next(null, result);
};

/**
 * Subscribe route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.subscribe = function(msg, session, next) {
	var result = {
		topic: 'subscribe',
		payload: JSON.stringify({code: 200, msg: 'subscribe message is ok.'})
	};
  next(null, result);
};

Handler.prototype.getPortConfig = function(msg, session, next) {
    logger.info("Handle getPortConfig message, port list len is " + portCfgOfWestEuro.length);
    for(var index in portCfgOfWestEuro){
        //logger.info("check port :" + port);
        if (portCfgOfWestEuro[index].x == msg.x && portCfgOfWestEuro[index].y == msg.y){
            var currentPort = portCfgOfWestEuro[index];
            break;
        }
    }

    next(null,
        {code: 200,
        msg: 'Game server is ok, x is ' + msg.x + ', y is ' + msg.y,
        port_name:currentPort.port_name,
        port_img:currentPort.port_img,
        port_desc:currentPort.port_desc}
    );
};

