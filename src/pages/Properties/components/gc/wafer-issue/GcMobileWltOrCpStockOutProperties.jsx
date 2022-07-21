import MobileProperties from "../../mobile/MobileProperties";
import { Notification } from "../../../../../components/notice/Notice";
import I18NUtils from "../../../../../api/utils/I18NUtils";
import { i18NCode } from "../../../../../api/const/i18n";
import MessageUtils from "../../../../../api/utils/MessageUtils";
import MaterialLot from "../../../../../api/dto/mms/MaterialLot";
import EventUtils from '../../../../../api/utils/EventUtils';
import MobileMobileWltOrCpStockOutTable from "../../../../../components/Table/gc/MobileMobileWltOrCpStockOutTable";
import { Button, Col, Form } from 'antd';
import WltStockOutManagerRequest from "../../../../../api/gc/wlt-stock-out/WltStockOutManagerRequest";
import moment from "moment";

export default class GcMobileWltOrCpStockOutProperties extends MobileProperties{

    static displayName = 'GcMobileWltOrCpStockOutProperties';
    
    constructor(props) {
        super(props);
        this.state = {...this.state};
    }
    
    queryData = () => {
      const self = this;
      let {rowKey,tableData} = this.state;
      let queryFields = this.form.state.queryFields;
      let queryLotId = this.form.props.form.getFieldValue(queryFields[0].name);
      let requestObject = {
        tableRrn: this.state.tableRrn,
        queryLotId: queryLotId,
        success: function(responseBody) {
          let materialLotList = responseBody.materialLotList;
          if (materialLotList && materialLotList.length > 0){
              let errorData = [];
              let trueData = [];
              tableData.forEach(data => {
                if(data.errorFlag){
                  errorData.push(data);
                } else {
                  trueData.push(data);
                }
              });
              if(trueData && trueData.length == 0){
                materialLotList.forEach(materialLot => {
                  trueData.push(materialLot);
                });
                tableData = [];
                errorData.forEach(data => {
                  tableData.push(data);
                });
                trueData.forEach(data => {
                  tableData.push(data);
                });
                self.setState({ 
                  tableData: tableData,
                  loading: false
                });
                self.form.resetFormFileds();  
              } else {
                self.validationWltMLot(materialLotList, trueData[0]);
              }
          } else {
            let data = new MaterialLot();
            data[rowKey] = queryLotId;
            data.setMaterialLotId(queryLotId);
            data.errorFlag = true;
            if (tableData.filter(d => d[rowKey] === data[rowKey]).length === 0) {
              tableData.unshift(data);
            }
            self.setState({ 
              tableData: tableData,
              loading: false
            });
            self.form.resetFormFileds();  
          }
        }
      }
      WltStockOutManagerRequest.sendGetMaterialLotByRrnRequest(requestObject);
  }

  validationWltMLot = (materialLots, materialLot) => {
    let self = this;
    let {rowKey,tableData} = this.state;
    let requestObject = {
      queryMaterialLot : materialLot,
      materialLots: materialLots,
      success: function(responseBody) {
          if(responseBody.falg){
            let errorData = [];
            let trueData = [];
            tableData.forEach(data => {
              if(data.errorFlag){
                errorData.push(data);
              } else {
                trueData.push(data);
              }
          });
          materialLots.forEach(mLot =>{
            if (tableData.filter(d => d[rowKey] === mLot[rowKey]).length === 0) {
              trueData.unshift(mLot);
            }
          });
          tableData = [];
          errorData.forEach(data => {
            tableData.push(data);
          });
          trueData.forEach(data => {
            tableData.push(data);
          });
        } else {
          materialLots.forEach(mLot =>{
            if (tableData.filter(d => d[rowKey] === mLot[rowKey]).length === 0) {
              mLot.errorFlag = true;
              tableData.unshift(mLot);
            }
          });
        }
        self.setState({ 
          tableData: tableData,
          loading: false
        });
        self.form.resetFormFileds();
      }
    }
    WltStockOutManagerRequest.sendValidationRequest(requestObject);
  }

