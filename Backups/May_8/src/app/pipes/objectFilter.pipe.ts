import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'objectFilter' }) 
export class ObjectFilterPipe implements PipeTransform {	
	transform(value: any): string {
		let type = '';		
		if (typeof value === 'string') {			
			type = value;
		} else {			
			for (let key in value) {				
				for (let key2 in value[key]) {
					type = value[key][key2];
				}
			}
		}		
		return type;	
	} 
}