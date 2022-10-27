import MobileProperties from "../mobile/MobileProperties";
import TableManagerRequest from "../../../../api/table-manager/TableManagerRequest";
import LgLotBoxLabelPrintTable from '../../../../components/Table/lgTable/LgLotBoxLabelPrintTable';
import EventUtils from '../../../../api/utils/EventUtils';
import MaterialLotRequest from '../../../../api/lg/material-lot-manager/MaterialLotRequest';
import I18NUtils from "../../../../api/utils/I18NUtils";
import { i18NCode } from "../../../../api/const/i18n";
import { Notification } from "../../../../components/notice/Notice";
import MessageUtils from "../../../../api/utils/MessageUtils";

export default class LgLotBoxLabelPrintProperties extends MobileProperties{

    static displayName = 'LgLotBoxLabelPrintProperties';

    queryData = (whereClause) => {
        const self = this;
        let {rowKey,tableData} = this.state;
        let requestObject = {
          tableRrn: this.state.tableRrn,
          whereClause: whereClause,
          success: function(responseBody) {
            let queryDatas = responseBody.dataList;
            if (queryDatas && queryDatas.length > 0) {
              queryDatas.forEach(data => {
                if (tableData.filter(d => d[rowKey] === data[rowKey]).length === 0) {
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
        TableManagerRequest.sendGetDataByRrnRequest(requestObject);
      }

      handleSubmit = () => {
        let self = this;
        let materialLotList = self.state.tableData;
        if (materialLotList.length == 0) {
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.SelectAtLeastOneRow));
            return;
        }
        let printCount = this.dataTable.printCount.state.value;

        self.setState({
            loading: true
        });
        EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => self.setState({loading: false}));

        let requestObject = {
            materialLotList: materialLotList,
            printCount: printCount,
            success: function(responseBody) {
                if (self.resetData) {
                    self.resetData();
                }
                MessageUtils.showOperationSuccess();
            }
          }
          MaterialLotRequest.sendLotBoxLabelPrintRequest(requestObject);
      }

      buildTable = () => {
        return <LgLotBoxLabelPrintTable ref={(dataTable) => { this.dataTable = dataTable }} pagination={false} 
                                    rowKey={this.state.rowKey} 
                                    selectedRowKeys={this.state.selectedRowKeys} 
                                    selectedRows={this.state.selectedRows} 
                                    resetFlag={this.state.resetFlag} 
                                    table={this.state.table} 
                                    data={this.state.tableData} 
                                    loading={this.state.loading}
                                    onSearch={this.queryData.bind(this)} 
                                    resetData={this.resetData.bind(this)}/>
    }
}
