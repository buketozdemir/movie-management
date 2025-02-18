export interface ErrorResponse {
  code: number;
  message: string;
  error: string;
  actions?: any[];
}

export interface ErrorParams {
  code: number;
  message: string;
  error: string;
  actions?: any[];
}

export interface ErrorStandard {
  code: number;
  message: string;
  error: string;
  groupCode?: string;
  actions?: any[];
  errors?: any[];
}

export interface DeletedBy {
  deletedBy: string;
}

export interface UpdatedBy {
  updatedBy: string;
}

export interface CreatedBy {
  createdBy: string;
}
