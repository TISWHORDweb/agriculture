
interface Location {
  state: string;
  address?: string;
  ward?: string;
  lga?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface SignUpProps  {
  email: string;
  password: string;
  role: 'farmer' | 'agent' | 'admin';
  firstName?: string;
  lastName?: string;
  contact?: string;
  middleName?: string;
  address?: string;
  location: Location;
}


export interface SignInProps {
    email: string,
    password: string
}

export interface ParentInvite {
    emails: string,
    kidsNum: number
}

export interface PasswordResetProps { }

export interface ForgotPasswordProps { }

export interface ProfileUpdateProps {
    firstName: string,
    lastName: string
}

export interface PasswordUpdateProps {
    password1: string,
    password2: string,
    passwordOld: string,
    email: string
}

export interface AddTestimonial {
    testimonial: string,
}

export interface AddChildProps {
    firstName: string,
    lastName: string,
    age: number,
    gender: string
}

export interface AddProgramProps {
    timeOffset: any;
    timeGroupId: number | undefined;
    timeGroupIndex: number | undefined;
    level: number;
}