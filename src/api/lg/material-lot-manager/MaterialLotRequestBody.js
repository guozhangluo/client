import MaterialLotAction from "../../dto/mms/MaterialLotAction";

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

}