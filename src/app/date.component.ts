import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { IMyDpOptions, IMyDate } from './my-date-picker/interfaces';
@Component({  
	selector: 'date', 	
	templateUrl: './date.component.html',
	providers: [],
	animations: [    	
		trigger('dateFadeInOut', [
			state('load', style({ height: "0px", display: "none" })),
			state('in', style({ height: "0px", display: "none" })),
			state('out', style({ height: "*", display: "block" })),
			transition("in => out", animate(200)),
			transition("out => in", animate(200)),
			transition("load => out", animate(200))
		])
	]
})

export class DateComponent {
	@Input() startDateParameters: string;
	@Input() endDateParameters: string;	
	@Input() i18n: any;
	@Input() apiLanguage: string;
	@Output() selectedDateRange = new EventEmitter<any>();
	@Output() outParameters = new EventEmitter<string>();
	@Input() queryParameter: string;
	specificDateRange: string = 'SpecificDateRange';
	startDateLabel: string = 'StartDate';
	endDateLabel: string = 'EndDate';
	startDate: string = '';
	endDate: string = '';	
	i18nValues: any;
	isCollapsed: boolean = true;
	collapseAnimation: string = 'load';
	dateIcon: string;	
	startdate:string='mm/dd/yyyy';
	enddate:string='mm/dd/yyyy';
	ngOnChanges() {	
		this.i18nValues = this.i18n == undefined ? '' : this.i18n; 

		if(this.queryParameter !== undefined && this.queryParameter !== undefined) {
																							
			if (this.startDateParameters.split('=')[1] === '' && this.endDateParameters.split('=')[1] === '') {
				this.startDate = '';
	    		this.endDate = '';	
				this.startdate="";
				this.enddate="";       					
			} else {
				
				this.startDate = this.replaceAll(this.startDateParameters.split('=')[1], '-', '/');									
				this.endDate = this.replaceAll(this.endDateParameters.split('=')[1], '-', '/');						
			}
		} else {
			// this.startDate = '';
    		// this.endDate = '';    		
		}		
		this.selectedDateRange.emit({ startDate: this.startDate, endDate: this.endDate }); 
		this.dateIcon = this.apiLanguage.split('=')[1] == 'ar' ? 'fa fa-caret-left' : 'fa fa-caret-right';      	
    }	
		
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
        selectorWidth: '100%',
		selectorHeight: '200px',		
    };

    endDateOptions: IMyDpOptions = {	
        todayBtnTxt: 'Today',
        dateFormat: 'mm/dd/yyyy',
        editableDateField: true,
        openSelectorOnInputClick: true,
        showClearDateBtn: false,
        disableUntil: <IMyDate>{},
        disableSince: <IMyDate>{},
        selectorWidth: '100%',
        selectorHeight: '200px'
    };

    placeholder: string = 'mm/dd/yyyy';   

    public replaceAll(str, find, replace) {
    	return str.replace(new RegExp(find, 'g'), replace);
	}

	public onDateRange() {	
						        		        	        	      	   
		let search: any={};
		
		
		search["strdate"]	= [this.replaceAll(this.startDate, '/', '-')];
		search["enddate"]	= [this.replaceAll(this.endDate, '/', '-')];
		this.outParameters.emit(search);  	        	   
    }   

    public onSelectedDate(startDate, endDate) {
    	this.startDate = startDate;
    	this.endDate = endDate;
    	this.onDateRange();
    }   

	public updateIsCollapsed(collapse: any) {		
		this.collapseAnimation = collapse == true ? 'in' : 'out';		
		this.isCollapsed = collapse;		
	}  
	
}
