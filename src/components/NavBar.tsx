import React from 'react';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface navBarProps {}

const NavBar: React.FC<navBarProps> = ({}) => {
	const [{ data, fetching }] = useMeQuery({
		pause: isServer(),
	});
	const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
	let body = null;
	if (fetching) {
		body = null;
	} else if (!data?.me) {
		body = (
			<>
				<NextLink href='/login'>
					<Link color='white' mr={2}>
						Login
					</Link>
				</NextLink>
				<NextLink href='/register'>
					<Link color='white'>Register</Link>
				</NextLink>
			</>
		);
	} else {
		body = (
			<Flex>
				<Box mr={2}>{data?.me?.username}</Box>
				<Button
					type='button'
					variant='link'
					onClick={() => logout()}
					isLoading={logoutFetching}
				>
					Logout
				</Button>
			</Flex>
		);
	}
	return (
		<Flex bg='tan' p={4} position='sticky' top={0} zIndex={1}>
			<Box ml='auto'>{body}</Box>
		</Flex>
	);
};

export default NavBar;
