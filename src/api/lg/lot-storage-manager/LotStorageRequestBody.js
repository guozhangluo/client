const ActionType = {
    QueryLot : "QueryLot",
    ReceiceLot : "ReceiceLot"
}

export default class LotStorageRequestBody {

    actionType;

    constructor(actionType){
        this.actionType = actionType;
    }

    static buildQueryStorageLotInfo(lotId, fosbId) {
        let body = new LotStorageRequestBody(ActionType.QueryLot);
        body.lotId = lotId;
        body.fosbId = fosbId;
        return body;
    }

    static buildReceiveStorageLot(mesStorageLots) {
        let body = new LotStorageRequestBody(ActionType.ReceiceLot);
        body.mesStorageLots = mesStorageLots;
        return body;
    }

}