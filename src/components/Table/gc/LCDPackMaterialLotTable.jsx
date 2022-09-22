import { Button } from 'antd';
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import { Notification } from '../../notice/Notice';
import MessageUtils from '../../../api/utils/MessageUtils';
import PackageMaterialLotRequest from '../../../api/package-material-lot/PackageMaterialLotRequest';
import EntityScanViewTable from '../EntityScanViewTable';
import GetPrintBboxParameterRequest from '../../../api/gc/get-print-bbox-parameter/GetPrintBboxParameterRequest';

/**
 * LCD成品包装
 */
export default class LCDPackMaterialLotTable extends EntityScanViewTable {

    static displayName = 'LCDPackMaterialLotTable';

    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createPackageButton());
        return buttons;
    }

    createTagGroup = () => {
        let tags = [];
        tags.push(this.createPackageQty());
        tags.push(this.createTotalNumber());
        return tags;
    }

    handlePrint = (materialLotId) => {
        let requestObject = {
            materialLotId : materialLotId,    
            success: function(responseBody) {
            }
        }
        GetPrintBboxParameterRequest.sendQueryRequest(requestObject);
    }

    package = () => {
        const {data} = this.state;
        let self = this;
        if (!data || data.length == 0) {
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.AddAtLeastOneRow));
            return;
        }
        let requestObject = {
            materialLots: data,
            packageType: "LCDPackCase",
            success: function(responseBody) {
                if (self.props.resetData) {
                    self.props.resetData();
                }
                let materialLotId = responseBody.materialLotId;
                let message = I18NUtils.getClientMessage(i18NCode.OperationSucceed) + `:${materialLotId}`;
                MessageUtils.showOperationSuccess(message);
                self.handlePrint(materialLotId);
            }
        }
        PackageMaterialLotRequest.sendPackMaterialLotsRequest(requestObject)
    }

    createPackageButton = () => {
        return <Button key="receive" type="primary" style={styles.tableButton} icon="inbox" onClick={this.package}>
                        {I18NUtils.getClientMessage(i18NCode.BtnPackage)}
                    </Button>
    }

}

const styles = {
    tableButton: {
        marginLeft:'20px'
    }
};
