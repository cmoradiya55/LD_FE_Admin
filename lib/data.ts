// ENUMS

// Kilometer Driven Enum
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

// Owner Type Enum
export enum OwnerType {
    FIRST = 1,
    SECOND = 2,
    THIRD = 3,
    FOURTH = 4,
}

// Used Car Listing Status Enum
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

// Inspection Image Types
export const InspectionImageType = {
    EXTERIOR: 1,
    TYRES: 2,
    ENGINE_AND_TRANSMISSION: 3,
    STEERING_SUSPENSION_AND_BRAKES: 4,
    AIR_CONDITIONING: 5,
    ELECTRICAL: 6,
    INTERIOR: 7,
    SEATS: 8,
    OTHER: 9,
} as const;

export const InspectionImageSubType = {
    [InspectionImageType.EXTERIOR]: {
        ROOF: 1,
        BONNET: 2,

        PILLAR_LHS_A: 3,
        PILLAR_LHS_B: 4,
        PILLAR_LHS_C: 5,

        PILLAR_RHS_A: 6,
        PILLAR_RHS_B: 7,
        PILLAR_RHS_C: 8,

        UPPER_CROSS_MEMBER: 9,
        LOWER_CROSS_MEMBER: 10,

        RADIATOR_SUPPORT: 11,
        HEADLIGHT_SUPPORT: 12,

        BOOT_DOOR: 13,

        FIREWALL: 14,

        QUARTER_PANEL_LHS: 15,
        QUARTER_PANEL_RHS: 16,

        FENDER_LHS: 17,
        FENDER_RHS: 18,

        APRON_LHS: 19,
        APRON_RHS: 20,

        APRON_LHS_LEG: 21,
        APRON_RHS_LEG: 22,

        COWL_TOP: 24,

        RUNNING_BOARDER_LHS: 25,
        RUNNING_BOARDER_RHS: 26,

        DOOR_LHS_FRONT: 27,
        DOOR_LHS_REAR: 28,
        DOOR_RHS_FRONT: 29,
        DOOR_RHS_REAR: 30,

        WINDSHIELD_FRONT: 31,
        WINDSHIELD_REAR: 32,

        LIGHT_LHS_HEADLIGHT: 33,
        LIGHT_RHS_HEADLIGHT: 34,
        LIGHT_LHS_TAILLIGHT: 35,
        LIGHT_RHS_TAILLIGHT: 36,

        BUMPER_FRONT: 37,
        BUMPER_REAR: 38,

        ORVM_LHS: 39,
        ORVM_RHS: 40,

        LEFT_FRONT: 41,
        FRONT: 42,
        LEFT_SIDE: 43,

        LEFT_BACK: 44,
        BACK: 45,

        RIGHT_BACK: 46,
        RIGHT_SIDE: 47,
        RIGHT_FRONT: 48,
    },

    [InspectionImageType.TYRES]: {
        FRONT_LEFT: 1,
        FRONT_RIGHT: 2,
        REAR_LEFT: 3,
        REAR_RIGHT: 4,
        SPARE_TYRE: 5,
    },

    [InspectionImageType.ENGINE_AND_TRANSMISSION]: {
        EXHAUST_SMOKE: 1,

        ENGINE: 2,
        ENGINE_SOUND: 3,
        ENGINE_MOUNTING: 4,
        CLUTCH: 5,
        GEAR_SHIFTING: 6,

        ENGINE_OIL_LEVEL_DIPSTICK: 7,
        ENGINE_OIL: 8,

        BATTERY: 9,
        COOLANT: 10,
        SUMP: 11,
    },

    [InspectionImageType.STEERING_SUSPENSION_AND_BRAKES]: {
        STEERING: 1,
        SUSPENSION: 2,
        BRAKES: 3,
    },

    [InspectionImageType.AIR_CONDITIONING]: {
        AC_COOLING: 1,
        CLIMATE_CONTROL_AC: 2,
        HEATER: 3,
    },

    [InspectionImageType.ELECTRICAL]: {
        LHS_FRONT_WINDOW: 1,
        LHS_REAR_WINDOW: 2,
        RHS_FRONT_WINDOW: 3,
        RHS_REAR_WINDOW: 4,

        REAR_DEFOGGER: 5,
        AIRBAG_FEATURE_DRIVER_SIDE: 6,
        STEERING_MOUNTED_AUDIO_CONTROL: 7,

        MUSIC_SYSTEM: 8,
        ELECTRICAL: 10,

        PARKING_SENSOR: 11,
        INTERIOR: 12,
    },

    [InspectionImageType.INTERIOR]: {
        DASHBOARD: 1,
        ODOMETER: 2,

        FRONT_SEAT_SIDE: 3,
        REAR_SEAT_SIDE: 4,
        BOOT_SPACE: 5,
    },

    [InspectionImageType.SEATS]: {
        LEATHER_SEATS: 1,
    }
} as const;

