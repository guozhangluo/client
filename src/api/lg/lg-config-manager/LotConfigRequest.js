import LotConfigRequestHeader from './LotConfigRequestHeader';
import LotConfigRequestBody from './LotConfigRequestBody';
import Request from '../../Request';
import MessageUtils from '../../utils/MessageUtils';
import { UrlConstant } from "../../const/ConstDefine";

export default class LotConfigRequest {

    static sendSaveT7CodeConfig = (object) => {
        if (object.t7codeConfig.newFlag) {
            object.t7codeConfig[DefaultRowKey] = undefined;
        }
        let requestBody = LotConfigRequestBody.buildSaveT7CodeConfig(object.t7codeConfig);
        let requestHeader = new LotConfigRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGLotT7CodeConfigUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }

    static sendDeleteT7CodeConfig = (object) => {
        let requestBody = LotConfigRequestBody.buildDeleteT7CodeConfig(object.t7codeConfig);
        let requestHeader = new LotConfigRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGLotT7CodeConfigUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }
}