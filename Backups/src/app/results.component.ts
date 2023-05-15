import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Component({  
	selector: 'results', 	
	templateUrl: './results.component.html',
	providers: [ ]
})

export class ResultsComponent {
	@Input() url: string;
	@Input() localeUrlParameter: string;
	@Input() allFacets: string;		
	@Input() keys: string;				
	@Input() localeAndDateFormat: any;	
	@Input() excludedLanguages: string[];	

	@Output() finalResponse = new EventEmitter<any>();	
	@Output() outParameters = new EventEmitter<string>();
	
	apiResponse: any;
	documents: any[];
	facetsResponse: any;	
	noData: string;
	sortBy: string = 'SortBy';	
	date: string = 'Date';
	bestMatch: string = 'BestMatch';
	type: string = 'displayconttype_exact';
	language: string = 'lang_exact';			
    i18n: any;    
	srt: string;
	isSearch: boolean = false;	

	constructor(private http: Http) { }	

	ngOnChanges() {		        
        this.getData(this.url);                           
    }	
	
	getData = function(url: string) {
		let i18nUrl = this.localeUrlParameter + this.keys + ',' + this.allFacets;				  		
		let numberOfRows = Number(this.getParameterByName('rows', url));
		let languageExact = this.getParameterByName('lang_exact', url);
		let qterm = this.getParameterByName('qterm', this.url);
		
        url = url.slice(-1) == '&' ? url.slice(0, -1) : url;

        if (qterm == null || qterm == '') {
        	let srtParam = this.getParameterByName('srt', url);
        	this.srt = srtParam == null ? 'date' : srtParam;			
			this.isSearch = false;
		} else {			
			url = url.indexOf('srt=') === -1 ? url + '&srt=score' : url;			
			this.srt = this.getParameterByName('srt', url);
			this.isSearch = true;			
		}
		
		const combined = Observable.forkJoin(
			this.http.post(url, '').map((response: Response) => {
				//console.log('api ' + new Date);
				return response.json();
			}),
			this.http.post(i18nUrl, '').map((response: Response) =>{
				//console.log('i18n ' + new Date);
				return response.json();
			})
		)			
		
		combined.subscribe(combinedValues => {			
			const [ apiResponse , i18nResponse ] = combinedValues;			
			this.apiResponse = apiResponse;
			this.i18n = i18nResponse;			
			this.facetsResponse = this.apiResponse.documents.facets;
			let total = this.apiResponse.total;			
			let showingTo, isLoadMore, facets = [];				
			
			if (Object.keys(this.facetsResponse).length == 0) {	
				showingTo = 0;
				isLoadMore = false;
				this.http.post(this.localeUrlParameter + '&keys=NoResultsMsg', '')
					.map((res: Response) => res.text()).subscribe((response)=> {
					this.noData = response.trim().split(':')[1].slice(1).slice(0, -8) + '</a>';																						    						        
				});								
			} else {				
				for (let facetName in this.facetsResponse) {				
					let facetItems = [];														
					for (let facetItemKey in this.facetsResponse[facetName]) {							
						facetItems.push(this.facetsResponse[facetName][facetItemKey]);
					}												
					facets.push({facetName: facetName, facetItems: facetItems});
				}				
				
				delete this.apiResponse.documents.facets;
				let documents = [];
				Object.keys(this.apiResponse.documents).forEach( key => {			
					documents.push(this.apiResponse.documents[key]);				 				
				});			
				this.documents = documents;								          																
				showingTo = numberOfRows >= total ? total : numberOfRows;													
				isLoadMore = numberOfRows >= total ? false : true;	 																			
			}
			this.finalResponse.emit({ i18n: this.i18n, facets: facets, total: total, showingTo: showingTo, isLoadMore: isLoadMore});			
		});		
	}	

	public getSortBy(event) {    	     	
    	this.outParameters.emit(event);
    }

    public getParameterByName(name, url) {	    
	    name = name.replace(/[\[\]]/g, '\\$&');
	    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}	
}
