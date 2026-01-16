import React from 'react'
import { Metadata } from 'next'
import StaffInspectionForm from '../../../components/StaffInspectionForm/staffInspectionForm'

export const metadata: Metadata = {
    title: 'Inspection Form - Staff',
    description: 'Staff Inspection Form',
}

const StaffInspectionPage = () => {
    return (
        <StaffInspectionForm />
    )
}

export default StaffInspectionPage;