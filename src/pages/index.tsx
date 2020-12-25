import React, { useState } from 'react';
import { withUrqlClient } from 'next-urql';
import {
	Box,
	Button,
	Flex,
	Heading,
	Link,
	Stack,
	Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useMeQuery, usePostsQuery } from '../generated/graphql';
import Layout from '../components/Layout';
import UpdootSection from '../components/UpdootSectios';
import EditDeletePostButtons from '../components/EditDeletePostButtons';

const Index = () => {
	const [variables, setVariables] = useState({
		limit: 10,
		cursor: null as null | string,
	});
	const [{ data: meData }] = useMeQuery();
	const [{ data, error, fetching }] = usePostsQuery({
		variables,
	});
	if (!fetching && !data) {
		return <div>{error?.message}</div>;
	}
	return (
		<Layout>
			{!data && fetching ? (
				<div>Loading...</div>
			) : (
				<Stack>
					{data!.posts.posts.map((p) =>
						!p ? null : (
							<Flex key={p.id} p={5} shadow='md' borderWidth='1px'>
								<UpdootSection post={p} />
								<Box flex={1}>
									<NextLink href='/post/[id]' as={`/post/${p.id}`}>
										<Link>
											<Heading fontSize='xl'>{p.title}</Heading>
										</Link>
									</NextLink>
									<Text>Posted by: {p.creator.username}</Text>
									<Flex align='center'>
										<Text flex={1} mt={4}>
											{p.textSnippet}
										</Text>
										{meData?.me?.id === p.creator.id ? (
											<Box ml='auto'>
												<EditDeletePostButtons id={p.id} />
											</Box>
										) : null}
									</Flex>
								</Box>
							</Flex>
						),
					)}
				</Stack>
			)}
			{data && data.posts.hasMore ? (
				<Flex>
					<Button
						isLoading={fetching}
						m='auto'
						my={8}
						onClick={() => {
							setVariables({
								limit: variables.limit,
								cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
							});
						}}
					>
						Load more...
					</Button>
				</Flex>
			) : null}
		</Layout>
	);
};

// * make this page into a server side rendered page, cause this page does contains dynamic data
// * if the page contains only static content then there is no need for ssr: true
export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