export const IMAGE_TYPE_NAMES: Record<typeof InspectionImageType[keyof typeof InspectionImageType], string> = {
    [InspectionImageType.EXTERIOR]: 'Exterior',
    [InspectionImageType.TYRES]: 'Tyres',

    [InspectionImageType.ENGINE_AND_TRANSMISSION]: 'Engine & Transmission',

    [InspectionImageType.STEERING_SUSPENSION_AND_BRAKES]: 'Steering, Suspension & Brakes',
    [InspectionImageType.AIR_CONDITIONING]: 'Air Conditioning',
    [InspectionImageType.ELECTRICAL]: 'Electrical',
    [InspectionImageType.INTERIOR]: 'Interior',
    [InspectionImageType.SEATS]: 'Seats',

    [InspectionImageType.OTHER]: 'Other',
};

export const IMAGE_SUBTYPE_NAMES = {
    [InspectionImageType.EXTERIOR]: {
        [InspectionImageSubType[InspectionImageType.EXTERIOR].ROOF]: 'Roof',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].BONNET]: 'Bonnet',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_LHS_A]: 'Pillar LHS A',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_LHS_B]: 'Pillar LHS B',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_LHS_C]: 'Pillar LHS C',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_RHS_A]: 'Pillar RHS A',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_RHS_B]: 'Pillar RHS B',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_RHS_C]: 'Pillar RHS C',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].UPPER_CROSS_MEMBER]: 'Upper Cross Member',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].LOWER_CROSS_MEMBER]: 'Lower Cross Member',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].RADIATOR_SUPPORT]: 'Radiator Support',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].HEADLIGHT_SUPPORT]: 'Headlight Support',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].BOOT_DOOR]: 'Boot Door',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].QUARTER_PANEL_LHS]: 'Quarter Panel LHS',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].QUARTER_PANEL_RHS]: 'Quarter Panel RHS',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].FENDER_LHS]: 'Fender LHS',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].FENDER_RHS]: 'Fender RHS',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].APRON_LHS]: 'Apron LHS',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].APRON_RHS]: 'Apron RHS',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].APRON_LHS_LEG]: 'Apron LHS Leg',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].APRON_RHS_LEG]: 'Apron RHS Leg',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].FIREWALL]: 'Firewall',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].COWL_TOP]: 'Cowl Top',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].RUNNING_BOARDER_LHS]: 'Running Board LHS',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].RUNNING_BOARDER_RHS]: 'Running Board RHS',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].DOOR_LHS_FRONT]: 'Door LHS Front',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].DOOR_LHS_REAR]: 'Door LHS Rear',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].DOOR_RHS_FRONT]: 'Door RHS Front',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].DOOR_RHS_REAR]: 'Door RHS Rear',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].WINDSHIELD_FRONT]: 'Front Windshield',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].WINDSHIELD_REAR]: 'Rear Windshield',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].LIGHT_LHS_HEADLIGHT]: 'Left Headlight',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].LIGHT_RHS_HEADLIGHT]: 'Right Headlight',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].LIGHT_LHS_TAILLIGHT]: 'Left Taillight',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].LIGHT_RHS_TAILLIGHT]: 'Right Taillight',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].BUMPER_FRONT]: 'Front Bumper',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].BUMPER_REAR]: 'Rear Bumper',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].ORVM_LHS]: 'ORVM LHS',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].ORVM_RHS]: 'ORVM RHS',

        [InspectionImageSubType[InspectionImageType.EXTERIOR].LEFT_FRONT]: 'Left Front',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].FRONT]: 'Front',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].LEFT_SIDE]: 'Left Side',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].LEFT_BACK]: 'Left Back',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].BACK]: 'Back',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].RIGHT_BACK]: 'Right Back',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].RIGHT_SIDE]: 'Right Side',
        [InspectionImageSubType[InspectionImageType.EXTERIOR].RIGHT_FRONT]: 'Right Front',
    },

    [InspectionImageType.TYRES]: {
        [InspectionImageSubType[InspectionImageType.TYRES].FRONT_LEFT]: 'Front Left Tyre',
        [InspectionImageSubType[InspectionImageType.TYRES].FRONT_RIGHT]: 'Front Right Tyre',
        [InspectionImageSubType[InspectionImageType.TYRES].REAR_LEFT]: 'Rear Left Tyre',
        [InspectionImageSubType[InspectionImageType.TYRES].REAR_RIGHT]: 'Rear Right Tyre',
        [InspectionImageSubType[InspectionImageType.TYRES].SPARE_TYRE]: 'Spare Tyre',
    },

    [InspectionImageType.ENGINE_AND_TRANSMISSION]: {
        [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].EXHAUST_SMOKE]: 'Exhaust Smoke',
        [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE]: 'Engine',
        [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE_SOUND]: 'Engine Sound',
        [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE_MOUNTING]: 'Engine Mounting',
        [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].CLUTCH]: 'Clutch',
        [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].GEAR_SHIFTING]: 'Gear Shifting',
        [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE_OIL_LEVEL_DIPSTICK]: 'Engine Oil Level (Dipstick)',
        [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE_OIL]: 'Engine Oil',
        [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].BATTERY]: 'Battery',
        [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].COOLANT]: 'Coolant',
        [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].SUMP]: 'Sump',
    },

    [InspectionImageType.STEERING_SUSPENSION_AND_BRAKES]: {
        [InspectionImageSubType[InspectionImageType.STEERING_SUSPENSION_AND_BRAKES].STEERING]: 'Steering',
        [InspectionImageSubType[InspectionImageType.STEERING_SUSPENSION_AND_BRAKES].SUSPENSION]: 'Suspension',
        [InspectionImageSubType[InspectionImageType.STEERING_SUSPENSION_AND_BRAKES].BRAKES]: 'Brakes',
    },

    [InspectionImageType.AIR_CONDITIONING]: {
        [InspectionImageSubType[InspectionImageType.AIR_CONDITIONING].AC_COOLING]: 'AC Cooling',
        [InspectionImageSubType[InspectionImageType.AIR_CONDITIONING].CLIMATE_CONTROL_AC]: 'Climate Control AC',
        [InspectionImageSubType[InspectionImageType.AIR_CONDITIONING].HEATER]: 'Heater',
    },

    [InspectionImageType.ELECTRICAL]: {
        [InspectionImageSubType[InspectionImageType.ELECTRICAL].LHS_FRONT_WINDOW]: 'LHS Front Window',
        [InspectionImageSubType[InspectionImageType.ELECTRICAL].LHS_REAR_WINDOW]: 'LHS Rear Window',
        [InspectionImageSubType[InspectionImageType.ELECTRICAL].RHS_FRONT_WINDOW]: 'RHS Front Window',
        [InspectionImageSubType[InspectionImageType.ELECTRICAL].RHS_REAR_WINDOW]: 'RHS Rear Window',
        [InspectionImageSubType[InspectionImageType.ELECTRICAL].REAR_DEFOGGER]: 'Rear Defogger',
        [InspectionImageSubType[InspectionImageType.ELECTRICAL].AIRBAG_FEATURE_DRIVER_SIDE]: 'Driver Side Airbag',
        [InspectionImageSubType[InspectionImageType.ELECTRICAL].STEERING_MOUNTED_AUDIO_CONTROL]: 'Steering Mounted Audio Control',
        [InspectionImageSubType[InspectionImageType.ELECTRICAL].MUSIC_SYSTEM]: 'Music System',
        [InspectionImageSubType[InspectionImageType.ELECTRICAL].ELECTRICAL]: 'Electrical',
        [InspectionImageSubType[InspectionImageType.ELECTRICAL].PARKING_SENSOR]: 'Parking Sensor',
        [InspectionImageSubType[InspectionImageType.ELECTRICAL].INTERIOR]: 'Interior Electrical',
    },

    [InspectionImageType.INTERIOR]: {
        [InspectionImageSubType[InspectionImageType.INTERIOR].DASHBOARD]: 'Dashboard',
        [InspectionImageSubType[InspectionImageType.INTERIOR].ODOMETER]: 'Odometer',
        [InspectionImageSubType[InspectionImageType.INTERIOR].FRONT_SEAT_SIDE]: 'Front Seat Side',
        [InspectionImageSubType[InspectionImageType.INTERIOR].REAR_SEAT_SIDE]: 'Rear Seat Side',
        [InspectionImageSubType[InspectionImageType.INTERIOR].BOOT_SPACE]: 'Boot Space',
    },

    [InspectionImageType.SEATS]: {
        [InspectionImageSubType[InspectionImageType.SEATS].LEATHER_SEATS]: 'Leather Seats',
    },
} as const;

