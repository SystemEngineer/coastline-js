/**
 * Created by ronghuihe on 14-8-18.
 */
var BackgroundLayer = cc.Layer.extend({
    _backgroundMap : null,
    _mapLandLayer : null,
    _mapPlayerStartPoint : null,
    _playerSprite : null,
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
        //var playerStartX = this._backgroundLayer._mapPlayerStartPoint.x;
        //var playerStartY = this._backgroundLayer._mapPlayerStartPoint.y;
        var playerStartX = 30;
        var playerStartY = 600;
        this._playerSprite = new FloatingSprites();
        this._playerSprite.initWithFile(res.ship_png);
        this._playerSprite.setPosition(cc.p(playerStartX,playerStartY));
        this.addChild(this._playerSprite,1,1);

        //set events
        var listener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:function(keyCode, event){
                var keyNumber = keyCode.toString()

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
                var newPos = cc.pAdd(delta,playerSprite.getPosition());
                playerSprite.setPosition(newPos);
            }
        });
        cc.eventManager.addListener(listener,this);
        //window.alert("add listener 1");
    }
})