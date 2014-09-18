/**
 * Created by ronghuihe on 14-9-17.
 */
var PortPopupLayer = cc.Layer.extend({
    _backgroundSprite: null,
    ctor:function(){
        this._super();
        this.init();
    },
    init:function() {
        this._super();
    },
    createPortWindow:function(portName,portImage,portDesc) {
        var winSize = cc.winSize;
        cc.log(portImage);
        if(!this._backgroundSprite){
            cc.log("create background img");
            this._backgroundSprite = cc.Sprite.create(portImage);
            this._backgroundSprite.setPosition(cc.p(winSize.width/2,winSize.height/2));
            this.addChild(this._backgroundSprite,100,10);
            cc.log("create background img ok");
        }
    },
    removeAll:function() {
        if(this._backgroundSprite){
            cc.log("remove background img");
            this.removeAllChildren();
            delete this._backgroundSprite;
            this._backgroundSprite = null;
            cc.log("remove background img ok");
        }
    }
})