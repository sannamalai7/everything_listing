import {
  Component,
  ElementRef,
  Inject,
  HostListener,
  ChangeDetectorRef,
  ViewChild,
} from "@angular/core";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
import { empty } from "rxjs/Observer";
import { PagerService } from "./pager.service";

declare function analyticParams(
  searchFilters: any,
  searchTerm: any,
  searchResults: any,
  sortBy: any
): any;

@Component({
  selector: "customsearch",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [PagerService],
  animations: [
    trigger("fadeInOut", [
      transition("void => *", [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 })),
      ]),
      transition("* => void", [animate(500, style({ opacity: 0 }))]),
    ]),
  ],
})
export class AppComponent {
  onLoad: boolean = false;
  loading: boolean;
  qterm: string = "";
  imagePath: string;
  url: string;
  title: string;
  inputUrl: string;
  locales: any;
  searchIn: string;
  liveEvents: string;
  host: string;
  inputParameters: string;
  allFacets: string;
  selectedFacets: any = {};
  excludedLanguages: string[] = [];
  isFacetsCollapsed: boolean = false;
  isCollapsed: boolean = true;
  selectedFacetItems: any[] = [];
  languageExact: string;
  apiLanguage: string;
  dateFormates: any = {};
  monthNames: any;
  localeAndDateFormat: any = {};
  displayParameters: string;
  facetParameters: any = {};
  startDateParameters: string;
  endDateParameters: string;
  queryParameter: string;
  timeframeParameter: string;
  localeUrlParameter: string;
  facets: any;
  filter: string;
  clearAll: string;
  refineBy: string = "RefineBy";
  i18n: any;
  rows: number;
  showingResults: string = "ShowingResults";
  showingFrom: number;
  showingTo: number;
  total: number;
  wcmMode: string;
  localeUrl: string = "";
  keys: string =
    "&keys=Today,Past7Days,PastMonth,PastYear,RefineBy,TimeFrame,SpecificDateRange,StartDate,EndDate,SeeMore,SeeLess,SortBy,ShowingResults,Date,addtocalendar,Upcoming,Past,BestMatch,job_title,alphabetical,NoResultsMsgFuture,NoResultsMsgPast";
  sideBarArrow: string;
  isScrollToTop: boolean = false;
  isLoadMore: boolean;
  isClearAll: boolean;
  i18nFilter: any;
  i18nClearAll: any;
  isResults: boolean;
  searchBoxText: string;
  regionTitle: string = "";
  regionParam: string = "";
  inLabel: string;
  inTranslation: any;
  languageVal: string;
  intialLangset: boolean = true;
  lang_exact_onload: string;
  apilang_onload: string;
  intCount = 0;
  isMobile = false;
  //Intersection Observer
  @ViewChild("loadMoreElem") loadMoreElem: ElementRef;
  //pagination
  leftArrow: string;
  rightArrow: string;
  page: number;
  totalPages: any[];
  pager: any = {};
  pagedItems: any[];
  locale: string;
  showingDetails: string;
  facetType: string;

