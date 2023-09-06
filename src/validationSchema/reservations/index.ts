import * as yup from 'yup';

export const reservationValidationSchema = yup.object().shape({
  reservation_date: yup.date().required(),
  status: yup.string().required(),
  number_of_guests: yup.number().integer().required(),
  event_id: yup.string().nullable().required(),
  user_id: yup.string().nullable().required(),
});
