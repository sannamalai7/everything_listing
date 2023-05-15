import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/map";
import { publishReplay, refCount, tap } from "rxjs/Operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "news",
  templateUrl: "./news.component.html",
  providers: [],
})
export class NewsComponent {
  @Input() url: string;
  @Input() localeUrlParameter: string;
  @Input() allFacets: string;
  @Input() searchIn: string;
  @Input() keys: string;
  @Input() localeAndDateFormat: any;
  @Input() excludedLanguages: string[];
  @Input() regionParam: string;
  @Input() facetKeys: string;
  @Input() listingTitles: string;
  @Input() subKey: string;
  @Input() i18ndatas: object;
  @Input() lang: string;
  @Input() devcommittee: string;

  @Output() finalResponse = new EventEmitter<any>();
  @Output() outParameters = new EventEmitter<any>();
  @Output() regionLabel = new EventEmitter<string>();

  apiResponse: any;
  documents: any[];
  facetsResponse: any;
  noData: string;
  sortBy: string = "SortBy";
  date: string = "Date";
  bestMatch: string = "BestMatch";
  type: string = "displayconttype_exact";
  language: string = "lang_exact";
  i18n: any;
  srt: string;
  isSearch: boolean = false;
  ispageloaded: boolean = false;
  @ViewChild("everythingContent") everythingContent: ElementRef;
  documentHeaders: any[] = [];
  documentHeaderskeys: any[] = [];

  constructor(private http: HttpClient) {
    //this.documentHeaders = ["Title", "Meeting", "Document Number", "Language"];
  }

  ngOnChanges() {
    if (this.ispageloaded) this.getData(this.url);
  }

  ngOnInit() {
    /* Object.keys(this.i18ndatas[this.lang]).forEach((key) => {
      this.documentHeaders.push(this.i18ndatas[this.lang][key]);
    }); */
    let headerVal = this.listingTitles.split(",");
    headerVal.forEach((key) => {
      this.documentHeaders.push(this.i18ndatas[this.lang][key]);
      this.documentHeaderskeys.push(key);
    });
  }

  ngAfterViewInit() {
    //if (this.isMobile) {
    /* const threshold = 0.3; // how much % of the element is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          //console.log(entry['isVisible'], entry['isIntersecting'], rowsCount, this.total)
          if (entry["isIntersecting"]) {
            // run your animation code here
            if (entry["isIntersecting"]) {
              this.getData(this.url);
            }
            //observer.disconnect(); // disconnect if you want to stop observing else it will rerun every time its back in view. Just make sure you disconnect in ngOnDestroy instead
          }
        });
      },
      { threshold }
    );
    observer.observe(this.everythingContent.nativeElement); */
    this.getData(this.url);
    //}
  }

