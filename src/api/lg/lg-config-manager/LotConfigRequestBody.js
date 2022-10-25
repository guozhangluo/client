const ActionType = {
    Create : "Create",
    Update : "Update"
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

}