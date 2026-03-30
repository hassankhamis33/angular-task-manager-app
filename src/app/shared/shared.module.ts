import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

/**
 * Shared Module
 * Contains common components, directives, and pipes used across the application
 */
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
