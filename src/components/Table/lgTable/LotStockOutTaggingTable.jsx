import { Button, Input, Tag} from 'antd';
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import MessageUtils from '../../../api/utils/MessageUtils';
import LotStockOutTagForm from './LotStockOutTagForm';
import WltStockOutManagerRequest from '../../../api/gc/wlt-stock-out/WltStockOutManagerRequest';
import EntityListCheckTable from '../EntityListCheckTable';

export default class LotStockOutTaggingTable extends EntityListCheckTable {

    static displayName = 'LotStockOutTaggingTable';

    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createTagButton());
        return buttons;
    }

    createTagGroup = () => {
        let buttons = [];
        buttons.push(this.createInput());
        buttons.push(this.createPackageQty());
        buttons.push(this.createPieceNumber());
        buttons.push(this.createTotalNumber());
        return buttons;
    }

    createStatistic = () => {
        return <Tag color="#2db7f5">{this.state.data.length}</Tag>
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

    createInput = () => {
        return <div style={styles.input}>
            <Input ref={(input) => { this.input = input }} key="stockTagNote" placeholder="出货标注备注"/>
        </div>
    }

    createForm = () => {
        return  <LotStockOutTagForm visible={this.state.formVisible} 
                                     stockTagNote={this.state.stockTagNote} 
                                     materialLots={this.state.materialLots}
                                     materialName={this.state.materialName}
                                     width={1440}
                                     onOk={this.handleTagSuccess} 
                                     onCancel={this.handleCancel}/>
    }
    
    handleTagSuccess = () => {
        this.materialLots = [],
        this.setState({
            selectedRows: [],
            selectedRowKeys: [],
            formVisible : false,
        });
        if (this.props.resetData) {
            this.props.resetData();
        }
        MessageUtils.showOperationSuccess();
    }

    handleCancel = (e) => {
        this.setState({
            formVisible: false,
        })
    }

    stockOutTag = () => {
        let materialLots = this.getSelectedRows();
        if (materialLots.length === 0 ) {
            return;
        }
        this.validationMLotMaterialName(materialLots);
    }

    validationMLotMaterialName = (materialLots) => {
        const self = this;
        let stockTagNote = this.input.state.value;
        let requestObject = {
          materialLots: materialLots,
          success: function(responseBody) {
              let materialName = materialLots[0].materialName;
            self.setState({
                formVisible : true,
                materialLots: materialLots,
                stockTagNote: stockTagNote,
                materialName: materialName,
            }); 
          }
        }
        WltStockOutManagerRequest.sendValidateMlotMaterialNameRequest(requestObject);
    }  
    
    createTagButton = () => {
        return <Button key="stockOutTag" type="primary" style={styles.tableButton} icon="inbox" loading={this.state.loading} onClick={this.stockOutTag}>
                        {I18NUtils.getClientMessage(i18NCode.BtnTagging)}
                    </Button>
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
