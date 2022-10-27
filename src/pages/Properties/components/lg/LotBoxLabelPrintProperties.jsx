import MaterialLotRequest from "../../../../api/lg/material-lot-manager/MaterialLotRequest";
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
      let tagFlag = this.printTable.state.value;
      let requestObject = {
        tableRrn: this.state.tableRrn,
        whereClause: whereClause,
        tagFlag: tagFlag,
        success: function(responseBody) {
          let materialLots = responseBody.materialLots;
          self.setState({
            tableData: materialLots,
            loading: false,
            whereClause: whereClause
          });
          self.form.resetFormFileds();
        }
      }
      MaterialLotRequest.sendGetBoxLabelMLotListRequest(requestObject);
    }

    buildTable = () => {
        return <LotBoxLabelPrintTable pagination={false} 
                                    ref={(printTable) => { this.printTable = printTable }} 
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