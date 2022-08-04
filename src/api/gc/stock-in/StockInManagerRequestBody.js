import StockInModel from "./StockInModel";

const ActionType = {
    StockIn: "StockIn",
    QueryWafer: "QueryWafer",
    QueryMaterial: "QueryMaterial",
}

export default class StockInManagerRequestBody {

    actionType;
    materialLotId;
    stockInModels;
    lotId;
    tableRrn;

    constructor(actionType, materialLotId, lotId, tableRrn){
        this.actionType = actionType;
        this.materialLotId = materialLotId;
        this.lotId = lotId;
        this.tableRrn = tableRrn;
    }
    
    setStockInModels(stockInModels) {
        this.stockInModels = stockInModels;
    }

    static buildQueryWafer(lotId, tableRrn) {
        return new StockInManagerRequestBody(ActionType.QueryWafer, undefined, lotId, tableRrn);
    }

    static buildStockIn(materialLots) {
        let stockInModels = [];
        materialLots.forEach(materialLot => {
            let stockInModel = new StockInModel(materialLot.materialLotId, materialLot.relaxBoxId, materialLot.storageId);
            stockInModels.push(stockInModel);
        });

        let requestBody = new StockInManagerRequestBody(ActionType.StockIn);
        requestBody.setStockInModels(stockInModels);
        return requestBody;
    }

    static buildQueryRawMaterial(materialLotId, tableRrn) {
        let body = new StockInManagerRequestBody(ActionType.QueryMaterial);
        body.materialLotId = materialLotId;
        body.tableRrn = tableRrn;
        return body;
    }
}


