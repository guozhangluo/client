import EntityScanProperties from "./entityProperties/EntityScanProperties";
import MaterialLot from "../../../api/dto/mms/MaterialLot";
import { Notification } from "../../../components/notice/Notice";
import I18NUtils from "../../../api/utils/I18NUtils";
import { i18NCode } from "../../../api/const/i18n";
import GcFTStockOutMLotScanTable from "../../../components/Table/gc/GcFTStockOutMLotScanTable";
import StockOutManagerRequest from "../../../api/gc/stock-out/StockOutManagerRequest";

export default class GcFTStockOutMLotScanProperties extends EntityScanProperties{

    static displayName = 'GcFTStockOutMLotScanProperties';
    
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
        let materialLotId = this.form.props.form.getFieldValue(queryFields[0].name);
        let requestObject = {
          tableRrn: this.state.tableRrn,
          materialLotId: materialLotId,
          success: function(responseBody) {
            let materialLotList = responseBody.materialLotList;
            if (materialLotList && materialLotList.length > 0) {
              let errorData = [];
              let trueData = [];
              tableData.forEach(data => {
                if(data.errorFlag){
                  errorData.push(data);
                } else {
                  trueData.push(data);
                }
              });
              materialLotList.forEach(materialLot => {
                if (trueData.filter(d => d[rowKey] === materialLot[rowKey]).length === 0) {
                  trueData.unshift(materialLot);
                }
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
                let data = new MaterialLot();
                data[rowKey] = materialLotId;
                data.setMaterialLotId(materialLotId);
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
      StockOutManagerRequest.sendGetDataByRrnRequest(requestObject);
    }

    buildTable = () => {
        return <GcFTStockOutMLotScanTable 
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