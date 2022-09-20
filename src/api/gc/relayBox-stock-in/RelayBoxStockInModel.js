export default class StockInModel {

    materialLotId;
    storageId;
    parentMaterialLotId;

    constructor(materialLotId, storageId, parentMaterialLotId){
        this.materialLotId = materialLotId;
        this.storageId = storageId;
        this.parentMaterialLotId = parentMaterialLotId;
    }

}