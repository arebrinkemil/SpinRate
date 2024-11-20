import { json, type ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import React from "react";
import { Button } from "@nextui-org/react";

import { redirectIfLoggedInLoader, setAuthOnResponse } from "~/auth/auth";
import { Label } from "~/components/input";
import { Input } from "@nextui-org/react";
import { validate } from "./validate";
import { createAccount } from "./queries";
import { TbEyeOff, TbEye } from "react-icons/tb";

import { Textarea } from "@nextui-org/input";

export const loader = redirectIfLoggedInLoader;

export const meta = () => {
  return [{ title: "Signup" }];
};

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();

  let email = String(formData.get("email") || "");
  let password = String(formData.get("password") || "");
  let username = String(formData.get("username") || "");
  let firstName = String(formData.get("firstName") || "");
  let lastName = String(formData.get("lastName") || "");
  let description = String(formData.get("description") || "");
  let profileImageUrl = String(formData.get("profileImageUrl") || "");

  let errors = await validate(email, password, username);
  if (errors) {
    return json({ ok: false, errors }, 400);
  }

  let user = await createAccount(
    email,
    password,
    username,
    firstName,
    lastName,
    description,
    profileImageUrl
  );
  return setAuthOnResponse(redirect("/home"), user.id);
}

export default function Signup() {
  let actionResult = useActionData<typeof action>();
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="mt-20 flex min-h-full flex-1 flex-col sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2
          id="signup-header"
          className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
        >
          Sign up
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-lightsilver dark:bg-darkgray px-6 py-12 sm:px-12">
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
                  actionResult?.errors?.email ? "email-error" : "signup-header"
                }
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
                    {isVisible ? <TbEye size={30} /> : <TbEyeOff size={30} />}
                  </button>
                }
                type={isVisible ? "text" : "password"}
                autoComplete="current-password"
                aria-describedby={
                  actionResult?.errors?.password ? "password-error" : undefined
                }
                radius="none"
                required
              />
            </div>

            <div>
              <Label htmlFor="username">
                Username{" "}
                {actionResult?.errors?.username && (
                  <span id="username-error" className="text-brand-red">
                    {actionResult.errors.username}
                  </span>
                )}
              </Label>
              <Input
                isClearable
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                label="Username"
                variant="bordered"
                placeholder="Enter your username"
                aria-describedby={
                  actionResult?.errors?.username ? "username-error" : undefined
                }
                radius="none"
              />
            </div>

            <div>
              <Label htmlFor="firstName">
                First Name{" "}
                {actionResult?.errors?.firstName && (
                  <span id="firstName-error" className="text-brand-red">
                    {actionResult.errors.firstName}
                  </span>
                )}
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                label="First Name"
                variant="bordered"
                placeholder="Enter your first name"
                aria-describedby={
                  actionResult?.errors?.firstName
                    ? "firstName-error"
                    : undefined
                }
                radius="none"
              />
            </div>

            <div>
              <Label htmlFor="lastName">
                Last Name{" "}
                {actionResult?.errors?.lastName && (
                  <span id="lastName-error" className="text-brand-red">
                    {actionResult.errors.lastName}
                  </span>
                )}
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                label="Last Name"
                variant="bordered"
                placeholder="Enter your last name"
                aria-describedby={
                  actionResult?.errors?.lastName ? "lastName-error" : undefined
                }
                radius="none"
              />
            </div>

            <div>
              <Label htmlFor="description">
                Description{" "}
                {actionResult?.errors?.description && (
                  <span id="description-error" className="text-brand-red">
                    {actionResult.errors.description}
                  </span>
                )}
              </Label>
              <Textarea
                id="description"
                name="description"
                label="Description"
                variant="bordered"
                placeholder="Tell us about yourself"
                rows={4}
                className="mt-1 block w-full focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                aria-describedby={
                  actionResult?.errors?.description
                    ? "description-error"
                    : undefined
                }
              />
            </div>

            <div>
              <Label htmlFor="profileImageUrl">
                Profile Image URL{" "}
                {actionResult?.errors?.profileImageUrl && (
                  <span id="profileImageUrl-error" className="text-brand-red">
                    {actionResult.errors.profileImageUrl}
                  </span>
                )}
              </Label>
              <Input
                id="profileImageUrl"
                name="profileImageUrl"
                type="url"
                autoComplete="url"
                label="Profile Image URL"
                variant="bordered"
                placeholder="Enter a URL for your profile image"
                aria-describedby={
                  actionResult?.errors?.profileImageUrl
                    ? "profileImageUrl-error"
                    : undefined
                }
                radius="none"
              />
            </div>

            <div>
              <Button className="bg-blue w-full rounded-none" type="submit">
                <p className="text-black dark:text-silver">SIGN UP</p>
              </Button>
            </div>

            <div className="text-gray text-sm">
              Already have an account?{" "}
              <Link className="underline" to="/login">
                Log in
              </Link>
              .
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
