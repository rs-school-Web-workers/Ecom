export interface getUserProfileData {
  addresses: addressItem[];
  billingAddressIds: string[];
  dateOfBirth: string;
  defaultBillingAddressId: string;
  defaultShippingAddressId: string;
  email: string;
  firstName: string;
  lastName: string;
  shippingAddressIds: string[];
}
export interface addressItem {
  city?: string;
  country?: 'BY' | 'PL' | 'RU';
  id: string;
  postalCode?: string;
  streetName?: string;
  streetNumber?: string;
}
