import { devKeys } from './dev';
import { prodKeys } from './prod';

const keys = process.env.NODE_ENV === 'production' ? prodKeys : devKeys;

export default keys;