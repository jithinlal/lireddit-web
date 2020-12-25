import React from 'react';
import { Box, IconButton, Link } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useDeletePostMutation } from '../generated/graphql';

interface EditDeletePostButtonsProps {
	id: number;
}

const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
	id,
}) => {
	const [, deletePost] = useDeletePostMutation();
	return (
		<Box>
			<NextLink href='/post/edit/id' as={`/post/edit/${id}`}>
				<IconButton
					as={Link}
					ml='auto'
					mr={4}
					colorScheme='blue'
					aria-label='edit post'
					icon={<EditIcon />}
				/>
			</NextLink>
			<IconButton
				ml='auto'
				colorScheme='red'
				aria-label='delete post'
				icon={<DeleteIcon />}
				onClick={() => {
					deletePost({ id });
				}}
			/>
		</Box>
	);
};

export default EditDeletePostButtons;
