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
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

import { createUsageTracking } from 'apiSdk/usage-trackings';
import { usageTrackingValidationSchema } from 'validationSchema/usage-trackings';
import { EventInterface } from 'interfaces/event';
import { UserInterface } from 'interfaces/user';
import { getEvents } from 'apiSdk/events';
import { getUsers } from 'apiSdk/users';
import { UsageTrackingInterface } from 'interfaces/usage-tracking';

function UsageTrackingCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: UsageTrackingInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createUsageTracking(values);
      resetForm();
      router.push('/usage-trackings');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<UsageTrackingInterface>({
    initialValues: {
      usage_date: new Date(new Date().toDateString()),
      usage_time: new Date(new Date().toDateString()),
      usage_duration: 0,
      event_id: (router.query.event_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: usageTrackingValidationSchema,
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
              label: 'Usage Trackings',
              link: '/usage-trackings',
            },
            {
              label: 'Create Usage Tracking',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Usage Tracking
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="usage_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Usage Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.usage_date ? new Date(formik.values?.usage_date) : null}
              onChange={(value: Date) => formik.setFieldValue('usage_date', value)}
            />
          </FormControl>
          <FormControl id="usage_time" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Usage Time
            </FormLabel>
            <DatePicker
              selected={formik.values?.usage_time ? new Date(formik.values?.usage_time) : null}
              onChange={(value: Date) => formik.setFieldValue('usage_time', value)}
            />
          </FormControl>

          <NumberInput
            label="Usage Duration"
            formControlProps={{
              id: 'usage_duration',
              isInvalid: !!formik.errors?.usage_duration,
            }}
            name="usage_duration"
            error={formik.errors?.usage_duration}
            value={formik.values?.usage_duration}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('usage_duration', Number.isNaN(valueNumber) ? 0 : valueNumber)
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
              onClick={() => router.push('/usage-trackings')}
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
    entity: 'usage_tracking',
    operation: AccessOperationEnum.CREATE,
  }),
)(UsageTrackingCreatePage);
