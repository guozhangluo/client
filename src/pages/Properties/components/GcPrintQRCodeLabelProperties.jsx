import EntityProperties from "./entityProperties/EntityProperties";
import GcPrintQRCodeLabelTable from "../../../components/Table/gc/GcPrintQRCodeLabelTable";
import EntityScanProperties from "./entityProperties/EntityScanProperties";
import StockOutManagerRequest from "../../../api/gc/stock-out/StockOutManagerRequest";

export default class GcPrintQRCodeLabelProperties extends EntityScanProperties{

    static displayName = 'GcPrintQRCodeLabelProperties';

    constructor(props) {
        super(props);
        this.state= {...this.state}
    }

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
        let materialLotId = self.form.props.form.getFieldValue(self.form.state.queryFields[0].name);
        let requestObject = {
          tableRrn: this.state.tableRrn,
          materialLotId: materialLotId,
          success: function(responseBody) {
            let queryDatas = responseBody.materialLotList;
            if (queryDatas && queryDatas.length > 0) {
                self.setState({ 
                    tableData: responseBody.materialLotList,
                    loading: false
                });
                self.form.resetFormFileds();
            } else {
                self.showDataNotFound();
            }
          }
        }
        StockOutManagerRequest.sendGetDataByRrnRequest(requestObject);
   }

    buildTable = () => {
        return <GcPrintQRCodeLabelTable pagination={false} rowKey={this.state.rowKey} 
                                        selectedRowKeys={this.state.selectedRowKeys} 
                                        selectedRows={this.state.selectedRows} 
                                        table={this.state.table} 
                                        data={this.state.tableData} 
                                        loading={this.state.loading} 
                                        resetData={this.resetData.bind(this)}
                                        resetFlag={this.state.resetFlag}/>
    }

}