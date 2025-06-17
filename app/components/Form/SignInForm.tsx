'use client'

import { UserCredentials } from '@/app/types/user'
import Text from '../Text/Text'
import PrimaryInput from '../Input/PrimaryInput'
import { useForm } from 'react-hook-form'
import PrimaryButton from '../Button/PrimaryButton'
import Image from 'next/image'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useGlobalLoading } from '@/app/hooks/utils/useGlobalLoading'

const SignInForm = () => {
  const [error, setError] = useState<string>('')
  const { startLoading, stopLoading } = useGlobalLoading()

  const {
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserCredentials>({
    defaultValues: {
      username: '',
      password: '',
    },
  })

  // Watch values dynamically
  const username = watch('username')
  const password = watch('password')

  const handleLogin = async (e) => {
    e.preventDefault()
    let redirectPath: string = ''
    try {
      startLoading()
      const result = await signIn('credentials', {
        redirect: false, // Prevent automatic redirect
        username,
        password,
      })

      if (result?.error) {
        setError('Credenciais inválidas')
      } else if (result?.ok) {
        redirectPath = '/workshop-module/repair'
      }
    } catch {
      setError('Credenciais inválidas')
    } finally {
      stopLoading()
      if (redirectPath) {
        redirect(redirectPath)
      }
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center lg:gap-6 gap-4 border border-digibrown rounded-2xl px-6 py-16 bg-gray-50 w-full">
      <Image
        src={'/icons/logo.svg'}
        alt="Logo Image"
        width={600}
        height={200}
      />
      <Text
        text="Por favor, preencha todos os dados para aceder à plataforma"
        styles="text-digiblack2025-semibold text-center"
      />
      <form
        className="flex flex-col gap-10 w-full"
        onSubmit={handleLogin}
      >
        <div className="flex flex-col gap-8 w-full">
          <div className="flex flex-col gap-1 items-start w-full">
            <Text
              text="Username"
              styles="text-digiblack1624-semibold"
            />
            <PrimaryInput
              query={username}
              setQuery={(e) => setValue('username', e)}
              error={errors.username?.message || error}
              placeholder="Username"
              inputType="text"
              mandatory
            />
          </div>
          <div className="flex flex-col gap-1 items-start w-full">
            <Text
              text="Password"
              styles="text-digiblack1624-semibold"
            />
            <PrimaryInput
              query={password}
              setQuery={(e) => setValue('password', e)}
              error={errors.password?.message || error}
              placeholder="Password"
              inputType="password"
              mandatory
            />
          </div>
        </div>
        <PrimaryButton
          id="login-button"
          text="Login"
          size="large"
          type="submit"
          fullWidth
        />
      </form>
    </div>
  )
}

export default SignInForm
