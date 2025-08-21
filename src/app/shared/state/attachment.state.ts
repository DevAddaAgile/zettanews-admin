import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetAttachments, CreateAttachment, DeleteAttachment, DeleteAllAttachment } from "../action/attachment.action";
import { AttachmentModel } from "../interface/attachment.interface";
import { AttachmentService } from "../services/attachment.service";
import { NotificationService } from "../services/notification.service";

export class AttachmentStateModel {
  attachment: AttachmentModel
}

@State<AttachmentStateModel>({
  name: "attachment",
  defaults: {
    attachment: {
      data: [],
      total: 0
    }
  },
})
@Injectable()
export class AttachmentState {
  
  constructor(private store: Store, 
    private notificationService: NotificationService,
    private attachmentService: AttachmentService) {}

  @Selector()
  static attachment(state: AttachmentStateModel) {
    return state.attachment;
  }

  @Action(GetAttachments)
  getAttachments(ctx: StateContext<AttachmentStateModel>, action: GetAttachments) {
    // Disable API call to prevent JSON parsing errors
    ctx.patchState({
      attachment: {
        data: [],
        total: 0
      }
    });
  }

  @Action(CreateAttachment)
  create(ctx: StateContext<AttachmentStateModel>, action: CreateAttachment) {
    return this.attachmentService.createAttachment(action.payload).pipe(
      tap({
        next: result => {
          const state = ctx.getState();
          ctx.patchState({
            attachment: {
              data: [...state.attachment.data, ...result],
              total: state.attachment.total + result.length
            }
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(DeleteAttachment)
  delete(ctx: StateContext<AttachmentStateModel>, { id }: DeleteAttachment) {
    return this.attachmentService.deleteAttachment(id).pipe(
      tap({
        next: () => {
          const state = ctx.getState();
          ctx.patchState({
            attachment: {
              data: state.attachment.data.filter(item => item.id !== id),
              total: state.attachment.total - 1
            }
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(DeleteAllAttachment)
  deleteAll(ctx: StateContext<AttachmentStateModel>, { ids }: DeleteAllAttachment) {
    // Delete Multiple File Logic Here
  }

}
