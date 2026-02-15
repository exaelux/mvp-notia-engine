import { Ajv2020 } from "ajv/dist/2020.js";
import schema from "../../schemas/notia-canonical-event.schema.json" with { type: "json" };
const ajv = new Ajv2020({ allErrors: true, strict: false });
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