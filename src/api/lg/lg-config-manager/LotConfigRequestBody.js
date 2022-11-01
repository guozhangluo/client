const ActionType = {
    Create : "Create",
    Update : "Update",
    Delete : "Delete",
    BomAdd : "BomAdd",
    BomUpdate : "BomUpdate",
    BomActive : "BomActive",
    BomFrozen : "BomFrozen",
}

export default class LotConfigRequestBody {

    actionType;
    t7codeConfig;

    constructor(actionType, t7codeConfig){
        this.actionType = actionType;
        this.t7codeConfig =t7codeConfig;
    }

    static buildSaveT7CodeConfig(t7codeConfig) {
        let actionType;
        if (t7codeConfig.objectRrn) {
            actionType = ActionType.Update;
        } else {
            actionType = ActionType.Create;
        }
        let body = new LotConfigRequestBody(actionType, t7codeConfig);
        return body;
    }

    static buildDeleteT7CodeConfig(t7codeConfig) {
        let body = new LotConfigRequestBody(ActionType.Delete, t7codeConfig);
        return body;
    }

    static buildSaveProductBomConfig(productBom) {
        let actionType;
        if (productBom.objectRrn) {
            actionType = ActionType.BomUpdate;
        } else {
            actionType = ActionType.BomAdd;
        }
        let body = new LotConfigRequestBody(actionType);
        body.productBom = productBom;
        return body;
    }

    static buildActiveProductBom(productBom) {
        let body = new LotConfigRequestBody(ActionType.BomActive);
        body.productBom = productBom;
        return body;
    }

    static buildFrozenProductBom(productBom) {
        let body = new LotConfigRequestBody(ActionType.BomFrozen);
        body.productBom = productBom;
        return body;
    }

}