import { Button, Col, Input, Row, Tag } from "antd";
import I18NUtils from '../../api/utils/I18NUtils';
import { i18NCode } from '../../api/const/i18n';
import EntityScanViewTable from './EntityScanViewTable';
import IconUtils from '../../api/utils/IconUtils';
import GetPrintWltBboxParameterRequest from '../../api/gc/get-print-wltbbox-parameter/GetPrintWltBboxParameterRequest';
import GetPrintCOBboxParameterRequest from '../../api/gc/get-print-cobbox-parameter/GetPrintCOBboxParameterRequest';
import RwMLotManagerRequest from '../../api/gc/rw-manager/RwMLotManagerRequest';
import GetPrintBboxParameterRequest from '../../api/gc/get-print-bbox-parameter/GetPrintBboxParameterRequest';
import FormItem from 'antd/lib/form/FormItem';
import MessageUtils from "../../api/utils/MessageUtils";

export default class GcPrintCaseLabelTable extends EntityScanViewTable {

    static displayName = 'GcPrintCaseLabelTable';

    getRowClassName = (record, index) => {
        if (record.newFlag) {
            return 'new-row';
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
        buttons.push(this.createPrintLabelCount());
        buttons.push(this.createStatistic());
        buttons.push(this.createTotalNumber());
        buttons.push(this.createPrintButton());
        return buttons;
    }

    createPrintLabelCount = () => {
        return  <FormItem>
                    <Row gutter={4}>
                        <Col span={2} >
                            <span>{I18NUtils.getClientMessage(i18NCode.PrintCount)}:</span>
                        </Col>
                        <Col span={3}>
                            <Input ref={(printCount) => { this.printCount = printCount }} defaultValue={2} key="printCount" placeholder="打印份数"/>
                        </Col>
                    </Row>
                </FormItem>
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

    createStatistic = () => {
        return <Tag color="#2db7f5">{I18NUtils.getClientMessage(i18NCode.PackageQty)}：{this.state.data.length}</Tag>
    }
 
    handlePrint = () => {
        let self = this;
        let materialLotList = self.state.data;
        let printCount = this.printCount.state.value;
        if (materialLotList.length == 0) {
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.SelectAtLeastOneRow));
            return;
        }
        let packageType = materialLotList[0].packageType;
        let parentMaterialLotId = materialLotList[0].parentMaterialLotId;
        if(packageType == "WltPackCase"){
            let requestObject = {
                materialLotId : parentMaterialLotId,    
                printCount: printCount,
                success: function(responseBody) {
                    MessageUtils.showOperationSuccess();
                }
            }
            GetPrintWltBboxParameterRequest.sendQueryRequest(requestObject);
        } else if(packageType == "COBPackCase"){
            let requestObject = {
                materialLotId : parentMaterialLotId,   
                printCount: printCount,   
                success: function(responseBody) {
                    MessageUtils.showOperationSuccess();
                }
            }
            GetPrintCOBboxParameterRequest.sendQueryRequest(requestObject);
        } else if(packageType == "CSTPackCase"){
            let requestObject = {
                materialLotId : parentMaterialLotId,
                printCount: printCount, 
                success: function(responseBody) {
                    MessageUtils.showOperationSuccess();
                }
            }
            RwMLotManagerRequest.sendRWPrintParameterRequest(requestObject);
        }else {
            let requestObject = {
                materialLotId : parentMaterialLotId,
                printCount: printCount,   
                success: function(responseBody) {
                    MessageUtils.showOperationSuccess();
                }
            }
            GetPrintBboxParameterRequest.sendQueryRequest(requestObject);
        }
    }

    buildOperationColumn = () => {
        
    }

    createPrintButton = () => {
        return <Button key="print" type="primary" onClick={() => this.handlePrint()}>
                        {IconUtils.buildIcon("icon-barcode")}{I18NUtils.getClientMessage(i18NCode.BtnPrint)}</Button>;

    }

}
