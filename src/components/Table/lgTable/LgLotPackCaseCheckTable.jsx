import EntityScanViewTable from '../EntityScanViewTable';

export default class LgLotPackCaseCheckTable extends EntityScanViewTable {

    static displayName = 'LgLotPackCaseCheckTable';

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