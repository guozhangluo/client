const ActionType = {
    PackCaseCheckPass : "PackCaseCheckPass",
    PackCaseCheckNG : "PackCaseCheckNG",
    LotShipJudgePass : "LotShipJudgePass",
    LotShipJudgeNG : "LotShipJudgeNG",
}

export default class LotCheckManagerRequestBody {

    actionType;

    constructor(actionType){
        this.actionType = actionType;
    }
    
    static sendLotPackedCheckPassRequest(materialLotList) {
        let body =  new LotCheckManagerRequestBody(ActionType.PackCaseCheckPass);
        body.materialLotList = materialLotList;
        return body;
    }

    static sendLotPackedCheckNGRequest(materialLotList) {
        let body =  new LotCheckManagerRequestBody(ActionType.PackCaseCheckNG);
        body.materialLotList = materialLotList;
        return body;
    }

    static sendLotShipJudgePassRequest(materialLotList) {
        let body =  new LotCheckManagerRequestBody(ActionType.LotShipJudgePass);
        body.materialLotList = materialLotList;
        return body;
    }

    static sendLotShipJudgeNgRequest(materialLotList) {
        let body =  new LotCheckManagerRequestBody(ActionType.LotShipJudgeNG);
        body.materialLotList = materialLotList;
        return body;
    }

} 