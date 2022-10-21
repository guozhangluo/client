import TableManagerRequest from "../../../../api/table-manager/TableManagerRequest";
import LotRecordExpressNumberTable from "../../../../components/Table/lgTable/LotRecordExpressNumberTable";
import EntityScanProperties from "../entityProperties/EntityScanProperties";

export default class LotRecordExpressNumberProperties extends EntityScanProperties{

    static displayName = 'LotRecordExpressNumberProperties';
      
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
          self.afterQuery(responseBody, whereClause);
        }
      }
      TableManagerRequest.sendGetDataByRrnRequest(requestObject);
    }

    buildTable = () => {
        return <LotRecordExpressNumberTable pagination={false} 
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