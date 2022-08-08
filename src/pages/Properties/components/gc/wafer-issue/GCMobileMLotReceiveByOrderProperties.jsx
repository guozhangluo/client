import { Notification } from "../../../../../components/notice/Notice";
import I18NUtils from "../../../../../api/utils/I18NUtils";
import { i18NCode } from "../../../../../api/const/i18n";
import MobileProperties from "../../mobile/MobileProperties";
import MessageUtils from "../../../../../api/utils/MessageUtils";
import MobileMLotReceiveTable from "../../../../../components/Table/gc/MobileMLotReceiveTable";
import WaferManagerRequest from "../../../../../api/gc/wafer-manager-manager/WaferManagerRequest";
import TableManagerRequest from "../../../../../api/table-manager/TableManagerRequest";
import MaterialLot from "../../../../../api/dto/mms/MaterialLot";

export default class GCMobileMLotReceiveByOrderProperties extends MobileProperties{

    static displayName = 'GCMobileMLotReceiveByOrderProperties';
    
    constructor(props) {
        super(props);
        this.state = {...this.state, rowKey: "objectRrn"};
    }
    
    queryData = (whereClause) => {
      const self = this;
      let {rowKey,tableData} = this.state;
      let queryFields = this.form.state.queryFields;
      let lotId = this.form.props.form.getFieldValue(queryFields[0].name);
        let requestObject = {
          tableRrn: this.state.tableRrn,
          lotId: lotId,
          success: function(responseBody) {
            let materialLot = responseBody.materialLot;
            if (materialLot && materialLot.objectRrn > 0) {
              let errorData = [];
              let trueData = [];
              tableData.forEach(data => {
                if(data.errorFlag){
                  errorData.push(data);
                } else {
                  trueData.push(data);
                }
              });
              tableData = [];
             if(trueData.filter(d => d[rowKey] === materialLot[rowKey]).length === 0) {
                trueData.unshift(materialLot);
              }
              errorData.forEach(data => {
                tableData.push(data);
              });
              trueData.forEach(data => {
                tableData.push(data);
              });
            } else {
              let data = new MaterialLot();
              data[rowKey] = lotId;
              data.setLotId(lotId);
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
        WaferManagerRequest.sendQueryCOBMaterialLotRequest(requestObject);
    }

    handleSubmit = () => {
        const {tableData} = this.state;
        let self = this; 
        if (!tableData || tableData.length == 0) {
            Notification.showError(I18NUtils.getClientMessage(i18NCode.SelectAtLeastOneRow));
            return;
        }
        
        if (this.dataTable.getErrorCount() > 0) {
            Notification.showError(I18NUtils.getClientMessage(i18NCode.ErrorNumberMoreThanZero));
            return;
        }

        let orders = this.props.orders;
        if (orders.length === 0) {
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.SelectOneRow));
            return;
        }

        let requestObject = {
            documentLines : orders,
            materialLots : tableData,
            receiveWithDoc: "receiveWithDoc",
            success: function(responseBody) {
                if (self.props.resetData) {
                    self.props.onSearch();
                }
                self.handleReset();
                MessageUtils.showOperationSuccess();
            }
        }
        WaferManagerRequest.sendReceiveWaferRequest(requestObject);
    }

    buildTable = () => {
        return <MobileMLotReceiveTable ref={(dataTable) => { this.dataTable = dataTable }}  table={this.state.table} data={this.state.tableData} loading={this.state.loading} />
    }
}