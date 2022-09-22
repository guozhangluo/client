import EntityScanViewTable from '../EntityScanViewTable';

/**
 * 香港仓待接收真空包
 */
export default class HKWaitReceiveMLotTable extends EntityScanViewTable {

    static displayName = 'HKWaitReceiveMLotTable';

    createButtonGroup = () => {
        let tagList = [];
        tagList.push(this.createBBoxQty());
        tagList.push(this.createPackageQty());
        tagList.push(this.createPieceNumber());
        tagList.push(this.createTotalNumber());
        return tagList;
    }

    buildOperationColumn = () => {
        
    }

}


