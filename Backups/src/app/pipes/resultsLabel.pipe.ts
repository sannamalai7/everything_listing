import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'resultsLabel' }) 
export class ResultsLabelPipe implements PipeTransform {	
	transform(value: any, name: string, locale: string): string {        
        let label = '';           
        if (name == 'Results') {            
            if (locale == 'en') {
                label = 'Result Briefs';
            } else if (locale == 'es') {
                label = 'Reseña de resultados';
            } else if (locale == 'fr') {
                label = 'Fiches de résultats';
            } else if (locale == 'ar') {
                label = 'ملخص النتائج';
            } else if (locale == 'ru') {
                label = 'Обзор результатов';
            } else if (locale == 'zh') {
                label = '成果简介';
            } else {
                label = value;
            }
        } else {
            label = value;
        }
		return label;
	}  
}