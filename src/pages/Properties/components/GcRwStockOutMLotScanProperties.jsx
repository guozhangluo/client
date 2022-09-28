import EntityScanProperties from "./entityProperties/EntityScanProperties";
import MaterialLot from "../../../api/dto/mms/MaterialLot";
import { Notification } from "../../../components/notice/Notice";
import I18NUtils from "../../../api/utils/I18NUtils";
import { i18NCode } from "../../../api/const/i18n";
import GcRwStockOutMLotScanTable from "../../../components/Table/gc/GcRwStockOutMLotScanTable";
import RwMLotManagerRequest from "../../../api/gc/rw-manager/RwMLotManagerRequest";

export default class GcRwStockOutMLotScanProperties extends EntityScanProperties{

    static displayName = 'GcRwStockOutMLotScanProperties';
    
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
        let orders = this.props.orderTable.state.data;
        if (orders.length == 0) {
          Notification.showNotice(I18NUtils.getClientMessage(i18NCode.SelectAtLeastOneRow));
          self.setState({ 
            tableData: tableData,
            loading: false
          });
          return;
        }
        let queryFields = this.form.state.queryFields;
        let queryLotId = this.form.props.form.getFieldValue(queryFields[0].name);
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
                if(trueData && trueData.length == 0){
                  materialLotList.forEach(materialLot => {
                    trueData.push(materialLot);
                  });
                  tableData = [];
                  errorData.forEach(data => {
                    tableData.push(data);
                  });
                  trueData.forEach(data => {
                    tableData.push(data);
                  });
                  self.setState({ 
                    tableData: tableData,
                    loading: false
                  });
                } else {
                  self.validationRwMLotInfo(materialLotList, trueData[0]);
                }
            } else {
              let data = new MaterialLot();
              data[rowKey] = queryLotId;
              data.setMaterialLotId(queryLotId);
              data.errorFlag = true;
              if (tableData.filter(d => d[rowKey] === data[rowKey]).length === 0) {
                tableData.unshift(data);
              }
              self.setState({ 
                tableData: tableData,
                loading: false
              });
            }
            self.form.resetFormFileds();  
            self.queryNodeFocus();
          }
        }
        RwMLotManagerRequest.sendGetMaterialLotByRrnRequest(requestObject);
    }

    validationRwMLotInfo = (materialLotList, materialLot) => {
      let self = this;
      let {rowKey,tableData} = this.state;
      let falg = false;
      let targetMLot = materialLotList[0];
      if(materialLot.reserved55 == targetMLot.reserved55){
        falg = true;
      }
      if(falg){
          let errorData = [];
          let trueData = [];
          tableData.forEach(data => {
            if(data.errorFlag){
              errorData.push(data);
            } else {
              trueData.push(data);
            }
          });
          materialLotList.forEach(mLot => {
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
          materialLotList.forEach(mLot => {
            if (tableData.filter(d => d[rowKey] === mLot[rowKey]).length === 0) {
              mLot.errorFlag = true;
              tableData.unshift(mLot);
            }
          });
      }
      self.setState({ 
        tableData: tableData,
        loading: false
      });
      self.form.resetFormFileds();
    }

    buildTable = () => {
        return <GcRwStockOutMLotScanTable 
                            orderTable={this.props.orderTable} 
                            pagination={false} 
                            table={this.state.table} 
                            data={this.state.tableData} 
                            loading={this.state.loading} 
                            resetData={this.resetData.bind(this)}
                            resetFlag={this.state.resetFlag}
                            onSearch={this.props.onSearch}
                            />
    }

}