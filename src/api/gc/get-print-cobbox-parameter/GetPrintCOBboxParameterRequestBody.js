export default class GetPrintCOBboxParameterRequestBody {

    materialLotId;
    printCount;

    constructor(materialLotId, printCount){
        this.materialLotId = materialLotId;
        this.printCount = printCount;
    }

    static buildQuery(materialLotId, printCount) {
        return new GetPrintCOBboxParameterRequestBody(materialLotId, printCount);
    }

}


