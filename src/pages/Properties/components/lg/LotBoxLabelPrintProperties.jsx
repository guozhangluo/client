import TableManagerRequest from "../../../../api/table-manager/TableManagerRequest";
import LotBoxLabelPrintTable from "../../../../components/Table/lgTable/LotBoxLabelPrintTable";
import EntityScanProperties from "../entityProperties/EntityScanProperties";

export default class LotBoxLabelPrintProperties extends EntityScanProperties{

    static displayName = 'LotBoxLabelPrintProperties';
      
    resetData = () => {
      this.setState({
        selectedRowKeys: [],
        selectedRows: [],
        tableData: [],
        loading: false,
        resetFlag: true
      });
      this.form.resetFormFileds();
    }

    queryData = (whereClause) => {
      const self = this;
      let requestObject = {
        tableRrn: this.state.tableRrn,
        whereClause: whereClause,
        success: function(responseBody) {
          let queryDatas = responseBody.dataList;
          if (queryDatas && queryDatas.length > 0) {
            self.setState({ 
              tableData: queryDatas,
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

    buildTable = () => {
        return <LotBoxLabelPrintTable pagination={false} 
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