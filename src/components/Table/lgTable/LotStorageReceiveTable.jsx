import { Button, Col, Icon, Input, Row, Switch, Tag } from 'antd';
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import MessageUtils from '../../../api/utils/MessageUtils';
import EntityScanViewTable from '../EntityScanViewTable';
import { Notification } from '../../notice/Notice';
import EventUtils from '../../../api/utils/EventUtils';
import LotStorageRequest from '../../../api/lg/lot-storage-manager/LotStorageRequest';
import FormItem from 'antd/lib/form/FormItem';

export default class LotStorageReceiveTable extends EntityScanViewTable {

    static displayName = 'LotStorageReceiveTable';

    getRowClassName = (record, index) => {
        if (record.errorFlag) {
            return 'error-row';
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
        buttons.push(this.createDeleteAllButton());
        buttons.push(this.createReceiveButton());
        return buttons;
    }

    createTagGroup = () => {
        let tags = [];
        tags.push(this.createStorageId());
        tags.push(this.createTotalPackageQty());
        tags.push(this.createStatistic());
        return tags;
    }

    createStorageId = () => {
        return  <FormItem>
                    <Row gutter={4}>
                        <Col span={2} >
                            <span style={styles.span} >{I18NUtils.getClientMessage(i18NCode.StorageId)}:</span>
                        </Col>
                        <Col span={3}>
                            <Input ref={(storageId) => { this.storageId = storageId }}  key="storage" placeholder="库位号"/>
                        </Col>
                    </Row>
                </FormItem>
    }

    createTotalPackageQty = () => {
        let materialLotUnits = this.state.data;
        let lotIdList = [];
        if(materialLotUnits && materialLotUnits.length > 0){
            materialLotUnits.forEach(data => {
                if (lotIdList.indexOf(data.lotId) == -1) {
                    lotIdList.push(data.lotId);
                }
            });
        }
        return <Tag color="#2db7f5">{I18NUtils.getClientMessage(i18NCode.PackageQty)}：{lotIdList.length}</Tag>
    }

    createStatistic = () => {
        return <Tag color="#2db7f5">{I18NUtils.getClientMessage(i18NCode.PieceQty)}：{this.state.data.length}</Tag>
    }

    receive = () => {
        const self = this;
        const {data} = this.state;
        if (data.length == 0) {
            Notification.showError(I18NUtils.getClientMessage(i18NCode.AddAtLeastOneRow));
            return;
        }
        let storageId = this.storageId.state.value;
        if(storageId != undefined && !storageId.startsWith("LHJ ")){
            Notification.showError(I18NUtils.getClientMessage(i18NCode.TheStorageIdIsError));
            return;
        }

        self.setState({
            loading: true
        });
        EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => self.setState({loading: false}));

        let requestObject = {
            mesStorageLots: data,
            storageId: storageId,
            success: function(responseBody) {
                if (self.props.resetData) {
                    self.props.resetData();
                }
                MessageUtils.showOperationSuccess();
            }
        }
        LotStorageRequest.sendZSWLotReceiveRequest(requestObject);
    }
    
    createDeleteAllButton = () => {
        return <Button key="deleteAll" type="primary" style={styles.tableButton} icon="delete" loading={this.state.loading} onClick={this.deleteAllMaterialLot}>
                        {I18NUtils.getClientMessage(i18NCode.BtnDeleteAll)}
                    </Button>
    }

    deleteAllMaterialLot = () => {
        let self = this;
        if( self.props.data.length == 0){
            return;
        } else {
            self.props.resetData();
            MessageUtils.showOperationSuccess();
        }
    }

    createReceiveButton = () => {
        return <Button key="receive" type="primary" style={styles.tableButton} loading={this.state.loading} icon="import" onClick={this.receive}>
                        {I18NUtils.getClientMessage(i18NCode.BtnReceive)}
                    </Button>
    }

    refreshDelete = (records) => {
        let datas = this.state.data;
        let recordList = [];
        if (!(records instanceof Array)) {
            let lotId = records.lotId;
            datas.forEach((item) => {
                if(item.lotId == lotId){
                    recordList.push(item);
                }
            });
        } else {
            recordList = records;
        }
        recordList.forEach((record) => {
            let dataIndex = datas.indexOf(record);
            if (dataIndex > -1 ) {
                datas.splice(dataIndex, 1);
            }
        });
        this.setState({
            data: datas,
            selectedRows: [],
            selectedRowKeys: []
        })
        MessageUtils.showOperationSuccess();
    }

}

const styles = {
    tableButton: {
        marginLeft:'20px'
    }
};
