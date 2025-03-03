import { IApiClientResponse } from "./client.interface";

export default class APIClient {
  private readonly baseUrl: string;
  constructor(baseURL: string) {
    this.baseUrl = `${baseURL.endsWith("/") ? baseURL : baseURL + "/"}`;
  }
  public async get<R>(path: string): Promise<IApiClientResponse<R>> {
    try {
      const response = await fetch(this.buildURL(path), {
        ...this.getHeaders(),
      });
      const responseJson = await response.json();
      if (!response.ok) {
        return {
          error: new Error("Failed to make request"),
        };
      }
      return {
        data: responseJson as R,
      };
    } catch (error: unknown) {
      return {
        error: error as Error,
      };
    }
  }

  public async post<B, R>(path: string, body: B): Promise<IApiClientResponse<R>> {
    try {
      const response = await fetch(this.buildURL(path), {
        ...this.getHeaders(),
        method: "POST",
        body: JSON.stringify(body),
      });
      const responseJson = await response.json();
      if (response.ok) {
        return {
          data: responseJson as R,
        };
      } else {
        return {
          error: new Error("Failed to make request"),
        };
      }
    } catch (error: unknown) {
      return {
        error: error as Error,
      };
    }
  }

  private buildURL(path: string): string {
    return `${this.baseUrl}${path.startsWith("/") ? path.substring(1) : path}`;
  }

  private getHeaders() {
    return {
      headers: {
        "Content-Type": "application/json",
        "Mocked-Auth": "LetMeIn",
      },
    };
  }
}
