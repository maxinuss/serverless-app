import Response from './Response';
import ResponseError from './ResponseError';
import { APIGatewayEvent } from 'aws-lambda'
import { createDevice, getDeviceById, getAllDevices } from './database';
import { validateParams, getCreateValidationSchema, getViewValidationSchema } from './dataValidator';

/**
 * GET /devices
 */
export async function getAllDeviceHandler() {
  try {
    const items = await getAllDevices();

    return new Response({ statusCode: 200, body: { items } });
  } catch (err) {
    return new ResponseError({ statusCode: 400, message: err.message });
  }
}

/**
 * GET /devices/{deviceId}
 * @param event
 */
export async function getDeviceHandler(event: APIGatewayEvent) {
  try {
    if (event.pathParameters === null) {
      throw new Error('Incorrect params');
    }

    const validator = validateParams(event.pathParameters, getViewValidationSchema());
    if (!validator.valid) {
      throw new Error(JSON.stringify(validator.errors))
    }

    const device = await getDeviceById(event.pathParameters.deviceId);

    return new Response({ statusCode: 200, body: device });
  } catch (err) {
    return new ResponseError({ statusCode: 400, message: err.message });
  }
}

/**
 * POST /devices
 * @param event
 */
export async function createDeviceHandler(event: APIGatewayEvent) {
  try {
    const body = JSON.parse(event.body as string);

    const validator = validateParams(body, getCreateValidationSchema());
    if (!validator.valid) {
      throw new Error(JSON.stringify(validator.errors))
    }

    const device = await createDevice(body.name, body.firmwareVersion, body.firmwareRevision);

    return new Response({statusCode: 201, body: device});
  } catch (err) {
    return new ResponseError({statusCode: 400, message: err.message});
  }
}