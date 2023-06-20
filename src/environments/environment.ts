// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// DEV
/* export const environment = {
  production: false,
  BPF: 'http://travbpf.dev.com/bpf/',
  QUARTZ: 'http://travbpf.dev.com/quartz/',
  systemMaster: 'http://travbpf.dev.com/system-master/',
  hrurl: 'http://travbpf.dev.com/hr/',
  url: 'http://travbpf.dev.com:84/TravelApi/apis',
  JDBCAPI: 'http://travbpf.dev.com/jdbcapi/',
  LOGINAPP: 'http://travsr.dev.com/pages/login',
  PAXDATA: 'http://travbpf.dev.com/paxdata/',
  ENVIRONMENT_MODE: 'dev',
  USERMANAGEMENT: 'http://travbpf.dev.com/usermanagement/',
  AGENT: 'http://travbpf.dev.com/agent/',
  DEALS: 'http://travbpf.dev.com/deals/',
  ResourcesAssignment: 'http://travbpf.dev.com/resources-assignment/',
  SERVICEREQUEST: 'http://travbpf.dev.com/servicerequest/',
  SERVICE_CONFIG: 'http://travbpf.dev.com/travrconfig/',
  E_SERVICE_DYNAMIC_HOST: 'https://travbpf.dev.com',
};
 */
// UAT

/* export const environment = {
  production: false,
  BPF: 'http://uattravbpf.dev.com/bpf/',
  QUARTZ: 'http://uattravbpf.dev.com/quartz/',
  systemMaster: 'http://uattravbpf.dev.com/system-master/',
  hrurl: 'http://uattravbpf.dev.com/hr/',
  url: 'http://uattravbpf.dev.com:84/TravelApi/apis',
  JDBCAPI: 'http://uattravbpf.dev.com/jdbcapi/',
  LOGINAPP: 'http://uattravsr.dev.com/pages/login',
  PAXDATA: 'http://uattravbpf.dev.com/paxdata/',
  ENVIRONMENT_MODE: 'uat',
  USERMANAGEMENT: 'http://uattravbpf.dev.com/usermanagement/',
  AGENT: 'http://uattravbpf.dev.com/agent/',
  DEALS: 'http://uattravbpf.dev.com/deals/',
  ResourcesAssignment: 'http://uattravbpf.dev.com/resources-assignment/',
  SERVICEREQUEST: 'http://uattravbpf.dev.com/servicerequest/',
  SERVICE_CONFIG: 'http://uattravbpf.dev.com/travrconfig/',
  E_SERVICE_DYNAMIC_HOST: 'https://uattravbpf.dev.com',
}; */

//local developement
export const environment = {
  production: false,
  BPF: '/bpf/',
  QUARTZ: '/quartz',
  systemMaster: '/systemMaster/',
  hrurl: '/hr',
  url: '/TravelApi',
  LOGINAPP: 'http://localhost:4500',
  JDBCAPI: '/jdbcapi/',
  PAXDATA: '/pax_api/',
  ENVIRONMENT_MODE: 'localhost',
  USERMANAGEMENT: '/userManagement/',
  AGENT: '/api_agent/',
  DEALS: '/markup_api/',
  ResourcesAssignment: '/resources-assignment/',
  SERVICEREQUEST: '/service-request/',
  SERVICE_CONFIG: 'serviceConfig/',
  E_SERVICE_DYNAMIC_HOST: 'domainName',
};
