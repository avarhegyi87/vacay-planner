import { ProviderType } from './provider-type';

export interface Account {
  userid: number;
  provider: ProviderType;
  accountid?: string;
  expiration?: Date;
}
