import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { getSubscriptionById } from 'apiSdk/subscriptions';
import { Error } from 'components/error';
import { SubscriptionInterface } from 'interfaces/subscription';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';

function SubscriptionViewPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<SubscriptionInterface>(
    () => (id ? `/subscriptions/${id}` : null),
    () =>
      getSubscriptionById(id, {
        relations: ['user'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Subscription Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              Subscription Type: {data?.subscription_type}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Start Date: {data?.start_date as unknown as string}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              End Date: {data?.end_date as unknown as string}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              User: <Link href={`/users/view/${data?.user?.id}`}>{data?.user?.name}</Link>
            </Text>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'subscription',
  operation: AccessOperationEnum.READ,
})(SubscriptionViewPage);
