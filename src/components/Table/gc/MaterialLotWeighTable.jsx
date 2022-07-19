import EntityScanViewTable from '../EntityScanViewTable';
import { Button, Modal, Tag } from 'antd';
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import MessageUtils from '../../../api/utils/MessageUtils';
import { Notification } from '../../notice/Notice';
import WeightManagerRequest from '../../../api/gc/weight-manager/WeightManagerRequest';

/**
 * 称重
 */
export default class MaterialLotWeighTable extends EntityScanViewTable {

    static displayName = 'MaterialLotWeighTable';

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
        buttons.push(this.createWeighButton());
        return buttons;
    }

    createTagGroup = () => {
        let tags = [];
        tags.push(this.createStatistic());
        return tags;
    }

    createStatistic = () => {
        return <Tag color="#2db7f5">{I18NUtils.getClientMessage(i18NCode.BoxQty)}：{this.state.data.length}</Tag>
    }

    weight = () => {
        const {data} = this.state;
        let self = this;
        if (!data || data.length == 0) {
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.SelectAtLeastOneRow));
            return;
        }
        if(this.getNotScanWeightMaterialLots(data).length > 0 ){
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.BoxWeightCannotEmpty));
            return;
        }

        let requestObject = {
            materialLots: data,
            success: function(responseBody) {
                if (self.props.resetData) {
                    self.props.resetData();
                }
                MessageUtils.showOperationSuccess();
            }
        }
        WeightManagerRequest.sendWeightRequest(requestObject);
        
        // let flag = false;
        // data.forEach(materialLot => {
        //     let floatValue = materialLot.floatValue;
        //     if(materialLot.theoryWeight){
        //         let disWeight = Math.abs(materialLot.weight - materialLot.theoryWeight);
        //         if(disWeight > floatValue){
        //             flag = true;
        //             return;
        //         }
        //     }
        // });
        // if(flag){
        //     Modal.confirm({
        //         title: 'Confirm',
        //         content: I18NUtils.getClientMessage(i18NCode.WeightOutOfNormalRangeConfirmPlease),
        //         okText: '确认',
        //         cancelText: '取消',
        //         onOk:() => {
        //             self.setState({
        //                 loading: true
        //             });
        //             EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => this.setState({loading: false}));
                    
        //             let requestObject = {
        //                 materialLots: data,
        //                 success: function(responseBody) {
        //                     if (self.props.resetData) {
        //                         self.props.resetData();
        //                     }
        //                     MessageUtils.showOperationSuccess();
        //                 }
        //             }
        //             WeightManagerRequest.sendWeightRequest(requestObject);
        //         }
        //     });
        // } else {
        //     let requestObject = {
        //         materialLots: data,
        //         success: function(responseBody) {
        //             if (self.props.resetData) {
        //                 self.props.resetData();
        //             }
        //             MessageUtils.showOperationSuccess();
        //         }
        //     }
        //     WeightManagerRequest.sendWeightRequest(requestObject);
        // }

    }

    getNotScanWeightMaterialLots(data){
        let materialLots = [];
        data.forEach((materialLot) => {
            if(!materialLot.weight){
                materialLots.push(materialLot);
            }
        });
        return materialLots;
    }

    createWeighButton = () => {
        return <Button key="packCaseCheck" type="primary" style={styles.tableButton} loading={this.state.loading} icon="inbox" onClick={this.weight}>
                        {I18NUtils.getClientMessage(i18NCode.BtnWeigh)}
                    </Button>
    }

}

const styles = {
    tableButton: {
        marginLeft:'20px'
    }
};