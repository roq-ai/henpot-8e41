import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
  Center,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState, useRef } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { getReservationById, updateReservationById } from 'apiSdk/reservations';
import { reservationValidationSchema } from 'validationSchema/reservations';
import { ReservationInterface } from 'interfaces/reservation';
import { EventInterface } from 'interfaces/event';
import { UserInterface } from 'interfaces/user';
import { getEvents } from 'apiSdk/events';
import { getUsers } from 'apiSdk/users';

function ReservationEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<ReservationInterface>(
    () => (id ? `/reservations/${id}` : null),
    () => getReservationById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ReservationInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateReservationById(id, values);
      mutate(updated);
      resetForm();
      router.push('/reservations');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<ReservationInterface>({
    initialValues: data,
    validationSchema: reservationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Reservations',
              link: '/reservations',
            },
            {
              label: 'Update Reservation',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Reservation
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="reservation_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Reservation Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.reservation_date ? new Date(formik.values?.reservation_date) : null}
              onChange={(value: Date) => formik.setFieldValue('reservation_date', value)}
            />
          </FormControl>

          <TextInput
            error={formik.errors.status}
            label={'Status'}
            props={{
              name: 'status',
              placeholder: 'Status',
              value: formik.values?.status,
              onChange: formik.handleChange,
            }}
          />

          <NumberInput
            label="Number Of Guests"
            formControlProps={{
              id: 'number_of_guests',
              isInvalid: !!formik.errors?.number_of_guests,
            }}
            name="number_of_guests"
            error={formik.errors?.number_of_guests}
            value={formik.values?.number_of_guests}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('number_of_guests', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<EventInterface>
            formik={formik}
            name={'event_id'}
            label={'Select Event'}
            placeholder={'Select Event'}
            fetcher={getEvents}
            labelField={'name'}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            labelField={'email'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/reservations')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'reservation',
    operation: AccessOperationEnum.UPDATE,
  }),
)(ReservationEditPage);
