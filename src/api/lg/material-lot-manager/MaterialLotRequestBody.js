import MaterialLotAction from "../../dto/mms/MaterialLotAction";
const ActionType = {
    Ship : "Ship",
    Issue : "Issue",
    WaferReceive: "WaferReceive"
}

export default class MaterialLotRequestBody {

    actionType;
    materialLotList;
    materialLotActions;

    constructor(actionType, materialLotList, materialLotActions){
        this.actionType = actionType;
        this.materialLotList = materialLotList;
        this.materialLotActions = materialLotActions;
    }

    static buildMaterialLotShip(materialLotList) {
        let body = new MaterialLotRequestBody(ActionType.Ship, materialLotList);
        return body;
    }

    static buildMaterialLotIssue(materialLotList) {
        let body = new MaterialLotRequestBody(ActionType.Issue, materialLotList);
        return body;
    }

    static buildWaferReceive(materialLots) {
        let materialLotActions = [];
        materialLots.forEach(materialLot => {
            let materialLotAction = new MaterialLotAction();
            materialLotAction.setMaterialLotId(materialLot.materialLotId);
            materialLotActions.push(materialLotAction)
        });
        return new MaterialLotRequestBody(ActionType.WaferReceive, undefined, materialLotActions);
    }

}