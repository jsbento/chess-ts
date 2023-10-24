import React, { useState } from 'react'
import { useRouter } from 'next/router'
import * as Yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useDispatch } from 'react-redux'
import Cookies from 'js-cookie'
import { signIn, signUp } from '@coordinators/users'

const SignInSchema = Yup.object().shape({
  identifier: Yup.string().trim().required( 'Username or email is required' ),
  password: Yup.string().trim().required( 'Password is required' ),
})

const SignUpSchema = Yup.object().shape({
  username: Yup.string().trim().required( 'Username is required' ),
  email: Yup.string().trim().email( 'Invalid email' ).required( 'Email is required' ),
  password: Yup.string().trim().required( 'Password is required' ),
  passwordConfirm: Yup.string().trim().oneOf([ Yup.ref( 'password' ) ], 'Passwords must match' ).required( 'Password confirmation is required' ),
})

const signInValues: {
  identifier: string
  password: string
} = {
  identifier: '',
  password: '',
}

const signUpValues: {
  username: string
  email: string
  password: string
  passwordConfirm: string
} = {
  username: '',
  email: '',
  password: '',
  passwordConfirm: '',
}

const AuthForm: React.FC = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const [ isSignIn, setIsSignIn ] = useState<boolean>( true )
  const [ error, setError ] = useState<string | null>( null )

  return (
    <div className='border w-1/3 rounded-lg shadow mx-auto'>
      <Formik
        initialValues={isSignIn ? signInValues : signUpValues}
        validationSchema={isSignIn ? SignInSchema : SignUpSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={ async ( values, { setSubmitting }) => {
          setError( null )
          const authFunc = isSignIn ? signIn( values as typeof signInValues ) : signUp( values as typeof signUpValues )
          const resp = await authFunc( dispatch )
          if( resp.error ) {
            setError( resp.error )
            setSubmitting( false )
          } else {
            Cookies.set( 'token', resp.user!.token! )
            router.push( '/' )
          }
        } }
      >
        { ({ isSubmitting }) => (
          <>
            <h2 className='text-2xl font-bold text-center'>
              {isSignIn ? 'Sign In' : 'Sign Up'}
            </h2>
            <Form className='flex flex-col w-1/2 mx-auto'>
              <div className='flex flex-col'>
                <label htmlFor={ isSignIn ? 'identifier' : 'username' }>{ isSignIn ? 'Username/Email' : 'Username'}</label>
                <Field
                  type='text'
                  id={ isSignIn ? 'identifier' : 'username' }
                  name={ isSignIn ? 'identifier' : 'username' }
                  className='border rounded-md'
                />
                <ErrorMessage
                  name={ isSignIn ? 'identifier' : 'username' }
                  render={ msg => <FormError message={msg} /> }
                />
              </div>
              { !isSignIn && (
                <div className='flex flex-col'>
                  <label htmlFor='email'>Email</label>
                  <Field
                    type='email'
                    id='email'
                    name='email'
                    className='border rounded-md'
                  />
                  <ErrorMessage
                    name='email'
                    render={ msg => <FormError message={msg} /> }
                  />
                </div>
              ) }
              <div className='flex flex-col'>
                <label htmlFor='password'>Password</label>
                <Field
                  type='password'
                  id='password'
                  name='password'
                  className='border rounded-md'
                />
                <ErrorMessage
                  name='password'
                  render={ msg => <FormError message={msg} /> }
                />
              </div>
              { !isSignIn && (
                <div className='flex flex-col'>
                  <label htmlFor='passwordConfirm'>Confirm Password</label>
                  <Field
                    type='password'
                    id='passwordConfirm'
                    name='passwordConfirm'
                    className='border rounded-md'
                  />
                  <ErrorMessage
                    name='passwordConfirm'
                    render={ msg => <FormError message={msg} /> }
                  />
                </div>
              ) }
              <button
                type='submit'
                className='bg-gray-300 text-black font-bold py-2 px-4 rounded my-4'
                disabled={isSubmitting}
              >
                {isSignIn ? 'Sign In' : 'Sign Up'}
              </button>
              <p className='my-4'>
                { isSignIn ? 'Don\'t have an account?' : 'Already have an account?' }
                <button
                  type='button'
                  className='text-blue-500 font-semibold ml-3'
                  onClick={() => setIsSignIn( !isSignIn )}
                >
                  { isSignIn ? 'Sign Up' : 'Sign In' }
                </button>
              </p>
              { error && (
                <div className='text-red-500 font-semibold text-sm my-4'>
                  { error }
                </div>
              ) }
              { isSubmitting && (
                <div className='animate-pulse font-semibold text-lg my-4'>
                  Loading...
                </div>
              ) }
            </Form>
          </>
        ) }
      </Formik>
    </div>
  )
}

interface FormErrorProps {
  message: string
}

const FormError: React.FC<FormErrorProps> = ({ message }) => (
  <div className='text-red-500 font-semibold text-sm'>{ message }</div>
)


export default AuthForm