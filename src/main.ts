import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/core/configs/app.config';
import { App } from './app/core/components/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
