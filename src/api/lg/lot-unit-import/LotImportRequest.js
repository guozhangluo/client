import LotImportRequestHeader from './LotImportRequestHeader';
import LotImportRequestBody from './LotImportRequestBody';
import Request from '../../Request';
import MessageUtils from '../../utils/MessageUtils';
import { UrlConstant } from "../../const/ConstDefine";

export default class LotImportRequest {
    
    static sendSelectRequest = (object, file) => {
        let requestBody = LotImportRequestBody.buildSelectFile(object.importType, object.fileName);
        let requestHeader = new LotImportRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGLotImportManagerUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendImportData(requestObject, file);
    }

    static sendImportRequest = (object) => {
        let requestBody = LotImportRequestBody.buildImportInfo(object.importType, object.dataList);
        let requestHeader = new LotImportRequestHeader();
        let request = new Request(requestHeader, requestBody, UrlConstant.LGLotImportSaveUrl);
        let requestObject = {
            request: request,
            success: object.success
        }
        MessageUtils.sendRequest(requestObject);
    }

}