  constructor(
    private element: ElementRef,
    private ref: ChangeDetectorRef,
    private pagerService: PagerService
  ) {
    //console.log('on load ' + new Date);

    this.wcmMode = "wcmmode=disabled";
    this.excludedLanguages = [
      "Arabic",
      "Chinese",
      "English",
      "French",
      "Russian",
      "Spanish",
    ];
    this.dateFormates = {
      //'ar' : 'YYYY/MM/DD',
      bg: "D MMMM, YYYY",
      de: "DD MMM YYYY",
      en: "MMMM DD, YYYY",
      es: "MMMM DD, YYYY",
      //'fa' : 'MMM DD, YYYY',
      fr: "DD MMMM YYYY",
      //'hi' : 'DD MMMM, YYYY',
      id: "D MMMM YYYY",
      ja: "YYYY年M月D日",
      km: "D MMMM YYYY",
      //'mk' : 'DD MMMM YYYY',
      ta: "D MMMM YYYY",
      mn: "YYYY.M.DD",
      pl: "DD MMMM YYYY",
      //'ps' : 'MMM DD, YYYY',
      ro: "DD MMMM YYYY",
      ru: "D MMMM YYYY",
      sq: "DD MMMM YYYY",
      th: "D MMMM YYYY",
      tr: "DD MMMM YYYY",
      sr: "DD MMMM YYYY",
      si: "DD MMMM YYYY",
      uk: "D MMMM, YYYY",
      zh: "YYYY年M月D日",
      "hy-am": "MMMM DD, YYYYթ",
      hr: "YYYY MMMM DD",
      ko: "YYYY MMMM Do",
      lo: "Do MMMM YYYY",
      //'vi' : 'MMM DD, YYYY'
    };

    this.inTranslation = {
      en: "in",
      es: "in",
      fr: "in",
      ru: "in",
      ar: "in",
      zh: "in",
    };

    this.i18nFilter = {
      fr: "filtre",
      ru: "Фильтр",
      es: "filtrar",
      zh: "过滤",
      ar: "منقي",
    };
    this.i18nClearAll = {
      fr: "Clair Tout",
      ru: "Очистить Все",
      es: "Borrar todo",
      zh: "明确 所有",
      ar: "واضح الكل",
    };
    this.showingFrom = 1;
    this.loading = true;
    this.imagePath = this.element.nativeElement.getAttribute("imagePath");
    this.inputUrl = this.element.nativeElement.getAttribute("url");
    this.localeUrl = this.element.nativeElement.getAttribute("i18nurl");
    this.facetType = this.element.nativeElement.getAttribute("facetType")
      ? this.element.nativeElement.getAttribute("facetType")
      : "checkbox";
    this.title = this.element.nativeElement.getAttribute("pageTitle");
    this.locales = JSON.parse(
      this.element.nativeElement.getAttribute("locale")
    );
    this.searchIn = this.element.nativeElement.getAttribute("searchIn");
    this.liveEvents = this.element.nativeElement.getAttribute("liveEvents");
    this.searchBoxText =
      this.element.nativeElement.getAttribute("search-box-text");
    if (this.inputUrl != "" && this.inputUrl != " ") {
      let urlSplit = this.inputUrl.split("?");

      let split = urlSplit[0]
        .split("")
        .reverse()
        .join("")
        .split(/\/(.+)/)
        .map((x) => x.split("").reverse().join(""))
        .reverse()
        .filter((x) => x);

      //this.host = split[0]+'/'+this.searchIn;
      this.host = split[0] + "/" + split[1];
      this.inputParameters = urlSplit[1];

      this.allFacets = this.getParameterByName("fct", this.inputUrl);
      if (this.allFacets != null) {
        let allFacetsSplit = this.allFacets.split(",");
        for (let i = 0; i < allFacetsSplit.length; i++) {
          //updated on 9/12/2022
          /* if (this.getParameterByName(allFacetsSplit[i], this.inputUrl) != null) {
	        			this.selectedFacets[allFacetsSplit[i]] = this.getParameterByName(allFacetsSplit[i], this.inputUrl);	
	        		} */
          if (
            this.getParameterByName(
              allFacetsSplit[i],
              document.location.search
            ) != null
          ) {
            this.selectedFacets[allFacetsSplit[i]] = this.getParameterByName(
              allFacetsSplit[i],
              document.location.search
            );
          }
        }
      }
      this.rows = Number(this.getParameterByName("rows", this.inputUrl));
      this.languageExact =
        this.getParameterByName("lang_exact", this.inputUrl) == null
          ? "lang_exact=English"
          : "lang_exact=" +
            this.getParameterByName("lang_exact", this.inputUrl);
      this.apiLanguage =
        this.getParameterByName("apilang", this.inputUrl) == null
          ? "apilang=en"
          : "apilang=" + this.getParameterByName("apilang", this.inputUrl);
      this.isResults = this.getParameterByName("isresult", this.inputUrl)
        ? true
        : false;
      this.languageVal = Object.keys(this.locales).find(
        (key) => this.locales[key] === this.apiLanguage.split("=")[1]
      );
      this.facetParameters = [];
      // API language Update
      let queryArr = [];
      //updated on 9/12/2022
      for (const key in this.facetParameters) {
        if (this.facetParameters.hasOwnProperty(key)) {
          let value = this.facetParameters[key];
          if (key == "qterm") {
            this.qterm = value;
          }
          queryArr.push(key + "=" + value);
          //}
        }
      }
      for (const key in this.selectedFacets) {
        if (this.selectedFacets.hasOwnProperty(key) && key != "lang_exact") {
          let value = this.selectedFacets[key];
          if (key == "qterm") {
            this.qterm = value;
          }
          queryArr.push(key + "=" + value);
          //}
        }
      }
      //
      this.facetParameters =
        Object.keys(this.getQueryParams(document.location.search)).length > 0
          ? this.getQueryParams(document.location.search)
          : { lang_exact: this.languageVal };
      /* if(this.apiLanguage) { // check initially lang is set
					this.keys = '&'+this.keys;
					this.facetParameters = Object.keys(this.getQueryParams(document.location.search)).length>0? this.getQueryParams(document.location.search) : {'lang_exact':this.languageVal};
				}
				else {
					this.facetParameters = this.getQueryParams(document.location.search);
					this.intialLangset = false;
				} */

      //
      this.url =
        this.host +
        "?" +
        this.inputParameters +
        "&" +
        queryArr.join("&") +
        "&os=0";
      // this.apiLanguage = 'apilang=' + (this.locales[this.languageExact.split('=')[1]] === undefined ? 'en' : this.locales[this.languageExact.split('=')[1]]);
      // if (this.displayParameters.indexOf('lang_exact=') === -1) {
      // 	if (this.displayParameters == '') {
      // 		this.url = this.host + '?' + this.inputParameters + '&' + this.apiLanguage + '&' + this.languageExact;
      // 	} else {
      // 		this.url = this.host + '?' + this.inputParameters + '&' + this.apiLanguage + '&' + this.languageExact + '&' + this.displayParameters;
      // 	}
      // } else {
      // 	this.url = this.host + '?' + this.inputParameters + '&' + this.apiLanguage + '&' + this.displayParameters;
      // }
      //console.log('init---' + this.url);
      //check on page load qterm is available in site url and insert into api if exist
      if (this.getParameterByName("qterm", document.location.search)) {
        this.url =
          this.url +
          "&qterm=" +
          this.getParameterByName("qterm", document.location.search);
      }
      //check on page load srt is available in site url and insert into api if exist
      if (this.getParameterByName("srt", document.location.search)) {
        this.url =
          this.url +
          "&srt=" +
          this.getParameterByName("srt", document.location.search);
      }

      this.localeUrlParameter = this.localeUrl + this.apiLanguage;

      let locale = this.apiLanguage.split("=")[1];
      this.localeAndDateFormat = {
        locale: locale,
        format:
          this.dateFormates[locale] === undefined
            ? "DD MMMM YYYY"
            : this.dateFormates[locale],
      };

      this.filter = this.i18nFilter.hasOwnProperty(locale)
        ? this.i18nFilter[locale]
        : "Filter";
      this.clearAll = this.i18nClearAll.hasOwnProperty(locale)
        ? this.i18nClearAll[locale]
        : "Clear All";
      this.sideBarArrow =
        locale == "ar" ? "lp lp-chevron-right" : "lp lp-chevron-left";
    }
  }

