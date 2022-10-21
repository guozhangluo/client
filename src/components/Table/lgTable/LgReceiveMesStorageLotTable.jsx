
import {Tag, Row, Col, Input } from 'antd';
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import EntityScanViewTable from '../EntityScanViewTable';
import FormItem from 'antd/lib/form/FormItem';
export default class LgReceiveMesStorageLotTable extends EntityScanViewTable {

    static displayName = 'LgReceiveMesStorageLotTable';

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
        buttons.push(this.createStorageId());
        buttons.push(this.createTotalPackageQty());
        buttons.push(this.createStatistic());
        return buttons;
    }

    getErrorCount = () => {
        let materialLots = this.state.data;
        let count = 0;
        if(materialLots && materialLots.length > 0){
            materialLots.forEach(data => {
                if(data.errorFlag){
                    count = count +1;
                }
            });
        }
        return count;
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

    createStorageId = () => {
        return  <FormItem>
                    <Row gutter={4}>
                        <Col span={2} style={styles.col} >
                            <span >{I18NUtils.getClientMessage(i18NCode.StorageId)}:</span>
                        </Col>
                        <Col span={3}>
                            <Input style={styles.input} ref={(storageId) => { this.storageId = storageId }}  key="storage" placeholder="库位号"/>
                        </Col>
                    </Row>
                </FormItem>
    }

    createErrorNumberStatistic = () => {
        return <Tag color="#D2480A">{I18NUtils.getClientMessage(i18NCode.ErrorNumber)}：{this.getErrorCount()}</Tag>
    }
    
    buildOperationColumn = () => {
      
    }

    
}

const styles = {
    tableButton: {
        marginLeft:'20px'
    },
    input: {
        marginLeft: '6px',
        width: '150px'
    },
    col: {
        width: '55px'
    }
};