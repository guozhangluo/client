import LotStockOutLabelPrintTable from "../../../../components/Table/lgTable/LotStockOutLabelPrintTable";
import EntityScanProperties from "../entityProperties/EntityScanProperties";
import MaterialLotRequest from "../../../../api/lg/material-lot-manager/MaterialLotRequest";

export default class LotStockOutLabelPrintProperties extends EntityScanProperties{

    static displayName = 'LotStockOutLabelPrintProperties';
      
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
      let {tableData} = this.state;
      let queryFields = this.form.state.queryFields;
      let lotId = this.form.props.form.getFieldValue(queryFields[0].name);
      if(lotId == null || lotId == undefined || lotId == ""){
        Notification.showInfo(I18NUtils.getClientMessage(i18NCode.SearchFieldCannotEmpty))
        self.setState({ 
          tableData: tableData,
          loading: false
        });
        return;
      }
      let requestObject = {
        lotId: lotId,
        success: function(responseBody) {
          let materialLot = responseBody.materialLot;
          if (materialLot) {
            if (tableData.filter(d => d.lotId === materialLot.lotId).length === 0) {
              tableData.unshift(materialLot);
            }
            self.setState({ 
              tableData: tableData,
              loading: false
            });
            self.form.resetFormFileds();
          } else {
            self.showDataNotFound();
          }
        }
      }
      MaterialLotRequest.sendBoxLabelPrintQueryRequest(requestObject);
    }

    buildTable = () => {
        return <LotStockOutLabelPrintTable pagination={false} 
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