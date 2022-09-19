import { Notification } from "../../../../../components/notice/Notice";
import I18NUtils from "../../../../../api/utils/I18NUtils";
import { i18NCode } from "../../../../../api/const/i18n";
import MobileProperties from "../../mobile/MobileProperties";
import MessageUtils from "../../../../../api/utils/MessageUtils";
import MobileMLotShipTable from "../../../../../components/Table/gc/MobileMLotShipTable";
import StockOutManagerRequest from "../../../../../api/gc/stock-out/StockOutManagerRequest";
import TableManagerRequest from "../../../../../api/table-manager/TableManagerRequest";
import MaterialLot from "../../../../../api/dto/mms/MaterialLot";

export default class GCMobileMLotShipScanProperties extends MobileProperties{

    static displayName = 'GCMobileMLotShipScanProperties';
    
    constructor(props) {
        super(props);
        this.state = {...this.state, rowKey: "objectRrn"};
    }

    queryData = (whereClause) => {
      const self = this;
      let materialLotId = self.form.props.form.getFieldValue(self.form.state.queryFields[0].name);
      let {rowKey,tableData} = this.state;
      let requestObject = {
        tableRrn: this.state.tableRrn,
        materialLotId: materialLotId,
        success: function(responseBody) {
          let materialLotList = responseBody.materialLotList;
          if (materialLotList && materialLotList.length > 0) {
            self.validationMaterialLot(materialLotList);
          } else {
            let data = new MaterialLot();
            let materialLotId = self.form.props.form.getFieldValue(self.form.state.queryFields[0].name);
            data[rowKey] = materialLotId;
            data.setMaterialLotId(materialLotId);
            data.errorFlag = true;
            if (tableData.filter(d => d[rowKey] === data[rowKey]).length === 0) {
              tableData.unshift(data);
            }
          }
          self.setState({ 
            tableData: tableData,
            loading: false
          });
          self.form.resetFormFileds();  
        }
      }
      StockOutManagerRequest.sendGetDataByRrnRequest(requestObject);
  }

  validationMaterialLot = (materialLotList) => {
    let self = this;
    let {rowKey,tableData} = this.state;
    let requestObject = {
      materialLotList: materialLotList,
      success: function(responseBody) {
          if(responseBody.falg){
            let errorData = [];
            let trueData = [];
            tableData.forEach(data => {
              if(data.errorFlag){
                errorData.push(data);
              } else {
                trueData.push(data);
              }
            });
            materialLotList.forEach(materialLot => {
              if (trueData.filter(d => d[rowKey] === materialLot[rowKey]).length === 0) {
                trueData.unshift(materialLot);
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
          materialLotList.forEach(materialLot => {
            if (tableData.filter(d => d[rowKey] === materialLot[rowKey]).length === 0) {
              materialLot.errorFlag = true;
              tableData.unshift(materialLot);
            }
          });
        }
        
        self.setState({ 
          tableData: tableData,
          loading: false
        });
        self.form.resetFormFileds();
      }
    }
    StockOutManagerRequest.sendValidationRequest(requestObject);
  }
    
    handleSubmit = () => {
        const {tableData} = this.state;
        let self = this; 
        if (this.dataTable.getErrorCount() > 0) {
            Notification.showError(I18NUtils.getClientMessage(i18NCode.ErrorNumberMoreThanZero));
            return;
        }

        if (!tableData || tableData.length == 0) {
            Notification.showError(I18NUtils.getClientMessage(i18NCode.SelectAtLeastOneRow));
            return;
        }
        let documentLineList = this.props.orderTable.state.data;
        if (documentLineList.length === 0) {
          Notification.showNotice(I18NUtils.getClientMessage(i18NCode.SelectOneRow));
            return;
        }

        let requestObj = {
            documentLineList : documentLineList,
            materialLots : tableData,
            success: function(responseBody) {
                if (self.props.resetData) {
                    self.props.onSearch();
                    self.props.resetData();
                }
                MessageUtils.showOperationSuccess();
            }
        }
        StockOutManagerRequest.sendStockOutRequest(requestObj);
    }

    buildTable = () => {
        return <MobileMLotShipTable ref={(dataTable) => { this.dataTable = dataTable }}  table={this.state.table} data={this.state.tableData} loading={this.state.loading} />
    }
}