import * as yup from 'yup';

export const performanceAssessmentValidationSchema = yup.object().shape({
  assessment_date: yup.date().required(),
  rating: yup.number().integer().required(),
  comment: yup.string().required(),
  organizer_id: yup.string().nullable().required(),
  event_id: yup.string().nullable().required(),
});