// Type definitions for mandatory configs
type RequiredExteriorConfig = Record<number, boolean>;
type RequiredTyreConfig = Record<number, boolean>;
type RequiredEngineConfig = Record<number, boolean>;
type RequiredSteeringConfig = Record<number, boolean>;
type RequiredACConfig = Record<number, boolean>;
type RequiredElectricalConfig = Record<number, boolean>;
type RequiredInteriorConfig = Record<number, boolean>;
type RequiredSeatConfig = Record<number, boolean>;

// Image Required Enum
export const EXTERIOR_MANDATORY: RequiredExteriorConfig = {
    [InspectionImageSubType[InspectionImageType.EXTERIOR].ROOF]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].BONNET]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_LHS_A]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_LHS_B]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_LHS_C]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_RHS_A]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_RHS_B]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_RHS_C]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].UPPER_CROSS_MEMBER]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].LOWER_CROSS_MEMBER]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].RADIATOR_SUPPORT]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].HEADLIGHT_SUPPORT]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].BOOT_DOOR]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].FIREWALL]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].QUARTER_PANEL_LHS]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].QUARTER_PANEL_RHS]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].FENDER_LHS]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].FENDER_RHS]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].APRON_LHS]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].APRON_RHS]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].APRON_LHS_LEG]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].APRON_RHS_LEG]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].COWL_TOP]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].RUNNING_BOARDER_LHS]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].RUNNING_BOARDER_RHS]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].DOOR_LHS_FRONT]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].DOOR_LHS_REAR]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].DOOR_RHS_FRONT]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].DOOR_RHS_REAR]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].WINDSHIELD_FRONT]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].WINDSHIELD_REAR]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].LIGHT_LHS_HEADLIGHT]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].LIGHT_RHS_HEADLIGHT]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].LIGHT_LHS_TAILLIGHT]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].LIGHT_RHS_TAILLIGHT]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].BUMPER_FRONT]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].BUMPER_REAR]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].ORVM_LHS]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].ORVM_RHS]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].LEFT_FRONT]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].FRONT]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].LEFT_SIDE]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].LEFT_BACK]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].BACK]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].RIGHT_BACK]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].RIGHT_SIDE]: true,
    [InspectionImageSubType[InspectionImageType.EXTERIOR].RIGHT_FRONT]: true,
};

