import { Button, Col, Input, Row, Tag } from "antd";
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import MessageUtils from '../../../api/utils/MessageUtils';
import EventUtils from '../../../api/utils/EventUtils';
import MaterialLotRequest from '../../../api/lg/material-lot-manager/MaterialLotRequest';
import FormItem from "antd/lib/form/FormItem";
import EntityScanViewTable from "../EntityScanViewTable";
import { Notification } from "../../notice/Notice";

export default class LotNpwStockOutLabelPrintTable extends EntityScanViewTable {

    static displayName = 'LotNpwStockOutLabelPrintTable';

    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createPrintButton());
        return buttons;
    }

    createTagGroup = () => {
        let tags = [];
        tags.push(this.createPrintLabelCount());
        tags.push(this.createPackageQty());
        tags.push(this.createPieceNumber());
        tags.push(this.createTotalNumber());
        return tags;
    }

    createPrintLabelCount = () => {
        return  <FormItem>
                    <Row gutter={4}>
                        <Col span={2} >
                            <span>{I18NUtils.getClientMessage(i18NCode.PrintCount)}:</span>
                        </Col>
                        <Col span={3}>
                            <Input ref={(printCount) => { this.printCount = printCount }} defaultValue={3} key="printCount" placeholder="打印份数"/>
                        </Col>
                    </Row>
                </FormItem>
    }

    print = () => {
        let self = this;
        let materialLotList = self.state.data;
        if (materialLotList.length == 0) {
            return;
        }
        let printCount = this.printCount.state.value;

        self.setState({
            loading: true
        });
        EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => self.setState({loading: false}));

        let requestObject = {
            materialLotList: materialLotList,
            printCount: printCount,
            success: function(responseBody) {
                if (self.props.resetData) {
                    self.props.resetData();
                }
                MessageUtils.showOperationSuccess();
            }
          }
          MaterialLotRequest.sendNpwLabelPrintRequest(requestObject);
    }
    
    createPrintButton = () => {
        return <Button key="print" type="primary" style={styles.tableButton} icon="inbox" loading={this.state.loading} onClick={this.print}>
                        {I18NUtils.getClientMessage(i18NCode.BtnPrint)}
                    </Button>
    }
}

const styles = {
    tableButton: {
        marginLeft:'20px'
    }
};
