import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import * as ResourcesAssignmentModel  from '../../models/assignment-models';
@Component({
  selector: 'app-selected-routes',
  templateUrl: './selected-routes.component.html',
  styleUrls: ['./selected-routes.component.scss']
})
export class SelectedRoutesComponent implements OnInit , OnChanges {

  @Input('selectedRoute') routes: ResourcesAssignmentModel.RouteList[];
  @Input('isEdit') isEdit: boolean;
  selectedList: any = [];
  searchTerm: string;
  page = 1;
  pageSize = 10;
  collectionSize: number;
  currentRate = 8;
  allSelectedList: any[];
  searchText: any;
  //isEdit = false;
  constructor(private cd: ChangeDetectorRef) {

  }

  ngOnInit(): void {
  }
  ngOnChanges() {
    if (this.routes) {
      this.selectedList = this.routes;
      this.collectionSize = this.routes.length;
      this.selectedList = this.routes;
      this.allSelectedList = this.selectedList;
      this.cd.detectChanges();
    }

  }
  removeSelectedRutes(i: number) {
    if (this.selectedList.length > 0) {
      this.selectedList.splice(i, 1);
    }
  }
  delete(i: number, routeName: string) {
    if (confirm(`Are sure you want to remove ${routeName} route`) == true) {
      this.removeSelectedRutes(i);
    }


  }

}
