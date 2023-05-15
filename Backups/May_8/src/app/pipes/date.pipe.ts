import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'dateFormat' })
export class DateFormatPipe implements PipeTransform {
    transform(value: string, localeAndDateFormat: any) {        
        if (value !== undefined && localeAndDateFormat !== undefined) {
            if(!localeAndDateFormat.locale) {
                localeAndDateFormat.locale = 'en';
            }
            let m = moment.utc(value).locale(localeAndDateFormat.locale);             
            let formatedDate = '';
                
            if (localeAndDateFormat.locale == 'sq') {
                formatedDate = m.format(localeAndDateFormat.format).toLowerCase();
           }else if (localeAndDateFormat.locale == 'es') {
                formatedDate = m.format(localeAndDateFormat.format);
                formatedDate = formatedDate.charAt(0).toUpperCase() + formatedDate.slice(1);
            } else if (localeAndDateFormat.locale == 'th') {
                formatedDate = 'วันที่ ' + m.get('date') + ' ' + m.format('MMMM') + ' ' + (m.get('year')+543);
            } else if (localeAndDateFormat.locale == 'pt') {
                formatedDate = m.get('date') + ' de ' + m.format('MMMM') + ' de ' + m.get('year');
            } else if (localeAndDateFormat.locale == 'vi') {
                formatedDate = m.get('date') + ' Tháng ' + (m.get('month') + 1) + ' Năm ' + m.get('year');
            } else if (localeAndDateFormat.locale == 'ar' || localeAndDateFormat.locale == 'fa' || localeAndDateFormat.locale == 'ps') {
                formatedDate = m.get('year') +"/"+(m.get('month') + 1) +"/"+  ('0' + m.get('date')).slice(-2);
            }else if (localeAndDateFormat.locale == 'hi') {
                formatedDate = m.get('date') + ' ' + m.format('MMMM') + ', ' + m.get('year');
            }else if (localeAndDateFormat.locale == 'mk') {
                let month = m.format('MMMM');
                month = month.charAt(0).toUpperCase() + month.slice(1);
                formatedDate = m.get('date') + ' ' + month + ' ' + m.get('year');
            }else {
                formatedDate = m.format(localeAndDateFormat.format);
            }                            
            return formatedDate;        
    	  }	
    }
}