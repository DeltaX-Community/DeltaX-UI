import { IRtWs } from "./services/RtWs";

declare global {
  interface Window {
    RtWs: IRtWs;
  }
}
