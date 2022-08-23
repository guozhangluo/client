import LotStorageRequestHeader from './LotStorageRequestHeader';
import LotStorageRequestBody from './LotStorageRequestBody';
import Request from '../../Request';
import MessageUtils from '../../utils/MessageUtils';
import { UrlConstant } from "../../const/ConstDefine";

export default class LotStorageRequest {

    static sendQueryStoarageLotRequest = (object) => {
        let requestBody = LotStorageRequestBody.buildQueryStorageLotInfo(object.lotId, object.fosbId);
        let requestHeader = new LotStorageRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGLotStorageReceiveUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }

    static sendLotReceiveRequest = (object) => {
        let requestBody = LotStorageRequestBody.buildReceiveStorageLot(object.mesStorageLots);
        let requestHeader = new LotStorageRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGLotStorageReceiveUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }

}