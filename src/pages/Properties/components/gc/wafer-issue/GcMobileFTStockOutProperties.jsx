import MobileProperties from "../../mobile/MobileProperties";
import { Notification } from "../../../../../components/notice/Notice";
import I18NUtils from "../../../../../api/utils/I18NUtils";
import { i18NCode } from "../../../../../api/const/i18n";
import MessageUtils from "../../../../../api/utils/MessageUtils";
import MaterialLot from "../../../../../api/dto/mms/MaterialLot";
import EventUtils from '../../../../../api/utils/EventUtils';
import MobileMaterialLotReTestOrderTable from "../../../../../components/Table/gc/MobileMaterialLotReTestOrderTable";
import TableManagerRequest from "../../../../../api/table-manager/TableManagerRequest";
import RetestManagerRequest from "../../../../../api/gc/retest-manager/RetestManagerRequest";
import moment from "moment";
import StockOutManagerRequest from "../../../../../api/gc/stock-out/StockOutManagerRequest";
import FtMLotManagerRequest from "../../../../../api/gc/ft-materialLot-manager/FtMLotManagerRequest";

export default class GcMobileFTStockOutProperties extends MobileProperties{

    static displayName = 'GcMobileFTStockOutProperties';
    
    constructor(props) {
        super(props);
        this.state = {...this.state};
    }
    
    queryData = (whereClause) => {
      const self = this;
      let {rowKey,tableData} = this.state;
      let queryFields = this.form.state.queryFields;
      let materialLotId = this.form.props.form.getFieldValue(queryFields[0].name);
      let requestObject = {
        tableRrn: this.state.tableRrn,
        materialLotId: materialLotId,
        success: function(responseBody) {
          let materialLotList = responseBody.materialLotList;
          if (materialLotList && materialLotList.length > 0) {
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

            self.setState({ 
              tableData: tableData,
              loading: false
            });
          } else {
              let data = new MaterialLot();
              data[rowKey] = materialLotId;
              data.setMaterialLotId(materialLotId);
              data.errorFlag = true;
              if (tableData.filter(d => d[rowKey] === data[rowKey]).length === 0) {
                tableData.unshift(data);
              }
              self.setState({ 
                tableData: tableData,
                loading: false
              });
          }
          self.form.resetFormFileds();
        }
      }
      StockOutManagerRequest.sendGetDataByRrnRequest(requestObject);
    }

    handleSubmit = () => {
      let self = this;
      let erpTime = self.orderTable.erpTime.picker.state.showDate;
      if(moment.isMoment(erpTime)){
        erpTime = erpTime.format("YYYY-MM-DD");
      }

      if (erpTime == "" || erpTime == null || erpTime == undefined) {
          Notification.showNotice(I18NUtils.getClientMessage(i18NCode.SelectERPTime));
          return;
      }

      if (self.orderTable.getErrorCount() > 0) {
          Notification.showError(I18NUtils.getClientMessage(i18NCode.ErrorNumberMoreThanZero));
          return;
      }
      
      let materialLots = self.orderTable.state.data;
      if (materialLots.length === 0) {
          Notification.showNotice(I18NUtils.getClientMessage(i18NCode.AddAtLeastOneRow));
          return;
      }

      self.setState({
          loading: true
      });
      EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => self.setState({loading: false}));
      let requestObject = {
          materialLots : materialLots,
          erpTime : erpTime,
          success: function(responseBody) {
              self.resetData();
              MessageUtils.showOperationSuccess();
          }
      }
      FtMLotManagerRequest.sendMobileFTStockOutRequest(requestObject);
    }

    buildTable = () => {
        return <MobileMaterialLotReTestOrderTable 
                                        ref={(orderTable) => { this.orderTable = orderTable }} 
                                        pagination={false} 
                                        table={this.state.table} 
                                        data={this.state.tableData} 
                                        loading={this.state.loading} 
                                        resetData={this.resetData.bind(this)}
                                        resetFlag={this.state.resetFlag}
                                        />
    }

}