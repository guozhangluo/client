import MobileProperties from "../mobile/MobileProperties";
import MessageUtils from "../../../../api/utils/MessageUtils";
import LgLotShipJudgeTable from "../../../../components/Table/lgTable/LgLotShipJudgeTable";
import I18NUtils from "../../../../api/utils/I18NUtils";
import { i18NCode } from "../../../../api/const/i18n";
import { Button, Col, Form } from 'antd';
import { Notification } from "../../../../components/notice/Notice";
import TableManagerRequest from "../../../../api/table-manager/TableManagerRequest";
import LotCheckManagerRequest from '../../../../api/lg/material-lot-check/LotCheckManagerRequest';

export default class LGLotShipJudgeProperties extends MobileProperties{
    
    static displayName = 'LGLotShipJudgeProperties';

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
        return <LgLotShipJudgeTable 
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
        const {tableData} = this.state;
        if (!tableData || tableData.length === 0) {
            Notification.showNotice(I18NUtils.getClientMessage(i18NCode.SelectAtLeastOneRow));
            return;
        }
        let object = {
            materialLotList : tableData,
            success: function(responseBody) {
                self.judgeSuccess()
            }
        }
        LotCheckManagerRequest.sendLotShipJudgePassRequest(object);
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
        LotCheckManagerRequest.sendLotShipJudgeNGRequest(object);
    }
}