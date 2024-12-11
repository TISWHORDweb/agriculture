
import React from 'react'

const UpdateInfo = () => {
  return (
    <div className='bg-white border rounded shadow-md  p-4'>
      <h3 className='text-2xl font-bold'>UPDATE INFO</h3>
    
    <form className='space-y-4'>
    <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          // {...register('email')}
          type="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 h-10 py-2 px-2 text-base max-w-md"
        />
      </div>
    </form>
  </div>
  )
}

export default UpdateInfo
