import * as moment from 'moment';

export const MOCK_USER = {
  userName: 'test',
  password: 'test',
  firstName: 'test',
  lastName: 'test',
  birthDate: moment().add(-18, 'years').toDate(),
};
