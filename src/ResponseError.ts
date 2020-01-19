import {ResponseArgs} from "./Response";

export interface ResponseErrorArgs {
  statusCode?: number;
  message?: string;
}

export const defaultResponseArgs: ResponseArgs = {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*', // Required for CORS
    'Access-Control-Allow-Credentials': 'true',
  },
};

export const defaultResponseErrorArgs: ResponseErrorArgs = {
  statusCode: 500,
  message: 'Internal server error MAXI',
};

export default class ResponseError {
  statusCode: number;
  body: string;
  headers: {
    [name: string]: string,
  };

  constructor(args: ResponseErrorArgs = defaultResponseErrorArgs) {
    const body = {
      message: args.message ?? defaultResponseErrorArgs.message as string
    };

    this.statusCode = args.statusCode ?? defaultResponseErrorArgs.statusCode as number;
    this.headers = {
      ...defaultResponseArgs.headers
    };
    this.body = JSON.stringify(body);

    console.log(body);
  }
}
