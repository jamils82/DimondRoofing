import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  HostListener,
  Renderer2,
  ElementRef,
  AfterContentChecked,
} from "@angular/core";
import { CurrentProductService } from "@spartacus/storefront";
import { Cart, Product } from "@spartacus/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  DimensionDetails,
  FlashingQuantity,
  ProductQuantity,
  ProductQuantityNonComplex,
  errorMessage,
} from "../CustomProduct";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { RegexConstants } from "../regEx.validator";
import {
  CmsService,
  ActiveCartService,
  MultiCartService,
} from "@spartacus/core";
import { CommonUtils } from "src/app/core/config/utils/utils";
import { ProductService } from "src/app/core/services/product.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UserAccountDetailServiceService } from "src/app/shared/services/user-account-detail-service.service";

declare var cds: any;

@Component({
  selector: "app-custom-product-summary",
  templateUrl: "./custom-product-summary.component.html",
  styleUrls: ["./custom-product-summary.component.scss"],
})
export class CustomProductSummaryComponent
  implements OnInit, OnChanges, AfterContentChecked {
  promotions: any;
  occeBaseUrl = environment.occBaseUrl;
  cdsResponseLog = environment.production;
  productCode: any;
  mainProductCode: any;
  productDetails: any;
  isDesktop: boolean = true;
  isMobile: boolean = false;
  isTablet: boolean = false;
  isRelatedProducts: boolean = false;
  productName: any;
  productId: any;
  unitType: any = "LM";
  accessoriesPrice = 0;
  selectedColour: any = null;
  selectedSkuCode: any = null;
  productImage: any = null;
  currentPrice: any = null;
  skuLookupPrice: any = null;

  totalLength: any;
  totalPrice: any = "0.0";

  selectedTab: any = "";

  hasBundle: boolean = false;
  hasCustomisation: boolean = false;
  disableAddMore: boolean = false;

  bundleList: any = [];

  cuttingValidation: any;

  errorIndex: any = [];
  hasProdRefIndex: any = [];
  hasMinlengthError: any = [];
  hasMaxlengthError: any = [];
  rowIndex = 0;
  productForm: any = new FormGroup({});
  templateProductForm: any = new FormGroup({});
  templateProductPopupForm: any = new FormGroup({});

  noImage = "../../../../assets/images/pdp-noimage.svg";
  relatedProductsData: any = [];
  showWaitCursor = new BehaviorSubject<boolean>(false);

  variantImage: any;
  variantOptions: any = [];
  modalSelectedColour: any;
  prevModalSelectedColour: any;
  hasVariants: boolean = false;
  availableColours: any = [];
  additionalColours: any = [];
  additionalPara: any;
  selectedVariantDetails: any;
  finishedAvailableColours: any = [];
  finishedAvailableColoursTen: any = [];
  isFinishedProduct: boolean = false;
  isTemplateProduct: boolean = false;
  isBundleEnabled: boolean = false;
  addToCartError: any = null;
  addToCartClicked: boolean = false;
  productAttributes: any = null;
  modalBundleForm: any = new FormGroup({});
  selectedIndex: any = null;

  productsCount: number | undefined;
  finishedVariantDetails: any;
  additionalselectedColour: any;
  additionalFinishedColor: boolean = false;
  selectedNavTab: string = "colourInfo";
  setNavTabActive: boolean = false;
  routerLinkString: any;

  cdsDetails: any;
  cartCdsDetails: any;
  initialCDSDetails: any;

  initialPopupCDSDetails: any;
  initialPopupCDSAspects: any = [];
  initialPopupCDSDimension: any = [];
  initialPopupCDSAngle: any = [];

  invalidCDS: boolean = false;
  falshingType: any = [];
  customisationDetails: any;
  aspects: any = [];
  dimension: any = [];
  angle: any = [];
  invalidAngles: any = [];
  newDimension: any;
  newAngle: any;
  dimensionDetails: any;
  firstEdgeConfigValues: any = null;
  lastEdgeConfigValues: any = null;
  colouredSideConfigValues: any;
  noColorProduct: boolean = false;
  customisationAllowed: boolean = false;
  skipSkuLookup: boolean = false;
  is2DView: boolean = true;
  flashingLargerImage: any;
  thumbnailImage: any;
  isComplexProduct: boolean = true;
  @ViewChild("firstEdgeNone") firstEdgeNone: any;
  @ViewChild("firstEdgeNonePopup") firstEdgeNonePopup: any;

  @ViewChild("firstEdgeFlashGuard") firstEdgeFlashGuard: any;
  @ViewChild("firstEdgeFlashGuardPopup") firstEdgeFlashGuardPopup: any;

  @ViewChild("firstEdgeCrush") firstEdgeCrush: any;
  @ViewChild("firstEdgeCrushPopup") firstEdgeCrushPopup: any;

  @ViewChild("firstEdgeOpenCrush") firstEdgeOpenCrush: any;
  @ViewChild("firstEdgeOpenCrushPopup") firstEdgeOpenCrushPopup: any;
  isEditing: boolean = false;
  isReload: boolean = true;

  isFirstEdgeFlashGuardPopup: boolean = false;
  isFirstEdgeCrushPopup: boolean = false;
  isFirstEdgeOpenCrushPopup: boolean = false;

  isLastEdgeFlashGuardPopup: boolean = false;
  isLastEdgeCrushPopup: boolean = false;
  isLastEdgeOpenCrushPopup: boolean = false;

  showFirstEdge: boolean = false;
  showLastEdge: boolean = false;

  @ViewChild("lastEdgeNone") lastEdgeNone: any;
  @ViewChild("lastEdgeNonePopup") lastEdgeNonePopup: any;

  @ViewChild("lastEdgeFlashGuard") lastEdgeFlashGuard: any;
  @ViewChild("lastEdgeFlashGuardPopup") lastEdgeFlashGuardPopup: any;

  @ViewChild("lastEdgeCrush") lastEdgeCrush: any;
  @ViewChild("lastEdgeCrushPopup") lastEdgeCrushPopup: any;

  @ViewChild("lastEdgeOpenCrush") lastEdgeOpenCrush: any;
  @ViewChild("lastEdgeOpenCrushPopup") lastEdgeOpenCrushPopup: any;

  isNoneSelected: boolean = false;

  edgeTreatementConsts: any = {
    none: "None",
    N: "None",
    F: "Flashguard",
    Flashguard: "Flashguard",
    C: "Crush",
    OC: "Open Crush",
    Flashing: "F",
    Crush: "C",
    OpenCrush: "OC",
    "Open Crush": "OC",
    None: "N",
  };

  firstEdgeTreatmentDetails: any = {
    none: {
      data: null,
      selected: false,
    },
    F: {
      data: null,
      selected: false,
    },
    Flashguard: {
      data: null,
      selected: false,
    },
    C: {
      data: null,
      selected: false,
    },
    OC: {
      data: null,
      selected: false,
    },
    Crush: {
      data: null,
      selected: false,
    },
    "Open Crush": {
      data: null,
      selected: false,
    },
  };

  firstEdgeTreatmentData: any = {
    none: null,
    N: null,
    F: null,
    C: null,
    OC: null,
    Flashguard: null,
    Flashing: null,
    Crush: null,
    OpenCrush: null,
    "Open Crush": null,
    None: null,
  };

  firstEdgeTreatmentVals: any = {
    configVal: null,
    gapVal: null,
    dimensionVal: null,
    foldsVal: null,
  };

  lastEdgeTreatmentDetails: any = {
    none: {
      data: null,
      selected: false,
    },
    F: {
      data: null,
      selected: false,
    },
    Flashguard: {
      data: null,
      selected: false,
    },
    C: {
      data: null,
      selected: false,
    },
    OC: {
      data: null,
      selected: false,
    },
    Crush: {
      data: null,
      selected: false,
    },
    "Open Crush": {
      data: null,
      selected: false,
    },
  };

  lastEdgeTreatmentData: any = {
    none: null,
    N: null,
    F: null,
    C: null,
    OC: null,
    Flasgaurd: null,
    Flashing: null,
    Crush: null,
    OpenCrush: null,
    "Open Crush": null,
    None: null,
  };

  lastEdgeTreatmentVals: any = {
    configVal: null,
    gapVal: null,
    dimensionVal: null,
    foldVal: null,
  };

  firstEdgeOpenCrushGapList: any;
  firstEdgeFolds: any;
  lastEdgeFolds: any;
  firstEdgeOpenCrushDefaultGap: any;
  firstEdgeOpenCrushDefaultGapMin: any;
  firstEdgeOpenCrushDefaultGapMax: any;
  lastEdgeOpenCrushGapList: any;
  lastEdgeOpenCrushDefaultGap: any;
  lastEdgeOpenCrushDefaultGapMin: any;
  lastEdgeOpenCrushDefaultGapMax: any;
  isPricingPermission: boolean = true;
  hasPitch: boolean = false;
  hasProfile: boolean = false;
  widthList: any;
  isAngleChanged: boolean = false;
  isPitchChanged: boolean = false;

  prevFirstEdgeVal: any;
  prevLastEdgeVal: any;

  product$: Observable<Product | null> =
    this.currentProductService.getProduct();

  @ViewChild("closeInviteModal") closeInviteModal: any;
  @ViewChild("closebutton") closebutton: any;

  @ViewChild("tabMenu") tabMenu: any;

  @ViewChild("cdsImageContainer") cdsImageContainer: any;
  @ViewChild("visualizationContainer") visualizationContainer: any;

  @ViewChild("cartError") cartError: any;
  @ViewChild("productDesc") productDesc: any;

  keyAspect: boolean = false;
  savedImage: any = null;
  disableCart: boolean = false;
  isInit: boolean = false;
  bundleReferenceInfoContent: any;
  productLengthInfoContent: any;
  jobReferenceInfoContent: any;
  customisationInfoContent: any;
  bundleInfoContent: any;
  referenceInfoContent: any;
  breadcrumbTop: any = '40px';
  isColorFirstLoad: boolean = true;
  @HostListener("window:scroll", ["$event"])
  checkScrollPosition() {
    const imageHeight = this.el.nativeElement.querySelector('.image-container')?.offsetHeight;
    this.setNavTabActive = window?.innerWidth <= 1024 && window.scrollY > imageHeight + 20;
    const header: any = document.querySelector('header')
    const breadcrumbsHeight = this.el.nativeElement.querySelector('app-custom-breadcrum').offsetHeight;
    const containerTop = document.querySelector('#tabMenu') as HTMLElement;
    const constHeight = header?.offsetHeight + breadcrumbsHeight;
    if (this.setNavTabActive) {
      containerTop.style.top = `${constHeight}px`;
    } else {
      containerTop.style.top = `0`;
    }
    this.cdr.detectChanges();
  }

  screenWidth: any;

  loadAPI: Promise<any> | undefined;

  cdsRenderer: any;
  isCDSAvailable: boolean = false;
  showToast: boolean = false;
  errorMessage: any = errorMessage;
  invalidPitch: boolean = false;
  firstEdgeTreatment = "";
  nextScreen: boolean = false;

  prevFieldVal: any = "";
  nextFieldVal: any = "";
  prevFieldName: any = "";
  nextFieldName: any = "";

  hasFlashingModal: boolean = false;
  showProfile: boolean = false;
  showPitch: boolean = false;
  showWidth: boolean = false;
  currentDimensionAngle: any = 0;
  prevDimensionAngle: any = 0;
  nextDimensionAngle: any = 0;

  initialWidth: any;
  initialFirstEdgeTreatmentVals: any;
  initialLastEdgeTreatmentVals: any;
  initialFlashingResponse: any;
  initialFirstEdgeTreatmentCode: any = "n";
  initialLastEdgeTreatmentCode: any = "n";

  totalWidth: any = [];
  totalBends: any = [];
  selectedTotalWidth: any;
  selectedTotalBends: any;
  firstEdgeTreatmentCode: any;
  lastEdgeTreatmentCode: any;

  poaFileData: any;
  validForm: boolean = true;
  formErrors: any = [];
  resetFileUpload: boolean = false;
  isFormCreated: boolean = false;
  isLoaded = false;
  isFirstLoad: any = false;
  colouredSideInfoContent: any;
  sessionSelectedColour: any = {};
  cdsColours: any = {
    topright: "topRight",
    topleft: "topLeft",
    bottomright: "bottomRight",
    bottomleft: "bottomLeft",
  };
  showAlreadySelectedOption: boolean = false;
  breadcrumbData: any = [];
  isColorSelected: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private productService: ProductService,
    private cmsService: CmsService,
    private currentProductService: CurrentProductService,
    private userProfileDetailsService: UserAccountDetailServiceService,
    protected multiCartService: MultiCartService,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  async ngOnInit() {
    this.isPricingPermission =
      await this.userProfileDetailsService.isPricingPermission();
    this.onPageRefresh();
    this.setNavTabActive = false;
    this.keyAspect = false;
    this.invalidCDS = false;
    this.screenWidth = window.innerWidth + "px";
    this.isFormCreated = false;
    localStorage.removeItem("prevSelectedColour");
    // Get the product code from URL
    // this.routerLinkString = this.router?.url?.split('/');
    this.product$.subscribe((product: any) => {
      this.productCode = this.mainProductCode = product?.code;
      if (!this.isNullOrEmpty(this.productCode)) {
        this.getProductDetails();
      }
    });

    // Static Content provided by Hybris
    this.cmsService
      .getComponentData("AdditionalColoursParagraphComponent")
      .subscribe((res: any) => {
        this.additionalPara = res;
      });
    //content for Colored side tooltip
    this.cmsService
      .getComponentData("ColouredSideInformationComponent")
      .subscribe((res: any) => {
        this.colouredSideInfoContent = res?.content;
      });

    //content for Bundle Reference tooltip
    this.cmsService
      .getComponentData("BundleReferenceParagraphComponent")
      .subscribe((res: any) => {
        this.bundleReferenceInfoContent = res?.content;
      });
    //content for Product Length tooltip
    this.cmsService
      .getComponentData("ProductLengthParagraphComponent")
      .subscribe((res: any) => {
        this.productLengthInfoContent = res?.content;
      });
    //content for Job Reference tooltip
    this.cmsService
      .getComponentData("JobReferenceParagraphComponent")
      .subscribe((res: any) => {
        this.jobReferenceInfoContent = res?.content;
      });
    //content for Customisation tooltip
    this.cmsService
      .getComponentData("FlashingCustomisationParagraphComponent")
      .subscribe((res: any) => {
        this.customisationInfoContent = res?.content;
      });
    //content for Bundle tooltip
    this.cmsService
      .getComponentData("ProductBundleParagraphComponent")
      .subscribe((res: any) => {
        this.bundleInfoContent = res?.content;
      });
    //content for Reference tooltip
    this.cmsService
      .getComponentData("ProductReferenceParagraphComponent")
      .subscribe((res: any) => {
        this.referenceInfoContent = res?.content;
      });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.cdsDetails?.firstChange) {
      this.cdr.reattach();
    }
  }

  initLoadCDS() {
    if (this.isFirstLoad) {
      this.showWaitCursor.next(true);
      if (this.isTemplateProduct) {
        if (this.isBundleEnabled) {
          this.productService
            .getProductCDSDetailsResults(this.productCode)
            .subscribe(
              (cdsResponse: any) => {
                this.isFirstLoad = null;
                const pitchVal = cdsResponse?.pitch?.originalPitch;
                if (!this.isNullOrEmpty(pitchVal) || parseInt(pitchVal) == 0) {
                    cdsResponse.pitch.requestedPitch = pitchVal;
                  }
                this.cdsDetails = cdsResponse;
                this.updateProfile();
                if (!this.isCDSAvailable) {
                  this.checkCDSScripts();
                } else {
                  this.renderCDSImage(this.cdsDetails);
                }
              },
              (error: any) => {
                this.addToCartError = errorMessage;
                this.isFirstLoad = null;
                this.showWaitCursor.next(false);
              }
            );
        }
      }
    }
  }

  ngAfterContentChecked(): void {
    if (!this.isInit && this.cdsDetails && !this.isLoaded) {
      this.isInit = true;
      this.showWaitCursor.next(true);
      let values: any = null;
      let isFirst: boolean = true;

      var interval = setInterval(() => {
        if (typeof cds !== "undefined") {
          this.cdsRenderer = cds;

          if (!this.isCDSAvailable) {
            cds?.fletcher?.init("visualization-container");

            this.isInit = false;
            this.isLoaded = true;
            this.isFirstLoad = true;
            this.initLoadCDS();
          }
          if (!this.isNullOrEmpty(this.cdsDetails)) {
            this.isCDSAvailable = true;

            const firstEdgeVals = this.cdsDetails?.extensions?.filter(
              (ext: any) => {
                if (ext?.extensionType?.toLowerCase() == "leading")
                  return ext?.values;
              }
            );
            const lasEdgeVals = this.cdsDetails?.extensions?.filter(
              (ext: any) => {
                if (ext?.extensionType?.toLowerCase() == "trailing")
                  return ext?.values;
              }
            );

            const prevFirstEdgeVal = this.getSubType(firstEdgeVals);
            const prevLastEdgeVal = this.getSubType(lasEdgeVals);

            this.resetEdgeValues(prevFirstEdgeVal, prevLastEdgeVal);
          }
          clearInterval(interval);
        }
      });

      ///const prevFirstEdgeVal = this.firstE?.
    } else if (this.isFirstLoad == null) {
      this.showWaitCursor.next(false);
    }
  }

  // Get Subtype Values
  getSubType(edgeVals: any): any {
    const subType = edgeVals && edgeVals[0] ? edgeVals[0]?.values?.subType : "";

    switch (subType) {
      case "softedge":
      case "flashguard":
        return "flashguard";
      case "closed":
        return "crush";
      case "open":
        return "opencrush";
      default:
        return;
    }
  }

  resetEdgeValues(prevFirstEdgeVal: any, prevLastEdgeVal: any): void {
    if (this.isEditing) {
      return;
    }
    this.firstEdgeNone.nativeElement.checked = true;
    this.lastEdgeNone.nativeElement.checked = true;

    let edgeVals: any;
    setTimeout(() => {
      switch (prevFirstEdgeVal?.toLowerCase()) {
        case "f":
        case "flashguard":
          this.firstEdgeFlashGuard.nativeElement.checked = true;
          if (this.firstEdgeFlashGuardPopup?.nativeElement) {
            this.renderer.setProperty(
              this.firstEdgeFlashGuardPopup.nativeElement,
              "checked",
              true
            );
          }
          this.updateEdgeValues(null, "F", true);
          edgeVals = this.firstEdgeConfigValues?.filter(
            (item: any) => item?.value?.toLowerCase() == "flashguard"
          );
          if (edgeVals && edgeVals?.length > 0) {
            this.getFirstEdgeValues(
              null,
              edgeVals[0]?.code,
              edgeVals[0]?.value
            );
          }
          break;
        case "c":
        case "crush":
          this.firstEdgeCrush.nativeElement.checked = true;
          if (this.firstEdgeCrushPopup?.nativeElement) {
            this.renderer.setProperty(
              this.firstEdgeCrushPopup.nativeElement,
              "checked",
              true
            );
          }
          edgeVals = this.firstEdgeConfigValues?.filter(
            (item: any) => item?.value?.toLowerCase() == "crush"
          );
          this.updateEdgeValues(null, "C", true);
          if (edgeVals && edgeVals?.length > 0) {
            this.getFirstEdgeValues(
              null,
              edgeVals[0]?.code,
              edgeVals[0]?.value
            );
          }
          break;
        case "oc":
        case "oopencrush":
          this.firstEdgeOpenCrush.nativeElement.checked = true;
          if (this.firstEdgeOpenCrushPopup?.nativeElement) {
            this.renderer.setProperty(
              this.firstEdgeOpenCrushPopup.nativeElement,
              "checked",
              true
            );
          }
          edgeVals = this.firstEdgeConfigValues?.filter((item: any) => {
            item?.value?.toLowerCase() == "open crush" ||
              item?.value == "opencrush";
          });
          this.updateEdgeValues(null, "OC", true);
          if (edgeVals && edgeVals?.length > 0) {
            this.getFirstEdgeValues(
              null,
              edgeVals[0]?.code,
              edgeVals[0]?.value
            );
          }
          break;
        default:
          this.firstEdgeNone.nativeElement.checked = true;
          if (this.firstEdgeNonePopup?.nativeElement) {
            this.renderer.setProperty(
              this.firstEdgeNonePopup.nativeElement,
              "checked",
              true
            );
          }
          edgeVals = this.firstEdgeConfigValues?.filter(
            (item: any) => item?.value == "none"
          );
          this.updateEdgeValues(null, "N", true);
          if (edgeVals && edgeVals?.length > 0) {
            this.getFirstEdgeValues(
              null,
              edgeVals[0]?.code,
              edgeVals[0]?.value
            );
          }
          break;
      }

      switch (prevLastEdgeVal?.toLowerCase()) {
        case "f":
        case "flashguard":
          // console.log('flashguard running');
          this.lastEdgeFlashGuard.nativeElement.checked = true;
          if (this.lastEdgeFlashGuardPopup?.nativeElement) {
            this.renderer.setProperty(
              this.lastEdgeFlashGuardPopup.nativeElement,
              "checked",
              true
            );
          }
          this.updateEdgeValues(null, "F", false);
          edgeVals = this.lastEdgeConfigValues?.filter(
            (item: any) => item?.value?.toLowerCase() == "flashguard"
          );
          if (edgeVals && edgeVals?.length > 0) {
            this.getLastEdgeValues(null, edgeVals[0]?.code, edgeVals[0]?.value);
          }
          break;
        case "c":
        case "crush":
          this.lastEdgeCrush.nativeElement.checked = true;
          if (this.lastEdgeCrushPopup?.nativeElement) {
            this.renderer.setProperty(
              this.lastEdgeCrushPopup.nativeElement,
              "checked",
              true
            );
          }
          edgeVals = this.lastEdgeConfigValues?.filter(
            (item: any) => item?.value?.toLowerCase() == "crush"
          );
          this.updateEdgeValues(null, "C", false);
          if (edgeVals && edgeVals?.length > 0) {
            this.getLastEdgeValues(null, edgeVals[0]?.code, edgeVals[0]?.value);
          }
          break;
        case "oc":
        case "oopencrush":
          this.lastEdgeOpenCrush.nativeElement.checked = true;
          if (this.lastEdgeOpenCrushPopup?.nativeElement) {
            this.renderer.setProperty(
              this.lastEdgeOpenCrushPopup.nativeElement,
              "checked",
              true
            );
          }
          edgeVals = this.lastEdgeConfigValues?.filter((item: any) => {
            item?.value?.toLowerCase() == "open crush" ||
              item?.value == "opencrush";
          });
          this.updateEdgeValues(null, "OC", false);
          if (edgeVals && edgeVals?.length > 0) {
            this.getLastEdgeValues(null, edgeVals[0]?.code, edgeVals[0]?.value);
          }
          break;
        default:
          this.lastEdgeNone.nativeElement.checked = true;
          if (this.lastEdgeNonePopup?.nativeElement) {
            this.renderer.setProperty(
              this.lastEdgeNonePopup.nativeElement,
              "checked",
              true
            );
          }
          edgeVals = this.lastEdgeConfigValues?.filter(
            (item: any) => item?.value == "none"
          );
          this.updateEdgeValues(null, "N", false);
          if (edgeVals && edgeVals?.length > 0) {
            this.getLastEdgeValues(null, edgeVals[0]?.code, edgeVals[0]?.value);
          }
          break;
      }
    }, 200);
  }

  createProductForm(status?: any): void {
    this.totalLength = null;
    this.totalPrice = "0.0";
    this.selectedTab = "";
    this.hasBundle = false;
    this.hasCustomisation = false;
    this.disableAddMore = false;
    this.bundleList = [];
    this.errorIndex = [];
    this.hasProdRefIndex = [];
    this.rowIndex = 0;
    this.productForm = new FormGroup({});
    this.addToCartError = null;

    this.productForm = this.formBuilder.group({
      bundling: [""],
      productQuantity: this.formBuilder.array([]),
      jobReference: ["", [Validators.pattern(RegexConstants.JOB_REFERENCE)]],
    });

    this.templateProductForm = this.formBuilder.group({
      customisation: [""],
      colouredSide: [""],
      fold: [""],
      pitch: ["", [Validators.pattern(RegexConstants.NUMBER_1_99)]],
      profile: [""],
      dimensionDetails: this.formBuilder.array([]),
      dimensions: this.formBuilder.array([]),
      angles: this.formBuilder.array([]),
      width: this.formBuilder.array([]),
      height: this.formBuilder.array([]),
      firstEdgeTreatment: [""],
      firstEdgeTreatmentCode: [""],
      firstEdgeTreatmentDetails: this.formBuilder.array([]),
      lastEdgeTreatment: [""],
      lastEdgeTreatmentCode: [""],
      lastEdgeTreatmentDetails: this.formBuilder.array([]),
      productQuantity: this.formBuilder.array([]),
      jobReference: ["", [Validators.pattern(RegexConstants.JOB_REFERENCE)]],
      totalWidth: ["", [Validators.required]],
      totalBends: ["", [Validators.required]],
    });

    this.templateProductPopupForm = this.formBuilder.group({
      customisation: [""],
      colouredSide: [""],
      fold: [""],
      pitch: ["", [Validators.pattern(RegexConstants.NUMBER_1_99)]],
      profile: [""],
      dimensionDetails: this.formBuilder.array([]),
      dimensions: this.formBuilder.array([]),
      angles: this.formBuilder.array([]),
      width: this.formBuilder.array([]),
      height: this.formBuilder.array([]),
      firstEdgeTreatment: [""],
      firstEdgeTreatmentCode: [""],
      firstEdgeTreatmentDetails: this.formBuilder.array([]),
      firstEdgeTreatmentDetailsFlashing: this.formBuilder.array([]),
      firstEdgeTreatmentDetailsCrush: this.formBuilder.array([]),
      firstEdgeTreatmentDetailsOpenCrush: this.formBuilder.array([]),
      lastEdgeTreatment: [""],
      lastEdgeTreatmentCode: [""],
      lastEdgeTreatmentDetails: this.formBuilder.array([]),

      lastEdgeTreatmentDetailsFlashing: this.formBuilder.array([]),
      lastEdgeTreatmentDetailsCrush: this.formBuilder.array([]),
      lastEdgeTreatmentDetailsOpenCrush: this.formBuilder.array([]),
      productQuantity: this.formBuilder.array([]),
      jobReference: ["", [Validators.pattern(RegexConstants.JOB_REFERENCE)]],
    });

    this.nextFieldName = "pitch";
    this.hasCustomisation = false;
    this.showPitch = true;
    this.hasPitch = true;
    this.showFirstEdge = true;
    this.showLastEdge = false;

    this.selectedIndex = null;
    this.hasMinlengthError = [];
    this.hasMaxlengthError = [];

    if (!this.isFinishedProduct) {
      this.modalBundleForm = this.formBuilder.group({
        modBundle: ["", [Validators.pattern(RegexConstants.BUNDLE_NAME)]],
        modRef: ["", [Validators.pattern(RegexConstants.JOB_REFERENCE)]],
      });
    }

    this.prevFieldVal = "";
    this.nextFieldVal = "Width";

    // Add default Quantity Form
    this.addProductQuantityFormGroup();
    this.initialFirstEdgeTreatmentVals = null;
    this.initialLastEdgeTreatmentVals = null;

    this.cdr.detectChanges();
    this.cdr.markForCheck();
    this.isFormCreated = true;

    let prevSelectedColour: any = localStorage.getItem("prevSelectedColour");
    prevSelectedColour = prevSelectedColour
      ? JSON.parse(prevSelectedColour)
      : "";
    if (prevSelectedColour && status) {
      this.modalSelectedColour = prevSelectedColour;
    }



    this.cdr.detectChanges();
    this.cdr.markForCheck();

    if (this.isTemplateProduct) {
      this.updateProfile();
      setTimeout(() => {
        this.getPayload(null, false, true);
      }, 1000);

      setTimeout(() => {
        const firstEdgeVals = this.cdsDetails?.extensions?.filter(
          (ext: any) => {
            if (ext?.extensionType?.toLowerCase() == "leading")
              return ext?.values;
          }
        );
        const lasEdgeVals = this.cdsDetails?.extensions?.filter((ext: any) => {
          if (ext?.extensionType?.toLowerCase() == "trailing")
            return ext?.values;
        });

        const prevFirstEdgeVal = this.getSubType(firstEdgeVals);
        const prevLastEdgeVal = this.getSubType(lasEdgeVals);

        this.resetEdgeValues(prevFirstEdgeVal, prevLastEdgeVal);
        this.proceedWithSelectedColours(status);
      }, 2000);
    } else {
      this.disableCart = false;
      this.proceedWithSelectedColours(status);
    }
  }

  // Check Is out of Stock
  isOutOfStock(): boolean {
    return this.productDetails?.stock?.stockLevelStatus == "outOfStock";
  }

  // Updating the Bundle
  updateBundling(event: any): void {
    this.hasBundle = event.currentTarget?.checked === true;
    this.addToCartError = null;
    if (this.hasBundle) {
      this.productQuantityForm.controls.forEach((element: any, index: any) => {
        this.updateSameBundleReference(null, index);
      });
    }
  }

  // Get Hexadecimal Code
  getColourInfo(colour: any): any {
    return colour?.colours && colour?.colours[0]?.hexadecimalCode
      ? colour?.colours[0]
      : colour?.colours && colour?.colours?.hexadecimalCode
        ? colour?.colours
        : colour;
  }

  // Updating the Customisation
  updateCustomisation(event: any): void {
    this.hasCustomisation = event.currentTarget?.checked === true;
    this.addToCartError = null;
    if (!this.hasCustomisation) {
      this.resetProductForm(true);
    } else {
      this.prevFieldName = null;
      const nextName = "D1, A1";
      this.nextFieldVal =
        Object.keys(this.dimension)?.length > 0
          ? nextName
          : "Last Edge Treatement";
      this.nextFieldName = Object.keys(this.dimension)?.length > 0 ? 0 : "last";

      const widthValue = this.hasFlashingModal
        ? this.widthPopupForm?.getRawValue()
        : this.widthForm?.getRawValue();

      const segements = this.dimension;
      let index = 0;

      for (const segment of segements) {
        if (segment?.simpleFieldName?.toLowerCase() == "width") {
          if (widthValue && Object.keys(widthValue)?.length > 0) {
            const value = widthValue[0]?.Width || widthValue[0]?.width;
            segment.value = value;
            this.hasFlashingModal
              ? this.dimensionsPopupForm?.controls[index]
                ?.get("dimension")
                ?.setValue(value)
              : this.dimensionsForm?.controls[index]
                ?.get("dimension")
                ?.setValue(value);
          }
        }
        index++;
      }

      this.currentDimensionAngle = 0;
    }
    this.cdr.detectChanges();
  }

  // Check the price
  checkPrice(): boolean {
    return (
      this.totalPrice &&
      !isNaN(this.totalPrice) &&
      parseFloat(this.totalPrice) > 0
    );
  }

  // Update Product Attributes
  updateAttributes(categories: any): void {
    let attributeList = categories?.find(
      (category: any) =>
        category?.attributes && category?.attributes?.length > 0
    );
    this.productAttributes = [];
    attributeList?.attributes?.forEach((element: any) => {
      let obj: any = {};
      obj = {
        key: element.fieldLabel,
        value: element.fieldValues,
      };
      this.productAttributes.push(obj);
    });
  }

  updateCdsResponse(cdsResponse: any, status: boolean): void {
    if (cdsResponse) {
      if (!status) {
        this.loadAPI = new Promise((resolve) => {
          this.loadScript();
          resolve(true);
        });
      } else {
        this.renderCDSImage(this.cdsDetails);
      }
      this.widthList = this.groupByKeyValue(
        cdsResponse?.aspects,
        "simpleFieldName"
      );
      if (Object.keys(this.widthList).length > 0) {
        if (this.checkWidth()) {
          this.createWdithForm();
          if( this.widthList?.Width ){
          for (const width of this.widthList?.Width) {
            this.initialWidth = width?.value;
          } } else if( this.widthList?.angle ) { 
            for (const angle of this.widthList?.angle) {
            this.initialWidth = angle?.value;
          }
          }
         
        }
      }

      this.dimension = [];
      this.angle = [];
      this.invalidAngles = [];
      this.hasPitch = cdsResponse?.pitch;
      if (this.hasPitch) {
        this.templateProductForm
          .get("pitch")
          ?.setValue(cdsResponse?.pitch?.originalPitch);

        this.templateProductPopupForm
          .get("pitch")
          ?.setValue(cdsResponse?.pitch?.originalPitch);
      }

      this.updateProfile(status);

      this.setDimensionsAndAngle(cdsResponse)
    }
    this.cdr.detectChanges();
  }

  // Get Simple Field Name value
  getSimpleFieldName(i : any) {
    let counter  = 0;
    const widthOrAngle = this.widthList?.angle || this.widthList?.Width;

    for( const field of widthOrAngle  ) {

      if ( counter == i )
      return field['simpleFieldName']
    }
  }

  // Set Dimension and Angles 
  setDimensionsAndAngle(cdsResponse: any) {
    for (const aspects of cdsResponse?.aspects) {
      if (aspects?.aspectType == "segment") {
        this.dimension.push(aspects);
        this.addDimensions(null, aspects);
        if (this.isNullOrEmpty(this.newDimension)) {
          this.newDimension = aspects;
        }
      } else if (aspects?.aspectType == "vertice") {
        this.angle.push(aspects);
        this.invalidAngles.push(false);
        this.addAngles(null, aspects);
        if (this.isNullOrEmpty(this.newAngle)) {
          this.newAngle = aspects;
        }
      }
    }
  }
  // Get the Product Details
  getProductDetails(status: boolean = false): void {
    const sessionColor: any = localStorage.getItem('selectedColour')
    this.sessionSelectedColour = JSON.parse(sessionColor);
    this.breadcrumbData = [];
    this.showWaitCursor.next(true);
    let rootCategory: any;
    const cat = window.location.search.split("=").pop();
    if (!this.isNullOrEmpty(cat)) rootCategory = cat;
    this.productService
      .getProductDetailsResults(this.productCode, rootCategory)
      .subscribe(
        (data: any) => {
          if (data) {
            this.productDetails = data;
            this.productName = data.name;
            this.isFinishedProduct = this.productDetails?.finishedProduct;
            this.isTemplateProduct = this.productDetails?.templateProduct;
            this.isBundleEnabled = this.productDetails?.bundleEnabled;
            this.skipSkuLookup = this.productDetails?.skipSkuLookup;
            this.isComplexProduct =
              this.productDetails.salesUnit?.qtyType == "Complex"
                ? true
                : false;
            this.isFirstLoad =
              !this.isTemplateProduct ||
                this.isFinishedProduct ||
                (!this.isBundleEnabled && this.isTemplateProduct)
                ? null
                : this.isFirstLoad;
            if (
              this.productDetails?.categories &&
              this.productDetails?.categories.length > 0
            ) {
              this.updateAttributes(this.productDetails?.categories);
            }

            this.cuttingValidation = this.productDetails?.cuttingValidation;
            this.unitType = this.productDetails?.salesUnit?.code;

            this.availableColours = [];
            this.additionalColours = [];
            this.variantOptions = [];
            if (!status) {
              this.currentPrice =
                this.productDetails?.price?.formattedValue || null;
              this.selectedSkuCode = this.productDetails?.code;
            }
            if (data?.bpAdditionalAttribute) {
              this.hasVariants = false;
              this.additionalColours =
                data?.bpAdditionalAttribute?.additionalColours;
              this.availableColours = data?.bpAdditionalAttribute?.colours;
              if (this.sessionSelectedColour) {
                if (this.availableColours && this.availableColours.length > 0) {
                  const ind = this.availableColours.findIndex(
                    (element: any) => element.code == this.sessionSelectedColour?.color?.code
                  );
                  this.showAlreadySelectedOption = (ind > -1)
                }
                if (!this.showAlreadySelectedOption && this.additionalColours && this.additionalColours.length > 0) {
                  const ind = this.additionalColours.findIndex(
                    (element: any) => element.code == this.sessionSelectedColour?.color?.code
                  );
                  this.showAlreadySelectedOption = (ind > -1)
                }

              }
            } else if (data?.variantOptions) {
              this.hasVariants = true;
              for (const variant of data?.variantOptions) {
                if (variant?.additionalColours) {
                  const obj: any = variant;
                  obj.colours = variant?.additionalColours;
                  this.additionalColours?.push(obj);
                } else {
                  this.availableColours?.push(variant);
                }
              }
            }

            if (
              this.availableColours &&
              this.availableColours?.length > 0 &&
              this.availableColours[0]
            ) {
              if (!status && this.hasVariants) {

                if (!this.isColorFirstLoad) {
                  this.selectedColour =
                    this.availableColours?.colours &&
                      this.availableColours?.colours[0]
                      ? this.availableColours?.colours[0]
                      : this.availableColours[0]?.colours &&
                        this.availableColours[0]?.colours[0]
                        ? this.availableColours[0]?.colours[0]
                        : this.availableColours[0];
                  this.selectedSkuCode = this.availableColours[0]?.code;
                  this.modalSelectedColour = this.availableColours[0];
                }
              } else if (!status) {
                if (!this.isColorFirstLoad) {
                  this.selectedColour = this.availableColours[0];
                  this.modalSelectedColour = this.availableColours[0];
                }
              }
            } else if (
              this.additionalColours &&
              this.additionalColours?.length > 0 &&
              this.additionalColours[0]
            ) {
              if (!status && this.hasVariants) {

                if (!this.isColorFirstLoad) {
                  this.selectedColour =
                    this.additionalColours?.colours &&
                      this.additionalColours?.colours[0]
                      ? this.additionalColours?.colours[0]
                      : this.additionalColours[0]?.colours &&
                        this.additionalColours[0]?.colours[0]
                        ? this.additionalColours[0]?.colours[0]
                        : this.additionalColours[0];
                  this.modalSelectedColour = this.additionalColours[0];
                }
                this.selectedSkuCode = this.additionalColours[0]?.code;
              } else if (!status) {
                if (!this.isColorFirstLoad) {
                  this.selectedColour = this.additionalColours[0];
                  this.modalSelectedColour = this.additionalColours[0];
                }
              }
              this.additionalselectedColour = this.selectedColour;
            }
            if (this.isTemplateProduct) {
              this.newDimension = this.newAngle = null;
              if (this.isBundleEnabled) {
                this.productService
                  .getProductCDSDetailsResults(this.productCode)
                  .subscribe((cdsResponse: any) => {
                    let cdsVal: any = cdsResponse;
                    const pitchVal = cdsVal?.pitch?.originalPitch;
                    if (!this.isNullOrEmpty(pitchVal) || parseInt(pitchVal) == 0) {
                      cdsVal.pitch.requestedPitch = pitchVal;                      
                    }
                    this.cdsDetails = null;
                    this.initialCDSDetails = null;
                    this.initialPopupCDSDetails = null;
                    this.cdr.detectChanges();
                    this.cdr.markForCheck();

                    setTimeout(() => {
                      this.cdsDetails = cdsVal;
                      this.initialCDSDetails = cdsVal;
                      this.initialPopupCDSDetails = cdsVal;
                      this.updateCdsResponse(cdsVal, status);
                    }, 500);
                  });
              }

              this.productService
                .getFlashingConfigurations(this.productCode)
                .subscribe((flashingConfigResponse: any) => {
                  if (flashingConfigResponse) {
                    this.initialFlashingResponse = flashingConfigResponse;
                    this.updateFlashingResponse(flashingConfigResponse);
                  }
                  this.cdr.detectChanges();
                });
            }

            // Fetch Related Products
            this.getRelatedProductDetails();

            this.createProductForm(status);

            this.breadcrumbData.push({ url: "/", name: "Home" });
            data?.categories.forEach((breadcrumb: any) => {
              this.breadcrumbData.push({
                url:
                  !this.isNullOrEmpty(rootCategory) &&
                    this.breadcrumbData.length > 1
                    ? breadcrumb.url + "?rootCategory=" + rootCategory
                    : breadcrumb.url,
                name: breadcrumb.name,
              });
            });
            this.breadcrumbData.push({ url: "/", name: data.name });
            this.setBreadcumbsSticky();
            this.cdr.detectChanges();
          } else {
            this.showWaitCursor.next(false);
          }
        },
        (error: any) => {
          this.showWaitCursor.next(false);
          this.disableCart = false;
        }
      );
  }
  setBreadcumbsSticky() {
    setTimeout(() => {
      const headerHeight = this.el.nativeElement.querySelector('app-custom-breadcrum');
      if (headerHeight) {
        const containerTop = document.querySelector('.pdp-container-top') as HTMLElement;
        containerTop.style.marginTop = `${headerHeight?.offsetHeight}px`;
      }
    }, 2000);
  }
  getEdgeValues(edgeVals: any, isFirst: boolean): void {
    let pCode: any;
    const configVals = isFirst
      ? this.firstEdgeConfigValues
      : this.lastEdgeConfigValues;
    const type = Array.isArray(edgeVals)
      ? edgeVals[0]?.values?.type
      : edgeVals?.values?.type;
    const subType = Array.isArray(edgeVals)
      ? edgeVals[0]?.values?.subType
      : edgeVals?.values?.subType;
    if (type == "crush") {
      if (subType?.toLowerCase() == "closed") {
        pCode = configVals?.filter((item: any) => {
          if (item?.value?.toLowerCase() == "crush") {
            return item?.code;
          }
        });
        pCode = pCode[0]?.code || pCode?.code;
        isFirst
          ? this.getFirstEdgeValues(null, pCode, "C")
          : this.getLastEdgeValues(null, pCode, "C");
      } else {
        pCode = configVals?.filter((item: any) => {
          if (item?.value?.toLowerCase() == "opencrush") {
            return item?.code;
          }
        });
        pCode = pCode[0]?.code || pCode?.code;
        isFirst
          ? this.getFirstEdgeValues(null, pCode, "OC")
          : this.getLastEdgeValues(null, pCode, "OC");
      }
    } else if (subType == "flashguard") {
      pCode = configVals?.filter((item: any) => {
        if (item?.value?.toLowerCase() == "flashguard") {
          return item?.code;
        }
      });
      pCode = pCode[0]?.code || pCode?.code;
      isFirst
        ? this.getFirstEdgeValues(null, pCode, "F")
        : this.getLastEdgeValues(null, pCode, "F");
    }
  }

  setEdgeValues(): void {
    const firstEdgeVals = this.cdsDetails?.extensions?.filter((ext: any) => {
      if (ext?.extensionType?.toLowerCase() == "leading") return ext?.values;
    });
    const lasEdgeVals = this.cdsDetails?.extensions?.filter((ext: any) => {
      if (ext?.extensionType?.toLowerCase() == "trailing") return ext?.values;
    });

    if (firstEdgeVals && firstEdgeVals?.length > 0) {
      this.getEdgeValues(firstEdgeVals, true);
    } else {
      this.getFirstEdgeValues(null, "N", "N");
    }

    if (lasEdgeVals && lasEdgeVals?.length > 0) {
      this.getEdgeValues(lasEdgeVals, false);
    } else {
      this.getLastEdgeValues(null, "N", "N");
    }
  }

  updateFlashingResponse(flashingConfigResponse: any): void {
    if (flashingConfigResponse?.configurationInfos) {
      for (const cdsInfo of flashingConfigResponse?.configurationInfos) {
        const configValue = cdsInfo?.configurationValue?.split("|");
        const configType =
          cdsInfo?.configurationLabel?.toString()?.toLowerCase() ||
          cdsInfo?.configuratorType?.toString()?.toLowerCase();

        switch (configType) {
          case "firstedge":
            this.firstEdgeConfigValues = this.getConfigValues(
              cdsInfo?.configurationValues
            );
            if (this.firstEdgeConfigValues && this.firstEdgeConfigValues[0]) {
              this.templateProductForm
                .get("firstEdgeTreatmentCode")
                .setValue(this.firstEdgeConfigValues[0]?.code);
              this.templateProductPopupForm
                .get("firstEdgeTreatmentCode")
                .setValue(this.firstEdgeConfigValues[0]?.code);
              this.getFlashingDetails(
                this.firstEdgeConfigValues[0]?.code,
                true,
                this.edgeTreatementConsts[this.firstEdgeConfigValues[0]?.value]
              );
              this.templateProductForm
                .get("firstEdgeTreatment")
                .setValue(this.firstEdgeConfigValues[0]?.value);
              this.templateProductPopupForm
                .get("firstEdgeTreatment")
                .setValue(this.firstEdgeConfigValues[0]?.value);
            }
            break;
          case "lastedge":
            this.lastEdgeConfigValues = this.getConfigValues(
              cdsInfo?.configurationValues
            );
            if (this.lastEdgeConfigValues && this.lastEdgeConfigValues[0]) {
              this.templateProductForm
                .get("lastEdgeTreatmentCode")
                .setValue(this.lastEdgeConfigValues[0]?.code);
              this.templateProductPopupForm
                .get("lastEdgeTreatmentCode")
                .setValue(this.lastEdgeConfigValues[0]?.code);
              this.getFlashingDetails(
                this.lastEdgeConfigValues[0]?.code,
                false,
                this.edgeTreatementConsts[this.lastEdgeConfigValues[0]?.value]
              );
              this.templateProductForm
                .get("lastEdgeTreatment")
                .setValue(this.lastEdgeConfigValues[0]?.value);
              this.templateProductPopupForm
                .get("lastEdgeTreatment")
                .setValue(this.lastEdgeConfigValues[0]?.value);
            }
            break;
          case "colourside":
          case "dropdown":
            this.templateProductForm
              .get("colouredSide")
              .setValue(configValue[0]);
            this.templateProductPopupForm
              .get("colouredSide")
              .setValue(configValue[0]);
            this.colouredSideConfigValues = cdsInfo?.configurationValues;
            break;
          case "total_width_range":
            this.totalWidth = cdsInfo?.configurationValues;
            this.selectedTotalWidth = configValue[0];
            this.templateProductForm.get("totalWidth").setValue(configValue[0]);
            break;
          case "nbr_of_bends":
            this.totalBends = cdsInfo?.configurationValues;
            this.selectedTotalBends = configValue[0];
            this.templateProductForm.get("totalBends").setValue(configValue[0]);
            break;
        }
      }
    }
    setTimeout(() => {
      this.setEdgeValues();
    }, 500);
  }

  // Get Config Values
  getConfigValues(arr: any): any {
    let configs: any = [];
    let count = 0;
    if (Array.isArray(arr)) {
      for (const value of arr) {
        let conf = value?.split("|");
        if (Array.isArray(conf) && conf?.length > 1) {
          const obj = {
            code: conf[0],
            value: conf[1],
          };
          //configs[conf[0]] = conf[1];
          if (count == 0) {
            configs.push({
              code: "N",
              value: "None",
            });
            count++;
          }
          configs.push(obj);
        }
      }
    } else {
      let conf = arr?.split("|");
      if (Array.isArray(conf) && conf?.length > 1) {
        const obj = {
          code: conf[0],
          value: conf[1],
        };
        //configs[conf[0]] = conf[1];
        if (count == 0) {
          configs.push({
            code: "N",
            value: "None",
          });
          count++;
        }
        configs.push(obj);
      }
    }
    return configs;
  }

  // Get Keys
  getKeys(obj: any): any {
    return obj && Object.keys(obj);
  }

  // Create Width/Height form
  createWdithForm(): void {
    let fbGroup = this.formBuilder.group({});
    for (const width in this.widthList) {
      if (width !== "undefined" && width !== undefined) {
        for (const field of this.widthList[width]) {
          fbGroup.addControl(
            field?.simpleFieldName,
            this.createControl(field?.value, RegexConstants.NUMBER_1_999)
          );
        }
      }
    }
    this.widthForm?.push(fbGroup);
    this.widthPopupForm?.push(fbGroup);
    console.log(this.widthForm);
  }

  //Create New Control
  createControl(fieldValue: any, validationType?: any): FormControl {
    let control: FormControl;
    if (validationType) {
      control = this.formBuilder.control(fieldValue, [
        Validators.required,
        Validators.pattern(validationType),
      ]);
    } else {
      control = this.formBuilder.control(fieldValue, [Validators.required]);
    }
    return control;
  }

  // Clear/Reset First Edge Treatment and Last Edge Treatement
  clearFormArray(formArray: FormArray): void {
    while (formArray?.length !== 0) {
      formArray?.removeAt(0);
    }
  }

  // Print

  printMe(val: any) {
    console.log("Value : ", val);
  }

  // Render First Edge Treatment/Last Edge Treatment Flashing, Crush and Open Crush Form
  renderEdgeTreatmentForm(
    data: any,
    isFirst: boolean = true,
    stype: any
  ): void {
    if (
      data &&
      !(
        data == "N" ||
        data == "n" ||
        (typeof data != "object" && data.toLowerCase() == "none")
      )
    ) {
      if (isFirst) {
        this.firstEdgeTreatmentVals = {
          configVal: null,
          gapVal: null,
          dimensionVal: null,
          foldsVal: null,
        };
        for (const config in this.firstEdgeTreatmentDetails) {
          if (config == stype) {
            this.firstEdgeTreatmentDetails[config].selected = true;
          } else {
            this.firstEdgeTreatmentDetails[config].data = null;
            this.firstEdgeTreatmentDetails[config].selected = false;
          }
        }
        this.firstEdgeTreatmentVals.configVal =
          this.edgeTreatementConsts[stype];
        this.clearFormArray(this.firstEdgeTreatmentDetailsForm);
        if (
          this.isFirstEdgeFlashGuardPopup ||
          this.isFirstEdgeCrushPopup ||
          this.isFirstEdgeOpenCrushPopup
        ) {
          this.clearFormArray(this.firstEdgeTreatmentDetailsPopupForm);
        }
        let fbGroup = this.formBuilder.group({});
        const firstEdgeExtValues = this.cdsDetails?.extensions?.filter(
          (ext: any) => {
            return ext?.extensionType?.toLowerCase() == "leading";
          }
        );
        const isSameType =
          this.edgeTreatementConsts[stype]?.toLowerCase() ==
          this.getSubType(firstEdgeExtValues) ||
          stype?.toLowerCase() == this.getSubType(firstEdgeExtValues);
        for (const config of data?.configurationInfos) {
          const type = config?.configurationLabel?.toString()?.toLowerCase();
          switch (type) {
            case "gap":
              this.firstEdgeTreatmentVals.gapVal =
                this.firstEdgeOpenCrushDefaultGap =
                firstEdgeExtValues &&
                  firstEdgeExtValues[0]?.values &&
                  isSameType
                  ? firstEdgeExtValues[0]?.values?.allowance ||
                  parseInt(config?.configurationValue) ||
                  ""
                  : parseInt(config?.configurationValue) || "";
              fbGroup.addControl(
                "gap",
                this.createControl(this.firstEdgeOpenCrushDefaultGap)
              );
              if (!this.isNullOrEmpty(this.firstEdgeTreatmentVals?.gapVal)) {
                this.firstEdgeTreatmentVals.gapVal += "mm";
              }
              this.firstEdgeOpenCrushGapList = [];
              for (const gap of config?.configurationValues) {
                if (this.isNullOrEmpty(this.firstEdgeOpenCrushDefaultGapMin)) {
                  this.firstEdgeOpenCrushDefaultGapMin = parseInt(gap);
                }
                this.firstEdgeOpenCrushGapList.push(parseInt(gap));
                this.firstEdgeOpenCrushDefaultGapMax = parseInt(gap);
              }
              if (this.isBundleEnabled) {
                this.renderCDSEdgeValues(
                  "gapVal",
                  this.firstEdgeTreatmentVals.gapVal,
                  isFirst,
                  false,
                  stype
                );
              }
              break;
            case "dimensions":
              this.firstEdgeTreatmentVals.dimensionVal =
                firstEdgeExtValues &&
                  firstEdgeExtValues[0]?.values &&
                  isSameType
                  ? firstEdgeExtValues[0]?.values?.value ||
                  config?.configurationValue ||
                  ""
                  : config?.configurationValue || "";
              fbGroup.addControl(
                "dimensions",
                this.createControl(this.firstEdgeTreatmentVals?.dimensionVal)
              );
              if (
                !this.isNullOrEmpty(this.firstEdgeTreatmentVals?.dimensionVal)
              ) {
                this.firstEdgeTreatmentVals.dimensionVal += "mm";
              }
              if (this.isBundleEnabled) {
                this.renderCDSEdgeValues(
                  "dimensionVal",
                  this.firstEdgeTreatmentVals.dimensionVal,
                  true,
                  false,
                  stype
                );
              }
              break;
            case "folds":
              this.firstEdgeTreatmentVals.foldsVal =
                firstEdgeExtValues &&
                  firstEdgeExtValues[0]?.values &&
                  isSameType
                  ? firstEdgeExtValues[0]?.values?.orientation?.toLowerCase() ||
                  config?.configurationValue?.toLowerCase() ||
                  ""
                  : config?.configurationValue?.toLowerCase() || "";
              fbGroup.addControl(
                "folds",
                this.createControl(
                  this.firstEdgeTreatmentVals?.foldsVal?.toLowerCase()
                )
              );

              this.firstEdgeFolds = config?.configurationValues?.map(
                (element: any) => {
                  return element?.toLowerCase();
                }
              );
              if (this.isBundleEnabled) {
                this.renderCDSEdgeValues(
                  "foldsVal",
                  this.firstEdgeTreatmentVals.foldsVal,
                  true,
                  false,
                  stype
                );
              }
              break;
          }
        }
        this.firstEdgeTreatmentDetails[stype].data =
          this.firstEdgeTreatmentVals;
        this.firstEdgeTreatmentDetailsForm?.push(fbGroup);
        this.firstEdgeTreatmentDetailsPopupForm?.push(fbGroup);
        if (this.initialFirstEdgeTreatmentVals == null) {
          this.initialFirstEdgeTreatmentVals = this.firstEdgeTreatmentVals;
        }
      } else {
        this.lastEdgeTreatmentVals = {
          configVal: null,
          gapVal: null,
          dimensionVal: null,
          foldsVal: null,
        };
        for (const config in this.lastEdgeTreatmentDetails) {
          if (config == stype) {
            this.lastEdgeTreatmentDetails[config].selected = true;
          } else {
            this.lastEdgeTreatmentDetails[config].data = null;
            this.lastEdgeTreatmentDetails[config].selected = false;
          }
        }
        this.lastEdgeTreatmentVals.configVal = this.edgeTreatementConsts[stype];

        this.clearFormArray(this.lastEdgeTreatmentDetailsForm);
        if (
          this.isLastEdgeFlashGuardPopup ||
          this.isLastEdgeCrushPopup ||
          this.isLastEdgeOpenCrushPopup
        ) {
          this.clearFormArray(this.lastEdgeTreatmentDetailsPopupForm);
        }
        let fbGroup = this.formBuilder.group({});
        const lastEdgeExtValues = this.cdsDetails?.extensions?.filter(
          (ext: any) => {
            return ext?.extensionType?.toLowerCase() == "trailing";
          }
        );
        const isSameType =
          this.edgeTreatementConsts[stype]?.toLowerCase() ==
          this.getSubType(lastEdgeExtValues) ||
          stype?.toLowerCase() == this.getSubType(lastEdgeExtValues);
        for (const config of data?.configurationInfos) {
          const type = config?.configurationLabel?.toString()?.toLowerCase();
          switch (type) {
            case "gap":
              this.lastEdgeTreatmentVals.gapVal =
                this.lastEdgeOpenCrushDefaultGap =
                lastEdgeExtValues &&
                  lastEdgeExtValues[0]?.values &&
                  isSameType
                  ? lastEdgeExtValues[0]?.values?.allowance ||
                  parseInt(config?.configurationValue) ||
                  ""
                  : parseInt(config?.configurationValue) || "";
              if (!this.isNullOrEmpty(this.lastEdgeTreatmentVals?.gapVal)) {
                this.lastEdgeTreatmentVals.gapVal += "mm";
              }
              fbGroup.addControl(
                "gap",
                this.createControl(this.lastEdgeOpenCrushDefaultGap)
              );
              this.lastEdgeOpenCrushGapList = [];
              for (const gap of config?.configurationValues) {
                if (this.isNullOrEmpty(this.lastEdgeOpenCrushDefaultGapMin)) {
                  this.lastEdgeOpenCrushDefaultGapMin = parseInt(gap);
                }
                this.lastEdgeOpenCrushGapList.push(parseInt(gap));
                this.lastEdgeOpenCrushDefaultGapMax = parseInt(gap);
              }
              if (this.isBundleEnabled) {
                this.renderCDSEdgeValues(
                  "gapVal",
                  this.lastEdgeTreatmentVals.gapVal,
                  false,
                  false,
                  stype
                );
              }
              break;
            case "dimensions":
              this.lastEdgeTreatmentVals.dimensionVal =
                lastEdgeExtValues && lastEdgeExtValues[0]?.values && isSameType
                  ? lastEdgeExtValues[0]?.values?.value ||
                  config?.configurationValue ||
                  ""
                  : config?.configurationValue || "";
              fbGroup.addControl(
                "dimensions",
                this.createControl(this.lastEdgeTreatmentVals.dimensionVal)
              );
              if (
                !this.isNullOrEmpty(this.lastEdgeTreatmentVals?.dimensionVal)
              ) {
                this.lastEdgeTreatmentVals.dimensionVal += "mm";
              }
              if (this.isBundleEnabled) {
                this.renderCDSEdgeValues(
                  "dimensionVal",
                  this.lastEdgeTreatmentVals.dimensionVal,
                  false,
                  false,
                  stype
                );
              }
              break;
            case "folds":
              this.lastEdgeTreatmentVals.foldsVal =
                lastEdgeExtValues && lastEdgeExtValues[0]?.values && isSameType
                  ? lastEdgeExtValues[0]?.values?.orientation?.toLowerCase() ||
                  config?.configurationValue?.toLowerCase() ||
                  ""
                  : config?.configurationValue?.toLowerCase() || "";
              fbGroup.addControl(
                "folds",
                this.createControl(
                  this.lastEdgeTreatmentVals?.foldsVal?.toLowerCase()
                )
              );
              this.lastEdgeFolds = config?.configurationValues?.map(
                (element: any) => {
                  return element?.toLowerCase();
                }
              );
              if (this.isBundleEnabled) {
                this.renderCDSEdgeValues(
                  "foldsVal",
                  this.lastEdgeTreatmentVals.foldsVal,
                  false,
                  false,
                  stype
                );
              }
              break;
          }
        }
        this.lastEdgeTreatmentDetails[stype].data = this.lastEdgeTreatmentVals;
        this.lastEdgeTreatmentDetailsForm?.push(fbGroup);
        this.lastEdgeTreatmentDetailsPopupForm?.push(fbGroup);
        if (this.initialLastEdgeTreatmentVals == null) {
          this.initialLastEdgeTreatmentVals = this.lastEdgeTreatmentVals;
        }
      }
    }
    switch (stype?.toLowerCase()) {
      case "c":
      case "crush":
        if (isFirst) {
          if (this.hasFlashingModal) {
            this.templateProductPopupForm
              ?.get("firstEdgeTreatment")
              .setValue("Crush");
            if (this.firstEdgeCrushPopup?.nativeElement) {
              this.firstEdgeCrushPopup.nativeElement.checked = true;
            }
            this.prevFirstEdgeVal = "C";
            this.prevLastEdgeVal = null;
          } else {
            this.templateProductForm
              ?.get("firstEdgeTreatment")
              .setValue("Crush");
            if (this.firstEdgeCrush?.nativeElement) {
              this.firstEdgeCrush.nativeElement.checked = true;
            }
            this.prevFirstEdgeVal = "C";
            this.prevLastEdgeVal = null;
          }
        } else {
          if (this.hasFlashingModal) {
            this.templateProductPopupForm
              ?.get("lastEdgeTreatment")
              .setValue("Crush");
            if (this.lastEdgeCrushPopup?.nativeElement) {
              this.lastEdgeCrushPopup.nativeElement.checked = true;
            }
            this.prevFirstEdgeVal = null;
            this.prevLastEdgeVal = "C";
          } else {
            this.templateProductForm
              ?.get("lastEdgeTreatment")
              .setValue("Crush");
            if (this.lastEdgeCrush?.nativeElement) {
              this.lastEdgeCrush.nativeElement.checked = true;
            }
            this.prevFirstEdgeVal = null;
            this.prevLastEdgeVal = "C";
          }
        }
        break;
      case "oc":
      case "opencrush":
        if (isFirst) {
          if (this.hasFlashingModal) {
            this.templateProductPopupForm
              ?.get("firstEdgeTreatment")
              .setValue("OpenCrush");
            if (this.firstEdgeOpenCrushPopup?.nativeElement) {
              this.firstEdgeOpenCrushPopup.nativeElement.checked = true;
            }
            this.prevFirstEdgeVal = "OC";
            this.prevLastEdgeVal = null;
          } else {
            this.templateProductForm
              ?.get("firstEdgeTreatment")
              .setValue("OpenCrush");
            if (this.firstEdgeOpenCrush?.nativeElement) {
              this.firstEdgeOpenCrush.nativeElement.checked = true;
            }
            this.prevFirstEdgeVal = "OC";
            this.prevLastEdgeVal = null;
          }
        } else {
          if (this.hasFlashingModal) {
            this.templateProductPopupForm
              ?.get("lastEdgeTreatment")
              .setValue("OpenCrush");
            if (this.lastEdgeOpenCrushPopup?.nativeElement) {
              this.lastEdgeOpenCrushPopup.nativeElement.checked = true;
            }
            this.prevFirstEdgeVal = null;
            this.prevLastEdgeVal = "OC";
          } else {
            this.templateProductForm
              ?.get("lastEdgeTreatment")
              .setValue("OpenCrush");
            if (this.lastEdgeOpenCrush?.nativeElement) {
              this.lastEdgeOpenCrush.nativeElement.checked = true;
            }
            this.prevFirstEdgeVal = null;
            this.prevLastEdgeVal = "OC";
          }
        }
        break;
      case "f":
      case "flashguard":
        if (isFirst) {
          if (this.hasFlashingModal) {
            this.templateProductPopupForm
              ?.get("firstEdgeTreatment")
              .setValue("Flashguard");
            if (this.firstEdgeFlashGuardPopup?.nativeElement) {
              this.firstEdgeFlashGuardPopup.nativeElement.checked = true;
            }
            this.prevFirstEdgeVal = "F";
            this.prevLastEdgeVal = null;
          } else {
            this.templateProductForm
              ?.get("firstEdgeTreatment")
              .setValue("Flashguard");
            if (this.firstEdgeFlashGuard?.nativeElement) {
              this.firstEdgeFlashGuard.nativeElement.checked = true;
            }
            this.prevFirstEdgeVal = "F";
            this.prevLastEdgeVal = null;
          }
        } else {
          if (this.hasFlashingModal) {
            this.templateProductPopupForm
              ?.get("lastEdgeTreatment")
              .setValue("Flashguard");
            if (this.lastEdgeFlashGuardPopup?.nativeElement) {
              this.lastEdgeFlashGuardPopup.nativeElement.checked = true;
            }
            this.prevFirstEdgeVal = null;
            this.prevLastEdgeVal = "F";
          } else {
            this.templateProductForm
              ?.get("lastEdgeTreatment")
              .setValue("Flashguard");
            if (this.lastEdgeFlashGuard?.nativeElement) {
              this.lastEdgeFlashGuard.nativeElement.checked = true;
            }
            this.prevFirstEdgeVal = null;
            this.prevLastEdgeVal = "F";
          }
        }
        break;
      default:
        this.isNoneSelected = true;
        if (isFirst) {
          if (this.hasFlashingModal) {
            this.templateProductPopupForm
              ?.get("firstEdgeTreatment")
              .setValue("None");
            if (this.firstEdgeNonePopup?.nativeElement) {
              this.firstEdgeNonePopup.nativeElement.checked = true;
            }
            this.prevFirstEdgeVal = "N";
            this.prevLastEdgeVal = null;
          } else {
            this.templateProductForm
              ?.get("firstEdgeTreatment")
              .setValue("None");
            if (this.firstEdgeNone?.nativeElement) {
              this.firstEdgeNone.nativeElement.checked = true;
            }
            this.prevFirstEdgeVal = "N";
            this.prevLastEdgeVal = null;
          }
        } else {
          if (this.hasFlashingModal) {
            this.templateProductPopupForm
              ?.get("lastEdgeTreatment")
              .setValue("None");
            if (this.lastEdgeNonePopup?.nativeElement) {
              this.lastEdgeNonePopup.nativeElement.checked = true;
            }
            this.prevFirstEdgeVal = null;
            this.prevLastEdgeVal = "N";
          } else {
            this.templateProductForm?.get("lastEdgeTreatment").setValue("None");
            if (this.lastEdgeNone?.nativeElement) {
              this.lastEdgeNone.nativeElement.checked = true;
            }
            this.prevFirstEdgeVal = null;
            this.prevLastEdgeVal = "N";
          }
        }
        break;
    }
    if (this.isBundleEnabled) {
      this.showWaitCursor.next(true);
      setTimeout(() => {
        this.renderCDSEdgeValues(null, null, isFirst, this.isLoaded, stype);
        if (this.isFirstLoad == null) {
          this.showWaitCursor.next(false);
        }
      });
    }
    this.cdr.detectChanges();
  }

  // Get Flashing Crush and Open Crush
  getFlashingDetails(pCode: any, isFirst: boolean = true, stype: any): void {
    let availableData: any = null;
    if (isFirst) {
      availableData = this.firstEdgeTreatmentData[stype];
    } else {
      availableData = this.lastEdgeTreatmentData[stype];
    }
    if (!this.isNullOrEmpty(availableData) && pCode !== "N") {
      this.renderEdgeTreatmentForm(availableData, isFirst, stype);
    } else if (pCode !== "N") {
      this.showWaitCursor.next(true);
      this.productService.getFlashingConfigurations(pCode).subscribe(
        (data: any) => {
          if (this.isFirstLoad || this.isFirstLoad == null) {
            this.showWaitCursor.next(false);
          }
          if (data) {
            if (isFirst) {
              this.firstEdgeTreatmentData[stype] = data;
            } else {
              this.lastEdgeTreatmentData[stype] = data;
            }
            this.renderEdgeTreatmentForm(data, isFirst, stype);
          }
        },
        (error: any) => {
          this.showWaitCursor.next(false);
        }
      );
    } else {
      if (isFirst) {
        this.firstEdgeTreatmentData[stype] = "None";
        this.templateProductForm.get("firstEdgeTreatmentCode")?.setValue("N");
        this.templateProductPopupForm
          .get("firstEdgeTreatmentCode")
          ?.setValue("N");
        this.firstEdgeTreatmentVals = {
          configVal: "None",
          gapVal: null,
          dimensionVal: null,
          foldsVal: null,
        };
      } else {
        this.lastEdgeTreatmentData[stype] = "None";
        this.templateProductForm.get("lastEdgeTreatmentCode")?.setValue("N");
        this.templateProductPopupForm
          .get("lastEdgeTreatmentCode")
          ?.setValue("N");
        this.lastEdgeTreatmentVals = {
          configVal: "None",
          gapVal: null,
          dimensionVal: null,
          foldsVal: null,
        };
      }
      this.renderEdgeTreatmentForm(null, isFirst, "N");
    }
  }

  renderCDSEdgeValues(
    field: any,
    value: any,
    isFirst: boolean,
    render: boolean = false,
    stype?: any
  ): void {
    let extFirstEdgeVals: any = this.cdsDetails?.extensions?.filter(
      (ext: any) => {
        return ext?.extensionType?.toLowerCase() == "leading";
      }
    );
    let extLastEdgeVals: any = this.cdsDetails?.extensions?.filter(
      (ext: any) => {
        return ext?.extensionType?.toLowerCase() == "trailing";
      }
    );

    let values: any = {};

    if (!this.isNullOrEmpty(field)) {
      if (isFirst) {
        values = extFirstEdgeVals[0]?.values || values;
        if (
          ((this.firstEdgeFlashGuard?.nativeElement?.checked &&
            !this.hasFlashingModal) ||
            (this.firstEdgeFlashGuardPopup?.nativeElement?.checked &&
              this.hasFlashingModal) ||
            stype?.toLowerCase() == "f" ||
            stype?.toLowerCase() == "flashguard") &&
          (value?.toString().toLowerCase() == "inside" ||
            value?.toString().toLowerCase() == "outside") &&
          this.isLoaded
        ) {
          values.type = "softedge";
          values.subType = "flashguard";
          values.orientation = value?.toString()?.toLowerCase();
          values.allowance = 10;
          values.value = 65;
        } else if (
          (this.firstEdgeCrush?.nativeElement?.checked &&
            !this.hasFlashingModal) ||
          (this.firstEdgeCrushPopup?.nativeElement?.checked &&
            this.hasFlashingModal) ||
          stype?.toLowerCase() == "c" ||
          stype?.toLowerCase() == "crush"
        ) {
          values.type = "crush";
          values.subType = "closed";
          if (field == "dimensionVal") {
            values.value = parseInt(value);
          } else {
            values.orientation = value?.toString()?.toLowerCase();
          }
          delete values?.allowance;
        } else if (
          (this.firstEdgeOpenCrush?.nativeElement?.checked &&
            !this.hasFlashingModal) ||
          (this.firstEdgeOpenCrushPopup?.nativeElement?.checked &&
            this.hasFlashingModal) ||
          stype?.toLowerCase() == "oc" ||
          stype?.toLowerCase() == "opencrush"
        ) {
          values.type = "crush";
          values.subType = "open";
          if (field == "dimensionVal") {
            values.value = parseInt(value);
          } else if (field == "gap" || field == "gapVal") {
            values.allowance = parseInt(value);
          } else if (field == "foldsVal") {
            values.orientation = value?.toString()?.toLowerCase();
          }
        }
        extFirstEdgeVals[0].values = values;
      } else {
        values = extLastEdgeVals[0]?.values || values;
        if (
          ((this.lastEdgeFlashGuard?.nativeElement?.checked &&
            !this.hasFlashingModal) ||
            (this.lastEdgeFlashGuardPopup?.nativeElement?.checked &&
              this.hasFlashingModal) ||
            stype?.toLowerCase() == "f" ||
            stype?.toLowerCase() == "flashguard") &&
          (value?.toString().toLowerCase() == "inside" ||
            value?.toString().toLowerCase() == "outside") &&
          this.isLoaded
        ) {
          values.type = "softedge";
          values.subType = "flashguard";
          values.orientation = value?.toString()?.toLowerCase();
          values.allowance = 10;
          values.value = 65;
        } else if (
          (this.lastEdgeCrush?.nativeElement?.checked &&
            !this.hasFlashingModal) ||
          (this.lastEdgeCrushPopup?.nativeElement?.checked &&
            this.hasFlashingModal) ||
          stype?.toLowerCase() == "c" ||
          stype?.toLowerCase() == "crush"
        ) {
          values.type = "crush";
          values.subType = "closed";
          if (field == "dimensionVal") {
            values.value = parseInt(value);
          } else {
            values.orientation = value?.toString()?.toLowerCase();
          }
          delete values?.allowance;
        } else if (
          (this.lastEdgeOpenCrush?.nativeElement?.checked &&
            !this.hasFlashingModal) ||
          (this.lastEdgeOpenCrushPopup?.nativeElement?.checked &&
            this.hasFlashingModal) ||
          stype?.toLowerCase() == "oc" ||
          stype?.toLowerCase() == "opencrush"
        ) {
          values.type = "crush";
          values.subType = "open";
          if (field == "dimensionVal") {
            values.value = parseInt(value);
          } else if (field == "gap" || field == "gapVal") {
            values.allowance = parseInt(value);
          } else if (field == "foldsVal") {
            values.orientation = value?.toString()?.toLowerCase();
          }
        }
        extLastEdgeVals[0].values = values;
      }
    } else if (
      (stype?.toLowerCase() == "n" || stype?.toLowerCase() == "none") &&
      this.isNoneSelected &&
      !this.isInit
    ) {
      if (
        extFirstEdgeVals &&
        extFirstEdgeVals?.length > 0 &&
        extFirstEdgeVals[0] &&
        isFirst
      ) {
        delete extFirstEdgeVals[0]?.values;
        if (extFirstEdgeVals?.length > 1 && extFirstEdgeVals[1]) {
          delete extFirstEdgeVals[1]?.values;
        }
      }

      if (
        extLastEdgeVals &&
        extLastEdgeVals?.length > 0 &&
        extLastEdgeVals[0] &&
        !isFirst
      ) {
        delete extLastEdgeVals[0].values;
        if (extLastEdgeVals?.length > 1 && extLastEdgeVals[1]) {
          delete extLastEdgeVals[1].values;
        }
      }
      this.isNoneSelected = false;
    }

    if (extFirstEdgeVals && extLastEdgeVals) {
      this.cdsDetails.extensions = [extFirstEdgeVals[0], extLastEdgeVals[0]];
    }

    if (render) {
      this.checkCDSScripts();
    }
  }

  checkCDSScripts(): void {
    if (typeof cds !== "undefined") {
      setTimeout(() => {
        this.cdsRenderer = cds;
        if (!this.isCDSAvailable) {
          cds?.fletcher?.init("visualization-container");
        }
        if (!this.isNullOrEmpty(this.cdsDetails)) {
          this.isCDSAvailable = true;
          this.renderCDSImage(this.cdsDetails);
        }
      }, 1000);
    } else {
      var interval = setInterval(() => {
        if (typeof cds !== "undefined") {
          this.cdsRenderer = cds;
          if (!this.isCDSAvailable) {
            cds?.fletcher?.init("visualization-container");
          }
          if (!this.isNullOrEmpty(this.cdsDetails)) {
            this.isCDSAvailable = true;
            this.renderCDSImage(this.cdsDetails);
          }
          clearInterval(interval);
        }
      }, 500);
    }
  }

  // Get First Edge Values
  getFirstEdgeValues(
    event: any,
    pCode: any,
    type: any,
    isNone: boolean = false
  ): void {
    event?.preventDefault();
    this.addToCartError = null;
    this.firstEdgeTreatmentCode = pCode;
    this.getFlashingDetails(pCode, true, type);
    this.isNoneSelected = isNone;
    this.templateProductForm.get("firstEdgeTreatmentCode").setValue(pCode);
    this.templateProductPopupForm.get("firstEdgeTreatmentCode").setValue(pCode);
    this.getPayload(null, false);
    this.cdr.detectChanges();
  }

  // Update First Edge Gap, Dimension, Fold Values
  updateFirstEdgeValues(event: any, field: any, value?: any): void {
    this.addToCartError = null;
    event?.preventDefault();
    this.firstEdgeTreatmentVals[field] =
      (value || event?.currentTarget?.value) +
      (field != "foldsVal" ? "mm" : "");

    if (this.isBundleEnabled) {
      this.renderCDSEdgeValues(
        field,
        value || event?.currentTarget?.value,
        true,
        true
      );
    }

    this.cdr.detectChanges();
  }

  // Get First Edge Values
  getLastEdgeValues(event: any, pCode: any, type: any): void {
    event?.preventDefault();
    this.addToCartError = null;
    this.lastEdgeTreatmentCode = pCode;
    this.getFlashingDetails(pCode, false, type);
    this.templateProductForm.get("lastEdgeTreatmentCode").setValue(pCode);
    this.templateProductPopupForm.get("lastEdgeTreatmentCode").setValue(pCode);
    this.getPayload(null, false)
    this.cdr.detectChanges();
  }

  // Update First Edge Gap, Dimension, Fold Values
  updateLastEdgeValues(event: any, field: any, value?: any): void {
    event?.preventDefault();
    this.addToCartError = null;
    this.lastEdgeTreatmentVals[field] =
      (value || event?.currentTarget?.value) +
      (field != "foldsVal" ? "mm" : "");

    if (this.isBundleEnabled) {
      this.renderCDSEdgeValues(
        field,
        value || event?.currentTarget?.value,
        false,
        true
      );
    }
    this.cdr.detectChanges();
  }

  // Get Related Products
  getRelatedProductDetails(): void {
    this.productService
      .getRelatedProducts(this.productCode)
      .subscribe((data: any) => {
        if (data) {
          this.relatedProductsData = data?.groupedResult;
          this.productsCount = 0;
          for (const obj of data?.groupedResult) {
            for (const prod of obj.products) {
              if (prod) this.productsCount++;
            }
          }
          this.cdr.detectChanges();
        }
      });
  }

  // Check if any value is empty or undefined
  isNullOrEmpty(value: any): boolean {
    return value == null || value == undefined || value == "" || value == " ";
  }

  // Check for any errors while updating the quantity
  hasErrorIndex(index: any): boolean {
    return this.errorIndex[index] == true;
  }

  // Check if any Same Reference Error
  hasProdRefErrorIndex(index: any): boolean {
    return this.hasProdRefIndex[index] == true;
  }

  // Group the Quantity values based on bundle
  groupByKeyValue(items: any, key: any): any {
    return items.reduce(
      (result: any, item: any) => ({
        ...result,
        [item[key]]: [...(result[item[key]] || []), item],
      }),
      {}
    );
  }

  // Check the total bundle weight and update the error if it reaches to maximum bundle size for each bundle
  checkTotalBundleWeight(formValues: any): any {
    let groupTotal = 0;
    formValues?.forEach((currentValue: any) => {
      const qty = parseFloat(currentValue?.prodQty);
      const len = parseFloat(currentValue?.prodLen);
      if (!this.isNullOrEmpty(qty) && !this.isNullOrEmpty(len)) {
        groupTotal += qty * len;
      }
    });
    groupTotal = groupTotal * (this.cuttingValidation?.weightPerLM || 1);
    return groupTotal > (this.cuttingValidation?.maxBundleLoad || 1000);
  }

  // Get the last row of a bundle based on bundle name
  getLastBundleIndex(bundleName: any): any {
    let indexValue: any = null;
    this.productQuantityForm
      ?.getRawValue()
      ?.forEach((element: any, index: any) => {
        if (element?.prodBundle?.toUpperCase() == bundleName?.toUpperCase()) {
          indexValue = index;
        }
      });
    return indexValue;
  }

  // Get the Reference value of the same bundle and update
  getPrevBundleReferenceValue(index: any): any {
    const bundleName =
      this.selectedIndex == null
        ? this.productQuantityForm?.controls[index]
          ?.get("prodBundle")
          ?.value?.toUpperCase()
        : this.modalBundleForm?.get("modBundle")?.value?.toUpperCase();
    let refValue = "";
    this.productQuantityForm?.controls.forEach((element: any, ind: any) => {
      const otherRefValue =
        this.productQuantityForm?.controls[ind]?.get("prodRef")?.value;
      if (
        element?.value?.prodBundle?.toUpperCase() ==
        bundleName?.toUpperCase() &&
        (ind != index || this.selectedIndex != null) &&
        !this.isNullOrEmpty(otherRefValue)
      ) {
        refValue = otherRefValue;
      }
    });
    return refValue || "";
  }

  // Check if Same Refrence is already used
  checkHasSameReference(
    index: any,
    currentReference: any,
    bundleName: any
  ): boolean {
    let hasRef = false;
    const prodRefValues = this.productQuantityForm?.controls?.filter(
      (element: any) => {
        return (
          element?.value?.prodRef == currentReference &&
          element?.value?.prodBundle?.toUpperCase() !=
          bundleName?.toUpperCase() &&
          !this.isNullOrEmpty(currentReference)
        );
      }
    );
    if (prodRefValues?.length > 0) {
      this.hasProdRefIndex[index] = true;
      hasRef = true;
    } else {
      this.hasProdRefIndex[index] = false;
    }
    this.cdr.detectChanges();
    return hasRef;
  }

  // Update the Reference Value if already the same bundle is present
  updateSameBundleReference(
    event: any,
    index: any,
    isReference: boolean = false
  ): void {
    const bundleName =
      this.productQuantityForm?.controls[index]?.get("prodBundle")?.value ||
      this.modalBundleForm.get("modBundle")?.value;
    const newRefValue =
      event != null
        ? event.currentTarget.value
        : this.productQuantityForm?.controls[index]?.get("prodRef")?.value ||
        this.modalBundleForm?.get("modRef").value;
    isReference = isReference
      ? this.checkHasSameReference(index, newRefValue, bundleName)
      : false;
    if (!isReference) {
      this.productQuantityForm.controls.forEach((element: any, ind: any) => {
        if (
          element?.value?.prodBundle?.toUpperCase() ==
          bundleName?.toUpperCase() &&
          ind != index &&
          !this.isNullOrEmpty(newRefValue) &&
          !this.isNullOrEmpty(bundleName)
        ) {
          this.productQuantityForm?.controls[ind]
            ?.get("prodRef")
            ?.setValue(newRefValue);
        }
      });
    }
    this.cdr.detectChanges();
  }

  // Update the same Bundle Refrence Value to all other Bundles if any changes in Reference Value
  populateSameBundleReference(event: any, index: any): void {
    if (event) {
      const prevRefValue = this.getPrevBundleReferenceValue(index);
      if (!this.isNullOrEmpty(prevRefValue)) {
        this.productQuantityForm?.controls[index]
          .get("prodRef")
          ?.setValue(prevRefValue);
        this.modalBundleForm.get("modRef").setValue(prevRefValue);
      }
    } else {
      this.productQuantityForm?.controls[index]
        ?.get("prodRef")
        ?.setValue(this.getPrevBundleReferenceValue(index) || "");
    }
    this.cdr.detectChanges();
  }

  // Update the Bundle List if more than one bundle/rows
  updateBundleList(): void {
    const formValues = this.groupByKeyValue(
      this.productQuantityForm?.getRawValue(),
      "prodBundle"
    );
    if (Object.keys(formValues)?.length > 1) {
      this.bundleList = Object.keys(formValues);
    }
    this.cdr.detectChanges();
  }

  // Get Bundle values only for mobile view
  getBundleValues(index: any): any {
    const bundleValues = [];
    bundleValues.push(
      this.productQuantityForm?.controls[index]?.get("prodBundle")?.value
    );
    bundleValues.push(
      this.productQuantityForm?.controls[index]?.get("prodRef")?.value
    );
    return bundleValues;
  }

  // Edit Bundle Values
  editBundleValue(index: any): void {
    this.selectedIndex = index;
    this.modalBundleForm
      ?.get("modBundle")
      .setValue(
        this.productQuantityForm?.controls[index]
          ?.get("prodBundle")
          ?.value.toUpperCase()
      );
    this.modalBundleForm
      ?.get("modRef")
      ?.setValue(
        this.productQuantityForm?.controls[index]?.get("prodRef")?.value
      );
    this.cdr.detectChanges();
  }

  // Update/Save Bundle values
  saveBundleDetails(event: any): void {
    this.productQuantityForm?.controls[this.selectedIndex]
      ?.get("prodBundle")
      ?.setValue(this.modalBundleForm?.get("modBundle")?.value.toUpperCase());
    this.productQuantityForm?.controls[this.selectedIndex]
      ?.get("prodRef")
      ?.setValue(this.modalBundleForm?.get("modRef")?.value);

    this.updateSameBundleReference(null, this.selectedIndex, true);
    this.updateTotal();
    this.selectedIndex = null;

    this.closebutton.nativeElement.click();
  }

  // Update Total Price and Total length based on user inputs on each row
  updateTotal(): void {
    this.totalLength = 0;
    this.totalPrice = 0;
    this.addToCartError = this.addToCartError || null;
    this.currentPrice =
      this.currentPrice || this.productDetails?.price?.formattedValue;
    if (!this.isFinishedProduct && !this.isTemplateProduct) {
      const formValues = this.groupByKeyValue(
        this.productQuantityForm?.getRawValue(),
        "prodBundle"
      );
      this.productQuantityForm.controls.forEach((element: any, index: any) => {
        const qty = parseFloat(element?.value?.prodQty);
        const len = this.isComplexProduct
          ? parseFloat(element?.value?.prodLen)
          : 1;
        const currentBundleName = element?.value?.prodBundle?.toUpperCase();
        let total = 0;
        if (
          !this.isNullOrEmpty(qty) &&
          !this.isNullOrEmpty(len) &&
          !isNaN(qty) &&
          !isNaN(len)
        ) {
          total = qty * len;
          if (!this.hasBundle) {
            this.errorIndex[index] =
              total * (this.cuttingValidation?.weightPerLM || 1) >
                (this.cuttingValidation?.maxBundleLoad || 1000)
                ? true
                : false;
          } else if (
            this.checkTotalBundleWeight(formValues[currentBundleName])
          ) {
            const errorIndexNo = this.getLastBundleIndex(currentBundleName);
            if (!this.isNullOrEmpty(errorIndexNo)) {
              this.errorIndex[errorIndexNo] = true;
            }
          } else {
            this.errorIndex[index] = false;
          }
        }
        if (!isNaN(qty) && !isNaN(len)) {
          this.totalLength = this.totalLength + total;
          this.totalPrice =
            this.totalLength * parseFloat(this.currentPrice?.replace("$", ""));
        }
      });
    } else if (!this.isTemplateProduct) {
      this.totalLength = null;
      const qty = this.productQuantityForm?.controls[0]?.get("prodQty")?.value;
      if (!isNaN(qty)) {
        this.totalPrice = qty * parseFloat(this.currentPrice?.replace("$", ""));
      }
    } else if (this.isTemplateProduct) {
      this.productQuantityForm.controls.forEach((element: any, index: any) => {
        const qty = parseFloat(element?.value?.prodQty);
        const len = this.isComplexProduct
          ? parseFloat(element?.value?.prodLen)
          : 1;
        let total = 0;
        if (
          !this.isNullOrEmpty(qty) &&
          !this.isNullOrEmpty(len) &&
          !isNaN(qty) &&
          !isNaN(len)
        ) {
          total = qty * len;
          this.errorIndex[index] =
            total * (this.cuttingValidation?.weightPerLM || 1) >
              (this.cuttingValidation?.maxBundleLoad || 1000)
              ? true
              : false;
        }
        if (!isNaN(qty) && !isNaN(len)) {
          this.totalLength = this.totalLength + total;
          this.totalPrice =
            this.totalLength * parseFloat(this.currentPrice?.replace("$", ""));
        }
      });
    }
  }

  // Reset the Quantity Form and Job Reference if changes added to cart
  resetProductForm(status: any = false): void {
    if (this.isFirstLoad == null) {
      this.showWaitCursor.next(false);
    }
    this.disableCart = false;
    this.isEditing = false;
    this.isReload = true;
    this.productForm.reset();
    this.templateProductForm.reset();
    this.templateProductPopupForm.reset();
    this.resetFileUpload = true;
    if (!this.isTemplateProduct) {
      this.createProductForm();
    } else {
      this.getProductDetails(true);
    }
    this.cdr.detectChanges();
  }

  // Get Summary Heading
  getClassifications(): any {
    let featureArray: any = [];
    this.productDetails?.classifications?.forEach((element: any) => {
      element?.features.forEach((feature: any) => {
        if (feature?.featureUnit) {
          featureArray.push(
            feature?.name +
            ": " +
            feature?.featureValues[0]?.value +
            " " +
            feature?.featureUnit?.symbol
          );
        } else {
          featureArray.push(
            feature?.name + ": " + feature?.featureValues[0]?.value
          );
        }
      });
    });
    return featureArray?.join(" | ");
  }

  // Update Aspects
  updateAspects(renderCds: boolean, isLookup: boolean = false): any {
    const segements: any = [];
    const vertices: any = [];

    if (
      this.hasPitch &&
      this.cdsDetails?.pitch &&
      this.cdsDetails?.pitch?.originalPitch
    ) {
      const pitch = this.hasFlashingModal
        ? this.templateProductPopupForm?.get("pitch")?.value
        : this.templateProductForm?.get("pitch")?.value;
      if (!this.isNullOrEmpty(pitch) && this.cdsDetails.pitch?.requestedPitch == undefined && !this.hasCustomisation) {
        this.cdsDetails.pitch.originalPitch = pitch;
      }
    }
    if (this.hasCustomisation) {
      delete this.cdsDetails?.pitch?.requestedPitch;
    }
    if (this.isBundleEnabled) {
      this.updateProfile();
    }

    let i = 0;

    for (const control of this.hasFlashingModal
      ? this.dimensionsPopupForm?.controls
      : this.dimensionsForm?.controls) {
      if (this.keyAspect && i == 0) {
        // this.dimension[i].orientationAspect = true;
      } else if (this.keyAspect) {
        //this.dimension[i].orientationAspect = true;
        // delete this.dimension[i]?.orientationAspect;
      }
      if (isNaN(parseInt(control.get("dimension")?.value))) return false;
      this.dimension[i].value = parseInt(control.get("dimension")?.value);
      segements.push(this.dimension[i]);
      i++;
    }
    i = 0;
    for (const control of this.hasFlashingModal
      ? this.anglesPopupForm?.controls
      : this.anglesForm?.controls) {
      if (this.keyAspect) {
        //this.angle[i].orientationAspect = true;
        // delete this.angle[i]?.orientationAspect;
      }
      const widthValue = this.hasFlashingModal
        ? this.widthPopupForm?.controls
        : this.widthForm?.controls;
 
      if (this.isAngleChanged || this.addToCartClicked)
        this.angle[i].value =  this.showWidth == true ?  parseInt(widthValue[0].get("angle")?.value) : parseInt(control.get("angle")?.value);
      vertices.push(this.angle[i]);
      i++;
    }

    if (!this.hasCustomisation) {
      const widthValue = this.hasFlashingModal
        ? this.widthPopupForm?.getRawValue()
        : this.widthForm?.getRawValue();

      for (const segment of segements) {
        if (segment?.simpleFieldName?.toLowerCase() == "width" || segment?.simpleFieldName?.toLowerCase() == "angle") {
          if (widthValue && Object.keys(widthValue)?.length > 0) {
            segment.value = widthValue[0]?.Width || widthValue[0]?.angle;
          }
        }
      }
    }

    this.aspects = segements?.flatMap((item1: any, index: any) => {
      const item2 = vertices[index];
      return item2 ? [item1, item2] : [item1];
    });


    for (i = 0; i < this.aspects?.length; i++) {
      this.aspects[i].index = i + 1;
    }
    if (renderCds) {
      this.cdsDetails.aspects = JSON.parse(JSON.stringify(this.aspects));
      // this.cdsDetails.aspects = this.aspects;

      this.renderCDSImage(this.cdsDetails);
      if (!isLookup && this.isTemplateProduct && this.isBundleEnabled && !this.isAngleChanged && !this.isPitchChanged) {
        this.getPayload(null, false, true);
      } else {
        this.isPitchChanged = false;
        this.isAngleChanged = false;
      }
    }
  }

  // Update the cart details once the user clicked on add to cart button
  getPayload(event: any, isLookup: boolean = false, isColourClicked?: boolean): void {
    this.disableCart = true;
    event?.stopImmediatePropagation();
    this.showWaitCursor.next(true);
    let payLoad: any = {
      quantity: 1,
      jobReference: !this.isTemplateProduct
        ? this.productForm?.get("jobReference")?.value
        : this.templateProductForm?.get("jobReference")?.value,
      subLineConfigInfos: [],
      configurationInfos: [
        {
          configuratorType: "TEXTFIELD",
          configurationLabel: "COLOUR",
          configurationValue: "",
        },
      ],
      product: {
        code: !this.isNullOrEmpty(this.selectedSkuCode)
          ? this.selectedSkuCode
          : this.productCode,
      },
    };

    if (this.isFinishedProduct) {
      payLoad.quantity =
        this.productQuantityForm.controls[0].get("prodQty")?.value;
      delete payLoad.subLineConfigInfos;
      delete payLoad.configurationInfos;
    } else if (!this.isTemplateProduct) {
      payLoad.configurationInfos[0].configurationValue =
        this.selectedColour?.colours &&
          this.selectedColour?.colours?.length > 0 &&
          this.selectedColour?.colours[0]
          ? this.selectedColour?.colours[0]?.code
          : this.selectedColour?.colours?.code || this.selectedColour?.code;
      this.productQuantityForm.controls.forEach((element: any) => {
        if (!this.hasBundle) {
          if (
            !this.isNullOrEmpty(element?.get("prodQty")?.value) &&
            (this.isComplexProduct
              ? !this.isNullOrEmpty(element?.get("prodLen")?.value)
              : true)
          ) {
            payLoad.subLineConfigInfos.push({
              configuratorType: "CUTTING",
              quantity: element?.get("prodQty")?.value,
              length: element?.get("prodLen")?.value,
            });
            if (!this.isComplexProduct) {
              payLoad.quantity = element?.get("prodQty")?.value;
              delete payLoad.subLineConfigInfos;
            }
          }
        } else {
          if (
            !this.isNullOrEmpty(element?.get("prodQty")?.value) &&
            (this.isComplexProduct
              ? !this.isNullOrEmpty(element?.get("prodLen")?.value)
              : true) &&
            !this.isNullOrEmpty(element?.get("prodBundle")?.value) &&
            !this.isNullOrEmpty(element?.get("prodRef")?.value)
          ) {
            payLoad.subLineConfigInfos.push({
              configuratorType: "CUTTING",
              quantity: element?.get("prodQty")?.value,
              length: element?.get("prodLen")?.value,
              bundleName: element?.get("prodBundle")?.value?.toUpperCase(),
              reference: element?.get("prodRef")?.value,
            });
          }
        }
      });
    } else if (this.isTemplateProduct) {
      const templateProductFormValues = this.templateProductForm.getRawValue();

      if (this.isBundleEnabled && isLookup && !this.addToCartClicked) {
        this.updateAspects(true, isLookup);
      }

      setTimeout(() => {
        if (
          (!this.invalidCDS && this.cdsDetails) ||
          (!this.isBundleEnabled && this.isTemplateProduct)
        ) {
          if (
            payLoad.configurationInfos?.length > 0 &&
            payLoad.configurationInfos[0]
          ) {
            payLoad.configurationInfos[0].configurationValue =
              this.selectedColour?.code;
          }
          payLoad?.configurationInfos?.push({
            configuratorType: "TEXTFIELD",
            configurationLabel: "COLOURSIDE",
            configurationValue:
              this.templateProductForm.get("colouredSide")?.value,
          });

          if (this.templateProductForm?.get("pitch")?.value) {
            payLoad?.configurationInfos?.push({
              configuratorType: "DIMENSION_ANGLE",
              configurationLabel: "PITCH",
              configurationValue: this.templateProductForm.get("pitch")?.value,
            });
          }

          this.templateProductForm
            ?.get("width")
            ?.controls?.forEach((element: any) => {
              const value =
                element.get("width")?.value || element.get("Width")?.value;
              if (!this.isNullOrEmpty(value)) {
                payLoad?.configurationInfos?.push({
                  configuratorType: "DIMENSION_WIDTH",
                  configurationLabel: "WIDTH",
                  configurationValue: value,
                });
              }
            });

          this.templateProductForm
            ?.get("height")
            ?.controls?.forEach((element: any) => {
              if (!this.isNullOrEmpty(element.get("height")?.value)) {
                payLoad?.configurationInfos?.push({
                  configuratorType: "TEXTFIELD",
                  configurationLabel: "HEIGHT",
                  configurationValue: element.get("height")?.value,
                });
              }
            });

          if (
            this.templateProductForm?.get("firstEdgeTreatmentCode")?.value &&
            this.templateProductForm.get("firstEdgeTreatmentCode")?.value !==
            "N"
          ) {
            payLoad?.configurationInfos?.push({
              configuratorType: "SOFTEDGE",
              configurationLabel: "FIRST_EDGE_PRODUCT",
              configurationValue: this.templateProductForm?.get(
                "firstEdgeTreatmentCode"
              )?.value,
            });
          }

          if (
            this.templateProductForm?.get("lastEdgeTreatmentCode")?.value &&
            this.templateProductForm.get("lastEdgeTreatmentCode")?.value !== "N"
          ) {
            payLoad?.configurationInfos?.push({
              configuratorType: "SOFTEDGE",
              configurationLabel: "LAST_EDGE_PRODUCT",
              configurationValue: this.templateProductForm?.get(
                "lastEdgeTreatmentCode"
              )?.value,
            });
          }

          templateProductFormValues?.firstEdgeTreatmentDetails?.forEach(
            (element: any) => {
              if (element?.dimensions) {
                payLoad?.configurationInfos?.push({
                  configuratorType: "TEXTFIELD",
                  //configurationLabel: 'DIMENSION_FIRST_EDGE_TREATMENT',
                  configurationLabel: "FIRST_EDGE_DIMENSION",
                  configurationValue: element.dimensions,
                });
              }
              if (element?.folds) {
                payLoad?.configurationInfos?.push({
                  configuratorType: "TEXTFIELD",
                  //configurationLabel: 'FOLD_FIRST_EDGE_TREATMENT',
                  configurationLabel: "FIRST_EDGE_FOLD",
                  configurationValue: element.folds,
                });
              }
              if (element?.gap) {
                payLoad?.configurationInfos?.push({
                  configuratorType: "TEXTFIELD",
                  //configurationLabel: 'GAP_FIRST_EDGE_TREATMENT',
                  configurationLabel: "FIRST_EDGE_GAP",
                  configurationValue: element.gap + "mm",
                });
              }
            }
          );

          templateProductFormValues?.lastEdgeTreatmentDetails?.forEach(
            (element: any) => {
              if (element?.dimensions) {
                payLoad?.configurationInfos?.push({
                  configuratorType: "TEXTFIELD",
                  //configurationLabel: 'DIMENSION_LAST_EDGE_TREATMENT',
                  configurationLabel: "LAST_EDGE_DIMENSION",
                  configurationValue: element.dimensions,
                });
              }
              if (element?.folds) {
                payLoad?.configurationInfos?.push({
                  configuratorType: "TEXTFIELD",
                  //configurationLabel: 'FOLD_LAST_EDGE_TREATMENT',
                  configurationLabel: "LAST_EDGE_FOLD",
                  configurationValue: element.folds,
                });
              }
              if (element?.gap) {
                payLoad?.configurationInfos?.push({
                  configuratorType: "TEXTFIELD",
                  //configurationLabel: 'GAP_LAST_EDGE_TREATMENT',
                  configurationLabel: "LAST_EDGE_GAP",
                  configurationValue: element.gap + "mm",
                });
              }
            }
          );

          let i = 1,
            j = 1;
          if (this.addToCartClicked) {

            this.cartCdsDetails?.aspects?.forEach((element: any) => {
              const label =
                element?.aspectType == "segment" ? "D" + i++ : "A" + j++;
              const configType =
                element?.aspectType == "segment"
                  ? "DIMENSION_WIDTH"
                  : "DIMENSION_ANGLE";
              if (element.value || (element.value == 0 && configType == 'DIMENSION_ANGLE')) {
                payLoad?.configurationInfos?.push({
                  configuratorType: configType,
                  configurationLabel: label,
                  configurationValue: element.value,
                });
              }
            });
          } else {
            this.cdsDetails?.aspects?.forEach((element: any) => {
              const label =
                element?.aspectType == "segment" ? "D" + i++ : "A" + j++;
              const configType =
                element?.aspectType == "segment"
                  ? "DIMENSION_WIDTH"
                  : "DIMENSION_ANGLE";
              if (element.value || (element.value == 0 && configType == 'DIMENSION_ANGLE')) {
                payLoad?.configurationInfos?.push({
                  configuratorType: configType,
                  configurationLabel: label,
                  configurationValue: element.value,
                });
              }
            });

          }

          this.productQuantityForm.controls.forEach((element: any) => {
            if (
              !this.isNullOrEmpty(element?.get("prodQty")?.value) &&
              (this.isComplexProduct
                ? !this.isNullOrEmpty(element?.get("prodLen")?.value)
                : true)
            ) {
              payLoad?.subLineConfigInfos?.push({
                configuratorType: "CUTTING",
                quantity: element?.get("prodQty")?.value,
                length: element?.get("prodLen")?.value,
              });
              if (!this.isComplexProduct) {
                payLoad.quantity = element?.get("prodQty")?.value;
                delete payLoad.subLineConfigInfos;
              }
            }
          });

          if (this.templateProductForm?.get("totalWidth")?.value) {
            payLoad?.configurationInfos?.push({
              configuratorType: "TEXTFIELD",
              configurationLabel: "TOTAL_WIDTH_RANGE",
              configurationValue:
                this.templateProductForm.get("totalWidth")?.value,
            });
          }

          if (this.templateProductForm?.get("totalBends")?.value) {
            payLoad?.configurationInfos?.push({
              configuratorType: "TEXTFIELD",
              configurationLabel: "NBR_OF_BENDS",
              configurationValue:
                this.templateProductForm.get("totalBends")?.value,
            });
          }

          if (this.skipSkuLookup) {  // Commented to call SKU lookup for all the Flashing and POA Product also
            this.disableCart = false;
            if (!isColourClicked && isLookup)
              this.proceedAddToCart(payLoad);
          } else {
            setTimeout(() => {
              this.getSKUCodeLookup(payLoad, isLookup);
            }, 100);
          }
        }
      }, 1000);
    }

    if (
      (!this.isTemplateProduct && isLookup) ||
      (this.isTemplateProduct && !this.isBundleEnabled && !isLookup)
    ) {
      this.proceedAddToCart(payLoad);
    } else {
      if (this.isFirstLoad == null) {
        this.showWaitCursor.next(false);
      }
    }
  }

  getSKUCodeLookup(payLoad: any, isLookup: boolean = false): void {
    this.showWaitCursor.next(true);
    this.productService.getFlashingSKUCode(payLoad).subscribe(
      (response: any) => {
        if (response && response?.code) {
          payLoad.product.code = response?.code;
          this.selectedSkuCode = response?.code;
          this.currentPrice = response?.price?.formattedValue;
          this.skuLookupPrice = response?.price?.formattedValue;
          this.unitType = response?.salesUnit?.code;
          if (isLookup) {
            this.proceedAddToCart(payLoad);
          } else {
            if (this.isFirstLoad == null) {
              this.showWaitCursor.next(false);
            }
            this.disableCart = false;
            this.addToCartError = false;
            // this.renderCDSImage(this.cdsDetails);
            this.cdr.detectChanges();
          }
        } else {
          this.showWaitCursor.next(false);
          this.disableCart = false;
          this.addToCartError =
            response?.error?.errors[0]?.message ||
            response?.error?.errors[0]?.errorMessage ||
            this.errorMessage;
          this.cdr.detectChanges();
          console.log("Error : ", this.addToCartError);
          this.scrollToView(this.cartError?.nativeElement);
        }
      },
      (error: any) => {
        this.showWaitCursor.next(false);
        this.disableCart = false;
        this.addToCartError =
          error?.error?.errors[0]?.message ||
          error?.error?.errors[0]?.errorMessage ||
          this.errorMessage;
        this.cdr.detectChanges();
        console.log("Error : ", this.addToCartError);
        this.scrollToView(this.cartError?.nativeElement);
      }
    );
  }

  proceedAddToCart(payLoad: any): void {
    if (
      payLoad?.configurationInfos &&
      payLoad?.configurationInfos?.length > 0 &&
      this.isNullOrEmpty(payLoad?.configurationInfos[0]?.configurationValue)
    ) {
      payLoad?.configurationInfos.shift();
    }

    const cartId: any = !this.isNullOrEmpty(
      localStorage.getItem("spartacus⚿dimond-spa⚿cart")
    )
      ? JSON.parse(localStorage.getItem("spartacus⚿dimond-spa⚿cart") || "")
      : "";
    if (!this.isNullOrEmpty(cartId?.active)) {
      this.updateCartDetails(payLoad, cartId?.active);
    } else {
      this.productService.getCartInfo(cartId?.active).subscribe(
        (cartInfo: any) => {
          if (cartInfo && cartInfo?.code) {
            const activeCartId = this.getOrUpdateActiveCartId(cartInfo);
            if (!this.isNullOrEmpty(activeCartId)) {
              this.updateCartDetails(payLoad, activeCartId);
            } else {
              this.createNewCart(payLoad);
            }
          } else {
            this.createNewCart(payLoad);
          }
        },
        (error: any) => {
          this.createNewCart(payLoad);
          this.disableCart = false;
        }
      );
    }
    this.addColourToSession();
  }
  // Store selected colour into the session storage 
  addColourToSession() {
    if (this.selectedColour) {
      localStorage.removeItem('selectedColour');
      localStorage.setItem('selectedColour', JSON.stringify({ 'product': this.productCode, 'color': this.selectedColour }))
    }
  }
  // Create a New Cart if no active cart id is present
  createNewCart(payLoad: any): void {
    this.productService.createCartId().subscribe(
      (response: any) => {
        if (response && response?.code) {
          const newCartId = { active: response?.code };
          localStorage.setItem(
            "spartacus⚿dimond-spa⚿cart",
            JSON.stringify(newCartId)
          );

          this.updateCartDetails(
            payLoad,
            this.getOrUpdateActiveCartId(response)
          );
        } else {
          this.showWaitCursor.next(false);
          this.disableCart = false;
          this.addToCartError =
            response?.error?.errors[0]?.message ||
            response?.error?.errors[0]?.errorMessage ||
            this.errorMessage;
          this.cdr.detectChanges();
          console.log("Error : ", this.addToCartError);
          this.scrollToView(this.cartError?.nativeElement);
        }
      },
      (error: any) => {
        this.showWaitCursor.next(false);
        this.disableCart = false;
        this.addToCartError =
          error?.error?.errors[0]?.message ||
          error?.error?.errors[0]?.errorMessage ||
          this.errorMessage;
        this.cdr.detectChanges();
        console.log("Error : ", this.addToCartError);
        this.scrollToView(this.cartError?.nativeElement);
      }
    );
  }

  // Update the Cart ID and return Active Cart ID
  getOrUpdateActiveCartId(cartInfo: any): any {
    let activeCartId: any;
    if (Array.isArray(cartInfo)) {
      cartInfo?.forEach((cart: any) => {
        activeCartId = this.isNullOrEmpty(cart?.saveTime)
          ? cart?.code
          : activeCartId;
      });
      if (!this.isNullOrEmpty(activeCartId)) {
        const newCartId = { active: activeCartId };
        localStorage.setItem(
          "spartacus⚿dimond-spa⚿cart",
          JSON.stringify(newCartId)
        );
      }
    } else {
      activeCartId =
        cartInfo && cartInfo?.code && this.isNullOrEmpty(cartInfo?.saveTime)
          ? cartInfo?.code
          : JSON.parse(localStorage.getItem("spartacus⚿dimond-spa⚿cart") || "")
            ?.active;
    }
    return activeCartId;
  }

  // Save to Cart
  saveToCart(payLoad: any, cartId: any): void {
    if (!this.selectedColour && ((this.availableColours && this.availableColours.length > 0) || (this.additionalColours && this.additionalColours.length > 0))) {
      this.disableCart = false;
      this.addToCartClicked = false;
      this.addToCartError = 'Please select a colour';
      this.cdr.detectChanges();
      this.scrollToView(this.cartError?.nativeElement);
      return;
    }
    this.productService.addToCart(payLoad, cartId).subscribe(
      (response: any) => {
        if (response) {
          if (response?.statusCode?.toLowerCase() == "success") {
            const activeCartId: any = !this.isNullOrEmpty(
              localStorage.getItem("spartacus⚿dimond-spa⚿cart")
            )
              ? JSON.parse(
                localStorage.getItem("spartacus⚿dimond-spa⚿cart") || ""
              )
              : "";

            // const prevSelectedColour = {
            //   skuCode: this.selectedSkuCode || this.productCode,
            //   colour: this.selectedColour,
            // };
            localStorage.setItem(
              "prevSelectedColour",
              JSON.stringify(this.modalSelectedColour)
            );
            this.showToast = true;
            this.showWaitCursor.next(false);
            this.addColourToSession();
            setTimeout(() => {
              this.showToast = false;
              this.disableCart = false;
              this.isEditing = false;
            }, 4000);
            this.productService.getCartInfo(activeCartId?.active).subscribe(
              (cartInfo: any) => {
                if (cartInfo && cartInfo.code) {
                  this.getOrUpdateActiveCartId(cartInfo);
                  this.cdr.detectChanges();
                  this.cdr.markForCheck();
                  this.showWaitCursor.next(false);
                  const cartId: string = activeCartId?.active;
                  const userId: string = "current";
                  this.multiCartService.loadCart({
                    cartId,
                    userId,
                    extraData: {
                      active: true,
                    },
                  });
                  this.resetProductForm();
                }
              },
              (error: any) => {
                this.showWaitCursor.next(false);
                this.addToCartError =
                  error?.error?.errors[0]?.message ||
                  error?.error?.errors[0]?.errorMessage ||
                  this.errorMessage;
                this.cdr.detectChanges();
                console.log("Error : ", this.addToCartError);
                this.scrollToView(this.cartError?.nativeElement);
              }
            );
          } else {
            this.showWaitCursor.next(false);
            if (response?.statusMessage || response?.errors) {
              this.addToCartError =
                response?.statusMessage ||
                response?.errors[0]?.message ||
                this.errorMessage;
            } else {
              this.addToCartError = this.errorMessage;
            }
            this.cdr.detectChanges();
            console.log("Error : ", this.addToCartError);
            this.scrollToView(this.cartError?.nativeElement);
          }
        }
      },
      (error: any) => {
        this.showWaitCursor.next(false);
        this.disableCart = false;
        this.isEditing = false;
        this.addToCartError =
          error?.error?.errors[0]?.message ||
          error?.error?.errors[0]?.errorMessage ||
          this.errorMessage;
        this.cdr.detectChanges();
        this.scrollToView(this.cartError?.nativeElement);
      }
    );
  }

  // Get Saved Image for Moblie / Desktop
  getSavedImage(width?: any, height?: any): void {
    width = width || "600";
    height = height || "500";
    const imageDims = {
      imageWidth: width,
      imageHeight: height,
      thumbnailWidth: 60,
      thumbnailHeight: 60,
    };
    return cds?.fletcher?.saveImage(JSON.parse(JSON.stringify(this.cdsDetails)), imageDims);
  }

  // Enable or Disable the Cart Button
  enableDisableCart(): boolean {
    if (this.isComplexProduct) {
      return (
        this.disableCart ||
        !this.checkPrice() ||
        !this.isValidForm() ||
        this.invalidCDS ||
        this.hasPOAImage()
      );
    } else {
      return (
        !this.checkPrice() ||
        !this.isValidForm() ||
        this.invalidCDS ||
        this.hasPOAImage()
      );
    }
  }

  // Update Cart Details
  updateCartDetails(payLoad: any, cartId: any): void {
    if (this.isTemplateProduct) {
      payLoad.cdsEncodedImage = null;
      if (this.isBundleEnabled) {
        const width = "300";
        const height = "250";
        const mobileImage: any = this.getSavedImage(width, height);
        this.savedImage = this.getSavedImage();
        //console.log("Saved Image Details : ", this.savedImage);
        if (this.savedImage?.images && this.savedImage?.images?.fullImage) {
          payLoad.cdsEncodedImage = this.flashingLargerImage + '|' + this.thumbnailImage
          // payLoad.cdsEncodedImage =
          //   this.savedImage?.images?.fullImage +
          //   (this.savedImage?.images?.thumbnail
          //     ? "|" + this.savedImage?.images?.thumbnail
          //     : "") +
          //   (mobileImage?.images?.fullImage
          //     ? "|" + mobileImage?.images?.fullImage
          //     : "");
        }
      } else {
        if (!this.isNullOrEmpty(this.poaFileData)) {
          payLoad.cdsEncodedImage = this.poaFileData;
        }
      }

      if (!this.isNullOrEmpty(payLoad?.cdsEncodedImage) && this.addToCartClicked) {
        this.saveToCart(payLoad, cartId);
      } else if (this.isBundleEnabled) {
        this.showWaitCursor.next(false);
        this.disableCart = false;
        this.addToCartError = this.errorMessage;
        this.cdr.detectChanges();
        this.scrollToView(this.cartError?.nativeElement);
      } else {
        this.showWaitCursor.next(false);
        this.disableCart = false;
        this.cdr.detectChanges();
      }
    } else {
      this.saveToCart(payLoad, cartId);
    }
  }

  // Get the values of Quantity Form
  getProductQuantityFormGroup(): FormGroup {
    return this.formBuilder.group(
      !this.isTemplateProduct
        ? this.isComplexProduct
          ? new ProductQuantity()
          : new ProductQuantityNonComplex()
        : this.isComplexProduct
          ? new FlashingQuantity()
          : new ProductQuantityNonComplex()
    );
  }

  // Get the values of Quantity Form
  getDimensionDetailsFormGroup(value?: any): FormGroup {
    return this.formBuilder.group({
      dimension: [
        value?.dimension,
        [Validators.pattern(RegexConstants.NUMBER_1_999), Validators.required],
      ],
      angle: [
        value?.angle,
        [Validators.pattern(RegexConstants.ANGLE_0_360), Validators.required],
      ],
    });
  }

  // Add the Quanity Form when user clicks on Add More button
  get productQuantityForm(): FormArray {
    return !this.isTemplateProduct
      ? (this.productForm.get("productQuantity") as FormArray)
      : (this.templateProductForm.get("productQuantity") as FormArray);
  }

  get productQuantityPopupForm(): FormArray {
    return this.templateProductPopupForm?.get("productQuantity") as FormArray;
  }

  get firstEdgeTreatmentDetailsForm(): FormArray {
    return this.templateProductForm.get(
      "firstEdgeTreatmentDetails"
    ) as FormArray;
  }

  get firstEdgeTreatmentDetailsPopupForm(): FormArray {
    let formArray: any;
    if (this.isFirstEdgeFlashGuardPopup) {
      formArray = this.templateProductPopupForm.get(
        "firstEdgeTreatmentDetailsFlashing"
      ) as FormArray;
    } else if (this.isFirstEdgeCrushPopup) {
      formArray = this.templateProductPopupForm.get(
        "firstEdgeTreatmentDetailsCrush"
      ) as FormArray;
    } else if (this.isFirstEdgeOpenCrushPopup) {
      formArray = this.templateProductPopupForm.get(
        "firstEdgeTreatmentDetailsOpenCrush"
      ) as FormArray;
    }
    return formArray;
  }

  updateEdgeValues(event: any, type: any, isFirst: boolean = true): void {
    //event.preventDefault();
    event?.stopImmediatePropagation();
    this.addToCartError = this.addToCartError || null;
    if (isFirst) {
      this.isFirstEdgeFlashGuardPopup = false;
      this.isFirstEdgeCrushPopup = false;
      this.isFirstEdgeOpenCrushPopup = false;
      this.isNoneSelected = false;
      switch (type) {
        case "F":
          this.isFirstEdgeFlashGuardPopup = true;
          break;
        case "C":
          this.isFirstEdgeCrushPopup = true;
          break;
        case "OC":
          this.isFirstEdgeOpenCrushPopup = true;
          break;
        case "N":
        default:
          this.isNoneSelected = true;
          break;
      }
    } else {
      this.isLastEdgeFlashGuardPopup = false;
      this.isLastEdgeCrushPopup = false;
      this.isLastEdgeOpenCrushPopup = false;
      this.isNoneSelected = false;
      switch (type) {
        case "F":
          this.isLastEdgeFlashGuardPopup = true;
          break;
        case "C":
          this.isLastEdgeCrushPopup = true;
          break;
        case "OC":
          this.isLastEdgeOpenCrushPopup = true;
          break;
        case "N":
        default:
          this.isNoneSelected = true;
          break;
      }
    }
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  get lastEdgeTreatmentDetailsForm(): FormArray {
    return this.templateProductForm.get(
      "lastEdgeTreatmentDetails"
    ) as FormArray;
  }

  get lastEdgeTreatmentDetailsPopupForm(): FormArray {
    let formArray: any;
    if (this.isLastEdgeFlashGuardPopup) {
      formArray = this.templateProductPopupForm.get(
        "lastEdgeTreatmentDetailsFlashing"
      ) as FormArray;
    } else if (this.isLastEdgeCrushPopup) {
      formArray = this.templateProductPopupForm.get(
        "lastEdgeTreatmentDetailsCrush"
      ) as FormArray;
    } else if (this.isLastEdgeOpenCrushPopup) {
      formArray = this.templateProductPopupForm.get(
        "lastEdgeTreatmentDetailsOpenCrush"
      ) as FormArray;
    }
    return formArray;
  }

  get widthForm(): FormArray {
    return this.templateProductForm.get("width") as FormArray;
  }

  get widthPopupForm(): FormArray {
    return this.templateProductPopupForm.get("width") as FormArray;
  }

  addProductQuantityFormGroup(event?: any): void {
    event?.preventDefault();
    this.productQuantityForm?.push(this.getProductQuantityFormGroup());
    this.productQuantityPopupForm?.push(this.getProductQuantityFormGroup());
    if (!this.templateProductForm) {
      const bundles = this.groupByKeyValue(
        this.productQuantityForm?.getRawValue(),
        "prodBundle"
      );
    }
    this.disableAddMore =
      this.productQuantityForm?.length > 99 ||
      this.productQuantityPopupForm?.length > 99;
    this.errorIndex[this.rowIndex] = false;
    this.hasProdRefIndex[this.rowIndex++] = false;
    this.cdr.detectChanges();
  }

  // Add the Dimension Details Form when user clicks on Add After/Before button
  get dimensionDetailsForm(): FormArray {
    return this.templateProductForm.get("dimensionDetails") as FormArray;
  }

  get dimensionDetailsPopupForm(): FormArray {
    return this.templateProductPopupForm.get("dimensionDetails") as FormArray;
  }

  get dimensionsForm(): FormArray {
    return this.templateProductForm.get("dimensions") as FormArray;
  }

  get dimensionsPopupForm(): FormArray {
    return this.templateProductPopupForm.get("dimensions") as FormArray;
  }

  get anglesForm(): FormArray {
    return this.templateProductForm.get("angles") as FormArray;
  }

  get anglesPopupForm(): FormArray {
    return this.templateProductPopupForm.get("angles") as FormArray;
  }

  getDimensionsFormGroup(value?: any): FormGroup {
    return this.formBuilder.group({
      dimension: [
        value,
        [Validators.pattern(RegexConstants.NUMBER_1_999), Validators.required],
      ],
    });
  }

  getAnglesFormGroup(value?: any): FormGroup {
    if( typeof value === 'object' && value instanceof Object )
       value = value?.value;
    return this.formBuilder.group({
      angle: [
        value,
        [Validators.pattern(RegexConstants.ANGLE_0_360), Validators.required],
      ],
    });
  }

  addDimensionDetails(event?: any, value?: any): void {
    event?.preventDefault();
    this.dimensionDetailsForm?.push(this.getDimensionDetailsFormGroup(value));
    this.dimensionDetailsPopupForm?.push(
      this.getDimensionDetailsFormGroup(value)
    );
    this.cdr.detectChanges();
  }

  addDimensions(event?: any, dimensions?: any): void {
    event?.preventDefault();
    if (dimensions && Array.isArray(dimensions)) {
      for (const value of dimensions) {
        this.dimensionsForm?.push(
          this.getDimensionsFormGroup(value?.value || value)
        );
        this.dimensionsPopupForm?.push(
          this.getDimensionsFormGroup(value?.value || value)
        );
      }
    } else {
      this.dimensionsForm?.push(
        this.getDimensionsFormGroup(dimensions?.value || dimensions)
      );
      this.dimensionsPopupForm?.push(
        this.getDimensionsFormGroup(dimensions?.value || dimensions)
      );
    }
    this.cdr.detectChanges();
  }

  addAngles(event?: any, angles?: any): void {
    event?.preventDefault();
    if (angles && Array.isArray(angles)) {
      for (const value of angles) {
        this.anglesForm?.push(this.getAnglesFormGroup(value?.value || value));
        this.anglesPopupForm?.push(
          this.getAnglesFormGroup(value?.value || value)
        );
      }
    } else {
      this.anglesForm?.push(this.getAnglesFormGroup(angles?.value || angles));
      this.anglesPopupForm?.push(
        this.getAnglesFormGroup(angles?.value || angles)
      );
    }
    this.cdr.detectChanges();
  }

  hasBothDimensionsAndAngles(): boolean {
    return (
      this.dimension &&
      this.angle &&
      Object.keys(this.dimension)?.length > 0 &&
      Object.keys(this.angle)?.length > 0
    );
  }

  // Update the Quantity form if user clicks on remove button
  removeProductQuantityForm(index: any, event: any): void {
    event?.preventDefault();
    this.productQuantityForm.removeAt(index);
    this.productQuantityPopupForm.removeAt(index);
    this.productQuantityForm.markAllAsTouched();
    this.productQuantityPopupForm.markAllAsTouched();
    this.rowIndex--;
    this.disableAddMore =
      this.productQuantityForm?.length > 99 ||
      this.productQuantityPopupForm?.length > 99;
    this.updateTotal();
    this.cdr.detectChanges();
  }

  updateIndexes(): void {
    if (this.dimension && this.dimension?.length > 0) {
      this.dimension?.forEach((value: any, ind: any) => {
        const index = ind == 0 ? ind + 1 : ind + ind + 1;
        value.index = index;
      });
    }
    if (this.angle && this.angle?.length > 0) {
      this.angle?.forEach((value: any, ind: any) => {
        const index = ind == 0 ? ind + 2 : ind + ind + 2;
        value.index = index;
      });
    }
  }

  getVertice(index: any): any {
    const angle =
      index >= 0 && index < this.angle?.length
        ? this.angle[index]
        : this.angle[0];
    const vertice: any = {
      index: null,
      aspectType: "vertice",
      subType: angle?.subType || "inner",
      rotation: angle?.rotation || "anticlockwise",
      value: "",
      orientationAspect: false,
    };
    return vertice;
  }

  addBefore(index: any, event: any): void {
    event?.preventDefault();

    const newSegment: any = {
      index: null,
      aspectType: "segment",
      subType: "line",
      value: "",
      orientationAspect: false,
    };
    const newVertice: any = this.getVertice(index);

    this.dimensionsForm?.insert(index, this.getDimensionsFormGroup());
    this.dimensionsPopupForm?.insert(index, this.getDimensionsFormGroup());
    this.dimension?.splice(index, 0, newSegment);

    this.anglesForm?.insert(index, this.getAnglesFormGroup());
    this.anglesPopupForm?.insert(index, this.getAnglesFormGroup());
    this.angle?.splice(index, 0, newVertice);

    this.updateIndexes();

    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  addAfter(index: any, event: any): void {
    event?.preventDefault();

    const newSegment: any = {
      index: null,
      aspectType: "segment",
      subType: "line",
      value: "",
      orientationAspect: false,
    };
    const newVertice: any = this.getVertice(index);

    this.dimensionsForm?.insert(index + 1, this.getDimensionsFormGroup(""));
    this.dimensionsPopupForm?.insert(
      index + 1,
      this.getDimensionsFormGroup("")
    );
    this.dimension?.splice(index + 1, 0, newSegment);

    index = this.anglesForm?.length >= index ? index : index - 1;
    this.anglesForm?.insert(index + 1, this.getAnglesFormGroup(""));
    this.anglesPopupForm?.insert(index + 1, this.getAnglesFormGroup(""));
    this.angle?.splice(index + 1, 0, newVertice);

    this.updateIndexes();

    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  removeDimensionAndAngle(index: any, event: any): void {
    event?.preventDefault();
    let dIndex = 0;
    let aIndex = 0;
    if (this.dimension?.length > 1 && this.angle?.length > 0) {
      this.dimensionsForm?.removeAt(index);
      this.dimensionsPopupForm?.removeAt(index);
      dIndex = index;
      this.dimension = this.dimension.filter(
        (value: any, ind: any) => ind != index
      );
      if (index in this.angle) {
        this.anglesForm?.removeAt(index);
        this.anglesPopupForm?.removeAt(index);
        aIndex = index;
        this.angle = this.angle.filter((value: any, ind: any) => ind != index);
      } else if (index - 1 in this.angle) {
        // If diagonal removal of dimensions
        this.anglesForm?.removeAt(index - 1);
        this.anglesPopupForm?.removeAt(index - 1);
        this.angle = this.angle.filter(
          (value: any, ind: any) => ind != index - 1
        );
        aIndex = index - 1;
      }
      const newaspects: any = [];
      if (this.checkHasKeyAspect(dIndex, aIndex)) {
        this.keyAspect = true;
        this.cdsDetails.template = "horizontal";
        delete this.cdsDetails.pitch;
        this.cdsDetails?.aspects?.forEach((element: any, ind: any) => {
          if (ind == 0) {
            element.orientationAspect = true;
            newaspects.push(element);
          } else {
            delete element?.orientationAspect;
            const obj = this.objectExceptOne(element, ["orientationAspect"]);
            newaspects.push(obj);
          }
        });
        this.dimension?.forEach((element: any, ind: any) => {
          if (ind == 0) {
            element.orientationAspect = true;
          } else {
            delete element?.orientationAspect;
          }
        });
        this.angle?.forEach((element: any, ind: any) => {
          delete element?.orientationAspect;
        });

        const cdsInfo = this.objectExceptOne(this.cdsDetails, ["aspects"]);

        this.cdsDetails = {};

        this.cdsDetails = JSON.parse(JSON.stringify(cdsInfo));
        //this.cdsDetails['aspects'] = aspects;
      }
      this.cdsDetails["aspects"] = JSON.parse(JSON.stringify(newaspects));
      if (this.isBundleEnabled) {
        this.updateAspects(true);
      }
    }
    this.cdr.detectChanges();
  }

  objectExceptOne(obj: any, keys: any): any {
    //create an empty object named target
    const target: any = {};
    //itrating the loop and storing the value in the target object
    for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
      target[i] = obj[i];
    }
    return target;
  }

  // Get the Product Detail image if any
  getDetailImage(): any {
    const detailImages = this.productDetails?.detailImages;
    if (detailImages && Object.keys(detailImages)?.length > 0) {
      return detailImages[0]?.url
        ? this.occeBaseUrl + detailImages[0]?.url
        : "";
    }
  }

  getProductImage(): any {
    const detailImages = this.productDetails?.images;
    if (detailImages && Object.keys(detailImages)?.length > 0) {
      for (let item of detailImages) {
        if (item.format == "product") {
          this.productImage = this.isNullOrEmpty(this.productImage)
            ? this.occeBaseUrl + item.url
            : this.productImage;
          return true;
        }
      }
    }
  }

  // Get Job Reference Errors
  jobReferenceErrors(): any {
    const isValid = (
      !this.isTemplateProduct
        ? this.productForm?.get("jobReference")?.errors
        : this.templateProductForm?.get("jobReference")?.errors ||
        this.templateProductPopupForm?.get("jobReference")?.errors
    )
      ? false
      : true;
    //this.validForm = !isValid ? false : this.validForm;
    this.formErrors["jobReference"] = isValid;
    return !isValid;
  }

  // Get Pitch Errors
  pitchErrorsPopup(): any {
    const isValid =
      this.templateProductPopupForm?.get("pitch")?.touched &&
        this.templateProductPopupForm?.get("pitch")?.dirty &&
        (this.templateProductPopupForm?.get("pitch")?.errors ||
          this.templateProductPopupForm?.get("pitch")?.value > 45 ||
          this.templateProductPopupForm?.get("pitch")?.value < 3) &&
        this.showPitch
        ? false
        : true;
    //this.validForm = !isValid ? false : this.validForm;
    this.formErrors["pitchPopup"] = isValid;
    return !isValid;
  }

  pitchErrors(): any {
    const isValid =
      this.templateProductForm?.get("pitch")?.touched &&
        this.templateProductForm?.get("pitch")?.dirty &&
        (this.templateProductForm?.get("pitch")?.errors ||
          this.templateProductForm?.get("pitch")?.value > 45 ||
          this.templateProductForm?.get("pitch")?.value < 3) &&
        this.showPitch
        ? false
        : true;
    //this.validForm = !isValid ? false : this.validForm;
    this.formErrors["pitch"] = isValid;
    return !isValid;
  }

  // Get Width Errors
  widthErrorsPopup(): any {
    const isValid =
      ((this.widthPopupForm?.get("Width")?.touched &&
      this.widthPopupForm?.get("Width")?.dirty &&
      (this.widthPopupForm?.get("Width")?.errors ||
        this.widthPopupForm?.get("Width")?.value > 45 ||
        this.widthPopupForm?.get("Width")?.value < 3) &&
      this.widthList ) ||
       ( this.widthPopupForm?.get("angle")?.touched &&
      this.widthPopupForm?.get("angle")?.dirty &&
      (this.widthPopupForm?.get("angle")?.errors ||
        this.widthPopupForm?.get("angle")?.value > 45 ||
        this.widthPopupForm?.get("angle")?.value < 3) &&
      this.widthList ))  &&
      Object.keys(this.widthList)?.length > 0
        ? false
        : true;
    //this.validForm = !isValid ? false : this.validForm;
    this.formErrors["widthPopup"] = isValid;
    return !isValid;
  }

  widthErrors(): any {
    const isValid =
    ((this.widthForm?.get("Width")?.touched &&
    this.widthForm?.get("Width")?.dirty &&
    (this.widthForm?.get("Width")?.errors ||
      this.widthForm?.get("Width")?.value > 45 ||
      this.widthForm?.get("Width")?.value < 3) &&
    this.widthList ) ||
     ( this.widthForm?.get("angle")?.touched &&
    this.widthForm?.get("angle")?.dirty &&
    (this.widthForm?.get("angle")?.errors ||
      this.widthForm?.get("angle")?.value > 45 ||
      this.widthForm?.get("angle")?.value < 3) &&
    this.widthList ))  &&
    Object.keys(this.widthList)?.length > 0
      ? false
      : true;
    //this.validForm = !isValid ? false : this.validForm;
    this.formErrors["width"] = isValid;
    return !isValid;
  }

  // Get Pitch Errors
  checkPitch(event: any, isMobile?: boolean): any {
    if (!isMobile) {
      this.invalidPitch =
        (event?.currentTarget?.value > 45 || event?.currentTarget?.value < 3) &&
        this.showPitch;
      return this.invalidPitch;
    }
  }

  // Get Product Quantity Errors
  prodQtyErrors(index: any): any {
    const isValid =
      (this.productQuantityForm?.controls[index]?.get("prodQty")?.errors ||
        this.productQuantityForm?.controls[index]?.get("prodQty")?.invalid) &&
        (this.productQuantityForm?.controls[index]?.get("prodQty")?.dirty ||
          this.productQuantityForm?.controls[index]?.get("prodQty")?.touched)
        ? false
        : true;
    //this.validForm = !isValid ? false : this.validForm;
    this.formErrors["prodQty"] = isValid;
    return !isValid;
  }

  // Get Product Length Errors
  prodLenErrors(index: any): any {
    const isValid =
      (this.productQuantityForm?.controls[index]?.get("prodLen")?.errors ||
        this.productQuantityForm?.controls[index]?.get("prodLen")?.invalid) &&
        (this.productQuantityForm?.controls[index]?.get("prodLen")?.dirty ||
          this.productQuantityForm?.controls[index]?.get("prodLen")?.touched)
        ? false
        : true;
    //this.validForm = !isValid ? false : this.validForm;
    this.formErrors["prodLen"] = isValid;
    return this.isComplexProduct ? !isValid : false;
  }

  // Get Product Length Errors
  minLenErrors(index: any): any {
    const isValid =
      (this.productQuantityForm?.controls[index]?.get("prodLen")?.dirty ||
        this.productQuantityForm?.controls[index]?.get("prodLen")?.touched) &&
        this.hasMinlengthError?.indexOf(index) !== -1
        ? false
        : true;
    //this.validForm = !isValid ? false : this.validForm;
    this.formErrors["minLength"] = isValid;
    return !isValid;
  }

  // Get Product Length Errors
  maxLenErrors(index: any): any {
    const isValid =
      (this.productQuantityForm?.controls[index]?.get("prodLen")?.dirty ||
        this.productQuantityForm?.controls[index]?.get("prodLen")?.touched) &&
        this.hasMaxlengthError?.indexOf(index) !== -1
        ? false
        : true;
    //this.validForm = !isValid ? false : this.validForm;
    this.formErrors["maxLength"] = isValid;
    return !isValid;
  }

  // Get Product Bundle Errors
  prodBundleErrors(index: any): any {
    const isValid =
      (this.productQuantityForm?.controls[index]?.get("prodBundle")?.errors ||
        this.productQuantityForm?.controls[index]?.get("prodBundle")
          ?.invalid) &&
        (this.productQuantityForm?.controls[index]?.get("prodBundle")?.dirty ||
          this.productQuantityForm?.controls[index]?.get("prodBundle")
            ?.touched) &&
        this.hasBundle
        ? false
        : true;
    //this.validForm = !isValid ? false : this.validForm;
    this.formErrors["prodBundle"] = isValid;
    return !isValid;
  }

  // Get Product Bunlde Reference Errors
  prodRefErrors(index: any): any {
    const isValid =
      (this.productQuantityForm?.controls[index]?.get("prodRef")?.errors ||
        this.productQuantityForm?.controls[index]?.get("prodRef")?.invalid) &&
        (this.productQuantityForm?.controls[index]?.get("prodRef")?.dirty ||
          this.productQuantityForm?.controls[index]?.get("prodRef")?.touched) &&
        this.hasBundle
        ? false
        : true;
    //this.validForm = !isValid ? false : this.validForm;
    this.formErrors["prodRef"] = isValid;
    return !isValid;
  }

  // Check if form is Valid or not
  isValidForm(): boolean {
    let valid = true;
    if (this.hasBundle) {
      valid = this.productForm?.valid;
    } else {
      this.productQuantityForm?.controls?.forEach((element: any) => {
        valid = this.isFinishedProduct
          ? element?.get("prodQty")?.valid
          : this.isTemplateProduct
            ? this.isNullOrEmpty(this.addToCartError) &&
            element?.get("prodQty")?.valid
            : this.isComplexProduct
              ? element?.get("prodLen")?.valid && element?.get("prodQty")?.valid
              : true;
      });
    }
    for (const error in this.formErrors) {
      if (error == "bundle" && this.hasBundle) {
        valid = !this.formErrors[error] ? false : valid;
      } else if (error != "bundle") {
        valid = !this.formErrors[error] ? false : valid;
      }
    }

    return valid;
  }

  // Check if any errors present on any row and diplay it on UI
  hasErrors(index: any): boolean {
    const isValid =
      ((this.productQuantityForm?.controls[index]?.get("prodQty")?.touched ||
        this.productQuantityForm?.controls[index]?.get("prodQty")?.dirty) &&
        this.productQuantityForm?.controls[index]?.get("prodQty")?.errors) ||
        ((this.productQuantityForm?.controls[index]?.get("prodLen")?.touched ||
          this.productQuantityForm?.controls[index]?.get("prodLen")?.dirty) &&
          this.productQuantityForm?.controls[index]?.get("prodLen")?.errors) ||
        ((this.productQuantityForm?.controls[index]?.get("prodLen")?.touched ||
          this.productQuantityForm?.controls[index]?.get("prodLen")?.dirty) &&
          (this.productQuantityForm?.controls[index]?.get("prodLen")?.value <
            this.cuttingValidation?.minLength ||
            this.productQuantityForm?.controls[index]?.get("prodLen")?.value >
            this.cuttingValidation?.maxLength)) ||
        ((this.productQuantityForm?.controls[index]?.get("prodBundle")?.touched ||
          this.productQuantityForm?.controls[index]?.get("prodBundle")?.dirty) &&
          this.productQuantityForm?.controls[index]?.get("prodBundle")?.errors) ||
        ((this.productQuantityForm?.controls[index]?.get("prodRef")?.touched ||
          this.productQuantityForm?.controls[index]?.get("prodRef")?.dirty) &&
          this.productQuantityForm?.controls[index]?.get("prodRef")?.errors)
        ? false
        : true;
    //this.validForm = !isValid ? false : this.validForm;
    this.formErrors["bundle"] = isValid;
    return !isValid;
  }

  // View Related Products
  viewTab(event: any, tabName: any): void {
    event?.preventDefault();
    this.selectedTab = tabName;
    if (tabName === "relatedProducts") {
      this.isRelatedProducts = !this.isRelatedProducts;
    } else if (!this.isNullOrEmpty(tabName)) {
      window.open(tabName, "_blank");
    }
  }

  // Hide Related Products
  hideRelatedProducts(): void {
    this.isRelatedProducts = false;
  }

  // Change view based on screen size/window size
  onResize(event: any): void {
    const targetWidth = event.target.innerWidth;
    this.screenWidth = targetWidth + "px";
    if (targetWidth < 768) {
      this.isMobile = true;
      this.isDesktop = false;
    } else if (targetWidth < 992) {
      this.isTablet = true;
      this.isDesktop = false;
    } else {
      this.isDesktop = true;
    }
    setTimeout(() => {
      const header: any = document.querySelector('header')
      this.breadcrumbTop = `${header.offsetHeight}px`;
      this.cdr.markForCheck();
    }, 500);
  }

  // Update the view based on screen size/device screen size
  onPageRefresh(): void {
    this.isMobile = CommonUtils.isMobile();
    this.isTablet = CommonUtils.isTablet();
    this.isDesktop = CommonUtils.isDesktop();
  }

  // Get Name of the selected colour
  getColourName(colour: any, isModal?: any): any {
    if (
      colour &&
      colour?.colours &&
      colour?.colours?.length > 0 &&
      colour?.colours[0]
    ) {
      return colour?.colours[0]?.name;
    } else if (colour && colour?.colours) {
      return colour?.colours?.name;
    }
    return colour?.name || "";
  }

  // Show the Additional Colours Modal
  modalSelectedColor(event: any, colour: any): void {
    this.modalSelectedColour = colour;
    this.additionalselectedColour = colour;
    event?.preventDefault();
  }

  // Update Product Image
  updateProductImage(images: any): void {
    this.variantImage = this.noImage;
    for (const img of images) {
      if (
        img?.format == "product" &&
        this.selectedColour?.code == img?.colorCode
      ) {
        this.variantImage = environment.occBaseUrl + img?.url;
      }
    }
  }

  // Update Selected Colour

  updateSelectedColour(event: any, colour: any) {
    // this.selectedColour = colour;
    event.preventDefault();
    this.modalSelectedColour = colour;
    this.additionalselectedColour = null;
    this.proceedWithSelectedColours();
  }

  // Additional Colours Modal proceed event
  proceedWithSelectedColours(status?: any): void {
    this.prevModalSelectedColour = this.modalSelectedColour;
    this.variantImage = this.noImage;
    this.addToCartError = null;
    if (!status) {
      if (this.isColorFirstLoad == false) {
        this.selectedColour =
          this.modalSelectedColour?.colours &&
            this.modalSelectedColour?.colours[0]
            ? this.modalSelectedColour?.colours[0]
            : this.modalSelectedColour?.colours
              ? this.modalSelectedColour?.colours
              : this.modalSelectedColour;
      }
      this.isColorFirstLoad = false;
      this.currentPrice =
        this.modalSelectedColour?.priceData?.formattedValue ||
        this.currentPrice;
      if (this.hasVariants) {
        this.selectedSkuCode = this.modalSelectedColour?.code;
        if (
          this.modalSelectedColour?.images &&
          this.modalSelectedColour?.images?.length > 0
        ) {
          this.updateProductImage(this.modalSelectedColour?.images);
        }
      } else {
        if (
          this.productDetails?.images &&
          this.productDetails?.images?.length > 0
        ) {
          this.updateProductImage(this.productDetails?.images);
        }
      }
    }

    if (this.isFormCreated) {
      this.updateTotal();
      this.cdr.detectChanges();
    }

    if (this.isTemplateProduct && this.cdsDetails) {
      this.cdsDetails.colour =
        this.getColourInfo(this.modalSelectedColour)?.hexadecimalCode ||
        this.cdsDetails?.colour;
      if (this.isBundleEnabled && this.isFormCreated) {
        setTimeout(() => {
          this.updateAspects(true);
        }, 200);
      }
    }
    this.isColorSelected = (this.getColourInfo(this.modalSelectedColour));
    this.closeInviteModal?.nativeElement?.click();
  }

  // Close Modal
  cancelModal() {
    this.closeInviteModal.nativeElement.click();
    this.additionalselectedColour = this.prevModalSelectedColour;
    this.modalSelectedColour = this.prevModalSelectedColour;
    this.cdr.detectChanges();
  }

  // Get Current Scroll Position
  getScrollPosition(): boolean {
    return window.scrollY > 560;
  }

  // Check if Any Entry has less than Minimum length
  checkHasMinLengthQty(): void {
    this.hasMinlengthError = [];
    this.productQuantityForm?.controls?.forEach((element: any, ind: any) => {
      if (
        element?.value?.prodLen < this.cuttingValidation?.minLength &&
        !this.isNullOrEmpty(element?.value?.prodLen)
      ) {
        this.hasMinlengthError.push(ind);
      }
    });
    this.cdr.detectChanges();
  }

  // Check if Any Entry has less than Minimum length
  checkHasMaxLengthQty(): void {
    this.hasMaxlengthError = [];
    this.productQuantityForm?.controls?.forEach((element: any, ind: any) => {
      if (
        element?.value?.prodLen > this.cuttingValidation?.maxLength &&
        !this.isNullOrEmpty(element?.value?.prodLen)
      ) {
        this.hasMaxlengthError.push(ind);
      }
    });
    this.cdr.detectChanges();
  }

  // Convert Length to demial format after blur
  updateLenthValue(element: any, ind?: any): void {
    if (
      !(
        this.productQuantityForm?.controls[ind]?.get("prodLen")?.errors ||
        this.productQuantityForm?.controls[ind]?.get("prodLen")?.invalid
      )
    ) {
      const qty = element.value;
      if (!this.isNullOrEmpty(qty) && !isNaN(qty)) {
        element.value = parseFloat(qty)
          ?.toFixed(3)
          ?.replace(/(\d)(?=(\d{3})+\b)/g, "$1,");
      }
      this.checkHasMinLengthQty();
      this.checkHasMaxLengthQty();
    }
  }

  scrollToView(element: any): void {
    element?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      window.scrollTo({
        top: element?.getBoundingClientRect().top + window.pageYOffset - 150,
        behavior: "smooth",
      });
    }, 350);
  }

  // Scroll to selected tab view
  scrollTo(
    event: any,
    element: any,
    activeNav: string,
    parentElement: any
  ): void {
    event?.preventDefault();
    const elementOffset =
      this.productAttributes &&
        this.productAttributes?.length > 0 &&
        activeNav == "productInfo"
        ? element?.offsetTop
        : this.productDesc.nativeElement.offsetTop;


    let topOffset: any;
    // image-container
    const imageHeight = this.el.nativeElement.querySelector('.image-container')?.offsetHeight;
    const breadcrumbsHeight = this.el.nativeElement.querySelector('.navbar')?.offsetHeight;
    switch (activeNav) {
      case "colourInfo":
        // this.setNavTabActive = true;
        topOffset = element?.offsetTop + imageHeight / 2 + 10;
        topOffset = topOffset - breadcrumbsHeight - 5;
        break;
      case "specsInfo":
        topOffset = !this.setNavTabActive
          ? element?.offsetTop - 170
          : element?.offsetTop - 75 - breadcrumbsHeight;
        break;
      case "priceInfo":
        topOffset = !this.setNavTabActive
          ? element?.offsetTop - 220
          : element?.offsetTop - 130 - breadcrumbsHeight;
        break;
      case "productInfo":
        topOffset = !this.setNavTabActive
          ? element?.offsetTop - 280
          : element?.offsetTop - 200;
        break;
    }

    this.selectedNavTab = activeNav;

    parentElement.scrollLeft = event.currentTarget.offsetLeft;
    setTimeout(() => {
      window.scrollTo({
        top: topOffset,
        behavior: "smooth",
      });
    }, 350);
  }

  // Check is there any Key Aspects in between before delete or add
  checkHasKeyAspect(dIndex: any, aIndex: any): boolean {
    const keyIndex = this.cdsDetails?.aspects?.filter((aspect: any) => {
      return aspect?.orientationAspect == true;
    });

    dIndex = dIndex + dIndex + 1;
    aIndex = aIndex + aIndex + 2;
    const hasdIndex = this.cdsDetails?.aspects?.filter((aspect: any) => {
      return (
        aspect?.orientationAspect == true &&
        aspect?.index == dIndex &&
        aspect?.aspectType == "segment"
      );
    });

    const hasaIndex = this.cdsDetails?.aspects?.filter((aspect: any) => {
      return (
        aspect?.orientationAspect == true &&
        aspect?.index == aIndex &&
        aspect?.aspectType == "vertice"
      );
    });

    return (
      (dIndex >= keyIndex[0]?.index &&
        dIndex <= keyIndex[keyIndex?.length - 1]?.index) ||
      (aIndex >= keyIndex[0]?.index &&
        aIndex <= keyIndex[keyIndex?.length - 1]?.index)
    );
  }

  // Update Key Value on change / edit the field
  updateKeyValue(field: any, newVal: any): void {
    if (field === "pitch") {
      this.cdsDetails.pitch.originalPitch = newVal;
    } else {
      for (const item of this.cdsDetails?.aspects) {
        if (item?.simpleFieldName?.toLowerCase() == field?.toLowerCase()) {
          item.value = newVal;
        }
      }
    }
  }

  // Capitalize the Content

  toCapitalize(str: string): string {
    return str
      ?.replace(/\w\S*/g, function (txt) {
        txt = txt.toLowerCase();
        return txt.charAt(0).toUpperCase() + txt.slice(1);
      })
      ?.replace(/\s/g, "");
  }

  updateProfile(status?: boolean): any {
    if (
      this.cdsDetails?.variations?.otherValues &&
      this.cdsDetails?.variations?.otherValues?.length > 0
    ) {
      this.hasProfile = true;
      const profileValue = status
        ? null
        : this.hasFlashingModal
          ? this.templateProductPopupForm?.get("profile")?.value
          : this.templateProductForm?.get("profile")?.value;

      const firstTitle = this.cdsDetails?.variations?.otherValues[0]?.title;
      let changes = this.cdsDetails?.variations?.otherValues?.filter(
        (value: any) => {
          return profileValue
            ? value?.title == profileValue
            : value?.title == firstTitle;
        }
      );

      if (changes && changes?.length > 0) {
        changes = changes[0]?.changes[0];
        for (const key in this.dimension) {
          if (this.dimension[key].index == changes?.index && !this.dimension[key]?.changed) {
            this.dimension[key].value = changes?.value;
            this.hasFlashingModal
              ? this.dimensionsPopupForm?.controls[parseInt(key)]
                ?.get("dimension")
                ?.setValue(changes?.value)
              : this.dimensionsForm?.controls[parseInt(key)]
                ?.get("dimension")
                ?.setValue(changes?.value);
          }
        }
        for (const key in this.angle) {
          if (this.angle[key].index == changes?.index && !this.dimension[key]?.changed) {
            //this.dimension[key].changed = true;
            this.angle[key].value = changes?.value;
            this.hasFlashingModal
              ? this.anglesPopupForm?.controls[parseInt(key)]
                ?.get("angle")
                ?.setValue(changes?.value)
              : this.anglesForm?.controls[parseInt(key)]
                ?.get("angle")
                ?.setValue(changes?.value);
          }
        }
      }
    }
  }

  // Update CDS details on value change and render the image
  updateCDS(event: any, field?: any, isMobile?: boolean, ind?: any): any {
    if (!isMobile || window.innerWidth > 768) {
      const value = event?.currentTarget?.value;
      this.addToCartError = this.addToCartError || null;
      event.preventDefault();
      if (field === "colouredSide" && this.isBundleEnabled) {
        this.cdsDetails.colouredSide = value.toLowerCase();
        this.updateAspects(true);
      } else if (field === "profile" && this.isBundleEnabled) {
        this.updateAspects(true);
      } else if (field === "angle" && ind == undefined && this.isBundleEnabled) { 
         for ( const control of this.anglesForm.controls) {
          control.setValue({ 'angle': value})
         }
        this.updateAspects(true);
      } else if (!this.isNullOrEmpty(field) && !this.isNullOrEmpty(value)) {
        //this.updateKeyValue(field, value);
        if (field === "pitch") {
          this.cdsDetails.pitch.requestedPitch = parseInt(value);
        }

        if (typeof ind != "undefined" && field == "dimension") {
          if (this.dimension[ind].value != value) {
            for (const key in this.dimension) {
              if (parseInt(key) == parseInt(ind)) {
                this.dimension[key].changed = true;
              } else {
                delete this.dimension[key].changed;
              }
            }
          }
          this.dimension[ind].value = value;
        } else if (typeof ind != "undefined" && field == "angle") {
          for (const key in this.angle) {
            if (parseInt(key) == parseInt(ind)) {
              this.angle[key].changed = true;
            } else {
              delete this.angle[key].changed;
            }
          }
          this.angle[ind].value = value;
          if (value == -180) {
            this.invalidAngles[ind] = true;
            this.cdr.detectChanges();
            return false;
          } else {
            this.invalidAngles[ind] = false;
          }
        }

        if (typeof ind !== "undefined" && this.isBundleEnabled) {
          if (
            (this.dimension[ind] &&
              this.angle[ind] &&
              !this.isNullOrEmpty(this.dimension[ind].value) &&
              !this.isNullOrEmpty(this.angle[ind].value)) ||
            (!this.isNullOrEmpty(this.dimension[ind].value) &&
              ind + 1 > this.angle.length) ||
            field?.toLowerCase() == "pitch" ||
            field?.toLowerCase() == "width" ||
            field?.toLowerCase() == "height"||
            field?.toLowerCase() == "angle" 
          ) {
            this.updateAspects(this.isBundleEnabled);
          }
        } else if (
          field?.toLowerCase() == "pitch" ||
          field?.toLowerCase() == "width" ||
          field?.toLowerCase() == "height" ||
          field?.toLowerCase() == "angle" 
        ) {
          this.updateAspects(this.isBundleEnabled);
        }
      }
    }
  }

  updateColouredSide(cdsDetails: any): any {
    let colouredSide = this.toCapitalize(cdsDetails?.colouredSide);
    if (!this.isNullOrEmpty(colouredSide)) {
      cdsDetails.colouredSide =
        colouredSide.charAt(0).toLowerCase() +
        colouredSide.slice(1, colouredSide?.length);
    }
    return cdsDetails;
  }

  // Render CDS Image
  renderCDSImage(newCdsDetails: any): void {
    this.cdr.detectChanges();
    const customCds: any = JSON.parse(JSON.stringify(newCdsDetails));
    this.customisationAllowed = newCdsDetails?.customisationAllowed;
    if (newCdsDetails?.colouredSide)
      newCdsDetails.colouredSide = newCdsDetails?.colouredSide?.toLowerCase();
    if (this.isCDSAvailable && this.isBundleEnabled) {
      try {
        if (!this.cdsResponseLog) {
          console.log("CDS Details : ", newCdsDetails);
        }
        const cdsImage = this.cdsRenderer?.fletcher?.load(newCdsDetails);
        this.cdsDetails.aspects = JSON.parse(JSON.stringify(customCds.aspects));
        this.cartCdsDetails = this.cdsDetails;
        let angles = [];
        for (const aspects of cdsImage.aspects) {
          if (aspects.aspectType == "vertice") {
            angles.push({ 'angle': aspects.value == 'NaN' ? 0 : aspects.value });
          }

        }
        this.templateProductForm.patchValue({
          angles: angles,
        })
        this.templateProductPopupForm.patchValue({
          angles: angles,
        })
        // console.log("CDS Image : ", cdsImage);

        // console.log("Saved Image Details : ", this.getSavedImage());
        const width = "300";
        const height = "250";
        const mobileLargerImage: any = this.getSavedImage(width, height);
        this.savedImage = this.getSavedImage();
        this.cdsDetails.aspects = JSON.parse(JSON.stringify(customCds.aspects));
        if (this.isLoaded && this.isValidForm()) {
          this.productQuantityForm?.markAllAsTouched();
          this.productQuantityPopupForm?.markAllAsTouched();
        }
        this.updateTotal();
        this.cdr.detectChanges();
        if (cdsImage?.status !== "success") {
          this.invalidCDS = true;
          this.addToCartError = cdsImage?.errorText;
          this.showWaitCursor.next(false);
          this.cdr.detectChanges();
          console.log("Error : ", this.addToCartError);
          this.scrollToView(this.cartError?.nativeElement);
        } else {
          this.cartCdsDetails.aspects = JSON.parse(JSON.stringify(cdsImage.aspects));
          this.addToCartError = this.invalidCDS ? "" : this.addToCartError;
          this.invalidCDS = false;
          if (CommonUtils.isDesktop()) {
            this.flashingLargerImage = this.savedImage?.images?.fullImage;
            this.thumbnailImage = this.savedImage?.images?.thumbnail;
          } else {
            this.flashingLargerImage = mobileLargerImage?.images?.fullImage;
            this.thumbnailImage = mobileLargerImage?.images?.thumbnail;
          }
          if (this.isFirstLoad == null) {
            this.showWaitCursor.next(false);
          }
          this.cdr.detectChanges();
        }
        this.cdr.detectChanges();
      } catch (error: any) {
        this.showWaitCursor.next(false);
        this.invalidCDS = true;
        this.addToCartError = "Please enter valid CDS Details";
      }
    }
  }

  // Load Javascript files related to CDS on page load
  public loadScript() {
    let isFound = false;
    const scripts: any = document.getElementsByTagName("script");

    for (const script of scripts) {
      if (
        script?.getAttribute("src") != null &&
        script?.getAttribute("src")?.includes("loader")
      ) {
        isFound = true;
      }
    }

    if (!isFound) {
      const dynamicScripts = environment.cdsScripts;
      for (const script of dynamicScripts) {
        let node = document.createElement("script");
        node.src = script;
        node.type = "text/javascript";
        node.async = false;
        node.charset = "utf-8";
        document.getElementsByTagName("head")[0].appendChild(node);
      }
    }
  }

  displayView(event: any, type: any): void {
    event.preventDefault();
    if (type == "2D") {
      this.is2DView = true;
      const element: HTMLElement = document.getElementById(
        "cds-view-selector-2d"
      ) as HTMLElement;
      element.click();
    } else {
      this.is2DView = false;
      const element: HTMLElement = document.getElementById(
        "cds-view-selector-3d"
      ) as HTMLElement;
      element.click();
    }
  }

  removeCartError(event: any): void {
    event.preventDefault();
    this.addToCartError = null;
  }

  getCustomErrors(ind: any): boolean {
    const isValid =
      ((this.templateProductForm?.get("dimensions")?.controls[ind]?.touched ||
        this.templateProductForm?.get("dimensions")?.controls[ind]?.dirty ||
        this.templateProductForm?.get("angles")?.controls[ind]?.touched ||
        this.templateProductForm?.get("angles")?.controls[ind]?.dirty) &&
        (this.templateProductForm?.get("dimensions")?.controls[ind]?.invalid ||
          this.templateProductForm?.get("angles")?.controls[ind]?.invalid) &&
        !this.hasFlashingModal) ||
        ((this.templateProductPopupForm?.get("dimensions")?.controls[ind]
          ?.touched ||
          this.templateProductPopupForm?.get("dimensions")?.controls[ind]
            ?.dirty ||
          this.templateProductPopupForm?.get("angles")?.controls[ind]?.touched ||
          this.templateProductPopupForm?.get("angles")?.controls[ind]?.dirty) &&
          (this.templateProductPopupForm?.get("dimensions")?.controls[ind]
            ?.invalid ||
            this.templateProductPopupForm?.get("angles")?.controls[ind]
              ?.invalid) &&
          this.hasFlashingModal) ||
        this.invalidAngle(ind)
        ? false
        : true;
    this.formErrors["dimensions"] = isValid;
    return !isValid;
  }

  invalidAngle(ind: any): boolean {
    return this.hasCustomisation && this.invalidAngles[ind];
  }

  closeToast(): void {
    this.showToast = false;
  }

  resetFlashingModalView(): void {
    this.hasFlashingModal = false;
    this.renderer.removeClass(document.body, "flashing-modal");
    this.currentDimensionAngle = 0;
    this.nextDimensionAngle = 0;
    this.prevDimensionAngle = 0;
    this.cdr.detectChanges();
  }

  patchFlashingPopupForm(updatedCdsFormData: any, isDone: boolean): void {
    if (!isDone) {
      this.templateProductPopupForm.patchValue({
        profile: updatedCdsFormData?.profile,
        pitch: updatedCdsFormData?.pitch,
        dimensionDetails: updatedCdsFormData?.dimensionDetails,
        dimensions: updatedCdsFormData?.dimensions,
        angles: updatedCdsFormData?.angles,
        width: updatedCdsFormData?.width,
        height: updatedCdsFormData?.height,
        firstEdgeTreatment: updatedCdsFormData?.firstEdgeTreatment,
        firstEdgeTreatmentCode: updatedCdsFormData?.firstEdgeTreatmentCode,
        firstEdgeTreatmentDetails:
          updatedCdsFormData?.firstEdgeTreatmentDetails,
        lastEdgeTreatment: updatedCdsFormData?.lastEdgeTreatment,
        lastEdgeTreatmentCode: updatedCdsFormData?.lastEdgeTreatmentCode,
        lastEdgeTreatmentDetails: updatedCdsFormData?.lastEdgeTreatmentDetails,
      });
    } else {
      this.templateProductForm.patchValue({
        profile: updatedCdsFormData?.profile,
        pitch: updatedCdsFormData?.pitch,
        dimensionDetails: updatedCdsFormData?.dimensionDetails,
        dimensions: updatedCdsFormData?.dimensions,
        angles: updatedCdsFormData?.angles,
        width: updatedCdsFormData?.width,
        height: updatedCdsFormData?.height,
        firstEdgeTreatment: updatedCdsFormData?.firstEdgeTreatment,
        firstEdgeTreatmentCode: updatedCdsFormData?.firstEdgeTreatmentCode,
        firstEdgeTreatmentDetails:
          updatedCdsFormData?.firstEdgeTreatmentDetails,
        lastEdgeTreatment: updatedCdsFormData?.lastEdgeTreatment,
        lastEdgeTreatmentCode: updatedCdsFormData?.lastEdgeTreatmentCode,
        lastEdgeTreatmentDetails: updatedCdsFormData?.lastEdgeTreatmentDetails,
      });
    }
  }

  mobileView(
    event: any,
    status?: any,
    clicked?: any,
    ind?: any,
    field?: any
  ): void {
    this.isEditing = true;
    if (window.innerWidth < 1024) {
      event?.currentTarget?.blur();
    }
    event.preventDefault();
    if (window.innerWidth > 1023 || !this.isBundleEnabled) {
      this.renderer.removeClass(document.body, "flashing-modal");
      this.hasFlashingModal = false;
      return;
    } else {
      this.hasFlashingModal = true;
      this.renderer.addClass(document.body, "flashing-modal");
      this.showFirstEdge =
        !this.isNullOrEmpty(field) && field === "first" ? true : false;
      this.showLastEdge =
        !this.isNullOrEmpty(field) && field === "last" ? true : false;
      if (!this.isNullOrEmpty(status) && status === "cancel") {
        this.isEditing = false;
        //this.resetProductForm();
        this.cdsDetails = JSON.parse(JSON.stringify(this.initialPopupCDSDetails));

        const updatedCdsFormData = this.templateProductForm?.getRawValue();

        updatedCdsFormData?.width?.forEach((element: any, index: any) => {
          //this.addBasicForm('mandatoryActions');
          this.widthForm.reset();
          this.widthPopupForm.reset();
          this.clearFormArray(this.widthForm);
          this.clearFormArray(this.widthPopupForm);
          //this.widthForm.push()
          this.createWdithForm();
          this.widthForm.controls[index].patchValue({
            Width: this.initialWidth,
          });
          this.widthPopupForm.controls[index].patchValue({
            Width: this.initialWidth,
          });
        });

        this.patchFlashingPopupForm(updatedCdsFormData, false);

        this.firstEdgeTreatmentVals = this.initialFirstEdgeTreatmentVals;
        this.lastEdgeTreatmentVals = this.initialLastEdgeTreatmentVals;

        const prevFETValue = this.firstEdgeTreatmentVals?.configVal;
        const prevLETValue = this.lastEdgeTreatmentVals?.configVal;

        this.resetEdgeValues(prevFETValue, prevLETValue);

        if (this.isBundleEnabled) {
          this.updateAspects(true);
        }
        this.resetFlashingModalView();
        return;
      } else if (!this.isNullOrEmpty(status) && status === "done") {
        this.initialPopupCDSDetails = JSON.parse(JSON.stringify(this.cdsDetails));

        const updatedCdsFormData = this.templateProductPopupForm?.getRawValue();
        this.patchFlashingPopupForm(updatedCdsFormData, true);

        updatedCdsFormData.width.forEach((element: any, index: any) => {
          this.initialWidth = element?.Width || element?.width;
        });
        this.initialFirstEdgeTreatmentVals = this.firstEdgeTreatmentVals;
        this.initialLastEdgeTreatmentVals = this.lastEdgeTreatmentVals;
        this.initialFirstEdgeTreatmentCode =
          updatedCdsFormData?.firstEdgeTreatmentCode;
        this.initialLastEdgeTreatmentCode =
          updatedCdsFormData?.lastEdgeTreatmentCode;

        this.resetFlashingModalView();
        return;
      } else if (this.isReload) {
        this.isEditing = false;
        const updatedCdsFormData = this.templateProductForm?.getRawValue();
        this.patchFlashingPopupForm(updatedCdsFormData, false);

        const prevFETValue = this.firstEdgeTreatmentVals?.configVal;
        const prevLETValue = this.lastEdgeTreatmentVals?.configVal;

        this.resetEdgeValues(prevFETValue, prevLETValue);
        this.isEditing = true;
        this.isReload = false;
      }

      this.currentDimensionAngle =
        !isNaN(ind) && !this.isNullOrEmpty(ind) ? ind : 0;
      this.prevDimensionAngle =
        field != "first" ? this.currentDimensionAngle - 1 : 0;
      this.nextDimensionAngle =
        field != "first" ? this.currentDimensionAngle + 1 : 0;
      if (clicked) {
        const isAngle = field == "angle";
        this.showProfile =
          this.hasProfile && !this.isNullOrEmpty(field) && field == "profile"
            ? true
            : false;
        this.showPitch =
          this.hasPitch && !this.isNullOrEmpty(field) && field == "pitch"
            ? true
            : false;
        this.showWidth =
          !this.isNullOrEmpty(field) && (field == "width" || field == "angle" ) ? true : false;

        if (!this.hasCustomisation) {
          const widthCount = this.checkWidth()
            ? Object.keys(this.widthList).length
            : 0;
          switch (field) {
            case "profile":
              this.nextFieldVal = this.hasPitch
                ? "Pitch"
                : this.checkWidth() && widthCount > 0
                ? isAngle? "Angle" : "Width"
                : "Last Edge Treatement";
              this.nextFieldName =
                this.checkWidth() && widthCount > 0 ?  isAngle? "angle" : "width" : "last";
              this.prevFieldVal = "First Edge Treatement";
              this.prevFieldName = "first";
              this.showProfile = true;
              break;
            case "pitch":
              this.nextFieldVal =
                this.checkWidth() && widthCount > 0
                  ?  isAngle? "Angle" : "Width"
                  : "Last Edge Treatement";
              this.nextFieldName =
                this.checkWidth() && widthCount > 0 ?  isAngle? "angle" : "width" : "last";
              this.prevFieldVal = this.hasProfile
                ? "Profile"
                : "First Edge Treatement";
              this.prevFieldName = this.hasProfile ? "profile" : "first";
              this.showPitch = true;
              break;
            case "width":
              this.nextFieldVal = "Last Edge Treatement";
              this.nextFieldName = "last";
              this.prevFieldVal = this.hasPitch
                ? "Pitch"
                : this.hasProfile
                  ? "Profile"
                  : "First Edge Treatement";
              this.prevFieldName = this.hasPitch
                ? "pitch"
                : this.hasProfile
                  ? "profile"
                  : "first";
              this.showWidth = true;
              break;
              case "angle":
              this.nextFieldVal = "Last Edge Treatement";
              this.nextFieldName = "last";
              this.prevFieldVal = this.hasPitch
                ? "Pitch"
                : this.hasProfile
                ? "Profile"
                : "First Edge Treatement";
              this.prevFieldName = this.hasPitch
                ? "pitch"
                : this.hasProfile
                ? "profile"
                : "first";
              this.showPitch = true;
              break;
            case "first":
              this.prevFieldVal = this.prevFieldName = null;
              this.nextFieldVal = this.hasProfile
                ? "Profile"
                : !this.isNullOrEmpty(this.hasPitch)
                ? "Pitch"
                : this.checkWidth() && widthCount > 0
                ? isAngle? "Angle" :  "Width"
                : "First Edge Treatement";
              this.nextFieldName = this.hasProfile
                ? "profile"
                : !this.isNullOrEmpty(this.hasPitch)
                ? "pitch"
                : this.checkWidth() && widthCount > 0
                ? isAngle? "angle" : "width"
                : "first";
              break;
            case "last":
              this.prevFieldVal =
                this.widthList && widthCount > 0
                  ? isAngle? "Angle" :   "Width"
                  : this.hasPitch
                    ? "Pitch"
                    : this.hasProfile
                      ? "Profile"
                      : "First Edge Treatment";
              this.prevFieldName =
                this.widthList && widthCount > 0
                  ? isAngle? "angle" : "width"
                  : this.hasPitch
                    ? "pitch"
                    : this.hasProfile
                      ? "profile"
                      : "first";
              this.nextFieldVal = this.nextFieldName = null;
              break;
            default:
              break;
          }
        } else {
          const count = Object.keys(this.dimension)?.length;
          switch (field) {
            case "first":
              this.prevFieldVal = this.prevFieldName = null;
              let nxtName = "D1, A1";
              this.nextFieldVal = count > 0 ? nxtName : "Last Edge Treatement";
              this.nextFieldName = count > 0 ? 0 : "last";
              break;
            case "last":
              let prvName = "D" + count + ", A" + count;
              this.prevFieldVal = count < 1 ? "First Edge Treatement" : prvName;
              this.prevFieldName = count < 1 ? "first" : count;
              this.nextFieldVal = this.nextFieldName = null;
              break;
            default:
              let prevName =
                "D" +
                this.currentDimensionAngle +
                ", A" +
                this.currentDimensionAngle;
              let nextName =
                "D" +
                (this.currentDimensionAngle + 2) +
                ", A" +
                (this.currentDimensionAngle + 2);
              this.prevFieldVal =
                this.currentDimensionAngle > 0
                  ? prevName
                  : "First Edge Treatement";
              this.prevFieldName =
                this.currentDimensionAngle > 0
                  ? this.currentDimensionAngle - 1
                  : "first";

              this.nextFieldVal =
                this.currentDimensionAngle < count - 1
                  ? nextName
                  : "Last Edge Treatement";
              this.nextFieldName =
                this.currentDimensionAngle < count - 1
                  ? this.currentDimensionAngle + 1
                  : "last";

              if (this.currentDimensionAngle >= count) {
                this.showLastEdge = true;
                this.showFirstEdge = false;
                this.currentDimensionAngle = 0;
                this.nextFieldVal = null;
                this.prevFieldName = "last";
                this.prevFieldVal = "Last Edge Treatment";
              } else if (this.currentDimensionAngle < 0) {
                this.showFirstEdge = true;
                this.showLastEdge = false;
                this.currentDimensionAngle = 0;
                this.prevFieldVal = null;
                this.nextFieldName = "first";
                this.nextFieldVal = "First Edge Treatment";
              }
              break;
          }
        }
        this.cdr.detectChanges();
      }
    }
  }

  getupdatedFileData(fileData: any) {
    if (!this.isNullOrEmpty(fileData)) {
      this.resetFileUpload = false;
      this.poaFileData = fileData;
    } else {
      this.poaFileData = null;
    }
  }

  hasPOAImage(): boolean {
    return this.isTemplateProduct && !this.isBundleEnabled
      ? this.isNullOrEmpty(this.poaFileData)
      : false;
  }

  checkWidth(): boolean {
    return this.widthList && Object.keys(this.widthList)?.length > 0
      ? this.widthList["Width"] || this.widthList["angle"]
        ? true
        : false
      : true;
  }

  getEdgeName(): any {
    if (this.showFirstEdge) {
      return 'First Edge Treatment';
    } else if (this.showLastEdge) {
      return 'Last Edge Treatment';
    }
  }

  getFullEdgeName(value: any): any {
    switch (value?.toLowerCase()) {
      case "c":
        return "Crush";
      case "oc":
        return "Open Crush";
      case "f":
      case "flashing":
        return "Flashguard";
      case "n":
        return "None";
      default:
        return value;
    }
  }
}
