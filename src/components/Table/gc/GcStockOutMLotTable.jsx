
import EntityScanViewTable from '../EntityScanViewTable';
import { Button, Tag } from 'antd';
import { Notification } from '../../notice/Notice';
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import StockOutManagerRequest from '../../../api/gc/stock-out/StockOutManagerRequest';
import MessageUtils from '../../../api/utils/MessageUtils';
import EventUtils from '../../../api/utils/EventUtils';
/**
 * 重测发料的物料批次表格
 */
export default class GcStockOutMLotTable extends EntityScanViewTable {

    static displayName = 'GcStockOutMLotTable';

    getRowClassName = (record, index) => {
        // 如果是扫描到不存在的批次，则进行高亮显示
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
     * 正常出货与销售出集中到一个按钮
     * @returns 
     */
     saleShip = () => {
        let self = this;
        if (this.getErrorCount() > 0) {
            Notification.showError(I18NUtils.getClientMessage(i18NCode.ErrorNumberMoreThanZero));
            return;
        }

        let documentLineList = this.props.orderTable.state.data;
        if (documentLineList.length === 0) {
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
            documentLineList : documentLineList,
            materialLots : materialLots,
            success: function(responseBody) {
                if (self.props.resetData) {
                    self.props.onSearch();
                    self.props.resetData();
                }
                MessageUtils.showOperationSuccess();
            }
        }
        StockOutManagerRequest.sendSaleShipRequest(requestObj);
    } 

    refreshDelete = (record) => {
        let datas = this.state.data;
        let recordList = [];
        let parentMaterialLotId = record.parentMaterialLotId;
        if(parentMaterialLotId == "" || parentMaterialLotId == null || parentMaterialLotId == undefined){
            recordList.push(record);
        } else {
            datas.forEach((item) => {
                if(item.parentMaterialLotId == parentMaterialLotId){
                    recordList.push(item);
                }
            });
        }
        recordList.forEach((item) => {
            let dataIndex = datas.indexOf(item);
            if (dataIndex > -1 ) {
                datas.splice(dataIndex, 1);
            }
        });
        this.setState({
            data: datas,
            selectedRows: [],
            selectedRowKeys: []
        })
        MessageUtils.showOperationSuccess();
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
