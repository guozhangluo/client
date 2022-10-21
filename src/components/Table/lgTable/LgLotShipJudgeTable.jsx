import EntityScanViewTable from '../EntityScanViewTable';

export default class LgLotShipJudgeTable extends EntityScanViewTable {

    static displayName = 'LgLotShipJudgeTable';

    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createPieceNumber());
        buttons.push(this.createPackageQty());
        buttons.push(this.createTotalNumber());
        return buttons;
    }
    
    buildOperationColumn = () => {
      
    }
}