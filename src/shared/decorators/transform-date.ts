import { Transform } from 'class-transformer';
import * as _ from 'lodash';
import * as moment from 'moment';

export const TransformDate = (): PropertyDecorator =>
  Transform((params) => {
    if (!params.value) {
      return null;
    }
    if (!_.isDate(params.value)) {
      return moment.utc(params.value).toDate();
    }
    if (isNaN(params.value.getTime())) {
      return null;
    }
    return moment.utc(params.value).toDate();
  });
