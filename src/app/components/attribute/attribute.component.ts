import { Component, inject } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { Params } from "../../shared/interface/core.interface";
import { TableConfig, TableClickedAction } from "../../shared/interface/table.interface";
import { Attribute, AttributeModel } from "../../shared/interface/attribute.interface";
import { AttributeState } from '../../shared/state/attribute.state';
import { GetAttributes, DeleteAttribute, DeleteAllAttribute } from '../../shared/action/attribute.action';
import { TranslateModule } from '@ngx-translate/core';
import { TableComponent } from '../../shared/components/ui/table/table.component';
import { HasPermissionDirective } from '../../shared/directive/has-permission.directive';
import { PageWrapperComponent } from '../../shared/components/page-wrapper/page-wrapper.component';

@Component({
    selector: 'app-attribute',
    templateUrl: './attribute.component.html',
    styleUrls: ['./attribute.component.scss'],
    imports: [PageWrapperComponent, HasPermissionDirective, RouterModule, TableComponent, TranslateModule]
})
export class AttributeComponent {

  attribute$: Observable<AttributeModel> = inject(Store).select(AttributeState.attribute);

  public tableConfig: TableConfig = {
    columns: [
      { title: "No.", dataField: "no", type: "no" },
      { title: "name", dataField: "name", sortable: true, sort_direction: 'desc' },
      { title: "created_at", dataField: "created_at", type: "date", sortable: true, sort_direction: 'desc' }
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "attribute.edit" },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "attribute.destroy" },
    ],
    data: [] as Attribute[],
    total: 0
  };

  constructor(private store: Store,
    public router: Router) { }

  ngOnInit() {
    this.attribute$.subscribe(attribute => { 
      this.tableConfig.data = attribute ? attribute?.data : [];
      this.tableConfig.total = attribute ? attribute?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetAttributes(data));
  }

  onActionClicked(action: TableClickedAction) {
    if(action.actionToPerform == 'edit')
      this.edit(action.data)
    else if(action.actionToPerform == 'delete')
      this.delete(action.data)
    else if(action.actionToPerform == 'deleteAll')
      this.deleteAll(action.data)
  }

  edit(data: Attribute) {
    this.router.navigateByUrl(`/attribute/edit/${data.id}`);
  }

  delete(data: Attribute) {
    this.store.dispatch(new DeleteAttribute(data.id!))
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllAttribute(ids))
  }

}
