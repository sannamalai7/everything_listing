import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'label' }) 
export class LabelPipe implements PipeTransform {	
	transform(value: any, facets: any, facetName: any): string {
		let label = '';		
		if (facets !== undefined && facetName !== undefined) {			
			for (let key in facets) {						   
			    if (facets[key].facetName == facetName) {			    	
			    	for (let key1 in facets[key].facetItems) {
			    		if (facets[key].facetItems[key1].name == value) {
			    			label = facets[key].facetItems[key1].label;
			    		}
			    		
			    	}
			    }
			}		
		}
		return label;	
	} 
}