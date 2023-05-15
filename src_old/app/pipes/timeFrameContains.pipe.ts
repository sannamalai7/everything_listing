import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'timeFrameContains', pure: false}) 
export class TimeFrameContainsPipe implements PipeTransform { 
	transform(value: any, timeFrameItems: any): any {			
		let objects = [];
		
		if(Object.keys(timeFrameItems).length == 0) {
			objects = value;
		} else {			
			for (let key in timeFrameItems) {
				objects.push({'label': key, 'value': value[key]});
			}			
		}			
		return objects;
	}  
}