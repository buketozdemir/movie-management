import { PaginationFilter } from '../../common/interfaces/pagination';
import { UserStatus } from './user.enum';

export interface GetUsers extends PaginationFilter {
  firstName?: string;
  lastName?: string;
  userName?: string;
  status?: number;
}

export interface PostUser {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  birthDate: Date;
  status?: UserStatus;
  roles?: number[];
}

export interface PatchUser {
  firstName?: string;
  lastName?: string;
  birthDate?: Date;
  status?: UserStatus;
  password?: string;
  updatedBy: string;
  deletedBy?: string;
}

export interface DeleteUser {
  deletedBy: string;
}

export interface CheckUserParams {
  userId?: string;
  userName?: string;
  mustExist: boolean;
  projection?: string;
}

export interface PostChangePassword {
  password: string;
  oldPassword: string;
  confirmPassword: string;
}

export interface CheckPasswordMatchParams {
  password: string;
  confirmPassword: string;
  oldPassword: string;
  user: CheckPasswordMatchUser;
}

interface CheckPasswordMatchUser {
  id: string;
  password: string;
}
