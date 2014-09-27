/**
 * Created by ronghuihe on 14-9-17.
 */
var PortPopupLayer = cc.Layer.extend({
    _portBgSprite: null,
    _portTitleLabel: null,
    _portIntroLabel: null,
    _portCloseButton: null,
    _portEventListener: null,
    ctor:function(){
        this._super();
        this.init();
    },
    init:function() {
        this._super();
    },
    createPortWindow:function(portName,portImage,portDesc) {
        var winSize = cc.winSize;
        var parentLayer = this.getParent();
        //Cannot use getContentSize here because the img is lazy-loaded.
        var portBgSpriteSize = cc.size(640,480);

        cc.log(portImage);
        if(!this._portBgSprite){
            cc.log("create port img");
            this._portBgSprite = new cc.Sprite(portImage);
            //The game view has been placed to the position where makes player sprite at center
            var playerSpritePos = parentLayer.getChildByTag(1);
            var portBgSpritePos = cc.p(playerSpritePos.x, playerSpritePos.y);
            if(playerSpritePos.y > winSize.height/2){
                portBgSpritePos.y = winSize.height/2;
            }
            if(playerSpritePos.x < winSize.width/2){
                portBgSpritePos.x = winSize.width/2;
            }
            this._portBgSprite.setPosition(portBgSpritePos);
            this.addChild(this._portBgSprite,100,10);
        }else{
            return;
        }
        if(!this._portTitleLabel){
            cc.log("create port title");
            var titleLayerSize = cc.size(320,40)
            var titleLayer = new cc.LayerColor(cc.color(100, 100, 100, 255), titleLayerSize.width, titleLayerSize.height);
            titleLayer.anchorX = 0;
            titleLayer.anchorY = 0;
            titleLayer.x = this._portBgSprite.getPosition().x - titleLayerSize.width/2;
            titleLayer.y = this._portBgSprite.getPosition().y + portBgSpriteSize.height/2 - titleLayerSize.height/2;
            this.addChild(titleLayer,101,11);
            var fontDef = new cc.FontDefinition();
            fontDef.fontName = "Arial";
            fontDef.fontSize = "32";
            this._portTitleLabel = new cc.LabelTTF(portName,fontDef);
            //this._portTitleLabel.setPosition(cc.p(winSize.width/2,winSize.height/2 + portBgSpriteSize.height/2));
            this._portTitleLabel.setPosition(cc.p(160,20));
            titleLayer.addChild(this._portTitleLabel);
        }
        if(!this._portCloseButton){
            cc.log("create close button");
            //No need to make a call func
            var closeItem = new cc.MenuItemImage(res.CloseNormal_png,res.CloseSelected_png,this.removeAll,this);
            //var closeItemSize = closeItem.getContentSize();
            //closeItem.setPosition(cc.p(winSize.width/2 + portBgSpriteSize.width/2,winSize.height/2 + portBgSpriteSize.height/2));
            cc.log(parentLayer.getPosition().x +":" + parentLayer.getPosition().y)
            closeItem.setPosition(cc.p(this._portBgSprite.getPosition().x + portBgSpriteSize.width/2,
                    this._portBgSprite.getPosition().y +portBgSpriteSize.height/2))
            this._portCloseButton = new cc.Menu(closeItem);
            this._portCloseButton.setPosition(cc.p(0,0));
            this.addChild(this._portCloseButton,102,12);
        }
        if(!this._portEventListener){
            this._portEventListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function(){return true},
                onTouchEnded: function (touch, unused_event){}
            });
            cc.eventManager.addListener(this._portEventListener,this);
        };
    },
    removeAll:function() {
        if(this._portBgSprite){
            cc.log("remove port img");
            this.removeAllChildren();
            //removeAllListeners will remove background listener, so use this to remove specific listener
            cc.eventManager.removeListener(this._portEventListener);
            this._portBgSprite = null;
            this._portTitleLabel = null;
            this._portIntroLabel = null;
            this._portCloseButton = null;
            this._portEventListener = null;
            cc.log("remove port img ok");
        }
    }
})