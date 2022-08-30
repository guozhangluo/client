import { Button} from 'antd';
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import MessageUtils from '../../../api/utils/MessageUtils';
import EntityScanViewTable from '../EntityScanViewTable';
import EventUtils from '../../../api/utils/EventUtils';
import MaterialLotRequest from '../../../api/lg/material-lot-manager/MaterialLotRequest';

export default class LotIssueTable extends EntityScanViewTable {

    static displayName = 'LotIssueTable';

    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createIssueButton());
        return buttons;
    }

    createTagGroup = () => {
        let buttons = [];
        buttons.push(this.createPackageQty());
        buttons.push(this.createPieceNumber());
        buttons.push(this.createTotalNumber());
        return buttons;
    }

    Issue = () => {
        let self = this;
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
                if (self.props.resetData) {
                    self.props.resetData();
                }
                MessageUtils.showOperationSuccess();
            }
          }
          MaterialLotRequest.sendMaterialLotIssueRequest(requestObject);
    }
    
    createIssueButton = () => {
        return <Button key="issue" type="primary" style={styles.tableButton} icon="inbox" loading={this.state.loading} onClick={this.Issue}>
                        {I18NUtils.getClientMessage(i18NCode.BtnIssue)}
                    </Button>
    }
}

const styles = {
    tableButton: {
        marginLeft:'20px'
    }
};
