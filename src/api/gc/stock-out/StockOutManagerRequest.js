import StockOutManagerRequestHeader from './StockOutManagerRequestHeader';
import StockOutManagerRequestBody from './StockOutManagerRequestBody';
import {UrlConstant} from '../../const/ConstDefine';
import MessageUtils from '../../utils/MessageUtils';
import Request from '../../Request';

export default class StockOutManagerRequest {


    static sendGetDataByRrnRequest = (object) => {
        let {tableRrn, materialLotId} = object;
        let requestBody = StockOutManagerRequestBody.buildQueryMLots(tableRrn, materialLotId);
        let requestHeader = new StockOutManagerRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.GCStockOutUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }

    static sendStockOutRequest = (object) => {
        let {documentLineList, materialLots} = object;
        let requestBody = StockOutManagerRequestBody.buildStockOut(documentLineList, materialLots);
        let requestHeader = new StockOutManagerRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.GCStockOutUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }

    static sendValidationRequest = (object) => {
        let {materialLotList} = object;
        let requestBody = StockOutManagerRequestBody.buildValidateMaterial(materialLotList);
        let requestHeader = new StockOutManagerRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.GCStockOutUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }

    static sendSaleShipRequest = (object) => {
        let {documentLineList, materialLots} = object;
        let requestBody = StockOutManagerRequestBody.buildComSaleShip(documentLineList, materialLots);
        let requestHeader = new StockOutManagerRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.GCStockOutUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }

    static sendTransferShipRequest = (object) => {
        let {documentLineList, materialLots, warehouseId} = object;
        let requestBody = StockOutManagerRequestBody.buildTransferShip(documentLineList, materialLots, warehouseId);
        let requestHeader = new StockOutManagerRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.GCStockOutUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }
}

