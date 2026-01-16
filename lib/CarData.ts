export type CarData = {
    id: string;
    name: string;
    year: number;
    price?: string;
    image: string;
    fuelType: string;
    transmission: string;
    kmsDriven: string;
    location: string;
    owner: string;
    badgeType?: 'assured' | 'private';
    customerExpectedPrice?: string;
    linkDrivePrice?: string;
    managerSuggestedPrice?: string;
    registrationYear?: string;
};

