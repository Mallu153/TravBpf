import { environment } from 'environments/environment';
const BACKEND_URL = environment.BPF;
const ES_SERVICE_URL = environment.BPF;
const E_SERVICE_BE = environment.SERVICE_CONFIG;
const SYSTEM_MASTER = environment.systemMaster;
E_SERVICE_BE;
export const MASTER_CONSTANTS = {
  GET_TEAM: E_SERVICE_BE + 'team/list',
  GET_STATUS: E_SERVICE_BE + 'status/list',
  GET_STATUS_OWNER_MAPPING_BY_ORGANIZATION: E_SERVICE_BE + 'status-owner-mapping/get-all-by-organization?organization=',
  GET_STATUS_OWNER_MAPPING_BY_DEFAULT_STATUS: E_SERVICE_BE + 'status-owner-mapping/get-team-info?deafultStatus=',
  GET_LANGUAGES: SYSTEM_MASTER + 'master/master_language/all',
  GET_FIELD_TYPES: SYSTEM_MASTER + 'master/master_field_type/all',
  SEARCH_QUESTION: E_SERVICE_BE + 'question/search-questions/',
  CREATE_QUESTION: E_SERVICE_BE + 'question/search-questions/',
};
export const MODULE = {
  SRTYPE: 'SRTYPE',
  FROM_FAQ: 'FAQ',
  FROM_SURVEY: 'SURVEY',
};
export const QUESTION = {
  CREATE: E_SERVICE_BE + 'question/create-question',
};
