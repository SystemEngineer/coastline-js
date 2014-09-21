/**
 * Created by ronghuihe on 14-9-17.
 */
var PortPopupLayer = cc.Layer.extend({
    _portBgSprite: null,
    _portTitleLabel: null,
    _portIntroLabel: null,
    ctor:function(){
        this._super();
        this.init();
    },
    init:function() {
        this._super();
    },
    createPortWindow:function(portName,portImage,portDesc) {
        var winSize = cc.winSize;
        //Cannot use getContentSize here because the img is lazy-loaded.
        var portBgSpriteSize = cc.size(640,480);

        cc.log(portImage);
        if(!this._portBgSprite){
            cc.log("create port img");
            this._portBgSprite = new cc.Sprite(portImage);
            this._portBgSprite.setPosition(cc.p(winSize.width/2,winSize.height/2));
            this.addChild(this._portBgSprite,100,10);
        }
        if(!this._portTitleLabel){
            cc.log("create port title");
            var titleLayerSize = cc.size(320,40)
            var titleLayer = new cc.LayerColor(cc.color(100, 100, 100, 255), titleLayerSize.width, titleLayerSize.height);
            titleLayer.anchorX = 0;
            titleLayer.anchorY = 0;
            titleLayer.x = winSize.width/2 - titleLayerSize.width/2;
            titleLayer.y = winSize.height/2 + portBgSpriteSize.height/2 - titleLayerSize.height/2;
            this.addChild(titleLayer,101,11);
            var fontDef = new cc.FontDefinition();
            fontDef.fontName = "Arial";
            fontDef.fontSize = "32";
            this._portTitleLabel = new cc.LabelTTF(portName,fontDef);
            //this._portTitleLabel.setPosition(cc.p(winSize.width/2,winSize.height/2 + portBgSpriteSize.height/2));
            this._portTitleLabel.setPosition(cc.p(160,20));
            titleLayer.addChild(this._portTitleLabel);
            cc.log("create port done");
        }
    },
    removeAll:function() {
        if(this._portBgSprite){
            cc.log("remove port img");
            this.removeAllChildren();
            this._portBgSprite = null;
            this._portTitleLabel = null;
            cc.log("remove port img ok");
        }
    }
})