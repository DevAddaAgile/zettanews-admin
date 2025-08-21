import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subject, of } from 'rxjs';
import { switchMap, mergeMap, takeUntil } from 'rxjs/operators';
import { Tag } from "../../../shared/interface/tag.interface";
import { TagState } from '../../../shared/state/tag.state';
import { CreateTag, EditTag, UpdateTag } from '../../../shared/action/tag.action';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';

import { FormFieldsComponent } from '../../../shared/components/ui/form-fields/form-fields.component';

@Component({
    selector: 'app-form-tag',
    templateUrl: './form-tag.component.html',
    styleUrls: ['./form-tag.component.scss'],
    imports: [ReactiveFormsModule, FormFieldsComponent, ButtonComponent, TranslateModule]
})
export class FormTagComponent {

  @Input() type: string;
  @Input() tagType: string | null = 'product';

  public form: FormGroup;
  public tag: Tag | null;

  private destroy$ = new Subject<void>();

  constructor(private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) { 
      this.form = this.formBuilder.group({
        name: new FormControl('', [Validators.required]),
        slug: new FormControl('', [Validators.required]),
        description: new FormControl(),
        type: new FormControl(this.tagType, []),
        status: new FormControl(true)
      });
      
      // Auto-generate slug from name
      this.form.get('name')?.valueChanges.subscribe(name => {
        if (name) {
          const slug = this.generateSlug(name);
          this.form.get('slug')?.setValue(slug);
        }
      });
  }

  ngOnChanges() {
    this.form.controls['type'].setValue(this.tagType);
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(params => {
            if(!params['id']) return of();
            return this.store
                      .dispatch(new EditTag(params['id']))
                      .pipe(mergeMap(() => this.store.select(TagState.selectedTag)))
          }
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(tag => {
        this.tag = tag;
        this.form.patchValue({
          name: this.tag?.name,
          slug: this.tag?.slug,
          description: this.tag?.description,
          status: this.tag?.status
        });
      });
  }

  generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  submit() {
    this.form.markAllAsTouched();
    let action = new CreateTag(this.form.value);
    
    if(this.type == 'edit' && this.tag?.id) {
      action = new UpdateTag(this.form.value, this.tag.id)
    }
    
    if(this.form.valid) {
      this.store.dispatch(action).subscribe({
        complete: () => { 
          if(this.tagType == 'post')
            this.router.navigateByUrl('/blog/tag'); 
          else
            this.router.navigateByUrl('/tag'); 
        }
      });
    }
  }

}
