/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useActionState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/src/components/ui/field";
import { loginUser } from "../services/auth/loginUser";
import toast from "react-hot-toast";


const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(loginUser, null);

    // এরর পর্যবেক্ষণ করে টোস্ট দেখানোর জন্য

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);



  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "";

  const getFieldError = (fieldName: string) => {
    if (state && state.errors) {
      const error = state.errors.find((err: any) => err.field === fieldName);
      return error && error.message;
    } else {
      return null;
    }
  };
  console.log(state)
  return (
    <form action={formAction}>
      <input type="hidden" name="redirect" value={redirectUrl} />
      <FieldGroup>
        <div className="grid grid-cols-1 gap-4">
          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
            {getFieldError("email") && (
              <p className="text-red-500 text-sm">{getFieldError("email")}</p>
            )}
          </Field>

          {/* Password */}
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
            //   required
            />

            {getFieldError("password") && (
              <FieldDescription className="text-red-600">
                {getFieldError("password")}
              </FieldDescription>
            )}

          </Field>
        </div>
        <FieldGroup className="mt-4">
          <Field>
            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-none"
            > 
              {isPending ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <FieldDescription className="px-6 text-center">
              Don&apos;t have an account?{" "}
              <a href="/register" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </FieldDescription>
            <FieldDescription className="px-6 text-center">
              <a
                href="/forget-password"
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
};

export default LoginForm;