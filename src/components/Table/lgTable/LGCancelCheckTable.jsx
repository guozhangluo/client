import { Button, Col, Row , Input} from 'antd';
import I18NUtils from '../../../api/utils/I18NUtils';
import { i18NCode } from '../../../api/const/i18n';
import { Notification } from '../../notice/Notice';
import MessageUtils from "../../../api/utils/MessageUtils";
import EventUtils from "../../../api/utils/EventUtils";
import EntityScanViewTable from "../EntityScanViewTable";
import MaterialLotManagerRequest from '../../../api/gc/material-lot-manager/MaterialLotManagerRequest';
import FormItem from 'antd/lib/form/FormItem';
import RefListField from '../../Field/RefListField';
import { SystemRefListName } from '../../../api/const/ConstDefine';

export default class LGCancelCheckTable extends EntityScanViewTable {

    static displayName = 'LGCancelCheckTable';

    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createExpressInput());
        return buttons;
    }

    createExpressInput = () => {
        return  <FormItem>
                    <Row gutter={4}>
                        <Col span={2} style={styles.col}>
                            <span>{I18NUtils.getClientMessage(i18NCode.CancelReason)}:</span>
                        </Col>
                        <Col span={4}>
                            <RefListField style={styles.RefListField} ref={(cancelReason) => { this.cancelReason = cancelReason }} referenceName={SystemRefListName.CancelCheckReason} />
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