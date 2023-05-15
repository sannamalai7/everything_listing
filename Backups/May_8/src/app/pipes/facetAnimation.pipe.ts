import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'facetAnimation', pure: false }) 
export class FacetAnimationPipe implements PipeTransform { 
	transform(value: any, index: any): string {						
        let animation = 'load';
		if(value.length == 0) {
			return animation;
		} else {			
            if (value.indexOf(index) > -1) {
                animation = 'out';
            } else {
                animation = 'in';
            }
			return animation;
		}		
	} 
}