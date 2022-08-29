import { Button} from 'antd';
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import MessageUtils from '../../../api/utils/MessageUtils';
import EntityScanViewTable from '../EntityScanViewTable';
import EventUtils from '../../../api/utils/EventUtils';
import MaterialLotRequest from '../../../api/lg/material-lot-manager/MaterialLotRequest';

export default class LotStockOutTable extends EntityScanViewTable {

    static displayName = 'LotStockOutTable';

    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createShipButton());
        return buttons;
    }

    createTagGroup = () => {
        let buttons = [];
        buttons.push(this.createPackageQty());
        buttons.push(this.createPieceNumber());
        buttons.push(this.createTotalNumber());
        return buttons;
    }

    stockOut = () => {
        const {data} = this.state;
        if (data.length === 0 ) {
            return;
        }

        self.setState({
            loading: true
        });
        EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => self.setState({loading: false}));

        let requestObject = {
            materialLotList: data,
            success: function(responseBody) {
                if (this.props.resetData) {
                    this.props.resetData();
                }
                MessageUtils.showOperationSuccess();
            }
          }
          MaterialLotRequest.sendMaterialLotShipRequest(requestObject);
    }
    
    createShipButton = () => {
        return <Button key="stockOut" type="primary" style={styles.tableButton} icon="inbox" loading={this.state.loading} onClick={this.stockOut}>
                        {I18NUtils.getClientMessage(i18NCode.BtnShipOut)}
                    </Button>
    }
}

const styles = {
    tableButton: {
        marginLeft:'20px'
    }
};
