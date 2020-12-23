import React from 'react';
import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
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
			<Flex align='center'>
				<NextLink href='/create-post'>
					<Button as={Link} mr={4}>
						Create Post
					</Button>
				</NextLink>
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
		<Flex bg='tan' p={4} position='sticky' top={0} zIndex={1} align='center'>
			<Flex maxW={800} align='center' flex={1} m='auto'>
				<NextLink href='/'>
					<Link>
						<Heading>LiReddit</Heading>
					</Link>
				</NextLink>
				<Box ml='auto'>{body}</Box>
			</Flex>
		</Flex>
	);
};

export default NavBar;
