export interface MetaParam {
  deviceId?: string;
  deviceType?: string;
  ipAddress?: string;
  signature?: string;
}

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
}

export interface RequestWithMeta extends Request {
  deviceId: string;
  deviceType?: string;
  ipAddress: string;
  signature?: string;
  user?: UserInfo;
}

export interface RequestWithHeader extends Request {
  token?: string;
  language?: string;
  ipAddress?: string;
  deviceId?: string;
  deviceType?: string;
  xApiKey?: string;
  user?: UserInfo;
  signature?: string;
  appId?: string;
  publicKey?: string;
  addFilterMeta?: boolean;
  flagSmithSignature?: string;
}
