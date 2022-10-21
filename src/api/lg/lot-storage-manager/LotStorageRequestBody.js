const ActionType = {
    QueryLot : "QueryLot",
    ReceiceLot : "ReceiceLot",
    ZSWQueryLot : "ZSWQueryLot",
    ZSWReceiceLot : "ZSWReceiceLot"
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

    static buildReceiveStorageLot(mesStorageLots, storageId) {
        let body = new LotStorageRequestBody(ActionType.ReceiceLot);
        body.mesStorageLots = mesStorageLots;
        body.storageId = storageId;
        return body;
    }

    static buildZSWQueryStorageLotInfo(lotId, fosbId) {
        let body = new LotStorageRequestBody(ActionType.ZSWQueryLot);
        body.lotId = lotId;
        body.fosbId = fosbId;
        return body;
    }

    static buildZSWReceiveStorageLot(mesStorageLots, storageId) {
        let body = new LotStorageRequestBody(ActionType.ZSWReceiceLot);
        body.mesStorageLots = mesStorageLots;
        body.storageId = storageId;
        return body;
    }

}