import { json, redirect, type DataFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import React from "react";

import { redirectIfLoggedInLoader, setAuthOnResponse } from "~/auth/auth";
import { Button } from "~/components/button";
import { Label } from "~/components/input";
import { Input } from "@nextui-org/react";
import { validate } from "./validate";
import { login } from "./queries";
import { EyeFilledIcon } from "~/components/EyeFilledIcon";
import { EyeSlashFilledIcon } from "~/components/EyeSlashFilledIcon";

export const loader = redirectIfLoggedInLoader;

export const meta = () => {
  return [{ title: "Trellix Login" }];
};

export async function action({ request }: DataFunctionArgs) {
  let formData = await request.formData();
  let email = String(formData.get("email") || "");
  let password = String(formData.get("password") || "");

  let errors = validate(email, password);
  if (errors) {
    return json({ ok: false, errors }, 400);
  }

  let userId = await login(email, password);
  if (userId === false) {
    return json(
      { ok: false, errors: { password: "Invalid credentials" } },
      400
    );
  }

  let response = redirect(`/profile/${userId}`);
  return setAuthOnResponse(response, userId);
}

export default function Signup() {
  let actionResult = useActionData<typeof action>();
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="mt-20 flex min-h-full flex-1 flex-col sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2
          id="login-header"
          className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
        >
          Log in
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-lightsilver dark:bg-darkgray  px-6 py-12  sm:px-12">
          <Form className="space-y-6" method="post">
            <div>
              <Label htmlFor="email">
                Email address{" "}
                {actionResult?.errors?.email && (
                  <span id="email-error" className="text-brand-red">
                    {actionResult.errors.email}
                  </span>
                )}
              </Label>

              <Input
                autoFocus
                isClearable
                id="email"
                name="email"
                autoComplete="email"
                type="email"
                label="Email"
                variant="bordered"
                placeholder="Enter your email"
                aria-describedby={
                  actionResult?.errors?.email ? "email-error" : "login-header"
                }
                onClear={() => console.log("input cleared")}
                className=""
                radius="none"
              />
            </div>

            <div>
              <Label htmlFor="password">
                Password{" "}
                {actionResult?.errors?.password && (
                  <span id="password-error" className="text-brand-red">
                    {actionResult.errors.password}
                  </span>
                )}
              </Label>

              <Input
                id="password"
                name="password"
                label="Password"
                variant="bordered"
                placeholder="Enter your password"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label="toggle password visibility"
                  >
                    {isVisible ? (
                      <EyeSlashFilledIcon className="text-default-400 pointer-events-none text-2xl" />
                    ) : (
                      <EyeFilledIcon className="text-default-400 pointer-events-none text-2xl" />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
                autoComplete="current-password"
                aria-describedby="password-error"
                radius="none"
                required
                className=""
              />
            </div>

            <div>
              <Button className="bg-blue" type="submit">
                <p className="text-black dark:text-silver">Sign in</p>
              </Button>
            </div>
            <div className="text-gray text-sm">
              Don't have an account?{" "}
              <Link className="underline" to="/signup">
                Sign up
              </Link>
              .
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
