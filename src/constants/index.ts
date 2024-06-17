export const userRegisterProviders = {
  email: 'email',
  google: 'google',
  magic: 'magic',
};

export enum Gender {
  Male = 'male',
  Female = 'female',
  Fluid = 'fluid',
}

export const UserVerificationTypes = {
  mobile: 1,
  aadhar: 2,
};

export const StorageContainer = {
  userPhotos: 'userPhotos',
  menuItems: 'menuItems',
};

export const orderStatus = {
  pending: 'pending',
  preparing: 'preparing',
  delivered: 'delivered',
  completed: 'completed',
  reordered: 'reordered',
  ongoing: 'ongoing',
  cooking: 'cooking',
  withWaiter: 'withWaiter',
  inKitchen: 'inKitchen',
  paid: 'paid',
};
