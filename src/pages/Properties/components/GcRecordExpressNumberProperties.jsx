import RecordExpressNumberTable from "../../../components/Table/gc/RecordExpressNumberTable";
import RecordExpressNumberRequest from "../../../api/gc/record-express-number/RecordExpressNumberRequest";
import EntityScanProperties from "./entityProperties/EntityScanProperties";

export default class GcRecordExpressNumberProperties extends EntityScanProperties{

    static displayName = 'GcRecordExpressNumberProperties';
    
    resetData = () => {
      this.setState({
        selectedRowKeys: [],
        selectedRows: [],
        tableData: [],
        loading: false,
        resetFlag: true
      });
    }

    queryData = (whereClause) => {
      const self = this;
      let requestObject = {
        tableRrn: this.state.tableRrn,
        whereClause: whereClause,
        success: function(responseBody) {
          let materialLots = responseBody.materialLots;
          if (materialLots && materialLots.length > 0) {
            self.setState({
              tableData: materialLots,
              loading: false
            });
          } else {
            self.setState({
              tableData: [],
              loading: false
            });
          }
        }
      }
      RecordExpressNumberRequest.sendQueryMaterLotList(requestObject);
  }
    

    buildTable = () => {
        return <RecordExpressNumberTable 
                            table={this.state.table} 
                            pagination={false}
                            data={this.state.tableData} 
                            loading={this.state.loading}
                            resetData={this.resetData.bind(this)}
                            resetFlag={this.state.resetFlag} />
    }

    
}