// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  occBaseUrl:'https://api.dev.estore.nzinstance.fletcherbuilding.com/',
  baseSiteId:"occ/v2/dimond-spa/",
  smartEditAllowOrigin: 'api.crre-fletcherb3-d1-public.model-t.cc.commerce.ondemand.com:443',
  UIsiteURl: 'http://localhost:4200',
  auth0Domain: 'https://dimond-dev.au.auth0.com',
  auth0Audience : "https://dimond-spartacus-dev.au.com",
  auth0Client_id: 'bbx43nh1xQBV44ekMzcrcD1bklUZOzp4',
  auth0Client_secret: 'bzxVPI30J7wNgDtaeuXLMaPS2Xzg2uya8EEu4MYRw1ceJeylj146d3pJkkUolPBF',
  logoutAuth0Domain: 'https://dimond-dev.au.auth0.com',
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

  orders_embed_url: '/embed/dashboards/building_products_DEV::orders',
  deliveries_embed_url: '/embed/dashboards/building_products_DEV::deliveries'

};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
