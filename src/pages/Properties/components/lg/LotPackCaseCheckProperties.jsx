import { i18NCode } from "../../../../api/const/i18n";
import TableManagerRequest from "../../../../api/table-manager/TableManagerRequest";
import I18NUtils from "../../../../api/utils/I18NUtils";
import { Notification } from "../../../../components/notice/Notice";
import LotPackCaseCheckTable from "../../../../components/Table/lgTable/LotPackCaseCheckTable";
import EntityScanProperties from "../entityProperties/EntityScanProperties";

export default class LotPackCaseCheckProperties extends EntityScanProperties{

    static displayName = 'LotPackCaseCheckProperties';
    
    constructor(props) {
      super(props);
      this.state = {...this.state, ...{checkAllFlag: false}};
    }

    queryData = (whereClause) => {
      debugger;
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
                self.form.resetFormFileds();
            } else {
              self.showDataNotFound();
              self.resetData();
              self.form.resetFormFileds();
              self.form.state.queryFields[0].node.focus();
            }
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
        this.form.state.queryFields[0].node.focus();
        this.form.resetFormFileds();
      } else {
        this.showDataNotFound();
        this.form.resetFormFileds();
        this.form.state.queryFields[0].node.focus();
      }
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

    buildTable = () => {
        return <LotPackCaseCheckTable pagination={false} 
                                    rowKey={this.state.rowKey} 
                                    selectedRowKeys={this.state.selectedRowKeys} 
                                    selectedRows={this.state.selectedRows} 
                                    table={this.state.table} 
                                    data={this.state.tableData} 
                                    loading={this.state.loading} 
                                    resetData={this.resetData.bind(this)}
                                    resetFlag={this.state.resetFlag}
                                    scanErrorFlag={this.state.scanErrorFlag}/>
    }
}