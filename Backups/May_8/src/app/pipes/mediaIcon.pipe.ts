import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'mediaIcon' }) 
export class MediaIconPipe implements PipeTransform {	
	transform(value: any): string {
		let fontClass = '';
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

		if (type == 'Video' || type == 'Vidéo' || type == 'فيديو' || type == 'Инфографика' || type == '视频') 
			fontClass = 'fa fa-play';
		else if (type == 'Audio')  
			fontClass = 'fa fa-cloud';
		else if (type == 'Slideshow' || type == 'Diaporama' || type == 'عرض الشرائح' || type == '幻灯片')
			fontClass = 'fa fa-camera';
		else
			fontClass = 'hide';
		
		return fontClass;	
	} 
}