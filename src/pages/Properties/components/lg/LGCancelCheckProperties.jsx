import MobileProperties from "../mobile/MobileProperties";
import MessageUtils from "../../../../api/utils/MessageUtils";
import MaterialLotManagerRequest from "../../../../api/gc/material-lot-manager/MaterialLotManagerRequest";
import LGCancelCheckTable from "../../../../components/Table/lgTable/LGCancelCheckTable";
import I18NUtils from "../../../../api/utils/I18NUtils";
import { i18NCode } from "../../../../api/const/i18n";
import EventUtils from "../../../../api/utils/EventUtils";
import { Notification } from "../../../../components/notice/Notice";

export default class LGCancelCheckProperties extends MobileProperties{

  static displayName = 'LGCancelCheckProperties';
  
  constructor(props) {
      super(props);
      this.state = {...this.state};
  }

  queryData = (whereClause) => {
    const self = this;
    let {tableData} = this.state;
    if(whereClause == ''){
      Notification.showInfo(I18NUtils.getClientMessage(i18NCode.SearchFieldCannotEmpty))
      self.setState({ 
        tableData: tableData,
        loading: false
      });
      return;
    } else {
      let queryFields = this.form.state.queryFields;
      let queryLotId = this.form.props.form.getFieldValue(queryFields[0].name);
      let requestObject = {
        tableRrn: this.state.tableRrn,
        queryLotId: queryLotId,
        success: function(responseBody) {
          let materialLot = responseBody.materialLot;
          if (materialLot) {
              if (tableData.filter(d => d.materialLotId === materialLot.materialLotId).length === 0) {
                tableData.unshift(materialLot);
              }
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
      MaterialLotManagerRequest.sendQueryMLotInfoByRrnRequest(requestObject);
  }
      
  }

  handleSubmit = () => {
    let self = this;
    const {tableData} = self.state;
    debugger;
    let cancelReason = self.orderTable.cancelReason.state.value;
    if(tableData.length == 0){
        Notification.showNotice(I18NUtils.getClientMessage(i18NCode.AddAtLeastOneRow));
        return;
    }
    if(cancelReason == "" || cancelReason == undefined){
        Notification.showNotice(I18NUtils.getClientMessage(i18NCode.PleaseChooseCancelReason));
        return;
    }

    self.setState({
        loading: true
    });
    EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => self.setState({loading: false}));
    
    let requestObject = {
        materialLotList: tableData,
        cancelReason: cancelReason,
        success: function(responseBody) {
            if (self.resetData) {
                self.resetData();
            };
            MessageUtils.showOperationSuccess();
        }
    }
    MaterialLotManagerRequest.sendGetCancelCheckRequest(requestObject);
      
  }

  buildTable = () => {
      return <LGCancelCheckTable ref={(orderTable) => { this.orderTable = orderTable }}
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
