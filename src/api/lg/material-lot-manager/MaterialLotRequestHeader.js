import RequestHeader from "../../RequestHeader";

const MESSAGE_NAME = "MaterialLotManager";

export default class MaterialLotRequestHeader extends RequestHeader {

    constructor() {
        super(MESSAGE_NAME);
    }

}