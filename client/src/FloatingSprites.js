/**
 * Created by ronghuihe on 14-8-19.
 */
var PathStep = function(){return {
    _GScore: 0,
    _HScore: 0,
    _Position: cc.p(0,0),
    _ParentStep : null,
    createWithPosition: function(pos){

    },
    setPosition:function(pos){
        this._Position.x = pos.x;
        this._Position.y = pos.y;
    },
    getFScore:function(){
        return this._GScore + this._HScore;
    },
    isEqual:function(otherStep){

        return (this._Position.x == otherStep._Position.x) && (this._Position.y == otherStep._Position.y);
    },
    getPathDesc:function(){
        cc.log("pos = [" + this._Position.x + "," + this._Position.y + "], g = "
            + this._GScore + ", h = " + this._HScore + ", f = " + this.getFScore());
    }
}};

var FloatingSprites = cc.Sprite.extend({
    _OpenStepsList: null,
    _ClosedStepsList: null,
    _FoundPathStepsList: null,
    MOVING_TAG: 1,
    ctor:function(){
        this._super();
        this.init();
    },
    init:function(){
        this._super();
    },
    insertInOpenSteps:function(stepToInsert){
        var FScore = stepToInsert.getFScore();
        for(var i = 0; i < this._OpenStepsList.length; i++){
            if(FScore <= this._OpenStepsList[i].getFScore()){
                break;
            }
        }
        this._OpenStepsList.splice(i,0,stepToInsert);
    },
    getStepIndex:function(StepsList, step){
        for(var i = 0; i < StepsList.length; i++){
            if(StepsList[i].isEqual(step)){
                return i;
            }
        }
        return -1;
    },
    calcHScoreFromCoordToCoord:function(fromCoord, toCoord){
        return Math.abs(toCoord.y - fromCoord.y) + Math.abs(toCoord.x - fromCoord.x)
    },
    calcCostFromStepToAdjacent:function(fromStep, toStep){
        return 1;
    },
    buildFoundPathSteps:function(step){
        this._FoundPathStepsList = [];
        do{
            if(step._ParentStep){
                //Attention: unshift is not available in Internet Explorer!!
                this._FoundPathStepsList.unshift(step);
            }
            step = step._ParentStep;
        }while(step);
    },
    moveStepByStep:function(){
        if(this._FoundPathStepsList.length == 0){
            return;
        }
        var parentLayer = this.getParent();
        var step = this._FoundPathStepsList.shift();
        //cc.log("move to : " + step._Position.x + ":" + step._Position.y);
        var stepPos = parentLayer.getPositionForTileCoord(step._Position);
        //MoveTo* moveAction = MoveTo::create(0.3f, stepPos);
        var moveAction = cc.moveTo(0.3,stepPos);
        var moveCallback = new cc.CallFunc(this.moveStepByStep,this);
        var moveSeq = cc.sequence(moveAction,moveCallback);

        moveSeq.setTag(this.MOVING_TAG);
        this.runAction(moveSeq);
        if(this._FoundPathStepsList.length == 0){
            var playerCoord = parentLayer.getTileCoordForPosition(stepPos);
            cc.log("====> Current position is [" + playerCoord.x + ", " + playerCoord.y + "] <=====");
            if(!parentLayer.isBlockageTile(playerCoord)){
                parentLayer.setViewPointCenter(stepPos);
                if(parentLayer.isPortTile(playerCoord)){
                    parentLayer.getPortConfigByCoord(playerCoord);
                }else{
                    parentLayer._portLayer.removeAll();
                }
                parentLayer._playerSprite.setPosition(stepPos);
            }
        }
    },
    moveTowardTarget:function(targetPos){
        //Stop current moving action and start a new pathfinding
        this.stopActionByTag(this.MOVING_TAG);
        var parentLayer = this.getParent();
        var fromTileCoord = parentLayer.getTileCoordForPosition(this.getPosition());
        var toTileCoord = parentLayer.getTileCoordForPosition(targetPos);
        if(cc.pSameAs(fromTileCoord,toTileCoord)){
            cc.log("It's already there");
            return;
        }
        if((parentLayer.isBlockageTile(toTileCoord)) || !(parentLayer.isValidTile(toTileCoord))){
            cc.log("Target [%f,%f] is unaccessible",toTileCoord.x, toTileCoord.y);
            return;
        }
        cc.log("From: " + fromTileCoord.x + " , " + fromTileCoord.y);
        cc.log("To: " + toTileCoord.x + ", " +toTileCoord.y);

        this._OpenStepsList = [];
        this._ClosedStepsList = [];
        this._FoundPathStepsList = [];
        //Add current position(start position)
        var tmpStep = new PathStep();
        tmpStep.setPosition(fromTileCoord);
        this.insertInOpenSteps(tmpStep);
        var count = 0;
        do{
            //1. get the top step in open steps array, push it to close steps array, then check the step
            var currentStep = this._OpenStepsList.shift();
            this._ClosedStepsList.push(currentStep);

            //current step is the target to move, finished
            if(cc.pSameAs(currentStep._Position,toTileCoord)){
                var lastStep = currentStep;
                cc.log("Path found");
                //Got the path, start moving to the target point
                this.buildFoundPathSteps(lastStep);
                this.moveStepByStep();

                this._OpenStepsList = [];
                this._ClosedStepsList = [];
                break;
            }
            //Check all adjacent tiles, put it into open steps array according to the F score
            var adjStepPoints = parentLayer.accessibleTilesAdjacentToTileCoord(currentStep._Position);
            for(var i = 0; i < adjStepPoints.length; i++){
                var step = new PathStep();
                step.setPosition(adjStepPoints[i]);

                if(this.getStepIndex(this._ClosedStepsList,step) != -1){
                    //the step is already in the closed steps, ignore
                    continue;
                }
                var moveCost = this.calcCostFromStepToAdjacent(currentStep, step);
                var openIndex = this.getStepIndex(this._OpenStepsList, step);
                if(openIndex == -1){
                    //this step is not in the open steps array, calc scores and put it into the array
                    step._ParentStep = currentStep;
                    step._GScore = (currentStep._GScore + moveCost);
                    step._HScore = this.calcHScoreFromCoordToCoord(step._Position, toTileCoord);
                    this.insertInOpenSteps(step);
                }else{
                    step = this._OpenStepsList[openIndex];
                    //this step is already in the open steps array ,recalc scores and refine the score and parent
                    if((currentStep._GScore + moveCost) < step._GScore){
                        //Fix me: why not set parent?
                        step._ParentStep = currentStep;
                        step._GScore = (currentStep._GScore + moveCost);

                        this._OpenStepsList.concat(this._OpenStepsList.slice(0,openIndex),this._OpenStepsList.slice(openIndex+1));
                        this.insertInOpenSteps(step);
                    }
                }
            }
            count++;
        }while((this._OpenStepsList.length > 0) && (count < 1024));

        if(this._FoundPathStepsList.length == 0){
            cc.log("Cannot find a path to the destination");
        }

    }
});