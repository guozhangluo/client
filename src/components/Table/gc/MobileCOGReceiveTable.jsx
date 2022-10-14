import EntityScanViewTable from '../EntityScanViewTable';
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import { Col, DatePicker, Row, Tag, Icon, Switch } from 'antd';
import { DateFormatType } from '../../../api/const/ConstDefine';
import FormItem from 'antd/lib/form/FormItem';
import locale from 'antd/lib/date-picker/locale/zh_CN';

export default class MobileCOGReceiveTable extends EntityScanViewTable {

    static displayName = 'MobileCOGReceiveTable';

    getRowClassName = (record, index) => {
        if (record.errorFlag) {
            return 'error-row';
        } else {
            if(index % 2 ===0) {
                return 'even-row'; 
            } else {
                return ''; 
            }
        }
    };

    constructor(props) {
        super(props);
        this.state = {...this.state, ...{checked:true},...{value: "receiveWithDoc"}};
    }

    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createStatistic());
        buttons.push(this.createTotalNumber());
        buttons.push(this.createErrorNumberStatistic());
        buttons.push(this.erpCreatedTime());
        buttons.push(this.createReceiveWithDocFlag());
        return buttons;
    }

    createReceiveWithDocFlag = () => {
        return <span style={{display: 'flex'}}>
            <span style={{marginLeft:"30px", fontSize:"16px"}}>{I18NUtils.getClientMessage(i18NCode.MatchErpDocLine)}:</span>
            <span style = {{marginLeft:"10px"}}>
                <Switch ref={(checkedChildren) => { this.checkedChildren = checkedChildren }} 
                        checkedChildren={<Icon type="receiveWithDoc" />} 
                        unCheckedChildren={<Icon type="close" />} 
                        onChange={this.handleChange} 
                        disabled={this.disabled}
                        checked={this.state.checked}/>
            </span>
        </span>
    }

    handleChange = (checkedChildren) => {
        if(checkedChildren){
            this.setState({ 
                value: "receiveWithDoc",
                checked: true
            });
        } else {
            this.setState({ 
                value: "",
                checked: false
            });
        }
    }

    erpCreatedTime = () => {
        return <FormItem>
                    <Row gutter={16}>
                        <Col span={6} >
                            <span>{I18NUtils.getClientMessage(i18NCode.erpCreatedTime)}:</span>
                        </Col>
                        <Col span={8}>
                            <DatePicker ref={(erpTime) => { this.erpTime = erpTime }} locale={locale} showTime format={DateFormatType.Date} />
                        </Col>
                    </Row>
                </FormItem>
    }

    getErrorCount = () => {
        let materialLots = this.state.data;
        let count = 0;
        if(materialLots && materialLots.length > 0){
            materialLots.forEach(data => {
                if(data.errorFlag){
                    count = count +1;
                }
            });
        }
        return count;
    }

    createErrorNumberStatistic = () => {
        return <Tag color="#D2480A">{I18NUtils.getClientMessage(i18NCode.ErrorNumber)}：{this.getErrorCount()}</Tag>
    }

    createTotalNumber = () => {
        let materialLots = this.state.data;
        let count = 0;
        if(materialLots && materialLots.length > 0){
            materialLots.forEach(data => {
                if (data.currentQty != undefined) {
                    count = count + data.currentQty;
                }
            });
        }
        return <Tag color="#2db7f5">{I18NUtils.getClientMessage(i18NCode.TotalQty)}：{count}</Tag>
    }

    createStatistic = () => {
        return <Tag color="#2db7f5">{I18NUtils.getClientMessage(i18NCode.BoxQty)}：{this.state.data.length}</Tag>
    }

}

const styles = {
    tableButton: {
        marginLeft:'20px'
    }
};
