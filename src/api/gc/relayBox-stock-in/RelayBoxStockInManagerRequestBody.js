import StockInModel from "../stock-in/StockInModel";
import RelayBoxStockInModel from "./RelayBoxStockInModel";

const ActionType = {
    QueryRelayBox: "QueryRelayBox",
    QueryBox: "QueryBox",
    RelayBoxStockIn: "RelayBoxStockIn",
    StockIn: "StockIn",
}

export default class RelayBoxStockInManagerRequestBody {

    actionType;
    materialLotId;
    relayBoxStockInModels;
    relayBoxId;
    tableRrn;
    stockInModels;

    constructor(actionType, materialLotId, relayBoxId, tableRrn){
        this.actionType = actionType;
        this.materialLotId = materialLotId;
        this.relayBoxId = relayBoxId;
        this.tableRrn = tableRrn;
    }

    setRelayBoxStockInModels(relayBoxStockInModels) {
        this.relayBoxStockInModels = relayBoxStockInModels;
    }

    setStockInModels(stockInModels) {
        this.stockInModels = stockInModels;
    }

    static buildQueryBox(materialLotId, tableRrn) {
        return new RelayBoxStockInManagerRequestBody(ActionType.QueryBox, materialLotId, undefined, tableRrn);
    }

    static buildQueryRelayBox(relayBoxId) {
        return new RelayBoxStockInManagerRequestBody(ActionType.QueryRelayBox, undefined, relayBoxId);
    }
    

    static buildRelayBoxChangeStorage(materialLots) {
        let relayBoxStockInModels = [];
        materialLots.forEach(materialLot => {
            let relayBoxStockInModel = new RelayBoxStockInModel(materialLot.materialLotId, materialLot.storageId, materialLot.parentMaterialLotId);
            relayBoxStockInModels.push(relayBoxStockInModel);
        });

        let requestBody = new RelayBoxStockInManagerRequestBody(ActionType.RelayBoxStockIn);
        requestBody.setRelayBoxStockInModels(relayBoxStockInModels);
        return requestBody;
    }

    static buildGCStockIn(materialLots) {
        let stockInModels = [];
        materialLots.forEach(materialLot => {
            let stockInModel = new StockInModel(materialLot.materialLotId, materialLot.relaxBoxId, materialLot.storageId, materialLot.parentMaterialLotId);
            stockInModels.push(stockInModel);
        });

        let requestBody = new RelayBoxStockInManagerRequestBody(ActionType.StockIn);
        requestBody.setStockInModels(stockInModels);
        return requestBody;
    }

}