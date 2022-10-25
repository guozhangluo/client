import { Notification } from "../../../../components/notice/Notice";
import MobileProperties from "../mobile/MobileProperties";
import I18NUtils from "../../../../api/utils/I18NUtils";
import { i18NCode } from "../../../../api/const/i18n";
import MessageUtils from "../../../../api/utils/MessageUtils";
import { Button, Col, Form } from 'antd';
import TableManagerRequest from "../../../../api/table-manager/TableManagerRequest";
import LgLotPackCaseCheckTable from "../../../../components/Table/lgTable/LgLotPackCaseCheckTable";
import LotCheckManagerRequest from '../../../../api/lg/material-lot-check/LotCheckManagerRequest';

export default class LgLotPackCaseCheckProperties extends MobileProperties{
    
    static displayName = 'LgLotPackCaseCheckProperties';
    
    constructor(props) {
        super(props);
        this.state = {...this.state, ...{checkAllFlag: false}};
    }

    resetData = () => {
      this.setState({
        selectedRowKeys: [],
        selectedRows: [],
        tableData: [],
        loading: false,
        resetFlag: true,
        checkAllFlag: false
      });
    }

    queryData = (whereClause) => {
      const self = this;
      let {tableData, checkAllFlag} = this.state;
      let firstQueryField = self.form.state.queryFields[0];
      let lotId = self.form.props.form.getFieldValue(firstQueryField.name);
      if(tableData.length > 0 && checkAllFlag == false){
        self.afterSecondQuery(lotId);
      } else {
        let requestObject = {
          tableRrn: this.state.tableRrn,
          whereClause: whereClause,
          success: function(responseBody) {
            let queryDatas = responseBody.dataList;
            if (queryDatas && queryDatas.length > 0) {
                self.setState({ 
                  tableData: queryDatas,
                  loading: false,
                  resetFlag:true,
                  selectedRowKeys: [],
                  selectedRows: [],
                });
            } else {
              self.showDataNotFound();
              self.resetData();
            }
            self.form.resetFormFileds();
          }
        }
        TableManagerRequest.sendGetDataByRrnRequest(requestObject);
      }
    }

    afterSecondQuery = (lotId) => {
        let {rowKey, tableData, selectedRowKeys, selectedRows, checkAllFlag} = this.state;
        let checkFlag = false;
        tableData.forEach(data => {
          if(data.lotId == lotId){
            data.scaned = true;
            checkFlag = true;
            if (selectedRowKeys.indexOf(data[rowKey]) < 0) {
              selectedRowKeys.push(data[rowKey]);
              selectedRows.push(data);
            }
          }
        });
        
        if(checkFlag){
          if(selectedRows.length == tableData.length){
            checkAllFlag = true;
          }
          this.setState({ 
            selectedRowKeys: selectedRowKeys,
            selectedRows: selectedRows,
            tableData: tableData,
            checkAllFlag: checkAllFlag,
            resetFlag:false,
            loading: false
          });
        } else {
          this.showDataNotFound();
        }
        this.form.resetFormFileds();
      }

    showDataNotFound = () => {
      let self = this;
      self.setState({ 
        loading: false,
      });
      let data = self.form.props.form.getFieldValue(self.form.state.queryFields[0].name);
      this.allFieldBlur();
      Notification.showInfo(I18NUtils.getClientMessage(i18NCode.DataNotFound) + (data || ""));
    }

    buildButtons = () => {
        let buttons = [];
        buttons.push(
            <Col span={10} className="table-button">
                <Form.Item key="submitBtn" >
                    <Button block type="primary" onClick={this.judgePass}>Pass</Button>
                </Form.Item>
            </Col>
        );
  
        buttons.push(
          <Col span={10} className="table-button">
              <Form.Item key="returnBtn" >
                  <Button block type="primary"  onClick={this.judgeNg}>NG</Button>
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

    buildTable = () => {
        return <LgLotPackCaseCheckTable 
                                    pagination={false} 
                                    rowKey={this.state.rowKey} 
                                    selectedRowKeys={this.state.selectedRowKeys} 
                                    selectedRows={this.state.selectedRows} 
                                    table={this.state.table} 
                                    data={this.state.tableData} 
                                    loading={this.state.loading} 
                                    resetData={this.resetData.bind(this)}/>
    }

    judgeSuccess = () => {
      this.setState({formVisible : false});
      if (this.resetData) {
          this.resetData();
      }
      MessageUtils.showOperationSuccess();
    }

    judgePass = () => {
      var self = this;
      const {tableData, selectedRows} = this.state;
      if (!tableData || tableData.length === 0) {
          Notification.showNotice(I18NUtils.getClientMessage(i18NCode.SelectAtLeastOneRow));
          return;
      }
      if (this.props.scanErrorFlag) {
          Notification.showNotice("出现过扫描错误，请重新查找并重新扫描");
          return;
      }
      if (selectedRows.length != tableData.length) {
          Notification.showNotice("数据没有全部扫描");
          return;
      }
      if(tableData.length > 1 && this.validationAltek(tableData)){
          Notification.showNotice(I18NUtils.getClientMessage(i18NCode.ThereAreDifferentCustomersInTheBox));
          return;
      }
      let object = {
          materialLotList : selectedRows,
          success: function(responseBody) {
              self.judgeSuccess()
          }
      }
      LotCheckManagerRequest.sendLotPackedCheckPassRequest(object);
  }

  /**
   * 客户简称是否一致
   * @param {*} data 
   * @returns 
   */
   validationAltek = (data) =>{
      let flag = false;
      var altek = data[0].reserved55;
      data.forEach((item)=>{
          if(altek != item.reserved55){
              flag = true
              return flag;
          }
      });
      return flag;
  }

  judgeNg = () => {
      const {tableData} = this.state;
      let self = this;
      if (!tableData || tableData.length == 0) {
          Notification.showNotice(I18NUtils.getClientMessage(i18NCode.SelectAtLeastOneRow));
          return;
      }
      let object = {
          materialLotList : tableData,
          success: function(responseBody) {
              self.judgeSuccess()
          }
      }
      LotCheckManagerRequest.sendLotPackedCheckNGRequest(object);
  }
}