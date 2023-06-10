export interface UserAttributes {
  id: string;
  first_name: string;
  last_name: string;
  password: string;
  username: string;
  gender: string;
  service: string;
  email: string;
  phone: string;
  birth_date: Date;
  is_admin: boolean;
  is_blocked: boolean;
  avatar_image: string;
}

export interface JWTTokenAttributesPayload {
  id: string;
  email: string;
}

export interface JWTtoken {
  JWT: string;
}

export type ErrorType = string | { error: string; validationErrors?: [] };

export type UpdateUserRequest = {
  params: {
    id: string;
  };
  body: Partial<UserAttributes>;
};

export const SERVICE_TYPES = {
  WEBSITE: "website",
  GOOGLE: "google",
  GITHUB: "github",
};

export const AVATAR_IMAGE_DEFAULT = {
  MALE: "https://img.icons8.com/dotty/256/user-male.png",
  FEMALE: "https://img.icons8.com/dotty/256/user-female.png",
  OTHER: "https://img.icons8.com/ios/256/drag-gender-neutral.png",
};
