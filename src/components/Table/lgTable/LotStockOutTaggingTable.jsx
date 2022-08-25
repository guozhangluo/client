import { Button, Input} from 'antd';
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import MessageUtils from '../../../api/utils/MessageUtils';
import EntityScanViewTable from '../EntityScanViewTable';
import LotStockOutTagForm from './LotStockOutTagForm';
import WltStockOutManagerRequest from '../../../api/gc/wlt-stock-out/WltStockOutManagerRequest';

export default class LotStockOutTaggingTable extends EntityScanViewTable {

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
        const {data} = this.state;
        if (data.length === 0 ) {
            return;
        }
        this.validationMLotMaterialName(data);
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
