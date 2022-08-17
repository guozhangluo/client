import { Button} from 'antd';
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import EntityScanViewTable from '../EntityScanViewTable';
import { Notification } from '../../notice/Notice';
import MessageUtils from '../../../api/utils/MessageUtils';
import LotCheckManagerRequest from '../../../api/lg/material-lot-check/LotCheckManagerRequest';

export default class LotPackCaseCheckTable extends EntityScanViewTable {

    static displayName = 'LotPackCaseCheckTable';

    constructor(props) {
        super(props);
        this.state = {...this.state};
    }
    
    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createJudgePassButton());
        buttons.push(this.createJudgeNgButton());
        return buttons;
    }

    createTagGroup = () => {
        let tags = [];
        tags.push(this.createBBoxQty());
        tags.push(this.createPackageQty());
        tags.push(this.createTotalNumber());
        return tags;
    }

    judgeSuccess = () => {
        this.setState({formVisible : false});
        if (this.props.resetData) {
            this.props.resetData();
        }
        MessageUtils.showOperationSuccess();
    }

    judgePass = () => {
        var self = this;
        const {data, selectedRows} = this.state;
        if (!data || data.length === 0) {
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.SelectAtLeastOneRow));
            return;
        }
        if (this.props.scanErrorFlag) {
            Notification.showNotice("出现过扫描错误，请重新查找并重新扫描");
            return;
        }
        if (selectedRows.length != data.length) {
            Notification.showNotice("数据没有全部扫描");
            return;
        }
        if(data.length > 1 && this.validationAltek(data)){
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.ThereAreDifferentCustomersInTheBox));
            return;
        }
        let object = {
            materialLotList : selectedRows,
            success: function(responseBody) {
                self.judgeSuccess()
            }
        }
        LotCheckManagerRequest.sendLotPackedCheckPassRequest(object);
    }

    /**
     * 客户简称是否一致
     * @param {*} data 
     * @returns 
     */
    validationAltek = (data) =>{
        let flag = false;
        var altek = data[0].reserved55;
        data.forEach((item)=>{
            if(altek != item.reserved55){
                flag = true
                return flag;
            }
        });
        return flag;
    }

    judgeNg = () => {
        const {data} = this.state;
        let self = this;
        if (!data || data.length == 0) {
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.SelectAtLeastOneRow));
            return;
        }
        let object = {
            materialLotList : data,
            success: function(responseBody) {
                self.judgeSuccess()
            }
        }
        LotCheckManagerRequest.sendLotPackedCheckNGRequest(object);
    }

    buildOperationColumn = () => {
    }

    createJudgePassButton = () => {
        return <Button key="judgePass" type="primary" style={styles.tableButton} icon="inbox" onClick={this.judgePass}>
                        Pass
                    </Button>
    }

    createJudgeNgButton = () => {
        return <Button key="judgeNg" type="primary" style={styles.tableButton} icon="inbox" onClick={this.judgeNg}>
                        NG
                    </Button>
    }
}

const styles = {
    tableButton: {
        marginLeft:'20px'
    }
};
