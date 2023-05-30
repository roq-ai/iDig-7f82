import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
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
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getForumCommentById, updateForumCommentById } from 'apiSdk/forum-comments';
import { Error } from 'components/error';
import { forumCommentValidationSchema } from 'validationSchema/forum-comments';
import { ForumCommentInterface } from 'interfaces/forum-comment';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { CommunityForumInterface } from 'interfaces/community-forum';
import { UserInterface } from 'interfaces/user';
import { getCommunityForums } from 'apiSdk/community-forums';
import { getUsers } from 'apiSdk/users';

function ForumCommentEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ForumCommentInterface>(
    () => (id ? `/forum-comments/${id}` : null),
    () => getForumCommentById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ForumCommentInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateForumCommentById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ForumCommentInterface>({
    initialValues: data,
    validationSchema: forumCommentValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Forum Comment
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="content" mb="4" isInvalid={!!formik.errors?.content}>
              <FormLabel>Content</FormLabel>
              <Input type="text" name="content" value={formik.values?.content} onChange={formik.handleChange} />
              {formik.errors.content && <FormErrorMessage>{formik.errors?.content}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<CommunityForumInterface>
              formik={formik}
              name={'community_forum_id'}
              label={'Community Forum'}
              placeholder={'Select Community Forum'}
              fetcher={getCommunityForums}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record.title}
                </option>
              )}
            />
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'created_by'}
              label={'Created By'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record.name}
                </option>
              )}
            />
            <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'forum_comment',
  operation: AccessOperationEnum.UPDATE,
})(ForumCommentEditPage);
