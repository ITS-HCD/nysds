"use client";
import * as React from "react";
import { createComponent } from "@lit/react";
import { NysAvatar as NysAvatarElement } from "@nysds/nys-avatar";

const Base = createComponent({
  react: React,
  tagName: "nys-avatar",
  elementClass: NysAvatarElement,
  displayName: "NysAvatar",
});

// @lit/react drops props that collide with HTMLElement (ariaLabel comes from
// ARIAMixin). Here, we add it back to the public type; runtime behavior is unchanged.
export const NysAvatar = Base as React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof Base> & { ariaLabel?: string } &
    React.RefAttributes<NysAvatarElement>
>;

export type NysAvatarProps = React.ComponentProps<typeof NysAvatar>;
export type { NysAvatarElement };