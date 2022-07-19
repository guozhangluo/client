
import { Button } from 'antd';
import I18NUtils from '../../api/utils/I18NUtils';
import { i18NCode } from '../../api/const/i18n';
import EntityScanViewTable from './EntityScanViewTable';
import { Notification } from '../notice/Notice';
import MessageUtils from '../../api/utils/MessageUtils';
import UnPackageMaterialLotRequest from '../../api/unpackage-material-lot/UnPackageMaterialLotRequest';
import GetPrintBboxParameterRequest from '../../api/gc/get-print-bbox-parameter/GetPrintBboxParameterRequest';
import EventUtils from '../../api/utils/EventUtils';

/**
 * 拆包
 */
export default class UnPackMaterialLotTable extends EntityScanViewTable {

    static displayName = 'UnPackMaterialLotTable';

    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createUnPackageButton());
        buttons.push(this.createUnPackageAllButton());
        return buttons;
    }

    buildOperationColumn = () => {
        
    }

    /**
     * 全部拆包 以表格数据全部传递
     */
    unPackageAll = () => {
        const {data} = this.state;
        this.unPackage(data);
    }

    /**
     * 部分拆包 以选择的数据为准进行处理
     *  
     */
    unPackagePartial = () => {
        const {selectedRows} = this.state;
        this.unPackage(selectedRows);
    }

    handlePrint = (materialLotId) => {
        let requestObject = {
            materialLotId : materialLotId,    
            success: function(responseBody) {

            }
        }
        GetPrintBboxParameterRequest.sendQueryRequest(requestObject);
    }

    unPackage = (waitToUnpackDetails) => {
        let self = this;
        if (!waitToUnpackDetails || waitToUnpackDetails.length == 0) {
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.SelectAtLeastOneRow));
            return;
        }

        self.setState({
            loading: true
        });
        EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => this.setState({loading: false}));
        
        let requestObject = {
            packedLotDetails: waitToUnpackDetails,
            actionCode: "",
            actionReason: "",
            actionComment: "",
            success: function(responseBody) {
                let materialLots = responseBody.materialLots;
                if (self.props.resetData) {
                    self.props.resetData();
                }
                self.setState({
                    loading: false
                }); 
                let materialLotId = packedLotDetails[0].parentMaterialLotId;
                let message = I18NUtils.getClientMessage(i18NCode.OperationSucceed) + `:${materialLotId}`;
                MessageUtils.showOperationSuccess(message);
                // 全拆了则不进行打印标签
                if (materialLots && materialLots.length > 0) {
                    self.handlePrint(materialLotId);
                }
            }
        }
        UnPackageMaterialLotRequest.sendUnPackMaterialLotsRequest(requestObject)
    }


    createUnPackageAllButton = () => {
        return <Button key="unpackageAll" type="primary" style={styles.tableButton} loading={this.state.loading} icon="dropbox" onClick={this.unPackageAll}>
                        {I18NUtils.getClientMessage(i18NCode.BtnUnPackageAll)}
                    </Button>
    }

    createUnPackageButton = () => {
        return <Button key="unpackage" type="primary" style={styles.tableButton} loading={this.state.loading} icon="dropbox" onClick={this.unPackagePartial}>
                        {I18NUtils.getClientMessage(i18NCode.BtnUnPackage)}
                    </Button>
    }

}

const styles = {
    tableButton: {
        marginLeft:'20px'
    }
};
