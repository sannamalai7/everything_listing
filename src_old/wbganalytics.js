
var query_string = "";

  function analyticParams(localurl, sterm, sresults, sortby)
  {
        query_string = localurl;
        var queryParamValue = "";
        var queryParamName = "";
        var filters = [], section=[], sFilters="",sSection="";
        var paramMap = {
            'displayconttype_exact': 'type',
            'topic_exact': 'topic',
            'admreg_exact':'region',
            'count_exact':'country',
            'strdate':'startdate',
            'enddate':'enddate',
            'lang_exact':'language',
            'tf':'timeframe',
            'docty_exact':'document type', 
            'lang_spoken_exact':'languages spoken',
            'job_title_exact':'role',
            'unit_exact':'unit',
            'first_name_AlphaBucket_exact':'first name',
            'surname_AlphaBucket_exact':'last name',
            'sector_exact':'sector',
            'status_exact':'status',
            'majdocty_exact':'major document type',
            'majtheme_exact':'theme',
            'teratopic_exact':'topic'
            
        };

        if(query_string){
            var queryPair = query_string.slice(1).split('&');
            for (var i = 0; i < queryPair.length; i++) {
                queryParamValue = queryPair[i].split('=')[1];
                
                queryParamName = queryPair[i].split('=')[0];
                
                if((typeof paramMap[queryParamName]!='undefined')  && (queryParamName!='lang_exact') && (queryParamName!='pastevents') && (queryParamName!='futureevents') && (queryParamName!='srt') && (queryParamName!='qterm') && (queryParamName!='x')&&(queryParamName!='y')){
                    
                    
                    section.push(paramMap[queryParamName]);
                    
                    
                }
                
                
                if((queryParamName!='qterm') && (queryParamName!='futureevents') && (queryParamName!='pastevents') && (queryParamName!='srt') && (queryParamName!='os') && (queryParamName!='x') && (queryParamName!='lang_exact') &&(queryParamName!='y')){
                    if(queryParamValue != ''){
                        filters.push(queryParamValue);
                    }
                }
            }
            sFilters = filters.join(':');
            sSection = section.join(':');
            
            sSection = decodeURIComponent(sSection);
            
            sSection = sSection.replace(new RegExp("\\+","g"),' ');
            
            //s.eVar50= section;
            
            sFilters = decodeURIComponent(sFilters);
            
            sFilters = sFilters.replace(new RegExp("\\+","g"),' ');
            //s.list1 =filters;
            wbgData.siteSearch.searchFilters = sFilters;
            wbgData.siteSearch.section = sSection;
            wbgData.siteSearch.searchTerm = sterm;
            wbgData.siteSearch.searchResults = sresults;
            wbgData.siteSearch.sortBy = sortby;
        }

        _satellite.track('sitesearch');     
  }