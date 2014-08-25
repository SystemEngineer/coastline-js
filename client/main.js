cc.game.onStart = function(){
    cc.view.adjustViewPort(true);
    //HRH: 800*450 is the resolution in game, so the max width in game is 800 and the max height is 450
    //HRH: not the same as browser size or canvas size
    cc.view.setDesignResolutionSize(1280, 704, cc.ResolutionPolicy.SHOW_ALL);
    //HRH:Now, the canvas size will expand to the browser size
    cc.view.resizeWithBrowserSize(true);
    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new HelloWorldScene());
    }, this);
};
cc.game.run();