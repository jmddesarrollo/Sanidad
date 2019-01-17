import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService, SidebarService, SharedService, UsuarioService, RenovartokenGuard } from './service.index';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

// Guards
import { LoginGuardGuard } from './guards/login-guard.guard';
import { AdminGuard } from './guards/admin.guard';

import { UploadService } from './upload/upload.service';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HttpModule
  ],
  providers: [SettingsService, SidebarService, SharedService, UsuarioService, UploadService,
    LoginGuardGuard, AdminGuard, ModalUploadService, RenovartokenGuard],
  declarations: []
})
export class ServiceModule { }
