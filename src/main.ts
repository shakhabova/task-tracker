import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      MatToolbarModule,
      MatCardModule,
      MatIconModule
    ),
  ],
}).catch((err) => console.error(err));
