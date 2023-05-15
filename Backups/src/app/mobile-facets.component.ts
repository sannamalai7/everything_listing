import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { IMyDpOptions, IMyDate } from './my-date-picker/interfaces';

@Component({  
	selector: 'mobilefacets', 	
	templateUrl: './mobile-facets.component.html',
	providers: [],
	animations: [    	
		trigger('refineFadeInOut', [
			state('true', style({ height: "0px", display: "none", opacity: 0 })),
			state('false', style({ height: "*", display: "block", opacity: 1 })),
			transition("* => *", animate(300))
		]),
		trigger('flyInOut', [
			state('in', style({transform: 'translateX(0)'})),
			transition('void => *', [
			  	style({transform: 'translateX(-100%)'}),//
			  	animate(100)
			]),
			transition('* => void', [
			 	animate(100, style({transform: 'translateX(100%)'}))
			])
		])
	]
})

export class MobileFacetsComponent {
	@Input() isCollapsed: boolean;
	@Input() facetsIn: any;
	@Input() i18n: any;
	@Input() searchIn: any;	
	@Input() apiLanguage: string;	
		
	@Output() isCollapsedOut = new EventEmitter<boolean>();
	@Output() selectedTimeframe = new EventEmitter<any>();
	@Output() deselectedTimeframe = new EventEmitter<any>();
	@Output() selectedDateRange = new EventEmitter<any>();	
	@Output() selectedFacet = new EventEmitter<any>();
	@Output() deselectedFacet = new EventEmitter<any>();

	isAllFacets: boolean = false;
	isDate: boolean = true;
	isFacets: boolean = true;
	i18nValues: any;	
	timeFrames: any[];
	timeFrameItems: any[] = [];
	specificDateRange: string = 'SpecificDateRange';
	startDateLabel: string = 'StartDate';
	endDateLabel: string = 'EndDate';
	startDate: string = '';
	endDate: string = '';	
	dateIcon: string;	
	facets: any = [];
	limitFacets: any[] = [];
	selectedFacetItems: any[] = [];
	back: string;
	seeMore: string = 'SeeMore';
	seeLess: string = 'SeeLess';
	search: string;
	facetName: string;
	facetNames: any = [];
	datePlaceholder: string = 'mm/dd/yyyy';
	searchPlaceholder: string;	
	i18nBack: any;

	constructor() {
		this.i18nBack = { 'fr': 'Arrière', 'ru': 'Hазад', 'es': 'Espalda', 'zh': '背部', 'ar': 'الى الخلف' };
	}

	ngOnChanges() {				
		if (this.facetsIn != undefined) {
			this.facets = this.facetsIn;

			for (var facet of this.facets) {		    
				this.facetNames.push(facet.facetName);
			}
			this.facetNames = this.uniqueArray(this.facetNames);
		}           
		this.i18nValues = this.i18n == undefined ? '' : this.i18n;
		let locale = this.apiLanguage.split('=')[1];		
		this.searchPlaceholder = locale == 'en' ? 'Search' : '';
		this.dateIcon = locale == 'ar' ? 'fa fa-caret-left' : 'fa fa-caret-right';	
		this.back = this.i18nBack.hasOwnProperty(locale) ? this.i18nBack[locale] : 'Back';
    }
    /* Timeframe start */
    public getTimeframes(timeFrames: any[]) {		
	  	this.timeFrames = timeFrames;
	};

	public getTimeFrameItems(timeFrameItems: any[]) {			  	
	  	this.timeFrameItems = timeFrameItems;
	};
    
	public onSelectTimeFrame(value) {				
		this.collapseAll();
		this.selectedTimeframe.emit(value);			
    };
	
	public onDeselectTimeFrame() {				
		this.collapseAll();	
		this.deselectedTimeframe.emit();    		
    };
    /* Timeframe End */

    /* Date Range start */
	public onStartDateChanged(dateChanged: any) {		
		this.startDate = dateChanged.formatted;				
	}

	public onEndDateChanged(dateChanged: any) {		
		this.endDate = dateChanged.formatted;		
	}

	startDateOptions: IMyDpOptions = {	
        todayBtnTxt: 'Today',
        dateFormat: 'mm/dd/yyyy',
        editableDateField: true,
        openSelectorOnInputClick: true,
        showClearDateBtn: false,
        disableUntil: <IMyDate>{},
		disableSince: <IMyDate>{},
		selectorWidth: '191px',
        selectorHeight: '200px'
    };

    endDateOptions: IMyDpOptions = {	
        todayBtnTxt: 'Today',
        dateFormat: 'mm/dd/yyyy',
        editableDateField: true,
        openSelectorOnInputClick: true,
        showClearDateBtn: false,
        disableUntil: <IMyDate>{},
		disableSince: <IMyDate>{},
		selectorWidth: '191px',
        selectorHeight: '200px'
    };
   	 
    public replaceAll(str, find, replace) {
    	return str.replace(new RegExp(find, 'g'), replace);
	}

	public onSeletedDates(startDate, endDate) {		
		this.startDate = startDate;
		this.endDate = endDate;	
	}
	
	public onDateRange() {		
		this.collapseAll();				
		this.selectedDateRange.emit({ startDate: this.startDate, endDate: this.endDate });
    }    
    /* Date Range End */

    /* Facets Start */    
	public onSeeMore(index) {
		this.limitFacets.push(index);		
    };

	public onSeeLess (index) {
		let i = this.limitFacets.indexOf(index, 0);
		if (i > -1) {
		   this.limitFacets.splice(i, 1);
		}				
    };

    public onSelectFacetItem(facet, itemName) {
    	this.collapseAll();
    	this.selectedFacet.emit({ facet: facet, itemName: itemName });
    }

    public onDeselectFacetItem(facet) {
    	this.collapseAll();
    	this.deselectedFacet.emit(facet);
    }

	public getSelectedFacets(selectedFacets) {		
		this.selectedFacetItems = selectedFacets;				
    }
	/* Facets End */

    public onSelectDate() {
		this.isAllFacets = true;
    	this.isFacets = true;    	
    	this.isDate = false;
    }

    public onSelectFacetName(facetName) {    	
    	this.facetName = facetName;
    	this.isAllFacets = true;
    	this.isFacets = false;    	
    }

    public onBack() {	
		this.search = '';
    	this.isAllFacets = false;
    	this.isFacets = true;
    	this.isDate = true;
    }

    public collapseAll() {
    	this.isCollapsed = true;
    	this.isAllFacets = false;
    	this.isFacets = true;
    	this.isDate = true;    	
    	this.isCollapsedOut.emit(this.isCollapsed);
    }

    public uniqueArray(array) {
	  	return array.filter(function(elem, pos, arr) {
	    	return arr.indexOf(elem) == pos;
	  	});
	};	
}