    stockOut = () => {
      let self = this;
      let erpTime = self.wltCpTable.erpTime.picker.state.showDate;
      if(moment.isMoment(erpTime)){
        erpTime = erpTime.format("YYYY-MM-DD");
      }

      if (erpTime == "" || erpTime == null || erpTime == undefined) {
          Notification.showNotice(I18NUtils.getClientMessage(i18NCode.SelectERPTime));
          return;
      }

      if (self.wltCpTable.getErrorCount() > 0) {
          Notification.showError(I18NUtils.getClientMessage(i18NCode.ErrorNumberMoreThanZero));
          return;
      }
      let checkSubCode = self.wltCpTable.state.value;

      let materialLots = self.wltCpTable.state.data;
      if (materialLots.length === 0 ) {
          Notification.showNotice(I18NUtils.getClientMessage(i18NCode.AddAtLeastOneRow));
          return;
      }

      self.setState({
          loading: true
      });
      EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => self.setState({loading: false}));

      let requestObj = {
          materialLots : materialLots,
          checkSubCode: checkSubCode,
          erpTime : erpTime,
          success: function(responseBody) {
            self.resetData();
            MessageUtils.showOperationSuccess();
          }
      }
      WltStockOutManagerRequest.sendMobileWltStockOutRequest(requestObj);
    }

    saleShip = () => {
      let self = this;
      let erpTime = self.wltCpTable.erpTime.picker.state.showDate;
      if(moment.isMoment(erpTime)){
        erpTime = erpTime.format("YYYY-MM-DD");
      }

      if (erpTime == "" || erpTime == null || erpTime == undefined) {
          Notification.showNotice(I18NUtils.getClientMessage(i18NCode.SelectERPTime));
          return;
      }

      if (self.wltCpTable.getErrorCount() > 0) {
          Notification.showError(I18NUtils.getClientMessage(i18NCode.ErrorNumberMoreThanZero));
          return;
      }
      let checkSubCode = self.wltCpTable.state.value;

      let materialLots = self.wltCpTable.state.data;
      if (materialLots.length === 0 ) {
          Notification.showNotice(I18NUtils.getClientMessage(i18NCode.AddAtLeastOneRow));
          return;
      }

      self.setState({
          loading: true
      });
      EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => self.setState({loading: false}));

      let requestObj = {
          materialLots : materialLots,
          checkSubCode: checkSubCode,
          erpTime : erpTime,
          success: function(responseBody) {
              self.resetData();
              MessageUtils.showOperationSuccess();
          }
      }
      WltStockOutManagerRequest.sendMobileSaleStockOutRequest(requestObj);
    }

    buildButtons = () => {
      let buttons = [];
      buttons.push(
          <Col span={10} className="table-button">
              <Form.Item key="submitBtn" >
                  <Button block type="primary" onClick={this.stockOut}>{I18NUtils.getClientMessage(i18NCode.BtnOtherStockOut)}</Button>
              </Form.Item>
          </Col>
      );

      // buttons.push(
      //   <Col span={10} className="table-button">
      //       <Form.Item key="returnBtn" >
      //           <Button block type="primary" onClick={this.threeSideShip}>{I18NUtils.getClientMessage(i18NCode.BtnThreeSideShip)}</Button>
      //       </Form.Item>
      //   </Col>
      // );

      buttons.push(
        <Col span={10} className="table-button">
            <Form.Item key="returnBtn" >
                <Button block type="primary" onClick={this.saleShip}>{I18NUtils.getClientMessage(i18NCode.BtnSaleShip)}</Button>
            </Form.Item>
        </Col>
      );

      buttons.push(
          <Col span={21} className="table-button">
              <Form.Item key="returnBtn" >
                  <Button block type="primary" onClick={this.handleReset}>{I18NUtils.getClientMessage(i18NCode.BtnReset)}</Button>
              </Form.Item>
          </Col>
      );

      return buttons;
    }

    handleReset = () => {
      let  self= this;
      this.setState({ 
        tableData: [],
        loading: false
      });
      self.wltCpTable.erpTime.picker.setState({
        value : "",
      });
      this.form.resetFormFileds();
    }

    buildTable = () => {
        return <MobileMobileWltOrCpStockOutTable 
                                        ref={(wltCpTable) => { this.wltCpTable = wltCpTable }} 
                                        pagination={false} 
                                        table={this.state.table} 
                                        data={this.state.tableData} 
                                        loading={this.state.loading} 
                                        resetData={this.resetData.bind(this)}
                                        resetFlag={this.state.resetFlag}
                                        />
    }

}