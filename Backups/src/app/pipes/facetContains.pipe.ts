import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'facetContains', pure: false }) 
export class FacetContainsPipe implements PipeTransform { 
	transform(value: any, limitFacets: any, index: number,term:any,facetItems:any,facetName:any): any {		
		let objects = [];		
		let i = 0;
		
		//value = Object.values(value).sort((a:any, b:any) => a.name.localeCompare(b.name)); 
		value = Object.keys(value).map(itm => value[itm]).sort((a:any, b:any) => a.name.localeCompare(b.name)); 
		if(term !== undefined) {	
		
			let filteredValue = (value || []).filter((item) => item.hasOwnProperty('name')
			 && new RegExp(term, 'gi').test(item['name']));
			 
			 Object.keys(filteredValue).forEach( key => {								
				if (limitFacets.indexOf(index) > -1) {						
					objects.push(filteredValue[key]);
				} else {						
					if (i < 6) {
						objects.push(filteredValue[key]);	
					}			
					i++;
				}
			});
			// if(facetItems.hasOwnProperty(facetName)) {	
			// 	if (facetItems[facetName].trim() == '') {
			// 		Object.keys(filteredValue).forEach( key => {
			// 			if (limitFacets.indexOf(index) > -1) {						
			// 				objects.push(filteredValue[key]);
			// 			} else {						
			// 				if (i < 6) {
			// 					objects.push(filteredValue[key]);	
			// 				}			
			// 				i++;
			// 			}								
			// 		});
			// 	} else {
			// 		Object.keys(filteredValue).forEach( key => {					
			// 			if(facetItems[facetName].trim() == filteredValue[key].name.trim()) {								
			// 				objects.push(filteredValue[key]);
			// 			} 								
			// 		});
			// 	}				
			// } else {			
			// 	Object.keys(filteredValue).forEach( key => {								
			// 		if (limitFacets.indexOf(index) > -1) {						
			// 			objects.push(filteredValue[key]);
			// 		} else {						
			// 			if (i < 6) {
			// 				objects.push(filteredValue[key]);	
			// 			}			
			// 			i++;
			// 		}
			// 	});
			// }								
		} else {		
			// if(facetItems.hasOwnProperty(facetName)) {				
			// 	if (facetItems[facetName].trim() == '') {
			// 		Object.keys(value).forEach( key => {
			// 			if (limitFacets.indexOf(index) > -1) {						
			// 				objects.push(value[key]);
			// 			} else {						
			// 				if (i < 6) {
			// 					objects.push(value[key]);	
			// 				}			
			// 				i++;
			// 			}								
			// 		});
			// 	} else {
			// 		Object.keys(value).forEach( key => {					
			// 			if(facetItems[facetName].trim() == value[key].name.trim()) {								
			// 				objects.push(value[key]);
			// 			} 								
			// 		});
			// 	}								
			// } else {			
				Object.keys(value).forEach( key => {
					
					if (limitFacets.indexOf(index) > -1) {						
						objects.push(value[key]);
					} else {						
						if (i < 6) {
							objects.push(value[key]);	
						}			
						i++;
					}								
				});
			//}
		}		
		return objects;
	} 
}