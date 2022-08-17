import {UrlConstant} from '../../const/ConstDefine';
import MessageUtils from '../../utils/MessageUtils';
import Request from '../../Request';
import LotCheckManagerRequestBody from './LotCheckManagerRequestBody';
import LotCheckManagerRequestHeader from './LotCheckManagerRequestHeader';

export default class LotCheckManagerRequest {

    static sendLotPackedCheckPassRequest = (object) => {
        let requestBody = LotCheckManagerRequestBody.sendLotPackedCheckPassRequest(object.materialLotList);
        let requestHeader = new LotCheckManagerRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGLotJudgeManagerUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }

    static sendLotPackedCheckNGRequest = (object) => {
        let requestBody = LotCheckManagerRequestBody.sendLotPackedCheckNGRequest(object.materialLotList);
        let requestHeader = new LotCheckManagerRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGLotJudgeManagerUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }

    static sendLotShipJudgePassRequest = (object) => {
        let requestBody = LotCheckManagerRequestBody.sendLotShipJudgePassRequest(object.materialLotList);
        let requestHeader = new LotCheckManagerRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGLotJudgeManagerUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }

    static sendLotShipJudgeNGRequest = (object) => {
        let requestBody = LotCheckManagerRequestBody.sendLotShipJudgeNgRequest(object.materialLotList);
        let requestHeader = new LotCheckManagerRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGLotJudgeManagerUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }
}