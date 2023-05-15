import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'languageSpoken' }) 
export class LanguageSpokenPipe implements PipeTransform {	
	transform(value: any): string {
		let type = '';
		if (value != undefined) {
			if (typeof value === 'string') {				
				type = value.replace(/,/g, ', ');
			} else {			
				let length = Object.keys(value).length;			
				if(length > 1) {									
					Object.keys(value).forEach(function(key){			
						type = type == '' ? value[key].trim() : type + ', ' + value[key].trim();
					});
				} else {												
					for (let key in value) {				
						for (let key2 in value[key]) {
							type = value[key][key2];
						}
					}
				}		
			}									
		}				
		return type;
	} 
}