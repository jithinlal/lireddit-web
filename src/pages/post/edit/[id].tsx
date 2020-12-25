import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../../../components/InputField';
import Layout from '../../../components/Layout';
import Wrapper from '../../../components/Wrapper';
import {
	usePostQuery,
	useUpdatePostMutation,
} from '../../../generated/graphql';
import { useGetIntId } from '../../../utils/useGetIntId';
import { withApollo } from '../../../utils/withApollo';

const EditPost = ({}) => {
	const router = useRouter();
	const intId = useGetIntId();
	const { data, loading } = usePostQuery({
		skip: intId === -1,
		variables: {
			id: intId,
		},
	});

	const [updatePost] = useUpdatePostMutation();

	if (loading) {
		return (
			<Layout>
				<div>Loading...</div>
			</Layout>
		);
	}

	if (!data?.post) {
		return (
			<Layout>
				<Box>Could not find post</Box>
			</Layout>
		);
	}

	return (
		<Layout variant='small'>
			<Wrapper variant='small'>
				<Formik
					initialValues={{ title: data.post.title, text: data.post.text }}
					onSubmit={async (values) => {
						await updatePost({
							variables: {
								id: intId,
								...values,
							},
						});
						router.back();
					}}
				>
					{({ isSubmitting }) => (
						<Form>
							<InputField
								name='title'
								placeholder='title'
								label='Title'
								type='text'
							/>
							<Box mt={4}>
								<InputField
									textarea
									name='text'
									placeholder='text...'
									label='Body'
									type='text'
								/>
							</Box>
							<Button
								mt={4}
								type='submit'
								colorScheme='teal'
								isLoading={isSubmitting}
							>
								Update Post
							</Button>
						</Form>
					)}
				</Formik>
			</Wrapper>
		</Layout>
	);
};

export default withApollo({ ssr: false })(EditPost);
