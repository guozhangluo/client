import EntityListTable from "../EntityListTable";
import { Button, Row, Col,Tag } from 'antd';
import RefListField from '../../Field/RefListField';
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import MessageUtils from "../../../api/utils/MessageUtils";
import EventUtils from "../../../api/utils/EventUtils";
import { Notification } from '../../notice/Notice';
import GetMLotCodePrintParameterRequest from "../../../api/gc/get-print-mlot-parameter/GetMLotCodePrintParameterRequest";
import { SystemRefListName } from "../../../api/const/ConstDefine";

export default class GCHKWarehouseMLotCodePrintTable extends EntityListTable {

    static displayName = 'GCHKWarehouseMLotCodePrintTable';

    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createPrintButton());
        return buttons;
    }
    
    createTagGroup = () => {
        let tags = [];
        tags.push(this.createExpressInput());
        tags.push(this.createBBoxQty());
        tags.push(this.createPackageQty());
        tags.push(this.createTotalNumber());
        return tags;
    }

    createExpressInput = () => {
        return  <Row gutter={8}>
            <Col span={2} >
                <span style={{marginLeft:"10px", fontSize:"19px"}}>
                    {I18NUtils.getClientMessage(i18NCode.PrintLableType)}:
                </span>
            </Col>
            <Col span={6}>
                <RefListField ref={(printType) => { this.printType = printType }} referenceName={SystemRefListName.HKPrintType} />
            </Col>
        </Row>
    }

    printLable = () => { 
        const {data} = this.state;
        let self = this;
        let printType = this.printType.state.value;

        if(data.length == 0){
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.AddAtLeastOneRow));
            return;
        }
        if(printType == "" || printType == undefined){
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.SelectPrintType));
            return;
        }

        if (data && data.length > 0) {
            self.setState({
                loading: true
            });
            EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => this.setState({loading: false}));

            let requestObject = {
                printType: printType,
                materialLotList : data,
                success: function(responseBody) {
                    MessageUtils.showOperationSuccess();
                }
            }
            GetMLotCodePrintParameterRequest.sendGetPrintParameterRequest(requestObject);
        }
    }

    createPrintButton = () => {
        return <Button key="print" type="primary" style={styles.tableButton} loading={this.state.loading} icon="print" onClick={this.printLable}>
                        {I18NUtils.getClientMessage(i18NCode.PrintLable)}
                    </Button>
    }

    buildOperationColumn = () => {
    }
    
}

const styles = {
    input: {
        width: 300
    },
    tableButton: {
        marginLeft:'20px'
    }
};