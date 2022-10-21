import EntityListTable from "../EntityListTable";
import { Button, Tag } from 'antd';
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import { Upload } from 'antd';
import { Notification } from '../../notice/Notice';
import MessageUtils from "../../../api/utils/MessageUtils";
import EventUtils from "../../../api/utils/EventUtils";
import LotImportRequest from "../../../api/lg/lot-unit-import/LotImportRequest";

const ImportType = {
    LGMaterialLotUnitImport: "LGMaterialLotUnitImport",
}

export default class LotImportTable extends EntityListTable {

    static displayName = 'LotImportTable';

    constructor(props) {
        super(props);
        this.state = {...this.state};
    }

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
        buttons.push(this.createImportButton());
        buttons.push(this.createSaveButton());
        buttons.push(this.createDeleteAllButton());
        return buttons;
    }

    createTagGroup = () => {
        let tagList = [];
        tagList.push(this.createMaterialLotsNumber());
        tagList.push(this.createStatistic());
        tagList.push(this.createTotalNumber());
        tagList.push(this.createErrorTag());
        return tagList;
    }

    createMaterialLotsNumber = () => {
        let materialLotUnits = this.state.data;
        let materialLotIdList = [];
        if(materialLotUnits && materialLotUnits.length > 0){
            materialLotUnits.forEach(data => {
                if (materialLotIdList.indexOf(data.reserved30) == -1) {
                    materialLotIdList.push(data.reserved30);
                }
            });
        }
        return <Tag color="#2db7f5">{I18NUtils.getClientMessage(i18NCode.BoxQty)}：{materialLotIdList.length}</Tag>
    }

    createErrorTag = () => {
        let errorInfoList = this.state.data.filter((d) => d.errorFlag && d.errorFlag === true);
        return <Tag color="#D2480A">{I18NUtils.getClientMessage(i18NCode.ErrorNumber)}：{errorInfoList.length}</Tag>
    }

    createTotalNumber = () => {
        let materialLots = this.state.data;
        let count = 0;
        if(materialLots && materialLots.length > 0){
            materialLots.forEach(data => {
                count = count + (data.currentQty == undefined ? 0 : data.currentQty) ;
            });
        }
        return <Tag color="#2db7f5">{I18NUtils.getClientMessage(i18NCode.TotalQty)}：{count}</Tag>
    }

    createStatistic = () => {
        return <Tag color="#2db7f5">{I18NUtils.getClientMessage(i18NCode.PieceQty)}：{this.state.data.length}</Tag>
    }

    deleteAllMaterialLot = () => {
        let self = this;
        if( self.state.data.length == 0){
            return;
        } else {
            self.props.resetData();
        }
    }

    handleUpload = (option) => {
        const self = this;
        let tableData = this.state.data;
        let fileName = option.file.name;
        let queryFields = this.props.propsFrom.state.queryFields;
        let importType = this.props.propsFrom.props.form.getFieldValue(queryFields[0].name);
        if((importType == undefined || importType == "")) {
            Notification.showInfo(I18NUtils.getClientMessage(i18NCode.ChooseImportTypePlease));
            return;
        }
        if(importType == "晶圆导入"){
            importType = ImportType.LGMaterialLotUnitImport;
        }
        if(tableData.length > 0){
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.DataNotImportedPleaseCleanAllBeforeSelectNewFile));
            return;
        }
        self.setState({
            loading: true
        });
        EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => this.setState({loading: false}));
        
        let object = {
            importType: importType,
            fileName: fileName,
            success: function(responseBody) {
                let materialLotUnitList = responseBody.dataList;
                materialLotUnitList = self.getMaterialLotListByImportType(fileName, materialLotUnitList);
                self.setState({
                    data: materialLotUnitList,
                    loading: false
                });
            }
        }
        LotImportRequest.sendSelectRequest(object, option.file);
    }

    importData =() => {
        let self = this;
        const {data} = this.state;
        if(data.length == 0){
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.AddAtLeastOneRow));
            return;
        }
        let errorInfoList = this.state.data.filter((d) => d.errorFlag && d.errorFlag === true);
        if(errorInfoList.length){
            Notification.showError(I18NUtils.getClientMessage(i18NCode.AbnormalInfoOnThePage));
            return;
        }
        let queryFields = this.props.propsFrom.state.queryFields;
        let importType = this.props.propsFrom.props.form.getFieldValue(queryFields[0].name);
        if(importType == "晶圆导入"){
            importType = ImportType.LGMaterialLotUnitImport;
        }

        self.setState({
            loading: true
        });
        EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => this.setState({loading: false}));
        
        let requestObject = {
            dataList: data,
            importType: importType,
            success: function(responseBody) {
                let importCode = responseBody.importCode;
                if(importCode == "" || importCode == null || importCode == undefined){
                    self.setState({
                        loading: false
                    }); 
                    Notification.showError(I18NUtils.getClientMessage(i18NCode.ImportExceptionAndReImport));
                } else {
                    self.setState({
                        data: [],
                        loading: false
                    }); 
                    let message =  I18NUtils.getClientMessage(i18NCode.OperationSucceed);
                    if(importCode != null || importCode != undefined){
                        message = message + `:${importCode}`;
                    }
                    MessageUtils.showOperationSuccess(message);
                }
            }
        }
        LotImportRequest.sendImportRequest(requestObject);
    }
    
    getMaterialLotListByImportType = (fileName, materialLotUnitList) => {
        materialLotUnitList.forEach(materialLotUnit =>{
            materialLotUnit.reserved47 = fileName;
            if(materialLotUnit.currentQty && isNaN(materialLotUnit.currentQty)){
                materialLotUnit.errorFlag = true;
            }
            if(materialLotUnit.currentSubQty && isNaN(materialLotUnit.currentSubQty)){
                materialLotUnit.errorFlag = true;
            }
            let fabLotId = materialLotUnit.reserved30;
            let waferId = materialLotUnit.reserved31;
            if(waferId.length < 2){
                waferId = "0" + waferId;
            }
            materialLotUnit.unitId = fabLotId +"-"+ waferId;
            materialLotUnit.lotId = fabLotId;
        });
        return materialLotUnitList;
    }

    createImportButton = () => {
        return (<Upload key="import" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                    customRequest={(option) => this.handleUpload(option)} showUploadList={false} >
                    <Button type="primary" style={styles.tableButton} loading={this.state.loading} icon="file-add">{I18NUtils.getClientMessage(i18NCode.BtnPreview)}</Button>
                </Upload>);
    }

    createSaveButton = () => {
        return <Button key="receive" type="primary" style={styles.tableButton} loading={this.state.loading} icon="import" onClick={this.importData}>
                        {I18NUtils.getClientMessage(i18NCode.BtnImp)}
                    </Button>
    }

    createDeleteAllButton = () => {
        return <Button key="deleteAll" type="primary" style={styles.tableButton} icon="delete" onClick={this.deleteAllMaterialLot}>
                        {I18NUtils.getClientMessage(i18NCode.BtnDeleteAll)}
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