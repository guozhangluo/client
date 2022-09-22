import EntityScanViewTable from '../EntityScanViewTable';
import { Button, Tag } from 'antd';
import { Notification } from '../../notice/Notice';
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import MessageUtils from '../../../api/utils/MessageUtils';
import EventUtils from '../../../api/utils/EventUtils';
import FtMLotManagerRequest from '../../../api/gc/ft-materialLot-manager/FtMLotManagerRequest';

/**
 * 保税仓 成品销售出货物料
 */
export default class BSWMLotsSaleStockOutMLotScanTable extends EntityScanViewTable {

    static displayName = 'BSWMLotsSaleStockOutMLotScanTable';

    getRowClassName = (record, index) => {
        if (record.errorFlag) {
            return 'error-row';
        } else {
            if(index % 2 ===0) {
                return 'even-row'; 
            } else {
                return ''; 
            }
        }
    };

    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createSaleShip());
        return buttons;
    }

    createTagGroup = () => {
        let tagList = [];
        tagList.push(this.createBBoxQty());
        tagList.push(this.createPackageQty());
        tagList.push(this.createTotalNumber());
        tagList.push(this.createErrorNumberStatistic());
        return tagList;
    }

    /**
     * 销售出
     * @returns 
     */
    saleShip = () => {
        let self = this;
        if (this.getErrorCount() > 0) {
            Notification.showError(I18NUtils.getClientMessage(i18NCode.ErrorNumberMoreThanZero));
            return;
        }

        let orders = this.props.orderTable.state.data;
        if (orders.length === 0) {
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.SelectOneRow));
            return;
        }

        let materialLots = this.state.data;
        if (materialLots.length === 0 ) {
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.AddAtLeastOneRow));
            return;
        }

        self.setState({
            loading: true
        });
        EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => self.setState({loading: false}));

        let requestObj = {
            documentLines : orders,
            materialLots : materialLots,
            success: function(responseBody) {
                if (self.props.resetData) {
                    self.props.onSearch();
                    self.props.resetData();
                }
                MessageUtils.showOperationSuccess();
            }
        }
        FtMLotManagerRequest.sendBSWFTSaleStockOutRequest(requestObj);
    }    

    getErrorCount = () => {
        let materialLots = this.state.data;
        let count = 0;
        if(materialLots && materialLots.length > 0){
            materialLots.forEach(data => {
                if(data.errorFlag){
                    count = count +1;
                }
            });
        }
        return count;
    }

    createErrorNumberStatistic = () => {
        return <Tag color="#D2480A">{I18NUtils.getClientMessage(i18NCode.ErrorNumber)}：{this.getErrorCount()}</Tag>
    }

    createSaleShip = () => {
        return <Button key="saleShip" type="primary" style={styles.tableButton} loading={this.state.loading} icon="inbox" onClick={this.saleShip}>
                       发货/销售出
                    </Button>
    }
}

const styles = {
    tableButton: {
        marginLeft:'20px'
    }
};
