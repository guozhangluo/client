import MobileProperties from "../mobile/MobileProperties";
import MessageUtils from "../../../../api/utils/MessageUtils";
import EventUtils from "../../../../api/utils/EventUtils";
import LgMaterialLotShipTable from "../../../../components/Table/lgTable/LgMaterialLotShipTable";
import TableManagerRequest from "../../../../api/table-manager/TableManagerRequest";
import MaterialLotRequest from '../../../../api/lg/material-lot-manager/MaterialLotRequest';
export default class LgMaterialLotShipProperties extends MobileProperties{

    static displayName = 'LgMaterialLotShipProperties';
    
    constructor(props) {
        super(props);
        this.state = {...this.state};
    }

    queryData = (whereClause) => {
        const self = this;
        let {rowKey,tableData} = this.state;
        let requestObject = {
          tableRrn: this.state.tableRrn,
          whereClause: whereClause,
          success: function(responseBody) {
            let queryDatas = responseBody.dataList;
            if (queryDatas && queryDatas.length > 0) {
              queryDatas.forEach(data => {
                if (tableData.filter(d => d[rowKey] === data[rowKey]).length === 0) {
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
        TableManagerRequest.sendGetDataByRrnRequest(requestObject);
    }

    handleSubmit = () => {
        let self = this;
        const {data} = this.state;
        if (data.length === 0 ) {
            return;
        }

        self.setState({
            loading: true
        });
        EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => self.setState({loading: false}));

        let requestObject = {
            materialLotList: data,
            success: function(responseBody) {
                if (self.props.resetData) {
                    self.props.resetData();
                }
                MessageUtils.showOperationSuccess();
            }
          }
          MaterialLotRequest.sendMaterialLotShipRequest(requestObject);
    }

    buildTable = () => {
        return <LgMaterialLotShipTable 
                                    pagination={false} 
                                    rowKey={this.state.rowKey} 
                                    selectedRowKeys={this.state.selectedRowKeys} 
                                    selectedRows={this.state.selectedRows} 
                                    table={this.state.table} 
                                    data={this.state.tableData} 
                                    loading={this.state.loading} 
                                    resetData={this.resetData.bind(this)}/>
    }
}