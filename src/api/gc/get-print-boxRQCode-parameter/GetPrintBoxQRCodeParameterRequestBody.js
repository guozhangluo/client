const ActionType={
    PrintCOBLabel: "PrintCOBLabel",
    PrintQRCodeLabel: "PrintQRCodeLabel",
}

export default class GetPrintBoxQRCodeParameterRequestBody {

    actionType;
    materialLotList;
    printVboxLabelFlag;

    constructor(actionType, materialLotList, printVboxLabelFlag){
        this.actionType = actionType;
        this.materialLotList = materialLotList;
        this.printVboxLabelFlag = printVboxLabelFlag;
    }

    static buildGetBoxPrintLabelParamater(materialLotList) {
        return new GetPrintBoxQRCodeParameterRequestBody(ActionType.PrintCOBLabel, materialLotList);
    }

    static buildGetBoxPrintQRCodeLabelParamater(materialLotList, printVboxLabelFlag) {
        return new GetPrintBoxQRCodeParameterRequestBody(ActionType.PrintQRCodeLabel, materialLotList, printVboxLabelFlag);
    }

}


