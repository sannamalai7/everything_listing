import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'eventsDate' })
export class EventsDatePipe implements PipeTransform {    
    transform(value: string, eventEndDate: string, localeAndDateFormat: any) {        
    	let date = '';
        if (value !== undefined && eventEndDate !== undefined && localeAndDateFormat !== undefined) { 

            let startDate = moment.utc(value).locale(localeAndDateFormat.locale);      
            let endDate = moment.utc(eventEndDate).locale(localeAndDateFormat.locale);

            
            
            if (startDate.get('year') == endDate.get('year')) {
                if (startDate.get('month') == endDate.get('month')) {
                    if (startDate.get('date') == endDate.get('date')) {
                        date = startDate.format(localeAndDateFormat.format);
                        
                        
                    } else {
                        date = startDate.format('MMMM DD') + '-' + endDate.format('DD') + ', ' + startDate.get('year');   
                    }               
                } else {
                    date = startDate.format('MMMM DD') + '-' + endDate.format('MMMM DD') + ', ' + startDate.get('year');
                }           
            } else {            
                date = startDate.format(localeAndDateFormat.format) + '-' + endDate.format(localeAndDateFormat.format);
            }
            if (localeAndDateFormat.locale == 'es') {
                date = date.charAt(0).toUpperCase() + date.slice(1);
             }
			
			if (localeAndDateFormat.locale == 'ja' || localeAndDateFormat.locale == 'zh') {
                if (startDate.get('year') == endDate.get('year')) {
               if (startDate.get('month') == endDate.get('month')) {
                   if (startDate.get('date') == endDate.get('date')) {
                       date = startDate.format(localeAndDateFormat.format);
                   } else {
                       date = startDate.get('year')+"年"+startDate.format('M')+'月'+startDate.format('D') + '-' + endDate.format('D') + '日';   
                      
                   }               
               } else {
                   date = startDate.get('year')+"年"+startDate.format('M')+'月'+startDate.format('D') + '日'+ '-' +endDate.format('M')+'月'+endDate.format('D') + '日';
                  
               }           
           } else {            
            date = startDate.get('year')+"年"+startDate.format('M')+'月'+startDate.format('D') + '日'+ '-'+endDate.get('year')+"年" +endDate.format('M')+'月'+endDate.format('D') + '日';
           }
           }
           if (localeAndDateFormat.locale == 'fr') {
            if (startDate.get('year') == endDate.get('year')) {
                if (startDate.get('month') == endDate.get('month')) {
                    if (startDate.get('date') == endDate.get('date')) {
                        date = startDate.format(localeAndDateFormat.format);
                        
                    } else {
                        date = startDate.format('DD') + ' - ' + endDate.format('DD') + ' '+startDate.format('MMMM') +' ' + startDate.get('year');   
                    }               
                } else {
                    date = startDate.format('DD') + ' '+startDate.format('MMMM') + ' - ' + endDate.format('DD') +' ' +endDate.format('MMMM')+' ' +startDate.get('year');   
                  
                }           
            } else {            
                date = startDate.format('DD') + ' '+startDate.format('MMMM') +' ' +startDate.get('year')+ ' - ' + endDate.format('DD') +' ' +endDate.format('MMMM')+' ' +endDate.get('year');  
            }
       }
       if (localeAndDateFormat.locale == 'ru') {
        if (startDate.get('year') == endDate.get('year')) {
            if (startDate.get('month') == endDate.get('month')) {
                if (startDate.get('date') == endDate.get('date')) {
                    date = startDate.format(localeAndDateFormat.format);
                    
                } else {
                    date = startDate.format('D') + '-' + endDate.format('D') + ' '+startDate.format('MMMM') +' ' + startDate.get('year');   
                }               
            } else {
                date = startDate.format('D') + ' '+startDate.format('MMMM') + '-' + endDate.format('D') +' ' +endDate.format('MMMM')+' ' +startDate.get('year');   
              
            }           
        } else {            
            date = startDate.format('D') + ' '+startDate.format('MMMM') +' ' +startDate.get('year')+ '-' + endDate.format('D') +' ' +endDate.format('MMMM')+' ' +endDate.get('year');  
        }
   }
   if (localeAndDateFormat.locale == 'ar') {
     startDate = moment.utc(value).locale('ar-tn');      
     endDate = moment.utc(eventEndDate).locale('ar-tn');

    if (startDate.get('year') == endDate.get('year')) {
        if (startDate.get('month') == endDate.get('month')) {
            if (startDate.get('date') == endDate.get('date')) {
             
                date =startDate.get('year') +"/"+(startDate.get('month') + 1) +"/"+  ('0' + startDate.get('date')).slice(-2);
                
            } else {
                date = ('0' + endDate.get('date')).slice(-2) + ' - ' + ('0' + startDate.get('date')).slice(-2) + ' '+startDate.format('MMMM') +' ' + startDate.get('year');   
            }               
        } else {
            date = ('0' + startDate.get('date')).slice(-2) + ' '+startDate.format('MMMM') +' إلى '+ ('0' + endDate.get('date')).slice(-2) +' ' +endDate.format('MMMM')+' ' +startDate.get('year');   
          
        }           
    } else {            
        date = ('0' + startDate.get('date')).slice(-2) + ' '+startDate.format('MMMM') +' ' +startDate.get('year')+' إلى '+ ('0' + endDate.get('date')).slice(-2) +' ' +endDate.format('MMMM')+' ' +endDate.get('year');  
    } 
}
if (localeAndDateFormat.locale == 'pt') {
    if (startDate.get('year') == endDate.get('year')) {
        if (startDate.get('month') == endDate.get('month')) {
            if (startDate.get('date') == endDate.get('date')) {
                date = startDate.format('DD') + ' de '+startDate.format('MMMM') +' de ' + startDate.get('year');   
                
            } else {
                date = startDate.format('DD') + ' - ' + endDate.format('DD') + ' de '+startDate.format('MMMM') +' de ' + startDate.get('year');   
            }               
        } else {
            date = startDate.format('DD') + ' de '+startDate.format('MMMM') + ' - ' + endDate.format('DD') +' de ' +endDate.format('MMMM')+' de ' +startDate.get('year');   
          
        }           
    } else {            
        date = startDate.format('DD') + ' de '+startDate.format('MMMM') +' de ' +startDate.get('year')+ ' - ' + endDate.format('DD') +' de ' +endDate.format('MMMM')+' de ' +endDate.get('year');  
    }
}
if (localeAndDateFormat.locale == 'vi') {
    let startMonth = startDate.format('MMMM');
    let endMonth = endDate.format('MMMM');
    startMonth = startMonth.charAt(0).toUpperCase() + startMonth.slice(1);
    endMonth = endMonth.charAt(0).toUpperCase() + endMonth.slice(1);
    if (startDate.get('year') == endDate.get('year')) {
   if (startDate.get('month') == endDate.get('month')) {
       if (startDate.get('date') == endDate.get('date')) {
           date =  startDate.format('D ') + startMonth+' Năm ' + startDate.get('year');   
       } else {
        date =  'Ngày '+ startDate.format('D') +'-' + endDate.format('D ')+startMonth +' Năm ' + startDate.get('year');   
              
       }               
   } else {
    date =  'Ngày '+ startDate.format('D ') +startMonth + ' - ' +'Ngày '+ endDate.format('D ') +endMonth+' Năm ' +startDate.get('year');   
      
   }           
} else {            
    date =  'Ngày '+ startDate.format('D ') +startMonth +' Năm ' +startDate.get('year')+ ' - ' +'Ngày '+ endDate.format('D ')  +endMonth+' Năm ' +endDate.get('year');   
}
}
if (localeAndDateFormat.locale == 'sq' || localeAndDateFormat.locale == 'ro' || localeAndDateFormat.locale == 'bg' || localeAndDateFormat.locale == 'pl' || localeAndDateFormat.locale == 'tr'  || localeAndDateFormat.locale == 'th' || localeAndDateFormat.locale == 'id' || localeAndDateFormat.locale == 'mk') {
   
    let startYear = startDate.get('year');
    let endYear = endDate.get('year');
    if(localeAndDateFormat.locale == 'th')
    {
    startYear = startYear + 543;
    endYear = endYear + 543;
    }
    let startMonth = startDate.format('MMMM');
    let endMonth = endDate.format('MMMM');
    if(localeAndDateFormat.locale != 'tr')
    {
        startMonth = startDate.format('MMMM').toLowerCase();
        endMonth = endDate.format('MMMM').toLowerCase();
    }
     if (startDate.get('year') == endDate.get('year')) {
    if (startDate.get('month') == endDate.get('month')) {
        if (startDate.get('date') == endDate.get('date')) {
            if(localeAndDateFormat.locale != 'tr')
            date = startDate.format(localeAndDateFormat.format).toLowerCase();
            if(localeAndDateFormat.locale == 'th')
            date = 'วันที่ ' + startDate.format('DD')+  startMonth + ' ' + startYear;   
        } else {
            date = startDate.format('DD') + '-' +endDate.format('DD')+ ' '+startMonth+ ' ' + startYear;   
        }               
    } else {
        date = startDate.format('DD')+ ' ' + startMonth + '-' + endDate.format('DD')+ ' '+ endMonth+ ' ' + startYear;
    }           
} else { 
    date = startDate.format('DD')+ ' '+ startMonth+ ' ' + startYear + '-' + endDate.format('DD')+ ' '+ endMonth+ ' ' + startYear;           
    
    if(localeAndDateFormat.locale == 'th')
    date = startDate.format('DD MMMM').toLowerCase()+ ' ' + startYear+'-' + endDate.format('DD MMMM').toLowerCase() + ' ' + endYear;
}
}
         
        }    					           
        return date;
    }
}