import axios, { AxiosRequestConfig } from "axios";

const serverUrl = process.env.REACT_APP_BACKEND_SERVER_URL;

const api = axios.create({
  baseURL: serverUrl ? `${serverUrl}/systemcomments` : "http://localhost:3001",
});

export function makeRequest(
  url: string,
  options?: AxiosRequestConfig<any> | undefined
) {
  return api(url, options)
    .then((res) => res.data)
    .catch((error) => Promise.reject(error?.response?.data ?? error));
}
