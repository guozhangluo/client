
import EntityScanViewTable from '../EntityScanViewTable';
import { Tag } from 'antd';
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';

/**
 * 待重测发料的物料批次
 */
export default class GcWaitForReTestMLotTable extends EntityScanViewTable {

    static displayName = 'GcReTestMLotTable';

    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createPackageQty());
        buttons.push(this.createTotalNumber());
        buttons.push(this.createExportDataButton());
        return buttons;
    }

    /**
     * 待重测发料列表不需要操作列
     */
    buildOperationColumn = () => {
        
    }

}


