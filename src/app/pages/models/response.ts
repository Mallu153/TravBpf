export interface ResponseData {
  data?: any;
  errors?: any;
  message: string;
  status: number;
}

export class ApiResponse {
  status: number;
  data: any;
  message: string;
  errors?: any;
}

/**
 * An object used to get page information from the server
 */
export class Page {
  // The number of elements in the page
  size: number = 0;
  // The total number of elements
  totalElements: number = 0;
  // The total number of pages
  totalPages: number = 0;
  // The current page number
  pageNumber: number = 0;
}

/**
 * An array of data with an associated page object used for paging
 */
export class PagedData<T> {
  data = new Array<T>();
  page = new Page();
}

export class ApiResponsePaging {
  message: string;
  status: number;
  data: any[];
  errors?: any[];
  currentPage: number;
  totalElements: number;
  totalPages: number;
}
