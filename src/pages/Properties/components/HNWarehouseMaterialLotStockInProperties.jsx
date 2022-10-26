import EntityScanProperties from "./entityProperties/EntityScanProperties";
import StockInStorageTable from "../../../components/Table/gc/StockInStorageTable";
import RelayBoxStockInManagerRequest from "../../../api/gc/relayBox-stock-in/RelayBoxStockInManagerRequest";

/**
 * 湖南仓入库位
 * 物料批次扫描添加后入库
 *  只有一个扫描框，根据不同的开头做不同的事。
 * 先扫描一些ID 此时页面只显示ID，不带出其他信息）扫描到MB开头，则临时记录下来中转箱ID；扫描到SHJ开头，则临时记录下货架号；其他都是物料批次号
 * ——新的记录节点
 * 只要扫到不是MB/SHJ开头ID，则认为是新的开始（之前记录的数据不再修改）
 */
export default class HNWarehouseMaterialLotStockInProperties extends EntityScanProperties{

    static displayName = 'HNWarehouseMaterialLotStockInProperties';
    
    constructor(props) {
        super(props);
        this.state = {...this.state, ...{currentHandleMLots:[], scanRelaxBoxOrStorageFlag: false}};
      }

    handleSearch = () => {
        let self = this;
        const{table} = this.state;
        let {rowKey, tableData} = this.state;
        this.setState({loading: true});
        let data = "";
        let queryFields = this.form.state.queryFields;
        if (queryFields.length === 1) {
            data = this.form.props.form.getFieldValue(queryFields[0].name)
        }  
         // MB开头的则是中装箱号 扫描到MB开头的，则更新当前操作的物料批次的中装箱号
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
                    tableRrn: this.state.tableRrn,
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
                    },
                    fail: function() {
                        self.setState({ 
                            tableData: tableData,
                            loading: false
                        });
                        self.form.resetFormFileds();
                    }
                }
                RelayBoxStockInManagerRequest.sendQueryRelayBoxRequest(requestObject);
            }
            self.form.resetFormFileds();
        } else if (data.startsWith("ZHJ ") || data.startsWith("HJ ") ) {
            // ZHJ/HJ 开头的则是库位号 扫描到ZHJ/HJ开头的，则更新当前操作的物料批次的库位号
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
            // 物料批次，需要请求后台做查询
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
                },
                fail: function() {
                    self.setState({ 
                        tableData: tableData,
                        loading: false
                    });
                    self.form.resetFormFileds();
                }
            }
            RelayBoxStockInManagerRequest.sendQueryBoxRequest(requestObject);
        }
    }

    buildTable = () => {
        return <StockInStorageTable 
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