import { FieldDescription } from "../ui/field";
import { getInputFieldError, IInputErrorState } from "@/src/lib/getInputFieldError";

interface InputFieldErrorProps {
  field: string;
  state: IInputErrorState;
}

const InputFieldError = ({ field, state }: InputFieldErrorProps) => {
  const errorMessage = getInputFieldError(field, state);
  if (errorMessage) {
    return (
      <FieldDescription className="text-red-600">
        {errorMessage}
      </FieldDescription>
    );
  }

  return null;
};

export default InputFieldError;