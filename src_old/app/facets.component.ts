import { Component, Input, Output, EventEmitter } from "@angular/core";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";

@Component({
  selector: "facets",
  templateUrl: "./facets.component.html",
  providers: [],
  animations: [
    trigger("facetFadeInOut", [
      state("load", style({ height: "0px", display: "none" })),
      state("in", style({ height: "0px", display: "none" })),
      state("out", style({ height: "*", display: "block" })),
      transition("in => out", animate(200)),
      transition("out => in", animate(200)),
      transition("out => load", animate(200)),
      transition("load => out", animate(200)),
    ]),
  ],
})
export class FacetsComponent {
  @Input() facetParameters: any;
  @Input() facetsIn: Object;
  @Input() i18n: any;
  @Input() apiLanguage: string;
  @Input() facetType: string;
  @Input() facetKeys: string;
  @Output() selectedFacets = new EventEmitter<any>();
  @Output() outParameters = new EventEmitter<any>();

  facets: any = [];
  collapseFacets: any[] = [];
  limitFacets: any[] = [];
  selectedFacetItems: any[] = [];
  seeMore: string = "SeeMore";
  seeLess: string = "SeeLess";
  i18nValues: any;
  placeholder: string;
  locale: string;

  ngOnChanges() {
    //this.facets = this.facetsIn;
    console.log(this.selectedFacetItems, "init");

    this.i18nValues = this.i18n == undefined ? "" : this.i18n;
    this.selectedFacetItems = [];
    /* console.log("facetsIn", this.facetsIn);
    console.log("selectedFacetItems", this.selectedFacetItems); */

    if (this.facetsIn !== undefined) {
      this.facets = this.facetsIn;

      this.facets.forEach((facet: any) => {
        if (this.facetParameters.hasOwnProperty(facet.facetName)) {
          let facetItems = this.facetParameters[facet.facetName];
          if (facetItems) {
            facetItems =
              facetItems.indexOf("^") === -1
                ? [facetItems]
                : facetItems.split("^");

            if (facetItems != "" && facetItems != undefined) {
              this.selectedFacetItems[facet.facetName] = facetItems;
            }
            if (facet.facetName != undefined) {
              this.collapseFacets.push(facet.facetName);
            }
          }
        }
      });
    }

    this.locale = this.apiLanguage.split("=")[1];
    this.placeholder = this.locale == "en" ? "Search" : "";
  }

  public onCollapse(index) {
    let i = this.collapseFacets.indexOf(index, 0);
    if (i > -1) {
      this.collapseFacets.splice(i, 1);
    } else {
      this.collapseFacets.push(index);
    }
  }

  public onSeeMore(index) {
    this.limitFacets.push(index);
  }

  public onSeeLess(index) {
    let i = this.limitFacets.indexOf(index, 0);
    if (i > -1) {
      this.limitFacets.splice(i, 1);
    }
  }

  public onSelectFacetItem(facet, itemName) {
    //itemName = itemName.replace("&", "%26");
    //debugger;
    //console.log(this.selectedFacetItems);
    let facetKeys = this.facetKeys.split(",");
    if (this.selectedFacetItems.hasOwnProperty(facet)) {
      let facetItems = this.selectedFacetItems[facet];
      let index = facetItems[0].indexOf(itemName);

      if (index > -1) facetItems.splice(index, 1);
      //else facetItems.push(encodeURIComponent(itemName));

      this.selectedFacetItems[facet] = facetItems;
    } else {
      /* let updatedObj = {};
      let updatedArr = [];
      facetKeys.forEach((keys) => {
        //console.log(keys, "key", this.selectedFacetItems[keys]);
        if (this.selectedFacetItems[keys]) {
          updatedObj[keys] = this.selectedFacetItems[keys][0];
        }
      });
      updatedObj[facet] = [encodeURIComponent(itemName)];
      updatedArr.push(updatedObj); */
      //this.selectedFacetItems = [];
      this.selectedFacetItems[facet] = [encodeURIComponent(itemName)];
    }
    this.outParameters.emit(this.selectedFacetItems);
  }

  public onDeselectFacetItem(facet) {
    this.limitFacets = [];
    if (this.selectedFacetItems.hasOwnProperty(facet)) {
      delete this.selectedFacetItems[facet];
    }
    this.outParameters.emit(facet + "=");
    this.selectedFacets.emit(this.selectedFacetItems);
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
