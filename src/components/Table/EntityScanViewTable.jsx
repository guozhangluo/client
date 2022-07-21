
import EntityListTable from './EntityListTable';
import { Tag } from 'antd';
import I18NUtils from '../../api/utils/I18NUtils';
import { i18NCode } from '../../api/const/i18n';

/**
 * 所有扫描条件添加数据的父类
 *  不具备操作按钮，具备删除按钮。删除按钮只是删除表格数据，而非删除数据库数据
 */
export default class EntityScanViewTable extends EntityListTable {

    static displayName = 'EntityScanViewTable';

    getRowClassName = (record, index) => {
        if (record.scaned) {
            return 'scaned-row';
        } else {
            if(index % 2 ===0) {
                return 'even-row'; 
            } else {
                return ''; 
            }
        }
    };

    selectRow = () => {

    }
    
    createButtonGroup = () => {
        
    }

    createStatistic = () => {
        return <Tag color="#2db7f5">{this.state.data.length}</Tag>
    }

    /**
     * 物料批次箱数
     * @returns 
     */
    createBBoxQty = () => {
        let materialLots = this.state.data;
        let patentMLotIdList = [];
        if(materialLots && materialLots.length > 0){
            materialLots.forEach(data => {
                let parentMaterialLotId = data.parentMaterialLotId;
                if(parentMaterialLotId != undefined && parentMaterialLotId != "" && parentMaterialLotId != null){
                    if (patentMLotIdList.indexOf(data.parentMaterialLotId) == -1) {
                        patentMLotIdList.push(data.parentMaterialLotId);
                    }
                }
            });
        }
        return <Tag color="#2db7f5">{I18NUtils.getClientMessage(i18NCode.BoxQty)}：{patentMLotIdList.length}</Tag>
    }

    /**
     * 总颗数
     * @returns 
     */
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


    queryNodeFocus = () => {
        if (this.form.state.queryFields[0]) {
          this.form.state.queryFields[0].node.focus();
        }
    }
    
    handleDelete = (record) => {
        this.refreshDelete(record);
    } 

    buildOperation = (record) => {
        let operations = [];
        operations.push(this.buildDeletePopConfirm(record));
        return operations;
    }

}
