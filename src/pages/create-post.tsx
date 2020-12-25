import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../components/InputField';
import Layout from '../components/Layout';
import Wrapper from '../components/Wrapper';
import { useCreatePostMutation } from '../generated/graphql';
import { useIsAuth } from '../utils/useIsAuth';
import { withApollo } from '../utils/withApollo';

const CreatePost: React.FC<{}> = ({}) => {
	useIsAuth();
	const [createPost] = useCreatePostMutation();
	const router = useRouter();

	return (
		<Layout variant='small'>
			<Wrapper variant='small'>
				<Formik
					initialValues={{ title: '', text: '' }}
					onSubmit={async (values) => {
						const { errors } = await createPost({
							variables: { input: values },
							update: (cache) => {
								cache.evict({
									fieldName: 'posts',
								});
							},
						});
						if (!errors) {
							router.push('/');
						}
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
								Create Post
							</Button>
						</Form>
					)}
				</Formik>
			</Wrapper>
		</Layout>
	);
};

export default withApollo({ ssr: false })(CreatePost);
