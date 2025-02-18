import * as moment from 'moment';

export function extractParams(path: string) {
  if (!path) return [];
  const items = path.split('/');
  const params = [];
  items.forEach((itm) => {
    if (itm.includes(':')) {
      params.push(itm.replace(':', ''));
    }
  });
  return params;
}

export function getAge(birthDate: Date) {
  return moment().diff(moment(birthDate), 'years');
}
