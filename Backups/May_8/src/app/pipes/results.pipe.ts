import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'results' }) 
export class ResultsPipe implements PipeTransform {	
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

        if (type == 'Results') {
            type = 'Result Brief';
        } else if (type == 'Resultados') {
            type = 'Reseña de resultados';
        } else if (type == 'Résultats') {
            type = 'Fiches de résultats';
        } else if (type == 'النتائج') {
            type = 'ملخص النتائج';
        } else if (type == 'Результаты') {
            type = 'Обзор результатов';
        } else if (type == '成果') {
            type = '成果简介';
        }
        
		return type;	
	}  
}