import { bootstrapApplication } from '@angular/platform-browser';
import { Layout } from './app/layout'; // ✅ Idem ici
import { appConfig } from './app/app';
import 'zone.js';

const bootstrap = () => bootstrapApplication(Layout, appConfig);
export default bootstrap;
