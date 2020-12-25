import { Box, Heading } from '@chakra-ui/react';
import EditDeletePostButtons from '../../components/EditDeletePostButtons';
import Layout from '../../components/Layout';
import { useMeQuery } from '../../generated/graphql';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import { withApollo } from '../../utils/withApollo';

const Post = ({}) => {
	const { data: meData } = useMeQuery();
	const { data, error, loading } = useGetPostFromUrl();

	if (loading) {
		return (
			<Layout>
				<div>Loading...</div>
			</Layout>
		);
	}

	if (error) {
		return <div>{error.message}</div>;
	}

	if (!data?.post) {
		return (
			<Layout>
				<Box>Could not find post</Box>
			</Layout>
		);
	}

	return (
		<Layout>
			<Heading mb={4}>{data.post.title}</Heading>
			<Box mb={4}>{data.post.text}</Box>
			{meData?.me?.id === data.post.creator.id ? (
				<Box ml='auto'>
					<EditDeletePostButtons id={data.post.id} />
				</Box>
			) : null}
		</Layout>
	);
};

export default withApollo({ ssr: true })(Post);
