import { environment } from 'environments/environment';

const E_SERVICE_BE = environment.SERVICE_CONFIG;
const SYSTEM_MASTER = environment.systemMaster;
export const organization_api_url = {
  create: 'organization/create',
  get: 'organization/list',
  find: 'organization/id?organizationId=',
  update: 'organization/edit',
};
export const DEPARTMENT_API_URL = {
  create: SYSTEM_MASTER + 'Departments/create',
  get: SYSTEM_MASTER + 'Departments/list',
  find: SYSTEM_MASTER + 'Departments/id?departmentId=',
  findByOrg: SYSTEM_MASTER + 'Departments/organizationId?id=',
  update: SYSTEM_MASTER + 'Departments/update',
};
export const module_api_url = {
  create: 'master_module/createModule',
  get: 'master_module/getAll',
  find: 'master_module/getById?id=',
  update: 'master_module/updateModule',
};
export const category_type_api_url = {
  create: 'master_category_type/createCategoryType',
  get: 'master_category_type/getAll',
  find: 'master_category_type/getById?categoryId=',
  update: 'master_category_type/updateModule',
};
export const category_api_url = {
  create: 'master_category/create',
  get: 'master_category/getAll',
  find: 'master_category/getById?categoryId=',
  update: 'master_category/updateModule',
};

export const general_setup_url = {
  create: '',
  get: '',
  find: '',
  update: '',
};

export const SERVICE_TYPE_GROUP = {
  CREATE: E_SERVICE_BE + 'service-type-group/create',
  FIND: E_SERVICE_BE + 'service-type-group/find/',
  UPDATE: E_SERVICE_BE + 'service-type-group/update',
  LIST: E_SERVICE_BE + 'service-type-group/get-all',
  LIST_BY_DEPARTMENT: E_SERVICE_BE + 'service-type-group/find-by-department/',
};
