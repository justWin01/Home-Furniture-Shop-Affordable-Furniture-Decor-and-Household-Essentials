import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideHttpClient } from '@angular/common/http'; // modern replacement

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient() // ✅ enables HttpClient for services
  ]
})
.catch((err) => console.error(err));
