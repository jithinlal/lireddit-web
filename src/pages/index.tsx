import React from 'react';
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
import { useMeQuery, usePostsQuery } from '../generated/graphql';
import Layout from '../components/Layout';
import UpdootSection from '../components/UpdootSection';
import EditDeletePostButtons from '../components/EditDeletePostButtons';
import { withApollo } from '../utils/withApollo';

const Index = () => {
	const { data: meData } = useMeQuery();
	const { data, error, loading, fetchMore, variables } = usePostsQuery({
		variables: {
			limit: 10,
			cursor: null,
		},
		notifyOnNetworkStatusChange: true,
	});
	if (!loading && !data) {
		return <div>{error?.message}</div>;
	}
	return (
		<Layout>
			{!data && loading ? (
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
						isLoading={loading}
						m='auto'
						my={8}
						onClick={() => {
							fetchMore({
								variables: {
									limit: variables?.limit,
									cursor:
										data.posts.posts[data.posts.posts.length - 1].createdAt,
								},
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

export default withApollo({ ssr: true })(Index);
