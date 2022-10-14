import MobileProperties from "../../mobile/MobileProperties";
import { Notification } from "../../../../../components/notice/Notice";
import I18NUtils from "../../../../../api/utils/I18NUtils";
import { i18NCode } from "../../../../../api/const/i18n";
import MessageUtils from "../../../../../api/utils/MessageUtils";
import MaterialLot from "../../../../../api/dto/mms/MaterialLot";
import EventUtils from '../../../../../api/utils/EventUtils';
import moment from "moment";
import WaferManagerRequest from "../../../../../api/gc/wafer-manager-manager/WaferManagerRequest";
import MobileCOGReceiveTable from "../../../../../components/Table/gc/MobileCOGReceiveTable";
import StockOutManagerRequest from "../../../../../api/gc/stock-out/StockOutManagerRequest";

export default class GcMobileCOGReceiveProperties extends MobileProperties{

    static displayName = 'GcMobileCOGReceiveProperties';
    
    constructor(props) {
        super(props);
        this.state = {...this.state};
    }

    queryData = (whereClause) => {
      debugger;
      const self = this;
      let materialLotId = self.form.props.form.getFieldValue(self.form.state.queryFields[0].name);
      let {rowKey,tableData} = this.state;
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

    handleSubmit = () => {
      debugger;
      let self = this;
      let erpTime = self.orderTable.erpTime.picker.state.showDate;
      if(moment.isMoment(erpTime)){
        erpTime = erpTime.format("YYYY-MM-DD");
      }

      let receiveWithDoc = self.orderTable.state.value;
      if (receiveWithDoc == "receiveWithDoc" && (erpTime == "" || erpTime == null || erpTime == undefined)) {
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
          receiveWithDoc: receiveWithDoc,
          success: function(responseBody) {
              self.resetData();
              MessageUtils.showOperationSuccess();
          }
      }
      WaferManagerRequest.sendMoblieCogReceiveMLotRequest(requestObject);
    }

    buildTable = () => {
        return <MobileCOGReceiveTable 
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