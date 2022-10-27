import { Button, Col, Input, Row, Tag, Switch} from "antd";
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import MessageUtils from '../../../api/utils/MessageUtils';
import EventUtils from '../../../api/utils/EventUtils';
import MaterialLotRequest from '../../../api/lg/material-lot-manager/MaterialLotRequest';
import FormItem from "antd/lib/form/FormItem";
import EntityListCheckTable from "../EntityListCheckTable";
import { Notification } from "../../notice/Notice";
import Icon from "@icedesign/icon";

export default class LotBoxLabelPrintTable extends EntityListCheckTable {

    static displayName = 'LotBoxLabelPrintTable';

    constructor(props) {
        super(props);
        this.state = {...this.state,...{checked:true},...{value: "tagFlag"}};
    }

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

    createTotalNumber = () => {
        let materialLots = this.state.data;
        let count = 0;
        if(materialLots && materialLots.length > 0){
            materialLots.forEach(data => {
                count = count + data.currentQty;
            });
        }
        return <Tag color="#2db7f5">{I18NUtils.getClientMessage(i18NCode.TotalQty)}：{count}</Tag>
    }

    createPackageQty = () => {
        return <Tag color="#2db7f5">{I18NUtils.getClientMessage(i18NCode.PackageQty)}：{this.state.data.length}</Tag>
    }

    createPieceNumber = () => {
        let qty = 0;
        let materialLots = this.state.data;
        if(materialLots && materialLots.length > 0){
            materialLots.forEach(data => {
                if (data.currentSubQty != undefined) {
                    qty = qty + parseInt(data.currentSubQty);
                }
            });
        }
        return <Tag color="#2db7f5">{I18NUtils.getClientMessage(i18NCode.PieceQty)}：{qty}</Tag>
    }

    createPrintLabelCount = () => {
        return  <FormItem>
                    <Row gutter={4}>
                        <Col span={2} >
                            <span>{I18NUtils.getClientMessage(i18NCode.TagFlag)}:</span>
                        </Col>
                        <Col span={1}>
                            <Switch ref={(checkedChildren) => { this.checkedChildren = checkedChildren }} 
                                checkedChildren={<Icon type="tagFlag" />} 
                                unCheckedChildren={<Icon type="close" />} 
                                onChange={this.handleChange} 
                                disabled={this.disabled}
                                checked={this.state.checked}/>
                        </Col>
                        <Col span={2} >
                            <span>{I18NUtils.getClientMessage(i18NCode.PrintCount)}:</span>
                        </Col>
                        <Col span={3}>
                            <Input ref={(printCount) => { this.printCount = printCount }} defaultValue={2} key="printCount" placeholder="打印份数"/>
                        </Col>
                    </Row>
                </FormItem>
    }

    handleChange = (checkedChildren) => {
        if(checkedChildren){
            this.setState({ 
                value: "tagFlag",
                checked: true
            });
        } else {
            this.setState({ 
                value: "",
                checked: false
            });
        }
    }


    print = () => {
        let self = this;
        let materialLotList = self.state.selectedRows;
        if (materialLotList.length == 0) {
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.SelectAtLeastOneRow));
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
          MaterialLotRequest.sendLotBoxLabelPrintRequest(requestObject);
    }
    
    createPrintButton = () => {
        return <Button key="print" type="primary" style={styles.tableButton} icon="inbox" loading={this.state.loading} onClick={this.print}>
                        {I18NUtils.getClientMessage(i18NCode.BtnPrint)}
                    </Button>
    }

    buildOperationColumn = () =>{
        
    }
}

const styles = {
    tableButton: {
        marginLeft:'20px'
    }
};
