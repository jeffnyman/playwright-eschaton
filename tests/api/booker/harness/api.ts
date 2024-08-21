import { APIRequestContext, APIResponse } from "@playwright/test";

export default class API {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  private async generateRequest(
    endpoint: string,
    method: "get" | "post" | "put" | "patch" | "delete",
    requestBody?: object,
    token?: string,
  ): Promise<APIResponse> {
    const headers: Record<string, string> = token
      ? { Cookie: `token=${token}` }
      : {};

    const requestOptions = {
      headers,
      data: requestBody,
    };

    let response: APIResponse;

    switch (method) {
      case "get":
        response = await this.request.get(endpoint, requestOptions);
        break;
      case "post":
        response = await this.request.post(endpoint, requestOptions);
        break;
      case "put":
        response = await this.request.put(endpoint, requestOptions);
        break;
      case "patch":
        response = await this.request.patch(endpoint, requestOptions);
        break;
      case "delete":
        response = await this.request.delete(endpoint, requestOptions);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return response;
  }

  async getRequest(endpoint: string): Promise<APIResponse> {
    return this.generateRequest(endpoint, "get");
  }

  async postRequest(
    endpoint: string,
    requestBody: object,
  ): Promise<APIResponse> {
    return this.generateRequest(endpoint, "post", requestBody);
  }

  async putRequest(
    endpoint: string,
    requestBody: object,
    token: string,
  ): Promise<APIResponse> {
    return this.generateRequest(endpoint, "put", requestBody, token);
  }

  async patchRequest(
    endpoint: string,
    requestBody: object,
    token: string,
  ): Promise<APIResponse> {
    return this.generateRequest(endpoint, "patch", requestBody, token);
  }

  async deleteRequest(endpoint: string, token: string): Promise<APIResponse> {
    return this.generateRequest(endpoint, "delete", undefined, token);
  }
}
