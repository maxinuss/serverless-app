## Coding Challenge Device Service
The challenge is to implement a simple microservice that manages the data of multiple
device entities. The programming language to be used is Node.JS (ideally with typeScript)!

#### Given
An device has the following data model:
```
device = {
    deviceId: <generated uuid>,
    name: <string>,
    firmwareVersion: <string>,
    firmwareRevision: <string>
}
```

All the data that belongs to a device is stored in a data storage by using the deviceId as a
key.

#### Implement
Provide a REST API using AWS API Gateway, Lambda and some storage to create and
query the devices.

The service should run on AWS, therefore you should use the AWS SDK for you
implementation. Use an appropriate software design to decouple the your implementation
from you personal AWS account and the SDK. The tests should run without any AWS
account. 

Please automate your stack so that the service can be rolled out to another AWS
account.

#### Requirements to RUN this project

- npm
- serverless
- typescript

#### Instructions

- Got to you project root folder and run:
``` 
npm i 
```

- Create IAM user with this permissions:

```
- AWSLambdaFullAccess
- IAMFullAccess
- AmazonS3FullAccess
- AmazonAPIGatewayInvokeFullAccess
- AmazonAPIGatewayAdministrator
- AWSCloudFormationFullAccess
```

- Configure your AWS account with your created user. In your project root Run:
``` 
serverless config credentials --profile nusschallenge --provider aws --key <YOUR_KEY> --secret <YOUR_SECRET>  
```

- Compile TS to JS. In your project root Run:
```
npx tsc
```

- Deploy to AWS
```
sls deploy
```
You will see in your console a list with endpoint addresses.

Enabled endpoints:

```
Create a device: 
POST https://<GENERATED_URL>/dev/devices
JSON BODY:
{
	"name": "test device",
	"firmwareVersion": "1.0.0",
	"firmwareRevision": "123"
}

Get one device by UUID:
GET https://<GENERATED_URL>/dev/devices/{deviceId}

Get all devices:
GET https://<GENERATED_URL>/dev/devices
```

#### Unit Test
In order tu run unit test, go to your project root folder and run:
```
npm run test
```

Code coverage in this project is about 93%.

#### Improvements
This is just a challenge, but there is a lot of thing that could be improved:

- Authentication
- Better data validation
- Error management
- Error logging
- Better HTTP error codes
- Some cache implementation
