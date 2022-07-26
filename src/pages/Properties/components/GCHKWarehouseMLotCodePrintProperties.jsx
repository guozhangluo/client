import EntityScanProperties from "./entityProperties/EntityScanProperties";
import GCHKWarehouseMLotCodePrintTable from "../../../components/Table/gc/GCHKWarehouseMLotCodePrintTable";
import WltStockOutManagerRequest from "../../../api/gc/wlt-stock-out/WltStockOutManagerRequest";


export default class GCHKWarehouseMLotCodePrintProperties extends EntityScanProperties{

    static displayName = 'GCHKWarehouseMLotCodePrintProperties';
    
    constructor(props) {
        super(props);
        this.state = {...this.state, ...{showQueryFormButton: false}};
    }
    
    resetData = () => {
      this.setState({
        tableData: [],
        loading: false,
        resetFlag: true
      });
  }

    queryData = (whereClause) => {
      const self = this;
      let queryLotId = this.form.props.form.getFieldValue(this.form.state.queryFields[0].name);
      let requestObject = {
        tableRrn: this.state.tableRrn,
        queryLotId: queryLotId,
        success: function(responseBody) {
          let materialLotList = responseBody.materialLotList;
          if (materialLotList && materialLotList.length > 0){
            self.setState({
              tableData: materialLotList,
              loading: false
            });
            self.form.resetFormFileds();  
          } else {
            self.showDataNotFound();
          }
        }
      }
      WltStockOutManagerRequest.sendGetMaterialLotByRrnRequest(requestObject);
    }

    buildTable = () => {
        return <GCHKWarehouseMLotCodePrintTable pagination={false} 
                                    table={this.state.table} 
                                    data={this.state.tableData} 
                                    loading={this.state.loading} 
                                    resetData={this.resetData.bind(this)}
                                    resetFlag={this.state.resetFlag}
                                    />
    }
}