  getData = function (url: string) {
    let i18nUrl = this.localeUrlParameter + this.keys + "," + this.allFacets;
    let numberOfRows = Number(this.getParameterByName("rows", url));
    let languageExact = this.getParameterByName("lang_exact", url);
    let qterm = this.getParameterByName("qterm", this.url);
    url = url.slice(-1) == "&" ? url.slice(0, -1) : url;
    if (qterm == null || qterm == "") {
      let srtParam = this.getParameterByName("srt", url);
      this.srt = srtParam == null ? "lnchdt" : srtParam;
      this.isSearch = false;
    } else {
      url = url.indexOf("srt=") === -1 ? url + "&srt=score" : url;
      this.srt = this.getParameterByName("srt", url);
      this.isSearch = true;
    }
    url = url.replace("&&", "&");
    /* const combined = Observable.forkJoin(
      this.http.post(url, "").map((response: Response) => {
        this.ispageloaded = true;
        return response.json();
      }),
      this.http.post(i18nUrl, "").map((response: Response) => {
        //console.log('i18n ' + new Date);

        return response.json();
      })
    ); */

    //update params
    this.url = this.url.replace("&&", "&");
    this.url = this.url.replace(undefined, "");
    let qtermVal = this.getParameterByName("qterm", this.url)
      ? this.getParameterByName("qterm", this.url)
      : "*";
    let order = this.getParameterByName("order", this.url)
      ? this.getParameterByName("order", this.url)
      : "desc";
    let srt = "devcom_year";
    let facetKeys = this.facetKeys.split(",");
    facetKeys = facetKeys.map((i) => i + ",count:10000");
    //console.log("wnd", window.location.href);

    let urlSplt = window.location.href.split("?");
    const otherParam = [
      "",
      "os",
      "rows",
      "qterm",
      "srt",
      "order",
      "undefined",
      "?",
    ];
    const facetParam = this.facetKeys.split(",");
    let facetFilter = "";
    let resultFilter = "";
    let apiFilter = "(devcom_conttype eq '" + this.devcommittee + "')";
    if (urlSplt[1]) {
      let urlParams = urlSplt[1].split("&");

      urlParams.forEach((param) => {
        let val = param.split("=");
        if (facetParam.indexOf(val[0]) != -1) {
          facetFilter = facetFilter + val[0] + " eq '" + val[1] + "' and ";
        }
        this.url = this.url = this.removeURLParameter(this.url, val[0]);
      });

      resultFilter = "(" + facetFilter.slice(0, -5) + ")";
      if (facetFilter) {
        apiFilter =
          "(devcom_conttype eq '" +
          this.devcommittee +
          "' and " +
          resultFilter +
          ")";
      }
    }
    let osVal = 0;
    if (this.getParameterByName("os", this.url)) {
      osVal = Number(this.getParameterByName("os", this.url));
    }
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": this.subKey,
    });
    const body = JSON.stringify({
      search: qtermVal,
      facets: facetKeys,
      filter: apiFilter,
      count: true,
      top: 20,
      skip: osVal,
      orderby: srt + " " + order,
    });
    let urlVal = this.url.split("?");
    this.http
      .post(urlVal[0], body, { headers: headers })
      .pipe(tap(publishReplay(1), refCount()))
      .subscribe((combinedValues) => {
        this.ispageloaded = true;
        this.apiResponse = combinedValues;
        /*   this.i18n = {
          devcom_year: "Meeting Year",
          devcom_conttype: "Content Type",
          devcom_doclang: "Language",
          devcom_meetype: "Meeting Type",
        }; */
        /* let objFacet = "documents";
        if (this.searchIn == "everything") {
          objFacet = "everything";
        } */
        this.facetsResponse = this.apiResponse["@search.facets"];
        //this.facetsResponse = this.apiResponse.documents.facets;
        let total = this.apiResponse["@odata.count"];
        let showingTo,
          isLoadMore,
          facets = [];

        if (Object.keys(this.facetsResponse).length == 0) {
          /*  showingTo = 0;
          isLoadMore = false;
          this.http
            .post(this.localeUrlParameter + "&keys=NoResultsMsg", "")
            .map((res: Response) => res.text())
            .subscribe((response) => {
              this.noData =
                response.trim().split(":")[1].slice(1).slice(0, -8) + "</a>";
            }); */
        } else {
          let regionKey = "",
            regionValue = "";
          if (this.regionParam != "") {
            let regionSplit = this.regionParam.split("=");

            regionKey = regionSplit[0];
            regionValue = regionSplit[1];

            if (regionValue == null || regionValue == "") {
              this.regionLabel.emit("");
            }
          } else {
            this.regionLabel.emit("");
          }
          // order factes based on input from html
          let facetKeys = this.facetKeys.split(",");
          let facetKeysorderby = {};
          facetKeys.forEach((key) => {
            facetKeysorderby[key] = this.facetsResponse[key];
          });
          for (let facetName in facetKeysorderby) {
            let facetItems = [];
            for (let facetItemKey in this.facetsResponse[facetName]) {
              if (this.facetsResponse[facetName][facetItemKey].value) {
                facetItems.push(this.facetsResponse[facetName][facetItemKey]);
              }
            }
            let resultArray = facetItems.map((elm) => ({
              count: elm.count,
              label: elm.value,
              name: elm.value,
            }));
            facets.push({ facetName: facetName, facetItems: resultArray });

            if (regionKey == facetName) {
              for (let facetItemKey in this.facetsResponse[facetName]) {
                if (
                  regionValue ==
                  this.facetsResponse[facetName][facetItemKey]["name"]
                ) {
                  this.regionLabel.emit(
                    this.facetsResponse[facetName][facetItemKey]["label"]
                  );
                  break;
                }
              }
            }
          }
          //debugger;
          // delete this.apiResponse[objFacet].facets;
          let documents = [];
          /* Object.keys(this.apiResponse.value).forEach((key) => {
            let result = this.apiResponse.value[key];
            if (result["desc"] != undefined && result["desc"] != "") {
              result["desc"] = this.limitText(result["desc"]);
            }
            documents.push(result);
          }); */
          let listingArray = this.listingTitles.split(",");

          let listingupdatedArray = listingArray.push("devcom_path");
          Object.keys(this.apiResponse.value).forEach((element) => {
            let project = this.apiResponse.value[element];
            let datas = {};
            listingArray.forEach((keys) => {
              if (keys.includes("__")) {
                let splKey = keys.split("__");
                datas[keys] = project[splKey[0]] + " " + project[splKey[1]];
              } else {
                datas[keys] = project[keys];
              }

              /* datas = {
                url: project.devcom_path,
                title: project.devcom_title,
                meeting: project.devcom_year + " " + project.devcom_meetype,
                document: project.devcom_docnum,
                language: project.devcom_doclang,
              }; */
            });
            documents.push(datas);
          });
          this.documents = documents;
          showingTo = numberOfRows >= total ? total : numberOfRows;
          isLoadMore = numberOfRows >= total ? false : true;
        }

        this.finalResponse.emit({
          i18n: this.i18ndatas[this.lang],
          facets: facets,
          total: total,
          showingTo: showingTo,
          isLoadMore: isLoadMore,
        });
      });
  };

  public getSortBy(event) {
    let srtParam = event.split("=");
    let srtParamArr = { srt: [srtParam[1]] };
    this.outParameters.emit(srtParamArr);
  }
  limitText(value) {
    let strings = value.split(" ");
    strings = strings.filter(function (entry) {
      return entry.trim() != "";
    });

    let content = "";
    for (let i = 0; i < strings.length; i++) {
      if (content.length < 450) {
        if (content == "") {
          content = strings[i];
        } else {
          content = content + " " + strings[i];
        }
      } else {
        content =
          content.slice(-1) == "," || content.slice(-1) == "."
            ? content.slice(0, -1) + "..."
            : content + "...";
        break;
      }
    }
    return content;
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
}
