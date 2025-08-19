import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { Layout } from './app/layout';
import { appConfig } from './app/app.config';

bootstrapApplication(Layout, appConfig)
  .catch(err => console.error(err));
