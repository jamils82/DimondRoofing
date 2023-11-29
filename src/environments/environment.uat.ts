// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  occBaseUrl:'https://api.uat.estore.nzinstance.fletcherbuilding.com/',
  baseSiteId:"occ/v2/dimond-spa/",
  smartEditAllowOrigin: 'smartedit.uat.estore.dimond.co.nz:443',
  UIsiteURl: 'https://store.uat.dimond.co.nz',
  auth0Domain: 'https://dimond-uat.au.auth0.com',
  auth0Audience : "https://dimond-spartacus-uat.au.com",
  auth0Client_id: 'vKmD9u2kODHQM8rpMmFQHoZqmbVD2LNu',
  auth0Client_secret: 'uik9CwDO-FDxE_gCezgm-hAGQ3fpgO-Y5CTGmQx9s6sFVsQ2V2mg82cziR0aG0_Q',
  logoutAuth0Domain: 'https://dimond-uat.au.auth0.com',
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
