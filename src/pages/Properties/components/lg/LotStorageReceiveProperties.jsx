import LotReceiveFGScanTable from "../../../../components/Table/lgTable/LotReceiveFGScanTable";
import EntityScanProperties from "../entityProperties/EntityScanProperties";
import LotStorageRequest from "../../../../api/lg/lot-storage-manager/LotStorageRequest";

export default class LotStorageReceiveProperties extends EntityScanProperties{

    static displayName = 'LotStorageReceiveProperties';

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
      
    queryData = () => {
      const self = this;
      let {tableData} = this.state;
      let lotId = self.form.props.form.getFieldValue(self.form.state.queryFields[0].name);
      let fosbId = self.form.props.form.getFieldValue(self.form.state.queryFields[1].name);
      let requestObject = {
        lotId: lotId,
        fosbId: fosbId,
        success: function(responseBody) {
          let mesStorageLotList = responseBody.mesStorageLotList;
          if (mesStorageLotList && mesStorageLotList.length > 0) {
            mesStorageLotList.forEach(data => {
              if (tableData.filter(d => d.waferId === data.waferId).length === 0) {
                tableData.unshift(data);
              }
            });
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
      LotStorageRequest.sendQueryStoarageLotRequest(requestObject);
    }

    buildTable = () => {
        return <LotReceiveFGScanTable pagination={false} 
                                    rowKey={this.state.rowKey} 
                                    selectedRowKeys={this.state.selectedRowKeys} 
                                    selectedRows={this.state.selectedRows} 
                                    table={this.state.table} 
                                    data={this.state.tableData} 
                                    loading={this.state.loading} 
                                    resetData={this.resetData.bind(this)}/>
    }

}