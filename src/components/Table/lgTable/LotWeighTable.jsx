import {Button, Tag } from 'antd';
import { i18NCode } from '../../../api/const/i18n';
import MaterialLotRequest from '../../../api/lg/material-lot-manager/MaterialLotRequest';
import EventUtils from '../../../api/utils/EventUtils';
import I18NUtils from '../../../api/utils/I18NUtils';
import MessageUtils from '../../../api/utils/MessageUtils';
import EntityScanViewTable from '../EntityScanViewTable';

export default class LotWeighTable extends EntityScanViewTable {

    static displayName = 'LotWeighTable';

    getRowClassName = (record, index) => {
        if(index % 2 ===0) {
            return 'even-row'; 
        } else {
            return ''; 
        }
    };

    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createWeighButton());
        return buttons;
    }

    createTagGroup = () => {
        let tags = [];
        tags.push(this.createPackageQty());
        tags.push(this.createPieceNumber());
        tags.push(this.createTotalNumber());
        return tags;
    }

    weight = () => {
        const {data} = this.state;
        let self = this;
        if (!data || data.length == 0) {
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.SelectAtLeastOneRow));
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
        MaterialLotRequest.sendLotWeightRequest(requestObject);
    }

    createWeighButton = () => {
        return <Button key="weight" type="primary" style={styles.tableButton} loading={this.state.loading} icon="inbox" onClick={this.weight}>
                        {I18NUtils.getClientMessage(i18NCode.BtnWeigh)}
                    </Button>
    }

}

const styles = {
    tableButton: {
        marginLeft:'20px'
    }
};