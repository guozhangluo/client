
import { Button, Switch,Icon} from 'antd';
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import EntityScanViewTable from '../EntityScanViewTable';
import IconUtils from '../../../api/utils/IconUtils';
import { Notification } from '../../notice/Notice';
import GetPrintBoxQRCodeParameterRequest from '../../../api/gc/get-print-boxRQCode-parameter/GetPrintBoxQRCodeParameterRequest';
import EventUtils from "../../../api/utils/EventUtils";
import MessageUtils from "../../../api/utils/MessageUtils";


export default class GcPrintQRCodeLabelTable extends EntityScanViewTable {

    static displayName = 'GcPrintQRCodeLabelTable';

    constructor(props) {
        super(props);
        this.state = {...this.state,...{checked:true},...{value: "check"}};
    }

    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createPrintQRCodeButton());
        buttons.push(this.createPrintLabelButton());
        return buttons;
    }

    createTagGroup = () => {
        let buttons = [];
        buttons.push(this.createPrintQRCodeLabelFlag());
        return buttons;
    }

    handlePrintCOBLable = () => {
        let self = this;
        const {data} = this.state;
        if(data.length == 0){
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.AddAtLeastOneRow));
            return;
        }

        self.setState({
            loading: true
        });
        EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => this.setState({loading: false}));    
        let requestObject = {
            materialLotList : data,   
            success: function(responseBody) {
                MessageUtils.showOperationSuccess();
            }
        }
        GetPrintBoxQRCodeParameterRequest.sendGetBoxLabelPrintParamaterRequest(requestObject);
    }

    handlePrintQRCodeLable = () => {
        let self = this;
        const {data} = this.state;
        let printVboxLabelFlag = this.state.value;
        if(data.length == 0){
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.AddAtLeastOneRow));
            return;
        }
        self.setState({
            loading: true
        });
        EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => this.setState({loading: false}));    
        let requestObject = {
            materialLotList : data,   
            printVboxLabelFlag: printVboxLabelFlag,
            success: function(responseBody) {
                MessageUtils.showOperationSuccess();
            }
        }
        GetPrintBoxQRCodeParameterRequest.sendGetBoxQRCodeLabelPrintParamaterRequest(requestObject);
    }

    createPrintLabelButton = () => {
        return <Button key="print" type="primary" style={styles.tableButton} loading={this.state.loading}  onClick={() => this.handlePrintCOBLable()}>
             {IconUtils.buildIcon("icon-barcode")}{I18NUtils.getClientMessage(i18NCode.PrintCOBLable)}</Button>;
    }

    createPrintQRCodeButton = () => {
        return <Button key="printQRCode" type="primary" style={styles.tableButton} loading={this.state.loading}  onClick={() => this.handlePrintQRCodeLable()}>
             {IconUtils.buildIcon("icon-barcode")}{I18NUtils.getClientMessage(i18NCode.PrintQRCodeLable)}</Button>;
    }

    createPrintQRCodeLabelFlag = () => {
        return <span style={{display: 'flex'}}>
            <span style={{marginLeft:"30px", fontSize:"16px"}}>{I18NUtils.getClientMessage(i18NCode.PrintVboxQRCodeLabelFlag)}:</span>
            <span style = {{marginLeft:"10px"}}>
                <Switch ref={(checkedChildren) => { this.checkedChildren = checkedChildren }} 
                        checkedChildren={<Icon type="check" />} 
                        unCheckedChildren={<Icon type="close" />} 
                        onChange={this.handleChange} 
                        disabled={this.disabled}
                        checked={this.state.checked}/>
            </span>
        </span>
    }

    handleChange = (checkedChildren) => {
        if(checkedChildren){
            this.setState({ 
                value: "check",
                checked: true
            });
        } else {
            this.setState({ 
                value: "",
                checked: false
            });
        }
    }

    buildOperationColumn = () =>{

    }

}

const styles = {
    input: {
        width: 30
    },
    tableButton: {
        marginLeft:'40px'
    }
};
