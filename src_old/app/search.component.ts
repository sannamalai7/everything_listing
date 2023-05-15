import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "search",
  templateUrl: "./search.component.html",
  providers: [],
})
export class SearchComponent {
  @Input() queryParameter: string;
  @Input() searchIn: string;
  @Input() searchBoxText: string;
  @Input() apiLanguage: string;
  @Output() outParameters = new EventEmitter<string>();

  searchValue: string = "";

  ngOnChanges() {
    if (this.queryParameter !== undefined) {
      if (this.queryParameter.split("=")[1] == "") {
        this.searchBoxText = this.queryParameter.split("=")[1];
      }
    }
  }

  public onSearch() {
    // this.searchBoxText = this.searchValue == '' ? this.searchBoxText : this.searchValue;
    // this.outParameters.emit('qterm=' + this.searchValue);
    // this.searchValue = '';
    let search: any = {};
    search["qterm"] = [this.searchValue];
    this.outParameters.emit(search);
  }
}
