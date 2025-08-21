import { Component, inject, Inject, Input, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, of } from 'rxjs';
import { switchMap, mergeMap, takeUntil } from 'rxjs/operators';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { CreatePage, EditPage, UpdatePage } from '../../../shared/action/page.action';
import { PageState } from '../../../shared/state/page.state';
import { Attachment } from '../../../shared/interface/attachment.interface';
import { Page } from '../../../shared/interface/page.interface';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { ImageUploadComponent } from '../../../shared/components/ui/image-upload/image-upload.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormFieldsComponent } from '../../../shared/components/ui/form-fields/form-fields.component';

@Component({
    selector: 'app-form-page',
    templateUrl: './form-page.component.html',
    styleUrls: ['./form-page.component.scss'],
    imports: [ReactiveFormsModule, FormFieldsComponent, NgxEditorModule, ImageUploadComponent, ButtonComponent, CommonModule, TranslateModule]
})
export class FormPageComponent {

  @Input() type: string;

  page$: Observable<Page> = inject(Store).select(PageState.selectedPage) as Observable<Page>;

  public form: FormGroup;
  public id: number;

  public editor: Editor;
  public html = '';
  public isBrowser: boolean;

  private destroy$ = new Subject<void>();

  constructor(private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId)
    this.form = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      content: new FormControl(),
      meta_title: new FormControl(),
      meta_description: new FormControl(),
      page_meta_image_id: new FormControl(),
      status: new FormControl(1)
    });
  }

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(params => {
            if(!params['id']) return of();
            return this.store
                      .dispatch(new EditPage(params['id']))
                      .pipe(mergeMap(() => this.store.select(PageState.selectedPage)))
          }
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(page => {
        this.id = page?.id!;
        this.form.patchValue({
          title: page?.title,
          content: page?.content,
          meta_title: page?.meta_title,
          meta_description: page?.meta_description,
          status: page?.status
        });
      });

      if(this.isBrowser) {
        this.editor = new Editor();
      }
  }

  selectMetaImage(data: Attachment) {
    if(!Array.isArray(data)) {
      this.form.controls['page_meta_image_id'].setValue(data ? data.id : null);
    }
  }

  submit() {
    this.form.markAllAsTouched();
    let action = new CreatePage(this.form.value);

    if(this.type == 'edit' && this.id) {
      action = new UpdatePage(this.form.value, this.id)
    }

    if(this.form.valid) {
      this.store.dispatch(action).subscribe({
        complete: () => {
          this.router.navigateByUrl('/page');
        }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
