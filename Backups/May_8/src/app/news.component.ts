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

  constructor(private http: Http) {}

  ngOnChanges() {
    console.log("pgaload", this.ispageloaded);

    if (this.ispageloaded) this.getData(this.url);
  }

  ngAfterViewInit() {
    //if (this.isMobile) {
    const threshold = 0.3; // how much % of the element is in view
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
    observer.observe(this.everythingContent.nativeElement);
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
    const combined = Observable.forkJoin(
      this.http.post(url, "").map((response: Response) => {
        this.ispageloaded = true;
        return response.json();
      }),
      this.http.post(i18nUrl, "").map((response: Response) => {
        //console.log('i18n ' + new Date);

        return response.json();
      })
    );

    combined.subscribe((combinedValues) => {
      const [apiResponse, i18nResponse] = combinedValues;
      this.apiResponse = apiResponse;
      this.i18n = i18nResponse;
      let objFacet = "documents";
      if (this.searchIn == "everything") {
        objFacet = "everything";
      }

      this.facetsResponse = this.apiResponse[objFacet].facets;
      //this.facetsResponse = this.apiResponse.documents.facets;
      let total = this.apiResponse.total;
      let showingTo,
        isLoadMore,
        facets = [];

      if (Object.keys(this.facetsResponse).length == 0) {
        showingTo = 0;
        isLoadMore = false;
        this.http
          .post(this.localeUrlParameter + "&keys=NoResultsMsg", "")
          .map((res: Response) => res.text())
          .subscribe((response) => {
            this.noData =
              response.trim().split(":")[1].slice(1).slice(0, -8) + "</a>";
          });
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

        for (let facetName in this.facetsResponse) {
          let facetItems = [];
          for (let facetItemKey in this.facetsResponse[facetName]) {
            facetItems.push(this.facetsResponse[facetName][facetItemKey]);
          }
          facets.push({ facetName: facetName, facetItems: facetItems });

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

        delete this.apiResponse[objFacet].facets;
        let documents = [];
        Object.keys(this.apiResponse[objFacet]).forEach((key) => {
          let result = this.apiResponse[objFacet][key];
          if (result["desc"] != undefined && result["desc"] != "") {
            result["desc"] = this.limitText(result["desc"]);
          }
          documents.push(result);
        });
        this.documents = documents;
        showingTo = numberOfRows >= total ? total : numberOfRows;
        isLoadMore = numberOfRows >= total ? false : true;
      }
      this.finalResponse.emit({
        i18n: this.i18n,
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
}
