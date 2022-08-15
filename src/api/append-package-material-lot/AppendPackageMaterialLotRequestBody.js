import MaterialLotAction from "../dto/mms/MaterialLotAction";

export default class AppendPackageMaterialLotRequestBody {
    packedMaterialLotId;
    waitToAppendActions;

    constructor(packedMaterialLotId, waitToAppendActions) {
        this.packedMaterialLotId = packedMaterialLotId;
        this.waitToAppendActions = waitToAppendActions;
    }
    
    static buildAppendPackMaterialLots(packedMaterialLotId, waitToPackMaterialLots, actionCode, actionReason, actionComment) {
        let waitToPackageActions = [];
        waitToPackMaterialLots.forEach((waitToPackMaterialLot) => {
            let materialLotAction = new MaterialLotAction();
            materialLotAction.setMaterialLotId(waitToPackMaterialLot.materialLotId);
            materialLotAction.setTransQty(waitToPackMaterialLot.currentQty);
            materialLotAction.setActionCode(actionCode);
            materialLotAction.setActionReason(actionReason);
            materialLotAction.setActionComment(actionComment);
            waitToPackageActions.push(materialLotAction);
        });
        return new AppendPackageMaterialLotRequestBody(packedMaterialLotId, waitToPackageActions);
    }

}