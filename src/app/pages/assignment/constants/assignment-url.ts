export const master_data_url={
  company: 'company/master_company/all',
  location: 'company/master_location_branch/all',
  costcenter: 'costcenter/list',
  customertype: 'company/master_type/all',
  category: 'company/master_category/all',
  rating: 'company/master_rating/all',
  product: 'gen/master_products/all',
  customerName: 'customer/all',
  supplier: 'customer/supplier/all',
  //userName: 'all',
  userName: 'userManagement/getAllUsers',
  fareType: 'gds/master_pricing_entry_type/all',
  tax: 'gds/master_fl_tax_types/all',
  paxtype: 'gds/master_pax_type/all',
  rbd: 'gds/master_rbd/all',
  officeId: 'gds/office-ids/all',
  airlinescode: 'gds/airline-master/all',
  cabin: 'company/master_class/all',
  bookingtype: 'gds/master_booking_type/all',
  iataids: 'gds/iata-ids/all',
  getTeamList: 'team/list',
  getorganizationLov: 'organization/list',
  getbusinessunitLov: 'businessunit/list',
  getcostcenterLov: 'costcenter/list',
  getLocationLov: 'location/list',
};

export const route_const_url = {
  create: 'route/create',
  get: 'route/all',
  find: 'route/getbyid?routeId=',
  update: 'route/edit',
  airline: 'gds/airline-master/all',
  airport: 'gds/airport/all',
  region: 'region/all',
  regionByNameSearch:'region/',
  airportByNameSearch:'gds/airport/name/',
  airlineByName:'gds/airline-master/name/'
};
export const resources_assignment_url={
create:'add-resource',
find:'fetch-resource/',
getList:'resources',
update:'modify-resource/',
assignmentStatus: 'get-status-by-module/',
};

export const hotel_master_url={
  hotelrating: 'htl/master_hotel_rating/all',
  propertyType:'htl/master_property_type/name/',
  getAllPropertyTypeList:'htl/master_property_type/all',
  destination:'gds/airport/name/'
};

