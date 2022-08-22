export default class LotImportRequestBody {

    importType;

    constructor(importType){
        this.importType = importType;
    }

    static buildSelectFile(importType, fileName) {
        let body = new LotImportRequestBody(importType);
        body.fileName = fileName;
        return body;
    }

    static buildImportInfo(importType, materialLotUnitList) {
        let body = new LotImportRequestBody(importType);
        body.materialLotUnitList = materialLotUnitList;
        return body;
    }

}