export class ServiceType {
  serviceTypesHeader: ServiceTypesHeader;
  serviceTypesLines: serviceTypesLines[];
}

export class ServiceTypesHeader {
  id: number;
  createdBy: number;
  createdDate?: string;
  updatedBy: number;
  updatedDate?: string;
  organizationId: string;
  departmentId: string;
  parentId: string;
  serviceTypeGroup: string;
  formUrl: string;
  isDynamicForm: number;
  mobileEnabled: number;
  desktopEnabled: number;
  name: string;
  status: string;
  description: string;
  preValidations: string;
  instructions: string;
}

export class serviceTypesLines {
  createdBy?: number;
  createdDate?: string;
  description: string;
  field: string;
  headerId?: number;
  id?: number;
  required: string;
  dc: number;
  do: number;
  mc: number;
  mo: number;
  status?: string;
  updatedBy?: number;
  updatedDate?: string;
}
export class Field {
  createdBy?: number;
  configId?: number;
  name: string;
  source: string;
  status: string;
  category: string;
  typeId: number;
  ui: string;
  validators: string;
  multiselect: boolean;
  updatedBy?: number;
}
export class ServiceRegister {
  id?: number;
  description: string;
  endDate: Date;
  moduleId: number;
  serviceName: string;
  serviceUrl: string;
  startDate: Date;
  status: string;
  isBpf: boolean;
  isServiceUrl: boolean;
  isQuartz: boolean;
  template: string;
  output: string;
}
export class ServiceAttachments {
  allowedExtensions: number;
  attachmentsId: number;
  conditional: boolean;
  createdBy: string;
  createdDate?: string;
  description: string;
  field: number;
  headerId: number;
  language: string;
  mandatory: boolean;
  name: string;
  operator: number;
  status: string;
  updatedBy: string;
  updatedDate?: string;
  value: string;
}

export interface ServiceSurvey {
  createdBy: string;
  createdDate?: string;
  id: number;
  question: number;
  reference: string;
  referenceId: number;
  status: string;
  surveyHeader: number;
  updatedBy: string;
  updatedDate?: string;
}
export interface FAQ {
  answer: string;
  attribute1: string;
  attribute2: string;
  attribute3: string;
  createdBy: string;
  createdDate?: string;
  department: number;
  deviceId: string;
  deviceType: string;
  id?: number;
  ipAddress: string;
  organization: number;
  question: string;
  questionId: string;
  referenceId: number;
  referenceName: string;
  status: string;
  updatedBy: string;
  updatedDate?: string;
}
export interface ServiceMenuType {
  id?: number;
  organization: number;
  name: string;
  description: string;
  createdBy: number;
  updatedBy?: number;
  createdDate: string;
  updatedDate?: string;
  status: string;
}

export interface ServiceMenuTypeLines {
  createdBy: number;
  createdDate: string;
  description: string;
  endDate?: string;
  id?: number;
  organization?: number;
  serviceMenuType: number;
  serviceTypeHeader: number;
  startDate: string;
  status: string;
  updatedBy?: number;
  updatedDate?: string;
}
export class ServiceTypeGroup {
  createdBy: string;
  createdDate?: string;
  department: number;
  description: string;
  id?: number;
  name: string;
  status: string;
  updatedBy: string;
  updatedDate?: string;
}
export class Team {
  teamId: number;
  createdBy: string;
  createdDate: string;
  departmentId: number;
  endDate: string;
  moduleId: number;
  organizationId: number;
  startDate: string;
  businessUnit: number;
  teamEmail: string;
  status: string;
  teamName: string;
  upDatedBy: string;
  upDatedDate: string;
}

export class Statuses {
  statusId: number;
  createdBy: string;
  createdDate: string;
  description: string;
  module: string;
  name: string;
  organization: string;
  status: string;
  upDatedBy: string;
  upDatedDate: string;
}