export const TYRES_MANDATORY: RequiredTyreConfig = {
    [InspectionImageSubType[InspectionImageType.TYRES].FRONT_LEFT]: true,
    [InspectionImageSubType[InspectionImageType.TYRES].FRONT_RIGHT]: true,
    [InspectionImageSubType[InspectionImageType.TYRES].REAR_LEFT]: true,
    [InspectionImageSubType[InspectionImageType.TYRES].REAR_RIGHT]: true,
    [InspectionImageSubType[InspectionImageType.TYRES].SPARE_TYRE]: true,
};

// Common for all fuel types
export const ENGINE_COMMON_MANDATORY = [
    InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].GEAR_SHIFTING,
    InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].BATTERY,
    InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].COOLANT,
];

// Required only for Petrol/Diesel/CNG/Hybrid
export const ENGINE_ICE_MANDATORY = [
    InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE,
    InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].EXHAUST_SMOKE,
    InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE_OIL_LEVEL_DIPSTICK,
];

// Required only for Electric
export const ENGINE_ELECTRIC_MANDATORY = [
    InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE_SOUND,
];

export const ENGINE_MANDATORY: RequiredEngineConfig = {
    [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].GEAR_SHIFTING]: true,
    [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].BATTERY]: true,
    [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].COOLANT]: true,

    // Petrol/Diesel specific
    [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].EXHAUST_SMOKE]: false,
    [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE]: false,
    [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE_SOUND]: false,
    [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE_MOUNTING]: false,
    [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].CLUTCH]: false,
    [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE_OIL_LEVEL_DIPSTICK]: false,
    [InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].SUMP]: false,

    // Electric specific - Note: ENGINE_SOUND is used for both ICE and Electric
};

export const STEERING_MANDATORY: RequiredSteeringConfig = {
    [InspectionImageSubType[InspectionImageType.STEERING_SUSPENSION_AND_BRAKES].STEERING]: true,
    [InspectionImageSubType[InspectionImageType.STEERING_SUSPENSION_AND_BRAKES].SUSPENSION]: true,
    [InspectionImageSubType[InspectionImageType.STEERING_SUSPENSION_AND_BRAKES].BRAKES]: true,
};

export const AC_MANDATORY: RequiredACConfig = {
    [InspectionImageSubType[InspectionImageType.AIR_CONDITIONING].AC_COOLING]: true,
    [InspectionImageSubType[InspectionImageType.AIR_CONDITIONING].CLIMATE_CONTROL_AC]: true,
    [InspectionImageSubType[InspectionImageType.AIR_CONDITIONING].HEATER]: true,
};

export const ELECTRICAL_MANDATORY: RequiredElectricalConfig = {
    [InspectionImageSubType[InspectionImageType.ELECTRICAL].LHS_FRONT_WINDOW]: true,
    [InspectionImageSubType[InspectionImageType.ELECTRICAL].LHS_REAR_WINDOW]: true,
    [InspectionImageSubType[InspectionImageType.ELECTRICAL].RHS_FRONT_WINDOW]: true,
    [InspectionImageSubType[InspectionImageType.ELECTRICAL].RHS_REAR_WINDOW]: true,
    [InspectionImageSubType[InspectionImageType.ELECTRICAL].REAR_DEFOGGER]: true,
    [InspectionImageSubType[InspectionImageType.ELECTRICAL].AIRBAG_FEATURE_DRIVER_SIDE]: true,
    [InspectionImageSubType[InspectionImageType.ELECTRICAL].STEERING_MOUNTED_AUDIO_CONTROL]: true,
    [InspectionImageSubType[InspectionImageType.ELECTRICAL].MUSIC_SYSTEM]: true,
    [InspectionImageSubType[InspectionImageType.ELECTRICAL].ELECTRICAL]: true,
    [InspectionImageSubType[InspectionImageType.ELECTRICAL].PARKING_SENSOR]: true,
    [InspectionImageSubType[InspectionImageType.ELECTRICAL].INTERIOR]: false,
};

export const INTERIOR_MANDATORY: RequiredInteriorConfig = {
    [InspectionImageSubType[InspectionImageType.INTERIOR].DASHBOARD]: true,
    [InspectionImageSubType[InspectionImageType.INTERIOR].ODOMETER]: true,
    [InspectionImageSubType[InspectionImageType.INTERIOR].REAR_SEAT_SIDE]: true,
    [InspectionImageSubType[InspectionImageType.INTERIOR].BOOT_SPACE]: true,
};

export const SEATS_MANDATORY: RequiredSeatConfig = {
    [InspectionImageSubType[InspectionImageType.SEATS].LEATHER_SEATS]: true,
};

