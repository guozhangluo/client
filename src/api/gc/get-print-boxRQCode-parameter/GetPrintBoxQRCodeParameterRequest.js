import GetPrintBoxQRCodeParameterRequestHeader from './GetPrintBoxQRCodeParameterRequestHeader';
import GetPrintBoxQRCodeParameterRequestBody from './GetPrintBoxQRCodeParameterRequestBody';
import {UrlConstant} from '../../const/ConstDefine';
import MessageUtils from '../../utils/MessageUtils';
import Request from '../../Request';

export default class GetPrintBoxQRCodeParameterRequest {

    static sendGetBoxLabelPrintParamaterRequest = (object) => {
        let requestBody = GetPrintBoxQRCodeParameterRequestBody.buildGetBoxPrintLabelParamater(object.materialLotList);
        let requestHeader = new GetPrintBoxQRCodeParameterRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.GCGetPrintBoxQRCodeParameterUrl);
        let requestObject = {
            request: request,
            success: object.success,
            fail: object.fail
        }
        MessageUtils.sendRequest(requestObject);
    }

    static sendGetBoxQRCodeLabelPrintParamaterRequest = (object) => {
        let requestBody = GetPrintBoxQRCodeParameterRequestBody.buildGetBoxPrintQRCodeLabelParamater(object.materialLotList, object.printVboxLabelFlag);
        let requestHeader = new GetPrintBoxQRCodeParameterRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.GCGetPrintBoxQRCodeParameterUrl);
        let requestObject = {
            request: request,
            success: object.success,
            fail: object.fail
        }
        MessageUtils.sendRequest(requestObject);
    }

}

