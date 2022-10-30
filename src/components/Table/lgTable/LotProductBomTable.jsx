import { Button, Form } from 'antd';
import { i18NCode } from '../../../api/const/i18n';
import I18NUtils from '../../../api/utils/I18NUtils';
import LgProductBomForm from '../../Form/LgProductBomForm';
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

    createAddButton = () => {
        return <Button key="add" type="primary" style={styles.tableButton} icon="plus" onClick={() => this.handleAdd()}>{I18NUtils.getClientMessage(i18NCode.BtnSave)}</Button>;
    }

    createActiveButton = () => {
        return <Button key="active" type="primary" style={styles.tableButton} onClick={() => this.handleAdd()}>{I18NUtils.getClientMessage(i18NCode.BtnActive)}</Button>;
    }

    createFrozenButton = () => {
        return <Button key="frozen" type="primary" style={styles.tableButton} onClick={() => this.handleAdd()}>{I18NUtils.getClientMessage(i18NCode.BtnFrozen)}</Button>;
    }

}

const styles = {
    tableButton: {
        marginLeft:'20px'
    }
};
