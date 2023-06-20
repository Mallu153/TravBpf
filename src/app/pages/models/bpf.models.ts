export class Module {
  moduleId?: number;
  organizationId?: number;
  description: string;
  moduleName: string;
  status: string;
}

export class SubModule {
  description: string;
  headerRelation: string;
  id?: number;
  name: string;
  status: string;
}

export class Status {
  statusId?: number;
  description: string;
  module: number;
  name: string;
  organization?: number;
  status: string;
  wfFlag: boolean;
  defaultStatus: any;
  financeImpact: any;
}
export class Transitions {
  transitionId?: number;
  deafultStatus: string;
  fromStatus: number;
  moduleName: number;
  status: string;
  toStatus: number;
  milestone?: boolean;
}

export class Team {
  teamId?: number;
  departmentId: number;
  endDate: Date;
  moduleId: number;
  organizationId: number;
  startDate: Date;
  status: string;
  teamName: string;
  teamEmail?: string;
  businessUnit?: number;
  isWaticketTeam?: any;
  colorCode: string;
}
export class AddmembersToTeam {
  endDate: Date;
  mtoTId?: number;
  startDate: Date;
  status: string;
  teamId: number;
  userName: string;
  userId?: number;
}

export class TLTOTeam {
  endDate: Date;
  module: string;
  organization: string;
  startDate: Date;
  status: string;
  tId?: number;
  team: string;
  teamLeader: string;
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
  isSeviceUrl: boolean;
  isQuartz: boolean;
  template: string;
  outPut: string;
}

export class MailTemplate {
  body: string;
  endDate: Date;
  id?: number;
  startDate: Date;
  status: string;
  subject: string;
  templateName: string;
  viewName: string;
}

export class BPF {
  configHeader: Header;
  configLines: Lines[];
}

export class Header {
  actionType: string;
  configName: string;
  id?: number;
  module: number;
  status: string;
  statusFrom: number;
  statusTo: number;
  subModule: number;
  transitionID: number;
}
export class Lines {
  deleteFlag?: number;
  deletedBy?: number;
  email: string;
  emailTemplate: string;
  emailbcc: string;
  emailcc: string;
  event: string;
  headerID?: number;
  lineID?: number;
  notification: string;
  remarks: string;
  serviceCallHeaderDetails?: string;
  serviceCallResponse?: string;
  serviceCallURL: string;
  status: string;
}

export class BPFTransitions {
  fromStatus: number;
  toStatus: number;
  transitionId: number;
  transition: string;
}
export interface DefaultStatus {
  createdBy?: number;
  createdDate?: string;
  defaultStatus: number;
  id?: number;
  module: number;
  organization: number;
  status: string;
  subModule: number;
  updatedBy?: number;
  updatedDate?: string;
}
