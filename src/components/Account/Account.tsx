import React from 'react'
import DashboardLayout from '../Layout/DashboardLayout'
import UpdateInfo from './UpdateInfo'
import UpdatePassword from './UpdatePassword'

const Account = () => {
  return (
    <DashboardLayout>
        <>
        <div className="flex gap-4 mt-5 min-h-screen flex-col-2 justify-center py-12 sm:px-6 lg:px-8">
          <UpdateInfo/>
          <UpdatePassword/>
        </div>
        </>
    </DashboardLayout>

  )
}

export default Account