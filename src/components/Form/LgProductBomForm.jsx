import EntityForm from './EntityForm';
import LotConfigRequest from '../../api/lg/lg-config-manager/LotConfigRequest';

export default class LgProductBomForm extends EntityForm {

    static displayName = 'LgProductBomForm';

    handleSave = () => {
        var self = this;
        let object = {
            productBom : this.props.object,
            success: function(responseBody) {
                if (self.props.onOk) {
                    self.props.onOk(responseBody.productBom);
                }
            }
        };
        LotConfigRequest.sendSaveProductBomConfig(object);
    }
}


