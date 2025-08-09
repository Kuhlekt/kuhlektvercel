import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Image from 'next/image';

const LoginForm: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = (data: any) => {
    // Handle login logic here
    console.log(data);
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <Image src="/images/kuhlekt-logo.png" alt="Kuhlekt Logo" width={100} height={100} />
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register('password')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
