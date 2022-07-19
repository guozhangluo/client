export default class GetPrintWltBboxParameterRequestBody {

    materialLotId;
    printCount;

    constructor(materialLotId, printCount){
        this.materialLotId = materialLotId;
        this.printCount = printCount;
    }

    static buildQuery(materialLotId, printCount) {
        return new GetPrintWltBboxParameterRequestBody(materialLotId, printCount);
    }

}


