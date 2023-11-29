// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  occBaseUrl:'https://api.qa.estore.nzinstance.fletcherbuilding.com/',
  baseSiteId:"occ/v2/dimond-spa/",
  smartEditAllowOrigin: 'api.crre-fletcherb3-d2-public.model-t.cc.commerce.ondemand.com:443',
  UIsiteURl: 'https://store.qa.dimond.co.nz',
  auth0Domain: 'https://dimond-qa.au.auth0.com',
  auth0Audience : "https://dimond-spartacus-qa.au.com",
  auth0Client_id: 'b5Osbq63YfSFd0y4rhgpJWyfI1H2jhnZ',
  auth0Client_secret: 'Ddm_v6eZIBL1sId4Psolg85Fh5bwM4XHowQnSssZWulT02iL0J4BXhx07y2xkXp4',
  logoutAuth0Domain: 'https://dimond-qa.au.auth0.com',
  googleApiKey : 'AIzaSyADAiEVzbZjIauGB1k4H28FxJ56SMoHWEg',

  //Core Logic Details
  coreLogicApiUrl :'api-uat.corelogic.asia',
  coreLogicClientId : 'LBBZEu0AK7bWjcJvlOHFlDSOrOY2Ss8e',
  coreLogicClientSecret : 'OiAwsI6y4ntiV201',
  coreLogicStreetMapUrl : 'https://api-uat.corelogic.asia/geospatial/nz/basemaps/streetmap/MapServer',
  coreLogicAddressApiUrl: 'https://uat.addressright.co.nz/',
  coreLogicAddressApikey : '292633_xvse2ZwXyJ6gqhMV',

  cdsScripts : [
    'https://qa.product-config.net/cfg/fletcher/js/OrbitControls-min.js',
    'https://qa.product-config.net/cfg/fletcher/js/cds-d2d-min.js',
    'https://qa.product-config.net/cfg/fletcher/js/cds-fletcher-min.js',
  ],

  orders_embed_url: '/embed/dashboards/building_products::orders',
  deliveries_embed_url: '/embed/dashboards/building_products::deliveries'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
