var res = {
    HelloWorld_png : "res/HelloWorld.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",
    map_png : "res/New_Town_Ex.png",
    ship_png : "res/ship1.png",
    map_meta_png : "res/meta_tiles.png",
    map_tmx : "res/MyTileMap1.tmx"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}