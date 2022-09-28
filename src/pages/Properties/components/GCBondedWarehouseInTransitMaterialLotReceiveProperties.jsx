import EntityScanProperties from "./entityProperties/EntityScanProperties";
import MaterialLot from "../../../api/dto/mms/MaterialLot";
import HKWaitReceiveMLotProperties from "./HKWaitReceiveMLotProperties";
import GCBondedWarehouseInTransitMaterialLotReceiveTable from "../../../components/Table/gc/GCBondedWarehouseInTransitMaterialLotReceiveTable";
import HKWarehouseManagerRequest from "../../../api/gc/hongkong-warehouse-manager/HKWarehouseManagerRequest";

/**
 * 保税仓 “成品在途接收”    套用“香港仓在途货物接收”，同“湖南仓接收”功能。
 */
export default class GCBondedWarehouseInTransitMaterialLotReceiveProperties extends EntityScanProperties{

    static displayName = 'GCBondedWarehouseInTransitMaterialLotReceiveProperties';
    
    constructor(props) {
        super(props);
        this.state = {...this.state, ...{showQueryFormButton: false}};
    }
    
    componentWillReceiveProps = (props) => {
      const {resetFlag} = props;
      if (resetFlag) {
        this.form.handleReset();
      }
    }

    queryData = (whereClause) => {
      const self = this;
      let {rowKey,tableData} = this.state;
      let queryFields = this.form.state.queryFields;
      let queryLotId = "";
      if (queryFields.length === 1) {
        queryLotId = this.form.props.form.getFieldValue(queryFields[0].name)
      }
      let requestObject = {
        tableRrn: this.state.tableRrn,
        queryLotId: queryLotId,
        success: function(responseBody) {
          let materialLotList = responseBody.materialLotList;
          if (materialLotList && materialLotList.length > 0){
            let errorData = [];
            let trueData = [];
            tableData.forEach(data => {
              if(data.errorFlag){
                errorData.push(data);
              } else {
                trueData.push(data);
              }
            });
            materialLotList.forEach(mLot =>{
              if (tableData.filter(d => d[rowKey] === mLot[rowKey]).length === 0) {
                trueData.unshift(mLot);
              }
            });
            tableData = [];
            errorData.forEach(data => {
              tableData.push(data);
            });
            trueData.forEach(data => {
              tableData.push(data);
            });
          } else {
            let data = new MaterialLot();
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
      HKWarehouseManagerRequest.sendGetMaterialLotByRrnRequest(requestObject);
    }

    buildTable = () => {
        return <GCBondedWarehouseInTransitMaterialLotReceiveTable pagination={true} 
                                    table={this.state.table} 
                                    data={this.state.tableData} 
                                    loading={this.state.loading} 
                                    resetData={this.resetData.bind(this)}
                                    resetFlag={this.state.resetFlag}
                                    />
    }

    buildOtherComponent = () => {
      return <HKWaitReceiveMLotProperties ref={(waitReceiveProperties) => { this.waitReceiveProperties = waitReceiveProperties }} tableRrn={this.state.parameters.parameter1} />
  }
}