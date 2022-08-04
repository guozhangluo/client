import { Notification } from "../../../../../components/notice/Notice";
import I18NUtils from "../../../../../api/utils/I18NUtils";
import { i18NCode } from "../../../../../api/const/i18n";
import MobileProperties from "../../mobile/MobileProperties";
import MessageUtils from "../../../../../api/utils/MessageUtils";
import StockInManagerRequest from "../../../../../api/gc/stock-in/StockInManagerRequest";
import RelayBoxStockInManagerRequest from "../../../../../api/gc/relayBox-stock-in/RelayBoxStockInManagerRequest";

export default class GCMobileMLotStockInProperties extends MobileProperties{

    static displayName = 'GCMobileMLotStockInProperties';
    
    constructor(props) {
        super(props);
        this.state = {...this.state, rowKey: "objectRrn"};
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
                        if (data[rowKey] == materialLot[rowKey]) {
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
                        materialLots.forEach((materialLot) => {
                            if (tableData.filter(d => d[rowKey] === materialLot[rowKey]).length === 0) {
                                tableData.unshift(materialLot);
                            }
                        });
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
            tableData.forEach((materialLot) => {
                tableData.map((data, index) => {
                    if (data[rowKey] == materialLot[rowKey]) {
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
                    let materialLots = responseBody.materialLots;
                    materialLots.forEach((materialLot) => {
                        if (tableData.filter(d => d[rowKey] === materialLot[rowKey]).length === 0) {
                            tableData.unshift(materialLot);
                        }
                    });
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
    
    handleSubmit = () => {
        const {tableData} = this.state;
        let self = this; 
        if (!tableData || tableData.length == 0) {
            Notification.showError(I18NUtils.getClientMessage(i18NCode.SelectAtLeastOneRow));
            return;
        }
        if(!this.validationStorageId(tableData)) {
            Notification.showInfo(I18NUtils.getClientMessage(i18NCode.StorageCannotEmpty));
            return;
        }
        let materialLots = tableData;
        if (materialLots && materialLots.length > 0) {
            let requestObject = {
                materialLots: materialLots,
                success: function(responseBody) {
                    self.handleReset();
                    MessageUtils.showOperationSuccess();
                }
            }
            StockInManagerRequest.sendStockInRequest(requestObject);
        }
    }

    validationStorageId = (data) =>{
        let flag = true;
        data.forEach((materialLot) => {
            if( materialLot.storageId == undefined){
                flag = false;
                return flag;
            }
        });
        return flag;
    }
}