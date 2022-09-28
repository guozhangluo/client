import EntityScanProperties from "./entityProperties/EntityScanProperties";
import CheckTable from "../../../components/Table/gc/CheckTable";
import TableManagerRequest from "../../../api/table-manager/TableManagerRequest";
import uuid from 'react-native-uuid';
import { Notification } from "../../../components/notice/Notice";
import I18NUtils from "../../../api/utils/I18NUtils";
import { i18NCode } from "../../../api/const/i18n";
import CheckInventoryManagerRequest from "../../../api/gc/check-inventory-manager/CheckInventoryManagerRequest";
import MaterialLot from "../../../api/dto/mms/MaterialLot";

/**
 * GC 盘点
 *  当数据不存在的时候，直接添加一笔数据
 */
export default class GcCheckProperties extends EntityScanProperties{

    static displayName = 'GcCheckProperties';
    
    queryData = (whereClause) => {
        const self = this;
        let {rowKey,tableData} = this.state;
        let data = "";
        let queryFields = this.form.state.queryFields;
        if (queryFields.length === 1) {
            data = this.form.props.form.getFieldValue(queryFields[0].name)
        }
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
            self.queryNodeFocus();
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
      this.allFieldBlur();
      self.form.resetFormFileds();
      this.form.state.queryFields[0].node.focus();
      Notification.showInfo(I18NUtils.getClientMessage(i18NCode.DataAlreadyExists) + (data || ""));
    }

    buildTable = () => {
        return <CheckTable pagination={false} 
                                    rowKey={this.state.rowKey} 
                                    selectedRowKeys={this.state.selectedRowKeys} 
                                    selectedRows={this.state.selectedRows} 
                                    table={this.state.table} 
                                    data={this.state.tableData} 
                                    loading={this.state.loading} 
                                    resetData={this.resetData.bind(this)}/>
    }

}