// src/react.d.ts
import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'nys-alert': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        id?: string;
        heading?: string;
        icon?: string;
        dismissible?: boolean;
        duration?: number;
        text?: string;
        primaryAction?: string;
        secondaryAction?: string;
        primaryLabel?: string;
        secondaryLabel?: string;
        type?: 'base' | 'info' | 'success' | 'warning' | 'danger' | 'emergency';
        ref?: React.Ref<any>;
      };
      'nys-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        type?: 'button' | 'submit' | 'reset';
        label?: string;
        variant?: string;
        fullWidth?: boolean;
        circle?: boolean;
        icon?: string;
        size?: string;
        inverted?: boolean;
        ariaLabel?: string;
        ref?: React.Ref<any>;
      };
      'nys-checkbox': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        label?: string;
        description?: string;
        name?: string;
        value?: string;
        checked?: boolean;
        other?: boolean;
        required?: boolean;
        ref?: React.Ref<any>;
      };
      'nys-checkboxgroup': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        id?: string;
        label?: string;
        description?: string;
        required?: boolean;
        ref?: React.Ref<any>;
      };
      'nys-datepicker': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        id?: string;
        label?: string;
        description?: string;
        name?: string;
        type?: 'date' | 'datetime-local';
        required?: boolean;
        ref?: React.Ref<any>;
      };
      'nys-fileinput': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        id?: string;
        label?: string;
        description?: string;
        name?: string;
        accept?: string;
        multiple?: boolean;
        dropzone?: boolean;
        ref?: React.Ref<any>;
      };
      'nys-modal': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        id?: string;
        heading?: string;
        subheading?: string;
        open?: boolean;
        ref?: React.Ref<any>;
      };
      'nys-radiobutton': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        label?: string;
        name?: string;
        value?: string;
        other?: boolean;
        required?: boolean;
        ref?: React.Ref<any>;
      };
      'nys-radiogroup': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        id?: string;
        label?: string;
        description?: string;
        size?: 'sm' | 'md' | 'lg';
        required?: boolean;
        ref?: React.Ref<any>;
      };
      'nys-select': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        id?: string;
        label?: string;
        name?: string;
        required?: boolean;
        ref?: React.Ref<any>;
      };
      'nys-textarea': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        id?: string;
        label?: string;
        name?: string;
        value?: string;
        required?: boolean;
        ref?: React.Ref<any>;
      };
      'nys-textinput': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        id?: string;
        label?: string;
        description?: string;
        name?: string;
        type?: string;
        required?: boolean;
        ref?: React.Ref<any>;
      };
      'nys-toggle': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        id?: string;
        label?: string;
        name?: string;
        value?: string;
        ref?: React.Ref<any>;
      };
      'nys-tooltip': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        for?: string;
        text?: string;
        ref?: React.Ref<any>;
      };
      'nys-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        name?: string;
        size?: string;
        label?: string;
        ref?: React.Ref<any>;
      };
    }
  }
}