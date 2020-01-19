import {validate} from "revalidator";

/**
 *
 * @param params
 * @param schema
 */
export function validateParams(params: Object, schema: Object) {
    return validate(params, schema);
}

export function getCreateValidationSchema() {
    return {
        properties: {
            name: {
                description: 'name is required',
                type: 'string',
                required: true
            },
            firmwareVersion: {
                description: 'firmwareVersion is required',
                type: 'string',
                required: true
            },
            firmwareRevision: {
                description: 'firmwareRevision is required',
                type: 'string',
                required: true
            }
        }
    };
}

export function getViewValidationSchema() {
    return {
        properties: {
            deviceId: {
                description: 'deviceId is required',
                type: 'string',
                required: true
            },
        }
    };
}