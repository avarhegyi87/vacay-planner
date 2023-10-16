import { Provider } from './provider';

export interface AccountAttributes {
  id: number;
  userid: number;
  provider: Provider;
  accountid?: string;
  expiration?: Date;
}
