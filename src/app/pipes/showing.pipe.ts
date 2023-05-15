import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'showing' }) 
export class ShowingPipe implements PipeTransform {	
	transform(value: any, i18n: any, showingFrom: any, showingTo: any, total: any): string {
		let key = '';
		if (i18n !== undefined && i18n!=null && showingFrom !== undefined && showingTo !== undefined && total !== undefined) {						
			if (i18n.hasOwnProperty(value)) {				
				key = i18n[value];				
				key = key.replace ("{0}", showingFrom.toString() + ' - ' + showingTo.toString());
    			key = key.replace ("{1}", total.toString());
			}
		}		
		return key;	
	} 
}