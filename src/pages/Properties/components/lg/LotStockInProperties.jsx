import RelayBoxStockInManagerRequest from "../../../../api/gc/relayBox-stock-in/RelayBoxStockInManagerRequest";
import LotStockInStorageTable from "../../../../components/Table/lgTable/LotStockInStorageTable";
import EntityScanProperties from "../entityProperties/EntityScanProperties";

export default class LotStockInProperties extends EntityScanProperties{

    static displayName = 'LotStockInProperties';
    
    constructor(props) {
        super(props);
        this.state = {...this.state};
      }

    handleSearch = () => {
        let self = this;
        const{table} = this.state;
        let {tableData} = this.state;
        this.setState({loading: true});
        let data = "";
        let queryFields = this.form.state.queryFields;
        if (queryFields.length === 1) {
            data = this.form.props.form.getFieldValue(queryFields[0].name)
        }
        let dataIndex = -1;
        if ((data.startsWith("MB") || data.startsWith("TB") || data.startsWith("CM") || data.startsWith("ZTB") || data.startsWith("ZCB"))  && data.split(".").length == 1) {
            if(tableData && tableData.length > 0){
                tableData.forEach((materialLot) => {
                    tableData.map((data, index) => {
                        if (data.materialLotId == materialLot.materialLotId) {
                            dataIndex = index;
                        }
                    });
                    if(!materialLot.relaxBoxId){
                        materialLot["relaxBoxId"] = data;
                        tableData.splice(dataIndex, 1, materialLot);
                    }
                });
                self.setState({ 
                    tableData: tableData,
                    loading: false,
                });
            } else {
                let requestObject = {
                    relayBoxId: data,
                    success: function(responseBody) {
                        let materialLots = responseBody.materialLots;
                        if(materialLots && materialLots.length > 0){
                            materialLots.forEach((materialLot) => {
                                if (tableData.filter(d => d.materialLotId === materialLot.materialLotId).length === 0) {
                                    tableData.unshift(materialLot);
                                }
                            });
                        } else {
                            self.showDataNotFound();
                        }
                        self.setState({ 
                            tableData: tableData,
                            loading: false,
                        });
                        self.form.resetFormFileds();
                    }
                }
                RelayBoxStockInManagerRequest.sendQueryRelayBoxRequest(requestObject);
            }
            self.form.resetFormFileds();
        } else if (data.startsWith("LHJ ")) {
            tableData.forEach((materialLot) => {
                tableData.map((data, index) => {
                    if (data.materialLotId == materialLot.materialLotId) {
                        dataIndex = index;
                    }
                });
                if(!materialLot.storageId){
                    materialLot["storageId"] = data;
                    tableData.splice(dataIndex, 1, materialLot);
                }
            });
            self.setState({ 
                tableData: tableData,
                loading: false,
            });
            self.form.resetFormFileds();
        } else {
            let requestObject = {
                materialLotId: data,
                tableRrn: table.objectRrn,
                success: function(responseBody) {
                    let materialLot = responseBody.materialLot;
                    if(materialLot){
                        if (tableData.filter(d => d.materialLotId === materialLot.materialLotId).length === 0) {
                            tableData.unshift(materialLot);
                        }
                    } else {
                        self.showDataNotFound();
                    }
                    self.setState({ 
                        tableData: tableData,
                        loading: false,
                    });
                    self.form.resetFormFileds();
                }
            }
            RelayBoxStockInManagerRequest.sendQueryBoxRequest(requestObject);
        }
    }

    buildTable = () => {
        return <LotStockInStorageTable 
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