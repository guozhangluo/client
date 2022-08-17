import RequestHeader from "../../RequestHeader";
const MESSAGE_NAME = "LGMaterialLotCheckManage";

export default class LotCheckManagerRequestHeader extends RequestHeader{

    constructor() {
        super(MESSAGE_NAME);
    }

}
