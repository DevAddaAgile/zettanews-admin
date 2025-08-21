import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Select2Data, Select2Module } from 'ng-select2-component';
import { Store } from '@ngxs/store';
import { Subject, of } from 'rxjs';
import { switchMap, mergeMap, takeUntil } from 'rxjs/operators';
import { CreateAttribute, EditAttribute, UpdateAttribute } from '../../../shared/action/attribute.action';
import { AttributeState } from '../../../shared/state/attribute.state';
import { AttributeValue } from '../../../shared/interface/attribute.interface';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';

import { FormFieldsComponent } from '../../../shared/components/ui/form-fields/form-fields.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-form-attribute',
    templateUrl: './form-attribute.component.html',
    styleUrls: ['./form-attribute.component.scss'],
    imports: [ReactiveFormsModule, FormFieldsComponent, Select2Module, ButtonComponent, TranslateModule]
})
export class FormAttributeComponent {

  @Input() type: string;

  public form: FormGroup;
  public documents = [{ value: "", hex_color:"", id: "" }];
  public id: number;
  public isBrowser: boolean;

  private destroy$ = new Subject<void>();
  
  public variantStyle: Select2Data = [{
    value: 'rectangle',
    label: 'Rectangle',
  },{
    value: 'circle',
    label: 'Circle',
  },{
    value: 'radio',
    label: 'Radio',
  },{
    value: 'dropdown',
    label: 'Dropdown',
  },{
    value: 'image',
    label: 'Image',
  },{
    value: 'color',
    label: 'Color',
  }];

  constructor(private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) platformId: object) {
      this.isBrowser = isPlatformBrowser(platformId);
    this.form = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      style: new FormControl('rectangle', [Validators.required]),
      status: new FormControl(1),
      value: this.formBuilder.array([], [Validators.required])
    });
  }

  get valueControl(): FormArray {
    return this.form.get("value") as FormArray;
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(params => {
            if(!params['id']) return of();
            return this.store
                      .dispatch(new EditAttribute(params['id']))
                      .pipe(mergeMap(() => this.store.select(AttributeState.selectedAttribute)));
          }
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(attribute => {
        this.id = attribute?.id!;
        // Set Value in form
        this.form.patchValue({
          name: attribute?.name,
          style: attribute?.style,
          status: attribute?.status
        });
        // Set Attribute Values
        attribute?.attribute_values!.forEach(document => 
          this.valueControl.push(
            this.formBuilder.group({
              value: new FormControl(document.value, [Validators.required]),
              hex_color: new FormControl(document.hex_color),
              id: new FormControl(document.id, [])
            })
          ));

      });

      if(this.type == 'create') {
        this.documents.forEach(document =>
          this.valueControl.push(
            this.formBuilder.group({
              value: [document.value, [Validators.required]],
              hex_color: [document.hex_color],
              id: [document.id]
            })
          )
        );
      }
      
  }

  add(event: Event) {
    event.preventDefault();
    const valueGroup = this.form.get('style')!.value === 'color' ?  this.formBuilder.group({
      value: ['', [Validators.required]],
      hex_color: ['']
    }): this.formBuilder.group({
      value: ['', [Validators.required]],
    });
    this.valueControl.push(valueGroup);
  }

  remove(index: number) {
    if(this.valueControl.length <= 1) return;
      this.valueControl.removeAt(+index);
  }

  submit() {
    this.form.markAllAsTouched();
    let action = new CreateAttribute(this.form.value);
    
    if(this.type == 'edit' && this.id) {
      action = new UpdateAttribute(this.form.value, this.id)
    }
    
    if(this.form.valid) {
      this.store.dispatch(action).subscribe({
        complete: () => { this.router.navigateByUrl('/attribute'); }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
