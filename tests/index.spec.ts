import 'mocha';
import * as proxyquire from 'proxyquire';
import { expect } from 'chai';

const device = {
  deviceId: '1',
  name: 'test',
  firmwareVersion: '1.0.0',
  firmwareRevision: 11111
};

const database = proxyquire('../src/database', {
  path: {
    '@noCallThru': true
  },
  'aws-sdk': {
    'DynamoDB': {
      'DocumentClient': () => {
        return {
          'put': () => {
            return  { 'promise': () => { return device } }
          },
          'scan': () => {
            return  { 'promise': () => { return { 'Item': device, 'Items': [device], 'Count': 0 } } }
          },
          'get': () => {
            return  { 'promise': () => { return { 'Item': device } }  }
          },
        }
      }
    }
  }
});

const mock = proxyquire(
    '../src/index',
    {
      path: {
        '@noCallThru': true
      },
      'aws-lambda': {
        'Context': null,
        'APIGatewayEvent': null
      },
      './database': database
    }
);

describe('Index.ts', () => {
  describe('Create device handler', () => {
    it('should return 201', async () => {
      const params = {
        body: "{\"name\":\"test\",\"firmwareVersion\":\"1.0.0\",\"firmwareRevision\":\"11111\"}"
      };

      const result = await mock.createDeviceHandler(params);
      expect(result.statusCode).to.equal(201);

      const body = JSON.parse(result.body);
      expect(body.name).to.equal('test');
    });

    it('should return 400', async () => {
      const params = {
        body: "{\"nonExistentProperty\":\"test\",\"firmwareVersion\":\"1.0.0\",\"firmwareRevision\":\"11111\"}"
      };

      const result = await mock.createDeviceHandler(params);
      expect(result.statusCode).to.equal(400);
    });

  });

  describe('Get device handler', () => {
    it('should return 200', async () => {
      const params = {
        pathParameters: {
          deviceId: '1'
        }
      };

      const result = await mock.getDeviceHandler(params);
      expect(result.statusCode).to.equal(200);

      const body = JSON.parse(result.body);
      expect(body.name).to.equal('test');
    });

    it('should return 400', async () => {
      const params = {
        pathParameters: {
        }
      };

      const result = await mock.getDeviceHandler(params);
      expect(result.statusCode).to.equal(400);
    });

  });

  describe('Get All device handler', () => {
    it('should return 200', async () => {
      const result = await mock.getAllDeviceHandler();
      expect(result.statusCode).to.equal(200);

      const body = JSON.parse(result.body);
      expect(body.items[0].name).to.equal('test');
    });
  });
});
