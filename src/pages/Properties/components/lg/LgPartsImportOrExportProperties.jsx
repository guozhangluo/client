import TableManagerRequest from "../../../../api/table-manager/TableManagerRequest";
import LgPartsImportOrExportTable from "../../../../components/Table/lgTable/LgPartsImportOrExportTable";
import EntityScanProperties from "../entityProperties/EntityScanProperties";

export default class LgPartsImportOrExportProperties extends EntityScanProperties{

  static displayName = 'LgPartsImportOrExportProperties';

  queryData = (whereClause) => {
    const self = this;
    let tableData = [];
    let requestObject = {
      tableRrn: this.state.tableRrn,
      whereClause: whereClause,
      success: function(responseBody) {
        tableData = responseBody.dataList;
        self.setState({
          tableData: tableData,
          loading: false,
          resetFlag: true,
          whereClause: whereClause
        });
      }
    }
    TableManagerRequest.sendGetDataByRrnRequest(requestObject);
  }
    
  buildTable = () => {
      return <LgPartsImportOrExportTable table={this.state.table}  data={this.state.tableData} loading={this.state.loading} />
  }

}