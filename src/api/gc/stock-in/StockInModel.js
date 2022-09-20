export default class StockInModel {

    materialLotId;
    relaxBoxId;
    storageId;
    parentMaterialLotId;

    constructor(materialLotId, relaxBoxId, storageId, parentMaterialLotId){
        this.materialLotId = materialLotId;
        this.relaxBoxId = relaxBoxId;
        this.storageId = storageId;
        this.parentMaterialLotId = parentMaterialLotId;
    }

}