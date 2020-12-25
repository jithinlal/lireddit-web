import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

const ForgotPassword: React.FC<{}> = ({}) => {
	const [complate, setComplate] = useState(false);
	const [forgotPassword] = useForgotPasswordMutation();
	return (
		<Wrapper variant='small'>
			<Formik
				initialValues={{ email: '' }}
				onSubmit={async (values) => {
					await forgotPassword({ variables: values });
					setComplate(true);
				}}
			>
				{({ isSubmitting }) =>
					complate ? (
						<Box>please check your email...</Box>
					) : (
						<Form>
							<InputField
								name='email'
								placeholder='email'
								label='Email'
								type='text'
							/>
							<Button
								mt={4}
								type='submit'
								colorScheme='teal'
								isLoading={isSubmitting}
							>
								Reset password
							</Button>
						</Form>
					)
				}
			</Formik>
		</Wrapper>
	);
};

export default withApollo({ ssr: false })(ForgotPassword);
