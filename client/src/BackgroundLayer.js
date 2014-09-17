/**
 * Created by ronghuihe on 14-8-18.
 */
var BackgroundLayer = cc.Layer.extend({
    _backgroundMap : null,
    _mapLandLayer : null,
    _mapPlayerStartPoint : null,
    _playerSprite : null,
    _networkTool: null,
    ctor:function(){
        this._super();
        this.init();
    },
    init:function(){
        this._super();

        var winSize = cc.winSize;

        //Add tmx map
        this._backgroundMap = cc.TMXTiledMap.create(res.map_tmx);
        //To show map at top-left of the window, the anchor should be set to top-left of the map
        this._backgroundMap.setPosition(cc.p(0,winSize.height));
        this._backgroundMap.setAnchorPoint(cc.p(0,1));

        this._mapLandLayer = this._backgroundMap.getLayer("LandLayer");
        this._mapLandLayer.setVisible(false);
        /*
        var mapObjects = this._backgroundMap.getObjectGroup("PlayerLayer");
        if(!mapObjects) {
            this._mapPlayerStartPoint = mapObjects.getObject("PlayerStartPoint");
        }
        */
        this.addChild(this._backgroundMap);

        //Add player ship sprite
        var pos = this._backgroundMap.getPosition();
        cc.log("x = " + pos.x + " y = " + pos.y);
        var playerStartX = 64;
        var playerStartY = 384;
        this._playerSprite = new FloatingSprites();
        this._playerSprite.initWithFile(res.ship_png);
        this._playerSprite.setPosition(cc.p(playerStartX,playerStartY));
        this.addChild(this._playerSprite,1,1);

        //set events
        var listener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:function(keyCode, event){
                var keyNumber = keyCode.toString();

                var moveX = 0;
                var moveY = 0;
                if(keyNumber == cc.KEY.left){
                    moveX = -32;
                }else if(keyNumber == cc.KEY.right){
                    moveX = 32;
                }else if(keyNumber == cc.KEY.up){
                    moveY = 32;
                }else if(keyNumber == cc.KEY.down){
                    moveY = -32;
                }
                var delta = cc.p(moveX,moveY);
                //cannot use 'this', get target by tag
                var playerSprite = event.getCurrentTarget().getChildByTag(1);
                var backgroundLayer = event.getCurrentTarget();
                var newPlayerPos = cc.pAdd(playerSprite.getPosition(),delta);
                var playerCoord = backgroundLayer.getTileCoordForPosition(newPlayerPos);
                if(!backgroundLayer.isBlockageTile(playerCoord)){
                    if(backgroundLayer.isPortTile(playerCoord)){
                        backgroundLayer.getPortConfigByCoord(playerCoord);
                    }
                    playerSprite.setPosition(newPlayerPos);
                    backgroundLayer.setViewPointCenter(newPlayerPos,delta);
                }
            }
        });
        cc.eventManager.addListener(listener,this);
        //this._networkTool = new NetworkTools();

    },
    isBlockageTile:function(tileCoord){
        var tileGID = this._mapLandLayer.getTileGIDAt(tileCoord);
        if(tileGID){
            var prop = this._backgroundMap.propertiesForGID(tileGID);
            if(prop){
                if("True" == prop["Blockage"]){
                    return true;
                }
            }
        }
        return false;
    },
    isPortTile:function(tileCoord){
        var tileGID = this._mapLandLayer.getTileGIDAt(tileCoord);
        if(tileGID){
            var prop = this._backgroundMap.propertiesForGID(tileGID);
            if(prop){
                if("True" == prop["Port"]){
                    return true;
                }
            }
        }
        return false;
    },
    getPortConfigByCoord:function(playerCoord){
        //This is just a test
        //NetworkTools.doWsRequestTest();
        var pomelo = window.pomelo;

        var route = 'gate.gateHandler.queryEntry';
        var uid = "uid";
        var rid = "rid";
        var username = "username";
        var portConfig = "";
        //self can be send to closure.
        var self = this;
        pomelo.disconnect();
        pomelo.init({
            host: "127.0.0.1",
            port: 3010,
            log: true
        }, function() {
            var route = "connector.entryHandler.getPortConfig";
            pomelo.request(route, {
                username: username,
                rid: rid,
                x: playerCoord.x,
                y: playerCoord.y
            }, function(data) {
                portConfig=JSON.stringify(data);
                window.alert(portConfig);
                //receive response, do something,access 'this' object by 'self'
                self.createPortLayerByConfig(portConfig)
            });
        });
        return portConfig;

        /*
        //connection style for gate proxy
        pomelo.init({
            host: "127.0.0.1",
            port: 3005,
            log: true
        }, function() {
            pomelo.request(route, {
                uid: uid
            }, function(data) {
                pomelo.disconnect();
                pomelo.init({
                    host: data.host,
                    port: data.port,
                    log: true
                }, function() {
                    var route = "connector.entryHandler.enter";
                    pomelo.request(route, {
                        username: username,
                        rid: rid
                    }, function(data) {
                        cc.log(JSON.stringify(data));
                        chatSend();
                    });
                });
            });
        });
        */
    },
    getTileCoordForPosition:function(pos){
        var tileWidth = this._backgroundMap.getTileSize().width;
        var tileHeight = this._backgroundMap.getTileSize().height;
        var x = Math.floor(pos.x/tileWidth);
        var y = Math.floor((cc.winSize.height - pos.y)/tileHeight);

        return cc.p(x,y);
    },
    getPositionForTileCoord:function(coord){
        var tileWidth = this._backgroundMap.getTileSize().width;
        var tileHeight = this._backgroundMap.getTileSize().height;
        var x = coord.x * tileWidth + tileWidth/2;
        var y = this._backgroundMap.getMapSize.height * tileHeight - coord.y * tileHeight - tileHeight/2;
        return cc.p(x,y);
    },
    setViewPointCenter:function(newPlayerPos, delta) {
        var winSize = cc.winSize;
        var viewPos = this.getPosition();
        //window.alert(newPlayerPos.x + " : " + newPlayerPos.y + " --- " + viewPos.x + " : " + viewPos.y  + " --- " + winSize.width + " : " + winSize.height);
        //TODO: Should check the position at the other 3 corners of the map
        if(newPlayerPos.x > winSize.width/2){
           viewPos.x = viewPos.x - delta.x;
        }
        //Attention: top-left coord of player is (0, winSize.height)
        if(newPlayerPos.y < winSize.height/2 ){
           viewPos.y = viewPos.y - delta.y;
        }
        this.setPosition(viewPos);
    },
    createPortLayerByConfig:function(portConfig){
        window.alert("---"+portConfig);
    },
});