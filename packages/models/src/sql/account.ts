import { Provider } from './provider';

export interface Account {
  id: number;
  userid: number;
  provider: Provider;
  accountid?: string;
  expiration?: Date;
}
