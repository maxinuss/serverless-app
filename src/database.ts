import { DynamoDB } from 'aws-sdk';
import * as uuidv4 from 'uuid/v4';
import Device from './Device';

const db = new DynamoDB.DocumentClient();
const tableName = process.env.DYNAMODB_TABLE ?? '';

/**
 *
 * @param name
 * @param firmwareVersion
 * @param firmwareRevision
 */
export async function createDevice(name: string, firmwareVersion: string, firmwareRevision: string): Promise<Device> {
    const exist = await deviceExist(name, firmwareVersion, firmwareRevision);

    if (exist) {
        throw new Error(`This device is duplicated: ${name} - ${firmwareVersion} - ${firmwareRevision}`);
    }

    const params = {
        TableName: tableName,
        ConditionExpression: 'attribute_not_exists(id)',
        Item: {
            deviceId: uuidv4(),
            name,
            firmwareVersion,
            firmwareRevision
        },
    };

    await db.put(params).promise();

    return params.Item;
}

/**
 *
 * @param deviceId
 */
export async function getDeviceById(deviceId: string): Promise<Device> {
    const params = {
        TableName: tableName,
        Key: {
            deviceId,
        },
    };

    const data = await db.get(params).promise();

    if (data.Item === undefined) {
        throw new Error(`An device could not be found with id: ${deviceId}`);
    }

    return data.Item as Device;
}

/**
 *
 */
export async function getAllDevices(): Promise<Device[]> {
    const params = {
        TableName: tableName,
    };

    const data = await db.scan(params).promise();

    return data.Items as Device[];
}

/**
 *
 * @param name
 * @param firmwareVersion
 * @param firmwareRevision
 */
async function deviceExist(name: string, firmwareVersion: string, firmwareRevision: string): Promise<Boolean> {
    const params = {
        TableName: tableName,
        ExpressionAttributeNames: {
            "#name": "name"
        },
        FilterExpression: "firmwareVersion = :firmwareVersion AND firmwareRevision = :firmwareRevision AND #name = :name",
        ExpressionAttributeValues : {
            ':firmwareVersion' : firmwareVersion,
            ':firmwareRevision' : firmwareRevision,
            ':name' : name
        }
    };

    const data = await db.scan(params).promise();

    if (data.Count === undefined) {
        return false;
    }

    return data.Count > 0;
}