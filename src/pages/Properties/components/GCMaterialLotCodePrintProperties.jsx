import EntityScanProperties from "./entityProperties/EntityScanProperties";
import GCMaterialLotCodePrintTable from "../../../components/Table/gc/GCMaterialLotCodePrintTable";
import MaterialLotManagerRequest from "../../../api/gc/material-lot-manager/MaterialLotManagerRequest";


export default class GCMaterialLotCodePrintProperties extends EntityScanProperties{

    static displayName = 'GCMaterialLotCodePrintProperties';
    
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
      MaterialLotManagerRequest.sendQueryMaterialLotIdOrLotIdRequest(requestObject);
  }

    buildTable = () => {
        return <GCMaterialLotCodePrintTable pagination={false} 
                                    table={this.state.table} 
                                    data={this.state.tableData} 
                                    loading={this.state.loading} 
                                    resetData={this.resetData.bind(this)}
                                    resetFlag={this.state.resetFlag}
                                    />
    }
}