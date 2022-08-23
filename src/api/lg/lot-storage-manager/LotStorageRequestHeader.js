import RequestHeader from "../../RequestHeader";

const MESSAGE_NAME = "LGLotStorageReceive";

export default class LotStorageRequestHeader extends RequestHeader {

    constructor() {
        super(MESSAGE_NAME);
    }

}