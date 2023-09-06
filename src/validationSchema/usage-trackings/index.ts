import * as yup from 'yup';

export const usageTrackingValidationSchema = yup.object().shape({
  usage_date: yup.date().required(),
  usage_time: yup.date().required(),
  usage_duration: yup.number().integer().required(),
  event_id: yup.string().nullable().required(),
  user_id: yup.string().nullable().required(),
});
