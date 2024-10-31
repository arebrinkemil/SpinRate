import { json, type ActionFunctionArgs, redirect } from '@remix-run/node'
import { Form, Link, useActionData } from '@remix-run/react'
import React from 'react'

import { redirectIfLoggedInLoader, setAuthOnResponse } from '~/auth/auth'
import { Label } from '~/components/input'
import { Button } from '~/components/button'
import { Input } from '@nextui-org/react'
import { validate } from './validate'
import { createAccount } from './queries'
import { EyeFilledIcon } from '~/components/EyeFilledIcon'
import { EyeSlashFilledIcon } from '~/components/EyeSlashFilledIcon'
import { Textarea } from '@nextui-org/input'

export const loader = redirectIfLoggedInLoader

export const meta = () => {
  return [{ title: 'Signup' }]
}

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData()

  let email = String(formData.get('email') || '')
  let password = String(formData.get('password') || '')
  let username = String(formData.get('username') || '')
  let firstName = String(formData.get('firstName') || '')
  let lastName = String(formData.get('lastName') || '')
  let description = String(formData.get('description') || '')
  let profileImageUrl = String(formData.get('profileImageUrl') || '')

  let errors = await validate(email, password, username)
  if (errors) {
    return json({ ok: false, errors }, 400)
  }

  let user = await createAccount(
    email,
    password,
    username,
    firstName,
    lastName,
    description,
    profileImageUrl,
  )
  return setAuthOnResponse(redirect('/home'), user.id)
}

export default function Signup() {
  let actionResult = useActionData<typeof action>()
  const [isVisible, setIsVisible] = React.useState(false)

  const toggleVisibility = () => setIsVisible(!isVisible)

  return (
    <div className='mt-20 flex min-h-full flex-1 flex-col sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2
          id='signup-header'
          className='mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'
        >
          Sign up
        </h2>
      </div>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]'>
        <div className='bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12'>
          <Form className='space-y-6' method='post'>
            <div>
              <Label htmlFor='email'>
                Email address{' '}
                {actionResult?.errors?.email && (
                  <span id='email-error' className='text-brand-red'>
                    {actionResult.errors.email}
                  </span>
                )}
              </Label>

              <Input
                autoFocus
                isClearable
                id='email'
                name='email'
                autoComplete='email'
                type='email'
                label='Email'
                variant='bordered'
                placeholder='Enter your email'
                aria-describedby={
                  actionResult?.errors?.email ? 'email-error' : 'signup-header'
                }
                required
                radius='none'
              />
            </div>

            <div>
              <Label htmlFor='password'>
                Password{' '}
                {actionResult?.errors?.password && (
                  <span id='password-error' className='text-brand-red'>
                    {actionResult.errors.password}
                  </span>
                )}
              </Label>

              <Input
                id='password'
                name='password'
                label='Password'
                variant='bordered'
                placeholder='Enter your password'
                endContent={
                  <button
                    className='focus:outline-none'
                    type='button'
                    onClick={toggleVisibility}
                    aria-label='toggle password visibility'
                  >
                    {isVisible ? (
                      <EyeSlashFilledIcon className='text-default-400 pointer-events-none text-2xl' />
                    ) : (
                      <EyeFilledIcon className='text-default-400 pointer-events-none text-2xl' />
                    )}
                  </button>
                }
                type={isVisible ? 'text' : 'password'}
                autoComplete='current-password'
                aria-describedby={
                  actionResult?.errors?.password ? 'password-error' : undefined
                }
                radius='none'
                required
                className=''
              />
            </div>

            <div>
              <Label htmlFor='username'>
                Username{' '}
                {actionResult?.errors?.username && (
                  <span id='username-error' className='text-brand-red'>
                    {actionResult.errors.username}
                  </span>
                )}
              </Label>

              <Input
                autoFocus
                isClearable
                id='username'
                name='username'
                type='text'
                autoComplete='username'
                label='Username'
                variant='bordered'
                aria-describedby={
                  actionResult?.errors?.username ? 'username-error' : undefined
                }
                required
                onClear={() => console.log('input cleared')}
                className=''
                radius='none'
              />
            </div>

            <div>
              <Label htmlFor='firstName'>
                First Name{' '}
                {actionResult?.errors?.firstName && (
                  <span id='firstName-error' className='text-brand-red'>
                    {actionResult.errors.firstName}
                  </span>
                )}
              </Label>
              <Input
                id='firstName'
                name='firstName'
                radius='none'
                label='First Name'
                type='text'
                variant='bordered'
                autoComplete='given-name'
                aria-describedby={
                  actionResult?.errors?.firstName
                    ? 'firstName-error'
                    : undefined
                }
              />
            </div>

            <div>
              <Label htmlFor='lastName'>
                Last Name{' '}
                {actionResult?.errors?.lastName && (
                  <span id='lastName-error' className='text-brand-red'>
                    {actionResult.errors.lastName}
                  </span>
                )}
              </Label>
              <Input
                id='lastName'
                name='lastName'
                type='text'
                radius='none'
                variant='bordered'
                label='Last Name'
                autoComplete='family-name'
                aria-describedby={
                  actionResult?.errors?.lastName ? 'lastName-error' : undefined
                }
              />
            </div>

            <div>
              <Label htmlFor='description'>
                Description{' '}
                {actionResult?.errors?.description && (
                  <span id='description-error' className='text-brand-red'>
                    {actionResult.errors.description}
                  </span>
                )}
              </Label>
              <Textarea
                id='description'
                name='description'
                radius='none'
                label='Description'
                variant='bordered'
                rows={4}
                className=' mt-1 block w-full  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                aria-describedby={
                  actionResult?.errors?.description
                    ? 'description-error'
                    : undefined
                }
              />
            </div>

            <div>
              <Label htmlFor='profileImageUrl'>
                Profile Image URL{' '}
                {actionResult?.errors?.profileImageUrl && (
                  <span id='profileImageUrl-error' className='text-brand-red'>
                    {actionResult.errors.profileImageUrl}
                  </span>
                )}
              </Label>

              <Input
                id='profileImageUrl'
                name='profileImageUrl'
                type='text'
                radius='none'
                variant='bordered'
                label='Profile Image URL'
                autoComplete='url'
                aria-describedby={
                  actionResult?.errors?.profileImageUrl
                    ? 'profileImageUrl-error'
                    : undefined
                }
              />
            </div>

            <Button type='submit'>Sign up</Button>

            <div className='text-gray text-sm'>
              Already have an account?{' '}
              <Link className='underline' to='/login'>
                Log in
              </Link>
              .
            </div>
          </Form>
        </div>
        <div className='mx-2 mt-8 space-y-2'>
          <h3 className='font-bold text-black'>Privacy Notice</h3>
          <p>
            We won't use your email address for anything other than
            authenticating with this demo application. This app doesn't send
            email anyway, so you can put whatever fake email address you want.
          </p>
          <h3 className='font-bold text-black'>Terms of Service</h3>
          <p>
            This is a demo app, there are no terms of service. Don't be
            surprised if your data disappears.
          </p>
        </div>
      </div>
    </div>
  )
}
