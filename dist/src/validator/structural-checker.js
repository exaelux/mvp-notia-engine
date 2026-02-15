import { Ajv2020 } from "ajv/dist/2020.js";
import * as addFormatsNS from "ajv-formats";
import schema from "../../schemas/notia-canonical-event.schema.json" with { type: "json" };
const ajv = new Ajv2020({ allErrors: true, strict: false, removeAdditional: false });
const addFormats = typeof addFormatsNS === "function"
    ? addFormatsNS
    : addFormatsNS.default;
addFormats(ajv);
const validate = ajv.compile(schema);
export function structuralCheck(event) {
    const isValid = validate(event);
    if (!isValid) {
        return {
            status: "fail",
            errors: validate.errors?.map((e) => `${e.instancePath} ${e.message}`) ?? [],
        };
    }
    return { status: "pass" };
}
//# sourceMappingURL=structural-checker.js.map