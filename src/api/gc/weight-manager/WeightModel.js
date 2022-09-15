export default class WeightModel {

    materialLotId;
    parentMaterialLotId;
    weight;
    boxsWeightFlag;
    scanSeq;
    boxsScanSeq;

    constructor(materialLotId, parentMaterialLotId, weight, boxsWeightFlag, scanSeq, boxsScanSeq){
        this.materialLotId = materialLotId;
        this.parentMaterialLotId = parentMaterialLotId;
        this.weight = weight;
        this.boxsWeightFlag = boxsWeightFlag;
        this.scanSeq = scanSeq;
        this.boxsScanSeq = boxsScanSeq;
    }

}