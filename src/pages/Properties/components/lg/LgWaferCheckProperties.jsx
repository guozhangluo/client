import MobileProperties from "../mobile/MobileProperties";
import MessageUtils from "../../../../api/utils/MessageUtils";
import LgWaferCheckTable from "../../../../components/Table/lgTable/LgWaferCheckTable";
import CheckInventoryManagerRequest from "../../../../api/gc/check-inventory-manager/CheckInventoryManagerRequest";
import MaterialLot from "../../../../api/dto/mms/MaterialLot";
import I18NUtils from "../../../../api/utils/I18NUtils";
import { i18NCode } from "../../../../api/const/i18n";
import { Notification } from "../../../../components/notice/Notice";
export default class LgWaferCheckProperties extends MobileProperties{

    static displayName = 'LgWaferCheckProperties';
    
    constructor(props) {
        super(props);
        this.state = {...this.state};
    }

    queryData = (whereClause) => {
        const self = this;
        let {rowKey,tableData} = this.state;
        let data = this.form.props.form.getFieldValue(this.form.state.queryFields[0].name);
        let requestObject = {
          queryLotId: data,
          tableRrn: this.state.tableRrn,
          success: function(responseBody) {
            let materialLotList = responseBody.materialLotList;
            if(materialLotList && materialLotList.length > 0){
              let errorData = [];
              let trueData = [];
              tableData.forEach(data =>{
                if(data.errorFlag){
                  errorData.push(data);
                } else {
                  trueData.push(data);
                }
              });
              materialLotList.forEach(materialLot => {
                if (trueData.filter(d => d[rowKey] === materialLot[rowKey]).length === 0) {
                  trueData.unshift(materialLot);
                } else {
                  self.showDataAlreadyExists();
                }
              });
              
              tableData = [];
              errorData.forEach(data => {
                tableData.push(data);
              });
              trueData.forEach(data => {
                tableData.push(data);
              });
            } else {
              let errorData = new MaterialLot();
              errorData[rowKey] = data;
              errorData.setLotId(data);
              errorData.setMaterialLotId(data);
              errorData.errorFlag = true;
              if (tableData.filter(d => d[rowKey] === errorData[rowKey]).length === 0) {
                tableData.unshift(errorData);
              }else {
                self.showDataAlreadyExists();
              }
            }
            self.setState({ 
              tableData: tableData,
              loading: false
            });
            self.form.resetFormFileds();
          }
        }
        CheckInventoryManagerRequest.queryCheckMaterialLot(requestObject);
    }

    showDataAlreadyExists = () => {
        // 如果只有一个条件，则提示具体条件
        const self = this;
        let queryFields = this.form.state.queryFields;
        let data = this.form.props.form.getFieldValue(queryFields[0].name);
        this.setState({ 
          loading: false
        });
        self.form.resetFormFileds();
        Notification.showInfo(I18NUtils.getClientMessage(i18NCode.DataAlreadyExists) + (data || ""));
      }

    handleSubmit = () => {
        const {tableData} = this.state;
        let self = this;
        if (!tableData || tableData.length == 0) {
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.SelectAtLeastOneRow));
            return;
        }
        let existMaterialLots = this.state.tableData.filter((d) => d.errorFlag === undefined || d.errorFlag === false);
        let errorMaterialLots = this.state.tableData.filter((d) => d.errorFlag && d.errorFlag === true);
        if (this.orderTable.getErrorCount() > 0){
            Notification.showError(I18NUtils.getClientMessage(i18NCode.ErrorNumberMoreThanZero));
            return;
        }
        let requestObject = {
            existMaterialLots: existMaterialLots,
            errorMaterialLots: errorMaterialLots,
            success: function() {
                if (self.resetData) {
                    self.resetData();
                }
                MessageUtils.showOperationSuccess();
            }
        }
        CheckInventoryManagerRequest.sendCheckInventory(requestObject);
    }

    buildTable = () => {
        return <LgWaferCheckTable ref={(orderTable) => { this.orderTable = orderTable }}
                                    pagination={false} 
                                    rowKey={this.state.rowKey} 
                                    selectedRowKeys={this.state.selectedRowKeys} 
                                    selectedRows={this.state.selectedRows} 
                                    table={this.state.table} 
                                    data={this.state.tableData} 
                                    loading={this.state.loading} 
                                    resetData={this.resetData.bind(this)}/>
    }
}