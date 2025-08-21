import { Component, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { MediaModalComponent } from "../../shared/components/ui/modal/media-modal/media-modal.component";
import { DeleteModalComponent } from "../../shared/components/ui/modal/delete-modal/delete-modal.component";
import { DeleteAllAttachment } from '../../shared/action/attachment.action';
import { Attachment } from '../../shared/interface/attachment.interface';
import { TranslateModule } from '@ngx-translate/core';
import { MediaBoxComponent } from '../../shared/components/ui/media-box/media-box.component';

import { HasPermissionDirective } from '../../shared/directive/has-permission.directive';
import { PageWrapperComponent } from '../../shared/components/page-wrapper/page-wrapper.component';

@Component({
    selector: 'app-media',
    templateUrl: './media.component.html',
    styleUrls: ['./media.component.scss'],
    imports: [PageWrapperComponent, HasPermissionDirective, MediaBoxComponent, MediaModalComponent, DeleteModalComponent, TranslateModule]
})
export class MediaComponent {

  public images: Attachment[] = [];

  @ViewChild("mediaModal") MediaModal: MediaModalComponent;
  @ViewChild("deleteModal") DeleteModal: DeleteModalComponent;

  constructor(private store: Store) { }

  selectImage(data: Attachment[]) {
    this.images = data;
  }

  onActionClicked(action: string) {
    if(action == 'deleteAll') {
      let ids = this.images.map(image => image?.id!);
      this.store.dispatch(new DeleteAllAttachment(ids)).subscribe({
        complete: () => {
          this.images = [];
        }
      });
    }
  }
  
  deleteImage(id: number){
    this.images = this.images.filter(image => {
      return image.id !== id;
    })
  }
}
