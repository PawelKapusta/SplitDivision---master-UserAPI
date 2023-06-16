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
  MALE: "https://images.unsplash.com/photo-1627672360124-4ed09583e14c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=928&q=80",
  FEMALE:
    "https://images.unsplash.com/photo-1670834169539-feed72d15b25?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
  OTHER:
    "https://images.unsplash.com/photo-1627693685101-687bf0eb1222?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
};
