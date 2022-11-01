import { i18NCode } from "../../../../api/const/i18n";
import MaterialLotRequest from "../../../../api/lg/material-lot-manager/MaterialLotRequest";
import I18NUtils from "../../../../api/utils/I18NUtils";
import { Notification } from "../../../../components/notice/Notice";
import LotWeighTable from "../../../../components/Table/lgTable/LotWeighTable";
import EntityScanProperties from "../entityProperties/EntityScanProperties";

export default class LGLotWeighProperties extends EntityScanProperties {

    static displayName = 'LGLotWeighProperties';

    constructor(props) {
        super(props);
        this.state = {...this.state, ...{currentHandleMLot:""}};
    }

    handleSearch = () => {
        let self = this;
        const{table} = this.state;
        let {tableData, currentHandleMLot} = this.state;
        let data = this.form.props.form.getFieldValue(this.form.state.queryFields[0].name);
        let dataIndex = -1;
        if((data == undefined || data == "")) {
            Notification.showInfo(I18NUtils.getClientMessage(i18NCode.SearchFieldCannotEmpty));
            self.setState({ 
                tableData: tableData,
                loading: false
            });
            return;
        }
        // 如果扫描的是数字，则更新当前列表中没有添加重量的Lot
        if (data != undefined &&  data.startsWith("0000")  && parseFloat(data).toString() != "NaN") {
            if (tableData.length == 0){
                Notification.showInfo(I18NUtils.getClientMessage(i18NCode.AddAtLeastOneRow));
                self.setState({ 
                    tableData: tableData,
                    loading: false
                });
                return;
            }
            data = parseInt(data,10)/10000;
            tableData.map((materialLot, index) => {
                if (materialLot.materialLotId == currentHandleMLot.materialLotId) {
                    dataIndex = index;
                    materialLot["theoryWeight"] = data.toFixed(3);
                    tableData.splice(dataIndex, 1, materialLot);
                }
            });
            
            self.setState({ 
                tableData: tableData,
                loading: false,
            });
            self.form.resetFormFileds();
        } else if (data != undefined){
            let requestObject = {
                lotId: data,
                tableRrn: table.objectRrn,
                success: function(responseBody) {
                    let materialLot = responseBody.materialLot;
                    if(materialLot){
                        if (tableData.filter(d => d.materialLotId === materialLot.materialLotId).length === 0) {
                            tableData.unshift(materialLot);
                        }
                        self.setState({ 
                            tableData: tableData,
                            loading: false,
                            currentHandleMLot: materialLot,
                        });
                        self.form.resetFormFileds();
                    } else {
                        self.showDataNotFound();
                    }
                }
            }
            MaterialLotRequest.sendQueryLotWeightRequest(requestObject);
        }
    }

    buildTable = () => {
        return <LotWeighTable 
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