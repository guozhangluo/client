import EntityScanViewTable from '../EntityScanViewTable';
import { Tag } from 'antd';
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';

/**
 * Cog待接收的晶圆
 */
export default class GcCogWaitReceiveMLotTable extends EntityScanViewTable {

    static displayName = 'GcCogWaitReceiveMLotTable';

    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createBBoxQty());
        buttons.push(this.createPackageQty());
        buttons.push(this.createTotalNumber());
        return buttons;
    }

    buildOperationColumn = () => {
        
    }

}


