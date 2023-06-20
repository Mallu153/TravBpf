export class Markup {
  id?: number;
  productId: number;
  dealName: string;
  dealType: string;
  dealEffectOnType: string;
  emdsType?: string;
  customerRating: number;
  customerType: number;
  customerCategory: number;
  customerId: number;
  customerSiteId?: number;
  loginUserId: number;
  companyId: number;
  costCenterId: number;
  locationId: number;
  fareType: number;
  effectiveFrom: Date;
  effectiveTo: Date;
  travelDate: string;
  basePrice: string;
  taxes: number;
  rank: number;
  minAndMaxCheck: string;
  maxValue?: number;
  minValue?: number;
  dealDescription: string;
  offlineFlight: string;
  supplierId: number;
  iataId: number;
  officeId: number;
  airlineName: number;
  typeOfJourny: string;
  codeShare: string;
  dealId: number;
  percentage?: number;
  amount?: number;
  paxType?: number;
  cabin?: number;
  rbd?: number;
  offlineRoute?: number;
  departureDay?: string;
  flightNumber?: string;
  departureTime?: string;
  roundOff?: number;
  anxServiceCategory?: string;
  bookingSubType?: number;
  bookingType?: number;
  dealCategoryType?: string;
  dealCode?: string;
  fmCode?: string;
  hotelCode?: string;
  hotelPerUnit?: string;
  hotelSupplierId?: number;
  hotelType?: string;
  isIncentiveTemplate?: string;
  markupStatus?: string;
  dealsId?: number;
  dpId?: number;
  reasonForReject?: string;
  refundOldMarkup?: string;
  routeRefId?: string;
  routeType?: number;
  tourCode?: string;
}

export class MarkupSend {
  deals: Markup;
}
export class RouteList {
  routeId?: any;
  routeName: string;
  routeType: string;
  routeDetails?: any;
  marketingCarrier?: string;
  opratingCarrier?: string;
}
export class RouteDetails {
  routeId?: any;
  from: string;
  fromName: string;
  groupFrom: string;
  groupTo: string;
  marketingCarrier: string;
  opratingCarrier: string;
  to: string;
  toName: string;
  country?: string;
  status?: string;
}
export class Route {
  routeId?: number;
  routeName: string;
  routeType: string;
  routeDetails?: string;
  marketingCarrier?: string;
  opratingCarrier?: string;
  segNo?: number;
  groupTo?: boolean;
  groupFrom?: boolean;
  status?: string;
}
export class Region {
  RegionId?: number;
  name?: string;
  code?: string;
  countryRegionType?: string;
  allCountriesCheck: string;
  productId: number;
  category: number;
  countryList?: string;
  status?: string;
}

export interface ApiResponseRegions {
  regionId: number;
  productId: number;
  allCountriesCheck: string;
  category: number;
  countryList: CountryList[];
  countryRegionType: null;
  createdBy: null;
  createdDate: null;
  modifiedBy: null;
  modifiedDate: null;
  status: string;
  code: string;
  name: string;
}

export interface CountryList {
  id: string;
  iso2: string;
  iso3: string;
  name: string;
  status: string;
  description: string;
}
export interface AirportSearchResponse {
  id: number;
  name: string;
  code: string;
  countryCode: string;
  country: string;
  type: string;
  cityCode: string;
  city: string;
  status: boolean;
  timeZone: string;
  createdBy: number;
  createdDate?: Date;
  updatedBy: number;
  updatedDate?: string;
}

export interface AirLine {
  createdBy: null;
  createdDate: null;
  udatedBy: string;
  updatedDate: Date;
  id: number;
  name: string;
  code: string;
  shortCode2Digit: string;
  shortCode3Digit: string;
  parentAirline: string;
  airLineType: string;
  status: boolean;
}

export interface ResourcesAssignment {
  templateName: string;
  resourceId?:number;
  teamId: number;
  productId: number;
  description: string;
  rank: number;
  effectFromDate: Date;
  effectToDate: Date;
  travelDate: Date;
  bookingTypeId: number;
  cabinClassId: number;
  paxCount: number;
  typeOfJourneyId: number;
  hotelNoOfDays?: number;
  hotelDestination?: string;
  hotelRoomsCount?: number;
  hotelNightsCount?: number;
  budgetRange: string;
  budgetMinAmount: number;
  budgetMaxAmount: number;
  companyId: number;
  locationId: number;
  costCenterId: number;
  userId: number;
  customerId: number;
  customerCategoryId: number;
  customerRatingId: number;
  customerTypeId: number;
  flightBookingTypeId: number;
  ticketType: string;
  routeRefId: string[];
  approvedStatus: string;
  recordStatus: string;
  createdBy?: number;
  updatedBy?: number;
  assignmentStatus:number;
}
