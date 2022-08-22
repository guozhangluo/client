import RequestHeader from "../../RequestHeader";

const MESSAGE_NAME = "LGLotImport";

export default class LotImportRequestHeader extends RequestHeader {

    constructor() {
        super(MESSAGE_NAME);
    }

}