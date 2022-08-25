import {Row, Col } from 'antd';
import TableManagerRequest from '../../../api/table-manager/TableManagerRequest';
import I18NUtils from '../../../api/utils/I18NUtils';
import RefListField from '../../Field/RefListField';
import { i18NCode } from '../../../api/const/i18n';
import { SystemRefListName, RefTableName } from '../../../api/const/ConstDefine';
import RefTableField from '../../Field/RefTableField';
import "../../Form/QueryForm.scss";
import FormItem from 'antd/lib/form/FormItem';
import SelectPoField from '../../Field/SelectPoField';
import EntityScanViewTable from '../EntityScanViewTable';

export default class LotStockOutTagShowTable extends EntityScanViewTable {

    static displayName = 'LotStockOutTagShowTable';
    
    componentWillReceiveProps = (props) => {
        const {visible, materialLots} = props;
        let self = this;
        if (visible) {
            self.setState({
                data: materialLots
            })
        } else {
            self.setState({
                data: [],
                selectedRows: [],
                selectedRowKeys: []
            })
        }
    }   

    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createTagInput());
        return buttons;
    }

    createTagGroup = () => {
        let buttons = [];
        buttons.push(this.createPackageQty());
        buttons.push(this.createPieceNumber());
        buttons.push(this.createTotalNumber());
        return buttons;
    }

    createTagInput = () => {
        return  <FormItem>
                    <Row gutter={24}>
                        <Col span={4} >
                            <span>{I18NUtils.getClientMessage(i18NCode.CustomerName)}:</span>
                        </Col>
                        <Col span={8}>
                            <RefTableField ref={(customerName) => { this.customerName = customerName }} field = {{refTableName : RefTableName.CustomerNameList, name: "customerName"}}/>
                        </Col>
                        <Col span={4} >
                            <span>{I18NUtils.getClientMessage(i18NCode.StockOutType)}:</span>
                        </Col>
                        <Col span={6}>
                            <RefListField ref={(stockOutType) => { this.stockOutType = stockOutType }} referenceName={SystemRefListName.StockOutType} />
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={4} >
                            <span>PO：</span>
                        </Col>
                        <Col span={8}>
                            <SelectPoField materialLots={this.state.data} ref={(poId) => { this.poId = poId }} field = {{refTableName : RefTableName.CPPoListByMaterialNameAndVender, name: "poId"}}/>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={4} >
                            <span>{I18NUtils.getClientMessage(i18NCode.VenderAddress)}:</span>
                        </Col>
                        <Col span={18}>
                            <RefTableField ref={(address) => { this.address = address }} field = {{refTableName : RefTableName.AddressByMaterialName, name: "address"}}/>
                        </Col>
                    </Row>
                </FormItem>
    }

    componentDidMount = () => {
        const self = this;
        self.getMaterialLotList();
        let requestObject = {
            name: "LGLotStockTaggingShow",
            success: function(responseBody) {
                let table = responseBody.table;
                let columnData = self.buildColumn(table);
                self.setState({
                    table: table,
                    columns: columnData.columns,
                    scrollX: columnData.scrollX,
                    loading: false
                }); 
            }
        }
        TableManagerRequest.sendGetByNameRequest(requestObject);
    }

    getMaterialLotList = () => {
        const {visible, materialLots} = this.props;
        let self = this;
        if (visible) {
            self.setState({
                data: materialLots
            })
        }
    }

    buildOperationColumn = () => {
    }
}
