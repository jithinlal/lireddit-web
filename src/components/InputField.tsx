import React from 'react';
import { useField } from 'formik';
import {
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Textarea,
} from '@chakra-ui/react';

type inputFieldProps = React.ClassAttributes<HTMLInputElement> & {
	name: string;
	label: string;
	placeholder: string;
	type: string;
	textarea?: boolean;
};

const InputField: React.FC<inputFieldProps> = (props) => {
	const [field, { error }] = useField(props);
	let InputOrTextArea: any = Input;
	if (props.textarea) {
		InputOrTextArea = Textarea;
	}
	return (
		<FormControl isInvalid={!!error}>
			<FormLabel htmlFor={field.name}>{props.label}</FormLabel>
			<InputOrTextArea
				{...field}
				id={field.name}
				placeholder={props.placeholder}
				type={props.type}
			/>
			{error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
		</FormControl>
	);
};

export default InputField;