// Helper function to check if image is required based on type and sub_type
export const isImageRequired = (type: number, subType: number): boolean => {
    switch (type) {
        case InspectionImageType.EXTERIOR:
            return EXTERIOR_MANDATORY[subType] === true;
        case InspectionImageType.TYRES:
            return TYRES_MANDATORY[subType] === true;
        case InspectionImageType.ENGINE_AND_TRANSMISSION:
            return ENGINE_MANDATORY[subType] === true;
        case InspectionImageType.STEERING_SUSPENSION_AND_BRAKES:
            return STEERING_MANDATORY[subType] === true;
        case InspectionImageType.AIR_CONDITIONING:
            return AC_MANDATORY[subType] === true;
        case InspectionImageType.ELECTRICAL:
            return ELECTRICAL_MANDATORY[subType] === true;
        case InspectionImageType.INTERIOR:
            return INTERIOR_MANDATORY[subType] === true;
        case InspectionImageType.SEATS:
            return SEATS_MANDATORY[subType] === true;
        default:
            return false;
    }
};

// tread depth enum
export enum TreadDepthEnum {
    LESS_THAN_3MM = 3,
    BETWEEN_3MM_AND_4MM = 4,
    BETWEEN_4MM_AND_5MM = 5,
    BETWEEN_5MM_AND_6MM = 6,
    BETWEEN_6MM_AND_7MM = 7,
    BETWEEN_7MM_AND_8MM = 8,
    BETWEEN_8MM_AND_9MM = 9,
    BETWEEN_9MM_AND_MM = 10,
}


