import { environment } from 'src/environments/environment';

const apiEndpointURL = environment.occBaseUrl + environment.baseSiteId;

export const FIND_STORE = {
  url: apiEndpointURL + 'bpStores?',
};
export const CHANGE_BRANCH = {
  url: apiEndpointURL + 'b2busers/update-branch?branchName=',
};
export const DIRECTION_URL = {
  url: 'https://www.google.com/maps/dir/Current+Location/',
};

export const POST_CreateAccountURL = {
  url: apiEndpointURL + 'webforms/createAccount',
};

export const listOfAccounts = {
  url: apiEndpointURL + 'b2busers/listOfAccounts',
};
export const changeListOfAccounts = {
  url: apiEndpointURL + 'b2busers/',
};

export const updateListOfAccounts = {
  url: apiEndpointURL + 'b2busers/selectedAccount',
};
export const AUTH0_GET_TOKEN = {
  url: environment.auth0Domain + '/oauth/token',
};

export const GET_PRODUCT_SEARCH = {
  url: apiEndpointURL + 'bpProducts/search?',
};

// export const GET_GLOBAL_SEARCH = {
//   url: apiEndpointURL + 'products/autoSearch/SearchBox',
// };

export const categorySearchUrl = {
  url: apiEndpointURL + 'bpProducts/search?catCode=',
};

export const Logout_Revoke = {
  url: environment.occBaseUrl + 'authorizationserver/oauth/revoke',
};

export const GET_MYTEAM_LIST_ENDPOINT = {
  url: apiEndpointURL + 'users/current/bpOrgCustomers?',
};

export const UPDATESTATUS_MYTEAM_LIST_ENDPOINT = {
  url: apiEndpointURL + 'users/current/bpOrgCustomers/',
};

export const CREAT_MYTEAM_MEMBER_ENDPOINT = {
  url: apiEndpointURL + 'users/current/bpOrgCustomers',
};

export const UPDATE_MYTEAM_MEMBER_ENDPOINT = {
  url: apiEndpointURL + 'users/current/bpOrgCustomers/',
};

export const MYTEAM_MEMBER_SORTING_ENDPOINT = {
  url: apiEndpointURL + 'users/current/bpOrgCustomers?sort=',
};

export const AVAILABLE_ORGUNIT_ENDPOINT = {
  url: apiEndpointURL + 'users/current/availableOrgUnitNodes?',
};

export const GETALL_ORGUNIT_ENDPOINT = {
  url: apiEndpointURL + 'users/current/orgUnitsRootNodeTree?',
};

export const GET_ALL_ROLES_ENDPOINT = {
  url: apiEndpointURL + 'users/current/getRoles',
};

export const GET_PRODUCT_DETAILS = (productCode: any) => {
  return { url: apiEndpointURL + 'bpProducts/' + productCode + '?fields=FULL' };
};

export const GET_RELATED_PRODUCTS = {
  url: apiEndpointURL + 'bpProducts/relatedProducts/',
};

export const GET_CURRENT = () => {
  return {
    url: apiEndpointURL + `orgUsers/current`,
  };
};
export const GET_CART_DETAILS = {
  url: apiEndpointURL + 'users/current/carts',
};

export const ADD_TO_CART = (cartId?: any) => {
  return {
    url: apiEndpointURL + `orgUsers/current/carts/${cartId}/bpEntries`,
  };
};

export const Saved_Cart_For_Later = (cartId?: any) => {
  return {
    url: apiEndpointURL + `users/current/carts/${cartId}/save?`,
  };
};

export const Get_Saved_Carts = () => {
  return {
    url: apiEndpointURL + `users/current/carts?savedCartsOnly=true&fields=carts(DEFAULT,saveTime,user,name,description)`,
  };
};
export const Cart_Clone_And_Save = (cartId?: any) => {
  return {
    url: apiEndpointURL + `users/current/carts/${cartId}/clonesavedcart?name=`,
  };
};
export const Saved_Cart_Url: any = (cartId?: any) => {
  return {
    url: apiEndpointURL + `users/current/carts/${cartId}`,
  };
};

export const GET_SAVED_CART = (cartId?: any) => {
  return {
    url: apiEndpointURL + `users/current/carts/${cartId}/savedcart`,
  };
};

