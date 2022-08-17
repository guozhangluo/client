import TableManagerRequest from "../../../../api/table-manager/TableManagerRequest";
import LotPackCaseCheckTable from "../../../../components/Table/lgTable/LotPackCaseCheckTable";
import EntityDoubleScanProperties from "../entityProperties/EntityDoubleScanProperties";

export default class LotPackCaseCheckProperties extends EntityDoubleScanProperties{

    static displayName = 'LotPackCaseCheckProperties';
    
    queryData = (whereClause) => {
      const self = this;
      let reloadTableData = false;
      let firstQueryField = self.form.state.queryFields[0];
      if (whereClause.indexOf(firstQueryField.name) != -1) {
          reloadTableData = true;
      }
      let requestObject = {
        tableRrn: this.state.tableRrn,
        whereClause: whereClause,
        success: function(responseBody) {
          let queryDatas = responseBody.dataList;
          if (reloadTableData) {
            if (queryDatas && queryDatas.length > 0) {
                self.setState({ 
                  tableData: queryDatas,
                  loading: false,
                  scanErrorFlag: false,
                  resetFlag:true,
                  selectedRowKeys: [],
                  selectedRows: [],
                });
                self.nextQueryNodeFocus();
                self.form.resetFormFileds();
            } else {
              self.showDataNotFound(reloadTableData);
              self.resetData();
            }
          } else {
            self.afterSecondQuery(queryDatas);
          }
        }
      }
      TableManagerRequest.sendGetDataByRrnRequest(requestObject);
    }

    buildTable = () => {
        return <LotPackCaseCheckTable pagination={false} 
                                    rowKey={this.state.rowKey} 
                                    selectedRowKeys={this.state.selectedRowKeys} 
                                    selectedRows={this.state.selectedRows} 
                                    table={this.state.table} 
                                    data={this.state.tableData} 
                                    loading={this.state.loading} 
                                    resetData={this.resetData.bind(this)}
                                    resetFlag={this.state.resetFlag}
                                    scanErrorFlag={this.state.scanErrorFlag}/>
    }
}