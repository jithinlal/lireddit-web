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
import { usePostsQuery } from '../generated/graphql';
import Layout from '../components/Layout';

const Index = () => {
	const [variables, setVariables] = useState({
		limit: 10,
		cursor: null as null | string,
	});
	const [{ data, fetching }] = usePostsQuery({
		variables,
	});
	if (!fetching && !data) {
		return <div>You have no posts...</div>;
	}
	return (
		<Layout>
			<Flex align='center'>
				<Heading>LiReddit</Heading>
				<NextLink href='/create-post'>
					<Link ml='auto'>Create Post</Link>
				</NextLink>
			</Flex>

			{!data && fetching ? (
				<div>Loading...</div>
			) : (
				<Stack>
					{data!.posts.map((p) => (
						<Box key={p.id} p={5} shadow='md' borderWidth='1px'>
							<Heading fontSize='xl'>{p.title}</Heading>
							<Text mt={4}>{p.textSnippet}</Text>
						</Box>
					))}
				</Stack>
			)}
			{data ? (
				<Flex>
					<Button
						isLoading={fetching}
						m='auto'
						my={8}
						onClick={() => {
							setVariables({
								limit: variables.limit,
								cursor: data.posts[data.posts.length - 1].createdAt,
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
