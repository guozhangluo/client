import MaterialLotRequestHeader from './MaterialLotRequestHeader';
import MaterialLotRequestBody from './MaterialLotRequestBody';
import Request from '../../Request';
import MessageUtils from '../../utils/MessageUtils';
import { UrlConstant } from "../../const/ConstDefine";

export default class MaterialLotRequest {

    static sendMaterialLotShipRequest = (object) => {
        let requestBody = MaterialLotRequestBody.buildMaterialLotShip(object.materialLotList);
        let requestHeader = new MaterialLotRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGMaterialLotManagerUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }

    static sendMaterialLotIssueRequest = (object) => {
        let requestBody = MaterialLotRequestBody.buildMaterialLotIssue(object.materialLotList);
        let requestHeader = new MaterialLotRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGMaterialLotManagerUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }

    static sendLotReceiveRequest = (object) => {
        let {materialLots} = object;
        let requestBody = MaterialLotRequestBody.buildWaferReceive(materialLots);
        let requestHeader = new MaterialLotRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGMaterialLotManagerUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }

}