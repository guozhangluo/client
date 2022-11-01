import TableManagerRequest from '../../../api/table-manager/TableManagerRequest';
import EntityListTable from '../EntityListTable';

export default class LgPartsImportOrExportTable extends EntityListTable {

    static displayName = 'LgPartsImportOrExportTable';

    constructor(props) {
        super(props);
    }

    /**
     * 导入按钮
     * @param {} option 
     */
    handleUpload = (option) => {
        const {table} = this.state;
        let object = {
            tableRrn: table.objectRrn,
        }
        TableManagerRequest.sendImportRequest(object, option.file);
    }

    /**
     * 导出功能实现
     * @returns 
     */
    exportData = () => {
        const {table} = this.state;
        let tableData = this.state.data;
        if(tableData.length == 0){
            return;
        }
        let object = {
            tableName: "GCCobStockOutTagUpdateUnitExport",
            fileName: table.labelZh + ".xls",
            materialLotList: tableData
        }
        MaterialLotUpdateRequest.sendExportRequest(object);
    }


    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createImportButton());
        buttons.push(this.createExportDataAndTemplateButton());
        return buttons;
    }

}

const styles = {
    tableButton: {
        marginLeft:'20px'
    }
};