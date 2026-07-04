export interface IInputErrorState {
  success: boolean;
  errors: {
    field: string;
    message: string;
  }[];
}

// নির্দিষ্ট ইনপুট ফিল্ডের ভ্যালিডেশন এরর মেসেজ পাওয়ার জন্য হেল্পার ফাংশন
export const getInputFieldError = (
  fieldName: string,
  state: IInputErrorState
) => {
  if (state && state.errors) {
    const error = state.errors.find((err) => err.field === fieldName);
    return error ? error.message : null;
  } else {
    return null;
  }
};
