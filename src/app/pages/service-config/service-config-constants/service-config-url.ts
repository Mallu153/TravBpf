export const service_type_url = {
  parentLov: 'master/master_parent/all',
  create: 'service_type/create',
  get: 'service-type-headers',
  find: 'service-type-header/',
  findDynamicDataByHeaderId: 'service_type/get-form-data-by-id?id=',
  update: 'service_type/edit',
};

export const SERVICE_TYPE_HEADER = {
  CREATE: 'service-type-header',
  UPDATE: 'modify/service-type-header/',
  GET: 'service-type-headers',
};
export const SERVICE_TYPE_ATTACHMENTS = {
  UPDATE_ATTACHMENTS: 'service_attachments/saveAndUpdate',
  GET_BY_HEADER: 'service_attachments/headerId?headerId=',
};
export const SERVICE_TYPE_FIELDS_LINES = {
  GET_BY_HEADER: 'service-type-lines/',
  UPDATE_FIELDS: 'modify/service-type-lines',
};
export const SERVICE_TYPE_DOCUMENTS = {
  GET_BY_HEADER: 'service_documents/headerId?headerId=',
  UPDATE_DOCUMENTS: 'service_documents/saveAndUpdate',
};
export const SERVICE_TYPE_PRICING = {
  GET_BY_HEADER: 'service_pricing/headerId?headerId=',
  UPDATE_PRICING: 'service_pricing/saveAndUpdate',
};

export const SERVICE_TYPE_SURVEY = {
  GET_BY_HEADER: 'survey/get-survey-by-reference/',
  UPDATE_PRICING: 'survey/create-or-update-survey',
};

export const SERVICE_TYPE_FAQ = {
  GET_BY_HEADER: 'faq/get-faq-by-reference/',
  UPDATE_PRICING: 'faq/create-or-update-faqs',
};
export const SERVICE_TYPE_ASSIGNMENT = {
  GET_BY_HEADER: 'service_assignment/headerId?headerId=',
  UPDATE_ASSIGNMENT: 'service_assignment/saveAndUpdate',
};
export const field_url = {
  fieldTypeLov: 'gen/master_field_type/all',
  create: 'create-config',
  get: 'get-all-config',
  find: 'get-config/',
  update: 'modify-config/',
};
export const service_register_url = {
  create: 'create',
  get: 'list',
  find: 'id?id=',
  update: 'edit',
};
export const SERVICE_MENU_TYPE = {
  CREATE: 'service_menu_type/create',
  UPDATE: 'service_menu_type/update',
  GET_BY_ID: 'service_menu_type/get-by-id?serviceMenuTypeId=',
  GET: 'service_menu_type/get',
};

export const SERVICE_MENU_TYPE_LINES = {
  CREATE_OR_UPDATE: 'service-menu-type-lines/create-or-update',
  GET_BY_SERVICE_MENU_TYPE: 'service-menu-type-lines/get-by-service-menu-type?serviceMenuType=',
  GET: 'service_menu_type/get',
};
