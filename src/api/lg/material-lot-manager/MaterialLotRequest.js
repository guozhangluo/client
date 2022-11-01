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

    static sendLotBoxLabelPrintRequest = (object) => {
        let requestBody = MaterialLotRequestBody.buildLotBoxLabelPrint(object.materialLotList, object.printCount);
        let requestHeader = new MaterialLotRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGMaterialLotManagerUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }

    static sendOutSourceLotLabelQueryRequest = (object) => {
        let requestBody = MaterialLotRequestBody.buildOutSourceLotLabelQuery(object.lotId);
        let requestHeader = new MaterialLotRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGMaterialLotManagerUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }

    static sendLotOutSourceLabelPrintRequest = (object) => {
        let requestBody = MaterialLotRequestBody.buildLotOutSourceLabelPrint(object.materialLotList, object.printCount);
        let requestHeader = new MaterialLotRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGMaterialLotManagerUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }

    static sendBoxLabelPrintQueryRequest = (object) => {
        let requestBody = MaterialLotRequestBody.buildBoxLabelPrintQuery(object.lotId);
        let requestHeader = new MaterialLotRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGMaterialLotManagerUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }

    static sendBoxLabelPrintRequest = (object) => {
        let requestBody = MaterialLotRequestBody.buildBoxLabelPrint(object.materialLotList, object.printCount);
        let requestHeader = new MaterialLotRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGMaterialLotManagerUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }

    static sendNpwLabelPrintQueryRequest = (object) => {
        let requestBody = MaterialLotRequestBody.buildNpwLabelPrintQuery(object.lotId);
        let requestHeader = new MaterialLotRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGMaterialLotManagerUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }

    static sendNpwLabelPrintRequest = (object) => {
        let requestBody = MaterialLotRequestBody.buildNpwLabelPrint(object.materialLotList, object.printCount);
        let requestHeader = new MaterialLotRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGMaterialLotManagerUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }

    static sendMLotRecordExpress = (object) => {
        let requestBody = MaterialLotRequestBody.buildManualRecordExpress(object.expressNumber, object.materialLotList, object.expressCompany);
        let requestHeader = new MaterialLotRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGMaterialLotManagerUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }
    
    static sendCancelRecordExpress = (object) => {
        let requestBody = MaterialLotRequestBody.buildCancelRecordExpress(object.materialLotList);
        let requestHeader = new MaterialLotRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGMaterialLotManagerUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }
    
    static sendPrintObliqueLabelRequest = (object) => {
        let requestBody = MaterialLotRequestBody.buildPrintObliqueLabel(object.materialLotList);
        let requestHeader = new MaterialLotRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGMaterialLotManagerUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }

    static sendGetBoxLabelMLotListRequest = (object) => {
        let requestBody = MaterialLotRequestBody.buildQueryBoxLabelMLotList(object.tableRrn, object.whereClause, object.tagFlag);
        let requestHeader = new MaterialLotRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGMaterialLotManagerUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }

    static sendQueryLotWeightRequest = (object) => {
        let requestBody = MaterialLotRequestBody.buildQueryLotWeight(object.lotId, object.tableRrn);
        let requestHeader = new MaterialLotRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGMaterialLotManagerUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }

    static sendLotWeightRequest = (object) => {
        let requestBody = MaterialLotRequestBody.buildLotWeight(object.materialLotList);
        let requestHeader = new MaterialLotRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGMaterialLotManagerUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }
}