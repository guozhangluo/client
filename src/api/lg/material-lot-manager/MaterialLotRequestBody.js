import MaterialLotAction from "../../dto/mms/MaterialLotAction";
import WeightModel from "../../gc/weight-manager/WeightModel";

const ActionType = {
    Ship : "Ship",
    Issue : "Issue",
    WaferReceive: "WaferReceive",
    BoxLabelPrint: "BoxLabelPrint",
    QueryOutSourceLotPrintInfo: "QueryOutSourceLotPrintInfo",
    LotOutSourceLabelPrint: "LotOutSourceLabelPrint",
    QueryBoxPrintInfo: "QueryBoxPrintInfo",
    LotBoxLablePrint: "LotBoxLablePrint",
    QueryNpwLotlablePrintInfo: "QueryNpwLotlablePrintInfo",
    NpwLotlablePrint: "NpwLotlablePrint",
    RecordExpress: "RecordExpress",
    CancelRecordExpress: "CancelRecordExpress",
    PrintObliqueLabel: "PrintObliqueLabel",
    QueryBoxLabelMLot: "QueryBoxLabelMLot",
    QueryLotWeight: "QueryLotWeight",
    LotWeight: "LotWeight"
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

    static buildLotBoxLabelPrint(materialLotList, printCount) {
        let body = new MaterialLotRequestBody(ActionType.BoxLabelPrint, materialLotList);
        body.printCount = printCount;
        return body;
    }

    static buildOutSourceLotLabelQuery(lotId) {
        let body = new MaterialLotRequestBody(ActionType.QueryOutSourceLotPrintInfo);
        body.lotId = lotId;
        return body;
    }

    static buildLotOutSourceLabelPrint(materialLotList, printCount) {
        let body = new MaterialLotRequestBody(ActionType.LotOutSourceLabelPrint, materialLotList);
        body.printCount = printCount;
        return body;
    }

    static buildBoxLabelPrintQuery(lotId) {
        let body = new MaterialLotRequestBody(ActionType.QueryBoxPrintInfo);
        body.lotId = lotId;
        return body;
    }

    static buildBoxLabelPrint(materialLotList, printCount) {
        let body = new MaterialLotRequestBody(ActionType.LotBoxLablePrint, materialLotList);
        body.printCount = printCount;
        return body;
    }

    static buildNpwLabelPrintQuery(lotId) {
        let body = new MaterialLotRequestBody(ActionType.QueryNpwLotlablePrintInfo);
        body.lotId = lotId;
        return body;
    }

    static buildNpwLabelPrint(materialLotList, printCount) {
        let body = new MaterialLotRequestBody(ActionType.NpwLotlablePrint, materialLotList);
        body.printCount = printCount;
        return body;
    }

    static buildManualRecordExpress(expressNumber, materialLotList, expressCompany) {
        let body = new MaterialLotRequestBody(ActionType.RecordExpress);
        body.expressNumber = expressNumber;
        body.materialLotList = materialLotList;
        body.expressCompany = expressCompany;
        return body;
    }

    static buildCancelRecordExpress(materialLotList) {
        let body = new MaterialLotRequestBody(ActionType.CancelRecordExpress);
        body.materialLotList = materialLotList;
        return body;
    }

    static buildPrintObliqueLabel(materialLotList) {
        let body = new MaterialLotRequestBody(ActionType.PrintObliqueLabel);
        body.materialLotList = materialLotList;
        return body;
    }

    static buildQueryBoxLabelMLotList(tableRrn, whereClause, tagFlag) {
        let body = new MaterialLotRequestBody(ActionType.QueryBoxLabelMLot);
        body.tableRrn = tableRrn;
        body.whereClause = whereClause;
        body.tagFlag = tagFlag;
        return body;
    }

    static buildQueryLotWeight(lotId, tableRrn) {
        let body = new MaterialLotRequestBody(ActionType.QueryLotWeight);
        body.lotId = lotId;
        body.tableRrn = tableRrn;
        return body;
    }

    static buildLotWeight(materialLotList) {
        let body = new MaterialLotRequestBody(ActionType.LotWeight);
        let weightModels = [];
        materialLotList.forEach(materialLot => {
            let weightModel = new WeightModel(materialLot.materialLotId, null, materialLot.theoryWeight, null, null, null);
            weightModels.push(weightModel);
        });
        body.weightModels = weightModels;
        return body;
    }
}