export const GET_CART_LIST_ENDPOINT = {
  url: apiEndpointURL + 'users/current/bpCarts/',
};

export const DELETE_CART_ENTRY_ENDPOINT = {
  url: apiEndpointURL + 'users/current/carts/',
};

export const UPDATE_CART_ENTRY_ENDPOINT = {
  url: apiEndpointURL + 'orgUsers/current/carts/',
};

export const CHECKOUT_REVIEW_ORDER_ENDPOINT = {
  url: apiEndpointURL + 'checkout/updateAndReview',
};

export const GET_ORDER_REVIEW = {
  url: apiEndpointURL + 'users/current/carts/',
};

export const UPDATE_ORDER_REVIEW = {
  url: apiEndpointURL + 'checkout/updateAndReview/',
};

export const Validate_Order_Date_time = {
  url: apiEndpointURL + 'checkout/validateDeliveryPickUpDate',
};

export const GET_Checkout_Details_URL = (cartId?: any) => {
  return {
    url:
      apiEndpointURL +
      `checkout/getDeliveryPickupInfo?cartId=${cartId}&fields=deliveryMinLeadTime,pickUpMinLeadTime,message,pointOfService(FULL)`,
  };
};
export const GET_Delivery_Modes_URL = (cartId?: any) => {
  return {
    url: apiEndpointURL + `users/current/carts/${cartId}/deliverymodes`,
  };
};
export const PLACE_ORDER = {
  url: apiEndpointURL + 'orgUsers/current/bpOrders?fields=BASIC&cartId=',
};

export const GET_ADDRESS_INFO = {
  url: apiEndpointURL + 'checkout/getAddressInfo?fields=FULL',
};

export const GET_PRODUCT_CDS_DETAILS = (productCode: any) => {
  return {
    url:
      apiEndpointURL +
      'bpProducts/' +
      productCode +
      '/cdsDefaultConfigJson/?fields=FULL',
  };
};

export const GET_FLASHING_CONFIGURATION = (productCode: any) => {
  return {
    url:
      apiEndpointURL +
      'products/' +
      productCode +
      '/configurator/textfield?fields=FULL',
  };
};

export const GET_ORDER_DETAIL = {
 url: apiEndpointURL + 'orgUsers/current/orgUnits/bporders/',
};

export const GET_ORDER_HISTORY_SEARCH_STATUSES = {
  url: apiEndpointURL + 'orgUsers/current/bpOrders/search/statuses',
};

export const GET_ORDER_HISTORY_SEARCH_RESULTS = {
  url: apiEndpointURL + 'orgUsers/current/bpOrders/search',
};

export const ORDER_HISTORY_SORTING_ENDPOINT = {
  url: apiEndpointURL + 'orgUsers/current/bpOrders/search?sort=',
};

export const MYACCOUNT_GET_INVOICE_CREDIT = {
  url:
    apiEndpointURL +
    'orgUsers/current/account/summery/details/documents?fields=FULL',
};

export const INVOICE_CREDIT_SORTING_ENDPOINT = {
  url: apiEndpointURL + 'orgUsers/current/account/summery/details/documents?sort=',
};

export const GET_INVOICE_CREDIT_STATUSES = {
  url: apiEndpointURL + 'orgUsers/current/bpOrders/document/statuses',
};

export const GET_INVOICE_CREDIT_SEARCH_RESULTS = {
  url: apiEndpointURL + 'orgUsers/current/account/summery/details/documents',
};

export const GET_FLASHING_SKU_CODE = {
  url: apiEndpointURL + 'bpProducts/skuProduct',
};

export const PATCH_PREFERENCES_DATA = {
  url: apiEndpointURL + 'b2busers/current',
};

export const GET_DELEVERY_DETAILS = {
  url: apiEndpointURL + 'delivery/consignment/',
};

export const GET_DELEVERY_LIST = (currentPage: any) => {
  return {
    url:
      apiEndpointURL +
      'delivery/consignments?currentPage=' +
      currentPage +
      '&fields=FULL',
  };
};
export const GET_POD_DOWNLOAD = {
  url: apiEndpointURL + 'delivery/attachment/download?documentCode=',
};
