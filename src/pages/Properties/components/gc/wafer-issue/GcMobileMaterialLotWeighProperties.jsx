import MobileProperties from "../../mobile/MobileProperties";
import { Notification } from "../../../../../components/notice/Notice";
import I18NUtils from "../../../../../api/utils/I18NUtils";
import { i18NCode } from "../../../../../api/const/i18n";
import MessageUtils from "../../../../../api/utils/MessageUtils";
import MobileMaterialLotWeighTable from "../../../../../components/Table/gc/MobileMaterialLotWeighTable";
import WeightManagerRequest from "../../../../../api/gc/weight-manager/WeightManagerRequest";

export default class GcMobileMaterialLotWeighProperties extends MobileProperties{

    static displayName = 'GcMobileMaterialLotWeighProperties';
    
    constructor(props) {
        super(props);
        this.state = {...this.state};
    }

    queryData = () => {
        let self = this;
        const{table} = this.state;
        let {tableData, currentHandleMLots} = this.state;
        this.setState({loading: true});
        let data = "";
        let queryFields = this.form.state.queryFields;
        data = this.form.props.form.getFieldValue(queryFields[0].name);
        let dataIndex = -1;
        if((data == undefined || data == "")) {
            Notification.showInfo(I18NUtils.getClientMessage(i18NCode.SearchFieldCannotEmpty));
            self.setState({ 
                tableData: tableData,
                loading: false
            });
            return;
        }
        // 如果扫描的是数字，则更新当前列表中没有添加重量的箱号，存在多箱没有重量时，给多箱称重标记
        if (data != undefined &&  data.startsWith("0000")  && parseFloat(data).toString() != "NaN") {
            if (tableData.length == 0){
                Notification.showInfo(I18NUtils.getClientMessage(i18NCode.AddAtLeastOneRow));
                self.setState({ 
                    tableData: tableData,
                    loading: false
                });
                return;
            }
            currentHandleMLots = this.getNotScanWeightMaterialLots(tableData);
            if(currentHandleMLots.length == 0){
                Notification.showInfo(I18NUtils.getClientMessage(i18NCode.AddOneRowPlease));
                self.setState({ 
                    tableData: tableData,
                    loading: false
                });
                return;
            } 

            let boxsFlag = this.validateMLotsIsMultipleBoxes(currentHandleMLots);
            let boxsWeightSeq = this.getBoxsScanWeightSeq(tableData);
            if(boxsFlag){
                let boxsWeight = parseInt(data,10)/10000;
                tableData.forEach((materialLot) => {
                    currentHandleMLots.map((data, index) => {
                        if (data.materialLotId == materialLot.materialLotId) {
                            dataIndex = index;
                            materialLot["weight"] = boxsWeight.toFixed(3);
                            materialLot.boxsScanSeq = boxsWeightSeq;
                            materialLot["boxsWeightFlag"] = 1;
                            if(materialLot.theoryWeight){
                                let floatValue = materialLot.floatValue;
                                let disWeight = Math.abs(materialLot.weight - materialLot.theoryWeight);
                                if(disWeight > floatValue){
                                    materialLot.errorFlag = true;
                                }
                            }
                            tableData.splice(dataIndex, 1, materialLot);
                        }
                    });
                });
            } else {
                data = parseInt(data,10)/10000;
                currentHandleMLots.forEach((materialLot) => {
                    tableData.map((data, index) => {
                        if (data.materialLotId == materialLot.materialLotId) {
                            dataIndex = index;
                        }
                    });
                    if(!materialLot.weight){
                        materialLot["weight"] = data.toFixed(3);
                        if(materialLot.theoryWeight){
                            let floatValue = materialLot.floatValue;
                            let disWeight = Math.abs(materialLot.weight - materialLot.theoryWeight);
                            if(disWeight > floatValue){
                                materialLot.errorFlag = true;
                            }
                        }
                        tableData.splice(dataIndex, 1, materialLot);
                    }
                });
            }
            self.setState({ 
                tableData: tableData,
                loading: false,
            });
            self.form.resetFormFileds();
        } else if (data != undefined){
            let requestObject = {
                materialLotId: data,
                tableRrn: table.objectRrn,
                success: function(responseBody) {
                    let materialLotList = responseBody.materialLotList;
                    let size = tableData.length;
                    let scanSeq = size + 1;
                    materialLotList.forEach(materialLot => {
                        if (tableData.filter(d => d.materialLotId === data.materialLotId).length === 0) {
                            let productType = materialLot.reserved7;
                            materialLot["scanSeq"] = scanSeq;
                            if(productType == "COM" && (materialLot.theoryWeight == null || materialLot.theoryWeight == undefined || materialLot.theoryWeight == "")){
                                materialLot.errorFlag = true;
                            }
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
            WeightManagerRequest.sendQueryRequest(requestObject);
        }
    }

    validateMLotsIsMultipleBoxes(materialLotList){
        let multipleBoxFlag = false;
        let materialLotIdList = [];
        materialLotList.forEach((materialLot) => {
            if (materialLotIdList.indexOf(materialLot.parentMaterialLotId) == -1) {
                materialLotIdList.push(materialLot.parentMaterialLotId);
            }
        });
        if(materialLotIdList.length > 1){
            multipleBoxFlag = true;
        }
        return multipleBoxFlag;
    }

    getNotScanWeightMaterialLots(tableData){
      let materialLots = [];
      tableData.forEach((materialLot) => {
          if(!materialLot.weight){
              materialLots.push(materialLot);
          }
      });
      return materialLots;
    }

    getBoxsScanWeightSeq(tableData){
      let boxsWeightSeq = 0;
      tableData.forEach((materialLot) => {
          if(materialLot.boxsScanSeq && materialLot.boxsScanSeq > boxsWeightSeq){
              boxsWeightSeq = materialLot.boxsScanSeq;
          }
      });
      return boxsWeightSeq + 1;
    }

    handleSubmit = () => {
      const {data} = this.orderTable.state;
      let self = this;
      if (!data || data.length == 0) {
          Notification.showNotice(I18NUtils.getClientMessage(i18NCode.SelectAtLeastOneRow));
          return;
      }
      if(self.getNotScanWeightMaterialLots(data).length > 0 ){
          Notification.showNotice(I18NUtils.getClientMessage(i18NCode.BoxWeightCannotEmpty));
          return;
      }

      let requestObject = {
          materialLots: data,
          success: function(responseBody) {
              self.resetData();
              MessageUtils.showOperationSuccess();
          }
      }
      WeightManagerRequest.sendWeightRequest(requestObject);
    }

    buildTable = () => {
        return <MobileMaterialLotWeighTable
                                  pagination={false} 
                                  ref={(orderTable) => { this.orderTable = orderTable }} 
                                  table={this.state.table} 
                                  data={this.state.tableData} 
                                  loading={this.state.loading} 
                                  resetData={this.resetData.bind(this)}
                                  resetFlag={this.state.resetFlag}
                                  />
    }

}