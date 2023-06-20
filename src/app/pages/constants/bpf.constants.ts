import { environment } from './../../../environments/environment';
const SYSTEM_MASTER_API = environment.systemMaster;
export const module_url = {
  create: 'Modules/create',
  get: 'Modules/list',
  find: 'Modules/id?moduleId=',
  update: 'Modules/edit',
  getorganizationLov: 'organization/list',
  departmentslov: 'Departments/list',
  getbusinessunitLov: 'businessunit/list',
};

export const sub_module_url = {
  create: 'sub_module/create',
  get: 'sub_module/list',
  find: 'sub_module/id?id=',
  update: 'sub_module/edit',
};

export const status_url = {
  create: 'status/create',
  get: 'status/list',
  find: 'status/id?statusId=',
  update: 'status/edit',
};

export const transitions_url = {
  create: 'Transition/create',
  get: 'Transition/list',
  find: 'Transition/id?transitionId=',
  update: 'Transition/edit',
  bpfTransitions: 'Transition/bpftransitions',
  getStatusByModuleId: 'get-status-by-module/',
};

export const team_url = {
  create: 'team/create',
  get: 'team/list',
  find: 'team/id?teamId=',
  update: 'team/edit',
};

export const addmembersTo_team_url = {
  create: 'member _to _team/create',
  get: 'member _to _team/list',
  find: 'member _to _team/id?MtoTId=',
  update: 'member _to _team/edit',
  allUsersList: 'userManagement/getAllUsers',
  teamidByuser: 'member _to _team/teamid?teamId=',
};

export const tl_team_leader_url = {
  create: 'team_leader_to_team/create',
  get: 'team_leader_to_team/list',
  find: 'team_leader_to_team/id?tId=',
  update: 'team_leader_to_team/edit',
};

export const service_register_url = {
  create: 'bpf_service_register/create',
  get: 'bpf_service_register/list',
  find: 'bpf_service_register/id?id=',
  update: 'bpf_service_register/edit',
};
export const mail_template_url = {
  create: 'bpf_mail_template/create',
  get: 'bpf_mail_template/list',
  find: 'bpf_mail_template/id?id=',
  update: 'bpf_mail_template/edit',
};

export const bpf_url = {
  create: 'bpf-config/create',
  get: 'bpf-config/get-all',
  find: 'bpf-config/get-by-id/',
  update: 'bpf-config/edit',
};

export const ORGANIZATION = {
  GET_ALL_LOV: SYSTEM_MASTER_API + 'organization/list',
  DEPARTMENTS_LOV: SYSTEM_MASTER_API + 'Departments/businessUnitId?businessUnitId=',
  BUSINESS_UNIT_LOV: SYSTEM_MASTER_API + 'businessunit/organizationId?organizationId=',
};


//deafault-status
export const deafault_status_url = {
  create: 'deafault-status',
  get: 'all',
  find: 'deafault-status/id?id=',
};
