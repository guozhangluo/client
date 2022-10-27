
import EntityScanViewTable from '../EntityScanViewTable';
import { Notification } from '../../notice/Notice';
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import {Col, Input, Row, Tag } from "antd";
import FormItem from "antd/lib/form/FormItem";

/**
 * 手持端箱标签打印
 */
 export default class LgLotBoxLabelPrintTable extends EntityScanViewTable {

    static displayName = 'LgLotBoxLabelPrintTable';

    createTagGroup = () => {
      let tags = [];
      tags.push(this.createPrintLabelCount());
      tags.push(this.createPackageQty());
      tags.push(this.createPieceNumber());
      tags.push(this.createTotalNumber());
      return tags;
  }

  createTotalNumber = () => {
      let materialLots = this.state.data;
      let count = 0;
      if(materialLots && materialLots.length > 0){
          materialLots.forEach(data => {
              count = count + data.currentQty;
          });
      }
      return <Tag color="#2db7f5">{I18NUtils.getClientMessage(i18NCode.TotalQty)}：{count}</Tag>
  }

  createPackageQty = () => {
      return <Tag color="#2db7f5">{I18NUtils.getClientMessage(i18NCode.PackageQty)}：{this.state.data.length}</Tag>
  }

  createPrintLabelCount = () => {
   return  <FormItem>
               <Row gutter={4}>
                   <Col span={2} style={styles.col}>
                       <span>{I18NUtils.getClientMessage(i18NCode.PrintCount)}:</span>
                   </Col>
                   <Col span={3}>
                       <Input ref={(printCount) => { this.printCount = printCount }} defaultValue={2} key="printCount" placeholder="打印份数"/>
                   </Col>
               </Row>
           </FormItem>
   }
}

const styles = {
   tableButton: {
       marginLeft:'20px'
   },
   RefListField: {
       marginLeft: '6px',
       width: '150px'
   },
   col: {
       width: '65px'
   }
};
