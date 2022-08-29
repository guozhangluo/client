const ActionType = {
    Ship : "Ship",
    Issue : "Issue"
}

export default class MaterialLotRequestBody {

    actionType;
    materialLotList;

    constructor(actionType, materialLotList){
        this.actionType = actionType;
        this.materialLotList = materialLotList;
    }

    static buildMaterialLotShip(materialLotList) {
        let body = new MaterialLotRequestBody(ActionType.Ship, materialLotList);
        return body;
    }

    static buildMaterialLotIssue(materialLotList) {
        let body = new MaterialLotRequestBody(ActionType.Issue, materialLotList);
        return body;
    }

}