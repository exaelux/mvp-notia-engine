import { Ajv2020 } from "ajv/dist/2020.js";
import schema from "../../schemas/noema-core-pure.schema.json" with { type: "json" };
const ajv = new Ajv2020({ allErrors: true, strict: false });
const validate = ajv.compile(schema);
function extractCorePayload(bundle) {
    if (bundle === null || typeof bundle !== "object") {
        return bundle;
    }
    const record = bundle;
    return {
        existence: record.existence,
        meaning: record.meaning,
        visibility_abstract: record.visibility_abstract,
    };
}
export function validateCoreBundle(bundle) {
    const corePayload = extractCorePayload(bundle);
    const isValid = validate(corePayload);
    if (!isValid) {
        return {
            valid: false,
            errors: validate.errors?.map((e) => `${e.instancePath} ${e.message}`) ?? [],
        };
    }
    return { valid: true };
}
//# sourceMappingURL=core-validator.js.map