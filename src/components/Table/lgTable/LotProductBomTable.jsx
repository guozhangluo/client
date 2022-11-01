import { Button, Form } from 'antd';
import { i18NCode } from '../../../api/const/i18n';
import LotConfigRequest from '../../../api/lg/lg-config-manager/LotConfigRequest';
import EventUtils from '../../../api/utils/EventUtils';
import I18NUtils from '../../../api/utils/I18NUtils';
import MessageUtils from '../../../api/utils/MessageUtils';
import LgProductBomForm from '../../Form/LgProductBomForm';
import { Notification } from '../../notice/Notice';
import EntityListTable from '../EntityListTable';

export default class LotProductBomTable extends EntityListTable {

    static displayName = 'LotProductBomTable';

    constructor(props) {
        super(props);
    }

    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createAddButton());
        buttons.push(this.createActiveButton());
        buttons.push(this.createFrozenButton());        
        return buttons;
    }

    createForm = () => {
        const WrappedAdvancedEntityForm = Form.create()(LgProductBomForm);
        return  <WrappedAdvancedEntityForm ref={this.formRef} 
                                            object={this.state.editorObject} 
                                            visible={this.state.formVisible} 
                                            table={this.state.table} 
                                            onOk={this.refresh} 
                                            onCancel={this.handleCancel} />
    }

    bomActive = () => {
        let self = this;
        const selectedBom = this.getSingleSelectedRow();
        if (!selectedBom) {
            return;
        }
        let status = selectedBom.status;
        if(status != "Create"){
            Notification.showInfo(I18NUtils.getClientMessage(i18NCode.BomStatusCannotActive));
            return;
        }

        self.setState({
            loading: true
        });
        EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => self.setState({loading: false}));

        let requestObject = {
            productBom: selectedBom,
            success: function(responseBody) {
                self.refresh(responseBody.productBom);
                MessageUtils.showOperationSuccess();
            }
        }
        LotConfigRequest.sendActiveProductBom(requestObject);
    }
    
    bomUnFrozen = () => {
        let self = this;
        const selectedBom = this.getSingleSelectedRow();
        if (!selectedBom) {
            return;
        }
        let status = selectedBom.status;
        if(status == "Frozen"){
            Notification.showInfo(I18NUtils.getClientMessage(i18NCode.BomStatusCannotFrozen));
            return;
        }

        self.setState({
            loading: true
        });
        EventUtils.getEventEmitter().on(EventUtils.getEventNames().ButtonLoaded, () => self.setState({loading: false}));

        let requestObject = {
            productBom: selectedBom,
            success: function(responseBody) {
                self.refresh(responseBody.productBom);
                MessageUtils.showOperationSuccess();
            }
        }
        LotConfigRequest.sendFrozenProductBom(requestObject);
    }

    createAddButton = () => {
        return <Button key="add" type="primary" style={styles.tableButton} loading={this.state.loading} icon="plus" onClick={() => this.handleAdd()}>{I18NUtils.getClientMessage(i18NCode.BtnSave)}</Button>;
    }

    createActiveButton = () => {
        return <Button key="active" type="primary" style={styles.tableButton} loading={this.state.loading} onClick={() => this.bomActive()}>{I18NUtils.getClientMessage(i18NCode.BtnActive)}</Button>;
    }

    createFrozenButton = () => {
        return <Button key="frozen" type="primary" style={styles.tableButton} loading={this.state.loading} onClick={() => this.bomUnFrozen()}>{I18NUtils.getClientMessage(i18NCode.BtnFrozen)}</Button>;
    }

}

const styles = {
    tableButton: {
        marginLeft:'20px'
    }
};
