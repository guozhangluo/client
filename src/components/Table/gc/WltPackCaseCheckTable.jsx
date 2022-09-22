import { Button, Form } from 'antd';
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import EntityScanViewTable from '../EntityScanViewTable';
import { Notification } from '../../notice/Notice';
import MessageUtils from '../../../api/utils/MessageUtils';
import PackCaseCheckForm from './PackCaseCheckForm';
import TableManagerRequest from '../../../api/table-manager/TableManagerRequest';
import MaterialLotManagerRequest from '../../../api/gc/material-lot-manager/MaterialLotManagerRequest';

const PackCaseCheckTableName="GCPackCaseCheck";

export default class WltPackCaseCheckTable extends EntityScanViewTable {

    static displayName = 'WltPackCaseCheckTable';

    constructor(props) {
        super(props);
        this.state = {...this.state, ...{formTable: {fields: []}}};
    }

    buildOperationColumn = () => {
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
        tags.push(this.createPieceNumber());
        tags.push(this.createTotalNumber());
        return tags;
    }

    createForm = () => {
        const WrappedAdvancedPackCaseCheckForm = Form.create()(PackCaseCheckForm);
        return  <WrappedAdvancedPackCaseCheckForm checkItemList={this.props.checkItemList} ref={this.formRef} object={this.state.data} visible={this.state.formVisible} 
                                            table={this.state.formTable} onOk={this.judgeSuccess} onCancel={this.handleCancel} />
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
            packedLotDetails : selectedRows,
            success: function(responseBody) {
                self.judgeSuccess()
            }
        }
        MaterialLotManagerRequest.sendJudgePackedMaterialLotRequest(object);
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
        let requestObject = {
            name: PackCaseCheckTableName,
            success: function(responseBody) {
                self.setState({
                    formTable: responseBody.table,
                    formVisible : true
                });
            }
        }
        TableManagerRequest.sendGetByNameRequest(requestObject);
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
