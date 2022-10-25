import RequestHeader from "../../RequestHeader";

const MESSAGE_NAME = "LotConfig";

export default class LotConfigRequestHeader extends RequestHeader {

    constructor() {
        super(MESSAGE_NAME);
    }

}