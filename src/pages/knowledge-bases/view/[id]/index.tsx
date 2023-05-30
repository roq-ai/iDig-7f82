import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { getKnowledgeBaseById } from 'apiSdk/knowledge-bases';
import { Error } from 'components/error';
import { KnowledgeBaseInterface } from 'interfaces/knowledge-base';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';

function KnowledgeBaseViewPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<KnowledgeBaseInterface>(
    () => (id ? `/knowledge-bases/${id}` : null),
    () =>
      getKnowledgeBaseById(id, {
        relations: ['user'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Knowledge Base Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              Title: {data?.title}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Content: {data?.content}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Created At: {data?.created_at as unknown as string}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Created By: <Link href={`/users/view/${data?.user?.id}`}>{data?.user?.name}</Link>
            </Text>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'knowledge_base',
  operation: AccessOperationEnum.READ,
})(KnowledgeBaseViewPage);
