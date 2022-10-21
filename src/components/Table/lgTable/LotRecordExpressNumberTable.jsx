import { Button, Col, Input, Row, Tag } from "antd";
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import MessageUtils from '../../../api/utils/MessageUtils';
import EventUtils from '../../../api/utils/EventUtils';
import FormItem from "antd/lib/form/FormItem";
import { Notification } from "../../notice/Notice";
import RefListField from "../../Field/RefListField";
import {SystemRefListName } from "../../../api/const/ConstDefine";
import EntityListCheckTable from "../EntityListCheckTable";
import MaterialLotRequest from "../../../api/lg/material-lot-manager/MaterialLotRequest";

export default class LotRecordExpressNumberTable extends EntityListCheckTable {

    static displayName = 'LotRecordExpressNumberTable';

    componentDidMount=() => {
        this.expressNumber.focus();
    }

    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createExpressInput());
        buttons.push(this.createStatistic());
        buttons.push(this.createManualRecordExpressButton());
        buttons.push(this.createCancelExpressButton());
        buttons.push(this.createPrintObliqueLabelButton());
        return buttons;
    }

    createExpressInput = () => {
        return <FormItem>
                  <Row gutter={16}>
                    <Col span={2} >
                        <span>{I18NUtils.getClientMessage(i18NCode.ExpressCompany)}:</span>
                    </Col>
                    <Col span={4}>
                        <RefListField ref={(expressCompany) => { this.expressCompany = expressCompany }} referenceName={SystemRefListName.ExpressCompany}/>
                    </Col>
                    <Col span={2} >
                        <span>{I18NUtils.getClientMessage(i18NCode.ExpressNumber)}:</span>
                    </Col>
                    <Col span={4}>
                        <Input ref={(expressNumber) => { this.expressNumber = expressNumber }} key="expressNumber" placeholder={I18NUtils.getClientMessage(i18NCode.ExpressNumber)}/>
                    </Col>
                </Row>
        </FormItem>
    }

    createStatistic = () => {
        return <Tag color="#2db7f5">{I18NUtils.getClientMessage(i18NCode.TotalStrokeCount)}：{this.state.data.length}</Tag>
    }

    recordManualExpress = () => {
        debugger;
        let self = this;
        let datas = this.getSelectedRows();
        if (datas.length === 0){
            return;
        }
        let expressNumber = self.expressNumber.state.value;
        let expressCompany = self.expressCompany.state.value;
        if (expressNumber == "" || expressNumber == null || expressNumber == undefined){
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.ExpressNumberCannotEmpty));
            return;
        }
        if (expressCompany == "" || expressCompany == null || expressCompany == undefined){
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.ExpressCompanyCannotEmpty));
            return;
        }
        self.setState({
            loading: true
        });
        EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => self.setState({loading: false}));
        
        let object = {
            materialLotList : datas,
            expressNumber: expressNumber,
            expressCompany: expressCompany,
            success: function(responseBody) {
                if (self.props.resetData) {
                    self.props.resetData();
                    self.props.onSearch();
                }
                self.expressNumber.setState({
                    value : "",
                });
                MessageUtils.showOperationSuccess();
            }
        };
        MaterialLotRequest.sendMLotRecordExpress(object);
    }

    cancelExpress = () => {
        debugger;
        let self = this;
        let materialLotList = this.getSelectedRows();
        if (materialLotList.length === 0){
            return;
        }
        self.setState({
            loading: true
        });
        EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => self.setState({loading: false}));
        
        let object = {
            materialLotList : materialLotList,
            success: function(responseBody) {
                if (self.props.resetData) {
                    self.props.onSearch();
                    self.props.resetData();
                }
                MessageUtils.showOperationSuccess();
            }
        };
        MaterialLotRequest.sendCancelRecordExpress(object);
    }

    printObliqueLabel = () => {
        let self = this;
        let materialLotList = this.getSelectedRows();
        if (materialLotList.length === 0){
            return;
        }

        self.setState({
            loading: true
        });
        EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => self.setState({loading: false}));
        
        let requestObject = {
            materialLotList : materialLotList,    
            success: function(responseBody) {
                MessageUtils.showOperationSuccess();
            }
        }
        MaterialLotRequest.sendPrintObliqueLabelRequest(requestObject);
    }

    createPrintObliqueLabelButton = () => {
        return <Button key="print" type="primary"  style={styles.tableButton} loading={this.state.loading} icon="barcode" onClick={() => this.printObliqueLabel()}>
                        {I18NUtils.getClientMessage(i18NCode.BtnPrintObliqueLabel)}
                    </Button>;
    }

    createManualRecordExpressButton = () => {
        return <Button key="manaulRecordExpress" type="primary" style={styles.tableButton} loading={this.state.loading} icon="inbox" onClick={this.recordManualExpress}>
                        {I18NUtils.getClientMessage(i18NCode.BtnManualRecordExpress)}
                    </Button>
    }

    createCancelExpressButton = () => {
        return <Button key="cancelRecordExpress" type="primary" style={styles.tableButton} loading={this.state.loading} icon="delete" onClick={this.cancelExpress}>
                        {I18NUtils.getClientMessage(i18NCode.BtnCancelExpress)}
                    </Button>
    }

    buildOperationColumn = () => {
        
    }

}

const styles = {
    tableButton: {
        marginLeft:'20px'
    }
};
