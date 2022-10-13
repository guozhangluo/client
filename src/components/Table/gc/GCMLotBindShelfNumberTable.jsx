import { Button} from 'antd';
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import { Notification } from '../../notice/Notice';
import MessageUtils from "../../../api/utils/MessageUtils";
import EventUtils from "../../../api/utils/EventUtils";
import EntityScanViewTable from "../EntityScanViewTable";
import MaterialLotUpdateRequest from '../../../api/gc/materialLot-update-manager/MaterialLotUpdateRequest';
import IconUtils from '../../../api/utils/IconUtils';

export default class GCMLotBindShelfNumberTable extends EntityScanViewTable {

    static displayName = 'GCMLotBindShelfNumberTable';

    constructor(props) {
        super(props);
        this.state = {...this.state};
    }

    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createCheckButton());
        buttons.push(this.createUnCheckButton());
        return buttons;
    }

    createTagGroup = () => {
        let tagList = [];
        tagList.push(this.createPackageQty());
        tagList.push(this.createTotalNumber());
        return tagList;
    }

    check =() => {
        const {data} = this.state;
        let self = this;
        if(data.length == 0){
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.AddAtLeastOneRow));
            return;
        }

        self.setState({
            loading: true
        });
        EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => this.setState({loading: false}));
        
        let requestObject = {
            materialLotList: data,
            actionType: "BindShelfNumber",
            success: function(responseBody) {
                if (self.props.resetData) {
                    self.props.resetData();
                };
                MessageUtils.showOperationSuccess();
            }
        }
        MaterialLotUpdateRequest.sendUpdateShelfNumberRequest(requestObject);
    }

    unCheck =() => {
        const {data} = this.state;
        let self = this;
        if(data.length == 0){
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.AddAtLeastOneRow));
            return;
        }

        self.setState({
            loading: true
        });
        EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => this.setState({loading: false}));
        
        let requestObject = {
            materialLotList: data,
            actionType: "ClearShelfNumber",
            success: function(responseBody) {
                if (self.props.resetData) {
                    self.props.resetData();
                };
                MessageUtils.showOperationSuccess();
            }
        }
        MaterialLotUpdateRequest.sendUpdateShelfNumberRequest(requestObject);
    }

    createCheckButton = () => {
        return <Button key="check" type="primary" style={styles.tableButton} loading={this.state.loading} onClick={this.check}>
                        {IconUtils.buildIcon("edit")}{I18NUtils.getClientMessage(i18NCode.BtnBindNumber)}
                    </Button>
    }

    createUnCheckButton = () => {
        return <Button key="uncheck" type="primary" style={styles.tableButton} loading={this.state.loading} onClick={this.unCheck}>
                        {IconUtils.buildIcon("delete")}{I18NUtils.getClientMessage(i18NCode.BtnClearNumber)}
                    </Button>
    }

    buildOperationColumn = () => {

    }
}

const styles = {
    tableButton: {
        marginLeft:'20px'
    }
};