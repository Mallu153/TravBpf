import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';

export interface TimePickerModel {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-cron-time-picker',
  templateUrl: './cron-time-picker.component.html',
  styleUrls: ['./cron-time-picker.component.scss'],
})
export class CronTimePickerComponent implements OnInit {
  @Input() public disabled;
  @Input() public use24HourTime = true;
  @Input() public hideHours = false;
  @Input() public hideMinutes = false;
  @Input() public hideSeconds = true;

  public minutes = Array.from(Array(60).keys());
  public seconds = Array.from(Array(60).keys());
  public hourTypes = ['AM', 'PM'];
  constructor(public parent: ControlContainer) {}
  ngOnInit(): void {}
  get hours(): number[] {
    return this.use24HourTime ? Array.from(Array(24).keys()) : Array.from(Array(13).keys());
  }
}
