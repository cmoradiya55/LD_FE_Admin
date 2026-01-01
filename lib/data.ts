// ENUMS

import { Over_the_Rainbow } from "next/font/google"

export enum KilometerDriven {
    ZERO_TO_10K = 1,
    TEN_TO_20K = 2,
    TWENTY_TO_30K = 3,
    THIRTY_TO_40K = 4,
    FORTY_TO_50K = 5,
    FIFTY_TO_60K = 6,
    SIXTY_TO_70K = 7,
    SEVENTY_TO_80K = 8,
    EIGHTY_TO_90K = 9,
    NINTY_TO_1LAKH = 10,
    ONE_LAKH_TO_1_2_LAKH = 11,
    ONE_2_LAKH_TO_1_5_LAKH = 12,
    ONE_5_LAKH_PLUS = 13,
}


// 1. All the possible things a user/inspector can upload
export enum MediaCategory {
    // Car Visuals
    CAR = 'car',
    IMAGE = 'image',
    DOCUMENT = 'document',

    // Sensitive Docs
    SENSITIVE_DOCUMENT = 'sensitive_document',
}

export enum OwnerType {
    FIRST = 1,
    SECOND = 2,
    THIRD = 3,
    FOURTH = 4,
}

export enum UsedCarListingStatus {
    PENDING = 100,
    INSPECTOR_ASSIGNED = 200,
    INSPECTION_STARTED = 300,
    INSPECTION_COMPLETED = 400,
    DETAILS_UPDATED_BY_STAFF = 500,
    APPROVED_BY_MANAGER = 600,
    APPROVED_BY_ADMIN = 700,
    LISTED = 800,
    SOLD = 900,
    REJECTED_BY_MANAGER = 1000,
    REJECTED_BY_ADMIN = 1100,
    REJECTED_BY_CUSTOMER = 1200,
    EXPIRED = 1300,
    CANCELLED = 1400,
}

