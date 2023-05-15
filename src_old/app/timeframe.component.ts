import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({  
	selector: 'timeframe', 	
	templateUrl: './timeframe.component.html',
	providers: [],
	animations: [    	
		trigger('timeframeFadeInOut', [
			state('load', style({ height: "0px", display: "none" })),
			state('in', style({ height: "0px", display: "none" })),
			state('out', style({ height: "*", display: "block" })),
			transition("in => out", animate(200)),
			transition("out => in", animate(200)),
			transition("load => out", animate(200))
		])
	]
})

export class TimeframeComponent {
	@Input() timeframeParameter: string;	
	@Input() i18n: any;	
	@Output() timeFramesOut = new EventEmitter<any[]>();
	@Output() timeFrameItemsOut = new EventEmitter<any[]>();
	@Output() selectedTimeframeOut = new EventEmitter<any>();
	@Output() deselectedTimeframeOut = new EventEmitter<any>();
	@Output() outParameters = new EventEmitter<string>();
	
	timeframe: string = 'TimeFrame';
	timeFrames: any[];	
	timeFrameItems: any[] = [];
	i18nValues: any;
	isCollapsed: boolean = true;	
	collapseAnimation: string = 'load';
	timeframeValues:string ="";
	constructor() { 
		this.timeFrames = [ {
			'label' : 'Today',
			'value' : 'd',
		}, {
			'label' : 'Past7Days',
			'value' : 'w',
		}, {
			'label' : 'PastMonth',
			'value' : 'm',
		}, {
			'label' : 'PastYear',
			'value' : 'y',
		}];
	}

	ngOnChanges() {				        
		this.i18nValues = this.i18n == undefined ? '' : this.i18n; 
		
		if (this.timeframeParameter === undefined) {			
			this.timeFrameItems = [];
			this.timeFrameItemsOut.emit(this.timeFrameItems);		
		} else {
			if (this.timeframeParameter.split('=')[1] === '') {				
				this.timeFrameItems = [];
				this.timeFrameItemsOut.emit(this.timeFrameItems);		
			} else {				
				for(let i=0; i < this.timeFrames.length; i++) {						
					if (this.timeframeParameter.split('=')[1] === this.timeFrames[i].value) {
						this.timeFrameItems[this.timeFrames[i].label] = this.timeFrames[i].value;
						break;
					}						
				}
			}									
		}
		this.timeFramesOut.emit(this.timeFrames);
		this.timeFrameItemsOut.emit(this.timeFrameItems); 	
	}	
	
	public onSelectTimeFrame(value) {					
		let search: any={};
		this.timeframeValues="";
		search["tf"]	= [value];	
		
		if(value!="" && value!=undefined){
		this.timeframeValues=value;
		}
					
		this.outParameters.emit(search);		
	};
	
	public onDeselectTimeFrame() {		
		let search: any={};
		this.timeframeValues="";
		search["tf"]= [""];	
		this.outParameters.emit(search);	    		
	}; 

	public updateIsCollapsed(collapse: any) {				
		this.collapseAnimation = collapse == true ? 'in' : 'out';		
		this.isCollapsed = collapse;		
	}  
}
