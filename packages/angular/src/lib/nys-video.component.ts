import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from "@angular/core";
import "@nysds/nys-video";

@Component({
  selector: "nys-video",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[id]": "id",
    "[titleText]": "titleText",
    "[videourl]": "videourl",
    "[size]": "size",
    "[loading]": "loading",
    "[starttime]": "starttime",
    "[thumbnail]": "thumbnail",
    "[autoplay]": "autoplay",
    "[disabled]": "disabled",
  },
})
export class NysVideoComponent {
  @Input() id: any;
  @Input() titleText: any;
  @Input() videourl: any;
  @Input() size: any;
  @Input() loading: any;
  @Input() starttime: any;
  @Input() thumbnail: any;
  @Input() autoplay: any;
  @Input() disabled: any;

  @Output() "nys-video-play" = new EventEmitter<CustomEvent<any>>();
}
