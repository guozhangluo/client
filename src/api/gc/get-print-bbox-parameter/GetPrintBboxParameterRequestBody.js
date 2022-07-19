export default class GetPrintBboxParameterRequestBody {

    materialLotId;
    printCount;

    constructor(materialLotId, printCount){
        this.materialLotId = materialLotId;
        this.printCount = printCount;
    }

    static buildQuery(materialLotId, printCount) {
        return new GetPrintBboxParameterRequestBody(materialLotId, printCount);
    }

}


