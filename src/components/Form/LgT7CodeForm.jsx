import EntityForm from './EntityForm';
import ProductSubcodeManagerRequest from '../../api/gc/product-subcode-manager/ProductSubcodeManagerRequest';
import LotConfigRequest from '../../api/lg/lg-config-manager/LotConfigRequest';

export default class LgT7CodeForm extends EntityForm {
    static displayName = 'LgT7CodeForm';

    handleSave = () => {
        var self = this;
        let object = {
            t7codeConfig: this.props.object,
            success: function(responseBody) {
                if (self.props.onOk) {
                    self.props.onOk(responseBody.t7codeConfig);
                }
            }
        };
        LotConfigRequest.sendSaveT7CodeConfig(object);
    }
}