export const ExteriorFields = [
    { name: "left_front", label: "Left Front", fieldType: "pillar" as const, uploadLabel: "Upload Left Front Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].LEFT_FRONT },
    { name: "front", label: "Front", fieldType: "pillar" as const, uploadLabel: "Upload Front Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].FRONT },
    { name: "left_side", label: "Left Side", fieldType: "pillar" as const, uploadLabel: "Upload Left Side Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].LEFT_SIDE },
    { name: "left_back", label: "Left Back", fieldType: "pillar" as const, uploadLabel: "Upload Left Back Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].LEFT_BACK },
    { name: "back", label: "Back", fieldType: "pillar" as const, uploadLabel: "Upload Back Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].BACK },
    { name: "right_back", label: "Right Back", fieldType: "pillar" as const, uploadLabel: "Upload Right Back Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].RIGHT_BACK },
    { name: "right_side", label: "Right Side", fieldType: "pillar" as const, uploadLabel: "Upload Right Side Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].RIGHT_SIDE },
    { name: "right_front", label: "Right Front", fieldType: "pillar" as const, uploadLabel: "Upload Right Front Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].RIGHT_FRONT },
    { name: "roof", label: "Roof", fieldType: "pillar" as const, uploadLabel: "Upload Roof Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].ROOF },
    { name: "bonnet_hood", label: "Bonnet/Hood", fieldType: "pillar" as const, uploadLabel: "Upload Bonnet/Hood Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].BONNET },
    { name: "pillar_lhs_a", label: "Pillar LHS A", fieldType: "pillar" as const, uploadLabel: "Upload Pillar LHS A Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_LHS_A },
    { name: "pillar_lhs_b", label: "Pillar LHS B", fieldType: "pillar" as const, uploadLabel: "Upload Pillar LHS B Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_LHS_B },
    { name: "pillar_lhs_c", label: "Pillar LHS C", fieldType: "pillar" as const, uploadLabel: "Upload Pillar LHS C Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_LHS_C },
    { name: "pillar_rhs_a", label: "Pillar RHS A", fieldType: "pillar" as const, uploadLabel: "Upload Pillar RHS A Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_RHS_A },
    { name: "pillar_rhs_b", label: "Pillar RHS B", fieldType: "pillar" as const, uploadLabel: "Upload Pillar RHS B Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_RHS_B },
    { name: "pillar_rhs_c", label: "Pillar RHS C", fieldType: "pillar" as const, uploadLabel: "Upload Pillar RHS C Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].PILLAR_RHS_C },
    // Cross Members & Supports
    { name: "upper_cross_member", label: "Upper Cross Member (Bonnet Patti)", fieldType: "pillar" as const, uploadLabel: "Upload Upper Cross Member Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].UPPER_CROSS_MEMBER },
    { name: "lower_cross_member", label: "Lower Cross Member", fieldType: "pillar" as const, uploadLabel: "Upload Lower Cross Member Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].LOWER_CROSS_MEMBER },
    { name: "radiator_support", label: "Radiator Support", fieldType: "pillar" as const, uploadLabel: "Upload Radiator Support Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].RADIATOR_SUPPORT },
    { name: "head_light_support", label: "Head Light Support", fieldType: "light" as const, uploadLabel: "Upload Head Light Support Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].HEADLIGHT_SUPPORT },
    { name: "dicky_door_boot_door", label: "Dicky Door/Boot Door", fieldType: "pillar" as const, uploadLabel: "Upload Dicky Door/Boot Door Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].BOOT_DOOR },
    { name: "firewall", label: "Firewall", fieldType: "pillar" as const, uploadLabel: "Upload Firewall Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].FIREWALL },
    { name: "quarter_panel_lhs", label: "Quarter Panel LHS", fieldType: "pillar" as const, uploadLabel: "Upload Quarter Panel LHS Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].QUARTER_PANEL_LHS },
    { name: "quarter_panel_rhs", label: "Quarter Panel RHS", fieldType: "pillar" as const, uploadLabel: "Upload Quarter Panel RHS Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].QUARTER_PANEL_RHS },
    { name: "fender_lhs", label: "Fender LHS", fieldType: "pillar" as const, uploadLabel: "Upload Fender LHS Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].FENDER_LHS },
    { name: "fender_rhs", label: "Fender RHS", fieldType: "pillar" as const, uploadLabel: "Upload Fender RHS Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].FENDER_RHS },
    { name: "apron_lhs", label: "Apron LHS", fieldType: "pillar" as const, uploadLabel: "Upload Apron LHS Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].APRON_LHS },
    { name: "apron_rhs", label: "Apron RHS", fieldType: "pillar" as const, uploadLabel: "Upload Apron RHS Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].APRON_RHS },
    { name: "apron_lhs_leg", label: "Apron LHS LEG", fieldType: "pillar" as const, uploadLabel: "Upload Apron LHS LEG Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].APRON_LHS_LEG },
    { name: "apron_rhs_leg", label: "Apron RHS LEG", fieldType: "pillar" as const, uploadLabel: "Upload Apron RHS LEG Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].APRON_RHS_LEG },
    { name: "cowl_top", label: "Cowl Top", fieldType: "pillar" as const, uploadLabel: "Upload Cowl Top Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].COWL_TOP },
    { name: "running_border_lhs", label: "Running Border LHS", fieldType: "pillar" as const, uploadLabel: "Upload Running Border LHS Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].RUNNING_BOARDER_LHS },
    { name: "running_border_rhs", label: "Running Border RHS", fieldType: "pillar" as const, uploadLabel: "Upload Running Border RHS Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].RUNNING_BOARDER_RHS },
    { name: "door_lhs_front", label: "Door LHS Front", fieldType: "pillar" as const, uploadLabel: "Upload Door LHS Front Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].DOOR_LHS_FRONT },
    { name: "door_lhs_rear", label: "Door LHS Rear", fieldType: "pillar" as const, uploadLabel: "Upload Door LHS Rear Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].DOOR_LHS_REAR },
    { name: "door_rhs_front", label: "Door RHS Front", fieldType: "pillar" as const, uploadLabel: "Upload Door RHS Front Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].DOOR_RHS_FRONT },
    { name: "door_rhs_rear", label: "Door RHS Rear", fieldType: "pillar" as const, uploadLabel: "Upload Door RHS Rear Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].DOOR_RHS_REAR },
    { name: "windshield_front", label: "Windshield Front", fieldType: "pillar" as const, uploadLabel: "Upload Windshield Front Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].WINDSHIELD_FRONT },
    { name: "windshield_rear", label: "Windshield Rear", fieldType: "pillar" as const, uploadLabel: "Upload Windshield Rear Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].WINDSHIELD_REAR },
    { name: "light_lhs_headlight", label: "Light LHS Headlight", fieldType: "light" as const, uploadLabel: "Upload LHS Headlight Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].LIGHT_LHS_HEADLIGHT },
    { name: "light_rhs_headlight", label: "Light RHS Headlight", fieldType: "light" as const, uploadLabel: "Upload RHS Headlight Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].LIGHT_RHS_HEADLIGHT },
    { name: "light_lhs_taillight", label: "Light LHS Taillight", fieldType: "light" as const, uploadLabel: "Upload LHS Taillight Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].LIGHT_LHS_TAILLIGHT },
    { name: "light_rhs_taillight", label: "Light RHS Taillight", fieldType: "light" as const, uploadLabel: "Upload RHS Taillight Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].LIGHT_RHS_TAILLIGHT },
    { name: "bumper_front", label: "Bumper Front", fieldType: "pillar" as const, uploadLabel: "Upload Bumper Front Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].BUMPER_FRONT },
    { name: "bumper_rear", label: "Bumper Rear", fieldType: "pillar" as const, uploadLabel: "Upload Bumper Rear Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].BUMPER_REAR },
    { name: "orvm_lhs", label: "ORVM - Manual / Electrical LHS", fieldType: "orvm" as const, uploadLabel: "Upload ORVM LHS Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].ORVM_LHS },
    { name: "orvm_rhs", label: "ORVM - Manual / Electrical RHS", fieldType: "orvm" as const, uploadLabel: "Upload ORVM RHS Image", type: InspectionImageType.EXTERIOR, sub_type: InspectionImageSubType[InspectionImageType.EXTERIOR].ORVM_RHS },
    { name: "lhs_front_tyre", label: "LHS Front Tyre", fieldType: "tyre" as const, uploadLabel: "Upload LHS Front Tyre Image", type: InspectionImageType.TYRES, sub_type: InspectionImageSubType[InspectionImageType.TYRES].FRONT_LEFT },
    { name: "rhs_front_tyre", label: "RHS Front Tyre", fieldType: "tyre" as const, uploadLabel: "Upload RHS Front Tyre Image", type: InspectionImageType.TYRES, sub_type: InspectionImageSubType[InspectionImageType.TYRES].FRONT_RIGHT },
    { name: "lhs_rear_tyre", label: "LHS Rear Tyre", fieldType: "tyre" as const, uploadLabel: "Upload LHS Rear Tyre Image", type: InspectionImageType.TYRES, sub_type: InspectionImageSubType[InspectionImageType.TYRES].REAR_LEFT },
    { name: "rhs_rear_tyre", label: "RHS Rear Tyre", fieldType: "tyre" as const, uploadLabel: "Upload RHS Rear Tyre Image", type: InspectionImageType.TYRES, sub_type: InspectionImageSubType[InspectionImageType.TYRES].REAR_RIGHT },
    { name: "spare_tyre", label: "Spare Tyre", fieldType: "tyre" as const, uploadLabel: "Upload Spare Tyre Image", type: InspectionImageType.TYRES, sub_type: InspectionImageSubType[InspectionImageType.TYRES].SPARE_TYRE },
];

export const EngineAndTransmissionFields = [
    { name: "exhaust_smoke", label: "Exhaust Smoke", fieldType: "exhaust" as const, uploadLabel: "Upload Exhaust Smoke Video", type: InspectionImageType.ENGINE_AND_TRANSMISSION, sub_type: InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].EXHAUST_SMOKE },
    { name: "engine_oil_level_dipstick", label: "Engine Oil Level Dipstick", fieldType: "engineOilLevelDipstick" as const, uploadLabel: "Upload Engine Oil Level Dipstick Image", type: InspectionImageType.ENGINE_AND_TRANSMISSION, sub_type: InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE_OIL_LEVEL_DIPSTICK },
    { name: "battery", label: "Battery", fieldType: "battery" as const, uploadLabel: "Upload Battery Image", type: InspectionImageType.ENGINE_AND_TRANSMISSION, sub_type: InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].BATTERY },
    { name: "coolant", label: "Coolant", fieldType: "coolant" as const, uploadLabel: "Upload Coolant Image", type: InspectionImageType.ENGINE_AND_TRANSMISSION, sub_type: InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].COOLANT },
    { name: "sump", label: "Sump", fieldType: "sump" as const, uploadLabel: "Upload Sump Image", type: InspectionImageType.ENGINE_AND_TRANSMISSION, sub_type: InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].SUMP },
    { name: "engine", label: "Engine", fieldType: "engine" as const, uploadLabel: "Upload Engine Image", type: InspectionImageType.ENGINE_AND_TRANSMISSION, sub_type: InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE },
    { name: "engine_sound", label: "Engine Sound", fieldType: "engineSound" as const, uploadLabel: "Upload Engine Sound Image", type: InspectionImageType.ENGINE_AND_TRANSMISSION, sub_type: InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE_SOUND },
    { name: "engine_mounting", label: "Engine Mounting", fieldType: "engineMounting" as const, uploadLabel: "Upload Engine Mounting Image", type: InspectionImageType.ENGINE_AND_TRANSMISSION, sub_type: InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE_MOUNTING },
    { name: "clutch", label: "Clutch", fieldType: "clutch" as const, uploadLabel: "Upload Clutch Image", type: InspectionImageType.ENGINE_AND_TRANSMISSION, sub_type: InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].CLUTCH },
    { name: "gear_shifting", label: "Gear Shifting", fieldType: "gearShifting" as const, uploadLabel: "Upload Gear Shifting Video", type: InspectionImageType.ENGINE_AND_TRANSMISSION, sub_type: InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].GEAR_SHIFTING },
    { name: "engine_oil", label: "Engine Oil", fieldType: "engineOil" as const, uploadLabel: "Upload Engine Oil Image", type: InspectionImageType.ENGINE_AND_TRANSMISSION, sub_type: InspectionImageSubType[InspectionImageType.ENGINE_AND_TRANSMISSION].ENGINE_OIL },
];

export const SteeringSuspensionAndBrakesFields = [
    { name: "steering", label: "Steering", fieldType: "steering" as const, uploadLabel: "Upload Steering Wheel Image", type: InspectionImageType.STEERING_SUSPENSION_AND_BRAKES, sub_type: InspectionImageSubType[InspectionImageType.STEERING_SUSPENSION_AND_BRAKES].STEERING },
    { name: "brake", label: "Brake", fieldType: "brake" as const, uploadLabel: "Upload Steering Column Image", type: InspectionImageType.STEERING_SUSPENSION_AND_BRAKES, sub_type: InspectionImageSubType[InspectionImageType.STEERING_SUSPENSION_AND_BRAKES].SUSPENSION },
    { name: "suspension", label: "Suspension", fieldType: "suspension" as const, uploadLabel: "Upload Steering Column Lever Image", type: InspectionImageType.STEERING_SUSPENSION_AND_BRAKES, sub_type: InspectionImageSubType[InspectionImageType.STEERING_SUSPENSION_AND_BRAKES].BRAKES },
];

export const AirConditioningFields = [
    { name: "ac_cooling", label: "AC Cooling", fieldType: "airCondition" as const, uploadLabel: "Upload AC Cooling Image", type: InspectionImageType.AIR_CONDITIONING, sub_type: InspectionImageSubType[InspectionImageType.AIR_CONDITIONING].AC_COOLING },
    { name: "climate_control_ac", label: "Climate Control AC", fieldType: "airCondition" as const, uploadLabel: "Upload Climate Control AC Image", type: InspectionImageType.AIR_CONDITIONING, sub_type: InspectionImageSubType[InspectionImageType.AIR_CONDITIONING].CLIMATE_CONTROL_AC },
    { name: "heater", label: "Heater", fieldType: "airCondition" as const, uploadLabel: "Upload Heater Image", type: InspectionImageType.AIR_CONDITIONING, sub_type: InspectionImageSubType[InspectionImageType.AIR_CONDITIONING].HEATER },
];

export const ElectricalFields = [
    { name: "lhs_front_window", label: "LHS Front Window", fieldType: "electrical" as const, uploadLabel: "Upload LHS Front Window Image", type: InspectionImageType.ELECTRICAL, sub_type: InspectionImageSubType[InspectionImageType.ELECTRICAL].LHS_FRONT_WINDOW },
    { name: "rhs_front_window", label: "RHS Front Window", fieldType: "electrical" as const, uploadLabel: "Upload RHS Front Window Image", type: InspectionImageType.ELECTRICAL, sub_type: InspectionImageSubType[InspectionImageType.ELECTRICAL].RHS_FRONT_WINDOW },
    { name: "lhs_rear_window", label: "LHS Rear Window", fieldType: "electrical" as const, uploadLabel: "Upload LHS Rear Window Image", type: InspectionImageType.ELECTRICAL, sub_type: InspectionImageSubType[InspectionImageType.ELECTRICAL].LHS_REAR_WINDOW },
    { name: "rhs_rear_window", label: "RHS Rear Window", fieldType: "electrical" as const, uploadLabel: "Upload RHS Rear Window Image", type: InspectionImageType.ELECTRICAL, sub_type: InspectionImageSubType[InspectionImageType.ELECTRICAL].RHS_REAR_WINDOW },
    { name: "airbag_feature_driver_side", label: "Airbag Feature Driver Side", fieldType: "electricalInterior" as const, uploadLabel: "Upload Airbag Feature Driver Side Image", type: InspectionImageType.ELECTRICAL, sub_type: InspectionImageSubType[InspectionImageType.ELECTRICAL].AIRBAG_FEATURE_DRIVER_SIDE },
    { name: "steering_mounted_audio_control", label: "Steering Mounted Audio Control", fieldType: "electricalInterior" as const, uploadLabel: "Upload Steering Mounted Audio Control Image", type: InspectionImageType.ELECTRICAL, sub_type: InspectionImageSubType[InspectionImageType.ELECTRICAL].STEERING_MOUNTED_AUDIO_CONTROL },
    { name: "rear_defogger", label: "Rear Defogger", fieldType: "electricalInterior" as const, uploadLabel: "Upload Rear Defogger Image", type: InspectionImageType.ELECTRICAL, sub_type: InspectionImageSubType[InspectionImageType.ELECTRICAL].REAR_DEFOGGER },
    { name: "music_system", label: "Music System", fieldType: "electricalInterior" as const, uploadLabel: "Upload Music System Image", type: InspectionImageType.ELECTRICAL, sub_type: InspectionImageSubType[InspectionImageType.ELECTRICAL].MUSIC_SYSTEM },
    { name: "electrical", label: "Electrical", fieldType: "electricalInterior" as const, uploadLabel: "Upload Electrical Image", type: InspectionImageType.ELECTRICAL, sub_type: InspectionImageSubType[InspectionImageType.ELECTRICAL].ELECTRICAL },
    { name: "interior", label: "Interior", fieldType: "electricalInterior" as const, uploadLabel: "Upload Interior Image", type: InspectionImageType.ELECTRICAL, sub_type: InspectionImageSubType[InspectionImageType.ELECTRICAL].INTERIOR },
    { name: "parking_sensor", label: "Parking Sensor", fieldType: "electricalInterior" as const, uploadLabel: "Upload Parking Sensor Image", type: InspectionImageType.ELECTRICAL, sub_type: InspectionImageSubType[InspectionImageType.ELECTRICAL].PARKING_SENSOR },
];

export const InteriorFields = [
    { name: "dashboard", label: "Dashboard", fieldType: "interior" as const, uploadLabel: "Upload Dashboard Image", type: InspectionImageType.INTERIOR, sub_type: InspectionImageSubType[InspectionImageType.INTERIOR].DASHBOARD },
    { name: "odometer", label: "Odometer", fieldType: "interior" as const, uploadLabel: "Upload Odometer Image", type: InspectionImageType.INTERIOR, sub_type: InspectionImageSubType[InspectionImageType.INTERIOR].ODOMETER },
    { name: "front_seat_side", label: "Front Seat Side", fieldType: "interior" as const, uploadLabel: "Upload front Seat Side Image", type: InspectionImageType.INTERIOR, sub_type: InspectionImageSubType[InspectionImageType.INTERIOR].FRONT_SEAT_SIDE },
    { name: "rear_seat_side", label: "Rear Seat Side", fieldType: "interior" as const, uploadLabel: "Upload Rear Seat Side Image", type: InspectionImageType.INTERIOR, sub_type: InspectionImageSubType[InspectionImageType.INTERIOR].REAR_SEAT_SIDE },
    { name: "boot_space", label: "Boot Space", fieldType: "interior" as const, uploadLabel: "Upload Boot Space Image", type: InspectionImageType.INTERIOR, sub_type: InspectionImageSubType[InspectionImageType.INTERIOR].BOOT_SPACE },
];

export const SeatsFields = [
    { name: "leather_seats", label: "Leather Seats", fieldType: "seats" as const, uploadLabel: "Upload Leather Seats Image", type: InspectionImageType.SEATS, sub_type: InspectionImageSubType[InspectionImageType.SEATS].LEATHER_SEATS },
];