  ngOnInit() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      // true for mobile device
      this.isMobile = true;
    }

    let localeVal = this.apiLanguage.split("=");
    this.locale = localeVal[1];
    //this.sideBarArrow = locale[1] == 'ar' ? 'fa fa-angle-right' : 'fa fa-angle-left';
    this.leftArrow =
      localeVal[1] == "ar" ? "lp lp-chevron-right" : "lp lp-chevron-left";
    this.rightArrow =
      localeVal[1] == "ar" ? "lp lp-chevron-left" : "lp lp-chevron-right";
  }

  ngAfterViewInit() {
    if (this.isMobile) {
      const threshold = 0.3; // how much % of the element is in view
      let rowsCount =
        this.rows + Number(this.getParameterByName("rows", this.url));
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            //console.log(entry['isVisible'], entry['isIntersecting'], rowsCount, this.total)
            if (entry["isIntersecting"]) {
              // run your animation code here
              if (entry["isIntersecting"] && this.intCount > 0) {
                this.loadMore();
              }
              this.intCount++;
              //observer.disconnect(); // disconnect if you want to stop observing else it will rerun every time its back in view. Just make sure you disconnect in ngOnDestroy instead
            }
          });
        },
        { threshold }
      );
      observer.observe(this.loadMoreElem.nativeElement);
    }
  }

  public updateParameter1(parameter: any) {
    this.onLoad = true;
    this.loading = true;

    if (this.displayParameters == "" || this.displayParameters == " ") {
      if (parameter.indexOf("lang_exact=") === -1) {
        this.displayParameters = this.languageExact + "&" + parameter;
      } else {
        this.displayParameters = parameter;
      }

      if (parameter.indexOf("lang_exact=") !== -1) {
        this.languageExact =
          "lang_exact=" +
          this.getParameterByName("lang_exact", "?" + parameter);
      } else if (parameter.indexOf("tf=") !== -1) {
        this.timeframeParameter = parameter;
      } else if (
        parameter.indexOf("strdate=") !== -1 &&
        parameter.indexOf("strdate=") !== -1
      ) {
        let params = parameter.split("&");
        params = params.filter(function (entry) {
          return entry.trim() != "";
        });
        this.startDateParameters = params[0];
        this.endDateParameters = params[1];
      }

      if (this.allFacets.indexOf(parameter.split("=")[0]) !== -1)
        this.facetParameters = parameter;
    } else {
      if (parameter.indexOf("qterm=") !== -1) {
        if (this.getParameterByName("lang_exact", this.url) != null) {
          this.languageExact =
            "lang_exact=" + this.getParameterByName("lang_exact", this.url);
          this.facetParameters = this.languageExact;
          this.displayParameters = this.languageExact + "&" + parameter;
        } else {
          this.displayParameters = parameter;
        }
        let urlSplit = this.inputUrl.split("?");
        this.inputParameters = urlSplit[1];
        this.inputParameters = this.removeURLParameter(
          this.inputParameters,
          "apilang"
        );
        this.inputParameters = this.removeURLParameter(
          this.inputParameters,
          "lang_exact"
        );
      } else {
        if (parameter.indexOf("&") === -1) {
          if (parameter.split("=")[1] == "") {
            if (this.selectedFacets.hasOwnProperty(parameter.split("=")[0])) {
              if (parameter.indexOf("lang_exact=") !== -1) {
                this.languageExact = parameter;
              } else {
                this.inputParameters =
                  this.inputParameters +
                  "&" +
                  parameter.split("=")[0] +
                  "=" +
                  this.selectedFacets[parameter.split("=")[0]];
              }
            }

            if (parameter.indexOf("lang_exact=") !== -1) {
              this.displayParameters =
                this.removeURLParameter(
                  this.displayParameters,
                  parameter.split("=")[0]
                ) +
                "&" +
                parameter;
              this.facetParameters =
                this.removeURLParameter(
                  this.facetParameters,
                  parameter.split("=")[0]
                ) +
                "&" +
                parameter;
            } else {
              this.displayParameters = this.removeURLParameter(
                this.displayParameters,
                parameter.split("=")[0]
              );
              this.facetParameters = this.removeURLParameter(
                this.facetParameters,
                parameter.split("=")[0]
              );
            }
          } else {
            let modifiedUrl = this.displayParameters;
            if (
              parameter.indexOf("futureevents") !== -1 ||
              parameter.indexOf("pastevents") !== -1
            ) {
              modifiedUrl =
                modifiedUrl.indexOf("futureevents") === -1
                  ? modifiedUrl
                  : this.removeURLParameter(modifiedUrl, "futureevents");
              modifiedUrl =
                modifiedUrl.indexOf("pastevents") === -1
                  ? modifiedUrl
                  : this.removeURLParameter(modifiedUrl, "pastevents");
            }

            if (parameter.indexOf("srt=") !== -1)
              modifiedUrl = this.removeURLParameter(modifiedUrl, "srt");
            if (parameter.indexOf("lang_exact=") !== -1)
              modifiedUrl = this.removeURLParameter(modifiedUrl, "lang_exact");

            this.displayParameters = modifiedUrl + "&" + parameter;

            if (this.allFacets.indexOf(parameter.split("=")[0]) !== -1)
              this.facetParameters = parameter;
          }
          if (parameter.indexOf("tf=") !== -1)
            this.timeframeParameter = parameter;
          if (parameter.indexOf("lang_exact=") !== -1)
            this.languageExact = parameter;
        } else {
          if (
            parameter.indexOf(this.languageExact.split("=")[0] + "=") === -1
          ) {
            //console.log("1");
            let params = parameter.split("&");
            params = params.filter(function (entry) {
              return entry.trim() != "";
            });
            this.startDateParameters = params[0];
            this.endDateParameters = params[1];

            if (this.displayParameters.indexOf("strdate=") !== -1) {
              //	console.log("strdate");
              this.displayParameters = this.removeURLParameter(
                this.displayParameters,
                "strdate"
              );
              //	console.log(this.displayParameters);
            }

            if (this.displayParameters.indexOf("enddate=") !== -1) {
              console.log("enddate");
              this.displayParameters = this.removeURLParameter(
                this.displayParameters,
                "enddate"
              );
              console.log(this.displayParameters);
            }

            //console.log(this.displayParameters);
          } else {
            ///console.log("2");
            let params = parameter.split("&");
            params = params.filter(function (entry) {
              return entry.trim() != "";
            });

            for (let i = 0; i < params.length; i++) {
              this.displayParameters = this.removeURLParameter(
                this.displayParameters,
                params[i].split("=")[0]
              );
              this.inputParameters = this.removeURLParameter(
                this.inputParameters,
                params[i].split("=")[0]
              );

              if (params[i].split("=")[0] == "lang_exact")
                this.languageExact = params[i];
            }

            if (parameter.indexOf(this.languageExact.split("=")[0]) === -1)
              parameter =
                parameter + "&" + this.languageExact.split("=")[0] + "=";

            this.facetParameters = parameter;
          }
          if (
            this.displayParameters == "" ||
            this.displayParameters === undefined
          )
            this.displayParameters = parameter;
          else
            this.displayParameters =
              this.displayParameters + (parameter == "" ? "" : "&" + parameter);
        }
      }
      this.inputParameters =
        this.removeURLParameter(this.inputParameters, "rows") +
        "&rows=" +
        this.rows;
      if (this.displayParameters.charAt(0) === "&")
        this.displayParameters = this.displayParameters.slice(1);
    }

    this.inputParameters = this.removeURLParameter(
      this.inputParameters,
      "apilang"
    );
    this.apiLanguage =
      "apilang=" +
      (this.locales[this.languageExact.split("=")[1]] === undefined
        ? "en"
        : this.locales[this.languageExact.split("=")[1]]);
    this.localeUrlParameter = this.localeUrl + this.apiLanguage;

    let displayUrl = window.location.href;
    let displayUrlSplit = displayUrl.split("?");
    this.url =
      this.host +
      "?" +
      this.inputParameters +
      "&" +
      this.apiLanguage +
      (this.displayParameters == ""
        ? this.displayParameters
        : "&" + this.displayParameters);
    //console.log('update---' + this.url);
    window.history.pushState(
      "",
      "",
      displayUrlSplit[0] +
        (this.displayParameters == ""
          ? this.displayParameters
          : "?" + this.displayParameters)
    );

    let locale = this.apiLanguage.split("=")[1];
    this.localeAndDateFormat = {
      locale: locale,
      format:
        this.dateFormates[locale] === undefined
          ? "DD MMMM YYYY"
          : this.dateFormates[locale],
    };
    this.filter = this.i18nFilter.hasOwnProperty(locale)
      ? this.i18nFilter[locale]
      : "Filter";
    this.clearAll = this.i18nClearAll.hasOwnProperty(locale)
      ? this.i18nClearAll[locale]
      : "Clear All";
    this.sideBarArrow =
      locale == "ar" ? "fa fa-angle-right" : "fa fa-angle-left";

    if (this.isResults && parameter.indexOf("admreg_exact=") !== -1) {
      let regionValue = this.getParameterByName("admreg_exact", parameter);
      this.regionParam =
        regionValue == null ? "" : "admreg_exact=" + regionValue;
    } else {
      this.regionParam = "";
    }
  }
  public getQueryParams(qs) {
    // qs = qs.split('+').join(' ');
    var params = {},
      tokens: any,
      re = /[?&]?([^=]+)=([^&]*)/g;

    while ((tokens = re.exec(qs))) {
      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
  }
  public updateParameter(parameter: any) {
    //console.log('on click ' + new Date);
    console.log(parameter);

    this.onLoad = true;
    this.loading = true;
    this.qterm = "";
    this.page = 1;
    //debugger

    if (parameter == "pastevents=on") {
      parameter = {
        pastevents: ["on"],
      };
      this.url = this.removeURLParameter(this.url, "futureevents");
      delete this.facetParameters["futureevents"];
    }

    if (parameter == "futureevents=on") {
      parameter = {
        futureevents: ["on"],
      };
      this.url = this.removeURLParameter(this.url, "pastevents");
      delete this.facetParameters["pastevents"];
    }

    if (parameter == "srt=date") {
      parameter = {
        srt: ["date"],
      };
      //this.url = this.removeURLParameter(this.url, "pastevents");
      //delete this.facetParameters["pastevents"];
    }
    if (parameter == "srt=score") {
      parameter = {
        srt: ["score"],
      };
      //this.url = this.removeURLParameter(this.url, "pastevents");
      //delete this.facetParameters["pastevents"];
    }

    let queryArr = [];
    for (const key in parameter) {
      if (parameter.hasOwnProperty(key)) {
        if (parameter[key] != "" && parameter[key] != undefined) {
          if (this.url.indexOf(key + "=") !== -1) {
            this.url = this.removeURLParameter(this.url, key);
          }
          if (key == "qterm") {
            this.qterm = parameter[key];
          }
          if (
            (key == "strdate" && parameter["strdate"] == "") ||
            (key == "enddate" && parameter["enddate"] == "")
          ) {
            //
          } else {
            if (key != "qterm") {
              if (parameter[key].includes("^")) {
                this.facetParameters[key] = parameter[key].join("^");
              } else {
                this.facetParameters[key] = parameter[key];
              }
            }
          }
        } else {
          delete this.facetParameters[key];
        }
      }
    }
    if (this.qterm != undefined && this.qterm != "") {
      //queryArr.push("qterm"=this.qterm)
      // queryArr.push("qterm" + "=" + this.qterm);
      this.facetParameters["qterm"] = this.qterm;
    }
    let queryArr1 = [];

    for (const key in this.facetParameters) {
      if (this.facetParameters.hasOwnProperty(key)) {
        let value = this.facetParameters[key];
        queryArr1.push(key + "=" + value);
      }
    }

    // if (queryArr1.length > 0){
    //     this.url += "&" + queryArr1.join("&");
    // }

    let len_exact_val = this.languageExact.split("=");
    //console.log(len_exact_val[1])
    this.url =
      this.host +
      "?" +
      this.inputParameters +
      "&" +
      queryArr1.join("&") +
      "&os=0";
    // API language Update
    if (len_exact_val[1] == undefined || len_exact_val[1].length < 1) {
      this.url = this.removeURLParameter(this.url, "lang_exact");
      this.url = this.removeURLParameter(this.url, "apilang");
    } else if (len_exact_val[1]) {
      let langVal = this.locales[len_exact_val[1]];
      this.url = this.removeURLParameter(this.url, "lang_exact");
      this.url = this.removeURLParameter(this.url, "apilang");
      this.url =
        this.url + "&apilang=" + langVal + "&lang_exact=" + len_exact_val[1];
    }
    //
    window.history.pushState("", "", "?" + queryArr1.join("&"));
    this.inputParameters = this.removeURLParameter(
      this.inputParameters,
      "apilang"
    );
    //console.log(this.locales[parameter['lang_exact']], 'APi', this.apiLanguage)
    //this.apiLanguage = 'apilang=' + (this.locales[this.languageExact.split('=')[1]] === undefined ? this.locales[parameter['lang_exact']] : this.locales[this.languageExact.split('=')[1]]);

    if (this.locales[len_exact_val[1]] === undefined) {
      this.apiLanguage = "apilang=en";
    } else {
      this.apiLanguage = "apilang=" + this.locales[len_exact_val[1]];
    }
    //debugger
    if (this.intialLangset) {
      this.localeUrlParameter = this.localeUrl + this.apiLanguage;
    } else {
      if (this.locales[parameter["lang_exact"]] === undefined) {
        this.localeUrlParameter = this.localeUrl;
      } else {
        this.localeUrlParameter = this.localeUrl + this.apiLanguage + "&";
      }
    }

    let displayUrl = window.location.href;

    let locale = this.apiLanguage.split("=")[1];
    this.localeAndDateFormat = {
      locale: locale,
      format:
        this.dateFormates[locale] === undefined
          ? "DD MMMM YYYY"
          : this.dateFormates[locale],
    };
    this.filter = this.i18nFilter.hasOwnProperty(locale)
      ? this.i18nFilter[locale]
      : "Filter";
    this.clearAll = this.i18nClearAll.hasOwnProperty(locale)
      ? this.i18nClearAll[locale]
      : "Clear All";
    this.sideBarArrow =
      locale == "ar" ? "fa fa-angle-right" : "fa fa-angle-left";

    if (this.isResults && parameter.indexOf("admreg_exact=") !== -1) {
      let regionValue = this.getParameterByName("admreg_exact", parameter);
      this.regionParam =
        regionValue == null ? "" : "admreg_exact=" + regionValue;
    } else {
      this.regionParam = "";
    }

    //console.log(locale, 'lnag')
    //console.log('URL', this.url)
    this.facetParameters =
      Object.keys(this.getQueryParams(document.location.search)).length > 0
        ? this.getQueryParams(document.location.search)
        : { lang_exact: this.languageVal };
  }
  public updatedValues(value: any) {
    this.i18n = value.i18n;

    if (
      this.liveEvents == "false" &&
      this.searchIn == "all_events" &&
      value.facets[0] &&
      value.facets[0].facetItems.length > 1
    ) {
      value.facets[0].facetItems.pop();
      /* var filteredArray = value.facets[0].facetItems.filter(function (e) {
        return e.name !== "Live Event";
      }); */
    }
    this.facets = value.facets;
    this.total = value.total;
    this.showingTo = value.showingTo;
    this.isLoadMore = value.isLoadMore;
    this.loading = false;

    if (this.onLoad) {
      let qterm = this.getParameterByName("qterm", this.url);
      let srt = this.getParameterByName("srt", this.url);
      let sterm = qterm == null ? "" : qterm;
      let sresults = this.total;
      let sortby = "";

      if (this.searchIn == "all_experts") {
        if (sterm == "") {
          if (srt == "job_title") sortby = "jobtitle";
          else sortby = "alphabetical";
        } else {
          if (srt == null) {
            sortby = "best match";
          } else {
            if (srt == "surname") sortby = "alphabetical";
            else if (srt == "job_title") sortby = "jobtitle";
            else sortby = "best match";
          }
        }
      } else if (this.searchIn == "all_events") {
        if (sterm == "") {
          if (this.url.indexOf("pastevents") !== -1) sortby = "past";
          else sortby = "upcoming";
        } else {
          if (srt == null) sortby = "best match";
          else sortby = srt == "score" ? "best match" : srt;
        }
      } else {
        if (sterm == "") {
          sortby = "date";
        } else {
          if (srt == null) sortby = "best match";
          else sortby = srt == "score" ? "best match" : srt;
        }
      }
      //analyticParams(this.displayParameters, sterm, sresults, sortby);
    }
    //pagination
    this.page = this.page ? this.page : 1;
    this.getShowingDetails(this.page, this.total, this.qterm);
    this.pagination(this.page, this.total);
    this.ref.detectChanges();
    this.loading = false;
  }

  public updateIsCollapsed(collapse: any) {
    this.isCollapsed = collapse;
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
    if (window.scrollY > 50) {
      this.isScrollToTop = true;
    } else {
      this.isScrollToTop = false;
    }
  }

  public onScrollToTop() {
    window.scrollTo(0, 0);
  }

  public onScrollToLoadMore() {
    document.getElementById("loadMore1").scrollIntoView(true);
  }

  public loadMore() {
    this.loading = true;
    let numberOfRows =
      this.rows + Number(this.getParameterByName("rows", this.url));
    let modifiedUrl = this.removeURLParameter(this.url, "rows");
    this.url = modifiedUrl + "&rows=" + numberOfRows;
  }

  public updateFacetsCollapsed(facetsCollapsed: any) {
    this.isFacetsCollapsed = facetsCollapsed;
    this.sideBarArrow =
      this.sideBarArrow == "fa fa-angle-left"
        ? "fa fa-angle-right"
        : "fa fa-angle-left";
  }

  /* public onClearAll() {		
		let modifiedUrl = this.url;			
		this.timeframeParameter = 'tf=';
		this.queryParameter = 'qterm='
		this.startDateParameters = 'strdate=';
		this.endDateParameters = 'enddate=';
		
		let apilang = this.getParameterByName('apilang', this.inputUrl);		
		let lang_exact = this.getParameterByName('lang_exact', this.inputUrl);
		this.apiLanguage = 'apilang=' + (apilang == null ? 'en' : apilang);
		this.languageExact = 'lang_exact=' + (lang_exact == null ? 'English' : lang_exact);		
		this.displayParameters = this.facetParameters = this.languageExact;		 

		let urlSplit = this.inputUrl.split('?');
        let host = urlSplit[0];        
	    this.inputParameters = urlSplit[1];
		this.inputParameters = this.removeURLParameter(this.inputParameters, 'apilang');	
		this.inputParameters = this.removeURLParameter(this.inputParameters, 'lang_exact');		
		this.url = host + '?' + this.inputParameters + '&' + this.apiLanguage + '&' + this.languageExact;
		this.localeUrlParameter = this.localeUrl + this.apiLanguage;
		let locale = this.apiLanguage.split('=')[1];
		this.filter = this.i18nFilter.hasOwnProperty(locale) ? this.i18nFilter[locale] : 'Filter';
		this.clearAll = this.i18nClearAll.hasOwnProperty(locale) ? this.i18nClearAll[locale] : 'Clear All';
		if (this.url === modifiedUrl) {
			this.loading = false;	
		} else {
			this.loading = true;
		}
		
		let displayUrl = window.location.href;
		let displayUrlSplit = displayUrl.split('?');
		window.history.pushState('', '', displayUrlSplit[0]);
	} */

  public onClearAll() {
    let modifiedUrl = this.url;
    this.timeframeParameter = "tf=";
    this.queryParameter = "qterm=";
    this.startDateParameters = "strdate=";
    this.endDateParameters = "enddate=";
    this.page = 1;

    let apilang = this.getParameterByName("apilang", this.inputUrl);
    let lang_exact = this.getParameterByName("lang_exact", this.inputUrl);
    this.apiLanguage = "apilang=" + (apilang == null ? "en" : apilang);
    this.languageExact =
      "lang_exact=" + (lang_exact == null ? "English" : lang_exact);
    //this.displayParameters = this.facetParameters = this.languageExact;

    let urlSplit = this.inputUrl.split("?");
    let host = urlSplit[0];
    this.inputParameters = urlSplit[1];
    this.inputParameters = this.removeURLParameter(
      this.inputParameters,
      "apilang"
    );
    this.inputParameters = this.removeURLParameter(
      this.inputParameters,
      "lang_exact"
    );
    this.url =
      host +
      "?" +
      this.inputParameters +
      "&" +
      this.apiLanguage +
      "&" +
      this.languageExact;
    this.localeUrlParameter = this.localeUrl + this.apiLanguage;
    let locale = this.apiLanguage.split("=")[1];
    this.filter = this.i18nFilter.hasOwnProperty(locale)
      ? this.i18nFilter[locale]
      : "Filter";
    this.clearAll = this.i18nClearAll.hasOwnProperty(locale)
      ? this.i18nClearAll[locale]
      : "Clear All";
    if (this.url === modifiedUrl) {
      this.loading = false;
    } else {
      this.loading = true;
    }
    this.facetParameters = [];
    // Api language Update
    this.facetParameters = { lang_exact: this.languageVal };
    if (this.intialLangset) {
      this.localeUrlParameter = this.localeUrl + this.apiLanguage;
    } else {
      this.localeUrlParameter = this.localeUrl;
      this.url = this.removeURLParameter(this.url, "apilang");
      this.url = this.removeURLParameter(this.url, "lang_exact");
    }
    //
    let displayUrl = window.location.href;
    this.qterm = "";
    let displayUrlSplit = displayUrl.split("?");
    window.history.pushState("", "", displayUrlSplit[0]);
  }

  public updatedLabel(label: any) {
    if (label != "" && this.isResults) {
      let locale = this.apiLanguage.split("=")[1];
      this.inLabel =
        this.inTranslation[locale] === undefined
          ? "in"
          : this.inTranslation[locale];

      this.regionTitle = " " + this.inLabel + " " + label;
    } else {
      this.regionTitle = "";
    }
  }

  public getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  public removeURLParameter(url, parameter) {
    var prefix = encodeURIComponent(parameter) + "=";
    var pars = url.split(/[&;]/g);

    for (var i = pars.length; i-- > 0; ) {
      if (pars[i].lastIndexOf(prefix, 0) !== -1) {
        pars.splice(i, 1);
      }
    }
    return pars.join("&");
  }

  //Pagination
  public setPage(page: number, el: HTMLElement) {
    this.loading = true;
    this.page = page;
    this.url =
      this.removeURLParameter(this.url, "os") + "&os=" + (page - 1) * this.rows;
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    //el.scrollIntoView({ behavior: "smooth" });
  }

  public pagination(page: any, total: any) {
    // total pages
    let range = [];
    for (let i = 1; i <= total; i++) {
      range.push(i);
    }

    this.totalPages = range;
    // get pager object from service
    this.pager = this.pagerService.getPager(
      this.totalPages.length,
      page,
      this.rows
    );

    // get current page of items
    this.pagedItems = this.totalPages.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }

  public getShowingDetails(page, total, qterm) {
    let showingFrom = page == 1 ? 1 : (page - 1) * this.rows + 1;
    let showingTo = page * this.rows > total ? total : page * this.rows;

    showingFrom = this.toCurrency(showingFrom);
    showingTo = this.toCurrency(showingTo);
    total = this.toCurrency(Number(total));
    qterm = qterm == undefined || qterm == null ? "" : qterm;

    if (this.locale == "en") {
      this.showingDetails =
        "Showing " +
        showingFrom +
        " - " +
        showingTo +
        " of " +
        total +
        " results";
    } else if (this.locale == "es") {
      this.showingDetails =
        "Mostrar " +
        showingFrom +
        " - " +
        showingTo +
        " de " +
        total +
        " resultados";
    } else if (this.locale == "fr") {
      this.showingDetails =
        "Affiche " +
        showingFrom +
        " - " +
        showingTo +
        " sur " +
        total +
        " résultats";
    } else if (this.locale == "pt") {
      this.showingDetails =
        "Mostrando " +
        showingFrom +
        " - " +
        showingTo +
        " de " +
        total +
        " resultados";
    } else if (this.locale == "ru") {
      this.showingDetails =
        "Показывает " +
        showingFrom +
        " - " +
        showingTo +
        " из " +
        total +
        " результаты";
    } else if (this.locale == "ar") {
      this.showingDetails =
        " إظهار " +
        showingFrom +
        " - " +
        showingTo +
        "	خاصة بـ " +
        total +
        " نتيجة";
    } else if (this.locale == "zh") {
      this.showingDetails =
        "显示 " + showingFrom + " - " + showingTo + " / " + total + " 显示";
    } else {
      this.showingDetails = "";
    }
  }
  public toCurrency(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
