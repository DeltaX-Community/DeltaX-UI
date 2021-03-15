import { IRtWs } from "./services/RtWs";
import * as Api from "./api/request";
export type IApi = typeof Api

declare global {
  interface Window {
    RtWs: IRtWs;
    Api: IApi;
  }
}
