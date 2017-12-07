import { AlertSettings } from './alert-settings';
import { AlertType } from './alert-type';

export interface AlertEmit {
  close?: boolean;
  message?: any;
  title?: any;
  type?: AlertType;
  override?: AlertSettings;
}
