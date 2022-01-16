import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';

export default dayjs
  .extend(customParseFormat)
  .extend(utc)
  .extend(timezone)
  .extend(weekOfYear);
