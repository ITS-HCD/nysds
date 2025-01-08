import { LitElement } from "lit";
export declare class NysIcon extends LitElement {
  name: string;
  label: string;
  rotate: string;
  flip: string;
  color: string;
  static styles: import("lit").CSSResult;
  private static readonly VALID_TYPES;
  private _size;
  get size(): (typeof NysIcon.VALID_TYPES)[number];
  set size(value: string);
  private getIcon;
  render(): SVGElement | null;
}
