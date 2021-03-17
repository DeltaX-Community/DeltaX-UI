import { IRtWs } from "./services/RtWs";
import * as Api from "./api/request";
export type IApi = typeof Api
import { ICommon } from "./Settings/Common";

declare global {
  interface Window {
    RtWs: IRtWs;
    Api: IApi;
    Common: ICommon;
  }
}
