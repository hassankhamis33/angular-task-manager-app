import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

/**
 * Core module - provides singleton services for the entire application
 * Services defined here should be singletons and application-wide
 */
@NgModule({
  imports: [HttpClientModule],
  providers: []
})
export class CoreModule { }
