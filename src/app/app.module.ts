import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyDatePickerModule } from './my-date-picker/my-date-picker.module';

import { AppComponent, TimeframeComponent, FacetsComponent, MobileFacetsComponent, SearchComponent, DateComponent, NewsComponent, ResultsComponent, MultimediaComponent, EventsComponent, ExpertsComponent } from "./index";
import { KeysPipe, DateFormatPipe, ObjectsLengthPipe, ContainsPipe, ObjectContainsPipe, FacetContainsPipe, FacetAnimationPipe, TimeFrameContainsPipe, LocalePipe, ObjectFilterPipe, 
	LimitPipe, ShowingPipe, LabelPipe, EventsDatePipe, MobileFacetContainsPipe,
	 MediaIconPipe, LanguageSpokenPipe, ResultsPipe, ResultsLabelPipe,FacetCheckedPipe } from "./pipes/index";

@NgModule({
	declarations: [
		AppComponent,		
		TimeframeComponent,
		FacetsComponent,
		MobileFacetsComponent,		
		SearchComponent,
		DateComponent,
		NewsComponent,
		ResultsComponent,
		MultimediaComponent,
		EventsComponent,
		ExpertsComponent,
		KeysPipe, 
		DateFormatPipe, 
		ObjectsLengthPipe, 
		ContainsPipe, 
		ObjectContainsPipe, 
		FacetContainsPipe,
		FacetAnimationPipe,
		TimeFrameContainsPipe,
		LocalePipe,		
		ObjectFilterPipe,
		LimitPipe,
		ShowingPipe,
		LabelPipe,
		EventsDatePipe,
		MobileFacetContainsPipe,
		MediaIconPipe,
		LanguageSpokenPipe,
		ResultsPipe,
		ResultsLabelPipe,
		FacetCheckedPipe
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		HttpModule,
		MyDatePickerModule
	],
	providers: [ ],
	bootstrap: [AppComponent]	
})

export class AppModule { }