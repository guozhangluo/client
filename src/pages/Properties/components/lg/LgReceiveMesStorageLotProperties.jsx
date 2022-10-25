import { Notification } from "../../../../components/notice/Notice";
import MobileProperties from "../mobile/MobileProperties";
import I18NUtils from "../../../../api/utils/I18NUtils";
import { i18NCode } from "../../../../api/const/i18n";
import MessageUtils from "../../../../api/utils/MessageUtils";
import EventUtils from "../../../../api/utils/EventUtils";
import LgReceiveMesStorageLotTable from "../../../../components/Table/lgTable/LgReceiveMesStorageLotTable";
import LotStorageRequest from "../../../../api/lg/lot-storage-manager/LotStorageRequest";
export default class LgReceiveMesStorageLotProperties extends MobileProperties{

    static displayName = 'LgReceiveMesStorageLotProperties';
    
    constructor(props) {
        super(props);
        this.state = {...this.state};
    }

    queryData = (whereClause) => {
      const self = this;
      let {tableData} = this.state;
      let lotId = self.form.props.form.getFieldValue(self.form.state.queryFields[0].name);
//      let fosbId = self.form.props.form.getFieldValue(self.form.state.queryFields[1].name);
      let requestObject = {
        lotId: lotId,
//        fosbId: fosbId,
        success: function(responseBody) {
          let mesStorageLotList = responseBody.mesStorageLotList;
          if (mesStorageLotList && mesStorageLotList.length > 0) {
            mesStorageLotList.forEach(data => {
              if (tableData.filter(d => d.waferId === data.waferId).length === 0) {
                tableData.unshift(data);
              }
            });
            self.setState({ 
              tableData: tableData,
              loading: false
            });
            self.form.resetFormFileds();
          } else {
            self.showDataNotFound();
          }
        }
      }
      LotStorageRequest.sendQueryStoarageLotRequest(requestObject);
    }

    handleSubmit = () => {
      const self = this;
      const {tableData} = self.state;
      if (tableData.length == 0) {
          Notification.showError(I18NUtils.getClientMessage(i18NCode.AddAtLeastOneRow));
          return;
      }
      let storageId = self.orderTable.storageId.value;
      if(storageId != undefined && !storageId.startsWith("LHJ ")){
          Notification.showError(I18NUtils.getClientMessage(i18NCode.TheStorageIdIsError));
          return;
      }

      self.setState({
          loading: true
      });
      EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => self.setState({loading: false}));

      let requestObject = {
          mesStorageLots: tableData,
          storageId: storageId,
          success: function(responseBody) {
              if (self.resetData) {
                  self.resetData();
              }
              MessageUtils.showOperationSuccess();
          }
      }
      LotStorageRequest.sendLotReceiveRequest(requestObject);
    }

    onFiledEnter = (e, field) => {
      let self = this;
      let queryFields = this.state.queryFields;
      if (queryFields && Array.isArray(queryFields)) {
          let dataIndex = -1;
          queryFields.map((queryFields, index) => {
              if (queryFields[DefaultRowKey] === field[DefaultRowKey]) {
                  dataIndex = index;
              }
          });
          if (dataIndex == queryFields.length - 1) {
              this.props.form.validateFields((err, values) => {
                  self.onLastFiledEnter(field);
              });
          } else {
              let nextDataIndex = dataIndex + 1;
              let nextFields = queryFields[nextDataIndex];
              document.getElementById(nextFields.name).focus();
          }
      }
  }


    buildTable = () => {
        return <LgReceiveMesStorageLotTable ref={(orderTable) => { this.orderTable = orderTable }}
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