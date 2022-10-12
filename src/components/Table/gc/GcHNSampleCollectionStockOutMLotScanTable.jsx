import EntityScanViewTable from '../EntityScanViewTable';
import { Button, Tag, Col, Input, Row} from 'antd';
import { Notification } from '../../notice/Notice';
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import MessageUtils from '../../../api/utils/MessageUtils';
import EventUtils from '../../../api/utils/EventUtils';
import WltStockOutManagerRequest from '../../../api/gc/wlt-stock-out/WltStockOutManagerRequest';

/**
 * 湖南仓样品领用出   WLT/CP出货的物料批次表格
 */
export default class GcHNSampleCollectionStockOutMLotScanTable extends EntityScanViewTable {

    static displayName = 'GcHNSampleCollectionStockOutMLotScanTable';

    constructor(props) {
        super(props);
    }

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
        buttons.push(this.createStockOut());
        buttons.push(this.createShipByOrder());
        return buttons;
    }

    createTagGroup = () => {
        let tagList = [];
        tagList.push(this.createInput());
        tagList.push(this.createBBoxQty());
        tagList.push(this.createPackageQty());
        tagList.push(this.createPieceNumber());
        tagList.push(this.createTotalNumber());
        tagList.push(this.createErrorNumberStatistic());
        return tagList;
    }

    stockOut = () => {
        let self = this;
        if (this.getErrorCount() > 0) {
            Notification.showError(I18NUtils.getClientMessage(i18NCode.ErrorNumberMoreThanZero));
            return;
        }

        let orderTable = this.props.orderTable;
        let orders = orderTable.state.data;
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
        WltStockOutManagerRequest.sendHNSampleCollectionStockOutRequest(requestObj);
    }

    shipByOrder = () => {
        let self = this;
        if (this.getErrorCount() > 0) {
            Notification.showError(I18NUtils.getClientMessage(i18NCode.ErrorNumberMoreThanZero));
            return;
        }

        let documentLine = self.props.orderTable.getSingleSelectedRow();
        if (!documentLine) {
            return;
        }

        let materialLots = this.state.data;
        if (materialLots.length === 0 ) {
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.AddAtLeastOneRow));
            return;
        }
        let subCode = this.subCode.state.value;

        self.setState({
            loading: true
        });
        EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => self.setState({loading: false}));

        let requestObj = {
            documentLine : documentLine,
            materialLots : materialLots,
            subCode: subCode,
            success: function(responseBody) {
                if (self.props.resetData) {
                    self.props.onSearch();
                    self.props.resetData();
                }
                MessageUtils.showOperationSuccess();
            }
        }
        WltStockOutManagerRequest.sendWltShipByOrderRequest(requestObj);
    }

    createInput = () => {
        return  <Row gutter={8}>
            <Col span={3} >
                <span style={{marginLeft:"5px", fontSize:"19px"}}>
                    {I18NUtils.getClientMessage(i18NCode.SubCode)}:
                </span>
            </Col>
            <Col span={5}>
                <Input ref={(subCode) => { this.subCode = subCode }} key="subCode" placeholder="二级代码"/>
            </Col>
        </Row>
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

    createStockOut = () => {
        return <Button key="stockOut" type="primary" style={styles.tableButton} loading={this.state.loading} icon="file-excel" onClick={this.stockOut}>
                        材料/其他出
                    </Button>
    }

    createShipByOrder = () => {
        return <Button key="shipByOrder" type="primary" style={styles.tableButton} loading={this.state.loading} icon="file-excel" onClick={this.shipByOrder}>
                        依订单出货
                    </Button>
    }

}

const styles = {
    tableButton: {
        marginLeft:'20px'
    }
};
