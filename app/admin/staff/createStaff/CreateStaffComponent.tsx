'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button/Button';
import TextInput from '@/components/FormComponent/TextInput';
import SelectInput from '@/components/FormComponent/SelectInput';
import MobileInput from '@/components/FormComponent/MobileInput';
import DateInput from '@/components/FormComponent/DateInput';
import { User2, Briefcase, Mail, ShieldCheck, ToggleRight, ArrowLeft } from 'lucide-react';

type CreateStaffFormValues = {
    fullName: string;
    email: string;
    role: string;
    mobile: string;
    joiningDate: string;
    status: 'active' | 'inactive';
};

const roleOptions = [
    { value: 'sales_manager', label: 'Sales Manager' },
    { value: 'support_lead', label: 'Customer Relationship Officer' },
    { value: 'admin', label: 'Admin Inspector' },
];

const CreateStaffComponent = () => {
    const router = useRouter();
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateStaffFormValues>({
        defaultValues: {
            fullName: '',
            email: '',
            role: '',
            mobile: '',
            joiningDate: '',
            status: 'active',
        },
    });

    const onSubmit = (data: CreateStaffFormValues) => {
        console.log('Create staff data:', data);
    };

    const handleCancel: () => void = () => {
        router.push('/staff');
    };

    return (
        <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
            {/* Page header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                        className="rounded-full px-4 text-xs font-semibold"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        Team
                    </p>
                    <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                        Create New Staff
                    </h1>
                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                        Add a new team member with basic profile and access status.
                    </p>
                </div>
            </div>

            {/* Form card */}
            <div className="overflow-hidden rounded-2xl border bg-white/80 shadow-sm backdrop-blur-sm">
                <div className="border-b px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex items-center gap-2 text-xs text-gray-600 sm:text-sm">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span>Staff details will be used for login & communication.</span>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 px-4 py-4 sm:space-y-6 sm:px-6 sm:py-6"
                >
                    {/* Basic info */}
                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                        <TextInput
                            name="fullName"
                            control={control}
                            label="Full Name"
                            placeholder="Enter staff full name"
                            required
                            error={errors.fullName}
                            icon={<User2 className="h-4 w-4" />}
                        />

                        <TextInput
                            name="email"
                            control={control}
                            label="Email"
                            type="email"
                            placeholder="name@example.com"
                            required
                            error={errors.email}
                            icon={<Mail className="h-4 w-4" />}
                        />
                    </div>

                    {/* Contact & role */}
                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                        <MobileInput
                            name="mobile"
                            control={control}
                            label="Mobile Number"
                            required
                            error={errors.mobile}
                        />

                        <SelectInput
                            name="role"
                            control={control}
                            label="Role"
                            options={roleOptions}
                            placeholder="Select role"
                            required
                            error={errors.role}
                            icon={<Briefcase className="h-4 w-4" />}
                        />
                    </div>

                    {/* Joining & status */}
                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                        <DateInput
                            name="joiningDate"
                            control={control}
                            label="Joining Date"
                            required
                            error={errors.joiningDate}
                        />

                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            className="h-9 rounded-full px-4 text-xs font-semibold sm:h-9 sm:px-5"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-9 rounded-full px-5 text-xs font-semibold sm:h-9 sm:px-6"
                        >
                            {isSubmitting ? 'Saving...' : 'Create Staff'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateStaffComponent;