import { Form } from 'antd';
import LotConfigRequest from '../../../api/lg/lg-config-manager/LotConfigRequest';
import LgT7CodeForm from '../../Form/LgT7CodeForm';
import EntityListTable from '../EntityListTable';

export default class LotT7CodeConfigTable extends EntityListTable {

    static displayName = 'ProductTable';

    constructor(props) {
        super(props);
    }

    createButtonGroup = () => {
        let buttons = [];
        buttons.push(this.createAddButton());
        buttons.push(this.createImportButton());
        buttons.push(this.createExportDataAndTemplateButton());
        return buttons;
    }

    handleDelete = (record) => {
        const self = this;
        let object = {
            t7codeConfig: record,
            success: function(responseBody) {
                self.refreshDelete(record);
            }
        };
        LotConfigRequest.sendDeleteT7CodeConfig(object);
    } 

    createForm = () => {
        const WrappedAdvancedEntityForm = Form.create()(LgT7CodeForm);
        return  <WrappedAdvancedEntityForm ref={this.formRef} object={this.state.editorObject} visible={this.state.formVisible} 
                                            table={this.state.table} onOk={this.refresh} onCancel={this.handleCancel} />
    }

}

const styles = {
    tableButton: {
        marginLeft:'20px'
    }
};
