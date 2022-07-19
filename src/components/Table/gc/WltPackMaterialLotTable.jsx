import { Button } from 'antd';
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import { Notification } from '../../notice/Notice';
import MessageUtils from '../../../api/utils/MessageUtils';
import { Tag } from 'antd';
import PackageMaterialLotRequest from '../../../api/package-material-lot/PackageMaterialLotRequest';
import EntityScanViewTable from '../EntityScanViewTable';
import GetPrintWltBboxParameterRequest from '../../../api/gc/get-print-wltbbox-parameter/GetPrintWltBboxParameterRequest';
import EventUtils from '../../../api/utils/EventUtils';

/**
 * WLT包装物料批次
 */
export default class WltPackMaterialLotTable extends EntityScanViewTable {

    static displayName = 'WltPackMaterialLotTable';

    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createPackageButton());
        return buttons;
    }

    createTagGroup = () => {
        let tags = [];
        tags.push(this.createMaterialLotsNumber());
        tags.push(this.createWaferNumber());
        tags.push(this.createTotalNumber());
        return tags;
    }

    createMaterialLotsNumber = () => {
        let materialLotUnits = this.state.data;
        let lotIdList = [];
        if(materialLotUnits && materialLotUnits.length > 0){
            materialLotUnits.forEach(data => {
                if (lotIdList.indexOf(data.lotId) == -1) {
                    lotIdList.push(data.lotId);
                }
            });
        }
        return <Tag color="#2db7f5">{I18NUtils.getClientMessage(i18NCode.BoxQty)}：{lotIdList.length}</Tag>
    }

    createWaferNumber = () => {
        let materialLotUnits = this.state.data;
        let count = 0;
        if(materialLotUnits && materialLotUnits.length > 0){
            materialLotUnits.forEach(data => {
                if (data.currentSubQty != undefined) {
                    count = count + Number(data.currentSubQty);
                }
            });
        }
        return <Tag color="#2db7f5">{I18NUtils.getClientMessage(i18NCode.PieceQty)}：{count}</Tag>
    }

    createTotalNumber = () => {
        let materialLotUnits = this.state.data;
        let count = 0;
        if(materialLotUnits && materialLotUnits.length > 0){
            materialLotUnits.forEach(data => {
                if (data.currentQty != undefined) {
                    count = count + data.currentQty;
                }
            });
        }
        return <Tag color="#2db7f5">{I18NUtils.getClientMessage(i18NCode.TotalQty)}：{count}</Tag>
    }

    handlePrint = (materialLotId) => {
        let requestObject = {
            materialLotId : materialLotId,    
            success: function(responseBody) {
            }
        }
        GetPrintWltBboxParameterRequest.sendQueryRequest(requestObject);
    }

    package = () => {
        const {data} = this.state;
        let self = this;
        if (!data || data.length == 0) {
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.SelectAtLeastOneRow));
            return;
        }
        self.setState({
            loading: true
        });
        EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => self.setState({loading: false}));
          
        let requestObject = {
            materialLots: data,
            packageType: "WltPackCase",
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
        return <Button key="receive" type="primary" style={styles.tableButton} loading={this.state.loading} icon="inbox" onClick={this.package}>
                        {I18NUtils.getClientMessage(i18NCode.BtnPackage)}
                    </Button>
    }

}

const styles = {
    tableButton: {
        marginLeft:'20px'
    }
};
