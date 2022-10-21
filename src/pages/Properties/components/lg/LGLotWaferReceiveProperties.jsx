import MobileProperties from "../mobile/MobileProperties";
import TableManagerRequest from "../../../../api/table-manager/TableManagerRequest";
import LgLotReceiveMLotUnitTable from '../../../../components/Table/lgTable/LgLotReceiveMLotUnitTable';

import EventUtils from '../../../../api/utils/EventUtils';
import MaterialLotRequest from '../../../../api/lg/material-lot-manager/MaterialLotRequest';
import MaterialLot from "../../../../api/dto/mms/MaterialLot";
import I18NUtils from "../../../../api/utils/I18NUtils";
import { i18NCode } from "../../../../api/const/i18n";
import { Notification } from "../../../../components/notice/Notice";
import MessageUtils from "../../../../api/utils/MessageUtils";
export default class LGLotWaferReceiveProperties extends MobileProperties{

  static displayName = 'LGLotWaferReceiveProperties';
    
  constructor(props) {
      super(props);
      this.state = {...this.state,rowKey: "objectRrn"};
  }

  queryData = (whereClause) => {
    const self = this;
        let {rowKey,tableData} = this.state;
        let requestObject = {
          tableRrn: this.state.tableRrn,
          whereClause: whereClause,
          success: function(responseBody) {
            let queryDatas = responseBody.dataList;
            let data = undefined;
            if (queryDatas && queryDatas.length > 0) {
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
              queryDatas.forEach(data => {
               if(trueData.filter(d => d[rowKey] === data[rowKey]).length === 0) {
                  trueData.unshift(data);
                }
              });
              errorData.forEach(data => {
                tableData.push(data);
              });
              trueData.forEach(data => {
                tableData.push(data);
              });
            } else {
              debugger;
              data = new MaterialLot();
              let lotId = self.form.props.form.getFieldValue(self.form.state.queryFields[0].name);
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
        TableManagerRequest.sendGetDataByRrnRequest(requestObject);
  }

  handleSubmit = () => {
        let self = this;
        if (self.dataTable.getErrorCount() > 0) {
            Notification.showError(I18NUtils.getClientMessage(i18NCode.ErrorNumberMoreThanZero));
            return;
        }

        let materialLots = self.state.tableData;
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
            success: function(responseBody) {
                if (self.resetData) {
                    self.resetData();
                }
                MessageUtils.showOperationSuccess();
            }
        }
        MaterialLotRequest.sendLotReceiveRequest(requestObject);
  }

buildTable = () => {
  return <LgLotReceiveMLotUnitTable ref={(dataTable) => { this.dataTable = dataTable }} pagination={false} 
                              table={this.state.table} 
                              data={this.state.tableData} 
                              loading={this.state.loading} 
                              />
}
}