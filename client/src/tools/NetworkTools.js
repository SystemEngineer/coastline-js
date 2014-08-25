/**
 * Created by ronghuihe on 14-8-25.
 */
var NetworkTools = {
    _wsiSendText:null,
    /**
     * WebSocket request
     * @param param {type,url,data,onSuccess,onError}
     */
    doWsRequest: function(param){
        //TODO: Add my request
    },
    doWsRequestTest: function(){
        var self = this;
        this._wsiSendText = new WebSocket("ws://echo.websocket.org");
        this._wsiSendText.onopen = function(evt) {
            window.alert("Send Text WS was opened");
            self._wsiSendText.send("Hello WebSocket中文, I'm a text message.");
        };

        this._wsiSendText.onmessage = function(evt) {
            var textStr = "response text msg: "+evt.data;
            window.alert(textStr);

        };

        this._wsiSendText.onerror = function(evt) {
            window.alert("sendText Error was fired");
        };

        this._wsiSendText.onclose = function(evt) {
            window.alert("_wsiSendText websocket instance closed.");
            self._wsiSendText = null;
        };
    }
};