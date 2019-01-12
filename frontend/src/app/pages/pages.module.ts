import { NgModule } from '@angular/core';

// Modulos
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';

// Rutas
import { PAGES_ROUTES } from './pages.routes';

// Charts - Gráficas
import { ChartsModule } from 'ng2-charts';

// Componentes
import { PagesComponent } from './pages.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { ProgressComponent } from './progress/progress.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BusquedaComponent } from './busqueda/busqueda.component';

// Temporal
import { IncrementadorComponent } from '../components/incrementador/incrementador.component';
import { GraficoDonaComponent } from '../components/grafico-dona/grafico-dona.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { ProfileComponent } from './profile/profile.component';
import { CommonModule } from '@angular/common';
import { ModalUploadComponent } from '../components/modal-upload/modal-upload.component';

import { UsuariosComponent } from './usuarios/usuarios.component';

@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    ProgressComponent,
    Graficas1Component,
    IncrementadorComponent,
    GraficoDonaComponent,
    AccountSettingsComponent,
    PromesasComponent,
    RxjsComponent,
    ProfileComponent,
    BusquedaComponent,
    UsuariosComponent,
    ModalUploadComponent
  ],
  exports: [
    PagesComponent,
    DashboardComponent,
    ProgressComponent,
    Graficas1Component
  ],
  imports: [
    CommonModule,
    PAGES_ROUTES,
    SharedModule,
    FormsModule,
    ChartsModule,
    PipesModule
  ],
  providers: []
})
export class PagesModule { }
