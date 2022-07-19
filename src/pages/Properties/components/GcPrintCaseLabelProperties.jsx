import TableManagerRequest from "../../../api/table-manager/TableManagerRequest";
import EntityScanProperties from "./entityProperties/EntityScanProperties";
import GcPrintCaseLabelTable from "../../../components/Table/GcPrintCaseLabelTable";

/**
 * 打印箱标签
 */
export default class GcPrintCaseLabelProperties extends EntityScanProperties{

    static displayName = 'PrintCaseLabelProperties';

    resetData = () => {
        this.setState({
          selectedRowKeys: [],
          selectedRows: [],
          tableData: [],
          loading: false,
          resetFlag: true,
          formObject: []
        });
      }

    queryData = (whereClause) => {
        const self = this;
        let requestObject = {
          tableRrn: this.state.tableRrn,
          whereClause: whereClause,
          success: function(responseBody) { 
            let queryDatas = responseBody.dataList;
            if (queryDatas && queryDatas.length > 0) {
                self.setState({
                    formObject: queryDatas[0]
                })  
                self.form.resetFormFileds();
            }
          }
        }
        TableManagerRequest.sendGetDataByRrnRequest(requestObject);
    }

    queryData = (whereClause) => {
      const self = this;
      let requestObject = {
        tableRrn: this.state.tableRrn,
        whereClause: whereClause,
        success: function(responseBody) {
            let materialLotList = responseBody.dataList;
            if(materialLotList && materialLotList.length > 0){
                self.setState({
                    tableData: materialLotList,
                    loading: false,
                  });
            } else {
                self.showDataNotFound();
            }
        }
      }
      TableManagerRequest.sendGetDataByRrnRequest(requestObject);
    }

    buildTable = () => {
        return <GcPrintCaseLabelTable pagination={false} 
                                    rowKey={this.state.rowKey} 
                                    selectedRowKeys={this.state.selectedRowKeys} 
                                    selectedRows={this.state.selectedRows} 
                                    table={this.state.table} 
                                    data={this.state.tableData} 
                                    loading={this.state.loading} 
                                    resetData={this.resetData.bind(this)}/>
    }


}