import {
  NG_VALUE_ACCESSOR
} from "./chunk-XFHZKU4L.js";
import "./chunk-AYJ7DGUS.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  __decorate,
  forwardRef,
  fromEvent,
  setClassMetadata,
  ɵɵProvidersFeature,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵlistener,
  ɵɵprojection,
  ɵɵprojectionDef
} from "./chunk-OWKVKWGP.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// ../../../node_modules/@lit/reactive-element/development/css-tag.js
var NODE_MODE = false;
var global = globalThis;
var supportsAdoptingStyleSheets = global.ShadowRoot && (global.ShadyCSS === void 0 || global.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var constructionToken = /* @__PURE__ */ Symbol();
var cssTagCache = /* @__PURE__ */ new WeakMap();
var CSSResult = class {
  constructor(cssText, strings, safeToken) {
    this["_$cssResult$"] = true;
    if (safeToken !== constructionToken) {
      throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    }
    this.cssText = cssText;
    this._strings = strings;
  }
  // This is a getter so that it's lazy. In practice, this means stylesheets
  // are not created until the first element instance is made.
  get styleSheet() {
    let styleSheet = this._styleSheet;
    const strings = this._strings;
    if (supportsAdoptingStyleSheets && styleSheet === void 0) {
      const cacheable = strings !== void 0 && strings.length === 1;
      if (cacheable) {
        styleSheet = cssTagCache.get(strings);
      }
      if (styleSheet === void 0) {
        (this._styleSheet = styleSheet = new CSSStyleSheet()).replaceSync(this.cssText);
        if (cacheable) {
          cssTagCache.set(strings, styleSheet);
        }
      }
    }
    return styleSheet;
  }
  toString() {
    return this.cssText;
  }
};
var unsafeCSS = (value) => new CSSResult(typeof value === "string" ? value : String(value), void 0, constructionToken);
var adoptStyles = (renderRoot, styles) => {
  if (supportsAdoptingStyleSheets) {
    renderRoot.adoptedStyleSheets = styles.map((s13) => s13 instanceof CSSStyleSheet ? s13 : s13.styleSheet);
  } else {
    for (const s13 of styles) {
      const style = document.createElement("style");
      const nonce = global["litNonce"];
      if (nonce !== void 0) {
        style.setAttribute("nonce", nonce);
      }
      style.textContent = s13.cssText;
      renderRoot.appendChild(style);
    }
  }
};
var cssResultFromStyleSheet = (sheet) => {
  let cssText = "";
  for (const rule of sheet.cssRules) {
    cssText += rule.cssText;
  }
  return unsafeCSS(cssText);
};
var getCompatibleStyle = supportsAdoptingStyleSheets || NODE_MODE && global.CSSStyleSheet === void 0 ? (s13) => s13 : (s13) => s13 instanceof CSSStyleSheet ? cssResultFromStyleSheet(s13) : s13;

// ../../../node_modules/@lit/reactive-element/development/reactive-element.js
var { is, defineProperty, getOwnPropertyDescriptor, getOwnPropertyNames, getOwnPropertySymbols, getPrototypeOf } = Object;
var NODE_MODE2 = false;
var global2 = globalThis;
if (NODE_MODE2) {
  global2.customElements ??= customElements;
}
var DEV_MODE = true;
var issueWarning;
var trustedTypes = global2.trustedTypes;
var emptyStringForBooleanAttribute = trustedTypes ? trustedTypes.emptyScript : "";
var polyfillSupport = DEV_MODE ? global2.reactiveElementPolyfillSupportDevMode : global2.reactiveElementPolyfillSupport;
if (DEV_MODE) {
  global2.litIssuedWarnings ??= /* @__PURE__ */ new Set();
  issueWarning = (code, warning) => {
    warning += ` See https://lit.dev/msg/${code} for more information.`;
    if (!global2.litIssuedWarnings.has(warning) && !global2.litIssuedWarnings.has(code)) {
      console.warn(warning);
      global2.litIssuedWarnings.add(warning);
    }
  };
  queueMicrotask(() => {
    issueWarning("dev-mode", `Lit is in dev mode. Not recommended for production!`);
    if (global2.ShadyDOM?.inUse && polyfillSupport === void 0) {
      issueWarning("polyfill-support-missing", `Shadow DOM is being polyfilled via \`ShadyDOM\` but the \`polyfill-support\` module has not been loaded.`);
    }
  });
}
var debugLogEvent = DEV_MODE ? (event) => {
  const shouldEmit = global2.emitLitDebugLogEvents;
  if (!shouldEmit) {
    return;
  }
  global2.dispatchEvent(new CustomEvent("lit-debug", {
    detail: event
  }));
} : void 0;
var JSCompiler_renameProperty = (prop, _obj) => prop;
var defaultConverter = {
  toAttribute(value, type) {
    switch (type) {
      case Boolean:
        value = value ? emptyStringForBooleanAttribute : null;
        break;
      case Object:
      case Array:
        value = value == null ? value : JSON.stringify(value);
        break;
    }
    return value;
  },
  fromAttribute(value, type) {
    let fromValue = value;
    switch (type) {
      case Boolean:
        fromValue = value !== null;
        break;
      case Number:
        fromValue = value === null ? null : Number(value);
        break;
      case Object:
      case Array:
        try {
          fromValue = JSON.parse(value);
        } catch (e5) {
          fromValue = null;
        }
        break;
    }
    return fromValue;
  }
};
var notEqual = (value, old) => !is(value, old);
var defaultPropertyDeclaration = {
  attribute: true,
  type: String,
  converter: defaultConverter,
  reflect: false,
  useDefault: false,
  hasChanged: notEqual
};
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata");
global2.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var ReactiveElement = class extends HTMLElement {
  /**
   * Adds an initializer function to the class that is called during instance
   * construction.
   *
   * This is useful for code that runs against a `ReactiveElement`
   * subclass, such as a decorator, that needs to do work for each
   * instance, such as setting up a `ReactiveController`.
   *
   * ```ts
   * const myDecorator = (target: typeof ReactiveElement, key: string) => {
   *   target.addInitializer((instance: ReactiveElement) => {
   *     // This is run during construction of the element
   *     new MyController(instance);
   *   });
   * }
   * ```
   *
   * Decorating a field will then cause each instance to run an initializer
   * that adds a controller:
   *
   * ```ts
   * class MyElement extends LitElement {
   *   @myDecorator foo;
   * }
   * ```
   *
   * Initializers are stored per-constructor. Adding an initializer to a
   * subclass does not add it to a superclass. Since initializers are run in
   * constructors, initializers will run in order of the class hierarchy,
   * starting with superclasses and progressing to the instance's class.
   *
   * @nocollapse
   */
  static addInitializer(initializer) {
    this.__prepare();
    (this._initializers ??= []).push(initializer);
  }
  /**
   * Returns a list of attributes corresponding to the registered properties.
   * @nocollapse
   * @category attributes
   */
  static get observedAttributes() {
    this.finalize();
    return this.__attributeToPropertyMap && [...this.__attributeToPropertyMap.keys()];
  }
  /**
   * Creates a property accessor on the element prototype if one does not exist
   * and stores a {@linkcode PropertyDeclaration} for the property with the
   * given options. The property setter calls the property's `hasChanged`
   * property option or uses a strict identity check to determine whether or not
   * to request an update.
   *
   * This method may be overridden to customize properties; however,
   * when doing so, it's important to call `super.createProperty` to ensure
   * the property is setup correctly. This method calls
   * `getPropertyDescriptor` internally to get a descriptor to install.
   * To customize what properties do when they are get or set, override
   * `getPropertyDescriptor`. To customize the options for a property,
   * implement `createProperty` like this:
   *
   * ```ts
   * static createProperty(name, options) {
   *   options = Object.assign(options, {myOption: true});
   *   super.createProperty(name, options);
   * }
   * ```
   *
   * @nocollapse
   * @category properties
   */
  static createProperty(name, options = defaultPropertyDeclaration) {
    if (options.state) {
      options.attribute = false;
    }
    this.__prepare();
    if (this.prototype.hasOwnProperty(name)) {
      options = Object.create(options);
      options.wrapped = true;
    }
    this.elementProperties.set(name, options);
    if (!options.noAccessor) {
      const key = DEV_MODE ? (
        // Use Symbol.for in dev mode to make it easier to maintain state
        // when doing HMR.
        /* @__PURE__ */ Symbol.for(`${String(name)} (@property() cache)`)
      ) : /* @__PURE__ */ Symbol();
      const descriptor = this.getPropertyDescriptor(name, key, options);
      if (descriptor !== void 0) {
        defineProperty(this.prototype, name, descriptor);
      }
    }
  }
  /**
   * Returns a property descriptor to be defined on the given named property.
   * If no descriptor is returned, the property will not become an accessor.
   * For example,
   *
   * ```ts
   * class MyElement extends LitElement {
   *   static getPropertyDescriptor(name, key, options) {
   *     const defaultDescriptor =
   *         super.getPropertyDescriptor(name, key, options);
   *     const setter = defaultDescriptor.set;
   *     return {
   *       get: defaultDescriptor.get,
   *       set(value) {
   *         setter.call(this, value);
   *         // custom action.
   *       },
   *       configurable: true,
   *       enumerable: true
   *     }
   *   }
   * }
   * ```
   *
   * @nocollapse
   * @category properties
   */
  static getPropertyDescriptor(name, key, options) {
    const { get, set } = getOwnPropertyDescriptor(this.prototype, name) ?? {
      get() {
        return this[key];
      },
      set(v20) {
        this[key] = v20;
      }
    };
    if (DEV_MODE && get == null) {
      if ("value" in (getOwnPropertyDescriptor(this.prototype, name) ?? {})) {
        throw new Error(`Field ${JSON.stringify(String(name))} on ${this.name} was declared as a reactive property but it's actually declared as a value on the prototype. Usually this is due to using @property or @state on a method.`);
      }
      issueWarning("reactive-property-without-getter", `Field ${JSON.stringify(String(name))} on ${this.name} was declared as a reactive property but it does not have a getter. This will be an error in a future version of Lit.`);
    }
    return {
      get,
      set(value) {
        const oldValue = get?.call(this);
        set?.call(this, value);
        this.requestUpdate(name, oldValue, options);
      },
      configurable: true,
      enumerable: true
    };
  }
  /**
   * Returns the property options associated with the given property.
   * These options are defined with a `PropertyDeclaration` via the `properties`
   * object or the `@property` decorator and are registered in
   * `createProperty(...)`.
   *
   * Note, this method should be considered "final" and not overridden. To
   * customize the options for a given property, override
   * {@linkcode createProperty}.
   *
   * @nocollapse
   * @final
   * @category properties
   */
  static getPropertyOptions(name) {
    return this.elementProperties.get(name) ?? defaultPropertyDeclaration;
  }
  /**
   * Initializes static own properties of the class used in bookkeeping
   * for element properties, initializers, etc.
   *
   * Can be called multiple times by code that needs to ensure these
   * properties exist before using them.
   *
   * This method ensures the superclass is finalized so that inherited
   * property metadata can be copied down.
   * @nocollapse
   */
  static __prepare() {
    if (this.hasOwnProperty(JSCompiler_renameProperty("elementProperties", this))) {
      return;
    }
    const superCtor = getPrototypeOf(this);
    superCtor.finalize();
    if (superCtor._initializers !== void 0) {
      this._initializers = [...superCtor._initializers];
    }
    this.elementProperties = new Map(superCtor.elementProperties);
  }
  /**
   * Finishes setting up the class so that it's ready to be registered
   * as a custom element and instantiated.
   *
   * This method is called by the ReactiveElement.observedAttributes getter.
   * If you override the observedAttributes getter, you must either call
   * super.observedAttributes to trigger finalization, or call finalize()
   * yourself.
   *
   * @nocollapse
   */
  static finalize() {
    if (this.hasOwnProperty(JSCompiler_renameProperty("finalized", this))) {
      return;
    }
    this.finalized = true;
    this.__prepare();
    if (this.hasOwnProperty(JSCompiler_renameProperty("properties", this))) {
      const props = this.properties;
      const propKeys = [
        ...getOwnPropertyNames(props),
        ...getOwnPropertySymbols(props)
      ];
      for (const p19 of propKeys) {
        this.createProperty(p19, props[p19]);
      }
    }
    const metadata = this[Symbol.metadata];
    if (metadata !== null) {
      const properties = litPropertyMetadata.get(metadata);
      if (properties !== void 0) {
        for (const [p19, options] of properties) {
          this.elementProperties.set(p19, options);
        }
      }
    }
    this.__attributeToPropertyMap = /* @__PURE__ */ new Map();
    for (const [p19, options] of this.elementProperties) {
      const attr = this.__attributeNameForProperty(p19, options);
      if (attr !== void 0) {
        this.__attributeToPropertyMap.set(attr, p19);
      }
    }
    this.elementStyles = this.finalizeStyles(this.styles);
    if (DEV_MODE) {
      if (this.hasOwnProperty("createProperty")) {
        issueWarning("no-override-create-property", "Overriding ReactiveElement.createProperty() is deprecated. The override will not be called with standard decorators");
      }
      if (this.hasOwnProperty("getPropertyDescriptor")) {
        issueWarning("no-override-get-property-descriptor", "Overriding ReactiveElement.getPropertyDescriptor() is deprecated. The override will not be called with standard decorators");
      }
    }
  }
  /**
   * Takes the styles the user supplied via the `static styles` property and
   * returns the array of styles to apply to the element.
   * Override this method to integrate into a style management system.
   *
   * Styles are deduplicated preserving the _last_ instance in the list. This
   * is a performance optimization to avoid duplicated styles that can occur
   * especially when composing via subclassing. The last item is kept to try
   * to preserve the cascade order with the assumption that it's most important
   * that last added styles override previous styles.
   *
   * @nocollapse
   * @category styles
   */
  static finalizeStyles(styles) {
    const elementStyles = [];
    if (Array.isArray(styles)) {
      const set = new Set(styles.flat(Infinity).reverse());
      for (const s13 of set) {
        elementStyles.unshift(getCompatibleStyle(s13));
      }
    } else if (styles !== void 0) {
      elementStyles.push(getCompatibleStyle(styles));
    }
    return elementStyles;
  }
  /**
   * Returns the property name for the given attribute `name`.
   * @nocollapse
   */
  static __attributeNameForProperty(name, options) {
    const attribute = options.attribute;
    return attribute === false ? void 0 : typeof attribute === "string" ? attribute : typeof name === "string" ? name.toLowerCase() : void 0;
  }
  constructor() {
    super();
    this.__instanceProperties = void 0;
    this.isUpdatePending = false;
    this.hasUpdated = false;
    this.__reflectingProperty = null;
    this.__initialize();
  }
  /**
   * Internal only override point for customizing work done when elements
   * are constructed.
   */
  __initialize() {
    this.__updatePromise = new Promise((res) => this.enableUpdating = res);
    this._$changedProperties = /* @__PURE__ */ new Map();
    this.__saveInstanceProperties();
    this.requestUpdate();
    this.constructor._initializers?.forEach((i21) => i21(this));
  }
  /**
   * Registers a `ReactiveController` to participate in the element's reactive
   * update cycle. The element automatically calls into any registered
   * controllers during its lifecycle callbacks.
   *
   * If the element is connected when `addController()` is called, the
   * controller's `hostConnected()` callback will be immediately called.
   * @category controllers
   */
  addController(controller) {
    (this.__controllers ??= /* @__PURE__ */ new Set()).add(controller);
    if (this.renderRoot !== void 0 && this.isConnected) {
      controller.hostConnected?.();
    }
  }
  /**
   * Removes a `ReactiveController` from the element.
   * @category controllers
   */
  removeController(controller) {
    this.__controllers?.delete(controller);
  }
  /**
   * Fixes any properties set on the instance before upgrade time.
   * Otherwise these would shadow the accessor and break these properties.
   * The properties are stored in a Map which is played back after the
   * constructor runs.
   */
  __saveInstanceProperties() {
    const instanceProperties = /* @__PURE__ */ new Map();
    const elementProperties = this.constructor.elementProperties;
    for (const p19 of elementProperties.keys()) {
      if (this.hasOwnProperty(p19)) {
        instanceProperties.set(p19, this[p19]);
        delete this[p19];
      }
    }
    if (instanceProperties.size > 0) {
      this.__instanceProperties = instanceProperties;
    }
  }
  /**
   * Returns the node into which the element should render and by default
   * creates and returns an open shadowRoot. Implement to customize where the
   * element's DOM is rendered. For example, to render into the element's
   * childNodes, return `this`.
   *
   * @return Returns a node into which to render.
   * @category rendering
   */
  createRenderRoot() {
    const renderRoot = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    adoptStyles(renderRoot, this.constructor.elementStyles);
    return renderRoot;
  }
  /**
   * On first connection, creates the element's renderRoot, sets up
   * element styling, and enables updating.
   * @category lifecycle
   */
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot();
    this.enableUpdating(true);
    this.__controllers?.forEach((c21) => c21.hostConnected?.());
  }
  /**
   * Note, this method should be considered final and not overridden. It is
   * overridden on the element instance with a function that triggers the first
   * update.
   * @category updates
   */
  enableUpdating(_requestedUpdate) {
  }
  /**
   * Allows for `super.disconnectedCallback()` in extensions while
   * reserving the possibility of making non-breaking feature additions
   * when disconnecting at some point in the future.
   * @category lifecycle
   */
  disconnectedCallback() {
    this.__controllers?.forEach((c21) => c21.hostDisconnected?.());
  }
  /**
   * Synchronizes property values when attributes change.
   *
   * Specifically, when an attribute is set, the corresponding property is set.
   * You should rarely need to implement this callback. If this method is
   * overridden, `super.attributeChangedCallback(name, _old, value)` must be
   * called.
   *
   * See [responding to attribute changes](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes)
   * on MDN for more information about the `attributeChangedCallback`.
   * @category attributes
   */
  attributeChangedCallback(name, _old, value) {
    this._$attributeToProperty(name, value);
  }
  __propertyToAttribute(name, value) {
    const elemProperties = this.constructor.elementProperties;
    const options = elemProperties.get(name);
    const attr = this.constructor.__attributeNameForProperty(name, options);
    if (attr !== void 0 && options.reflect === true) {
      const converter = options.converter?.toAttribute !== void 0 ? options.converter : defaultConverter;
      const attrValue = converter.toAttribute(value, options.type);
      if (DEV_MODE && this.constructor.enabledWarnings.includes("migration") && attrValue === void 0) {
        issueWarning("undefined-attribute-value", `The attribute value for the ${name} property is undefined on element ${this.localName}. The attribute will be removed, but in the previous version of \`ReactiveElement\`, the attribute would not have changed.`);
      }
      this.__reflectingProperty = name;
      if (attrValue == null) {
        this.removeAttribute(attr);
      } else {
        this.setAttribute(attr, attrValue);
      }
      this.__reflectingProperty = null;
    }
  }
  /** @internal */
  _$attributeToProperty(name, value) {
    const ctor = this.constructor;
    const propName = ctor.__attributeToPropertyMap.get(name);
    if (propName !== void 0 && this.__reflectingProperty !== propName) {
      const options = ctor.getPropertyOptions(propName);
      const converter = typeof options.converter === "function" ? { fromAttribute: options.converter } : options.converter?.fromAttribute !== void 0 ? options.converter : defaultConverter;
      this.__reflectingProperty = propName;
      const convertedValue = converter.fromAttribute(value, options.type);
      this[propName] = convertedValue ?? this.__defaultValues?.get(propName) ?? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      convertedValue;
      this.__reflectingProperty = null;
    }
  }
  /**
   * Requests an update which is processed asynchronously. This should be called
   * when an element should update based on some state not triggered by setting
   * a reactive property. In this case, pass no arguments. It should also be
   * called when manually implementing a property setter. In this case, pass the
   * property `name` and `oldValue` to ensure that any configured property
   * options are honored.
   *
   * @param name name of requesting property
   * @param oldValue old value of requesting property
   * @param options property options to use instead of the previously
   *     configured options
   * @param useNewValue if true, the newValue argument is used instead of
   *     reading the property value. This is important to use if the reactive
   *     property is a standard private accessor, as opposed to a plain
   *     property, since private members can't be dynamically read by name.
   * @param newValue the new value of the property. This is only used if
   *     `useNewValue` is true.
   * @category updates
   */
  requestUpdate(name, oldValue, options, useNewValue = false, newValue) {
    if (name !== void 0) {
      if (DEV_MODE && name instanceof Event) {
        issueWarning(``, `The requestUpdate() method was called with an Event as the property name. This is probably a mistake caused by binding this.requestUpdate as an event listener. Instead bind a function that will call it with no arguments: () => this.requestUpdate()`);
      }
      const ctor = this.constructor;
      if (useNewValue === false) {
        newValue = this[name];
      }
      options ??= ctor.getPropertyOptions(name);
      const changed = (options.hasChanged ?? notEqual)(newValue, oldValue) || // When there is no change, check a corner case that can occur when
      // 1. there's a initial value which was not reflected
      // 2. the property is subsequently set to this value.
      // For example, `prop: {useDefault: true, reflect: true}`
      // and el.prop = 'foo'. This should be considered a change if the
      // attribute is not set because we will now reflect the property to the attribute.
      options.useDefault && options.reflect && newValue === this.__defaultValues?.get(name) && !this.hasAttribute(ctor.__attributeNameForProperty(name, options));
      if (changed) {
        this._$changeProperty(name, oldValue, options);
      } else {
        return;
      }
    }
    if (this.isUpdatePending === false) {
      this.__updatePromise = this.__enqueueUpdate();
    }
  }
  /**
   * @internal
   */
  _$changeProperty(name, oldValue, { useDefault, reflect, wrapped }, initializeValue) {
    if (useDefault && !(this.__defaultValues ??= /* @__PURE__ */ new Map()).has(name)) {
      this.__defaultValues.set(name, initializeValue ?? oldValue ?? this[name]);
      if (wrapped !== true || initializeValue !== void 0) {
        return;
      }
    }
    if (!this._$changedProperties.has(name)) {
      if (!this.hasUpdated && !useDefault) {
        oldValue = void 0;
      }
      this._$changedProperties.set(name, oldValue);
    }
    if (reflect === true && this.__reflectingProperty !== name) {
      (this.__reflectingProperties ??= /* @__PURE__ */ new Set()).add(name);
    }
  }
  /**
   * Sets up the element to asynchronously update.
   */
  async __enqueueUpdate() {
    this.isUpdatePending = true;
    try {
      await this.__updatePromise;
    } catch (e5) {
      Promise.reject(e5);
    }
    const result = this.scheduleUpdate();
    if (result != null) {
      await result;
    }
    return !this.isUpdatePending;
  }
  /**
   * Schedules an element update. You can override this method to change the
   * timing of updates by returning a Promise. The update will await the
   * returned Promise, and you should resolve the Promise to allow the update
   * to proceed. If this method is overridden, `super.scheduleUpdate()`
   * must be called.
   *
   * For instance, to schedule updates to occur just before the next frame:
   *
   * ```ts
   * override protected async scheduleUpdate(): Promise<unknown> {
   *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
   *   super.scheduleUpdate();
   * }
   * ```
   * @category updates
   */
  scheduleUpdate() {
    const result = this.performUpdate();
    if (DEV_MODE && this.constructor.enabledWarnings.includes("async-perform-update") && typeof result?.then === "function") {
      issueWarning("async-perform-update", `Element ${this.localName} returned a Promise from performUpdate(). This behavior is deprecated and will be removed in a future version of ReactiveElement.`);
    }
    return result;
  }
  /**
   * Performs an element update. Note, if an exception is thrown during the
   * update, `firstUpdated` and `updated` will not be called.
   *
   * Call `performUpdate()` to immediately process a pending update. This should
   * generally not be needed, but it can be done in rare cases when you need to
   * update synchronously.
   *
   * @category updates
   */
  performUpdate() {
    if (!this.isUpdatePending) {
      return;
    }
    debugLogEvent?.({ kind: "update" });
    if (!this.hasUpdated) {
      this.renderRoot ??= this.createRenderRoot();
      if (DEV_MODE) {
        const ctor = this.constructor;
        const shadowedProperties = [...ctor.elementProperties.keys()].filter((p19) => this.hasOwnProperty(p19) && p19 in getPrototypeOf(this));
        if (shadowedProperties.length) {
          throw new Error(`The following properties on element ${this.localName} will not trigger updates as expected because they are set using class fields: ${shadowedProperties.join(", ")}. Native class fields and some compiled output will overwrite accessors used for detecting changes. See https://lit.dev/msg/class-field-shadowing for more information.`);
        }
      }
      if (this.__instanceProperties) {
        for (const [p19, value] of this.__instanceProperties) {
          this[p19] = value;
        }
        this.__instanceProperties = void 0;
      }
      const elementProperties = this.constructor.elementProperties;
      if (elementProperties.size > 0) {
        for (const [p19, options] of elementProperties) {
          const { wrapped } = options;
          const value = this[p19];
          if (wrapped === true && !this._$changedProperties.has(p19) && value !== void 0) {
            this._$changeProperty(p19, void 0, options, value);
          }
        }
      }
    }
    let shouldUpdate = false;
    const changedProperties = this._$changedProperties;
    try {
      shouldUpdate = this.shouldUpdate(changedProperties);
      if (shouldUpdate) {
        this.willUpdate(changedProperties);
        this.__controllers?.forEach((c21) => c21.hostUpdate?.());
        this.update(changedProperties);
      } else {
        this.__markUpdated();
      }
    } catch (e5) {
      shouldUpdate = false;
      this.__markUpdated();
      throw e5;
    }
    if (shouldUpdate) {
      this._$didUpdate(changedProperties);
    }
  }
  /**
   * Invoked before `update()` to compute values needed during the update.
   *
   * Implement `willUpdate` to compute property values that depend on other
   * properties and are used in the rest of the update process.
   *
   * ```ts
   * willUpdate(changedProperties) {
   *   // only need to check changed properties for an expensive computation.
   *   if (changedProperties.has('firstName') || changedProperties.has('lastName')) {
   *     this.sha = computeSHA(`${this.firstName} ${this.lastName}`);
   *   }
   * }
   *
   * render() {
   *   return html`SHA: ${this.sha}`;
   * }
   * ```
   *
   * @category updates
   */
  willUpdate(_changedProperties) {
  }
  // Note, this is an override point for polyfill-support.
  // @internal
  _$didUpdate(changedProperties) {
    this.__controllers?.forEach((c21) => c21.hostUpdated?.());
    if (!this.hasUpdated) {
      this.hasUpdated = true;
      this.firstUpdated(changedProperties);
    }
    this.updated(changedProperties);
    if (DEV_MODE && this.isUpdatePending && this.constructor.enabledWarnings.includes("change-in-update")) {
      issueWarning("change-in-update", `Element ${this.localName} scheduled an update (generally because a property was set) after an update completed, causing a new update to be scheduled. This is inefficient and should be avoided unless the next update can only be scheduled as a side effect of the previous update.`);
    }
  }
  __markUpdated() {
    this._$changedProperties = /* @__PURE__ */ new Map();
    this.isUpdatePending = false;
  }
  /**
   * Returns a Promise that resolves when the element has completed updating.
   * The Promise value is a boolean that is `true` if the element completed the
   * update without triggering another update. The Promise result is `false` if
   * a property was set inside `updated()`. If the Promise is rejected, an
   * exception was thrown during the update.
   *
   * To await additional asynchronous work, override the `getUpdateComplete`
   * method. For example, it is sometimes useful to await a rendered element
   * before fulfilling this Promise. To do this, first await
   * `super.getUpdateComplete()`, then any subsequent state.
   *
   * @return A promise of a boolean that resolves to true if the update completed
   *     without triggering another update.
   * @category updates
   */
  get updateComplete() {
    return this.getUpdateComplete();
  }
  /**
   * Override point for the `updateComplete` promise.
   *
   * It is not safe to override the `updateComplete` getter directly due to a
   * limitation in TypeScript which means it is not possible to call a
   * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
   * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
   * This method should be overridden instead. For example:
   *
   * ```ts
   * class MyElement extends LitElement {
   *   override async getUpdateComplete() {
   *     const result = await super.getUpdateComplete();
   *     await this._myChild.updateComplete;
   *     return result;
   *   }
   * }
   * ```
   *
   * @return A promise of a boolean that resolves to true if the update completed
   *     without triggering another update.
   * @category updates
   */
  getUpdateComplete() {
    return this.__updatePromise;
  }
  /**
   * Controls whether or not `update()` should be called when the element requests
   * an update. By default, this method always returns `true`, but this can be
   * customized to control when to update.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  shouldUpdate(_changedProperties) {
    return true;
  }
  /**
   * Updates the element. This method reflects property values to attributes.
   * It can be overridden to render and keep updated element DOM.
   * Setting properties inside this method will *not* trigger
   * another update.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  update(_changedProperties) {
    this.__reflectingProperties &&= this.__reflectingProperties.forEach((p19) => this.__propertyToAttribute(p19, this[p19]));
    this.__markUpdated();
  }
  /**
   * Invoked whenever the element is updated. Implement to perform
   * post-updating tasks via DOM APIs, for example, focusing an element.
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  updated(_changedProperties) {
  }
  /**
   * Invoked when the element is first updated. Implement to perform one time
   * work on the element after update.
   *
   * ```ts
   * firstUpdated() {
   *   this.renderRoot.getElementById('my-text-area').focus();
   * }
   * ```
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * @param _changedProperties Map of changed properties with old values
   * @category updates
   */
  firstUpdated(_changedProperties) {
  }
};
ReactiveElement.elementStyles = [];
ReactiveElement.shadowRootOptions = { mode: "open" };
ReactiveElement[JSCompiler_renameProperty("elementProperties", ReactiveElement)] = /* @__PURE__ */ new Map();
ReactiveElement[JSCompiler_renameProperty("finalized", ReactiveElement)] = /* @__PURE__ */ new Map();
polyfillSupport?.({ ReactiveElement });
if (DEV_MODE) {
  ReactiveElement.enabledWarnings = [
    "change-in-update",
    "async-perform-update"
  ];
  const ensureOwnWarnings = function(ctor) {
    if (!ctor.hasOwnProperty(JSCompiler_renameProperty("enabledWarnings", ctor))) {
      ctor.enabledWarnings = ctor.enabledWarnings.slice();
    }
  };
  ReactiveElement.enableWarning = function(warning) {
    ensureOwnWarnings(this);
    if (!this.enabledWarnings.includes(warning)) {
      this.enabledWarnings.push(warning);
    }
  };
  ReactiveElement.disableWarning = function(warning) {
    ensureOwnWarnings(this);
    const i21 = this.enabledWarnings.indexOf(warning);
    if (i21 >= 0) {
      this.enabledWarnings.splice(i21, 1);
    }
  };
}
(global2.reactiveElementVersions ??= []).push("2.1.2");
if (DEV_MODE && global2.reactiveElementVersions.length > 1) {
  queueMicrotask(() => {
    issueWarning("multiple-versions", `Multiple versions of Lit loaded. Loading multiple versions is not recommended.`);
  });
}

// ../../../node_modules/lit-html/development/lit-html.js
var DEV_MODE2 = true;
var ENABLE_EXTRA_SECURITY_HOOKS = true;
var ENABLE_SHADYDOM_NOPATCH = true;
var NODE_MODE3 = false;
var global3 = globalThis;
var debugLogEvent2 = DEV_MODE2 ? (event) => {
  const shouldEmit = global3.emitLitDebugLogEvents;
  if (!shouldEmit) {
    return;
  }
  global3.dispatchEvent(new CustomEvent("lit-debug", {
    detail: event
  }));
} : void 0;
var debugLogRenderId = 0;
var issueWarning2;
if (DEV_MODE2) {
  global3.litIssuedWarnings ??= /* @__PURE__ */ new Set();
  issueWarning2 = (code, warning) => {
    warning += code ? ` See https://lit.dev/msg/${code} for more information.` : "";
    if (!global3.litIssuedWarnings.has(warning) && !global3.litIssuedWarnings.has(code)) {
      console.warn(warning);
      global3.litIssuedWarnings.add(warning);
    }
  };
  queueMicrotask(() => {
    issueWarning2("dev-mode", `Lit is in dev mode. Not recommended for production!`);
  });
}
var wrap = ENABLE_SHADYDOM_NOPATCH && global3.ShadyDOM?.inUse && global3.ShadyDOM?.noPatch === true ? global3.ShadyDOM.wrap : (node) => node;
var trustedTypes2 = global3.trustedTypes;
var policy = trustedTypes2 ? trustedTypes2.createPolicy("lit-html", {
  createHTML: (s13) => s13
}) : void 0;
var identityFunction = (value) => value;
var noopSanitizer = (_node, _name, _type) => identityFunction;
var setSanitizer = (newSanitizer) => {
  if (!ENABLE_EXTRA_SECURITY_HOOKS) {
    return;
  }
  if (sanitizerFactoryInternal !== noopSanitizer) {
    throw new Error(`Attempted to overwrite existing lit-html security policy. setSanitizeDOMValueFactory should be called at most once.`);
  }
  sanitizerFactoryInternal = newSanitizer;
};
var _testOnlyClearSanitizerFactoryDoNotCallOrElse = () => {
  sanitizerFactoryInternal = noopSanitizer;
};
var createSanitizer = (node, name, type) => {
  return sanitizerFactoryInternal(node, name, type);
};
var boundAttributeSuffix = "$lit$";
var marker = `lit$${Math.random().toFixed(9).slice(2)}$`;
var markerMatch = "?" + marker;
var nodeMarker = `<${markerMatch}>`;
var d = NODE_MODE3 && global3.document === void 0 ? {
  createTreeWalker() {
    return {};
  }
} : document;
var createMarker = () => d.createComment("");
var isPrimitive = (value) => value === null || typeof value != "object" && typeof value != "function";
var isArray = Array.isArray;
var isIterable = (value) => isArray(value) || // eslint-disable-next-line @typescript-eslint/no-explicit-any
typeof value?.[Symbol.iterator] === "function";
var SPACE_CHAR = `[ 	
\f\r]`;
var ATTR_VALUE_CHAR = `[^ 	
\f\r"'\`<>=]`;
var NAME_CHAR = `[^\\s"'>=/]`;
var textEndRegex = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var COMMENT_START = 1;
var TAG_NAME = 2;
var DYNAMIC_TAG_NAME = 3;
var commentEndRegex = /-->/g;
var comment2EndRegex = />/g;
var tagEndRegex = new RegExp(`>|${SPACE_CHAR}(?:(${NAME_CHAR}+)(${SPACE_CHAR}*=${SPACE_CHAR}*(?:${ATTR_VALUE_CHAR}|("|')|))|$)`, "g");
var ENTIRE_MATCH = 0;
var ATTRIBUTE_NAME = 1;
var SPACES_AND_EQUALS = 2;
var QUOTE_CHAR = 3;
var singleQuoteAttrEndRegex = /'/g;
var doubleQuoteAttrEndRegex = /"/g;
var rawTextElement = /^(?:script|style|textarea|title)$/i;
var HTML_RESULT = 1;
var SVG_RESULT = 2;
var MATHML_RESULT = 3;
var ATTRIBUTE_PART = 1;
var CHILD_PART = 2;
var PROPERTY_PART = 3;
var BOOLEAN_ATTRIBUTE_PART = 4;
var EVENT_PART = 5;
var ELEMENT_PART = 6;
var COMMENT_PART = 7;
var tag = (type) => (strings, ...values) => {
  if (DEV_MODE2 && strings.some((s13) => s13 === void 0)) {
    console.warn("Some template strings are undefined.\nThis is probably caused by illegal octal escape sequences.");
  }
  if (DEV_MODE2) {
    if (values.some((val) => val?.["_$litStatic$"])) {
      issueWarning2("", `Static values 'literal' or 'unsafeStatic' cannot be used as values to non-static templates.
Please use the static 'html' tag function. See https://lit.dev/docs/templates/expressions/#static-expressions`);
    }
  }
  return {
    // This property needs to remain unminified.
    ["_$litType$"]: type,
    strings,
    values
  };
};
var html = tag(HTML_RESULT);
var svg = tag(SVG_RESULT);
var mathml = tag(MATHML_RESULT);
var noChange = /* @__PURE__ */ Symbol.for("lit-noChange");
var nothing = /* @__PURE__ */ Symbol.for("lit-nothing");
var templateCache = /* @__PURE__ */ new WeakMap();
var walker = d.createTreeWalker(
  d,
  129
  /* NodeFilter.SHOW_{ELEMENT|COMMENT} */
);
var sanitizerFactoryInternal = noopSanitizer;
function trustFromTemplateString(tsa, stringFromTSA) {
  if (!isArray(tsa) || !tsa.hasOwnProperty("raw")) {
    let message = "invalid template strings array";
    if (DEV_MODE2) {
      message = `
          Internal Error: expected template strings to be an array
          with a 'raw' field. Faking a template strings array by
          calling html or svg like an ordinary function is effectively
          the same as calling unsafeHtml and can lead to major security
          issues, e.g. opening your code up to XSS attacks.
          If you're using the html or svg tagged template functions normally
          and still seeing this error, please file a bug at
          https://github.com/lit/lit/issues/new?template=bug_report.md
          and include information about your build tooling, if any.
        `.trim().replace(/\n */g, "\n");
    }
    throw new Error(message);
  }
  return policy !== void 0 ? policy.createHTML(stringFromTSA) : stringFromTSA;
}
var getTemplateHtml = (strings, type) => {
  const l17 = strings.length - 1;
  const attrNames = [];
  let html2 = type === SVG_RESULT ? "<svg>" : type === MATHML_RESULT ? "<math>" : "";
  let rawTextEndRegex;
  let regex = textEndRegex;
  for (let i21 = 0; i21 < l17; i21++) {
    const s13 = strings[i21];
    let attrNameEndIndex = -1;
    let attrName;
    let lastIndex = 0;
    let match;
    while (lastIndex < s13.length) {
      regex.lastIndex = lastIndex;
      match = regex.exec(s13);
      if (match === null) {
        break;
      }
      lastIndex = regex.lastIndex;
      if (regex === textEndRegex) {
        if (match[COMMENT_START] === "!--") {
          regex = commentEndRegex;
        } else if (match[COMMENT_START] !== void 0) {
          regex = comment2EndRegex;
        } else if (match[TAG_NAME] !== void 0) {
          if (rawTextElement.test(match[TAG_NAME])) {
            rawTextEndRegex = new RegExp(`</${match[TAG_NAME]}`, "g");
          }
          regex = tagEndRegex;
        } else if (match[DYNAMIC_TAG_NAME] !== void 0) {
          if (DEV_MODE2) {
            throw new Error("Bindings in tag names are not supported. Please use static templates instead. See https://lit.dev/docs/templates/expressions/#static-expressions");
          }
          regex = tagEndRegex;
        }
      } else if (regex === tagEndRegex) {
        if (match[ENTIRE_MATCH] === ">") {
          regex = rawTextEndRegex ?? textEndRegex;
          attrNameEndIndex = -1;
        } else if (match[ATTRIBUTE_NAME] === void 0) {
          attrNameEndIndex = -2;
        } else {
          attrNameEndIndex = regex.lastIndex - match[SPACES_AND_EQUALS].length;
          attrName = match[ATTRIBUTE_NAME];
          regex = match[QUOTE_CHAR] === void 0 ? tagEndRegex : match[QUOTE_CHAR] === '"' ? doubleQuoteAttrEndRegex : singleQuoteAttrEndRegex;
        }
      } else if (regex === doubleQuoteAttrEndRegex || regex === singleQuoteAttrEndRegex) {
        regex = tagEndRegex;
      } else if (regex === commentEndRegex || regex === comment2EndRegex) {
        regex = textEndRegex;
      } else {
        regex = tagEndRegex;
        rawTextEndRegex = void 0;
      }
    }
    if (DEV_MODE2) {
      console.assert(attrNameEndIndex === -1 || regex === tagEndRegex || regex === singleQuoteAttrEndRegex || regex === doubleQuoteAttrEndRegex, "unexpected parse state B");
    }
    const end = regex === tagEndRegex && strings[i21 + 1].startsWith("/>") ? " " : "";
    html2 += regex === textEndRegex ? s13 + nodeMarker : attrNameEndIndex >= 0 ? (attrNames.push(attrName), s13.slice(0, attrNameEndIndex) + boundAttributeSuffix + s13.slice(attrNameEndIndex)) + marker + end : s13 + marker + (attrNameEndIndex === -2 ? i21 : end);
  }
  const htmlResult = html2 + (strings[l17] || "<?>") + (type === SVG_RESULT ? "</svg>" : type === MATHML_RESULT ? "</math>" : "");
  return [trustFromTemplateString(strings, htmlResult), attrNames];
};
var Template = class _Template {
  constructor({ strings, ["_$litType$"]: type }, options) {
    this.parts = [];
    let node;
    let nodeIndex = 0;
    let attrNameIndex = 0;
    const partCount = strings.length - 1;
    const parts = this.parts;
    const [html2, attrNames] = getTemplateHtml(strings, type);
    this.el = _Template.createElement(html2, options);
    walker.currentNode = this.el.content;
    if (type === SVG_RESULT || type === MATHML_RESULT) {
      const wrapper = this.el.content.firstChild;
      wrapper.replaceWith(...wrapper.childNodes);
    }
    while ((node = walker.nextNode()) !== null && parts.length < partCount) {
      if (node.nodeType === 1) {
        if (DEV_MODE2) {
          const tag2 = node.localName;
          if (/^(?:textarea|template)$/i.test(tag2) && node.innerHTML.includes(marker)) {
            const m32 = `Expressions are not supported inside \`${tag2}\` elements. See https://lit.dev/msg/expression-in-${tag2} for more information.`;
            if (tag2 === "template") {
              throw new Error(m32);
            } else
              issueWarning2("", m32);
          }
        }
        if (node.hasAttributes()) {
          for (const name of node.getAttributeNames()) {
            if (name.endsWith(boundAttributeSuffix)) {
              const realName = attrNames[attrNameIndex++];
              const value = node.getAttribute(name);
              const statics = value.split(marker);
              const m32 = /([.?@])?(.*)/.exec(realName);
              parts.push({
                type: ATTRIBUTE_PART,
                index: nodeIndex,
                name: m32[2],
                strings: statics,
                ctor: m32[1] === "." ? PropertyPart : m32[1] === "?" ? BooleanAttributePart : m32[1] === "@" ? EventPart : AttributePart
              });
              node.removeAttribute(name);
            } else if (name.startsWith(marker)) {
              parts.push({
                type: ELEMENT_PART,
                index: nodeIndex
              });
              node.removeAttribute(name);
            }
          }
        }
        if (rawTextElement.test(node.tagName)) {
          const strings2 = node.textContent.split(marker);
          const lastIndex = strings2.length - 1;
          if (lastIndex > 0) {
            node.textContent = trustedTypes2 ? trustedTypes2.emptyScript : "";
            for (let i21 = 0; i21 < lastIndex; i21++) {
              node.append(strings2[i21], createMarker());
              walker.nextNode();
              parts.push({ type: CHILD_PART, index: ++nodeIndex });
            }
            node.append(strings2[lastIndex], createMarker());
          }
        }
      } else if (node.nodeType === 8) {
        const data = node.data;
        if (data === markerMatch) {
          parts.push({ type: CHILD_PART, index: nodeIndex });
        } else {
          let i21 = -1;
          while ((i21 = node.data.indexOf(marker, i21 + 1)) !== -1) {
            parts.push({ type: COMMENT_PART, index: nodeIndex });
            i21 += marker.length - 1;
          }
        }
      }
      nodeIndex++;
    }
    if (DEV_MODE2) {
      if (attrNames.length !== attrNameIndex) {
        throw new Error(`Detected duplicate attribute bindings. This occurs if your template has duplicate attributes on an element tag. For example "<input ?disabled=\${true} ?disabled=\${false}>" contains a duplicate "disabled" attribute. The error was detected in the following template: 
\`` + strings.join("${...}") + "`");
      }
    }
    debugLogEvent2 && debugLogEvent2({
      kind: "template prep",
      template: this,
      clonableTemplate: this.el,
      parts: this.parts,
      strings
    });
  }
  // Overridden via `litHtmlPolyfillSupport` to provide platform support.
  /** @nocollapse */
  static createElement(html2, _options) {
    const el = d.createElement("template");
    el.innerHTML = html2;
    return el;
  }
};
function resolveDirective(part, value, parent = part, attributeIndex) {
  if (value === noChange) {
    return value;
  }
  let currentDirective = attributeIndex !== void 0 ? parent.__directives?.[attributeIndex] : parent.__directive;
  const nextDirectiveConstructor = isPrimitive(value) ? void 0 : (
    // This property needs to remain unminified.
    value["_$litDirective$"]
  );
  if (currentDirective?.constructor !== nextDirectiveConstructor) {
    currentDirective?.["_$notifyDirectiveConnectionChanged"]?.(false);
    if (nextDirectiveConstructor === void 0) {
      currentDirective = void 0;
    } else {
      currentDirective = new nextDirectiveConstructor(part);
      currentDirective._$initialize(part, parent, attributeIndex);
    }
    if (attributeIndex !== void 0) {
      (parent.__directives ??= [])[attributeIndex] = currentDirective;
    } else {
      parent.__directive = currentDirective;
    }
  }
  if (currentDirective !== void 0) {
    value = resolveDirective(part, currentDirective._$resolve(part, value.values), currentDirective, attributeIndex);
  }
  return value;
}
var TemplateInstance = class {
  constructor(template, parent) {
    this._$parts = [];
    this._$disconnectableChildren = void 0;
    this._$template = template;
    this._$parent = parent;
  }
  // Called by ChildPart parentNode getter
  get parentNode() {
    return this._$parent.parentNode;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  // This method is separate from the constructor because we need to return a
  // DocumentFragment and we don't want to hold onto it with an instance field.
  _clone(options) {
    const { el: { content }, parts } = this._$template;
    const fragment = (options?.creationScope ?? d).importNode(content, true);
    walker.currentNode = fragment;
    let node = walker.nextNode();
    let nodeIndex = 0;
    let partIndex = 0;
    let templatePart = parts[0];
    while (templatePart !== void 0) {
      if (nodeIndex === templatePart.index) {
        let part;
        if (templatePart.type === CHILD_PART) {
          part = new ChildPart(node, node.nextSibling, this, options);
        } else if (templatePart.type === ATTRIBUTE_PART) {
          part = new templatePart.ctor(node, templatePart.name, templatePart.strings, this, options);
        } else if (templatePart.type === ELEMENT_PART) {
          part = new ElementPart(node, this, options);
        }
        this._$parts.push(part);
        templatePart = parts[++partIndex];
      }
      if (nodeIndex !== templatePart?.index) {
        node = walker.nextNode();
        nodeIndex++;
      }
    }
    walker.currentNode = d;
    return fragment;
  }
  _update(values) {
    let i21 = 0;
    for (const part of this._$parts) {
      if (part !== void 0) {
        debugLogEvent2 && debugLogEvent2({
          kind: "set part",
          part,
          value: values[i21],
          valueIndex: i21,
          values,
          templateInstance: this
        });
        if (part.strings !== void 0) {
          part._$setValue(values, part, i21);
          i21 += part.strings.length - 2;
        } else {
          part._$setValue(values[i21]);
        }
      }
      i21++;
    }
  }
};
var ChildPart = class _ChildPart {
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent?._$isConnected ?? this.__isConnected;
  }
  constructor(startNode, endNode, parent, options) {
    this.type = CHILD_PART;
    this._$committedValue = nothing;
    this._$disconnectableChildren = void 0;
    this._$startNode = startNode;
    this._$endNode = endNode;
    this._$parent = parent;
    this.options = options;
    this.__isConnected = options?.isConnected ?? true;
    if (ENABLE_EXTRA_SECURITY_HOOKS) {
      this._textSanitizer = void 0;
    }
  }
  /**
   * The parent node into which the part renders its content.
   *
   * A ChildPart's content consists of a range of adjacent child nodes of
   * `.parentNode`, possibly bordered by 'marker nodes' (`.startNode` and
   * `.endNode`).
   *
   * - If both `.startNode` and `.endNode` are non-null, then the part's content
   * consists of all siblings between `.startNode` and `.endNode`, exclusively.
   *
   * - If `.startNode` is non-null but `.endNode` is null, then the part's
   * content consists of all siblings following `.startNode`, up to and
   * including the last child of `.parentNode`. If `.endNode` is non-null, then
   * `.startNode` will always be non-null.
   *
   * - If both `.endNode` and `.startNode` are null, then the part's content
   * consists of all child nodes of `.parentNode`.
   */
  get parentNode() {
    let parentNode = wrap(this._$startNode).parentNode;
    const parent = this._$parent;
    if (parent !== void 0 && parentNode?.nodeType === 11) {
      parentNode = parent.parentNode;
    }
    return parentNode;
  }
  /**
   * The part's leading marker node, if any. See `.parentNode` for more
   * information.
   */
  get startNode() {
    return this._$startNode;
  }
  /**
   * The part's trailing marker node, if any. See `.parentNode` for more
   * information.
   */
  get endNode() {
    return this._$endNode;
  }
  _$setValue(value, directiveParent = this) {
    if (DEV_MODE2 && this.parentNode === null) {
      throw new Error(`This \`ChildPart\` has no \`parentNode\` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's \`innerHTML\` or \`textContent\` can do this.`);
    }
    value = resolveDirective(this, value, directiveParent);
    if (isPrimitive(value)) {
      if (value === nothing || value == null || value === "") {
        if (this._$committedValue !== nothing) {
          debugLogEvent2 && debugLogEvent2({
            kind: "commit nothing to child",
            start: this._$startNode,
            end: this._$endNode,
            parent: this._$parent,
            options: this.options
          });
          this._$clear();
        }
        this._$committedValue = nothing;
      } else if (value !== this._$committedValue && value !== noChange) {
        this._commitText(value);
      }
    } else if (value["_$litType$"] !== void 0) {
      this._commitTemplateResult(value);
    } else if (value.nodeType !== void 0) {
      if (DEV_MODE2 && this.options?.host === value) {
        this._commitText(`[probable mistake: rendered a template's host in itself (commonly caused by writing \${this} in a template]`);
        console.warn(`Attempted to render the template host`, value, `inside itself. This is almost always a mistake, and in dev mode `, `we render some warning text. In production however, we'll `, `render it, which will usually result in an error, and sometimes `, `in the element disappearing from the DOM.`);
        return;
      }
      this._commitNode(value);
    } else if (isIterable(value)) {
      this._commitIterable(value);
    } else {
      this._commitText(value);
    }
  }
  _insert(node) {
    return wrap(wrap(this._$startNode).parentNode).insertBefore(node, this._$endNode);
  }
  _commitNode(value) {
    if (this._$committedValue !== value) {
      this._$clear();
      if (ENABLE_EXTRA_SECURITY_HOOKS && sanitizerFactoryInternal !== noopSanitizer) {
        const parentNodeName = this._$startNode.parentNode?.nodeName;
        if (parentNodeName === "STYLE" || parentNodeName === "SCRIPT") {
          let message = "Forbidden";
          if (DEV_MODE2) {
            if (parentNodeName === "STYLE") {
              message = `Lit does not support binding inside style nodes. This is a security risk, as style injection attacks can exfiltrate data and spoof UIs. Consider instead using css\`...\` literals to compose styles, and do dynamic styling with css custom properties, ::parts, <slot>s, and by mutating the DOM rather than stylesheets.`;
            } else {
              message = `Lit does not support binding inside script nodes. This is a security risk, as it could allow arbitrary code execution.`;
            }
          }
          throw new Error(message);
        }
      }
      debugLogEvent2 && debugLogEvent2({
        kind: "commit node",
        start: this._$startNode,
        parent: this._$parent,
        value,
        options: this.options
      });
      this._$committedValue = this._insert(value);
    }
  }
  _commitText(value) {
    if (this._$committedValue !== nothing && isPrimitive(this._$committedValue)) {
      const node = wrap(this._$startNode).nextSibling;
      if (ENABLE_EXTRA_SECURITY_HOOKS) {
        if (this._textSanitizer === void 0) {
          this._textSanitizer = createSanitizer(node, "data", "property");
        }
        value = this._textSanitizer(value);
      }
      debugLogEvent2 && debugLogEvent2({
        kind: "commit text",
        node,
        value,
        options: this.options
      });
      node.data = value;
    } else {
      if (ENABLE_EXTRA_SECURITY_HOOKS) {
        const textNode = d.createTextNode("");
        this._commitNode(textNode);
        if (this._textSanitizer === void 0) {
          this._textSanitizer = createSanitizer(textNode, "data", "property");
        }
        value = this._textSanitizer(value);
        debugLogEvent2 && debugLogEvent2({
          kind: "commit text",
          node: textNode,
          value,
          options: this.options
        });
        textNode.data = value;
      } else {
        this._commitNode(d.createTextNode(value));
        debugLogEvent2 && debugLogEvent2({
          kind: "commit text",
          node: wrap(this._$startNode).nextSibling,
          value,
          options: this.options
        });
      }
    }
    this._$committedValue = value;
  }
  _commitTemplateResult(result) {
    const { values, ["_$litType$"]: type } = result;
    const template = typeof type === "number" ? this._$getTemplate(result) : (type.el === void 0 && (type.el = Template.createElement(trustFromTemplateString(type.h, type.h[0]), this.options)), type);
    if (this._$committedValue?._$template === template) {
      debugLogEvent2 && debugLogEvent2({
        kind: "template updating",
        template,
        instance: this._$committedValue,
        parts: this._$committedValue._$parts,
        options: this.options,
        values
      });
      this._$committedValue._update(values);
    } else {
      const instance = new TemplateInstance(template, this);
      const fragment = instance._clone(this.options);
      debugLogEvent2 && debugLogEvent2({
        kind: "template instantiated",
        template,
        instance,
        parts: instance._$parts,
        options: this.options,
        fragment,
        values
      });
      instance._update(values);
      debugLogEvent2 && debugLogEvent2({
        kind: "template instantiated and updated",
        template,
        instance,
        parts: instance._$parts,
        options: this.options,
        fragment,
        values
      });
      this._commitNode(fragment);
      this._$committedValue = instance;
    }
  }
  // Overridden via `litHtmlPolyfillSupport` to provide platform support.
  /** @internal */
  _$getTemplate(result) {
    let template = templateCache.get(result.strings);
    if (template === void 0) {
      templateCache.set(result.strings, template = new Template(result));
    }
    return template;
  }
  _commitIterable(value) {
    if (!isArray(this._$committedValue)) {
      this._$committedValue = [];
      this._$clear();
    }
    const itemParts = this._$committedValue;
    let partIndex = 0;
    let itemPart;
    for (const item of value) {
      if (partIndex === itemParts.length) {
        itemParts.push(itemPart = new _ChildPart(this._insert(createMarker()), this._insert(createMarker()), this, this.options));
      } else {
        itemPart = itemParts[partIndex];
      }
      itemPart._$setValue(item);
      partIndex++;
    }
    if (partIndex < itemParts.length) {
      this._$clear(itemPart && wrap(itemPart._$endNode).nextSibling, partIndex);
      itemParts.length = partIndex;
    }
  }
  /**
   * Removes the nodes contained within this Part from the DOM.
   *
   * @param start Start node to clear from, for clearing a subset of the part's
   *     DOM (used when truncating iterables)
   * @param from  When `start` is specified, the index within the iterable from
   *     which ChildParts are being removed, used for disconnecting directives
   *     in those Parts.
   *
   * @internal
   */
  _$clear(start = wrap(this._$startNode).nextSibling, from) {
    this._$notifyConnectionChanged?.(false, true, from);
    while (start !== this._$endNode) {
      const n13 = wrap(start).nextSibling;
      wrap(start).remove();
      start = n13;
    }
  }
  /**
   * Implementation of RootPart's `isConnected`. Note that this method
   * should only be called on `RootPart`s (the `ChildPart` returned from a
   * top-level `render()` call). It has no effect on non-root ChildParts.
   * @param isConnected Whether to set
   * @internal
   */
  setConnected(isConnected) {
    if (this._$parent === void 0) {
      this.__isConnected = isConnected;
      this._$notifyConnectionChanged?.(isConnected);
    } else if (DEV_MODE2) {
      throw new Error("part.setConnected() may only be called on a RootPart returned from render().");
    }
  }
};
var AttributePart = class {
  get tagName() {
    return this.element.tagName;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  constructor(element, name, strings, parent, options) {
    this.type = ATTRIBUTE_PART;
    this._$committedValue = nothing;
    this._$disconnectableChildren = void 0;
    this.element = element;
    this.name = name;
    this._$parent = parent;
    this.options = options;
    if (strings.length > 2 || strings[0] !== "" || strings[1] !== "") {
      this._$committedValue = new Array(strings.length - 1).fill(new String());
      this.strings = strings;
    } else {
      this._$committedValue = nothing;
    }
    if (ENABLE_EXTRA_SECURITY_HOOKS) {
      this._sanitizer = void 0;
    }
  }
  /**
   * Sets the value of this part by resolving the value from possibly multiple
   * values and static strings and committing it to the DOM.
   * If this part is single-valued, `this._strings` will be undefined, and the
   * method will be called with a single value argument. If this part is
   * multi-value, `this._strings` will be defined, and the method is called
   * with the value array of the part's owning TemplateInstance, and an offset
   * into the value array from which the values should be read.
   * This method is overloaded this way to eliminate short-lived array slices
   * of the template instance values, and allow a fast-path for single-valued
   * parts.
   *
   * @param value The part value, or an array of values for multi-valued parts
   * @param valueIndex the index to start reading values from. `undefined` for
   *   single-valued parts
   * @param noCommit causes the part to not commit its value to the DOM. Used
   *   in hydration to prime attribute parts with their first-rendered value,
   *   but not set the attribute, and in SSR to no-op the DOM operation and
   *   capture the value for serialization.
   *
   * @internal
   */
  _$setValue(value, directiveParent = this, valueIndex, noCommit) {
    const strings = this.strings;
    let change = false;
    if (strings === void 0) {
      value = resolveDirective(this, value, directiveParent, 0);
      change = !isPrimitive(value) || value !== this._$committedValue && value !== noChange;
      if (change) {
        this._$committedValue = value;
      }
    } else {
      const values = value;
      value = strings[0];
      let i21, v20;
      for (i21 = 0; i21 < strings.length - 1; i21++) {
        v20 = resolveDirective(this, values[valueIndex + i21], directiveParent, i21);
        if (v20 === noChange) {
          v20 = this._$committedValue[i21];
        }
        change ||= !isPrimitive(v20) || v20 !== this._$committedValue[i21];
        if (v20 === nothing) {
          value = nothing;
        } else if (value !== nothing) {
          value += (v20 ?? "") + strings[i21 + 1];
        }
        this._$committedValue[i21] = v20;
      }
    }
    if (change && !noCommit) {
      this._commitValue(value);
    }
  }
  /** @internal */
  _commitValue(value) {
    if (value === nothing) {
      wrap(this.element).removeAttribute(this.name);
    } else {
      if (ENABLE_EXTRA_SECURITY_HOOKS) {
        if (this._sanitizer === void 0) {
          this._sanitizer = sanitizerFactoryInternal(this.element, this.name, "attribute");
        }
        value = this._sanitizer(value ?? "");
      }
      debugLogEvent2 && debugLogEvent2({
        kind: "commit attribute",
        element: this.element,
        name: this.name,
        value,
        options: this.options
      });
      wrap(this.element).setAttribute(this.name, value ?? "");
    }
  }
};
var PropertyPart = class extends AttributePart {
  constructor() {
    super(...arguments);
    this.type = PROPERTY_PART;
  }
  /** @internal */
  _commitValue(value) {
    if (ENABLE_EXTRA_SECURITY_HOOKS) {
      if (this._sanitizer === void 0) {
        this._sanitizer = sanitizerFactoryInternal(this.element, this.name, "property");
      }
      value = this._sanitizer(value);
    }
    debugLogEvent2 && debugLogEvent2({
      kind: "commit property",
      element: this.element,
      name: this.name,
      value,
      options: this.options
    });
    this.element[this.name] = value === nothing ? void 0 : value;
  }
};
var BooleanAttributePart = class extends AttributePart {
  constructor() {
    super(...arguments);
    this.type = BOOLEAN_ATTRIBUTE_PART;
  }
  /** @internal */
  _commitValue(value) {
    debugLogEvent2 && debugLogEvent2({
      kind: "commit boolean attribute",
      element: this.element,
      name: this.name,
      value: !!(value && value !== nothing),
      options: this.options
    });
    wrap(this.element).toggleAttribute(this.name, !!value && value !== nothing);
  }
};
var EventPart = class extends AttributePart {
  constructor(element, name, strings, parent, options) {
    super(element, name, strings, parent, options);
    this.type = EVENT_PART;
    if (DEV_MODE2 && this.strings !== void 0) {
      throw new Error(`A \`<${element.localName}>\` has a \`@${name}=...\` listener with invalid content. Event listeners in templates must have exactly one expression and no surrounding text.`);
    }
  }
  // EventPart does not use the base _$setValue/_resolveValue implementation
  // since the dirty checking is more complex
  /** @internal */
  _$setValue(newListener, directiveParent = this) {
    newListener = resolveDirective(this, newListener, directiveParent, 0) ?? nothing;
    if (newListener === noChange) {
      return;
    }
    const oldListener = this._$committedValue;
    const shouldRemoveListener = newListener === nothing && oldListener !== nothing || newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive;
    const shouldAddListener = newListener !== nothing && (oldListener === nothing || shouldRemoveListener);
    debugLogEvent2 && debugLogEvent2({
      kind: "commit event listener",
      element: this.element,
      name: this.name,
      value: newListener,
      options: this.options,
      removeListener: shouldRemoveListener,
      addListener: shouldAddListener,
      oldListener
    });
    if (shouldRemoveListener) {
      this.element.removeEventListener(this.name, this, oldListener);
    }
    if (shouldAddListener) {
      this.element.addEventListener(this.name, this, newListener);
    }
    this._$committedValue = newListener;
  }
  handleEvent(event) {
    if (typeof this._$committedValue === "function") {
      this._$committedValue.call(this.options?.host ?? this.element, event);
    } else {
      this._$committedValue.handleEvent(event);
    }
  }
};
var ElementPart = class {
  constructor(element, parent, options) {
    this.element = element;
    this.type = ELEMENT_PART;
    this._$disconnectableChildren = void 0;
    this._$parent = parent;
    this.options = options;
  }
  // See comment in Disconnectable interface for why this is a getter
  get _$isConnected() {
    return this._$parent._$isConnected;
  }
  _$setValue(value) {
    debugLogEvent2 && debugLogEvent2({
      kind: "commit to element binding",
      element: this.element,
      value,
      options: this.options
    });
    resolveDirective(this, value);
  }
};
var polyfillSupport2 = DEV_MODE2 ? global3.litHtmlPolyfillSupportDevMode : global3.litHtmlPolyfillSupport;
polyfillSupport2?.(Template, ChildPart);
(global3.litHtmlVersions ??= []).push("3.3.3");
if (DEV_MODE2 && global3.litHtmlVersions.length > 1) {
  queueMicrotask(() => {
    issueWarning2("multiple-versions", `Multiple versions of Lit loaded. Loading multiple versions is not recommended.`);
  });
}
var render = (value, container, options) => {
  if (DEV_MODE2 && container == null) {
    throw new TypeError(`The container to render into may not be ${container}`);
  }
  const renderId = DEV_MODE2 ? debugLogRenderId++ : 0;
  const partOwnerNode = options?.renderBefore ?? container;
  let part = partOwnerNode["_$litPart$"];
  debugLogEvent2 && debugLogEvent2({
    kind: "begin render",
    id: renderId,
    value,
    container,
    options,
    part
  });
  if (part === void 0) {
    const endNode = options?.renderBefore ?? null;
    partOwnerNode["_$litPart$"] = part = new ChildPart(container.insertBefore(createMarker(), endNode), endNode, void 0, options ?? {});
  }
  part._$setValue(value);
  debugLogEvent2 && debugLogEvent2({
    kind: "end render",
    id: renderId,
    value,
    container,
    options,
    part
  });
  return part;
};
if (ENABLE_EXTRA_SECURITY_HOOKS) {
  render.setSanitizer = setSanitizer;
  render.createSanitizer = createSanitizer;
  if (DEV_MODE2) {
    render._testOnlyClearSanitizerFactoryDoNotCallOrElse = _testOnlyClearSanitizerFactoryDoNotCallOrElse;
  }
}

// ../../../node_modules/lit-element/development/lit-element.js
var JSCompiler_renameProperty2 = (prop, _obj) => prop;
var DEV_MODE3 = true;
var global4 = globalThis;
var issueWarning3;
if (DEV_MODE3) {
  global4.litIssuedWarnings ??= /* @__PURE__ */ new Set();
  issueWarning3 = (code, warning) => {
    warning += ` See https://lit.dev/msg/${code} for more information.`;
    if (!global4.litIssuedWarnings.has(warning) && !global4.litIssuedWarnings.has(code)) {
      console.warn(warning);
      global4.litIssuedWarnings.add(warning);
    }
  };
}
var LitElement = class extends ReactiveElement {
  constructor() {
    super(...arguments);
    this.renderOptions = { host: this };
    this.__childPart = void 0;
  }
  /**
   * @category rendering
   */
  createRenderRoot() {
    const renderRoot = super.createRenderRoot();
    this.renderOptions.renderBefore ??= renderRoot.firstChild;
    return renderRoot;
  }
  /**
   * Updates the element. This method reflects property values to attributes
   * and calls `render` to render DOM via lit-html. Setting properties inside
   * this method will *not* trigger another update.
   * @param changedProperties Map of changed properties with old values
   * @category updates
   */
  update(changedProperties) {
    const value = this.render();
    if (!this.hasUpdated) {
      this.renderOptions.isConnected = this.isConnected;
    }
    super.update(changedProperties);
    this.__childPart = render(value, this.renderRoot, this.renderOptions);
  }
  /**
   * Invoked when the component is added to the document's DOM.
   *
   * In `connectedCallback()` you should setup tasks that should only occur when
   * the element is connected to the document. The most common of these is
   * adding event listeners to nodes external to the element, like a keydown
   * event handler added to the window.
   *
   * ```ts
   * connectedCallback() {
   *   super.connectedCallback();
   *   addEventListener('keydown', this._handleKeydown);
   * }
   * ```
   *
   * Typically, anything done in `connectedCallback()` should be undone when the
   * element is disconnected, in `disconnectedCallback()`.
   *
   * @category lifecycle
   */
  connectedCallback() {
    super.connectedCallback();
    this.__childPart?.setConnected(true);
  }
  /**
   * Invoked when the component is removed from the document's DOM.
   *
   * This callback is the main signal to the element that it may no longer be
   * used. `disconnectedCallback()` should ensure that nothing is holding a
   * reference to the element (such as event listeners added to nodes external
   * to the element), so that it is free to be garbage collected.
   *
   * ```ts
   * disconnectedCallback() {
   *   super.disconnectedCallback();
   *   window.removeEventListener('keydown', this._handleKeydown);
   * }
   * ```
   *
   * An element may be re-connected after being disconnected.
   *
   * @category lifecycle
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.__childPart?.setConnected(false);
  }
  /**
   * Invoked on each update to perform rendering tasks. This method may return
   * any value renderable by lit-html's `ChildPart` - typically a
   * `TemplateResult`. Setting properties inside this method will *not* trigger
   * the element to update.
   * @category rendering
   */
  render() {
    return noChange;
  }
};
LitElement["_$litElement$"] = true;
LitElement[JSCompiler_renameProperty2("finalized", LitElement)] = true;
global4.litElementHydrateSupport?.({ LitElement });
var polyfillSupport3 = DEV_MODE3 ? global4.litElementPolyfillSupportDevMode : global4.litElementPolyfillSupport;
polyfillSupport3?.({ LitElement });
(global4.litElementVersions ??= []).push("4.2.2");
if (DEV_MODE3 && global4.litElementVersions.length > 1) {
  queueMicrotask(() => {
    issueWarning3("multiple-versions", `Multiple versions of Lit loaded. Loading multiple versions is not recommended.`);
  });
}

// ../../../node_modules/@lit/reactive-element/development/decorators/property.js
var DEV_MODE4 = true;
var issueWarning4;
if (DEV_MODE4) {
  globalThis.litIssuedWarnings ??= /* @__PURE__ */ new Set();
  issueWarning4 = (code, warning) => {
    warning += ` See https://lit.dev/msg/${code} for more information.`;
    if (!globalThis.litIssuedWarnings.has(warning) && !globalThis.litIssuedWarnings.has(code)) {
      console.warn(warning);
      globalThis.litIssuedWarnings.add(warning);
    }
  };
}
var legacyProperty = (options, proto, name) => {
  const hasOwnProperty = proto.hasOwnProperty(name);
  proto.constructor.createProperty(name, options);
  return hasOwnProperty ? Object.getOwnPropertyDescriptor(proto, name) : void 0;
};
var defaultPropertyDeclaration2 = {
  attribute: true,
  type: String,
  converter: defaultConverter,
  reflect: false,
  hasChanged: notEqual
};
var standardProperty = (options = defaultPropertyDeclaration2, target, context) => {
  const { kind, metadata } = context;
  if (DEV_MODE4 && metadata == null) {
    issueWarning4("missing-class-metadata", `The class ${target} is missing decorator metadata. This could mean that you're using a compiler that supports decorators but doesn't support decorator metadata, such as TypeScript 5.1. Please update your compiler.`);
  }
  let properties = globalThis.litPropertyMetadata.get(metadata);
  if (properties === void 0) {
    globalThis.litPropertyMetadata.set(metadata, properties = /* @__PURE__ */ new Map());
  }
  if (kind === "setter") {
    options = Object.create(options);
    options.wrapped = true;
  }
  properties.set(context.name, options);
  if (kind === "accessor") {
    const { name } = context;
    return {
      set(v20) {
        const oldValue = target.get.call(this);
        target.set.call(this, v20);
        this.requestUpdate(name, oldValue, options, true, v20);
      },
      init(v20) {
        if (v20 !== void 0) {
          this._$changeProperty(name, void 0, options, v20);
        }
        return v20;
      }
    };
  } else if (kind === "setter") {
    const { name } = context;
    return function(value) {
      const oldValue = this[name];
      target.call(this, value);
      this.requestUpdate(name, oldValue, options, true, value);
    };
  }
  throw new Error(`Unsupported decorator location: ${kind}`);
};
function property(options) {
  return (protoOrTarget, nameOrContext) => {
    return typeof nameOrContext === "object" ? standardProperty(options, protoOrTarget, nameOrContext) : legacyProperty(options, protoOrTarget, nameOrContext);
  };
}

// ../../../node_modules/@lit/reactive-element/development/decorators/state.js
function state(options) {
  return property(__spreadProps(__spreadValues({}, options), {
    // Add both `state` and `attribute` because we found a third party
    // controller that is keying off of PropertyOptions.state to determine
    // whether a field is a private internal property or not.
    state: true,
    attribute: false
  }));
}

// ../../../node_modules/@lit/reactive-element/development/decorators/base.js
var desc = (obj, name, descriptor) => {
  descriptor.configurable = true;
  descriptor.enumerable = true;
  if (
    // We check for Reflect.decorate each time, in case the zombiefill
    // is applied via lazy loading some Angular code.
    Reflect.decorate && typeof name !== "object"
  ) {
    Object.defineProperty(obj, name, descriptor);
  }
  return descriptor;
};

// ../../../node_modules/@lit/reactive-element/development/decorators/query.js
var DEV_MODE5 = true;
var issueWarning5;
if (DEV_MODE5) {
  globalThis.litIssuedWarnings ??= /* @__PURE__ */ new Set();
  issueWarning5 = (code, warning) => {
    warning += code ? ` See https://lit.dev/msg/${code} for more information.` : "";
    if (!globalThis.litIssuedWarnings.has(warning) && !globalThis.litIssuedWarnings.has(code)) {
      console.warn(warning);
      globalThis.litIssuedWarnings.add(warning);
    }
  };
}
function query(selector, cache) {
  return ((protoOrTarget, nameOrContext, descriptor) => {
    const doQuery = (el) => {
      const result = el.renderRoot?.querySelector(selector) ?? null;
      if (DEV_MODE5 && result === null && cache && !el.hasUpdated) {
        const name = typeof nameOrContext === "object" ? nameOrContext.name : nameOrContext;
        issueWarning5("", `@query'd field ${JSON.stringify(String(name))} with the 'cache' flag set for selector '${selector}' has been accessed before the first update and returned null. This is expected if the renderRoot tree has not been provided beforehand (e.g. via Declarative Shadow DOM). Therefore the value hasn't been cached.`);
      }
      return result;
    };
    if (cache) {
      const { get, set } = typeof nameOrContext === "object" ? protoOrTarget : descriptor ?? (() => {
        const key = DEV_MODE5 ? /* @__PURE__ */ Symbol(`${String(nameOrContext)} (@query() cache)`) : /* @__PURE__ */ Symbol();
        return {
          get() {
            return this[key];
          },
          set(v20) {
            this[key] = v20;
          }
        };
      })();
      return desc(protoOrTarget, nameOrContext, {
        get() {
          let result = get.call(this);
          if (result === void 0) {
            result = doQuery(this);
            if (result !== null || this.hasUpdated) {
              set.call(this, result);
            }
          }
          return result;
        }
      });
    } else {
      return desc(protoOrTarget, nameOrContext, {
        get() {
          return doQuery(this);
        }
      });
    }
  });
}

// ../../nys-icon/dist/nys-icon.js
var jn = 0;
function Xn(i21) {
  return `${i21}-${Date.now()}-${jn++}`;
}
var Vn = (i21) => {
  class n13 extends i21 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = Xn(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return n13;
};
var qn = Vn(LitElement);
var Ot = globalThis.__nysIconRegistry ??= /* @__PURE__ */ new Map();
var mt = globalThis.__nysIconWatchers ??= /* @__PURE__ */ new Map();
var oe = null;
var Be = null;
async function Kn() {
  return oe || (Be ??= import("./nys-icon.library-DHBltclg-XIZ5WYDD.js").then(
    (i21) => oe = i21.default
  ), Be);
}
function Zn() {
  if (globalThis.__nysIconDefaultRegistered || Ot.has("default")) {
    globalThis.__nysIconDefaultRegistered = true;
    return;
  }
  globalThis.__nysIconDefaultRegistered = true, Ot.set("default", {
    resolver: async (i21) => {
      if (!i21) return;
      const s13 = (await Kn())[i21];
      return s13 ? { type: "svg", content: s13 } : void 0;
    }
  });
}
function Jn(i21) {
  return Zn(), Ot.get(i21);
}
function We(i21, n13) {
  mt.has(i21) || mt.set(i21, /* @__PURE__ */ new Set()), mt.get(i21).add(n13);
}
function Ye(i21, n13) {
  mt.get(i21)?.delete(n13);
}
function $e(i21, n13) {
  (n13 == null || n13 > i21.length) && (n13 = i21.length);
  for (var s13 = 0, l17 = Array(n13); s13 < n13; s13++) l17[s13] = i21[s13];
  return l17;
}
function Qn(i21) {
  if (Array.isArray(i21)) return i21;
}
function ti(i21, n13) {
  var s13 = i21 == null ? null : typeof Symbol < "u" && i21[Symbol.iterator] || i21["@@iterator"];
  if (s13 != null) {
    var l17, u17, m32, A6, dt2 = [], M5 = true, ht2 = false;
    try {
      if (m32 = (s13 = s13.call(i21)).next, n13 !== 0) for (; !(M5 = (l17 = m32.call(s13)).done) && (dt2.push(l17.value), dt2.length !== n13); M5 = true) ;
    } catch (kt2) {
      ht2 = true, u17 = kt2;
    } finally {
      try {
        if (!M5 && s13.return != null && (A6 = s13.return(), Object(A6) !== A6)) return;
      } finally {
        if (ht2) throw u17;
      }
    }
    return dt2;
  }
}
function ei() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ni(i21, n13) {
  return Qn(i21) || ti(i21, n13) || ii(i21, n13) || ei();
}
function ii(i21, n13) {
  if (i21) {
    if (typeof i21 == "string") return $e(i21, n13);
    var s13 = {}.toString.call(i21).slice(8, -1);
    return s13 === "Object" && i21.constructor && (s13 = i21.constructor.name), s13 === "Map" || s13 === "Set" ? Array.from(i21) : s13 === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(s13) ? $e(i21, n13) : void 0;
  }
}
var ln = Object.entries;
var je = Object.setPrototypeOf;
var oi = Object.isFrozen;
var ri = Object.getPrototypeOf;
var si = Object.getOwnPropertyDescriptor;
var O = Object.freeze;
var w = Object.seal;
var pt = Object.create;
var cn = typeof Reflect < "u" && Reflect;
var ue = cn.apply;
var fe = cn.construct;
O || (O = function(n13) {
  return n13;
});
w || (w = function(n13) {
  return n13;
});
ue || (ue = function(n13, s13) {
  for (var l17 = arguments.length, u17 = new Array(l17 > 2 ? l17 - 2 : 0), m32 = 2; m32 < l17; m32++)
    u17[m32 - 2] = arguments[m32];
  return n13.apply(s13, u17);
});
fe || (fe = function(n13) {
  for (var s13 = arguments.length, l17 = new Array(s13 > 1 ? s13 - 1 : 0), u17 = 1; u17 < s13; u17++)
    l17[u17 - 1] = arguments[u17];
  return new n13(...l17);
});
var ut = E(Array.prototype.forEach);
var ai = E(Array.prototype.lastIndexOf);
var Xe = E(Array.prototype.pop);
var ft = E(Array.prototype.push);
var li = E(Array.prototype.splice);
var X = Array.isArray;
var bt = E(String.prototype.toLowerCase);
var re = E(String.prototype.toString);
var Ve = E(String.prototype.match);
var Et = E(String.prototype.replace);
var qe = E(String.prototype.indexOf);
var ci = E(String.prototype.trim);
var ui = E(Number.prototype.toString);
var fi = E(Boolean.prototype.toString);
var Ke = typeof BigInt > "u" ? null : E(BigInt.prototype.toString);
var Ze = typeof Symbol > "u" ? null : E(Symbol.prototype.toString);
var S = E(Object.prototype.hasOwnProperty);
var At = E(Object.prototype.toString);
var b = E(RegExp.prototype.test);
var et = pi(TypeError);
function E(i21) {
  return function(n13) {
    n13 instanceof RegExp && (n13.lastIndex = 0);
    for (var s13 = arguments.length, l17 = new Array(s13 > 1 ? s13 - 1 : 0), u17 = 1; u17 < s13; u17++)
      l17[u17 - 1] = arguments[u17];
    return ue(i21, n13, l17);
  };
}
function pi(i21) {
  return function() {
    for (var n13 = arguments.length, s13 = new Array(n13), l17 = 0; l17 < n13; l17++)
      s13[l17] = arguments[l17];
    return fe(i21, s13);
  };
}
function p(i21, n13) {
  let s13 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : bt;
  if (je && je(i21, null), !X(n13))
    return i21;
  let l17 = n13.length;
  for (; l17--; ) {
    let u17 = n13[l17];
    if (typeof u17 == "string") {
      const m32 = s13(u17);
      m32 !== u17 && (oi(n13) || (n13[l17] = m32), u17 = m32);
    }
    i21[u17] = true;
  }
  return i21;
}
function mi(i21) {
  for (let n13 = 0; n13 < i21.length; n13++)
    S(i21, n13) || (i21[n13] = null);
  return i21;
}
function L(i21) {
  const n13 = pt(null);
  for (const l17 of ln(i21)) {
    var s13 = ni(l17, 2);
    const u17 = s13[0], m32 = s13[1];
    S(i21, u17) && (X(m32) ? n13[u17] = mi(m32) : m32 && typeof m32 == "object" && m32.constructor === Object ? n13[u17] = L(m32) : n13[u17] = m32);
  }
  return n13;
}
function di(i21) {
  switch (typeof i21) {
    case "string":
      return i21;
    case "number":
      return ui(i21);
    case "boolean":
      return fi(i21);
    case "bigint":
      return Ke ? Ke(i21) : "0";
    case "symbol":
      return Ze ? Ze(i21) : "Symbol()";
    case "undefined":
      return At(i21);
    case "function":
    case "object": {
      if (i21 === null)
        return At(i21);
      const n13 = i21, s13 = H(n13, "toString");
      if (typeof s13 == "function") {
        const l17 = s13(n13);
        return typeof l17 == "string" ? l17 : At(l17);
      }
      return At(i21);
    }
    default:
      return At(i21);
  }
}
function H(i21, n13) {
  for (; i21 !== null; ) {
    const l17 = si(i21, n13);
    if (l17) {
      if (l17.get)
        return E(l17.get);
      if (typeof l17.value == "function")
        return E(l17.value);
    }
    i21 = ri(i21);
  }
  function s13() {
    return null;
  }
  return s13;
}
function hi(i21) {
  try {
    return b(i21, ""), true;
  } catch {
    return false;
  }
}
var Je = O(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
var se = O(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]);
var ae = O(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
var _i = O(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]);
var le = O(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]);
var Ti = O(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]);
var Qe = O(["#text"]);
var tn = O(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "command", "commandfor", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns"]);
var ce = O(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dominant-baseline", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-orientation", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
var en = O(["accent", "accentunder", "align", "bevelled", "close", "columnalign", "columnlines", "columnspacing", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lquote", "lspace", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
var xt = O(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
var gi = w(/{{[\w\W]*|^[\w\W]*}}/g);
var yi = w(/<%[\w\W]*|^[\w\W]*%>/g);
var Ei = w(/\${[\w\W]*/g);
var Ai = w(/^data-[\-\w.\u00B7-\uFFFF]+$/);
var bi = w(/^aria-[\-\w]+$/);
var nn = w(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
);
var Si = w(/^(?:\w+script|data):/i);
var Oi = w(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
);
var wi = w(/^html$/i);
var Ri = w(/^[a-z][.\w]*(-[.\w]+)+$/i);
var on = w(/<[/\w!]/g);
var rn = w(/<[/\w]/g);
var Ii = w(/<\/no(script|embed|frames)/i);
var Ni = w(/\/>/i);
var v = {
  element: 1,
  attribute: 2,
  text: 3,
  cdataSection: 4,
  entityReference: 5,
  // Deprecated
  entityNode: 6,
  // Deprecated
  processingInstruction: 7,
  comment: 8,
  document: 9,
  documentType: 10,
  documentFragment: 11,
  notation: 12
  // Deprecated
};
var Li = function() {
  return typeof window > "u" ? null : window;
};
var Di = function(n13, s13) {
  if (typeof n13 != "object" || typeof n13.createPolicy != "function")
    return null;
  let l17 = null;
  const u17 = "data-tt-policy-suffix";
  s13 && s13.hasAttribute(u17) && (l17 = s13.getAttribute(u17));
  const m32 = "dompurify" + (l17 ? "#" + l17 : "");
  try {
    return n13.createPolicy(m32, {
      createHTML(A6) {
        return A6;
      },
      createScriptURL(A6) {
        return A6;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + m32 + " could not be created."), null;
  }
};
var sn = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
var j = function(n13, s13, l17, u17) {
  return S(n13, s13) && X(n13[s13]) ? p(u17.base ? L(u17.base) : {}, n13[s13], u17.transform) : l17;
};
function un() {
  let i21 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Li();
  const n13 = (r13) => un(r13);
  if (n13.version = "3.4.12", n13.removed = [], !i21 || !i21.document || i21.document.nodeType !== v.document || !i21.Element)
    return n13.isSupported = false, n13;
  let s13 = i21.document;
  const l17 = s13, u17 = l17.currentScript;
  i21.DocumentFragment;
  const m32 = i21.HTMLTemplateElement, A6 = i21.Node, dt2 = i21.Element, M5 = i21.NodeFilter, ht2 = i21.NamedNodeMap;
  ht2 === void 0 && (i21.NamedNodeMap || i21.MozNamedAttrMap), i21.HTMLFormElement;
  const kt2 = i21.DOMParser, wt2 = i21.trustedTypes, K2 = dt2.prototype, pn = H(K2, "cloneNode"), zt2 = H(K2, "remove"), mn = H(K2, "nextSibling"), it2 = H(K2, "childNodes"), Z2 = H(K2, "parentNode"), me = H(K2, "shadowRoot"), Ft2 = H(K2, "attributes"), I6 = A6 && A6.prototype ? H(A6.prototype, "nodeType") : null, k17 = A6 && A6.prototype ? H(A6.prototype, "nodeName") : null;
  if (typeof m32 == "function") {
    const r13 = s13.createElement("template");
    r13.content && r13.content.ownerDocument && (s13 = r13.content.ownerDocument);
  }
  let D5, J2 = "", Ut2, de2 = false, _t2 = 0;
  const he2 = function() {
    if (_t2 > 0)
      throw et('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, ot2 = function(t11) {
    he2(), _t2++;
    try {
      return D5.createHTML(t11);
    } finally {
      _t2--;
    }
  }, dn = function(t11) {
    he2(), _t2++;
    try {
      return D5.createScriptURL(t11);
    } finally {
      _t2--;
    }
  }, hn = function() {
    return de2 || (Ut2 = Di(wt2, u17), de2 = true), Ut2;
  }, Rt2 = s13, Ht2 = Rt2.implementation, _e2 = Rt2.createNodeIterator, _n = Rt2.createDocumentFragment, Tn = Rt2.getElementsByTagName, gn = l17.importNode;
  let h23 = sn();
  n13.isSupported = typeof ln == "function" && typeof Z2 == "function" && Ht2 && Ht2.createHTMLDocument !== void 0;
  const yn = gi, En = yi, An = Ei, bn = Ai, Sn = bi, On = Si, Te2 = Oi, wn = Ri;
  let ge2 = nn, _17 = null;
  const ye2 = p({}, [...Je, ...se, ...ae, ...le, ...Qe]);
  let T4 = null;
  const Ee2 = p({}, [...tn, ...ce, ...en, ...xt]);
  let g13 = Object.seal(pt(null, {
    tagNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: false
    }
  })), Tt2 = null, Ae2 = null;
  const B5 = Object.seal(pt(null, {
    tagCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    }
  }));
  let be2 = true, Gt2 = true, Se2 = false, Oe2 = true, W2 = false, Y2 = true, Q3 = false, Bt2 = false, Wt2 = null, Yt2 = null, $t2 = false, rt2 = false, It2 = false, Nt2 = false, we2 = true, Re2 = false;
  const Ie2 = "user-content-";
  let jt2 = true, Xt2 = false, st2 = {}, z8 = null;
  const Vt2 = p({}, [
    "annotation-xml",
    "audio",
    "colgroup",
    "desc",
    "foreignobject",
    "head",
    "iframe",
    "math",
    "mi",
    "mn",
    "mo",
    "ms",
    "mtext",
    "noembed",
    "noframes",
    "noscript",
    "plaintext",
    "script",
    // <selectedcontent> mirrors the selected <option>'s subtree, cloned by
    // the UA (customizable <select>) — including any on* handlers — and the
    // engine re-mirrors synchronously whenever a removal changes which
    // option/selectedcontent is current, even inside DOMPurify's inert
    // DOMParser document. Hoisting its children on removal re-inserts a fresh
    // mirror target ahead of the walk, which the engine refills, looping
    // forever (DoS) and amplifying output. Dropping its content on removal
    // (rather than hoisting) breaks that cascade; the content is a duplicate
    // of the option, which is sanitized on its own. See campaign-3 F1/F6.
    "selectedcontent",
    "style",
    "svg",
    "template",
    "thead",
    "title",
    "video",
    "xmp"
  ]);
  let Ne2 = null;
  const Le2 = p({}, ["audio", "video", "img", "source", "image", "track"]);
  let qt2 = null;
  const De2 = p({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Lt2 = "http://www.w3.org/1998/Math/MathML", Dt2 = "http://www.w3.org/2000/svg", F3 = "http://www.w3.org/1999/xhtml";
  let at2 = F3, Kt2 = false, Zt = null;
  const Rn = p({}, [Lt2, Dt2, F3], re), Ce2 = O(["mi", "mo", "mn", "ms", "mtext"]);
  let Jt2 = p({}, Ce2);
  const Me2 = O(["annotation-xml"]);
  let Qt2 = p({}, Me2);
  const In = p({}, ["title", "style", "font", "a", "script"]);
  let gt2 = null;
  const Nn = ["application/xhtml+xml", "text/html"], Ln = "text/html";
  let d21 = null, lt2 = null;
  const Dn = s13.createElement("form"), ve2 = function(t11) {
    return t11 instanceof RegExp || t11 instanceof Function;
  }, te2 = function() {
    let t11 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (lt2 && lt2 === t11)
      return;
    (!t11 || typeof t11 != "object") && (t11 = {}), t11 = L(t11), gt2 = // eslint-disable-next-line unicorn/prefer-includes
    Nn.indexOf(t11.PARSER_MEDIA_TYPE) === -1 ? Ln : t11.PARSER_MEDIA_TYPE, d21 = gt2 === "application/xhtml+xml" ? re : bt, _17 = j(t11, "ALLOWED_TAGS", ye2, {
      transform: d21
    }), T4 = j(t11, "ALLOWED_ATTR", Ee2, {
      transform: d21
    }), Zt = j(t11, "ALLOWED_NAMESPACES", Rn, {
      transform: re
    }), qt2 = j(t11, "ADD_URI_SAFE_ATTR", De2, {
      transform: d21,
      base: De2
    }), Ne2 = j(t11, "ADD_DATA_URI_TAGS", Le2, {
      transform: d21,
      base: Le2
    }), z8 = j(t11, "FORBID_CONTENTS", Vt2, {
      transform: d21
    }), Tt2 = j(t11, "FORBID_TAGS", L({}), {
      transform: d21
    }), Ae2 = j(t11, "FORBID_ATTR", L({}), {
      transform: d21
    }), st2 = S(t11, "USE_PROFILES") ? t11.USE_PROFILES && typeof t11.USE_PROFILES == "object" ? L(t11.USE_PROFILES) : t11.USE_PROFILES : false, be2 = t11.ALLOW_ARIA_ATTR !== false, Gt2 = t11.ALLOW_DATA_ATTR !== false, Se2 = t11.ALLOW_UNKNOWN_PROTOCOLS || false, Oe2 = t11.ALLOW_SELF_CLOSE_IN_ATTR !== false, W2 = t11.SAFE_FOR_TEMPLATES || false, Y2 = t11.SAFE_FOR_XML !== false, Q3 = t11.WHOLE_DOCUMENT || false, rt2 = t11.RETURN_DOM || false, It2 = t11.RETURN_DOM_FRAGMENT || false, Nt2 = t11.RETURN_TRUSTED_TYPE || false, $t2 = t11.FORCE_BODY || false, we2 = t11.SANITIZE_DOM !== false, Re2 = t11.SANITIZE_NAMED_PROPS || false, jt2 = t11.KEEP_CONTENT !== false, Xt2 = t11.IN_PLACE || false, ge2 = hi(t11.ALLOWED_URI_REGEXP) ? t11.ALLOWED_URI_REGEXP : nn, at2 = typeof t11.NAMESPACE == "string" ? t11.NAMESPACE : F3, Jt2 = S(t11, "MATHML_TEXT_INTEGRATION_POINTS") && t11.MATHML_TEXT_INTEGRATION_POINTS && typeof t11.MATHML_TEXT_INTEGRATION_POINTS == "object" ? L(t11.MATHML_TEXT_INTEGRATION_POINTS) : p({}, Ce2), Qt2 = S(t11, "HTML_INTEGRATION_POINTS") && t11.HTML_INTEGRATION_POINTS && typeof t11.HTML_INTEGRATION_POINTS == "object" ? L(t11.HTML_INTEGRATION_POINTS) : p({}, Me2);
    const e5 = S(t11, "CUSTOM_ELEMENT_HANDLING") && t11.CUSTOM_ELEMENT_HANDLING && typeof t11.CUSTOM_ELEMENT_HANDLING == "object" ? L(t11.CUSTOM_ELEMENT_HANDLING) : pt(null);
    if (g13 = pt(null), S(e5, "tagNameCheck") && ve2(e5.tagNameCheck) && (g13.tagNameCheck = e5.tagNameCheck), S(e5, "attributeNameCheck") && ve2(e5.attributeNameCheck) && (g13.attributeNameCheck = e5.attributeNameCheck), S(e5, "allowCustomizedBuiltInElements") && typeof e5.allowCustomizedBuiltInElements == "boolean" && (g13.allowCustomizedBuiltInElements = e5.allowCustomizedBuiltInElements), w(g13), W2 && (Gt2 = false), It2 && (rt2 = true), st2 && (_17 = p({}, Qe), T4 = pt(null), st2.html === true && (p(_17, Je), p(T4, tn)), st2.svg === true && (p(_17, se), p(T4, ce), p(T4, xt)), st2.svgFilters === true && (p(_17, ae), p(T4, ce), p(T4, xt)), st2.mathMl === true && (p(_17, le), p(T4, en), p(T4, xt))), B5.tagCheck = null, B5.attributeCheck = null, S(t11, "ADD_TAGS") && (typeof t11.ADD_TAGS == "function" ? B5.tagCheck = t11.ADD_TAGS : X(t11.ADD_TAGS) && (_17 === ye2 && (_17 = L(_17)), p(_17, t11.ADD_TAGS, d21))), S(t11, "ADD_ATTR") && (typeof t11.ADD_ATTR == "function" ? B5.attributeCheck = t11.ADD_ATTR : X(t11.ADD_ATTR) && (T4 === Ee2 && (T4 = L(T4)), p(T4, t11.ADD_ATTR, d21))), S(t11, "ADD_URI_SAFE_ATTR") && X(t11.ADD_URI_SAFE_ATTR) && p(qt2, t11.ADD_URI_SAFE_ATTR, d21), S(t11, "FORBID_CONTENTS") && X(t11.FORBID_CONTENTS) && (z8 === Vt2 && (z8 = L(z8)), p(z8, t11.FORBID_CONTENTS, d21)), S(t11, "ADD_FORBID_CONTENTS") && X(t11.ADD_FORBID_CONTENTS) && (z8 === Vt2 && (z8 = L(z8)), p(z8, t11.ADD_FORBID_CONTENTS, d21)), jt2 && (_17["#text"] = true), Q3 && p(_17, ["html", "head", "body"]), _17.table && (p(_17, ["tbody"]), delete Tt2.tbody), t11.TRUSTED_TYPES_POLICY) {
      if (typeof t11.TRUSTED_TYPES_POLICY.createHTML != "function")
        throw et('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof t11.TRUSTED_TYPES_POLICY.createScriptURL != "function")
        throw et('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const o18 = D5;
      D5 = t11.TRUSTED_TYPES_POLICY;
      try {
        J2 = ot2("");
      } catch (a12) {
        throw D5 = o18, a12;
      }
    } else t11.TRUSTED_TYPES_POLICY === null ? (D5 = void 0, J2 = "") : (D5 === void 0 && (D5 = hn()), D5 && typeof J2 == "string" && (J2 = ot2("")));
    O && O(t11), lt2 = t11;
  }, Pe2 = p({}, [...se, ...ae, ..._i]), xe2 = p({}, [...le, ...Ti]), Cn = function(t11, e5, o18) {
    return e5.namespaceURI === F3 ? t11 === "svg" : e5.namespaceURI === Lt2 ? t11 === "svg" && (o18 === "annotation-xml" || Jt2[o18]) : !!Pe2[t11];
  }, Mn = function(t11, e5, o18) {
    return e5.namespaceURI === F3 ? t11 === "math" : e5.namespaceURI === Dt2 ? t11 === "math" && Qt2[o18] : !!xe2[t11];
  }, vn = function(t11, e5, o18) {
    return e5.namespaceURI === Dt2 && !Qt2[o18] || e5.namespaceURI === Lt2 && !Jt2[o18] ? false : !xe2[t11] && (In[t11] || !Pe2[t11]);
  }, Pn = function(t11) {
    let e5 = Z2(t11);
    (!e5 || !e5.tagName) && (e5 = {
      namespaceURI: at2,
      tagName: "template"
    });
    const o18 = bt(t11.tagName), a12 = bt(e5.tagName);
    return Zt[t11.namespaceURI] ? t11.namespaceURI === Dt2 ? Cn(o18, e5, a12) : t11.namespaceURI === Lt2 ? Mn(o18, e5, a12) : t11.namespaceURI === F3 ? vn(o18, e5, a12) : !!(gt2 === "application/xhtml+xml" && Zt[t11.namespaceURI]) : false;
  }, $15 = function(t11) {
    ft(n13.removed, {
      element: t11
    });
    try {
      Z2(t11).removeChild(t11);
    } catch {
      if (zt2(t11), !Z2(t11))
        throw et("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, Ct2 = function(t11) {
    ee2(t11);
    const e5 = it2(t11);
    if (e5) {
      const a12 = [];
      ut(e5, (c21) => {
        ft(a12, c21);
      }), ut(a12, (c21) => {
        try {
          zt2(c21);
        } catch {
        }
      });
    }
    const o18 = Ft2(t11);
    if (o18)
      for (let a12 = o18.length - 1; a12 >= 0; --a12) {
        const c21 = o18[a12], f21 = c21 && c21.name;
        if (typeof f21 == "string")
          try {
            t11.removeAttribute(f21);
          } catch {
          }
      }
  }, tt2 = function(t11, e5) {
    try {
      ft(n13.removed, {
        attribute: e5.getAttributeNode(t11),
        from: e5
      });
    } catch {
      ft(n13.removed, {
        attribute: null,
        from: e5
      });
    }
    if (e5.removeAttribute(t11), t11 === "is")
      if (rt2 || It2)
        try {
          $15(e5);
        } catch {
        }
      else
        try {
          e5.setAttribute(t11, "");
        } catch {
        }
  }, xn = function(t11) {
    const e5 = Ft2(t11);
    if (e5)
      for (let o18 = e5.length - 1; o18 >= 0; --o18) {
        const a12 = e5[o18], c21 = a12 && a12.name;
        if (!(typeof c21 != "string" || T4[d21(c21)]))
          try {
            t11.removeAttribute(c21);
          } catch {
          }
      }
  }, ee2 = function(t11) {
    const e5 = [t11];
    for (; e5.length > 0; ) {
      const o18 = e5.pop();
      (I6 ? I6(o18) : o18.nodeType) === v.element && xn(o18);
      const c21 = it2(o18);
      if (c21)
        for (let f21 = c21.length - 1; f21 >= 0; --f21)
          e5.push(c21[f21]);
    }
  }, kn = function(t11) {
    if (!Y2)
      return;
    const e5 = [t11];
    for (; e5.length > 0; ) {
      const o18 = e5.pop(), a12 = I6 ? I6(o18) : o18.nodeType;
      if (a12 === v.processingInstruction || a12 === v.comment && b(rn, o18.data)) {
        try {
          zt2(o18);
        } catch {
        }
        continue;
      }
      if (a12 === v.element) {
        const f21 = o18, y17 = d21(k17 ? k17(o18) : o18.nodeName);
        try {
          f21.hasAttribute && f21.hasAttribute("patchsrc") && f21.removeAttribute("patchsrc"), f21.hasAttribute && f21.hasAttribute("for") && y17 !== "label" && y17 !== "output" && f21.removeAttribute("for");
        } catch {
        }
      }
      const c21 = it2(o18);
      if (c21)
        for (let f21 = c21.length - 1; f21 >= 0; --f21)
          e5.push(c21[f21]);
    }
  }, ke2 = function(t11) {
    let e5 = null, o18 = null;
    if ($t2)
      t11 = "<remove></remove>" + t11;
    else {
      const f21 = Ve(t11, /^[\r\n\t ]+/);
      o18 = f21 && f21[0];
    }
    gt2 === "application/xhtml+xml" && at2 === F3 && (t11 = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + t11 + "</body></html>");
    const a12 = D5 ? ot2(t11) : t11;
    if (at2 === F3)
      try {
        e5 = new kt2().parseFromString(a12, gt2);
      } catch {
      }
    if (!e5 || !e5.documentElement) {
      e5 = Ht2.createDocument(at2, "template", null);
      try {
        e5.documentElement.innerHTML = Kt2 ? J2 : a12;
      } catch {
      }
    }
    const c21 = e5.body || e5.documentElement;
    return t11 && o18 && c21.insertBefore(s13.createTextNode(o18), c21.childNodes[0] || null), at2 === F3 ? Tn.call(e5, Q3 ? "html" : "body")[0] : Q3 ? e5.documentElement : c21;
  }, ze = function(t11) {
    return _e2.call(
      t11.ownerDocument || t11,
      t11,
      // eslint-disable-next-line no-bitwise
      M5.SHOW_ELEMENT | M5.SHOW_COMMENT | M5.SHOW_TEXT | M5.SHOW_PROCESSING_INSTRUCTION | M5.SHOW_CDATA_SECTION,
      null
    );
  }, Mt2 = function(t11) {
    return t11 = Et(t11, yn, " "), t11 = Et(t11, En, " "), t11 = Et(t11, An, " "), t11;
  }, ne2 = function(t11) {
    var e5;
    t11.normalize();
    const o18 = _e2.call(
      t11.ownerDocument || t11,
      t11,
      // eslint-disable-next-line no-bitwise
      M5.SHOW_TEXT | M5.SHOW_COMMENT | M5.SHOW_CDATA_SECTION | M5.SHOW_PROCESSING_INSTRUCTION,
      null
    );
    let a12 = o18.nextNode();
    for (; a12; )
      a12.data = Mt2(a12.data), a12 = o18.nextNode();
    const c21 = (e5 = t11.querySelectorAll) === null || e5 === void 0 ? void 0 : e5.call(t11, "template");
    c21 && ut(c21, (f21) => {
      ct2(f21.content) && ne2(f21.content);
    });
  }, vt2 = function(t11) {
    const e5 = k17 ? k17(t11) : null;
    return typeof e5 != "string" || d21(e5) !== "form" ? false : typeof t11.nodeName != "string" || typeof t11.textContent != "string" || typeof t11.removeChild != "function" || // Realm-safe NamedNodeMap detection: equality against the cached
    // prototype getter. Clobbered .attributes (e.g. <input name="attributes">)
    // makes the direct read diverge from the cached read; a clean form
    // (same-realm OR foreign-realm) has both reads pointing at the same
    // canonical NamedNodeMap.
    t11.attributes !== Ft2(t11) || typeof t11.removeAttribute != "function" || typeof t11.setAttribute != "function" || typeof t11.namespaceURI != "string" || typeof t11.insertBefore != "function" || typeof t11.hasChildNodes != "function" || // NodeType clobbering probe. Cached Node.prototype.nodeType getter
    // returns the integer 1 for any Element regardless of realm; direct
    // read on a clobbered form (e.g. <input name="nodeType">) returns
    // the named child element. Cheap addition — nodeType is read from
    // an internal slot, no serialization cost — and removes a residual
    // clobbering surface used by several mXSS / PI / comment branches
    // in _sanitizeElements that compare currentNode.nodeType directly.
    t11.nodeType !== I6(t11) || // HTMLFormElement has [LegacyOverrideBuiltIns]: a descendant named
    // "childNodes" shadows the prototype getter. Direct reads of
    // form.childNodes from a clobbered form return the named child
    // instead of the real NodeList, so any walk that reads it directly
    // skips the form's real children. Compare the direct read to the
    // cached Node.prototype getter — when the form's named-property
    // getter intercepts the read, the two values differ and we flag
    // the form. This catches every clobbering child type (input,
    // select, etc.) regardless of whether the named child happens to
    // carry a numeric .length, which a typeof-based probe would miss
    // (e.g. HTMLSelectElement.length is a defined unsigned-long).
    t11.childNodes !== it2(t11);
  }, ct2 = function(t11) {
    if (!I6 || typeof t11 != "object" || t11 === null)
      return false;
    try {
      return I6(t11) === v.documentFragment;
    } catch {
      return false;
    }
  }, yt2 = function(t11) {
    if (!I6 || typeof t11 != "object" || t11 === null)
      return false;
    try {
      return typeof I6(t11) == "number";
    } catch {
      return false;
    }
  };
  function U2(r13, t11, e5) {
    r13.length !== 0 && ut(r13, (o18) => {
      o18.call(n13, t11, e5, lt2);
    });
  }
  const zn = function(t11, e5) {
    return !!(Y2 && t11.hasChildNodes() && !yt2(t11.firstElementChild) && b(on, t11.textContent) && b(on, t11.innerHTML) || Y2 && t11.namespaceURI === F3 && e5 === "style" && yt2(t11.firstElementChild) || t11.nodeType === v.processingInstruction || Y2 && t11.nodeType === v.comment && b(rn, t11.data));
  }, Fn = function(t11, e5) {
    if (!Tt2[e5] && He(e5) && (g13.tagNameCheck instanceof RegExp && b(g13.tagNameCheck, e5) || g13.tagNameCheck instanceof Function && g13.tagNameCheck(e5)))
      return false;
    if (jt2 && !z8[e5]) {
      const o18 = Z2(t11), a12 = it2(t11);
      if (a12 && o18) {
        const c21 = a12.length;
        for (let f21 = c21 - 1; f21 >= 0; --f21) {
          const y17 = Xt2 ? a12[f21] : pn(a12[f21], true);
          o18.insertBefore(y17, mn(t11));
        }
      }
    }
    return $15(t11), true;
  }, Fe2 = function(t11, e5) {
    if (U2(h23.beforeSanitizeElements, t11, null), t11 !== e5 && Z2(t11) === null)
      return true;
    if (vt2(t11))
      return $15(t11), true;
    const o18 = d21(k17 ? k17(t11) : t11.nodeName);
    if (U2(h23.uponSanitizeElement, t11, {
      tagName: o18,
      allowedTags: _17
    }), t11 !== e5 && Z2(t11) === null)
      return true;
    if (zn(t11, o18))
      return $15(t11), true;
    if (Tt2[o18] || !(B5.tagCheck instanceof Function && B5.tagCheck(o18)) && !_17[o18]) {
      const c21 = Fn(t11, o18);
      return c21 === false && U2(h23.afterSanitizeElements, t11, null), c21;
    }
    if ((I6 ? I6(t11) : t11.nodeType) === v.element && !Pn(t11) || (o18 === "noscript" || o18 === "noembed" || o18 === "noframes") && b(Ii, t11.innerHTML))
      return $15(t11), true;
    if (W2 && t11.nodeType === v.text) {
      const c21 = Mt2(t11.textContent);
      t11.textContent !== c21 && (ft(n13.removed, {
        element: t11.cloneNode()
      }), t11.textContent = c21);
    }
    return U2(h23.afterSanitizeElements, t11, null), false;
  }, Ue = function(t11, e5, o18) {
    if (Ae2[e5] || Y2 && e5 === "patchsrc" || Y2 && e5 === "for" && t11 !== "label" && t11 !== "output" || we2 && (e5 === "id" || e5 === "name") && (o18 in s13 || o18 in Dn))
      return false;
    const a12 = T4[e5] || B5.attributeCheck instanceof Function && B5.attributeCheck(e5, t11);
    if (!(Gt2 && b(bn, e5))) {
      if (!(be2 && b(Sn, e5))) {
        if (a12) {
          if (!qt2[e5]) {
            if (!b(ge2, Et(o18, Te2, ""))) {
              if (!((e5 === "src" || e5 === "xlink:href" || e5 === "href") && t11 !== "script" && qe(o18, "data:") === 0 && Ne2[t11])) {
                if (!(Se2 && !b(On, Et(o18, Te2, "")))) {
                  if (o18)
                    return false;
                }
              }
            }
          }
        } else if (
          // First condition does a very basic check if a) it's basically a valid custom element tagname AND
          // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
          // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
          !(He(t11) && (g13.tagNameCheck instanceof RegExp && b(g13.tagNameCheck, t11) || g13.tagNameCheck instanceof Function && g13.tagNameCheck(t11)) && (g13.attributeNameCheck instanceof RegExp && b(g13.attributeNameCheck, e5) || g13.attributeNameCheck instanceof Function && g13.attributeNameCheck(e5, t11)) || // Alternative, second condition checks if it's an `is`-attribute, AND
          // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
          e5 === "is" && g13.allowCustomizedBuiltInElements && (g13.tagNameCheck instanceof RegExp && b(g13.tagNameCheck, o18) || g13.tagNameCheck instanceof Function && g13.tagNameCheck(o18)))
        ) return false;
      }
    }
    return true;
  }, Un = p({}, ["annotation-xml", "color-profile", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "missing-glyph"]), He = function(t11) {
    return !Un[bt(t11)] && b(wn, t11);
  }, Hn = function(t11, e5, o18, a12) {
    if (D5 && typeof wt2 == "object" && typeof wt2.getAttributeType == "function" && !o18)
      switch (wt2.getAttributeType(t11, e5)) {
        case "TrustedHTML":
          return ot2(a12);
        case "TrustedScriptURL":
          return dn(a12);
      }
    return a12;
  }, Gn = function(t11, e5, o18, a12) {
    try {
      o18 ? t11.setAttributeNS(o18, e5, a12) : t11.setAttribute(e5, a12), vt2(t11) ? $15(t11) : Xe(n13.removed);
    } catch {
      tt2(e5, t11);
    }
  }, Ge2 = function(t11) {
    U2(h23.beforeSanitizeAttributes, t11, null);
    const e5 = t11.attributes;
    if (!e5 || vt2(t11))
      return;
    const o18 = {
      attrName: "",
      attrValue: "",
      keepAttr: true,
      allowedAttributes: T4,
      forceKeepAttr: void 0
    };
    let a12 = e5.length;
    const c21 = d21(t11.nodeName);
    for (; a12--; ) {
      const f21 = e5[a12], y17 = f21.name, R3 = f21.namespaceURI, P4 = f21.value, C10 = d21(y17), x24 = P4;
      let N3 = y17 === "value" ? x24 : ci(x24);
      if (o18.attrName = C10, o18.attrValue = N3, o18.keepAttr = true, o18.forceKeepAttr = void 0, U2(h23.uponSanitizeAttribute, t11, o18), N3 = o18.attrValue, Re2 && (C10 === "id" || C10 === "name") && qe(N3, Ie2) !== 0 && (tt2(y17, t11), N3 = Ie2 + N3), Y2 && b(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, N3)) {
        tt2(y17, t11);
        continue;
      }
      if (C10 === "attributename" && Ve(N3, "href")) {
        tt2(y17, t11);
        continue;
      }
      if (!o18.forceKeepAttr) {
        if (!o18.keepAttr) {
          tt2(y17, t11);
          continue;
        }
        if (!Oe2 && b(Ni, N3)) {
          tt2(y17, t11);
          continue;
        }
        if (W2 && (N3 = Mt2(N3)), !Ue(c21, C10, N3)) {
          tt2(y17, t11);
          continue;
        }
        N3 = Hn(c21, C10, R3, N3), N3 !== x24 && Gn(t11, y17, R3, N3);
      }
    }
    U2(h23.afterSanitizeAttributes, t11, null);
  }, Pt2 = function(t11) {
    let e5 = null;
    const o18 = ze(t11);
    for (U2(h23.beforeSanitizeShadowDOM, t11, null); e5 = o18.nextNode(); )
      if (U2(h23.uponSanitizeShadowNode, e5, null), Fe2(e5, t11), Ge2(e5), ct2(e5.content) && Pt2(e5.content), (I6 ? I6(e5) : e5.nodeType) === v.element) {
        const c21 = me(e5);
        ct2(c21) && (ie2(c21), Pt2(c21));
      }
    U2(h23.afterSanitizeShadowDOM, t11, null);
  }, ie2 = function(t11) {
    const e5 = [{
      node: t11,
      shadow: null
    }];
    for (; e5.length > 0; ) {
      const o18 = e5.pop();
      if (o18.shadow) {
        Pt2(o18.shadow);
        continue;
      }
      const a12 = o18.node, f21 = (I6 ? I6(a12) : a12.nodeType) === v.element, y17 = it2(a12);
      if (y17)
        for (let R3 = y17.length - 1; R3 >= 0; --R3)
          e5.push({
            node: y17[R3],
            shadow: null
          });
      if (f21) {
        const R3 = k17 ? k17(a12) : null;
        if (typeof R3 == "string" && d21(R3) === "template") {
          const P4 = a12.content;
          ct2(P4) && e5.push({
            node: P4,
            shadow: null
          });
        }
      }
      if (f21) {
        const R3 = me(a12);
        ct2(R3) && e5.push({
          node: null,
          shadow: R3
        }, {
          node: R3,
          shadow: null
        });
      }
    }
  };
  return n13.sanitize = function(r13) {
    let t11 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, e5 = null, o18 = null, a12 = null, c21 = null;
    if (Kt2 = !r13, Kt2 && (r13 = "<!-->"), typeof r13 != "string" && !yt2(r13) && (r13 = di(r13), typeof r13 != "string"))
      throw et("dirty is not a string, aborting");
    if (!n13.isSupported)
      return r13;
    Bt2 ? (_17 = Wt2, T4 = Yt2) : te2(t11), (h23.uponSanitizeElement.length > 0 || h23.uponSanitizeAttribute.length > 0) && (_17 = L(_17)), h23.uponSanitizeAttribute.length > 0 && (T4 = L(T4)), n13.removed = [];
    const f21 = Xt2 && typeof r13 != "string" && yt2(r13);
    if (f21) {
      kn(r13);
      const C10 = k17 ? k17(r13) : r13.nodeName;
      if (typeof C10 == "string") {
        const x24 = d21(C10);
        if (!_17[x24] || Tt2[x24])
          throw Ct2(r13), et("root node is forbidden and cannot be sanitized in-place");
      }
      if (vt2(r13))
        throw Ct2(r13), et("root node is clobbered and cannot be sanitized in-place");
      try {
        ie2(r13);
      } catch (x24) {
        throw Ct2(r13), x24;
      }
    } else if (yt2(r13))
      e5 = ke2("<!---->"), o18 = e5.ownerDocument.importNode(r13, true), o18.nodeType === v.element && o18.nodeName === "BODY" || o18.nodeName === "HTML" ? e5 = o18 : e5.appendChild(o18), ie2(o18);
    else {
      if (!rt2 && !W2 && !Q3 && // eslint-disable-next-line unicorn/prefer-includes
      r13.indexOf("<") === -1)
        return D5 && Nt2 ? ot2(r13) : r13;
      if (e5 = ke2(r13), !e5)
        return rt2 ? null : Nt2 ? J2 : "";
    }
    e5 && $t2 && $15(e5.firstChild);
    const y17 = f21 ? r13 : e5, R3 = ze(y17);
    try {
      for (; a12 = R3.nextNode(); )
        Fe2(a12, y17), Ge2(a12), ct2(a12.content) && Pt2(a12.content);
    } catch (C10) {
      throw f21 && (Ct2(r13), ut(n13.removed, (x24) => {
        x24.element && ee2(x24.element);
      })), C10;
    }
    if (f21)
      return ut(n13.removed, (C10) => {
        C10.element && ee2(C10.element);
      }), W2 && ne2(r13), r13;
    if (rt2) {
      if (W2 && ne2(e5), It2)
        for (c21 = _n.call(e5.ownerDocument); e5.firstChild; )
          c21.appendChild(e5.firstChild);
      else
        c21 = e5;
      return (T4.shadowroot || T4.shadowrootmode) && (c21 = gn.call(l17, c21, true)), c21;
    }
    let P4 = Q3 ? e5.outerHTML : e5.innerHTML;
    return Q3 && _17["!doctype"] && e5.ownerDocument && e5.ownerDocument.doctype && e5.ownerDocument.doctype.name && b(wi, e5.ownerDocument.doctype.name) && (P4 = "<!DOCTYPE " + e5.ownerDocument.doctype.name + `>
` + P4), W2 && (P4 = Mt2(P4)), D5 && Nt2 ? ot2(P4) : P4;
  }, n13.setConfig = function() {
    let r13 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    te2(r13), Bt2 = true, Wt2 = _17, Yt2 = T4;
  }, n13.clearConfig = function() {
    lt2 = null, Bt2 = false, Wt2 = null, Yt2 = null, D5 = Ut2, J2 = "";
  }, n13.isValidAttribute = function(r13, t11, e5) {
    lt2 || te2({});
    const o18 = d21(r13), a12 = d21(t11);
    return Ue(o18, a12, e5);
  }, n13.addHook = function(r13, t11) {
    typeof t11 == "function" && S(h23, r13) && ft(h23[r13], t11);
  }, n13.removeHook = function(r13, t11) {
    if (S(h23, r13)) {
      if (t11 !== void 0) {
        const e5 = ai(h23[r13], t11);
        return e5 === -1 ? void 0 : li(h23[r13], e5, 1)[0];
      }
      return Xe(h23[r13]);
    }
  }, n13.removeHooks = function(r13) {
    S(h23, r13) && (h23[r13] = []);
  }, n13.removeAllHooks = function() {
    h23 = sn();
  }, n13;
}
var Ci = un();
var St = /* @__PURE__ */ new Map();
var pe = /* @__PURE__ */ new Map();
function fn(i21, n13) {
  const s13 = Ci.sanitize(i21, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: ["script", "use"],
    // <use> can SSRF to external hrefs
    FORBID_ATTR: ["onload", "onerror", "onbegin", "href", "xlink:href"]
  }), m32 = new DOMParser().parseFromString(s13, "image/svg+xml").documentElement;
  if (!(m32 instanceof SVGElement))
    throw new Error(`Invalid SVG from ${n13}`);
  return m32;
}
async function Mi(i21) {
  const n13 = await fetch(i21);
  if (!n13.ok)
    throw new Error(`Failed to load icon: ${n13.status}`);
  return fn(await n13.text(), i21);
}
async function an(i21) {
  return St.has(i21) || St.set(i21, Mi(i21)), (await St.get(i21)).cloneNode(true);
}
function vi(i21) {
  let n13 = pe.get(i21);
  return n13 || (n13 = fn(i21, "inline SVG source"), pe.set(i21, n13)), n13.cloneNode(true);
}
var Pi = ":host{display:inline-block;width:fit-content;height:fit-content;--_nys-icon-size: var( --nys-icon-size, .7em );box-sizing:content-box!important;vertical-align:middle}@supports (font-size: 1cap){:host{--_nys-icon-size: var(--nys-icon-size, 1cap)}}.nys-icon--svg{width:var(--_nys-icon-size, 1em);height:var(--_nys-icon-size, 1em);display:block;white-space:nowrap}.nys-icon--xs{width:calc(var(--_nys-icon-size) * .75);height:calc(var(--_nys-icon-size) * .75)}.nys-icon--sm{width:calc(var(--_nys-icon-size) * .875);height:calc(var(--_nys-icon-size) * .875)}.nys-icon--md{width:var(--_nys-icon-size);height:var(--_nys-icon-size)}.nys-icon--lg{width:calc(var(--_nys-icon-size) * 1.125);height:calc(var(--_nys-icon-size) * 1.125)}.nys-icon--xl{width:calc(var(--_nys-icon-size) * 1.25);height:calc(var(--_nys-icon-size) * 1.25)}.nys-icon--2xl{width:calc(var(--_nys-icon-size) * 1.5);height:calc(var(--_nys-icon-size) * 1.5)}.nys-icon--3xl{width:calc(var(--_nys-icon-size) * 1.875);height:calc(var(--_nys-icon-size) * 1.875)}.nys-icon--4xl{width:calc(var(--_nys-icon-size) * 2.25);height:calc(var(--_nys-icon-size) * 2.25)}.nys-icon--5xl{width:calc(var(--_nys-icon-size) * 3);height:calc(var(--_nys-icon-size) * 3)}.nys-icon--12{width:.75rem;height:.75rem}.nys-icon--14{width:.875rem;height:.875rem}.nys-icon--16{width:1rem;height:1rem}.nys-icon--18{width:1.125rem;height:1.125rem}.nys-icon--20{width:1.25rem;height:1.25rem}.nys-icon--24{width:1.5rem;height:1.5rem}.nys-icon--32{width:2rem;height:2rem}.nys-icon--40{width:2.5rem;height:2.5rem}.nys-icon--50{width:3.125rem;height:3.125rem}.nys-icon--flip-horizontal{transform:scaleX(-1)}.nys-icon--flip-vertical{transform:scaleY(-1)}.nys-icon--flip-both{transform:scale(-1)}";
var xi = Object.defineProperty;
var q = (i21, n13, s13, l17) => {
  for (var u17 = void 0, m32 = i21.length - 1, A6; m32 >= 0; m32--)
    (A6 = i21[m32]) && (u17 = A6(n13, s13, u17) || u17);
  return u17 && xi(n13, s13, u17), u17;
};
var V;
var G = (V = class extends qn {
  constructor() {
    super(...arguments), this.name = "", this.library = "default", this.ariaLabel = "", this.rotate = "0", this.flip = "", this.color = "", this.size = "md", this._svg = null, this._loadSeq = 0, this._loadPromise = null;
  }
  /** Resolves when the current icon load (if any) is complete. */
  get updateComplete() {
    return (async () => {
      const n13 = await super.updateComplete;
      return await this._loadPromise, n13;
    })();
  }
  connectedCallback() {
    super.connectedCallback(), this._reflectHostSemantics(), We(this.library, this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), Ye(this.library, this);
  }
  /** Called by the icon library registry when the current library changes. */
  redraw() {
    this._loadIcon();
  }
  /**
   * Lit calls firstUpdated after the first render, once all reactive
   * properties (including those set from the template) are resolved.
   * This guarantees the initial _loadIcon runs with the correct name
   * and library values, avoiding the race where updated() might not
   * fire for properties that equal their defaults.
   */
  firstUpdated() {
    this._loadIcon();
  }
  updated(n13) {
    if (n13.has("name") && !V._validName.test(this.name)) {
      console.warn(`nys-icon: invalid name "${this.name}" — ignored`), this._svg = null;
      return;
    }
    if (n13.has("name") || n13.has("library")) {
      if (n13.has("library")) {
        const s13 = n13.get("library");
        s13 && Ye(s13, this), We(this.library, this);
      }
      this._loadIcon();
    }
    this._svg && (n13.has("ariaLabel") || n13.has("rotate") || n13.has("flip") || n13.has("color") || n13.has("size")) ? this._applyAttributes(this._svg) : n13.has("ariaLabel") && this._reflectHostSemantics();
  }
  _loadIcon() {
    const n13 = ++this._loadSeq;
    this._loadPromise = (async () => {
      const s13 = Jn(this.library);
      if (!s13 || !this.name) {
        this._svg = null;
        return;
      }
      try {
        const l17 = await s13.resolver(this.name);
        if (n13 !== this._loadSeq) return;
        if (!l17) {
          this._svg = null;
          return;
        }
        const u17 = typeof l17 == "string" ? await an(l17) : l17.type === "url" ? await an(l17.href) : vi(l17.content);
        if (n13 !== this._loadSeq) return;
        s13.mutator?.(u17), this._applyAttributes(u17), this._svg = u17;
      } catch {
        n13 === this._loadSeq && (this._svg = null);
      }
    })();
  }
  _applyAttributes(n13) {
    n13.setAttribute("role", "img"), this.ariaLabel ? (n13.setAttribute("aria-label", this.ariaLabel), n13.removeAttribute("aria-hidden")) : (n13.setAttribute("aria-hidden", "true"), n13.removeAttribute("aria-label")), this.rotate && this.rotate !== "0" ? n13.style.rotate = `${this.rotate}deg` : n13.style.removeProperty("rotate"), n13.style.color = this.color || "currentcolor", n13.classList.add(`nys-icon--${this.size}`), n13.classList.add("nys-icon--svg"), this.flip && n13.classList.add(`nys-icon--flip-${this.flip}`), this._reflectHostSemantics();
  }
  /**
   * Reflects the icon's accessible state onto the host:
   * - Labeled icon  -> role="img" + aria-label, no aria-hidden.
   * - Decorative    -> aria-hidden="true", no role/label.
   *
   * These are reflected as host *attributes* (rather than via
   * ElementInternals) on purpose: aria-hidden / role / aria-label in
   * attribute form have universal, consistent assistive-technology support,
   * whereas AT support for these states set through ElementInternals is still
   * uneven across browser/screen-reader combinations. The host role/label
   * therefore depend on runtime state (ariaLabel), so defaultRole stays null.
   */
  _reflectHostSemantics() {
    this.ariaLabel ? (this.setAttribute("role", "img"), this.setAttribute("aria-label", this.ariaLabel), this.removeAttribute("aria-hidden")) : (this.removeAttribute("role"), this.removeAttribute("aria-label"), this.setAttribute("aria-hidden", "true"));
  }
  render() {
    return this._svg ? html`${this._svg}` : null;
  }
}, V.styles = unsafeCSS(Pi), V._validName = /^[a-zA-Z0-9_-]+$/, V);
q([
  property({ type: String, reflect: true })
], G.prototype, "name");
q([
  property({ type: String, reflect: true })
], G.prototype, "library");
q([
  property({ type: String })
], G.prototype, "ariaLabel");
q([
  property({ type: String })
], G.prototype, "rotate");
q([
  property({ type: String })
], G.prototype, "flip");
q([
  property({ type: String })
], G.prototype, "color");
q([
  property({ type: String })
], G.prototype, "size");
q([
  state()
], G.prototype, "_svg");
var ki = G;
customElements.get("nys-icon") || customElements.define("nys-icon", ki);

// ../../nys-accordion/dist/chunks/nys-accordionitem-CP5FJw56.js
var v2 = 0;
function g(o18) {
  return `${o18}-${Date.now()}-${v2++}`;
}
var f = (o18) => {
  class e5 extends o18 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = g(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return e5;
};
var m = f(LitElement);
var b2 = ':host{--_nys-accordion-border-radius: var(--nys-radius-md, 4px);--_nys-accordion-border-width: var(--nys-border-width-md, 2px);--_nys-accordion-border-color: var(--nys-color-neutral-50, #ededed);--_nys-accordion-padding--x: var(--nys-space-250, 20px);--_nys-accordion-padding--y: var(--nys-space-200, 16px);--_nys-accordion-outline-width: var(--nys-border-width-md, 2px);--_nys-accordion-outline-offset: var(--nys-space-2px, 2px);--_nys-accordion-outline-color: var(--nys-color-focus, #004dd1);--_nys-accordion-gap: var(--nys-space-100, 8px);--_nys-accordion-color--header: var( --nys-accordion-color--header, var(--nys-color-text, #1b1b1b) );--_nys-accordion-background-color--header: var( --nys-accordion-background-color--header, var(--nys-color-neutral-50, #ededed) );--_nys-accordion-background-color--header--hover: var( --nys-accordion-background-color--header--hover, var(--nys-color-neutral-100, #d0d0ce) );--_nys-accordionitem-gap: var(--nys-space-200, 16px);--_nys-accordionitem-background-color: var(--nys-color-ink-reverse, #ffffff);--_nys-accordionitem-padding: var( --nys-accordionitem-padding, var(--nys-space-200, 16px) var(--nys-space-250, 20px) );--_nys-accordion-content-max-width: var( --nys-accordion-content-max-width, 80ch );--_nys-accordion-font-size: var(--nys-font-size-ui-xl, 20px);--_nys-accordion-font-weight: var(--nys-font-weight-bold, 700);--_nys-accordion-line-height: var(--nys-font-lineheight-ui-xl, 28px);--_nys-accordion-letter-spacing: var(--nys-font-letterspacing-ui-xl, .017px);--_nys-accordion-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) )}::slotted(p),p{margin:0!important}.nys-accordionitem{font-family:var(--_nys-accordion-font-family);font-size:var(--_nys-accordion-font-size);font-weight:var(--_nys-accordion-font-weight);line-height:var(--_nys-accordion-line-height);letter-spacing:var(--_nys-accordion-letter-spacing);display:flex;flex-direction:column}.nys-accordionitem__title{margin:0;font:inherit;color:inherit;display:flex;flex:1;align-self:stretch}.nys-accordionitem__heading{all:unset;color:var(--_nys-accordion-color--header);flex:1;gap:var(--_nys-accordionitem-gap);display:flex;padding:var(--_nys-accordion-padding--y) var(--_nys-accordion-padding--x);align-items:center;align-self:stretch;border-radius:var(--_nys-accordion-border-radius);background-color:var(--_nys-accordion-background-color--header);cursor:pointer;transition:.05s all ease-in-out}.nys-accordionitem__heading:hover{border-radius:var(--_nys-accordion-border-radius);background-color:var(--_nys-accordion-background-color--header--hover)}.nys-accordionitem__heading:focus-visible{outline-offset:var(--_nys-accordion-outline-offset);outline:solid var(--_nys-accordion-outline-width) var(--_nys-accordion-outline-color)}.nys-accordionitem__heading .nys-accordionitem__heading-title{flex:1}.nys-accordionitem__content{height:0;overflow:hidden;transition:all .3s cubic-bezier(.4,0,.2,1) 0ms;visibility:hidden}.nys-accordionitem__content.expanded{visibility:visible}.nys-accordionitem__content-slot-container{display:flex;flex-direction:column;gap:var(--_nys-accordion-gap);align-self:stretch;padding:var(--_nys-accordionitem-padding);background-color:var(--_nys-accordionitem-background-color)}.nys-accordionitem__content-slot-container-text{max-width:var(--_nys-accordion-content-max-width)}.expand-icon{transition:all .3s cubic-bezier(.4,0,.2,1) 0ms}:host([expanded]) .expand-icon{transform:rotate(180deg)}:host([bordered][expanded]) .nys-accordionitem__heading{border-radius:var(--_nys-accordion-border-radius) var(--_nys-accordion-border-radius) 0 0}:host([bordered]) .nys-accordionitem__content-slot-container{border:var(--_nys-accordion-border-width) solid var(--_nys-accordion-border-color);border-top:none;border-radius:0 0 var(--_nys-accordion-border-radius) var(--_nys-accordion-border-radius)}.nys-accordion{display:flex;flex-direction:column;gap:var(--_nys-accordion-gap)}';
var x = Object.defineProperty;
var a = (o18, e5, n13, l17) => {
  for (var r13 = void 0, d21 = o18.length - 1, h23; d21 >= 0; d21--)
    (h23 = o18[d21]) && (r13 = h23(e5, n13, r13) || r13);
  return r13 && x(e5, n13, r13), r13;
};
var w2 = "h3";
var $ = ["h2", "h3", "h4", "h5", "h6"];
function y(o18) {
  if (typeof o18 != "string") return null;
  const e5 = o18.trim().toLowerCase();
  return $.includes(e5) ? e5 : null;
}
var c = class c2 extends m {
  constructor() {
    super(...arguments), this.id = "", this.heading = "", this.headingLevel = "", this.expanded = false, this.bordered = false;
  }
  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */
  connectedCallback() {
    super.connectedCallback();
  }
  firstUpdated() {
    const e5 = this.shadowRoot?.querySelector("slot");
    this.expanded && e5 && e5.addEventListener("slotchange", () => {
      this._updateHeight();
    });
  }
  updated(e5) {
    (e5.has("expanded") || e5.has("bordered")) && this._updateHeight();
  }
  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  /**
   * The level actually rendered: this item's own `headingLevel`, otherwise the
   * one set on the enclosing `nys-accordion`, otherwise the `h3` default.
   *
   * The group's value is read here rather than pushed down from the container
   * so there is a single source of truth per item and an item-level value
   * always wins. `nys-accordion` re-renders its items when its own level
   * changes (see `_notifyHeadingLevel` there).
   */
  _resolveHeadingLevel() {
    const e5 = y(this.headingLevel);
    if (e5) return e5;
    const n13 = this.closest("nys-accordion");
    return y(n13?.headingLevel) ?? w2;
  }
  _dispatchEvent() {
    this.dispatchEvent(
      new CustomEvent("nys-accordionitem-toggle", {
        detail: { id: this.id, heading: this.heading, expanded: this.expanded },
        bubbles: true,
        composed: true
      })
    );
  }
  _handleExpand() {
    this.expanded = !this.expanded, this._updateHeight(), this._dispatchEvent();
  }
  _handleKeydown(e5) {
    (e5.key === " " || e5.key === "Enter") && (e5.preventDefault(), this._handleExpand());
  }
  _updateHeight() {
    this._contentContainer && (this.expanded ? requestAnimationFrame(() => {
      const e5 = this._contentContainer.scrollHeight;
      this._contentContainer.style.height = `${e5}px`;
    }) : (this._contentContainer.style.height = "0", this._contentContainer.style.overflow = "hidden"));
  }
  /**
   * Helper Render Functions
   * --------------------------------------------------------------------------
   */
  /**
   * WAI-ARIA Accordion pattern: the toggle button must be contained in a
   * heading at the level appropriate for the surrounding page. A real `h2`-`h6`
   * element is used rather than `role="heading"` + `aria-level` so the trigger
   * carries native heading semantics everywhere — including the places that
   * read the DOM instead of the accessibility tree.
   */
  _renderHeading(e5) {
    const n13 = "nys-accordionitem__title";
    switch (this._resolveHeadingLevel()) {
      case "h2":
        return html`<h2 class=${n13}>${e5}</h2>`;
      case "h4":
        return html`<h4 class=${n13}>${e5}</h4>`;
      case "h5":
        return html`<h5 class=${n13}>${e5}</h5>`;
      case "h6":
        return html`<h6 class=${n13}>${e5}</h6>`;
      default:
        return html`<h3 class=${n13}>${e5}</h3>`;
    }
  }
  render() {
    const e5 = `${this.id}-content`, n13 = `${this.id}-button`, l17 = html`<button
      id=${n13}
      class="nys-accordionitem__heading"
      type="button"
      @click=${this._handleExpand}
      @keydown=${this._handleKeydown}
      aria-expanded=${this.expanded ? "true" : "false"}
      aria-controls=${e5}
    >
      <span class="nys-accordionitem__heading-title">${this.heading}</span>
      <nys-icon class="expand-icon" name="chevron_down" size="24"></nys-icon>
    </button>`;
    return html`
      <div class="nys-accordionitem">
        ${this._renderHeading(l17)}
        <!--
          The panel is a labelled region so it can be reached from the landmark
          list, named by the trigger that opens it. A collapsed panel is
          visibility:hidden, so it contributes no landmark at all: the list only
          ever holds the panels a user has actually opened (at most one under
          singleSelect), which is why the role is unconditional here.
        -->
        <div
          id=${e5}
          class="nys-accordionitem__content ${this.expanded ? "expanded" : "collapsed"}"
          role="region"
          aria-labelledby=${n13}
          @nys-child-resize=${this._updateHeight}
        >
          <div class="nys-accordionitem__content-slot-container">
            <div class="nys-accordionitem__content-slot-container-text">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
c.styles = unsafeCSS(b2);
var i = c;
a([
  property({ type: String, reflect: true })
], i.prototype, "id");
a([
  property({ type: String })
], i.prototype, "heading");
a([
  property({ type: String, reflect: true })
], i.prototype, "headingLevel");
a([
  property({ type: Boolean, reflect: true })
], i.prototype, "expanded");
a([
  property({ type: Boolean, reflect: true })
], i.prototype, "bordered");
a([
  query(".nys-accordionitem__content")
], i.prototype, "_contentContainer");
customElements.get("nys-accordionitem") || customElements.define("nys-accordionitem", i);

// ../../nys-accordion/dist/nys-accordion.js
var m2 = Object.defineProperty;
var i2 = (c21, e5, r13, d21) => {
  for (var t11 = void 0, n13 = c21.length - 1, l17; n13 >= 0; n13--)
    (l17 = c21[n13]) && (t11 = l17(e5, r13, t11) || t11);
  return t11 && m2(e5, r13, t11), t11;
};
var a2 = class a3 extends m {
  constructor() {
    super(...arguments), this.id = "", this.singleSelect = false, this.bordered = false, this.headingLevel = "h3";
  }
  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */
  connectedCallback() {
    super.connectedCallback();
  }
  updated(e5) {
    e5.has("bordered") && this._applyBordered(), e5.has("headingLevel") && this._notifyHeadingLevel();
  }
  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  _getAccordionItems() {
    return (this.shadowRoot?.querySelector("slot")?.assignedElements() || []).filter(
      (d21) => d21.tagName.toLowerCase() === "nys-accordionitem"
    );
  }
  _onAccordionToggle(e5) {
    if (!this.singleSelect) return;
    const r13 = e5.detail.id;
    e5.detail.expanded && this._getAccordionItems().forEach((t11) => {
      t11.id !== r13 && t11.expanded && (t11.expanded = false);
    });
  }
  _applyBordered() {
    this._getAccordionItems().forEach((e5) => {
      e5.bordered = this.bordered;
    });
  }
  /**
   * Items read the group's `headingLevel` themselves (so an item that sets its
   * own always wins), which means a change here is invisible to them until they
   * re-render. Ask them to.
   */
  _notifyHeadingLevel() {
    this._getAccordionItems().forEach((e5) => {
      e5.requestUpdate?.();
    });
  }
  render() {
    return html`<div
      class="nys-accordion"
      @nys-accordionitem-toggle=${this._onAccordionToggle}
    >
      <slot></slot>
    </div>`;
  }
};
a2.styles = unsafeCSS(b2);
var o = a2;
i2([
  property({ type: String, reflect: true })
], o.prototype, "id");
i2([
  property({ type: Boolean, reflect: true })
], o.prototype, "singleSelect");
i2([
  property({ type: Boolean, reflect: true })
], o.prototype, "bordered");
i2([
  property({ type: String, reflect: true })
], o.prototype, "headingLevel");
customElements.get("nys-accordion") || customElements.define("nys-accordion", o);

// ../../../node_modules/lit-html/development/directives/if-defined.js
var ifDefined = (value) => value ?? nothing;

// ../../nys-button/dist/nys-button.js
var p2 = 0;
function g2(c21) {
  return `${c21}-${Date.now()}-${p2++}`;
}
var x2 = (c21) => {
  class t11 extends c21 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = g2(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return t11;
};
var k = (c21) => {
  class t11 extends x2(c21) {
    constructor() {
      super(...arguments), this.__internals = null;
    }
    get internals() {
      if (this.__internals) return this.__internals;
      if (typeof this.attachInternals == "function")
        try {
          this.__internals = this.attachInternals();
        } catch {
          this.__internals = null;
        }
      return this.__internals;
    }
    get defaultRole() {
      return null;
    }
    setHostAria(l17, s13) {
      const b24 = this.internals;
      if (b24 && l17 in b24) {
        b24[l17] = s13;
        return;
      }
      const u17 = m3(l17);
      s13 === null ? this.removeAttribute(u17) : this.setAttribute(u17, s13);
    }
    reflectDefaultSemantics() {
      const l17 = this.defaultRole;
      l17 && this.setHostAria("role", l17);
    }
    connectedCallback() {
      super.connectedCallback(), this.reflectDefaultSemantics();
    }
  }
  return t11;
};
function m3(c21) {
  if (c21 === "role") return "role";
  const t11 = c21.replace(/^aria/, "");
  return "aria-" + t11.charAt(0).toLowerCase() + t11.slice(1);
}
var $2 = (c21) => {
  const t11 = class extends k(c21) {
    setFormValue(s13) {
      this.internals?.setFormValue(s13 ?? null);
    }
    setValidityFromState(s13, b24, u17) {
      const f21 = this.internals;
      if (!f21) return;
      const v20 = Object.values(s13).some(Boolean);
      v20 ? f21.setValidity(s13, b24 ?? "Invalid value", u17) : f21.setValidity({}), this.setHostAria("ariaInvalid", v20 ? "true" : "false");
    }
    clearValidity() {
      this.internals?.setValidity({}), this.setHostAria("ariaInvalid", "false");
    }
    checkValidity() {
      return this.internals?.checkValidity() ?? true;
    }
    reportValidity() {
      return this.internals?.reportValidity() ?? true;
    }
    formResetCallback() {
      this.clearValidity();
    }
  };
  return t11.formAssociated = true, t11;
};
var S2 = $2(LitElement);
var w3 = ':host{--_nys-button-width: fit-content;--_nys-button-height: var(--nys-size-600, 48px);--_nys-button-border-radius: var(--nys-radius-xl, 12px);--_nys-button-padding--y: calc( var(--nys-space-150, 12px) - var(--nys-border-width-md, 2px) );--_nys-button-cursor: pointer;--_nys-button-padding--x: calc( var(--nys-space-250, 20px) - var(--nys-border-width-md, 2px) );--_nys-button-gap: var(--nys-space-100, 8px);--_nys-button-justify-content: center;--_nys-button-border-style: solid;--_nys-button-border-width: var(--nys-border-width-md, 2px);--_nys-button-outline-width: var(--nys-border-width-md, 2px);--_nys-button-outline-offset: var(--nys-space-2px, 2px);--_nys-button-outline-color: var(--nys-color-focus, #004dd1);--_nys-button-background-color: var( --nys-button-background-color, var(--nys-color-theme, #154973) );--_nys-button-color: var( --nys-button-color, var(--nys-color-text-reverse, #ffffff) );--_nys-button-border-color: var( --nys-button-border-color, var(--nys-color-transparent, #ffffff00) );--_nys-button-background-color--hover: var( --nys-button-background-color--hover, var(--nys-color-theme-strong, #0e324f) );--_nys-button-color--hover: var( --nys-button-color--hover, var(--nys-color-text-reverse, #ffffff) );--_nys-button-border-color--hover: var( --nys-button-border-color--hover, var(--nys-color-transparent, #ffffff00) );--_nys-button-background-color--active: var( --nys-button-background-color--active, var(--nys-color-theme-stronger, #081b2b) );--_nys-button-color--active: var( --nys-button-color--active, var(--nys-color-text-reverse, #ffffff) );--_nys-button-border-color--active: var( --nys-button-border-color--active, var(--nys-color-transparent, #ffffff00) );--_nys-button-background-color--disabled: var( --nys-color-neutral-10, #f6f6f6 );--_nys-button-color--disabled: var(--nys-color-text-disabled, #bec0c1);--_nys-button-border-color--disabled: var(--nys-color-transparent, #ffffff00);--_nys-button-font-size: var(--nys-font-size-ui-md, 16px);--_nys-button-font-weight: var(--nys-font-weight-semibold, 600);--_nys-button-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-button-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-button-text-decoration: none;display:inline-flex;width:var(--_nys-button-width);vertical-align:middle}:host([size=sm]){--_nys-button-height: var(--nys-size-500, 40px);--_nys-button-padding--y: calc( var(--nys-space-100, 8px) - var(--nys-border-width-md, 2px) );--_nys-button-padding--x: calc( var(--nys-space-200, 16px) - var(--nys-border-width-md, 2px) )}:host([size=lg]){--_nys-button-height: var(--nys-size-700, 56px);--_nys-button-padding--y: calc( var(--nys-space-200, 16px) - var(--nys-border-width-md, 2px) );--_nys-button-padding--x: calc( var(--nys-space-300, 24px) - var(--nys-border-width-md, 2px) )}:host([fullWidth]){width:100%}:host([fullWidth]) .nys-button__linkwrapper{width:100%}:host([fullWidth]) .nys-button{width:100%}:host([variant=filled]){--_nys-button-background-color: var( --nys-button-background-color, var(--nys-color-theme, #154973) );--_nys-button-color: var( --nys-button-color, var(--nys-color-text-reverse, #ffffff) );--_nys-button-border-color: var( --nys-button-border-color, var(--nys-color-transparent, #ffffff00) );--_nys-button-background-color--hover: var( --nys-button-background-color--hover, var(--nys-color-theme-strong, #0e324f) );--_nys-button-color--hover: var( --nys-button-color--hover, var(--nys-color-text-reverse, #ffffff) );--_nys-button-border-color--hover: var( --nys-button-border-color, var(--nys-color-transparent, #ffffff00) );--_nys-button-background-color--active: var( --nys-button-background-color--active, var(--nys-color-theme-stronger, #081b2b) );--_nys-button-color--active: var( --nys-button-color--active, var(--nys-color-text-reverse, #ffffff) );--_nys-button-border-color--active: var( --nys-button-border-color, var(--nys-color-transparent, #ffffff00) );--_nys-button-background-color--disabled: var( --nys-color-neutral-10, #f6f6f6 );--_nys-button-color--disabled: var(--nys-color-text-disabled, #bec0c1)}:host([variant=outline]){--_nys-button-background-color: var( --nys-button-background-color, var(--nys-color-surface, #ffffff) );--_nys-button-color: var(--nys-button-color, var(--nys-color-theme, #154973));--_nys-button-border-color: var( --nys-button-border-color, var(--nys-color-theme, #154973) );--_nys-button-background-color--hover: var( --nys-button-background-color--hover, var(--nys-color-theme-weaker, #eff6fb) );--_nys-button-color--hover: var( --nys-button-color--hover, var(--nys-color-theme, #154973) );--_nys-button-border-color--hover: var( --nys-button-border-color--hover, var(--nys-color-theme, #154973) );--_nys-button-background-color--active: var( --nys-button-background-color--active, var(--nys-color-theme-weak, #cddde9) );--_nys-button-color--active: var( --nys-button-color--active, var(--nys-color-theme, #154973) );--_nys-button-border-color--active: var( --nys-button-border-color--active, var(--nys-color-theme, #154973) );--_nys-button-background-color--disabled: var(--nys-color-surface, #ffffff);--_nys-button-color--disabled: var(--nys-color-text-disabled, #bec0c1);--_nys-button-border-color--disabled: var(--nys-color-neutral-100, #d0d0ce)}:host([variant=text]){--_nys-button-height: fit-content;--_nys-button-border-radius: var(--nys-radius-md, 4px);--_nys-button-padding--y: var(--nys-space-2px, 2px);--_nys-button-padding--x: 0;--_nys-button-border-width: 0px;--_nys-button-text-decoration: underline;--_nys-button-text-decoration-thickness: var( --nys-font-decoration-thickness-regular, 7% );--_nys-button-text-decoration-thickness--hover: var( --nys-font-decoration-thickness-strong, 14% );--_nys-button-text-decoration-thickness--active: var( --nys-font-decoration-thickness-strong, 14% );--_nys-button-gap: var(--nys-space-50, 4px);--_nys-button-background-color: var( --nys-button-background-color, var(--nys-color-transparent, #ffffff00) );--_nys-button-color: var(--nys-button-color, var(--nys-color-link, #004dd1));--_nys-button-border-color: var( --nys-button-border-color, var(--nys-color-transparent, #ffffff00) );--_nys-button-background-color--hover: var( --nys-button-background-color--hover, var(--nys-color-transparent, #ffffff00) );--_nys-button-color--hover: var( --nys-button-color--hover, var(--nys-color-link-strong, #003ba1) );--_nys-button-border-color--hover: var( --nys-button-border-color--hover, var(--nys-color-transparent, #ffffff00) );--_nys-button-background-color--active: var( --nys-button-background-color--active, var(--nys-color-transparent, #ffffff00) );--_nys-button-color--active: var( --nys-button-color--active, var(--nys-color-link-strongest, #002971) );--_nys-button-border-color--active: var( --nys-button-border-color--active, var(--nys-color-transparent, #ffffff00) );--_nys-button-background-color--disabled: var( --nys-color-transparent, #ffffff00 );--_nys-button-color--disabled: var(--nys-color-text-disabled, #bec0c1);--_nys-button-border-color--disabled: var(--nys-color-transparent, #ffffff00)}:host([variant=ghost]){--_nys-button-gap: var(--nys-space-50, 4px);--_nys-button-background-color: var( --nys-button-background-color, var(--nys-color-transparent, #ffffff00) );--_nys-button-color: var(--nys-button-color, var(--nys-color-text, #1b1b1b));--_nys-button-border-color: var( --nys-button-border-color, var(--nys-color-transparent, #ffffff00) );--_nys-button-background-color--hover: var( --nys-button-background-color--hover, var(--nys-color-black-transparent-100, #0000001a) );--_nys-button-color--hover: var( --nys-button-color--hover, var(--nys-color-text, #1b1b1b) );--_nys-button-border-color--hover: var( --nys-button-border-color--hover, var(--nys-color-transparent, #ffffff00) );--_nys-button-background-color--active: var( --nys-button-background-color--active, var(--nys-color-black-transparent-200, #00000033) );--_nys-button-color--active: var( --nys-button-color--active, var(--nys-color-text, #1b1b1b) );--_nys-button-border-color--active: var( --nys-button-border-color--active, var(--nys-color-transparent, #ffffff00) );--_nys-button-background-color--disabled: var( --nys-color-transparent, #ffffff00 );--_nys-button-color--disabled: var(--nys-color-text-disabled, #bec0c1);--_nys-button-border-color--disabled: var(--nys-color-transparent, #ffffff00)}:host([variant=filled][inverted]){--_nys-button-background-color: var( --nys-button-background-color, var(--nys-color-surface, #ffffff) );--_nys-button-color: var(--nys-button-color, var(--nys-color-text, #1b1b1b));--_nys-button-border-color--disabled: var(--nys-color-transparent, #ffffff00);--_nys-button-background-color--hover: var( --nys-button-background-color--hover, var(--nys-color-neutral-100, #d0d0ce) );--_nys-button-color--hover: var( --nys-button-color--hover, var(--nys-color-text, #1b1b1b) );--_nys-button-background-color--active: var( --nys-button-background-color--active, var(--nys-color-neutral-300, #a7a9ab) );--_nys-button-color--active: var( --nys-button-color--active, var(--nys-color-text, #1b1b1b) );--_nys-button-background-color--disabled: var(--nys-color-text, #1b1b1b);--_nys-button-color--disabled: var(--nys-color-text-disabled, #62666a)}:host([variant=outline][inverted]){--_nys-button-background-color: var( --nys-button-background-color, var(--nys-color-surface-reverse, #1b1b1b) );--_nys-button-color: var( --nys-button-color, var(--nys-color-text-reverse, #ffffff) );--_nys-button-border-color: var( --nys-button-border-color, var(--nys-color-ink-reverse, #ffffff) );--_nys-button-background-color--hover: var( --nys-button-background-color--hover, var(--nys-color-surface-reverse, #1b1b1b) );--_nys-button-color--hover: var( --nys-button-color--hover, var(--nys-color-text-reverse-weak, #d0d0ce) );--_nys-button-border-color--hover: var( --nys-button-border-color--hover, var(--nys-color-neutral-100, #d0d0ce) );--_nys-button-background-color--active: var( --nys-button-background-color--active, var(--nys-color-surface-reverse, #1b1b1b) );--_nys-button-color--active: var( --nys-button-color--active, var(--nys-color-text-reverse-weaker, #bec0c1) );--_nys-button-border-color--active: var( --nys-button-border-color--active, var(--nys-color-neutral-300, #a7a9ab) );--_nys-button-background-color--disabled: var( --nys-color-surface-reverse, #1b1b1b );--_nys-button-color--disabled: var( --nys-color-text-reverse-disabled, #62666a );--_nys-button-border-color--disabled: var(--nys-color-neutral-600, #62666a)}:host([variant=text][inverted]){--_nys-button-background-color: var( --nys-button-background-color, var(--nys-color-transparent, #ffffff00) );--_nys-button-color: var( --nys-button-color, var(--nys-color-link-reverse, #a7a9ab) );--_nys-button-border-color: var( --nys-button-border-color, var(--nys-color-transparent, #ffffff00) );--_nys-button-background-color--hover: var( --nys-button-background-color--hover, var(--nys-color-transparent, #ffffff00) );--_nys-button-color--hover: var( --nys-button-color--hover, var(--nys-color-link-reverse-strong, #ededed) );--_nys-button-border-color--hover: var( --nys-button-border-color--hover, var(--nys-color-transparent, #ffffff00) );--_nys-button-background-color--active: var( --nys-button-background-color--active, var(--nys-color-transparent, #ffffff00) );--_nys-button-color--active: var( --nys-button-color--active, var(--nys-color-reverse-strongest, #ffffff) );--_nys-button-border-color--active: var( --nys-button-border-color--active, var(--nys-color-transparent, #ffffff00) );--_nys-button-background-color--disabled: var( --nys-color-transparent, #ffffff00 );--_nys-button-color--disabled: var( --nys-color-text-reverse-disabled, #62666a );--_nys-button-border-color--disabled: var(--nys-color-transparent, #ffffff00)}:host([variant=ghost][inverted]){--_nys-button-background-color: var( --nys-button-background-color, var(--nys-color-transparent, #ffffff00) );--_nys-button-color: var( --nys-button-color, var(--nys-color-text-reverse, #ffffff) );--_nys-button-border-color: var( --nys-button-border-color, var(--nys-color-transparent, #ffffff00) );--_nys-button-background-color--hover: var( --nys-button-background-color--hover, var(--nys-color-white-transparent-200, #ffffff33) );--_nys-button-color--hover: var( --nys-button-color--hover, var(--nys-color-text-reverse, #ffffff) );--_nys-button-border-color--hover: var( --nys-button-border-color--hover, var(--nys-color-transparent, #ffffff00) );--_nys-button-background-color--active: var( --nys-button-background-color--active, var(--nys-color-white-transparent-300, #ffffff4d) );--_nys-button-color--active: var( --nys-button-color--active, var(--nys-color-text-reverse, #ffffff) );--_nys-button-border-color--active: var( --nys-button-border-color--active, var(--nys-color-transparent, #ffffff00) );--_nys-button-background-color--disabled: var( --nys-color-transparent, #ffffff00 );--_nys-button-color--disabled: var(--nys-color-text-disabled, #62666a);--_nys-button-border-color--disabled: var(--nys-color-transparent, #ffffff00)}:host([inverted]){--_nys-button-outline-color: var(--nys-color-focus-reverse, #7aa5e7)}:host([circle]){--_nys-button-width: var(--_nys-button-height);--_nys-button-border-radius: var(--nys-radius-round, 1776px);--_nys-button-padding--y: 0;--_nys-button-padding--x: 0}:host([circle]) .nys-button{max-width:var(--_nys-button-height);max-height:var(--_nys-button-height)}.nys-button{width:var(--_nys-button-width);min-height:var(--_nys-button-height);border-radius:var(--_nys-button-border-radius);padding:var(--_nys-button-padding--y) var(--_nys-button-padding--x);display:flex;align-items:center;justify-content:var(--_nys-button-justify-content);gap:var(--_nys-button-gap);font-family:var(--_nys-button-font-family);font-size:var(--_nys-button-font-size);font-weight:var(--_nys-button-font-weight);line-height:var(--_nys-button-line-height);text-decoration:var(--_nys-button-text-decoration);box-sizing:border-box;background-color:var(--_nys-button-background-color);color:var(--_nys-button-color);border-color:var(--_nys-button-border-color);border-style:var(--_nys-button-border-style);border-width:var(--_nys-button-border-width);cursor:var(--_nys-button-cursor)}.nys-button:hover{background-color:var(--_nys-button-background-color--hover);color:var(--_nys-button-color--hover);border-color:var(--_nys-button-border-color--hover);text-decoration-thickness:var(--_nys-button-text-decoration-thickness--hover, auto)}.nys-button:active,.nys-button.active{background-color:var(--_nys-button-background-color--active);color:var(--_nys-button-color--active);border-color:var(--_nys-button-border-color--active);text-decoration-thickness:var(--_nys-button-text-decoration-thickness--active, auto)}.nys-button:disabled,a[disabled]{background-color:var(--_nys-button-background-color--disabled);color:var(--_nys-button-color--disabled);border-color:var(--_nys-button-border-color--disabled);--_nys-button-cursor: not-allowed}a[disabled]{pointer-events:none}.nys-button:focus-visible,.active-focus{outline-offset:var(--_nys-button-outline-offset);outline:solid var(--_nys-button-outline-width) var(--_nys-button-outline-color)}.nys-button__text{display:flex;align-items:center;-webkit-user-select:none;user-select:none}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;border:0}';
var C = Object.defineProperty;
var r = (c21, t11, e5, l17) => {
  for (var s13 = void 0, b24 = c21.length - 1, u17; b24 >= 0; b24--)
    (u17 = c21[b24]) && (s13 = u17(t11, e5, s13) || s13);
  return s13 && C(t11, e5, s13), s13;
};
var y2 = class y3 extends S2 {
  constructor() {
    super(...arguments), this.id = "", this.name = "", this.size = "md", this.fullWidth = false, this.variant = "filled", this.inverted = false, this.label = "", this.ariaControls = "", this.ariaExpanded = "", this.ariaCurrent = "", this.prefixIcon = "", this.suffixIcon = "", this.circle = false, this.icon = "", this.disabled = false, this.form = null, this.value = "", this.ariaDescribedBy = "", this.type = "button", this.onClick = null, this.href = "", this.target = "_self", this._hasPrefixSlot = false, this._hasSuffixSlot = false, this._hasCircleSlot = false;
  }
  /**
   * Functions
   * --------------------------------------------------------------------------
   *
   * Form association, ElementInternals, and id generation are provided by
   * NysFormControlElement (@nysds/internals). super.connectedCallback() assigns
   * an id when one is not provided (prefix = the element's localName).
   */
  _onPrefixSlotChange(t11) {
    const e5 = t11.target;
    this._hasPrefixSlot = e5.assignedElements({ flatten: true }).length > 0;
  }
  _onSuffixSlotChange(t11) {
    const e5 = t11.target;
    this._hasSuffixSlot = e5.assignedElements({ flatten: true }).length > 0;
  }
  _onCircleSlotChange(t11) {
    const e5 = t11.target;
    this._hasCircleSlot = e5.assignedElements({ flatten: true }).length > 0;
  }
  _manageFormAction() {
    typeof this.onClick == "function" && this.onClick !== null && this.onClick(new Event("click"));
    const t11 = this.internals?.form;
    if (t11)
      switch (this.type) {
        case "submit":
          t11.requestSubmit();
          break;
        case "reset":
          t11.reset();
          break;
      }
  }
  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */
  _handleFocus() {
    this.dispatchEvent(
      new Event("nys-focus", { bubbles: true, composed: true })
    );
  }
  _handleBlur() {
    this.shadowRoot?.querySelector(".nys-button")?.classList.remove("active-focus"), this.dispatchEvent(
      new Event("nys-blur", { bubbles: true, composed: true })
    );
  }
  _handleClick(t11) {
    if (this.disabled) {
      t11.preventDefault();
      return;
    }
    this._manageFormAction(), this.dispatchEvent(
      new Event("nys-click", { bubbles: true, composed: true })
    );
  }
  _handleKeydown(t11) {
    if (t11.code === "Space" || t11.code === "Enter" || t11.key === " " || t11.key === "Enter") {
      if (this.disabled) return;
      t11.preventDefault();
      const e5 = this.renderRoot.querySelector(".nys-button");
      if (e5?.classList.add("active"), setTimeout(() => e5?.classList.remove("active"), 150), this.href) {
        const l17 = this.renderRoot.querySelector(
          "a.nys-button"
        );
        l17 && l17.click();
      } else
        this._handleAnyAttributeFunction(), this._handleClick(t11);
    }
  }
  _handleKeyup(t11) {
    (t11.code === "Space" || t11.code === "Enter" || t11.key === " " || t11.key === "Enter") && this.renderRoot.querySelector(".nys-button")?.classList.remove("active");
  }
  /**
   * Handles inline onclick attributes for keyboard activation.
   *
   * Native clicks execute inline onclick attributes automatically, but
   * keyboard activation of the custom element does not trigger that native
   * behavior. Dispatching a synthetic click lets the browser's own inline
   * event handler mechanism execute any onclick attribute safely without
   * eval() or new Function().
   */
  _handleAnyAttributeFunction() {
    this.click();
  }
  focus(t11) {
    const e5 = this.renderRoot.querySelector(
      this.href ? "a.nys-button" : "button.nys-button"
    );
    e5 ? e5.focus(t11) : super.focus(t11);
  }
  render() {
    return html`
      ${this.href ? html`
            <div class="nys-button__linkwrapper">
              <a
                class="nys-button"
                name=${ifDefined(this.name ? this.name : void 0)}
                ?disabled=${this.disabled}
                aria-disabled="${this.disabled ? "true" : "false"}"
                value=${ifDefined(this.value ? this.value : void 0)}
                href=${this.href}
                target=${this.target}
                @click=${this._handleClick}
                @focus="${this._handleFocus}"
                @blur="${this._handleBlur}"
                @keydown="${this._handleKeydown}"
                @keyup="${this._handleKeyup}"
                aria-describedby=${ifDefined(this.ariaDescribedBy || void 0)}
                aria-expanded=${ifDefined(this.ariaExpanded || void 0)}
                aria-current=${ifDefined(this.ariaCurrent || void 0)}
              >
                <slot
                  name="prefix-icon"
                  @slotchange=${this._onPrefixSlotChange}
                  ?hidden=${!this.prefixIcon && !this._hasPrefixSlot}
                >
                  ${this.prefixIcon ? html`<nys-icon
                        size="16"
                        name=${this.prefixIcon}
                      ></nys-icon>` : ""}
                </slot>
                ${this.circle ? html`<div class="nys-button__text sr-only">
                      ${this.label}
                    </div>` : this.label ? html`<div class="nys-button__text">${this.label}</div>` : html` <slot class="nys-button__default-slot"></slot> `}
                <slot
                  name="suffix-icon"
                  @slotchange=${this._onSuffixSlotChange}
                  ?hidden=${!this.suffixIcon && !this._hasSuffixSlot}
                >
                  ${this.suffixIcon ? html`<nys-icon
                        size="16"
                        name=${this.suffixIcon}
                      ></nys-icon>` : ""}
                </slot>
                <slot
                  name="circle-icon"
                  @slotchange=${this._onCircleSlotChange}
                  ?hidden=${!this.circle || !this.icon && !this._hasCircleSlot}
                >
                  ${this.icon ? html`<nys-icon
                        size=${this.size === "sm" ? "24" : this.size === "lg" ? "40" : "32"}
                        name=${this.icon}
                      ></nys-icon>` : ""}
                </slot>
              </a>
            </div>
          ` : html`
            <button
              class="nys-button"
              name=${ifDefined(this.name ? this.name : void 0)}
              ?disabled=${this.disabled}
              form=${ifDefined(this.form || void 0)}
              value=${ifDefined(this.value ? this.value : void 0)}
              type=${this.type}
              aria-controls=${ifDefined(this.ariaControls || void 0)}
              @click=${this._handleClick}
              @focus=${this._handleFocus}
              @blur=${this._handleBlur}
              @keydown=${this._handleKeydown}
              @keyup=${this._handleKeyup}
              aria-describedby=${ifDefined(this.ariaDescribedBy || void 0)}
              aria-expanded=${ifDefined(this.ariaExpanded || void 0)}
              aria-current=${ifDefined(this.ariaCurrent || void 0)}
            >
              <slot
                name="prefix-icon"
                @slotchange=${this._onPrefixSlotChange}
                ?hidden=${!this.prefixIcon && !this._hasPrefixSlot}
              >
                ${this.prefixIcon ? html`<nys-icon
                      size="16"
                      name=${this.prefixIcon}
                    ></nys-icon>` : ""}
              </slot>
              ${this.circle ? html`<div class="nys-button__text sr-only">
                    ${this.label}
                  </div>` : this.label ? html`<div class="nys-button__text">${this.label}</div>` : html` <slot class="nys-button__default-slot"></slot> `}
              <slot
                name="suffix-icon"
                @slotchange=${this._onSuffixSlotChange}
                ?hidden=${!this.suffixIcon && !this._hasSuffixSlot}
              >
                ${this.suffixIcon ? html`<nys-icon
                      size="16"
                      name=${this.suffixIcon}
                    ></nys-icon>` : ""}
              </slot>
              <slot
                name="circle-icon"
                @slotchange=${this._onCircleSlotChange}
                ?hidden=${!this.circle || !this.icon && !this._hasCircleSlot}
              >
                ${this.icon ? html`<nys-icon
                      size=${this.size === "sm" ? "24" : this.size === "lg" ? "40" : "32"}
                      name=${this.icon}
                    ></nys-icon>` : ""}
              </slot>
            </button>
          `}
    `;
  }
};
y2.styles = unsafeCSS(w3), y2.shadowRootOptions = __spreadProps(__spreadValues({}, LitElement.shadowRootOptions), {
  delegatesFocus: true
});
var o2 = y2;
r([
  property({ type: String, reflect: true })
], o2.prototype, "id");
r([
  property({ type: String, reflect: true })
], o2.prototype, "name");
r([
  property({ type: String, reflect: true })
], o2.prototype, "size");
r([
  property({ type: Boolean, reflect: true })
], o2.prototype, "fullWidth");
r([
  property({ type: String, reflect: true })
], o2.prototype, "variant");
r([
  property({ type: Boolean, reflect: true })
], o2.prototype, "inverted");
r([
  property({ type: String })
], o2.prototype, "label");
r([
  property({ type: String })
], o2.prototype, "ariaControls");
r([
  property({ type: String })
], o2.prototype, "ariaExpanded");
r([
  property({ type: String })
], o2.prototype, "ariaCurrent");
r([
  property({ type: String })
], o2.prototype, "prefixIcon");
r([
  property({ type: String })
], o2.prototype, "suffixIcon");
r([
  property({ type: Boolean, reflect: true })
], o2.prototype, "circle");
r([
  property({ type: String })
], o2.prototype, "icon");
r([
  property({ type: Boolean, reflect: true })
], o2.prototype, "disabled");
r([
  property({ type: String, reflect: true })
], o2.prototype, "form");
r([
  property({ type: String })
], o2.prototype, "value");
r([
  property({ type: String })
], o2.prototype, "ariaDescribedBy");
r([
  property({ type: String, reflect: true })
], o2.prototype, "type");
r([
  property({ attribute: false })
], o2.prototype, "onClick");
r([
  property({ type: String })
], o2.prototype, "href");
r([
  property({ type: String, reflect: true })
], o2.prototype, "target");
r([
  state()
], o2.prototype, "_hasPrefixSlot");
r([
  state()
], o2.prototype, "_hasSuffixSlot");
r([
  state()
], o2.prototype, "_hasCircleSlot");
customElements.get("nys-button") || customElements.define("nys-button", o2);

// ../../nys-alert/dist/nys-alert.js
var f2 = 0;
function g3(s13) {
  return `${s13}-${Date.now()}-${f2++}`;
}
var u = (s13) => {
  class t11 extends s13 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = g3(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return t11;
};
var m4 = u(LitElement);
var b3 = ':host{--_nys-alert-border-width: var(--nys-border-width-lg, 4px);--_nys-alert-border-radius: var(--nys-radius-md, 4px);--_nys-alert-color: var( --nys-alert-color, var(--nys-color-text, var(--nys-color-neutral-900, #1b1b1b)) );--_nys-alert-color--link: var( --nys-alert-color--link, var(--nys-color-link, var(--nys-color-blue-600, #004dd1)) );--_nys-alert-color--link--hover: var( --nys-alert-color--link--hover, var(--nys-color-link-strong, var(--nys-color-blue-700, #003ba1)) );--_nys-alert-color--link--active: var( --nys-alert-color--link--active, var(--nys-color-link-strongest, var(--nys-color-blue-800, #002971)) );--_nys-alert-padding: var(--nys-space-250, 20px);--_nys-alert-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-alert-font-size: var(--nys-font-size-ui-md, 16px);--_nys-alert-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-alert-letter-spacing: var( --nys-font-letterspacing-ui-md, var(--nys-font-letterspacing-400, .044px) );--_nys-alert-font-weight--regular: var(--nys-font-weight-regular, 400);--_nys-alert-font-weight--semibold: var(--nys-font-weight-semibold, 600);--_nys-alert-border-color: var( --nys-alert-border-color, var(--nys-color-base, var(--nys-color-neutral-600, #62666a)) );--_nys-alert-background-color: var( --nys-alert-background-color, var(--nys-color-base-weak, var(--nys-color-neutral-10, #f6f6f6)) );--_nys-alert-gap--icon: var(--nys-space-150, 12px);--_nys-alert-gap--text: var(--nys-space-50, 4px);--_nys-alert-gap--actions: var(--nys-space-150, 12px)}.nys-alert__container{display:flex;background-color:var(--_nys-alert-background-color);border-inline-start:var(--_nys-alert-border-width) solid var(--_nys-alert-border-color);border-radius:var(--_nys-alert-border-radius);color:var(--_nys-alert-color);padding:var(--_nys-alert-padding);font-style:normal;font-family:var(--_nys-alert-font-family);font-size:var(--_nys-alert-font-size);line-height:var(--_nys-alert-line-height);letter-spacing:var(--_nys-alert-letter-spacing);gap:var(--_nys-alert-gap--icon)}p{margin:0}::slotted(p){margin-bottom:0!important}.nys-alert__icon{margin-top:-2px}a,a:visited{font-weight:var(--_nys-alert-font-weight--semibold);font-size:var(--_nys-alert-font-size);color:var(--_nys-alert-color--link)}a:hover{color:var(--_nys-alert-color--link--hover)}a:active{color:var(--_nys-alert-color--link--active)}::slotted(a){color:var(--_nys-alert-color--link)}.nys-alert__texts{display:flex;flex-direction:column;flex:1;gap:var(--_nys-alert-gap--text)}.nys-alert__header{margin:0;font-weight:var(--_nys-alert-font-weight--semibold)}.nys-alert__text{font-weight:var(--_nys-alert-font-weight--regular);margin:0}::slotted(*){font-weight:var(--_nys-alert-font-weight--regular);margin:0}.nys-alert--centered{display:flex;align-items:center}.nys-alert--centered .nys-alert__header{margin-bottom:-3px}.nys-alert--centered div[part=nys-alert__icon]{margin-top:0;display:flex;align-items:center;justify-content:center}.nys-alert__actions{display:flex;gap:var(--_nys-alert-gap--actions);flex-wrap:wrap}#dismiss-btn{margin-top:-8px}:host([type=info]){--_nys-alert-border-color: var( --nys-alert-border-color, var(--nys-color-info, var(--nys-color-blue-600, #004dd1)) );--_nys-alert-background-color: var( --nys-alert-background-color, var(--nys-color-info-weak, var(--nys-color-blue-50, #e5effa)) )}:host([type=success]){--_nys-alert-border-color: var( --nys-alert-border-color, var(--nys-color-success, var(--nys-color-green-600, #1e752e)) );--_nys-alert-background-color: var( --nys-alert-background-color, var(--nys-color-success-weak, var(--nys-color-green-50, #e8f1ea)) )}:host([type=warning]){--_nys-alert-border-color: var( --nys-alert-border-color, var(--nys-color-warning, var(--nys-color-yellow-400, #face00)) );--_nys-alert-background-color: var( --nys-alert-background-color, var(--nys-color-warning-weak, var(--nys-color-yellow-50, #fefae5)) )}:host([type=danger]){--_nys-alert-border-color: var( --nys-alert-border-color, var(--nys-color-danger, var(--nys-color-red-600, #b52c2c)) );--_nys-alert-background-color: var( --nys-alert-background-color, var(--nys-color-danger-weak, var(--nys-color-red-50, #f7eaea)) )}:host([type=emergency]){--_nys-alert-border-color: var( --nys-alert-border-color, var(--nys-color-emergency, var(--nys-color-red-800, #721c1c)) );--_nys-alert-background-color: var( --nys-alert-background-color, var(--nys-color-emergency, var(--nys-color-red-800, #721c1c)) );--_nys-alert-color: var( --nys-alert-color, var(--nys-color-text-reverse, var(--nys-color-white, #ffffff)) );--_nys-alert-color--link: var( --nys-alert-color--link, var(--nys-color-link-reverse-neutral, var(--nys-color-white, #ffffff)) );--_nys-alert-color--link--hover: var( --nys-alert-color--link--hover, var(--nys-color-link-reverse-neutral, var(--nys-color-white, #ffffff)) );--_nys-alert-color--link--active: var( --nys-alert-color--link--active, var(--nys-color-link-reverse-neutral, var(--nys-color-white, #ffffff)) )}:host([type=emergency]) a:hover{text-decoration-thickness:2px}:host([type=emergency]) a:active{text-decoration-thickness:3px}';
var k2 = Object.defineProperty;
var r2 = (s13, t11, a12, i21) => {
  for (var l17 = void 0, c21 = s13.length - 1, v20; c21 >= 0; c21--)
    (v20 = s13[c21]) && (l17 = v20(t11, a12, l17) || l17);
  return l17 && k2(t11, a12, l17), l17;
};
var d2 = class d3 extends m4 {
  constructor() {
    super(...arguments), this.id = "", this.heading = "", this.icon = "", this.dismissible = false, this.duration = 0, this.text = "", this.primaryAction = "", this.secondaryAction = "", this.primaryLabel = "Learn more", this.secondaryLabel = "Dismiss", this.type = "base", this._alertClosed = false, this._slotHasContent = true, this._timeoutId = null;
  }
  /**
   * Returns the ARIA role and aria-live setting for the alert's live region based on type.
   * - `warning`/`danger`/`emergency` => role="alert", aria-live="assertive" (urgent, interrupts)
   * - `base`/`info`/`success` => role="status", aria-live="polite" (waits its turn)
   *
   * `aria-live` is set explicitly alongside `role` (rather than relying on the role's implicit
   * live-region semantics) for more consistent behavior across browser/AT combinations.
   */
  get ariaAttributes() {
    const t11 = this.type === "warning" || this.type === "danger" || this.type === "emergency";
    return {
      role: t11 ? "alert" : "status",
      ariaLive: t11 ? "assertive" : "polite"
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.duration > 0 && (this._timeoutId = setTimeout(() => {
      this._closeAlert();
    }, this.duration));
  }
  disconnectedCallback() {
    this._timeoutId && clearTimeout(this._timeoutId), super.disconnectedCallback();
  }
  firstUpdated() {
    this._checkSlotContent();
  }
  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  _resolveIconName() {
    return this.icon || this._checkAltNaming();
  }
  _checkAltNaming() {
    return this.type === "success" ? "check_circle" : this.type === "base" ? "info" : this.type === "danger" ? "error" : this.type === "emergency" ? "emergency_home" : this.type;
  }
  _closeAlert() {
    this._alertClosed = true, this.dispatchEvent(
      new CustomEvent("nys-close", {
        detail: { id: this.id, type: this.type, label: this.heading },
        bubbles: true,
        composed: true
      })
    );
  }
  /**
   * Checks whether the default slot has content.
   * Updates `_slotHasContent` accordingly.
   */
  async _checkSlotContent() {
    const t11 = this.shadowRoot?.querySelector("slot");
    if (t11) {
      const a12 = t11.assignedNodes({ flatten: true }).filter(
        (i21) => i21.nodeType === Node.ELEMENT_NODE || i21.nodeType === Node.TEXT_NODE && i21.textContent?.trim()
      );
      await Promise.resolve(), this._slotHasContent = a12.length > 0;
    } else
      await Promise.resolve(), this._slotHasContent = false;
  }
  render() {
    const { role: t11, ariaLive: a12 } = this.ariaAttributes;
    return html`
      ${this._alertClosed ? "" : html` <div
            class="nys-alert__container ${this._slotHasContent || this.text?.trim().length > 0 ? "" : "nys-alert--centered"}"
          >
            <div part="nys-alert__icon" class="nys-alert__icon">
              <nys-icon
                name="${this._resolveIconName()}"
                size="3xl"
                label="${this.type} icon"
              ></nys-icon>
            </div>
            <div
              class="nys-alert__texts"
              role=${t11}
              aria-live=${a12}
              aria-atomic="true"
            >
              ${this.heading?.trim() ? html`<p class="nys-alert__header">${this.heading}</p>` : ""}
              ${this._slotHasContent ? html`<slot></slot>` : this.text?.trim().length > 0 ? html`<p class="nys-alert__text">${this.text}</p>` : ""}
              ${this.primaryAction || this.secondaryAction ? html`<div class="nys-alert__actions">
                    ${this.primaryAction ? html`<a
                          href=${ifDefined(this.primaryAction || void 0)}
                          class="nys-alert__action nys-alert__primary"
                        >
                          ${this.primaryLabel}
                        </a>` : ""}
                    ${this.secondaryAction ? html`<a
                          href=${ifDefined(this.secondaryAction || void 0)}
                          class="nys-alert__action nys-alert__secondary"
                        >
                          ${this.secondaryLabel}
                        </a>` : ""}
                  </div> ` : ""}
            </div>
            ${this.dismissible ? html` <nys-button
                  id="dismiss-btn"
                  variant="ghost"
                  circle
                  icon="close"
                  size="sm"
                  ?inverted=${this.type === "emergency"}
                  label="${this.heading}, alert, Close"
                  @nys-click=${this._closeAlert}
                  style=${ifDefined(
      this.type === "emergency" ? "--_nys-button-outline-color: var(--nys-color-ink-reverse, var(--nys-color-white, #fff));" : void 0
    )}
                ></nys-button>` : ""}
          </div>`}
    `;
  }
};
d2.styles = unsafeCSS(b3);
var e = d2;
r2([
  property({ type: String, reflect: true })
], e.prototype, "id");
r2([
  property({ type: String })
], e.prototype, "heading");
r2([
  property({ type: String })
], e.prototype, "icon");
r2([
  property({ type: Boolean, reflect: true })
], e.prototype, "dismissible");
r2([
  property({ type: Number, reflect: true })
], e.prototype, "duration");
r2([
  property({ type: String })
], e.prototype, "text");
r2([
  property({ type: String })
], e.prototype, "primaryAction");
r2([
  property({ type: String })
], e.prototype, "secondaryAction");
r2([
  property({ type: String })
], e.prototype, "primaryLabel");
r2([
  property({ type: String })
], e.prototype, "secondaryLabel");
r2([
  property({ type: String, reflect: true })
], e.prototype, "type");
r2([
  state()
], e.prototype, "_alertClosed");
r2([
  state()
], e.prototype, "_slotHasContent");
customElements.get("nys-alert") || customElements.define("nys-alert", e);

// ../../nys-avatar/dist/nys-avatar.js
var w4 = 0;
function x3(c21) {
  return `${c21}-${Date.now()}-${w4++}`;
}
var $3 = (c21) => {
  class t11 extends c21 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = x3(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return t11;
};
var C2 = $3(LitElement);
var k3 = ":host{--_nys-avatar-border-radius: var(--nys-radius-round, 1776px);--_nys-avatar-size: var(--nys-avatar-size, var(--nys-font-size-6xl, 36px));--_nys-avatar-shape: var(--nys-radius-round, 1776px);--_nys-avatar-border-color: var(--nys-color-ink-reverse, #ffffff);--_nys-avatar-border-size: var(--nys-border-width-sm, 1px);--_nys-avatar-width: var(--nys-font-size-6xl, 36px);--_nys-avatar-color: var(--nys-color-theme, #154973);--_nys-avatar-background-color: var(--nys-color-theme-weaker, #eff6fb);--_nys-avatar-outline-color: var(--nys-color-focus, #004dd1);--_nys-avatar-outline-width: var(--nys-border-width-md, 2px);--_nys-avatar-outline-offset: var(--nys-space-2px, 2px)}.nys-avatar{display:inline-block}.nys-avatar__component{display:flex;justify-content:center;align-items:center;border-radius:var(--_nys-avatar-border-radius);width:var(--_nys-avatar-size);height:var(--_nys-avatar-size);font-size:var(--_nys-avatar-size);overflow:hidden;box-sizing:border-box;color:var(--_nys-avatar-color);background-color:var(--_nys-avatar-background-color);border:var(--_nys-avatar-border-size) solid var(--_nys-avatar-border-color);outline-offset:var(--_nys-avatar-outline-offset);transition:all .15s ease-in-out;-webkit-user-select:none;user-select:none}:host([interactive]:not([disabled])) button.nys-avatar__component{appearance:none;border:var(--_nys-avatar-border-size) solid var(--_nys-avatar-border-color);padding:0;cursor:pointer}:host([interactive]:not([disabled])) button.nys-avatar__component:hover{--_nys-avatar-background-color: var(--nys-color-theme-mid, #457aa5);--_nys-avatar-color: var(--nys-color-text-reverse, #ffffff)}:host([interactive]:not([disabled])) button.nys-avatar__component:active{--_nys-avatar-background-color: var(--nys-color-theme-strong, #0e324f);--_nys-avatar-color: var(--nys-color-text-reverse, #ffffff)}:host([interactive]:not([disabled])) button.nys-avatar__component:focus-visible{outline:solid var(--_nys-avatar-outline-width) var(--_nys-avatar-outline-color);outline-offset:var(--_nys-avatar-outline-offset)}:host([disabled]) .nys-avatar__component{--_nys-avatar-color: var(--nys-color-text-disabled, #bec0c1);--_nys-avatar-background-color: var(--nys-color-neutral-10, #f6f6f6);cursor:not-allowed}:host([disabled]) .nys-avatar__component:focus-within{outline:solid var(--_nys-avatar-outline-width) var(--_nys-avatar-outline-color)}div[part=nys-avatar__icon]{display:flex;align-items:center;justify-content:center}.nys-avatar__initials{display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:calc(var(--_nys-avatar-width) * .5);font-weight:700;text-transform:uppercase}.nys-avatar__image{width:100%;height:100%;object-fit:cover}.nys-avatar__icon{width:100%;height:100%;fill:currentcolor}";
var z = Object.defineProperty;
var n = (c21, t11, e5, o18) => {
  for (var r13 = void 0, i21 = c21.length - 1, v20; i21 >= 0; i21--)
    (v20 = c21[i21]) && (r13 = v20(t11, e5, r13) || r13);
  return r13 && z(t11, e5, r13), r13;
};
var h = class h2 extends C2 {
  constructor() {
    super(...arguments), this.id = "", this.ariaLabel = "", this.image = "", this.initials = "", this.icon = "", this.color = "", this.interactive = false, this.disabled = false, this.lazy = false, this._slotHasContent = false, this._warnedMissingName = false;
  }
  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */
  connectedCallback() {
    super.connectedCallback();
  }
  updated(t11) {
    super.updated(t11), this._warnMissingInteractiveName();
  }
  async _handleSlotChange() {
    const t11 = this.shadowRoot?.querySelector("slot");
    if (!t11) {
      this._slotHasContent = false;
      return;
    }
    await Promise.resolve();
    const e5 = t11.assignedNodes({ flatten: true }).filter(
      (o18) => o18.nodeType === Node.ELEMENT_NODE || o18.nodeType === Node.TEXT_NODE && o18.textContent?.trim()
    );
    this._slotHasContent = e5.length > 0;
  }
  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  /**
   * The label with all whitespace — including the non-breaking space consumers
   * reach for when they want "no label but the prop is required" — collapsed and
   * trimmed. A name made only of blank characters is announced as an empty name,
   * so `" "` and `"&nbsp;"` must resolve to no label at all rather than to a
   * label the user can neither hear nor act on.
   */
  get _cleanAriaLabel() {
    return (this.ariaLabel ?? "").replace(/[\s\u00a0]+/g, " ").trim();
  }
  /**
   * Warns when an interactive avatar has no accessible name.
   *
   * An interactive avatar renders a `<button>`, and a button with no name is
   * unusable by screen reader and voice-control users (WCAG 4.1.2). The component
   * used to paper over this with a captive default name of "Avatar", which told
   * the user nothing ("button, avatar") and hid the mistake from audits (#1093).
   * The name is the author's to supply, so the component surfaces the gap here
   * instead of inventing one. `ariaLabel` deliberately stays optional —
   * decorative avatars are legitimate, and making it required would break the
   * consumers already shipping without it.
   */
  _warnMissingInteractiveName() {
    if (!this.interactive || this._cleanAriaLabel) {
      this._warnedMissingName = false;
      return;
    }
    this._warnedMissingName || (this._warnedMissingName = true, console.warn(
      `nys-avatar: interactive avatar "${this.id}" has no accessible name — set ariaLabel to describe who or what it represents (WCAG 4.1.2).`
    ));
  }
  _colorStyle() {
    if (!this.color) return "";
    const t11 = this.getContrastForeground() ?? "";
    return `--_nys-avatar-background-color: ${this.color}; --_nys-avatar-color: ${t11}; color: ${t11}`;
  }
  /**
   * Computes the appropriate foreground color (icon or initials)
   * based on the avatar's background color for sufficient contrast.
   *
   * @returns CSS color string for foreground
   */
  getContrastForeground() {
    const t11 = "var(--nys-color-ink, #000)", e5 = "var(--nys-color-ink-reverse, #fff)", o18 = "var(--nys-color-text, #000)", r13 = "var(--nys-color-text-reverse, #fff)";
    if (!this.color) return;
    const i21 = document.createElement("div");
    i21.style.color = this.color, document.body.appendChild(i21);
    const v20 = getComputedStyle(i21).color;
    document.body.removeChild(i21);
    const y17 = v20.match(/\d+/g);
    if (!y17) return;
    const f21 = Number(y17[0]), _17 = Number(y17[1]), p19 = Number(y17[2]), u17 = (0.299 * f21 + 0.587 * _17 + 0.114 * p19) / 255 < 0.5;
    return this.initials?.length > 0 ? u17 ? r13 : o18 : u17 ? e5 : t11;
  }
  render() {
    const t11 = this._cleanAriaLabel, e5 = this._colorStyle(), o18 = this.image?.length > 0 ? html`<img
            part="nys-avatar__image"
            class="nys-avatar__image"
            src=${this.image}
            alt=${t11 || ""}
            loading=${this.lazy ? "lazy" : "eager"}
          />` : this.initials?.length > 0 ? html`<span
              part="nys-avatar__initials"
              class="nys-avatar__initials"
              aria-hidden="true"
              >${this.initials}</span
            >` : html`<div part="nys-avatar__icon">
              <slot @slotchange=${this._handleSlotChange}></slot>
              ${this._slotHasContent ? null : html`<nys-icon
                    aria-hidden="true"
                    name=${this.icon?.length > 0 ? this.icon : "account_circle"}
                  ></nys-icon>`}
            </div>`, r13 = this.interactive ? html`<button
          part="nys-avatar"
          class="nys-avatar__component"
          style=${ifDefined(e5 || void 0)}
          aria-label=${ifDefined(t11 || void 0)}
          ?disabled=${this.disabled}
        >
          ${o18}
        </button>` : html`<div
          part="nys-avatar"
          class="nys-avatar__component"
          style=${ifDefined(e5 || void 0)}
          role=${ifDefined(this.image ? void 0 : t11 ? "img" : void 0)}
          aria-label=${ifDefined(this.image ? void 0 : t11 || void 0)}
          aria-hidden=${ifDefined(this.image || t11 ? void 0 : "true")}
        >
          ${o18}
        </div>`;
    return html`
      <div class="nys-avatar">
        <div class="nys-avatar__content">${r13}</div>
      </div>
    `;
  }
};
h.styles = unsafeCSS(k3);
var a4 = h;
n([
  property({ type: String, reflect: true })
], a4.prototype, "id");
n([
  property({ type: String })
], a4.prototype, "ariaLabel");
n([
  property({ type: String })
], a4.prototype, "image");
n([
  property({ type: String })
], a4.prototype, "initials");
n([
  property({ type: String })
], a4.prototype, "icon");
n([
  property({ type: String })
], a4.prototype, "color");
n([
  property({ type: Boolean, reflect: true })
], a4.prototype, "interactive");
n([
  property({ type: Boolean, reflect: true })
], a4.prototype, "disabled");
n([
  property({ type: Boolean, reflect: true })
], a4.prototype, "lazy");
n([
  state()
], a4.prototype, "_slotHasContent");
customElements.get("nys-avatar") || customElements.define("nys-avatar", a4);

// ../../nys-backtotop/dist/nys-backtotop.js
var b4 = 0;
function m5(o18) {
  return `${o18}-${Date.now()}-${b4++}`;
}
var y4 = (o18) => {
  class e5 extends o18 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = m5(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return e5;
};
var w5 = y4(LitElement);
var v3 = ".nys-backtotop{--_nys-button-border-radius: var(--nys-radius-round, 1776px);--_nys-button-padding--y: var(--nys-space-100, 8px);--_nys-button-padding--x: var(--nys-space-200, 16px);position:fixed;bottom:1rem;right:1rem;z-index:9999;display:none}.left{left:1rem;right:auto}.visible{display:inline-flex}";
var _ = Object.defineProperty;
var n2 = (o18, e5, t11, r13) => {
  for (var s13 = void 0, l17 = o18.length - 1, a12; l17 >= 0; l17--)
    (a12 = o18[l17]) && (s13 = a12(e5, t11, s13) || s13);
  return s13 && _(e5, t11, s13), s13;
};
var c3 = class c4 extends w5 {
  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */
  constructor() {
    super(), this.id = "", this.position = "right", this.visible = false, this.isMobile = false, this.forceVisible = false, this.mediaQuery = null, this._handleScroll = this._handleScroll.bind(this), this._handleResize = this._handleResize.bind(this);
  }
  connectedCallback() {
    super.connectedCallback(), !(typeof window > "u") && (this.mediaQuery = window.matchMedia("(max-width: 480px)"), this.forceVisible = this.hasAttribute("visible"), window.addEventListener("scroll", this._handleScroll), this.mediaQuery.addEventListener("change", this._handleResize), this._handleResize());
  }
  disconnectedCallback() {
    typeof window < "u" && (window.removeEventListener("scroll", this._handleScroll), this.mediaQuery?.removeEventListener("change", this._handleResize)), super.disconnectedCallback();
  }
  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  _handleScroll() {
    if (typeof window > "u" || this.forceVisible) return;
    const e5 = window.innerHeight, t11 = document.documentElement.scrollHeight;
    this.visible = t11 >= e5 * 4 && window.scrollY > e5 * 1.5;
  }
  _scrollToTop() {
    if (typeof window > "u") return;
    const t11 = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches ? "auto" : "smooth";
    if (window.scrollY === 0) {
      window.scrollTo({ top: 0, behavior: t11 }), this._moveFocusToTop();
      return;
    }
    window.scrollTo({ top: 0, behavior: t11 });
    const r13 = () => {
      window.removeEventListener("scroll", r13), this._moveFocusToTop();
    };
    window.addEventListener("scroll", r13, { once: true });
  }
  _moveFocusToTop() {
    document.body.hasAttribute("tabindex") || document.body.setAttribute("tabindex", "-1"), document.body.focus();
  }
  _handleResize() {
    this.mediaQuery && (this.isMobile = this.mediaQuery.matches);
  }
  render() {
    const e5 = [
      "nys-backtotop",
      this.position,
      this.visible ? "visible" : ""
    ].filter(Boolean).join(" ");
    return html`<nys-button
      prefixIcon="chevron_up"
      variant="outline"
      label="Back to top"
      size="sm"
      class="${e5}"
      ?circle=${this.isMobile}
      @nys-click=${this._scrollToTop}
    ></nys-button>`;
  }
};
c3.styles = unsafeCSS(v3);
var i3 = c3;
n2([
  property({ type: String, reflect: true })
], i3.prototype, "id");
n2([
  property({ type: String })
], i3.prototype, "position");
n2([
  property({ type: Boolean, reflect: true })
], i3.prototype, "visible");
n2([
  state()
], i3.prototype, "isMobile");
n2([
  state()
], i3.prototype, "forceVisible");
customElements.get("nys-backtotop") || customElements.define("nys-backtotop", i3);

// ../../nys-badge/dist/nys-badge.js
var b5 = 0;
function h3(n13) {
  return `${n13}-${Date.now()}-${b5++}`;
}
var p3 = (n13) => {
  class e5 extends n13 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = h3(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return e5;
};
var u2 = p3(LitElement);
var _2 = ':host{--_nys-badge-width: fit-content;--_nys-badge-height: var(--nys-size-600, 48px);--_nys-badge-radius: var(--nys-radius-round, 1776px);--_nys-badge-padding: var(--nys-space-2-px, 2px) var(--nys-space-100, 8px);--_nys-badge-gap: var(--nys-space-50, 4px);--_nys-badge-color: var(--nys-color-ink, #000000);--_nys-badge-background-color: var(--nys-color-base-weak, #f6f6f6);--_nys-badge-border-color: var(--nys-color-base, #62666a);--_nys-badge-border-width: var(--nys-border-width-sm, 1px);--_nys-badge-font-size: var(--nys-font-size-ui-sm, 14px);--_nys-badge-font-weight: var(--nys-font-weight-semibold, 600);--_nys-badge-line-height: var(--nys-font-lineheight-ui-sm, 24px);--_nys-badge-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-badge-prefix-font-weight: var(--nys-font-weight-regular, 400)}:host([size=sm]){--_nys-badge-font-size: var(--nys-font-size-ui-xs, 12px);--_nys-badge-line-height: var(--nys-font-lineheight-ui-xs, 20px)}:host([intent=base]){--_nys-badge-background-color: var(--nys-color-base-weak, #f6f6f6);--_nys-badge-border-color: var(--nys-color-base, #62666a)}:host([intent=danger]),:host([intent=error]){--_nys-badge-background-color: var(--nys-color-danger-weak, #f7eaea);--_nys-badge-border-color: var(--nys-color-danger-strong, #721c1c)}:host([intent=emergency]){--_nys-badge-background-color: var(--nys-color-emergency, #721c1c);--_nys-badge-border-color: var(--nys-color-danger-strong, #721c1c);--_nys-badge-color: var(--nys-color-white, #ffffff)}:host([intent=emergency]) .nys-badge{--nys-icon-color: var(--nys-color-white, #ffffff)}:host([intent=info]){--_nys-badge-background-color: var(--nys-color-info-weak, #e5effa);--_nys-badge-border-color: var(--nys-color-info-strong, #002971)}:host([intent=success]){--_nys-badge-background-color: var(--nys-color-success-weak, #e8f1ea);--_nys-badge-border-color: var(--nys-color-success-strong, #0f3d18)}:host([intent=warning]){--_nys-badge-background-color: var(--nys-color-warning-weak, #fefae5);--_nys-badge-border-color: var(--nys-color-warning-strong, #6a5700)}:host([strong]){--_nys-badge-background-color: var(--_nys-badge-border-color);--_nys-badge-color: var(--nys-color-white, #ffffff)}:host([strong]) .nys-badge{--nys-icon-color: var(--nys-color-white, #ffffff)}:host([strong][intent=info]){--_nys-badge-border-color: var(--nys-color-info, #004dd1)}:host([strong][intent=success]){--_nys-badge-border-color: var(--nys-color-success, #1e752e)}:host([strong][intent=danger]),:host([strong][intent=error]){--_nys-badge-border-color: var(--nys-color-danger, #b52c2c)}:host([strong][intent=emergency]){--_nys-badge-border-color: var(--nys-color-emergency, #721c1c)}:host([strong][intent=warning]){--_nys-badge-border-color: var(--nys-color-warning, #face00);--_nys-badge-color: var(--nys-color-ink, #000000)}:host([strong][intent=warning]) .nys-badge{--nys-icon-color: var(--nys-color-ink, #000000)}.nys-badge{display:flex;width:fit-content;align-items:center;justify-content:center;gap:var(--_nys-badge-gap);padding:var(--_nys-badge-padding);border:var(--_nys-badge-border-width) solid var(--_nys-badge-border-color);background-color:var(--_nys-badge-background-color);color:var(--_nys-badge-color);border-radius:var(--_nys-badge-radius);font-family:var(--_nys-badge-font-family);font-size:var(--_nys-badge-font-size);font-weight:var(--_nys-badge-font-weight);line-height:var(--_nys-badge-line-height);cursor:default;--nys-icon-color: var(--_nys-badge-border-color)}.nys-badge__prefix{font-weight:var(--_nys-badge-prefix-font-weight)}.nys-badge__sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}';
var x4 = Object.defineProperty;
var v4 = Object.getOwnPropertyDescriptor;
var i4 = (n13, e5, s13, a12) => {
  for (var c21 = a12 > 1 ? void 0 : a12 ? v4(e5, s13) : e5, g13 = n13.length - 1, y17; g13 >= 0; g13--)
    (y17 = n13[g13]) && (c21 = (a12 ? y17(e5, s13, c21) : y17(c21)) || c21);
  return a12 && c21 && x4(e5, s13, c21), c21;
};
var t;
var r3 = (t = class extends u2 {
  constructor() {
    super(...arguments), this.id = "", this.name = "", this.size = "md", this.intent = "base", this.prefixLabel = "", this.label = "", this.srText = "", this.strong = false, this._prefixIcon = "", this._suffixIcon = "";
  }
  get prefixIcon() {
    return this._prefixIcon;
  }
  set prefixIcon(e5) {
    e5 === "" || e5 === null ? this._prefixIcon = true : e5 === "false" || e5 === false ? this._prefixIcon = "" : this._prefixIcon = e5;
  }
  get suffixIcon() {
    return this._suffixIcon;
  }
  set suffixIcon(e5) {
    e5 === "" || e5 === null ? this._suffixIcon = true : e5 === "false" || e5 === false ? this._suffixIcon = "" : this._suffixIcon = e5;
  }
  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */
  connectedCallback() {
    super.connectedCallback();
    const e5 = this.getAttribute("prefixicon");
    e5 !== null && this.prefixIcon === "" && (this.prefixIcon = e5);
    const s13 = this.getAttribute("suffixicon");
    s13 !== null && this.suffixIcon === "" && (this.suffixIcon = s13);
  }
  /**
   * Resolves the screen-reader-only text describing the badge's semantic intent.
   * Returns null when no intent description should be announced.
   */
  resolveIntentSrText() {
    return this.srText ? null : t.INTENT_SR_TEXT[this.intent] ?? null;
  }
  /**
   * Resolves which icon should be rendered.
   * @param icon The icon property value (string or boolean)
   * @returns Icon name or null if no icon should be rendered
   */
  resolveIcon(e5) {
    return e5 === true ? t.DEFAULT_ICONS[this.intent] ?? "info" : typeof e5 == "string" && e5.trim() !== "" ? e5 : null;
  }
  render() {
    const e5 = this.resolveIcon(this.prefixIcon), s13 = this.resolveIcon(this.suffixIcon), a12 = this.resolveIntentSrText();
    return html`
      <mark class="nys-badge">
        ${e5 ? html`<nys-icon size="16" name=${e5}></nys-icon>` : ""}
        ${this.prefixLabel ? html`<div class="nys-badge__prefix">${this.prefixLabel}</div>` : ""}
        <div class="nys-badge__label">
          ${a12 ? html`<span class="nys-badge__sr-only"
                >${a12 + ": "}</span
              >` : ""}
          ${this.label}
          ${this.srText ? html`<span class="nys-badge__sr-only"
                >${": " + this.srText}</span
              >` : ""}
        </div>

        ${s13 ? html`<nys-icon size="16" name=${s13}></nys-icon>` : ""}
      </mark>
    `;
  }
}, t.styles = unsafeCSS(_2), t.DEFAULT_ICONS = {
  base: "info",
  info: "info",
  success: "check_circle",
  warning: "warning",
  danger: "error",
  error: "error",
  emergency: "emergency_home"
}, t.INTENT_SR_TEXT = {
  info: "Info",
  success: "Success",
  warning: "Warning",
  danger: "Danger",
  error: "Danger",
  emergency: "Emergency"
}, t);
i4([
  property({
    type: String,
    reflect: true,
    converter: {
      toAttribute: (n13) => n13 || void 0
    }
  })
], r3.prototype, "id", 2);
i4([
  property({
    type: String,
    reflect: true,
    converter: {
      toAttribute: (n13) => n13 || void 0
    }
  })
], r3.prototype, "name", 2);
i4([
  property({ type: String, reflect: true })
], r3.prototype, "size", 2);
i4([
  property({ type: String, reflect: true })
], r3.prototype, "intent", 2);
i4([
  property({ type: String })
], r3.prototype, "prefixLabel", 2);
i4([
  property({ type: String })
], r3.prototype, "label", 2);
i4([
  property({ type: String })
], r3.prototype, "srText", 2);
i4([
  property({ type: Boolean, reflect: true })
], r3.prototype, "strong", 2);
i4([
  property({ type: String, attribute: "prefixicon" })
], r3.prototype, "prefixIcon", 1);
i4([
  property({ type: String, attribute: "suffixicon" })
], r3.prototype, "suffixIcon", 1);
var m6 = r3;
customElements.get("nys-badge") || customElements.define("nys-badge", m6);

// ../../nys-breadcrumbs/dist/nys-breadcrumbs.js
var L2 = 0;
function B(b24) {
  return `${b24}-${Date.now()}-${L2++}`;
}
var z2 = (b24) => {
  class e5 extends b24 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = B(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return e5;
};
var I = z2(LitElement);
var M = '@charset "UTF-8";:host{--_nys-breadcrumbs-padding: var(--nys-space-150, 12px) var(--nys-space-250, 20px);--_nys-breadcrumbs-gap: var(--nys-space-100, 8px);--_nys-breadcrumbs-background: transparent;--_nys-breadcrumbitem-gap: var(--nys-space-50, 4px);--_nys-breadcrumbitem-color: var(--nys-color-text-weak, #4a4d4f);--_nys-breadcrumbitem-color--focus: var(--nys-color-focus, #004dd1);--_nys-breadcrumbitem-outline-width: var(--nys-border-width-md, 2px);--_nys-breadcrumbitem-outline-radius: var(--nys-radius-md, 4px);--_nys-breadcrumb-gap--ellipsis: var(--nys-space-100, 8px);--_nys-breadcrumb-color--ellipsis: var(--nys-color-text-weak, #4a4d4f);--_nys-breadcrumbs-font-size: var(--nys-font-size-ui-md, 16px);--_nys-breadcrumbs-font-weight: var(--nys-font-weight-semibold, 600);--_nys-breadcrumbs-font-weight--current: var(--nys-font-weight-regular, 400);--_nys-breadcrumbs-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-breadcrumbs-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-breadcrumbs-max-width--content: var( --nys-breadcrumbs-max-width--content, 1280px )}.nys-breadcrumbs{padding:var(--_nys-breadcrumbs-padding);font-family:var(--_nys-breadcrumbs-font-family);font-size:var(--_nys-breadcrumbs-font-size);font-weight:var(--_nys-breadcrumbs-font-weight);line-height:var(--_nys-breadcrumbs-line-height);background:var(--_nys-breadcrumbs-background);display:flex;justify-content:center}.nys-breadcrumbs.nys-breadcrumbs--background-bar{--_nys-breadcrumbs-background: var(--nys-color-theme-faint, #f7fafd)}.nys-breadcrumbs ol{padding:0;margin:0;display:flex;align-items:center;justify-content:flex-start;flex-wrap:wrap;gap:var(--_nys-breadcrumbs-gap);list-style:none;max-width:var(--_nys-breadcrumbs-max-width--content);width:100%}:host([size=sm]){--_nys-breadcrumbs-font-size: var(--nys-font-size-ui-sm, 14px)}:host([disabled]) .nys-breadcrumbitem a{cursor:not-allowed;--_nys-breadcrumbitem-color: var(--nys-color-text-disabled, #cec0c1)}:host([disabled]) .nys-breadcrumbitem a:hover{text-decoration:none}:host([disabled]) .nys-breadcrumbs__ellipsis .ellipsis-btn{cursor:not-allowed;opacity:.4;pointer-events:none}:host([disabled]) .nys-breadcrumbs__ellipsis .ellipsis-btn:hover{text-decoration:none}:host([disabled]) nys-icon{color:var(--nys-color-text-disabled, #cec0c1)}.nys-breadcrumbitem{padding:0;display:flex;align-items:center;gap:var(--_nys-breadcrumbitem-gap);color:var(--_nys-breadcrumbitem-color);font-weight:var(--_nys-breadcrumbs-font-weight--current);white-space:nowrap}.nys-breadcrumbitem.hide{display:none}.nys-breadcrumbitem a{text-decoration:none;color:var(--_nys-breadcrumbitem-color);font-weight:var(--_nys-breadcrumbs-font-weight)}.nys-breadcrumbitem a:hover{text-decoration-line:underline;text-decoration-style:solid;text-decoration-skip-ink:auto;text-decoration-thickness:14%;text-underline-offset:auto}.nys-breadcrumbitem a:active{text-decoration-thickness:14%;--_nys-breadcrumbitem-color: var(--nys-color-text)}.nys-breadcrumbitem a:focus-visible{border-radius:var(--_nys-breadcrumbitem-outline-radius);outline:var(--_nys-breadcrumbitem-outline-width) solid var(--_nys-breadcrumbitem-color--focus);outline-offset:2px}.nys-breadcrumbs__ellipsis{display:flex;gap:var(--_nys-breadcrumb-gap--ellipsis);margin:0;align-items:center;color:var(--_nys-breadcrumb-color--ellipsis)}.nys-breadcrumbs__ellipsis .ellipsis-btn{border:none;padding:0;background-color:inherit;text-decoration:none;font-family:var(--_nys-breadcrumbs-font-family);font-size:var(--_nys-breadcrumbs-font-size);font-weight:var(--_nys-breadcrumbs-font-weight);line-height:var(--_nys-breadcrumbs-line-height);color:var(--_nys-breadcrumb-color--ellipsis);cursor:pointer}.nys-breadcrumbs__ellipsis .ellipsis-btn:hover{text-decoration-line:underline;text-decoration-style:solid;text-decoration-skip-ink:auto;text-decoration-thickness:7%;text-underline-offset:auto}.nys-breadcrumbs__ellipsis .ellipsis-btn:active{text-decoration-thickness:14%}.nys-breadcrumbs__ellipsis .ellipsis-btn:focus-visible{border-radius:var(--_nys-breadcrumbitem-outline-radius);outline:var(--_nys-breadcrumbitem-outline-width) solid var(--_nys-breadcrumbitem-color--focus);outline-offset:2px}.nys-breadcrumbs__ellipsis nys-icon{margin-top:-3px}:host-context([dir=rtl]) nys-icon{transform:scaleX(-1)}@media(min-width:480px){:host{--_nys-breadcrumbs-padding: var(--nys-space-150, 12px) var(--nys-space-250, 20px)}}@media(min-width:768px){:host{--_nys-breadcrumbs-padding: var(--nys-space-150, 12px) var(--nys-space-400, 32px)}}@media(min-width:1024px){:host{--_nys-breadcrumbs-padding: var(--nys-space-150, 12px) var(--nys-space-400, 32px)}}@media(min-width:1280px){:host{--_nys-breadcrumbs-padding: var(--nys-space-150, 12px) var(--nys-space-800, 64px)}}';
var Q = Object.defineProperty;
var c5 = (b24, e5, s13, t11) => {
  for (var r13 = void 0, a12 = b24.length - 1, n13; a12 >= 0; a12--)
    (n13 = b24[a12]) && (r13 = n13(e5, s13, r13) || r13);
  return r13 && Q(e5, s13, r13), r13;
};
var x5 = class x6 extends I {
  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */
  constructor() {
    super(), this.id = "", this.ariaLabel = "", this.size = "md", this.backToParent = false, this.collapsed = false, this.backgroundBar = false, this.disabled = false, this._collapseThreshold = 5, this._manuallyExpanded = false, this._mediaQuery = null, this._updateCollapseThreshold = () => {
      const s13 = this._mediaQuery?.matches ?? window.innerWidth < 768 ? 3 : 5;
      s13 !== this._collapseThreshold && (this._collapseThreshold = s13, this._manuallyExpanded = false, this._handleSlotChange());
    };
  }
  connectedCallback() {
    super.connectedCallback(), this._mediaQuery = window.matchMedia("(max-width: 767px)"), this._mediaQuery.addEventListener("change", this._updateCollapseThreshold);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._mediaQuery?.removeEventListener(
      "change",
      this._updateCollapseThreshold
    ), this._mediaQuery = null;
  }
  firstUpdated() {
    this._handleSlotChange();
  }
  updated(e5) {
    (e5.has("collapsed") || e5.has("backToParent") || e5.has("disabled")) && this._handleSlotChange();
  }
  _getSlottedOl() {
    return (this.shadowRoot?.querySelector(
      "slot"
    )?.assignedElements({ flatten: true }) ?? []).find((t11) => t11.tagName === "OL") ?? null;
  }
  _getSlottedItems() {
    const e5 = this._getSlottedOl();
    return e5 ? Array.from(e5.children).filter(
      (s13) => s13.tagName === "LI"
    ) : [];
  }
  _getAnchor(e5) {
    return e5.querySelector("a");
  }
  _isCurrentPage(e5) {
    return !this._getAnchor(e5);
  }
  _createBackToParentElement(e5) {
    const s13 = this._getAnchor(e5), t11 = s13?.getAttribute("href") ?? "", r13 = s13?.textContent?.trim() ?? e5.textContent?.trim() ?? "", a12 = document.createElement("li");
    a12.className = "nys-breadcrumbitem";
    const n13 = document.createElement("nys-icon");
    n13.setAttribute("name", "arrow_back"), n13.setAttribute("size", "16");
    const i21 = document.createElement("a");
    return this.disabled || (i21.href = t11), i21.textContent = r13, this.disabled && i21.setAttribute("aria-disabled", "true"), a12.appendChild(n13), a12.appendChild(i21), a12;
  }
  _createCrumbElement(e5, s13) {
    const t11 = this._getAnchor(e5), r13 = t11?.getAttribute("href") ?? "", a12 = t11?.textContent?.trim() ?? e5.textContent?.trim() ?? "", n13 = document.createElement("li");
    if (n13.className = "nys-breadcrumbitem", s13)
      return n13.setAttribute("aria-current", "page"), n13.textContent = a12, n13;
    const i21 = document.createElement("a");
    this.disabled || (i21.href = r13), i21.textContent = a12, this.disabled && i21.setAttribute("aria-disabled", "true");
    const m32 = document.createElement("nys-icon");
    return m32.setAttribute("name", "chevron_right"), m32.setAttribute("size", "14"), n13.appendChild(i21), n13.appendChild(m32), n13;
  }
  /**
   * Main logic for cloning and handling user slots.
   * New <ol>, <li>, and <a> tags are created and rendered out as crumbs for the breadcrumbs trail.
   */
  _handleSlotChange() {
    const e5 = this._mediaQuery?.matches ?? window.innerWidth < 768, s13 = this.shadowRoot?.getElementById("crumb-list");
    if (!s13) return;
    const t11 = this._getSlottedItems();
    if (t11.length === 0) return;
    s13.innerHTML = "";
    const r13 = (u17 = 0) => {
      const h23 = t11[u17].cloneNode(true), g13 = this._createBackToParentElement(h23);
      s13.appendChild(g13);
    };
    if (t11.length === 1) {
      r13();
      return;
    }
    if (e5 && this.backToParent) {
      const u17 = this._isCurrentPage(t11[t11.length - 1]);
      r13(u17 ? t11.length - 2 : t11.length - 1);
      return;
    }
    const a12 = !this._manuallyExpanded && t11.length > this._collapseThreshold, n13 = this.collapsed || a12, i21 = t11[t11.length - 1], m32 = this._isCurrentPage(i21), _17 = Math.min(1, t11.length - 1), k17 = Math.min(
      m32 ? 2 : 1,
      t11.length - _17
    );
    t11.forEach((u17, h23) => {
      const g13 = h23 < _17, E14 = h23 >= t11.length - k17, C10 = g13 || E14, A6 = n13 && !C10, p19 = this._createCrumbElement(u17, this._isCurrentPage(u17));
      if (p19.setAttribute("data-cloned", "true"), A6 && p19.classList.add("hide"), C10 || p19.classList.add("intermediate"), s13.appendChild(p19), h23 === _17 - 1 && n13 && t11.length > 2) {
        const y17 = document.createElement("li");
        y17.classList.add("nys-breadcrumbs__ellipsis");
        const l17 = document.createElement("a");
        l17.classList.add("ellipsis-btn"), l17.setAttribute("aria-label", "Show more links"), l17.setAttribute("role", "button"), l17.setAttribute("href", "#"), l17.textContent = "…";
        const w25 = (f21) => {
          f21.preventDefault(), this._manuallyExpanded = true, this.collapsed = false, this._handleSlotChange(), this._dispatchExpandEvent(), this._moveFocusToFirstExpandCrumb();
        };
        l17.addEventListener("click", w25), l17.addEventListener("keydown", (f21) => {
          f21.key === " " && w25(f21);
        });
        const v20 = document.createElement("nys-icon");
        v20.setAttribute("name", "chevron_right"), v20.setAttribute("size", "14"), y17.appendChild(l17), y17.appendChild(v20), s13.appendChild(y17);
      }
    });
  }
  _moveFocusToFirstExpandCrumb() {
    setTimeout(() => {
      this.shadowRoot?.getElementById("crumb-list")?.querySelector("li[data-cloned].intermediate")?.querySelector("a")?.focus();
    }, 0);
  }
  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */
  _dispatchExpandEvent() {
    this.dispatchEvent(
      new CustomEvent("nys-expand", {
        detail: { id: this.id },
        bubbles: true,
        composed: true
      })
    );
  }
  render() {
    return html`<nav
      class="nys-breadcrumbs ${this.backgroundBar ? "nys-breadcrumbs--background-bar" : ""}"
      aria-label=${this.ariaLabel || "Breadcrumb"}
    >
      <ol id="crumb-list"></ol>
      <slot style="display: none;" @slotchange=${this._handleSlotChange}></slot>
    </nav>`;
  }
};
x5.styles = unsafeCSS(M);
var o3 = x5;
c5([
  property({ type: String, reflect: true })
], o3.prototype, "id");
c5([
  property({ type: String })
], o3.prototype, "ariaLabel");
c5([
  property({ type: String, reflect: true })
], o3.prototype, "size");
c5([
  property({ type: Boolean })
], o3.prototype, "backToParent");
c5([
  property({ type: Boolean })
], o3.prototype, "collapsed");
c5([
  property({ type: Boolean })
], o3.prototype, "backgroundBar");
c5([
  property({ type: Boolean, reflect: true })
], o3.prototype, "disabled");
customElements.get("nys-breadcrumbs") || customElements.define("nys-breadcrumbs", o3);

// ../../nys-card/dist/nys-card.js
var f3 = 0;
function _3(d21) {
  return `${d21}-${Date.now()}-${f3++}`;
}
var v5 = (d21) => {
  class e5 extends d21 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = _3(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return e5;
};
var m7 = v5(LitElement);
var u3 = '@charset "UTF-8";:host{--_nys-card-width: 100%;--_nys-card-height: var( --nys-card-height, fit-content );--_nys-card-border-radius: var(--nys-radius-xl, 12px);--_nys-card-border-radius--media: 0;--_nys-card-border-color: var(--nys-color-neutral-200, #bec0c1);--_nys-card-padding--t: var(--nys-space-200, 16px);--_nys-card-padding--x: var(--nys-space-300, 24px);--_nys-card-padding--b: var(--nys-space-250, 20px);--_nys-card-padding-bottom--preheading: var(--nys-space-150, 12px);--_nys-card-background-color: var(--nys-color-surface, #ffffff);--_nys-card-gap: var(--nys-space-150, 12px);--_nys-card-padding--media-inset: var(--nys-space-300, 24px);--_nys-card-size--media-accent: var(--nys-space-800, 64px);--_nys-card-offset--media-accent: var(--nys-space-300, 24px);--_nys-card-border-radius--media-accent: var(--nys-radius-xxl, 16px);--_nys-card-background-color--media-accent: var(--nys-color-accent, #face00);--_nys-card-cursor: pointer;--_nys-card-border-color--hover: var(--nys-color-neutral-700, #4a4d4f);--_nys-card-border-color--active: var(--nys-color-neutral-900, #1b1b1b);--_nys-card-outline-color: var(--nys-color-focus, #004dd1);--_nys-card-outline-width: var(--nys-border-width-md, 2px);--_nys-card-outline-offset: var(--nys-space-2px, 2px);--_nys-card-color: var(--nys-color-text-weak, #4a4d4f);--_nys-card-font-family: var(--nys-font-family-ui, "Proxima Nova");--_nys-card-font-size: var(--nys-font-size-ui-md, 16px);--_nys-card-font-style: normal;--_nys-card-font-weight: 400;--_nys-card-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-card-letter-spacing: var(--nys-font-letterspacing-ui-md, .044px);display:block;width:var(--_nys-card-width);max-width:100%}:host([hidden]){display:none}:host([inset]){--_nys-card-border-radius--media: var(--nys-radius-md, 4px)}:host([inset]) .nys-card__media-container{padding:var(--_nys-card-padding--media-inset) var(--_nys-card-padding--media-inset) 0}:host([inset]) .nys-card--media-accent{right:calc(var(--_nys-card-offset--media-accent) + var(--_nys-card-padding--media-inset))}:host([elevated]) .nys-card{box-shadow:var(--nys-shadow-raised)}.nys-card{color:var(--_nys-card-color);font-family:var(--_nys-card-font-family);font-size:var(--_nys-card-font-size);font-style:var(--_nys-card-font-style);font-weight:var(--_nys-card-font-weight);line-height:var(--_nys-card-line-height);letter-spacing:var(--_nys-card-letter-spacing);width:100%;height:var(--_nys-card-height);display:flex;flex-direction:column;align-items:start;justify-content:center;border-radius:var(--_nys-card-border-radius);border:var(--nys-border-width-sm, 1px) solid var(--_nys-card-border-color);background-color:var(--_nys-card-background-color);overflow:hidden}.nys-card__media-container{position:relative;box-sizing:border-box;width:100%;height:fit-content}.nys-card__media-container ::slotted([slot=media]){display:block;max-width:100%;width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:var(--_nys-card-border-radius--media)}.nys-card__media-container .nys-card--media-accent{position:absolute;right:var(--_nys-card-offset--media-accent);bottom:var(--_nys-card-offset--media-accent);width:var(--_nys-card-size--media-accent);height:var(--_nys-card-size--media-accent);overflow:hidden;background-color:var(--_nys-card-background-color--media-accent);border-radius:var(--_nys-card-border-radius--media-accent);display:flex;justify-content:center;flex-direction:column;align-items:center;color:var(--nys-color-text);font-family:var(--nys-font-family-ui, "Proxima Nova");font-style:normal;font-weight:700}.nys-card__media-container .nys-card--media-accent[hidden]{display:none}.nys-card__media-container .nys-card--media-accent-month{padding:0;margin:0;font-size:var(--nys-font-size-ui-md, 16px);line-height:var(--nys-font-size-ui-md, 16px);letter-spacing:var(--nys-font-letterspacing-ui-md, .044px)}.nys-card__media-container .nys-card--media-accent-day{padding:0;margin:0;font-size:var(--nys-font-size-ui-xl, 20px);line-height:var(--nys-font-size-ui-xl, 20px);letter-spacing:var(--nys-font-letterspacing-ui-xl, .017px)}.nys-card__main-content{margin:var(--_nys-card-padding--t) var(--_nys-card-padding--x) var(--_nys-card-padding--b);display:flex;flex-direction:column;gap:var(--_nys-card-gap);flex:1 1 auto;width:-webkit-fill-available;width:-moz-available;width:fill-available}.nys-card__preheading{padding:0;margin:0;color:var(--nys-color-text-weak, #4a4d4f);font-family:var(--nys-font-family-ui, "Proxima Nova");font-size:var(--nys-font-size-ui-md, 16px);font-style:normal;font-weight:700;line-height:var(--nys-font-lineheight-ui-md, 24px);letter-spacing:var(--nys-font-letterspacing-ui-md, .044px)}.nys-card__preheading-slot{display:flex;flex-direction:row;padding-bottom:var(--_nys-card-padding-bottom--preheading)}.nys-card__preheading-slot[hidden]{display:none}.nys-card__heading{padding:0;margin:0;color:var(--nys-color-text);font-family:var(--nys-font-family-heading, "Proxima Nova");font-size:var(--nys-font-size-h2, 28px);font-style:normal;font-weight:700;line-height:var(--nys-font-lineheight-h2, 36px);letter-spacing:var(--nys-font-letterspacing-h2, .013px)}.nys-card__subheading{padding:0;margin:0;overflow:hidden;color:var(--nys-color-text-weak, #4a4d4f);text-overflow:ellipsis;font-family:var(--nys-font-family-ui, "Proxima Nova");font-size:var(--nys-font-size-ui-lg, 18px);font-style:normal;font-weight:600;line-height:var(--nys-font-lineheight-ui-lg, 28px);letter-spacing:var(--nys-font-letterspacing-ui-lg, .028px)}.nys-card__description{padding:0;margin:0;color:var(--nys-color-text-weak, #4a4d4f);font-family:var(--nys-font-family-ui, "Proxima Nova");font-size:var(--nys-font-size-ui-md, 16px);font-style:normal;font-weight:400;line-height:var(--nys-font-lineheight-ui-md, 24px);letter-spacing:var(--nys-font-letterspacing-ui-md, .044px)}.nys-card__footer{display:contents}.nys-card--clickable{appearance:none;padding:0;text-align:left;text-decoration:none;cursor:var(--_nys-card-cursor)}.nys-card--clickable:hover{border-color:var(--_nys-card-border-color--hover)}.nys-card--clickable:active{border-color:var(--_nys-card-border-color--active)}.nys-card--clickable:focus-visible{outline:solid var(--_nys-card-outline-width) var(--_nys-card-outline-color);outline-offset:var(--_nys-card-outline-offset)}::slotted([slot=preheading]){display:flex;flex-direction:row}::slotted([slot=footer]){width:-webkit-fill-available;width:-moz-available;width:fill-available;display:flex;flex-direction:row;margin:0 var(--_nys-card-padding--x) var(--nys-space-300)}';
var b6 = Object.defineProperty;
var n3 = (d21, e5, r13, s13) => {
  for (var o18 = void 0, l17 = d21.length - 1, y17; l17 >= 0; l17--)
    (y17 = d21[l17]) && (o18 = y17(e5, r13, o18) || o18);
  return o18 && b6(e5, r13, o18), o18;
};
var h4 = class h5 extends m7 {
  constructor() {
    super(...arguments), this.id = "", this.preheading = "", this.heading = "", this.headingLevel = "h2", this.subheading = "", this.description = "", this.inset = false, this.elevated = false, this.href = "", this.target = "_self", this.onClick = null, this._hasMedia = false, this._hasPreheadingSlot = false, this._accentMonth = "", this._accentDay = "";
  }
  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  // A card is interactive when it has somewhere to go or something to run:
  // `href` makes it a link, a click handler makes it a button. `onclick` is the
  // native handler, set by an inline `onclick="…"` attribute on the host.
  get isClickable() {
    return !!this.href || !!this.onClick || !!this.onclick;
  }
  renderHeading() {
    return this.heading ? {
      h1: html`<h1 class="nys-card__heading">${this.heading}</h1>`,
      h2: html`<h2 class="nys-card__heading">${this.heading}</h2>`,
      h3: html`<h3 class="nys-card__heading">${this.heading}</h3>`,
      h4: html`<h4 class="nys-card__heading">${this.heading}</h4>`,
      h5: html`<h5 class="nys-card__heading">${this.heading}</h5>`,
      h6: html`<h6 class="nys-card__heading">${this.heading}</h6>`
    }[this.headingLevel] : "";
  }
  // The accent's two lines live in the light DOM, so the shadow stylesheet
  // cannot reach them. Read their text instead and render it into the badge,
  // where the month and day styles apply: first line is the month, second the day.
  readMediaAccent(e5) {
    const r13 = e5.assignedElements({ flatten: true }), s13 = r13.length > 1 ? r13 : Array.from(r13[0]?.children ?? []);
    this._accentMonth = s13[0]?.textContent?.trim() ?? "", this._accentDay = s13[1]?.textContent?.trim() ?? "";
  }
  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */
  hasSlotContent(e5) {
    return e5.target.assignedNodes({ flatten: true }).length > 0;
  }
  handleMediaSlotChange(e5) {
    this._hasMedia = this.hasSlotContent(e5);
  }
  handlePreheadingSlotChange(e5) {
    this._hasPreheadingSlot = this.hasSlotContent(e5);
  }
  handleMediaAccentSlotChange(e5) {
    this.readMediaAccent(e5.target);
  }
  handleClick(e5) {
    this.onClick?.(e5), this.dispatchEvent(
      new Event("nys-click", { bubbles: true, composed: true })
    );
  }
  handleFocus() {
    this.dispatchEvent(
      new Event("nys-focus", { bubbles: true, composed: true })
    );
  }
  handleBlur() {
    this.dispatchEvent(
      new Event("nys-blur", { bubbles: true, composed: true })
    );
  }
  render() {
    const e5 = !!(this._accentMonth || this._accentDay), r13 = !!this.preheading && !this._hasPreheadingSlot, s13 = html`
      <div class="nys-card__media-container" ?hidden=${!this._hasMedia}>
        <slot
          name="media"
          class="nys-card__media"
          @slotchange=${this.handleMediaSlotChange}
        ></slot>
        <div class="nys-card--media-accent" ?hidden=${!e5}>
          <p class="nys-card--media-accent-month">${this._accentMonth}</p>
          <p class="nys-card--media-accent-day">${this._accentDay}</p>
        </div>
        <div class="nys-card__media-accent-source" hidden>
          <slot
            name="media-accent"
            @slotchange=${this.handleMediaAccentSlotChange}
          ></slot>
        </div>
      </div>
      <div class="nys-card__main-content">
        <div>
          ${r13 ? html`<p class="nys-card__preheading">${this.preheading}</p>` : ""}
          <slot
            name="preheading"
            class="nys-card__preheading-slot"
            ?hidden=${!this._hasPreheadingSlot}
            @slotchange=${this.handlePreheadingSlotChange}
          ></slot>
          ${this.renderHeading()}
          ${this.subheading ? html`<p class="nys-card__subheading">${this.subheading}</p>` : ""}
        </div>
        ${this.description ? html`<p class="nys-card__description">${this.description}</p>` : ""}
        <slot></slot>
      </div>
      <slot name="footer" class="nys-card__footer"></slot>
    `;
    return this.isClickable ? this.href ? html`<a
        class="nys-card nys-card--clickable"
        href=${this.href}
        target=${this.target}
        @click=${this.handleClick}
        @focus=${this.handleFocus}
        @blur=${this.handleBlur}
        >${s13}</a
      >` : html`<button
      class="nys-card nys-card--clickable"
      type="button"
      @click=${this.handleClick}
      @focus=${this.handleFocus}
      @blur=${this.handleBlur}
    >
      ${s13}
    </button>` : html`<div class="nys-card">${s13}</div>`;
  }
};
h4.styles = unsafeCSS(u3);
var a5 = h4;
n3([
  property({ type: String, reflect: true })
], a5.prototype, "id");
n3([
  property({ type: String })
], a5.prototype, "preheading");
n3([
  property({ type: String })
], a5.prototype, "heading");
n3([
  property({ type: String, reflect: true })
], a5.prototype, "headingLevel");
n3([
  property({ type: String })
], a5.prototype, "subheading");
n3([
  property({ type: String })
], a5.prototype, "description");
n3([
  property({ type: Boolean })
], a5.prototype, "inset");
n3([
  property({ type: Boolean, reflect: true })
], a5.prototype, "elevated");
n3([
  property({ type: String })
], a5.prototype, "href");
n3([
  property({ type: String, reflect: true })
], a5.prototype, "target");
n3([
  property({ attribute: false })
], a5.prototype, "onClick");
n3([
  state()
], a5.prototype, "_hasMedia");
n3([
  state()
], a5.prototype, "_hasPreheadingSlot");
n3([
  state()
], a5.prototype, "_accentMonth");
n3([
  state()
], a5.prototype, "_accentDay");
customElements.get("nys-card") || customElements.define("nys-card", a5);

// ../../nys-tooltip/dist/nys-tooltip.js
var v6 = 0;
function w6(c21) {
  return `${c21}-${Date.now()}-${v6++}`;
}
var b7 = (c21) => {
  class t11 extends c21 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = w6(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return t11;
};
var x7 = b7(LitElement);
var E2 = `:host{--_nys-tooltip-color: var(--nys-color-text-reverse, #ffffff);--_nys-tooltip-background-color: var(--nys-color-ink, #1b1b1b);--_nys-tooltip-border-radius: var(--nys-radius-md, 4px);--_nys-tooltip-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-tooltip-font-size: var(--nys-font-size-ui-sm, 14px);--_nys-tooltip-letter-spacing: var(--nys-font-letterspacing-ui-sm, .044px);--_nys-tooltip-line-height: var(--nys-font-lineheight-ui-sm, 24px)}.nys-tooltip__content{position:fixed;top:0;left:0;max-width:400px;width:max-content;max-height:120px;padding:var(--nys-space-50, 4px) var(--nys-space-100, 8px);background-color:var(--_nys-tooltip-background-color);border-radius:var(--_nys-tooltip-border-radius);cursor:auto;z-index:1}.nys-tooltip__inner{color:var(--_nys-tooltip-color);font-family:var(--_nys-tooltip-font-family);font-size:var(--_nys-tooltip-font-size);font-weight:400;line-height:var(--_nys-tooltip-line-height);letter-spacing:var(--_nys-tooltip-letter-spacing);white-space:normal;overflow-wrap:anywhere;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:4;line-clamp:4;-webkit-box-orient:vertical}.nys-tooltip__arrow{position:absolute;width:14px;height:6px;background:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="15" height="6" viewBox="0 0 15 6" fill="none"><path d="M8.15079 5.44218C7.7763 5.76317 7.2237 5.76317 6.84921 5.44218L0.5 0H14.5L8.15079 5.44218Z" fill="%231B1B1B"/></svg>') no-repeat center}.nys-tooltip__content[active]{display:block}.fade-out{opacity:0;transition:opacity .2s ease-out}@media(prefers-reduced-motion:reduce){.fade-out{transition:none}}:host([position=top]) .nys-tooltip__arrow{top:100%;left:var(--arrow-offset-x, 50%);transform:translate(-50%)}:host([position=bottom]) .nys-tooltip__arrow{bottom:100%;left:var(--arrow-offset-x, 50%);transform:translate(-50%) rotate(180deg)}:host([position=left]) .nys-tooltip__arrow{left:100%;top:50%;transform:translateY(-50%) rotate(-90deg);margin-left:-4px}:host([position=right]) .nys-tooltip__arrow{right:100%;top:50%;transform:translateY(-50%) rotate(90deg);margin-right:-4px}:host([inverted]) .nys-tooltip__content{--_nys-tooltip-color: var(--nys-color-text, #1b1b1b);--_nys-tooltip-background-color: var(--nys-color-ink-reverse, #ffffff)}:host([inverted]) .nys-tooltip__arrow{background:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="15" height="6" viewBox="0 0 15 6" fill="none"><path d="M8.15079 5.44218C7.7763 5.76317 7.2237 5.76317 6.84921 5.44218L0.5 0H14.5L8.15079 5.44218Z" fill="white"/></svg>') no-repeat center}@media(max-width:400px){.nys-tooltip__content{max-width:calc(100vw - 2rem)}}`;
var L3 = Object.defineProperty;
var P = Object.getOwnPropertyDescriptor;
var p4 = (c21, t11, e5, i21) => {
  for (var o18 = i21 > 1 ? void 0 : i21 ? P(t11, e5) : t11, s13 = c21.length - 1, n13; s13 >= 0; s13--)
    (n13 = c21[s13]) && (o18 = (i21 ? n13(t11, e5, o18) : n13(o18)) || o18);
  return i21 && o18 && L3(t11, e5, o18), o18;
};
var f4 = class f5 extends x7 {
  /**
   * Lifecycle Methods
   * --------------------------------------------------------------------------
   */
  constructor() {
    super(), this.id = "", this.text = "", this.inverted = false, this.for = "", this._active = false, this._userHasSetPosition = false, this._originalUserPosition = null, this._internallyUpdatingPosition = false, this._hideTimeout = null, this._position = null, this._resizeObserver = null, this._showTooltip = () => {
      if (this._active = true, this._addScrollListeners(), this._userHasSetPosition && this._originalUserPosition && this._doesPositionFit(this._originalUserPosition)) {
        this.position = this._originalUserPosition, this.updateComplete.then(() => {
          this._userPositionTooltip();
        });
        return;
      }
      this._autoPositionTooltip();
    }, this._handleBlurOrMouseLeave = () => {
      const t11 = this._getReferenceElement(), e5 = this.shadowRoot?.querySelector(
        ".nys-tooltip__content"
      );
      t11 !== document.activeElement && (!t11 || !e5 || this._triggerFadeOut(e5));
    }, this._cancelFadeOut = () => {
      const t11 = this.shadowRoot?.querySelector(
        ".nys-tooltip__content"
      ), e5 = this._getReferenceElement();
      if (!t11 || !e5) return;
      const i21 = t11.matches(":hover"), o18 = e5.matches(":hover"), s13 = document.activeElement === e5;
      !i21 && !o18 && !s13 || (this._hideTimeout && (clearTimeout(this._hideTimeout), this._hideTimeout = null), t11.classList.remove("fade-out"), this._active = true);
    }, this._handleScrollOrResize = () => {
      !this._active || this._hideTimeout || this._showTooltip();
    }, this._handleEscapeKey = (t11) => {
      if (t11.key === "Escape" && this._active) {
        this._active = false, this._removeScrollListeners();
        const e5 = this.shadowRoot?.querySelector(
          ".nys-tooltip__content"
        );
        e5 && this._resetTooltipPositioningStyles(e5);
      }
    };
  }
  get position() {
    return this._position;
  }
  set position(t11) {
    const e5 = this._position;
    this._position = t11, this.requestUpdate("position", e5), this._internallyUpdatingPosition || (this._userHasSetPosition = t11 !== null, this._originalUserPosition = t11);
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener("keydown", this._handleEscapeKey);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    const t11 = this._getReferenceElement(), e5 = this.shadowRoot?.querySelector(".nys-tooltip__content");
    t11 && e5 && (t11.removeEventListener("mouseenter", this._showTooltip), t11.removeEventListener("mouseenter", this._cancelFadeOut), t11.removeEventListener("mouseleave", this._handleBlurOrMouseLeave), t11.removeEventListener("focusin", this._showTooltip), t11.removeEventListener("focusout", this._handleBlurOrMouseLeave), e5.removeEventListener("mouseenter", this._cancelFadeOut), e5.removeEventListener("mouseleave", this._handleBlurOrMouseLeave)), window.removeEventListener("keydown", this._handleEscapeKey);
  }
  async firstUpdated() {
    await this.updateComplete;
    const t11 = this._getReferenceElement(), e5 = this.shadowRoot?.querySelector(".nys-tooltip__content");
    !t11 || !e5 || (this.applyInverseTransform(), this._associateTrigger(t11), this._applyTooltipPropToFormComponent(t11), (t11.tagName.toLowerCase() === "nys-button" || t11.tagName.toLowerCase() === "nys-icon") && (this._applyFocusBehavior(t11), t11.addEventListener("mouseenter", this._showTooltip), t11.addEventListener("mouseenter", this._cancelFadeOut), t11.addEventListener("mouseleave", this._handleBlurOrMouseLeave), t11.addEventListener("focusin", this._showTooltip), t11.addEventListener("focusout", this._handleBlurOrMouseLeave), e5.addEventListener("mouseenter", this._cancelFadeOut), e5.addEventListener("mouseleave", this._handleBlurOrMouseLeave)));
  }
  updated(t11) {
    super.updated(t11);
    const e5 = this._getReferenceElement();
    e5 && (this._positionStartingBase(), t11.has("text") && (this._applyTooltipPropToFormComponent(e5), this._active && this.updateComplete.then(() => this._showTooltip())));
  }
  _triggerFadeOut(t11) {
    !t11 || this._hideTimeout || (t11.classList.add("fade-out"), this._hideTimeout = window.setTimeout(() => {
      this._active = false, this._removeScrollListeners(), this._positionStartingBase(), this._resetTooltipPositioningStyles(t11), t11.classList.remove("fade-out"), this._hideTimeout = null;
    }, 200));
  }
  // Listen to window scroll so a focus tooltip can auto position even when user move across the page
  _addScrollListeners() {
    window.addEventListener("scroll", this._handleScrollOrResize, true), this._resizeObserver = new ResizeObserver(() => {
      this._handleScrollOrResize();
    }), this._resizeObserver.observe(document.documentElement);
  }
  _removeScrollListeners() {
    window.removeEventListener("scroll", this._handleScrollOrResize, true), this._resizeObserver?.disconnect(), this._resizeObserver = null;
  }
  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  _getReferenceElement() {
    const t11 = this.for;
    if (!t11) return null;
    let e5 = document.getElementById(t11);
    if (e5) return e5;
    const i21 = (o18) => {
      for (const s13 of Array.from(o18.querySelectorAll("*"))) {
        const n13 = s13.shadowRoot;
        if (n13) {
          const r13 = n13.getElementById(t11);
          if (r13) return r13;
          const l17 = i21(n13);
          if (l17) return l17;
        }
      }
      return null;
    };
    return i21(document);
  }
  /**
   * Programmatically associates the trigger with the tooltip via
   * `aria-describedby`, per the WAI-ARIA Tooltip pattern. The tooltip bubble
   * (`.nys-tooltip__content`) carries `role="tooltip"` and `id={this.id}`, so we
   * point the trigger's `aria-describedby` at that id. Preserves any existing
   * `aria-describedby` tokens the consumer already set, and avoids duplicates.
   */
  _associateTrigger(t11) {
    if (!this.text?.trim()) return;
    const e5 = (t11.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
    e5.includes(this.id) || (e5.push(this.id), t11.setAttribute("aria-describedby", e5.join(" ")));
  }
  // We need to pass `ariaLabel` or `ariaDescription` to the nys-components so they can announce both their label and the tooltip's text
  async _passAria(t11) {
    const e5 = t11.tagName.toLowerCase();
    if (e5 === "nys-icon")
      t11.setAttribute("ariaLabel", `Hint: ${this.text}`);
    else if (e5 === "nys-button") {
      const i21 = t11, o18 = (i21.ariaDescribedBy || "").split(/\s+/).filter(Boolean);
      o18.includes(this.id) || (o18.push(this.id), i21.ariaDescribedBy = o18.join(" "));
    }
  }
  /**
   * In React, the reference element found is often the native HTML element within the nys-component.
   * Therefore, this function accounts for the closest NYS component ancestor that supports a tooltip prop.
   */
  _applyTooltipPropToFormComponent(t11) {
    const e5 = t11.tagName.toLowerCase();
    if (e5.startsWith("nys-")) {
      if (e5 === "nys-button" || e5 === "nys-icon") {
        this._applyFocusBehavior(t11), this._passAria(t11);
        return;
      }
      "tooltip" in t11 && (t11.tooltip = this.text);
    }
  }
  // Applies focus behavior to an otherwise non focus element (i.e. nys-icon is non focusable by default)
  async _applyFocusBehavior(t11) {
    if (t11.style.cursor = "pointer", t11.tagName.toLowerCase() === "nys-icon") {
      "updateComplete" in t11 && await t11.updateComplete;
      const i21 = t11.shadowRoot?.querySelector("svg");
      i21 && i21.setAttribute("tabindex", "0");
    }
  }
  /**
   * Checks if the tooltip fits inside the viewport on the given side of the trigger.
   * Used for auto-positioning. Ignores text overflow for now.
   */
  _doesPositionFit(t11) {
    const e5 = this._getReferenceElement(), i21 = this.shadowRoot?.querySelector(".nys-tooltip__content");
    if (!e5 || !i21 || t11 == null) return;
    const o18 = e5.getBoundingClientRect(), s13 = i21.getBoundingClientRect(), n13 = 8, r13 = {
      top: o18.top - n13,
      left: o18.left - n13,
      bottom: window.innerHeight - o18.bottom - n13,
      right: window.innerWidth - o18.right - n13
    };
    return {
      top: r13.top >= s13.height,
      bottom: r13.bottom >= s13.height,
      left: r13.left >= s13.width,
      right: r13.right >= s13.width
    }[t11];
  }
  _userPositionTooltip() {
    const t11 = this.shadowRoot?.querySelector(
      ".nys-tooltip__content"
    ), e5 = this._getReferenceElement();
    t11 && e5 && (this._positionTooltipElement(e5, t11, this.position), this._shiftTooltipIntoViewport(t11));
  }
  // Calculates the best placement based on available space (flips placement if it doesn't fit)
  async _autoPositionTooltip() {
    const t11 = this._getReferenceElement(), e5 = this.shadowRoot?.querySelector(
      ".nys-tooltip__content"
    );
    if (!t11 || !e5) return;
    const i21 = t11.getBoundingClientRect(), o18 = 8, s13 = {
      top: i21.top - o18,
      left: i21.left - o18,
      bottom: window.innerHeight - i21.bottom - o18,
      right: window.innerWidth - i21.right - o18
    };
    let n13 = [
      "top",
      "bottom",
      "right",
      "left"
    ];
    if (this._userHasSetPosition && this._originalUserPosition) {
      const a12 = this._originalUserPosition;
      a12 === "left" ? n13 = ["left", "right", "top", "bottom"] : a12 === "right" ? n13 = ["right", "left", "top", "bottom"] : a12 === "top" ? n13 = ["top", "bottom", "right", "left"] : a12 === "bottom" && (n13 = ["bottom", "top", "right", "left"]);
    }
    for (const a12 of n13)
      if (this._doesPositionFit(a12)) {
        this._setInternalPosition(a12), await this.updateComplete, this._positionTooltipElement(t11, e5, a12), this._shiftTooltipIntoViewport(e5);
        return;
      }
    let r13 = "top", l17 = s13.top;
    for (const a12 of n13)
      s13[a12] > l17 && (l17 = s13[a12], r13 = a12);
    this._setInternalPosition(r13), await this.updateComplete, this._positionTooltipElement(t11, e5, r13), this._shiftTooltipIntoViewport(e5);
  }
  _positionStartingBase() {
    const t11 = this.shadowRoot?.querySelector(
      ".nys-tooltip__content"
    );
    t11 && (t11.style.top = "0px", t11.style.left = "0px");
  }
  _positionTooltipElement(t11, e5, i21) {
    const o18 = t11.getBoundingClientRect(), s13 = e5.getBoundingClientRect(), n13 = 8;
    let r13 = 0, l17 = 0;
    switch (i21) {
      case "top":
        r13 = o18.top - s13.height - n13, l17 = o18.left + o18.width / 2 - s13.width / 2;
        break;
      case "bottom":
        r13 = o18.bottom + n13, l17 = o18.left + o18.width / 2 - s13.width / 2;
        break;
      case "left":
        r13 = o18.top + o18.height / 2 - s13.height / 2, l17 = o18.left - s13.width - n13;
        break;
      case "right":
        r13 = o18.top + o18.height / 2 - s13.height / 2, l17 = o18.right + n13;
        break;
      default:
        r13 = o18.top - s13.height - n13, l17 = o18.left + o18.width / 2 - s13.width / 2;
        break;
    }
    e5.style.top = `${r13}px`, e5.style.left = `${l17}px`;
  }
  // In some iframes (like Storybook's) or embedded containers , parent elements may have CSS transforms applied, creating a new coordinate context.
  // This function removes such transforms to prevent them from affecting tooltip positioning calculations.
  applyInverseTransform() {
    document.querySelectorAll('div[scale="1"]').forEach((t11) => {
      t11.style.transform = "none";
    });
  }
  _setInternalPosition(t11) {
    this._internallyUpdatingPosition = true, this.position = t11, this._internallyUpdatingPosition = false;
  }
  // Determines if text of tooltip over-extends outside of viewport edge and adjust tooltip for horizontal overflow
  _shiftTooltipIntoViewport(t11) {
    const e5 = this._getReferenceElement();
    if (!e5) return;
    const i21 = e5.getBoundingClientRect(), o18 = t11.getBoundingClientRect(), s13 = i21.left + i21.width / 2, n13 = o18.left < 0, r13 = o18.right > window.innerWidth;
    n13 ? (t11.style.left = "10px", t11.style.transform = "none") : r13 && (t11.style.right = "0px", t11.style.left = "auto", t11.style.transform = "none");
    const l17 = t11.getBoundingClientRect(), a12 = (s13 - l17.left) / l17.width, _17 = Math.max(0, Math.min(1, a12)) * 100;
    t11.style.setProperty("--arrow-offset-x", `${_17}%`);
  }
  // Reposition tooltip back to original set position (e.g. top, left, bottom, right) to avoid positioning issue base on last position
  _resetTooltipPositioningStyles(t11) {
    t11.style.left = "", t11.style.right = "", t11.style.top = "", t11.style.transform = "", t11.style.removeProperty("--arrow-offset-x");
  }
  render() {
    return html`
      <div class="nys-tooltip__main">
        ${this.text?.trim() ? html`<div
              id=${this.id}
              class="nys-tooltip__content"
              role="tooltip"
              aria-hidden=${this._active && !this._hideTimeout ? "false" : "true"}
              ?active=${this._active}
              style="visibility: ${this._active ? "visible" : "hidden"}; "
            >
              <div class="nys-tooltip__inner">${this.text}</div>
              <span class="nys-tooltip__arrow"></span>
            </div>` : ""}
      </div>
    `;
  }
};
f4.styles = unsafeCSS(E2);
var h6 = f4;
p4([
  property({ type: String, reflect: true })
], h6.prototype, "id", 2);
p4([
  property({ type: String })
], h6.prototype, "text", 2);
p4([
  property({ type: Boolean, reflect: true })
], h6.prototype, "inverted", 2);
p4([
  property({ type: String })
], h6.prototype, "for", 2);
p4([
  state()
], h6.prototype, "_active", 2);
p4([
  property({ type: String, reflect: true })
], h6.prototype, "position", 1);
customElements.get("nys-tooltip") || customElements.define("nys-tooltip", h6);

// ../../nys-label/dist/nys-label.js
var d4 = ':host{--_nys-label-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-label-font-weight: var(--nys-font-weight-semibold, 600);--_nys-label-font-size: var(--nys-font-size-ui-md, 16px);--_nys-label-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-label-letter-spacing: var(--nys-font-letterspacing-ui-md, .044px);--_nys-label-color: var(--nys-color-text, #1b1b1b);--_nys-label-cursor: normal;--_nys-description-font-weight: var(--nys-font-weight-regular, 400);--_nys-description-font-style: normal;--_nys-description-font-color: var(--nys-color-text-weak, #4a4d4f);--_nys-required-font-color: var(--nys-color-danger, #b52c2c);--_nys-optional-font-weight: var(--nys-font-weight-regular, 400);--_nys-optional-font-color: var(--nys-color-text-weak, #4a4d4f);--_nys-label-gap: var(--nys-space-4px, 4px)}p{margin:0}.nys-label{display:flex;flex-direction:column;align-items:flex-start;font-family:var(--_nys-label-font-family);font-size:var(--_nys-label-font-size);line-height:var(--_nys-label-line-height);letter-spacing:var(--_nys-label-letter-spacing)}.nys-label *{cursor:var(--_nys-label-cursor)}.nys-label__label{display:flex;gap:var(--_nys-label-gap);text-align:left;font-weight:var(--_nys-label-font-weight);color:var(--_nys-label-color)}.nys-label__description{text-align:left;font-weight:var(--_nys-description-font-weight);font-style:var(--_nys-description-font-style);color:var(--_nys-description-font-color)}.nys-label__required{display:contents;font-weight:var(--_nys-label-font-weight);color:var(--_nys-required-font-color)}.nys-label__optional{display:contents;font-weight:var(--_nys-optional-font-weight);color:var(--_nys-optional-font-color)}.nys-label__tooltip-wrapper{display:flex;gap:2px;align-items:center}.nys-label.invert .nys-label__label,.nys-label.invert .nys-label__description,.nys-label.invert .nys-label__optional{color:var(--nys-color-text-reverse, #ffffff)}.nys-label.invert .nys-label__tooltip-icon{color:var(--nys-color-ink-reverse, #ffffff)}';
var b8 = Object.defineProperty;
var n4 = (r13, s13, p19, h23) => {
  for (var e5 = void 0, o18 = r13.length - 1, y17; o18 >= 0; o18--)
    (y17 = r13[o18]) && (e5 = y17(s13, p19, e5) || e5);
  return e5 && b8(s13, p19, e5), e5;
};
var _4 = 0;
var a6 = class a7 extends LitElement {
  constructor() {
    super(...arguments), this.id = "", this.label = "", this.description = "", this.flag = "", this.inverted = false, this.tooltip = "", this._labelInternals = typeof this.attachInternals == "function" ? this.attachInternals() : null;
  }
  get _hasDescription() {
    const s13 = this.querySelector('[slot="description"]');
    return !!this.description || !!s13;
  }
  connectedCallback() {
    super.connectedCallback(), this.id || (this.id = `nys-label-${Date.now()}-${_4++}`);
  }
  updated() {
    this._labelInternals && (this._labelInternals.ariaLabel = this.label || null);
  }
  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */
  /**
   * While most components don't need to listen for this event.
   * Special components like "nys-fileinput" and "nys-toggle" need to listen for label to execute their specific functionalities.
   */
  _dispatchLabelClick() {
    this.dispatchEvent(
      new CustomEvent("nys-label-click", { bubbles: true, composed: true })
    );
  }
  render() {
    return html`
      <div class="nys-label ${this.inverted ? "invert" : ""}">
        <div class="nys-label__tooltip-wrapper">
          <label class="nys-label__label" @click=${this._dispatchLabelClick}
            >${this.label}
            ${this.flag === "required" ? html`<div class="nys-label__required" aria-hidden="true">
                  *
                </div>` : ""}
            ${this.flag === "optional" ? html`<div class="nys-label__optional">(Optional)</div>` : ""}</label
          >
          ${this.tooltip ? html`<nys-tooltip
                  text="${this.tooltip}"
                  position="top"
                  focusable
                  ?inverted=${this.inverted}
                  for="tooltip-icon-${this.id}"
                >
                </nys-tooltip>
                <nys-icon
                  id="tooltip-icon-${this.id}"
                  name="info"
                  size="3xl"
                ></nys-icon> ` : ""}
        </div>
        ${this._hasDescription ? html`<p
              class="nys-label__description"
              @click=${this._dispatchLabelClick}
            >
              <slot name="description">${this.description}</slot>
            </p>` : ""}
      </div>
    `;
  }
};
a6.styles = unsafeCSS(d4);
var t2 = a6;
n4([
  property({ type: String, reflect: true })
], t2.prototype, "id");
n4([
  property({ type: String })
], t2.prototype, "label");
n4([
  property({ type: String })
], t2.prototype, "description");
n4([
  property({ type: String })
], t2.prototype, "flag");
n4([
  property({ type: Boolean, reflect: true })
], t2.prototype, "inverted");
n4([
  property({ type: String })
], t2.prototype, "tooltip");
customElements.get("nys-label") || customElements.define("nys-label", t2);

// ../../nys-errormessage/dist/nys-errormessage.js
var p5 = ':host{--_nys-errormessage-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-errormessage-font-weight: var(--nys-font-weight-regular, 400);--_nys-errormessage-font-size: var(--nys-font-size-ui-md, 16px);--_nys-errormessage-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-errormessage-letter-spacing: var( --nys-font-letterspacing-ui-md, .044px );--_nys-errormessage-color: var(--nys-color-danger, #b52c2c);--_nys-errormessage-gap: var(--nys-space-100, 8px);--_nys-errormessage-padding--divider: var(--nys-space-50, 4px);--_nys-errormessage-width--divider: var(--nys-border-width-sm, 1px);--_nys-errormessage-margin-top: 0}.nys-errormessage{display:flex;align-items:center;gap:var(--_nys-errormessage-gap);font-family:var(--_nys-errormessage-font-family);font-weight:var(--_nys-errormessage-font-weight);font-size:var(--_nys-errormessage-font-size);line-height:var(--_nys-errormessage-line-height);letter-spacing:var(--_nys-errormessage-letter-spacing);color:var(--_nys-errormessage-color);margin-top:var(--_nys-errormessage-margin-top)}.nys-errormessage[showDivider]{padding-top:var(--_nys-errormessage-padding--divider);margin-top:var(--_nys-errormessage-padding--divider);border-top:var(--_nys-errormessage-width--divider) solid var(--_nys-errormessage-color)}nys-icon{margin-top:-2px}';
var v7 = Object.defineProperty;
var t3 = (n13, o18, g13, f21) => {
  for (var r13 = void 0, a12 = n13.length - 1, l17; a12 >= 0; a12--)
    (l17 = n13[a12]) && (r13 = l17(o18, g13, r13) || r13);
  return r13 && v7(o18, g13, r13), r13;
};
var h7 = 0;
var i5 = class i6 extends LitElement {
  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */
  constructor() {
    super(), this.id = "", this.showError = false, this.errorMessage = "", this.showDivider = false, this._errInternals = typeof this.attachInternals == "function" ? this.attachInternals() : null, this.id || (this.id = `nys-errormessage-${Date.now()}-${h7++}`);
  }
  updated() {
    this._errInternals && (this._errInternals.ariaLabel = this.errorMessage || null);
  }
  render() {
    return html`<div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      class="nys-errormessage__region"
    >
      ${this.showError ? html`<div class="nys-errormessage" ?showDivider=${this.showDivider}>
            <nys-icon name="error" size="2xl"></nys-icon>
            ${this.errorMessage}
          </div>` : ""}
    </div>`;
  }
};
i5.styles = unsafeCSS(p5);
var e2 = i5;
t3([
  property({ type: String, reflect: true })
], e2.prototype, "id");
t3([
  property({ type: Boolean })
], e2.prototype, "showError");
t3([
  property({ type: String })
], e2.prototype, "errorMessage");
t3([
  property({ type: Boolean, reflect: true })
], e2.prototype, "showDivider");
customElements.get("nys-errormessage") || customElements.define("nys-errormessage", e2);

// ../../nys-checkbox/dist/chunks/nys-checkboxgroup-CBMeRIuM.js
var v8 = 0;
function p6(s13) {
  return `${s13}-${Date.now()}-${v8++}`;
}
function m8(s13) {
  return s13.filter((e5) => !!e5);
}
var g4 = {
  labelledby: "ariaLabelledByElements",
  describedby: "ariaDescribedByElements"
};
var E3 = {
  labelledby: "aria-label",
  describedby: "aria-description"
};
function D(s13, e5, o18) {
  const r13 = m8(o18), t11 = g4[e5], n13 = E3[e5], c21 = s13;
  t11 in s13 && (c21[t11] = r13.length ? r13 : null);
  const l17 = r13.map((d21) => d21.textContent?.trim() ?? "").filter(Boolean).join(" ");
  l17 ? s13.setAttribute(n13, l17) : s13.removeAttribute(n13);
}
var C3 = (s13) => {
  class e5 extends s13 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = p6(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return e5;
};
var w7 = (s13) => {
  class e5 extends C3(s13) {
    constructor() {
      super(...arguments), this.__internals = null;
    }
    get internals() {
      if (this.__internals) return this.__internals;
      if (typeof this.attachInternals == "function")
        try {
          this.__internals = this.attachInternals();
        } catch {
          this.__internals = null;
        }
      return this.__internals;
    }
    get defaultRole() {
      return null;
    }
    setHostAria(r13, t11) {
      const n13 = this.internals;
      if (n13 && r13 in n13) {
        n13[r13] = t11;
        return;
      }
      const c21 = S3(r13);
      t11 === null ? this.removeAttribute(c21) : this.setAttribute(c21, t11);
    }
    reflectDefaultSemantics() {
      const r13 = this.defaultRole;
      r13 && this.setHostAria("role", r13);
    }
    connectedCallback() {
      super.connectedCallback(), this.reflectDefaultSemantics();
    }
  }
  return e5;
};
function S3(s13) {
  if (s13 === "role") return "role";
  const e5 = s13.replace(/^aria/, "");
  return "aria-" + e5.charAt(0).toLowerCase() + e5.slice(1);
}
var A = (s13) => {
  const e5 = class extends w7(s13) {
    setFormValue(t11) {
      this.internals?.setFormValue(t11 ?? null);
    }
    setValidityFromState(t11, n13, c21) {
      const l17 = this.internals;
      if (!l17) return;
      const d21 = Object.values(t11).some(Boolean);
      d21 ? l17.setValidity(t11, n13 ?? "Invalid value", c21) : l17.setValidity({}), this.setHostAria("ariaInvalid", d21 ? "true" : "false");
    }
    clearValidity() {
      this.internals?.setValidity({}), this.setHostAria("ariaInvalid", "false");
    }
    checkValidity() {
      return this.internals?.checkValidity() ?? true;
    }
    reportValidity() {
      return this.internals?.reportValidity() ?? true;
    }
    formResetCallback() {
      this.clearValidity();
    }
  };
  return e5.formAssociated = true, e5;
};
var q2 = A(LitElement);
var z3 = ':host{--_nys-checkbox-size: var(--nys-size-400, 32px);--_nys-checkbox-border-radius: var(--nys-radius-md, 4px);--_nys-checkbox-border-width: var(--nys-border-width-md, 2px);--_nys-checkbox-outline-color: var(--nys-color-focus, #004dd1);--_nys-checkbox-outline-width: var(--nys-border-width-md, 2px);--_nys-checkbox-outline-offset: var(--nys-space-2px, 2px);--_nys-checkbox-gap: var(--nys-space-150, 12px);--_nys-checkboxgroup-gap: var(--nys-space-200, 16px);--_nys-checkbox-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-checkbox-font-size: var(--nys-font-size-ui-md, 16px);--_nys-checkbox-font-weight: var(--nys-font-weight-regular, 400);--_nys-checkbox-font-weight--standalone: var(--nys-font-weight-semibold, 600);--_nys-checkbox-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-checkbox-color: var( --nys-color-ink, var(--nys-color-neutral-900, #1b1b1b) );--_nys-checkbox-background-color: var(--nys-color-ink-reverse, #ffffff);--_nys-checkbox-border-color: var(--nys-color-neutral-600, #62666a);--_nys-checkbox-background-color--hover: var(--nys-color-neutral-50, #ededed);--_nys-checkbox-border-color--hover: var(--nys-color-ink, #1b1b1b);--_nys-checkbox-background-color--active: var( --nys-color-neutral-100, #d0d0ce );--_nys-checkbox-border-color--active: var(--nys-color-ink, #1b1b1b);--_nys-checkbox-background-color--checked: var(--nys-color-theme, #154973);--_nys-checkbox-border-color--checked: var(--nys-color-theme, #154973);--_nys-checkbox-background-color--checked--hover: var( --nys-color-theme-strong, #0e324f );--_nys-checkbox-border-color--checked--hover: var( --nys-color-theme-strong, #0e324f );--_nys-checkbox-background-color--checked--active: var( --nys-color-theme-stronger, #081b2b );--_nys-checkbox-border-color--checked--active: var( --nys-color-theme-stronger, #081b2b );--_nys-checkbox-background-color--disabled: var( --nys-color-ink-reverse, #f0f0f0 );--_nys-checkbox-border-color--disabled: var(--nys-color-neutral-400, #757575);--_nys-checkbox-color--disabled: var(--nys-color-text-disabled, #bec0c1);--_nys-checkbox-background-color--checked--disabled: var( --nys-color-neutral-100, #d0d0ce );--_nys-checkbox-border-color--checked--disabled: var( --nys-color-neutral-100, #d0d0ce )}:host([size=sm]){--_nys-checkbox-size: var(--nys-size-300, 24px);--_nys-checkbox-border-radius: var(--nys-radius-sm, 2px);--_nys-checkboxgroup-gap: var(--nys-space-100, 8px);--_nys-checkbox-gap: var(--nys-space-100, 8px)}:host([size=md]){--_nys-checkbox-size: var(--nys-size-400, 32px);--_nys-checkbox-border-radius: var(--nys-radius-md, 4px)}:host([tile]){--_nys-checkbox-border-width--tile: var(--nys-border-width-sm, 1px);--_nys-checkbox-border-radius--tile: var(--nys-radius-md, 4px);--_nys-checkbox-border-color--tile: var(--nys-color-neutral-100, #d0d0ce);--_nys-checkbox-background-color--tile: var(--nys-color-ink-reverse, #ffffff);--_nys-checkbox-padding--x--tile: var(--nys-space-250, 20px);--_nys-checkbox-padding--y--tile: var(--nys-space-200, 16px);--_nys-checkbox-border-color--tile--hover: var( --nys-color-neutral-700, #4a4d4f );--_nys-checkbox-background-color--tile--hover: var( --nys-color-ink-reverse, #ffffff );--_nys-checkbox-border-color--tile--active: var( --nys-color-neutral-900, #1b1b1b );--_nys-checkbox-background-color--tile--active: var( --nys-color-ink-reverse, #ffffff );--_nys-checkbox-border-color--tile--checked: var( --nys-color-theme-mid, #457aa5 );--_nys-checkbox-background-color--tile--checked: var( --nys-color-theme-faint, #f7fafd );--_nys-checkbox-background-color--tile--disabled: var( --nys-color-ink-reverse, #f0f0f0 );--_nys-checkbox-border-color--tile--disabled: var( --nys-color-neutral-100, #d0d0ce )}:host([tile][size=sm]){--_nys-checkbox-padding--x--tile: var(--nys-space-200, 16px);--_nys-checkbox-padding--y--tile: var(--nys-space-150, 12px)}:host([tile][showError]){--_nys-checkbox-border-color--tile: var(--nys-color-danger, #b52c2c);--_nys-checkbox-border-color--tile--hover: var(--nys-color-danger, #b52c2c);--_nys-checkbox-border-color--tile--active: var(--nys-color-danger, #b52c2c);--_nys-checkbox-border-color--tile--checked: var(--nys-color-danger, #b52c2c)}.single-error-message{--_nys-errormessage-margin-top: var(--nys-space-50, 4px)}.nys-checkboxgroup{display:flex;flex-direction:column;gap:var(--nys-space-200, 16px);font-family:var(--_nys-checkbox-font-family);font-size:var(--_nys-checkbox-font-size);line-height:var(--_nys-checkbox-line-height)}.nys-checkboxgroup__content{display:flex;flex-direction:column;gap:var(--_nys-checkboxgroup-gap)}.nys-checkbox{display:flex;flex-direction:column;border-radius:var(--_nys-checkbox-border-radius--tile);border:var(--_nys-checkbox-border-width--tile) solid var(--_nys-checkbox-border-color--tile);background:var(--_nys-checkbox-background-color--tile);padding:var(--_nys-checkbox-padding--y--tile) var(--_nys-checkbox-padding--x--tile)}.nys-checkbox .nys-checkbox__main-container{display:flex;font-family:var(--_nys-checkbox-font-family);font-size:var(--_nys-checkbox-font-size);line-height:var(--_nys-checkbox-line-height);align-items:center;gap:var(--_nys-checkbox-gap)}.nys-checkbox .nys-checkbox__main-container.has-description{align-items:flex-start}.nys-checkbox__checkbox-wrapper{position:relative;display:flex;justify-content:center;align-items:center;max-height:var(--_nys-checkbox-size)}.nys-checkbox__icon{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;color:var(--nys-color-ink-reverse, #ffffff)}.nys-checkbox__checkbox{appearance:none;background-repeat:no-repeat;background-position:center;width:var(--_nys-checkbox-size);min-width:var(--_nys-checkbox-size);min-height:var(--_nys-checkbox-size);height:var(--_nys-checkbox-size);max-width:var(--_nys-checkbox-size);max-height:var(--_nys-checkbox-size);border:solid var(--_nys-checkbox-border-width) var(--_nys-checkbox-border-color);background-color:var(--_nys-checkbox-background-color);border-radius:var(--_nys-checkbox-border-radius);outline-offset:var(--_nys-checkbox-outline-offset);outline:none;margin:0}.nys-checkbox:hover,.nys-checkbox:hover *{cursor:pointer}.nys-checkbox__checkbox:not(:disabled):checked{background-color:var(--_nys-checkbox-background-color--checked);border-color:var(--_nys-checkbox-border-color--checked)}:host([tile]) .nys-checkbox:has(.nys-checkbox__checkbox:not(:disabled):checked){border-color:var(--_nys-checkbox-border-color--tile--checked);background-color:var(--_nys-checkbox-background-color--tile--checked)}.nys-checkbox__checkbox:disabled:checked{background-color:var(--_nys-checkbox-background-color--checked--disabled);border-color:var(--_nys-checkbox-border-color--checked--disabled)}:host([tile]) .nys-checkbox:has(.nys-checkbox__checkbox:disabled:checked){border-color:var(--_nys-checkbox-border-color--tile--disabled);background-color:var(--_nys-checkbox-background-color--tile--disabled)}.nys-checkbox__checkbox:disabled{background-color:var(--_nys-checkbox-background-color--disabled);border-color:var(--_nys-checkbox-border-color--disabled);cursor:not-allowed}.nys-checkbox:has(.nys-checkbox__checkbox:disabled) *{color:var(--_nys-checkbox-color--disabled);cursor:not-allowed;--_nys-label-cursor: not-allowed;--_nys-label-color: var(--_nys-checkbox-color--disabled)}:host([tile]) .nys-checkbox:has(.nys-checkbox__checkbox:disabled){background-color:var(--_nys-checkbox-background-color--disabled);border-color:var(--_nys-checkbox-border-color--disabled);cursor:not-allowed}.nys-checkbox:hover .nys-checkbox__checkbox:not(:disabled):not(:checked),.nys-checkbox__checkbox:hover:not(:disabled):not(:checked){background-color:var(--_nys-checkbox-background-color--hover);border-color:var(--_nys-checkbox-border-color--hover)}:host([tile]) .nys-checkbox:hover:has(.nys-checkbox__checkbox:not(:disabled):not(:checked)){border-color:var(--_nys-checkbox-border-color--tile--hover);background-color:var(--_nys-checkbox-background-color--tile--hover);outline:solid var(--_nys-checkbox-border-width--tile) var(--_nys-checkbox-border-color--tile--hover)}.nys-checkbox:hover .nys-checkbox__checkbox:not(:disabled):checked,.nys-checkbox__checkbox:hover:not(:disabled):checked{border-color:var(--_nys-checkbox-border-color--checked--hover);background-color:var(--_nys-checkbox-background-color--checked--hover)}:host([tile]) .nys-checkbox:hover:has(.nys-checkbox__checkbox:not(:disabled):checked){outline:solid var(--_nys-checkbox-border-width--tile) var(--_nys-checkbox-border-color--tile--checked)}.nys-checkbox:active .nys-checkbox__checkbox:not(:disabled):not(:checked),.nys-checkbox__checkbox:active:not(:disabled):not(:checked){background-color:var(--_nys-checkbox-background-color--active);border-color:var(--_nys-checkbox-border-color--active)}:host([tile]) .nys-checkbox:has(.nys-checkbox__checkbox:active:not(:disabled):not(:checked)){border-color:var(--_nys-checkbox-border-color--tile--active);background-color:var(--_nys-checkbox-background-color--tile--active);outline:solid var(--_nys-checkbox-border-width--tile) var(--_nys-checkbox-border-color--tile--active)}.nys-checkbox:active .nys-checkbox__checkbox:not(:disabled):checked,.nys-checkbox__checkbox:active:not(:disabled):checked{border-color:var(--_nys-checkbox-border-color--checked--active);background-color:var(--_nys-checkbox-background-color--checked--active)}:host(:not([tile])) .nys-checkbox__checkbox:focus{outline:solid var(--_nys-checkbox-outline-width) var(--_nys-checkbox-outline-color)}:host([tile]) .nys-checkbox:has(*:focus-visible),:host([tile][showError]) .nys-checkbox:has(*:focus){outline:solid var(--_nys-checkbox-border-width--tile) var(--_nys-checkbox-outline-color)!important;border-color:var(--_nys-checkbox-outline-color)!important}:host(:not([tile])) .nys-checkbox__main-container>nys-label{--_nys-label-font-weight: var(--_nys-checkbox-font-weight)}:host(:not([tile])) .nys-checkbox__main-container>nys-label.standalone{--_nys-label-font-weight: var(--_nys-checkbox-font-weight--standalone)}:host([tile]) .nys-checkbox__main-container>nys-label{--_nys-description-font-style: normal}.nys-checkbox__required{color:var(--nys-color-danger, #b52c2c)}.nys-checkbox__requiredwrapper{display:flex;gap:3px}fieldset{all:unset;display:contents}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;border:0}.nys-checkbox__other-container{display:flex;padding-inline-start:calc(var(--_nys-checkbox-size) + var(--_nys-checkbox-gap))}';
var I2 = Object.defineProperty;
var a8 = (s13, e5, o18, r13) => {
  for (var t11 = void 0, n13 = s13.length - 1, c21; n13 >= 0; n13--)
    (c21 = s13[n13]) && (t11 = c21(e5, o18, t11) || t11);
  return t11 && I2(e5, o18, t11), t11;
};
var b9 = class b10 extends q2 {
  constructor() {
    super(...arguments), this.id = "", this.name = "", this.required = false, this.optional = false, this.showError = false, this.errorMessage = "", this.label = "", this.description = "", this.tile = false, this.tooltip = "", this.form = null, this.size = "md", this._slottedDescriptionText = "", this._hasOtherError = false, this._otherErrorCheckbox = null, this._hasSharedNames = false;
  }
  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   * Form association, ElementInternals, and id generation are provided by
   * NysFormControlElement (@nysds/internals).
   */
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("nys-change", this._handleCheckboxChange), this.addEventListener("nys-other-input", this._handleOtherInput), this.addEventListener("invalid", this._handleInvalid), this.addEventListener("nys-error", this._handleChildError), this.addEventListener("nys-error-clear", this._handleChildErrorClear);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("nys-change", this._handleCheckboxChange), this.removeEventListener("nys-other-input", this._handleOtherInput), this.removeEventListener("invalid", this._handleInvalid), this.removeEventListener("nys-error", this._handleChildError), this.removeEventListener("nys-error-clear", this._handleChildErrorClear);
  }
  firstUpdated() {
    this._setGroupExist(), this._updateCheckboxSize(), this._updateCheckboxTile(), this._updateCheckboxShowError();
  }
  updated(e5) {
    e5.has("required") && this.required && this._setupCheckboxRequired(), e5.has("size") && this._updateCheckboxSize(), e5.has("tile") && this._updateCheckboxTile(), e5.has("showError") && this._updateCheckboxShowError(), e5.has("form") && this._updateCheckboxForm();
  }
  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  _hasAtLeastOneChecked() {
    return Array.from(this.querySelectorAll("nys-checkbox")).some(
      (e5) => e5.checked
    );
  }
  _setGroupExist() {
    const e5 = Array.from(
      this.querySelectorAll("nys-checkbox")
    );
    this._hasSharedNames = this._checkSharedNames(e5), e5.forEach((o18) => {
      o18.groupExist = this._hasSharedNames;
    });
  }
  // Initial update on checkbox required attribute
  async _setupCheckboxRequired() {
    const e5 = this.querySelector("nys-checkbox"), o18 = this.errorMessage || "This field is required", r13 = e5 ? await e5.getInputElement() : null;
    this.setValidityFromState(
      { valueMissing: true },
      o18,
      r13 || this
    );
  }
  // Updates the required attribute of each checkbox in the group
  async _manageRequire() {
    if (!this.required) {
      this.clearValidity(), this.showError = false;
      return;
    }
    const e5 = this.errorMessage || "You must make a selection to proceed.", o18 = Array.from(
      this.querySelectorAll("nys-checkbox")
    ), r13 = this._hasAtLeastOneChecked(), t11 = o18 ? await o18[0].getInputElement().catch(() => null) : null;
    this.clearValidity(), this.showError = false, r13 ? this._hasOtherError && this._otherErrorCheckbox && (this._setCustomOtherError(), this.showError = true) : this._hasOtherError ? (this._setCustomOtherError(), this.showError = true) : (this.setValidityFromState(
      { valueMissing: true },
      e5,
      t11 ?? this
    ), this.showError = true);
  }
  _setCustomOtherError() {
    const o18 = this._otherErrorCheckbox?.shadowRoot?.querySelector("nys-textinput") || this._otherErrorCheckbox;
    this.setValidityFromState(
      { customError: true },
      "Please complete this field.",
      o18
    );
  }
  // Updates the size of each checkbox in the group
  _updateCheckboxSize() {
    this.querySelectorAll("nys-checkbox").forEach((o18) => {
      o18.setAttribute("size", this.size);
    });
  }
  _updateCheckboxTile() {
    this.querySelectorAll("nys-checkbox").forEach((o18) => {
      this.tile ? o18.toggleAttribute("tile", true) : o18.removeAttribute("tile");
    });
  }
  _updateCheckboxShowError() {
    this.querySelectorAll("nys-checkbox").forEach((o18) => {
      this.showError ? o18.setAttribute("showError", "") : o18.removeAttribute("showError");
    });
  }
  _updateCheckboxForm() {
    this.querySelectorAll("nys-checkbox").forEach((o18) => {
      this.showError && this.form !== null ? o18.setAttribute("form", this.form) : o18.removeAttribute("form");
    });
  }
  // Get the slotted text contents so native VO can attempt to announce it within the legend in the fieldset
  _getSlotDescriptionForAria() {
    const o18 = this.shadowRoot?.querySelector(
      'slot[name="description"]'
    )?.assignedNodes({ flatten: true }) || [];
    this._slottedDescriptionText = o18.map((r13) => r13.textContent?.trim()).filter(Boolean).join(", ");
  }
  // This callback is automatically called when the parent form is reset.
  formResetCallback() {
    this.querySelectorAll("nys-checkbox").forEach((o18) => {
      o18.formResetCallback();
    }), this.setFormValue(""), this.showError = false, this.clearValidity(), this.requestUpdate();
  }
  async _handleInvalid(e5) {
    if (e5.preventDefault(), this.internals?.validity.customError) {
      const n13 = Array.from(
        this.querySelectorAll("nys-checkbox")
      ).find(
        (c21) => c21.other && c21.checked
      );
      if (n13) {
        const c21 = n13.shadowRoot?.querySelector("nys-textinput");
        if (c21) {
          await c21.updateComplete, c21.focus();
          return;
        }
      }
    }
    this.showError = true, await this._manageRequire();
    const o18 = this.querySelector("nys-checkbox"), r13 = o18 ? await o18.getInputElement() : null;
    if (r13) {
      const t11 = this.internals?.form;
      t11 ? Array.from(t11.elements).find((l17) => {
        if (l17.tagName.toLowerCase() === "nys-checkboxgroup") {
          if (Array.from(
            this.querySelectorAll("nys-checkbox")
          ).filter(
            (u17) => u17.checked
          ).length === 0)
            return l17;
        } else
          return typeof l17.checkValidity == "function" && !l17.checkValidity();
      }) === this && r13.focus() : r13.focus();
    }
  }
  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */
  // Similar to how native forms handle multiple same-name fields, we group the selected values into a list for FormData.
  _handleCheckboxChange(e5) {
    const o18 = Array.from(
      this.querySelectorAll("nys-checkbox")
    );
    if (this._hasSharedNames) {
      const r13 = e5, { name: t11 } = r13.detail, n13 = o18.filter((c21) => c21.checked).map((c21) => c21.value);
      this.name = t11, this.setFormValue(n13.join(", "));
    }
    this._checkOtherInputs(o18), this._hasOtherError || this._manageRequire();
  }
  async _handleChildError(e5) {
    e5.stopPropagation();
    const { sourceCheckbox: o18 } = e5.detail;
    o18 && (this._hasOtherError = true, this._otherErrorCheckbox = o18, this.showError = true, this._setCustomOtherError());
  }
  _handleChildErrorClear(e5) {
    const r13 = e5.detail?.sourceCheckbox;
    this._otherErrorCheckbox && r13 !== this._otherErrorCheckbox || (this._hasOtherError = false, this._otherErrorCheckbox = null, this.clearValidity(), this.showError = false, this.required && !this._hasAtLeastOneChecked() && this._manageRequire());
  }
  _handleOtherInput() {
    const o18 = Array.from(
      this.querySelectorAll("nys-checkbox")
    ).filter((r13) => r13.checked).map((r13) => r13.value);
    this.setFormValue(o18.join(", "));
  }
  async _checkOtherInputs(e5) {
    for (const o18 of e5)
      if (o18.checked && o18.other) {
        const r13 = o18.value.trim();
        if (!o18._hasUserInteracted)
          continue;
        if (!r13 || r13 === "") {
          this._hasOtherError = true, this._otherErrorCheckbox = o18, this._setCustomOtherError(), this.showError = true;
          return;
        }
      }
    this._hasOtherError && (this._hasOtherError = false, this._otherErrorCheckbox = null, this.required ? this._manageRequire() : (this.clearValidity(), this.showError = false));
  }
  /** Drupal-like naming support **/
  _checkSharedNames(e5) {
    if (e5.length === 0) return false;
    const o18 = e5[0].name;
    return e5.every((r13) => r13.name === o18);
  }
  render() {
    return html`
      <fieldset
        aria-labelledby=${ifDefined(
      this.label ? this.id + "--label" : void 0
    )}
        aria-label=${ifDefined(
      this.label ? void 0 : `${this._slottedDescriptionText || this.description || ""}`.trim() || void 0
    )}
        class="nys-checkboxgroup"
        role="radiogroup"
      >
        <nys-label
          id="${this.id}--label"
          label=${this.label}
          description=${this.description}
          flag=${this.required ? "required" : this.optional ? "optional" : ""}
          tooltip=${this.tooltip}
        >
          <slot
            name="description"
            slot="description"
            @slotchange=${this._getSlotDescriptionForAria}
            >${this.description}</slot
          >
        </nys-label>
        <div class="nys-checkboxgroup__content">
          <slot></slot>
        </div>
        <nys-errormessage
          id=${this.id + "--error"}
          ?showError=${this.showError}
          errorMessage=${this.internals?.validationMessage || this.errorMessage}
          .showDivider=${!this.tile}
        ></nys-errormessage>
      </fieldset>
    `;
  }
};
b9.styles = unsafeCSS(z3), b9.shadowRootOptions = __spreadProps(__spreadValues({}, LitElement.shadowRootOptions), {
  delegatesFocus: true
});
var i7 = b9;
a8([
  property({ type: String, reflect: true })
], i7.prototype, "id");
a8([
  property({ type: String, reflect: true })
], i7.prototype, "name");
a8([
  property({ type: Boolean, reflect: true })
], i7.prototype, "required");
a8([
  property({ type: Boolean, reflect: true })
], i7.prototype, "optional");
a8([
  property({ type: Boolean, reflect: true })
], i7.prototype, "showError");
a8([
  property({ type: String })
], i7.prototype, "errorMessage");
a8([
  property({ type: String })
], i7.prototype, "label");
a8([
  property({ type: String })
], i7.prototype, "description");
a8([
  property({ type: Boolean, reflect: true })
], i7.prototype, "tile");
a8([
  property({ type: String })
], i7.prototype, "tooltip");
a8([
  property({ type: String, reflect: true })
], i7.prototype, "form");
a8([
  property({ type: String, reflect: true })
], i7.prototype, "size");
a8([
  state()
], i7.prototype, "_slottedDescriptionText");
a8([
  state()
], i7.prototype, "_hasOtherError");
a8([
  state()
], i7.prototype, "_otherErrorCheckbox");
customElements.get("nys-checkboxgroup") || customElements.define("nys-checkboxgroup", i7);

// ../../nys-textinput/dist/nys-textinput.js
var x8 = 0;
function m9(u17) {
  return `${u17}-${Date.now()}-${x8++}`;
}
var g5 = (u17) => {
  class t11 extends u17 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = m9(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return t11;
};
var w8 = (u17) => {
  class t11 extends g5(u17) {
    constructor() {
      super(...arguments), this.__internals = null;
    }
    get internals() {
      if (this.__internals) return this.__internals;
      if (typeof this.attachInternals == "function")
        try {
          this.__internals = this.attachInternals();
        } catch {
          this.__internals = null;
        }
      return this.__internals;
    }
    get defaultRole() {
      return null;
    }
    setHostAria(e5, i21) {
      const l17 = this.internals;
      if (l17 && e5 in l17) {
        l17[e5] = i21;
        return;
      }
      const r13 = k4(e5);
      i21 === null ? this.removeAttribute(r13) : this.setAttribute(r13, i21);
    }
    reflectDefaultSemantics() {
      const e5 = this.defaultRole;
      e5 && this.setHostAria("role", e5);
    }
    connectedCallback() {
      super.connectedCallback(), this.reflectDefaultSemantics();
    }
  }
  return t11;
};
function k4(u17) {
  if (u17 === "role") return "role";
  const t11 = u17.replace(/^aria/, "");
  return "aria-" + t11.charAt(0).toLowerCase() + t11.slice(1);
}
var $4 = (u17) => {
  const t11 = class extends w8(u17) {
    setFormValue(i21) {
      this.internals?.setFormValue(i21 ?? null);
    }
    setValidityFromState(i21, l17, r13) {
      const h23 = this.internals;
      if (!h23) return;
      const y17 = Object.values(i21).some(Boolean);
      y17 ? h23.setValidity(i21, l17 ?? "Invalid value", r13) : h23.setValidity({}), this.setHostAria("ariaInvalid", y17 ? "true" : "false");
    }
    clearValidity() {
      this.internals?.setValidity({}), this.setHostAria("ariaInvalid", "false");
    }
    checkValidity() {
      return this.internals?.checkValidity() ?? true;
    }
    reportValidity() {
      return this.internals?.reportValidity() ?? true;
    }
    formResetCallback() {
      this.clearValidity();
    }
  };
  return t11.formAssociated = true, t11;
};
var E4 = $4(LitElement);
var V2 = '@charset "UTF-8";:host{--_nys-textinput-width: 100%;--_nys-textinput-height: var(--nys-size-500, 40px);--_nys-textinput-border-radius: var(--nys-radius-md, 4px);--_nys-textinput-border-width: var(--nys-border-width-sm, 1px);--_nys-textinput-border-color: var(--nys-color-neutral-400, #909395);--_nys-textinput-color: var( --nys-color-text, var(--nys-color-neutral-900, #1b1b1b) );--_nys-textinput-color--placeholder: var( --nys-color-text-weaker, var(--nys-color-neutral-500, #797c7f) );--_nys-textinput-padding: var(--nys-space-100, 8px);--_nys-textinput-gap: var(--nys-space-50, 4px);--_nys-textinput-background-color: var( --nys-color-ink-reverse, var(--nys-color-white, #ffffff) );--_nys-textinput-outline-color--hover: var(--nys-color-neutral-900, #1b1b1b);--_nys-textinput-outline-width: var(--nys-border-width-sm, 1px);--_nys-textinput-outline-color--focus: var(--nys-color-focus, #004dd1);--_nys-textinput-background-color--disabled: var( --nys-color-neutral-10, #f6f6f6 );--_nys-textinput-border-color--disabled: var( --nys-color-neutral-200, #bec0c1 );--_nys-textinput-color--disabled: var( --nys-color-text-disabled, var(--nys-color-neutral-200, #bec0c1) );--_nys-textinput-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-textinput-font-size: var(--nys-font-size-ui-md, 16px);--_nys-textinput-font-weight: var(--nys-font-weight-regular, 400);--_nys-textinput-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-textinput-letter-spacing: var( --nys-font-letterspacing-ui-md, var(--nys-font-letterspacing-400, .044px) )}:host([width=sm]){--_nys-textinput-width: var(--nys-form-width-sm, 88px)}:host([width=md]){--_nys-textinput-width: var(--nys-form-width-md, 200px)}:host([width=lg]){--_nys-textinput-width: var(--nys-form-width-lg, 384px)}:host([width=full]){--_nys-textinput-width: 100%;flex:1}:host([showError]){--_nys-textinput-border-color: var(--nys-color-danger, #b52c2c)}:host([inverted]){--_nys-textinput-outline-color--focus: var( --nys-color-focus-reverse, #7aa5e7 )}.nys-textinput{font-weight:var(--_nys-textinput-font-weight);font-family:var(--_nys-textinput-font-family);font-size:var(--_nys-textinput-font-size);line-height:var(--_nys-textinput-line-height);letter-spacing:var(--_nys-textinput-letter-spacing);color:var(--_nys-textinput-color);gap:var(--_nys-textinput-gap);display:flex;flex-direction:column}.nys-textinput__mask-overlay{position:absolute;margin:calc(var(--_nys-textinput-padding) + var(--_nys-textinput-border-width));color:var(--nys-color-text-weaker, #797c7f);display:inline;overflow:hidden;white-space:nowrap;font:inherit;letter-spacing:normal}.nys-textinput__input{color:var(--_nys-textinput-color);border-radius:var(--_nys-textinput-border-radius);border:solid var(--_nys-textinput-border-color) var(--_nys-textinput-border-width);outline:transparent solid var(--_nys-textinput-outline-width);padding:var(--_nys-textinput-padding);width:100%;height:var(--_nys-textinput-height);box-sizing:border-box;background-color:transparent;position:relative;font:inherit}.nys-textinput__input[type=search]::-webkit-search-cancel-button,.nys-textinput__input[type=search]::-webkit-search-decoration{appearance:none;display:none}.nys-textinput__input::placeholder{color:var(--_nys-textinput-color--placeholder)}.nys-textinput__buttoncontainer{width:var(--_nys-textinput-width);max-width:100%;display:flex}.nys-textinput__buttoncontainer.has-end-button .nys-textinput__input{border-start-end-radius:0;border-end-end-radius:0;border-inline-end:none}.nys-textinput__buttoncontainer.has-start-button .nys-textinput__input{border-start-start-radius:0;border-end-start-radius:0;border-inline-start:none}.nys-textinput__container{position:relative;display:flex;align-items:center;width:100%;background-color:var(--_nys-textinput-background-color);border-radius:var(--_nys-textinput-border-radius)}::slotted(nys-button){--_nys-button-height: var(--_nys-textinput-height);--_nys-button-border-radius: var(--_nys-textinput-border-radius);--_nys-button-background-color--disabled: var( --_nys-textinput-background-color--disabled );--_nys-button-border-color--disabled: var(--_nys-textinput-color--disabled);--_nys-button-color--disabled: var(--_nys-textinput-color--disabled);--_nys-button-border-width: var(--_nys-textinput-border-width);z-index:1}.nys-textinput__buttoncontainer.has-start-button ::slotted(nys-button){--_nys-button-border-radius: var(--_nys-textinput-border-radius) 0 0 var(--_nys-textinput-border-radius)}.nys-textinput__buttoncontainer.has-end-button ::slotted(nys-button){--_nys-button-border-radius: 0 var(--_nys-textinput-border-radius) var(--_nys-textinput-border-radius) 0}.inline-icon{position:absolute;right:var(--nys-space-50, 4px);top:50%;transform:translateY(-50%);cursor:pointer;color:var(--_nys-textinput-color--icon);--nys-button-background-color: var(--_nys-textinput-background-color);--nys-button-background-color--hover: var(--_nys-textinput-background-color);--nys-button-background-color--active: var(--_nys-textinput-background-color);--_nys-button-outline-focus: calc(var(--_nys-button-outline-width) * -1);--_nys-button-padding--y: var(--nys-space-50, 4px);--_nys-button-padding--x: var(--nys-space-50, 4px);--_nys-button-height: var(--nys-size-300, 32px);--_nys-button-width: var(--nys-size-400, 32px)}.nys-textinput__input:hover:not(:disabled):not(:focus):not([readonly]){outline-color:var(--_nys-textinput-outline-color--hover);border-color:var(--_nys-textinput-outline-color--hover)}.nys-textinput__input:focus:not([readonly]){outline-color:var(--_nys-textinput-outline-color--focus);border-color:var(--_nys-textinput-outline-color--focus);caret-color:var(--_nys-textinput-outline-color--focus)}.nys-textinput__input:disabled,.nys-textinput__input:disabled::placeholder,.nys-textinput__input:disabled+.eye-icon{background-color:var(--_nys-textinput-background-color--disabled);border-color:var(--_nys-textinput-border-color--disabled);color:var(--_nys-textinput-color--disabled);cursor:not-allowed}';
var S4 = Object.defineProperty;
var o4 = (u17, t11, s13, e5) => {
  for (var i21 = void 0, l17 = u17.length - 1, r13; l17 >= 0; l17--)
    (r13 = u17[l17]) && (i21 = r13(t11, s13, i21) || i21);
  return i21 && S4(t11, s13, i21), i21;
};
var c6 = class c7 extends E4 {
  constructor() {
    super(...arguments), this.id = "", this.name = "", this.type = "text", this.label = "", this.description = "", this.placeholder = "", this.value = "", this.disabled = false, this.readonly = false, this.required = false, this.optional = false, this.tooltip = "", this.form = null, this.pattern = "", this.maxlength = null, this.ariaLabel = "", this.width = "full", this.step = null, this.min = null, this.max = null, this.inverted = false, this.showError = false, this.errorMessage = "", this.showPassword = false, this._originalErrorMessage = "", this._hasUserInteracted = false, this._maskPatterns = {
      tel: "(___) ___-____"
    };
  }
  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   * Form association, ElementInternals, and id generation are provided by
   * NysFormControlElement (@nysds/internals).
   */
  connectedCallback() {
    super.connectedCallback(), this._originalErrorMessage = this.errorMessage ?? "", this.addEventListener("invalid", this._handleInvalid);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("invalid", this._handleInvalid);
  }
  async firstUpdated() {
    this._setValue();
  }
  // Ensure the "width" property is valid after updates
  async updated(t11) {
    if (t11.has("value") && this._setValue(), t11.has("disabled") && (this._validateButtonSlot("startButton"), this._validateButtonSlot("endButton")), t11.has("type")) {
      const s13 = this._maskPatterns[this.type], e5 = this._inputEl;
      if (e5)
        if (s13)
          this.maxlength === null && (e5.maxLength = s13.length), this._updateOverlay(e5.value, s13);
        else {
          this.maxlength === null && e5.removeAttribute("maxLength");
          const i21 = this.shadowRoot?.querySelector(
            ".nys-textinput__mask-overlay"
          );
          i21 && (i21.textContent = "");
        }
    }
    if (t11.has("readonly") || t11.has("required")) {
      const s13 = this._inputEl;
      s13 && (s13.required = this.required && !this.readonly);
    }
  }
  /**
   * Form Integration
   * --------------------------------------------------------------------------
   */
  _setValue() {
    this.setFormValue(this.value), this._manageRequire();
  }
  _manageRequire() {
    const t11 = this._inputEl;
    if (!t11) return;
    const s13 = this.errorMessage || "This field is required";
    this.required && (!this.value || this.value?.trim() === "") ? this.setValidityFromState({ valueMissing: true }, s13, t11) : (this.clearValidity(), this._hasUserInteracted = false);
  }
  _setValidityMessage(t11 = "") {
    const s13 = this._inputEl;
    s13 && (this.showError = !!t11, this._originalErrorMessage?.trim() && t11 !== "" ? this.errorMessage = this._originalErrorMessage : this.errorMessage = t11, t11 ? this.setValidityFromState(
      { customError: true },
      this.errorMessage,
      s13
    ) : this.clearValidity());
  }
  _validate() {
    const t11 = this._inputEl;
    if (!t11) return;
    const s13 = t11.validity;
    let e5 = "";
    s13.valueMissing ? e5 = "This field is required" : s13.typeMismatch ? e5 = "Invalid format for this type" : s13.patternMismatch ? e5 = "Invalid format" : s13.tooShort ? e5 = `Value is too short. Minimum length is ${t11.minLength}` : s13.tooLong ? e5 = `Value is too long. Maximum length is ${t11.maxLength}` : s13.rangeUnderflow ? e5 = `Value must be at least ${t11.min}` : s13.rangeOverflow ? e5 = `Value must be at most ${t11.max}` : s13.stepMismatch ? e5 = "Invalid step value" : e5 = t11.validationMessage, this._setValidityMessage(e5);
  }
  // This callback is automatically called when the parent form is reset.
  formResetCallback() {
    this.value = "";
    const t11 = this._inputEl;
    t11 && (t11.value = ""), this.setFormValue(""), this.showError = false, this.errorMessage = "", this.clearValidity(), this.showPassword = false;
    const s13 = this._maskPatterns[this.type];
    s13 && this._updateOverlay("", s13), this.requestUpdate();
  }
  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  // This helper function is called to perform the element's native validation.
  checkValidity() {
    const t11 = this._inputEl;
    return t11 ? t11.checkValidity() : true;
  }
  _handleInvalid(t11) {
    t11.preventDefault(), this._hasUserInteracted = true, this._validate();
    const s13 = this._inputEl;
    if (s13) {
      const e5 = this.internals?.form;
      e5 ? Array.from(e5.elements).find(
        (r13) => typeof r13.checkValidity == "function" && !r13.checkValidity()
      ) === this && s13.focus() : s13.focus();
    }
  }
  _togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  _clearSearch() {
    this.value = "";
    const t11 = this._inputEl;
    t11 && (t11.value = "", t11.focus()), this.setFormValue(""), this._hasUserInteracted && this._validate(), this.dispatchEvent(
      new CustomEvent("nys-input", {
        detail: { id: this.id, value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }
  _updateOverlay(t11, s13) {
    const e5 = this.shadowRoot?.querySelector(
      ".nys-textinput__mask-overlay"
    );
    if (!e5) return;
    const i21 = t11, l17 = s13.slice(i21.length);
    e5.textContent = i21 + l17;
  }
  _applyMask(t11, s13) {
    const e5 = t11.replace(/\D/g, "");
    let i21 = "";
    if (this.type === "tel")
      return e5.length > 0 && (i21 = "(" + e5.substring(0, 3)), e5.length >= 4 && (i21 += ") " + e5.substring(3, 6)), e5.length > 6 && (i21 += "-" + e5.substring(6, 10)), i21;
    let l17 = 0;
    for (let r13 = 0; r13 < s13.length; r13++)
      if (s13[r13] === "_" || s13[r13].match(/[d9]/i))
        if (l17 < e5.length)
          i21 += e5[l17++];
        else
          break;
      else
        i21 += s13[r13];
    return i21;
  }
  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */
  // Handle input event to check pattern validity
  _handleInput(t11) {
    const s13 = t11.target;
    let e5 = s13.value;
    const i21 = this._maskPatterns[this.type];
    i21 && (e5 = this._applyMask(e5, i21), s13.value = e5, this._updateOverlay(e5, i21)), this.value = e5, this.setFormValue(this.value), this._hasUserInteracted && this._validate(), this.dispatchEvent(
      new CustomEvent("nys-input", {
        detail: { id: this.id, value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }
  // Handle focus event
  _handleFocus() {
    this.dispatchEvent(
      new Event("nys-focus", { bubbles: true, composed: true })
    );
  }
  // Handle blur event
  _handleBlur() {
    this._hasUserInteracted || (this._hasUserInteracted = true), this._validate(), this.dispatchEvent(
      new Event("nys-blur", { bubbles: true, composed: true })
    );
  }
  _validateButtonSlot(t11) {
    const s13 = this.shadowRoot?.querySelector(
      'slot[name="' + t11 + '"]'
    ), e5 = this.shadowRoot?.querySelector(
      ".nys-textinput__buttoncontainer"
    );
    if (!s13 || !e5) return;
    const i21 = s13.assignedElements();
    let l17 = false;
    i21.forEach((r13) => {
      r13 instanceof HTMLElement && r13.tagName.toLowerCase() === "nys-button" && !l17 ? (l17 = true, r13.setAttribute("size", "sm"), r13.setAttribute("variant", "primary"), this.disabled ? r13.setAttribute("disabled", "true") : r13.removeAttribute("disabled")) : (console.warn(
        "The '" + t11 + "' slot only accepts a single <nys-button> element. Removing invalid or extra node:",
        r13
      ), r13.remove());
    }), t11 === "startButton" ? e5.classList.toggle("has-start-button", l17) : t11 === "endButton" && e5.classList.toggle("has-end-button", l17);
  }
  render() {
    return html`
      <div class="nys-textinput">
        <nys-label
          id="${this.id}--label"
          label=${this.label}
          description=${this.description}
          flag=${this.required && !this.readonly ? "required" : this.optional ? "optional" : ""}
          tooltip=${this.tooltip}
          ?inverted=${this.inverted}
        >
          <slot name="description" slot="description">${this.description}</slot>
        </nys-label>
        <div class="nys-textinput__buttoncontainer">
          <slot
            name="startButton"
            @slotchange=${() => this._validateButtonSlot("startButton")}
          ></slot>
          <div class="nys-textinput__container">
            <span class="nys-textinput__mask-overlay"></span>
            <input
              class="nys-textinput__input"
              type=${this.type === "password" ? this.showPassword ? "text" : "password" : this.type}
              name=${this.name}
              id=${this.id + "--native"}
              ?disabled=${this.disabled}
              ?required=${this.required && !this.readonly}
              ?readonly=${this.readonly}
              aria-labelledby=${ifDefined(
      this.label ? this.id + "--label" : void 0
    )}
              aria-label=${ifDefined(
      !this.label && this.ariaLabel ? this.ariaLabel : void 0
    )}
              aria-required=${this.required}
              aria-disabled="${this.disabled}"
              aria-invalid=${this.showError ? "true" : "false"}
              aria-errormessage=${this.id + "--error"}
              aria-describedby=${ifDefined(
      this.showError ? this.id + "--error" : void 0
    )}
              .value=${this.value}
              placeholder=${ifDefined(
      this.placeholder ? this.placeholder : void 0
    )}
              pattern=${ifDefined(this.pattern ? this.pattern : void 0)}
              min=${ifDefined(this.min !== null ? this.min : void 0)}
              maxlength=${ifDefined(
      this.maxlength !== null ? this.maxlength : void 0
    )}
              step=${ifDefined(this.step !== null ? this.step : void 0)}
              max=${ifDefined(this.max !== null ? this.max : void 0)}
              form=${ifDefined(this.form || void 0)}
              @input=${this._handleInput}
              @focus="${this._handleFocus}"
              @blur="${this._handleBlur}"
            />
            ${this.type === "password" ? html` <nys-button
                  class="inline-icon"
                  id="password-toggle"
                  ariaLabel="password toggle"
                  variant="ghost"
                  circle
                  size="sm"
                  @nys-click=${() => !this.disabled && this._togglePasswordVisibility()}
                >
                  <nys-icon
                    slot="circle-icon"
                    size="2xl"
                    name=${this.showPassword ? "visibility_off" : "visibility"}
                  ></nys-icon>
                </nys-button>` : ""}
            ${this.type === "search" && this.value && !this.disabled && !this.readonly ? html` <nys-button
                  class="inline-icon"
                  id="search-clear"
                  ariaLabel="clear search"
                  variant="ghost"
                  circle
                  size="sm"
                  @nys-click=${() => this._clearSearch()}
                >
                  <nys-icon
                    slot="circle-icon"
                    size="2xl"
                    name="close"
                  ></nys-icon>
                </nys-button>` : ""}
          </div>
          <slot
            name="endButton"
            @slotchange=${() => this._validateButtonSlot("endButton")}
          ></slot>
        </div>
        <nys-errormessage
          id=${this.id + "--error"}
          ?showError=${this.showError}
          errorMessage=${this.errorMessage}
        ></nys-errormessage>
      </div>
    `;
  }
};
c6.styles = unsafeCSS(V2), c6.shadowRootOptions = __spreadProps(__spreadValues({}, LitElement.shadowRootOptions), {
  delegatesFocus: true
});
var n5 = c6;
o4([
  property({ type: String, reflect: true })
], n5.prototype, "id");
o4([
  property({ type: String, reflect: true })
], n5.prototype, "name");
o4([
  property({ type: String, reflect: true })
], n5.prototype, "type");
o4([
  property({ type: String })
], n5.prototype, "label");
o4([
  property({ type: String })
], n5.prototype, "description");
o4([
  property({ type: String })
], n5.prototype, "placeholder");
o4([
  property({ type: String })
], n5.prototype, "value");
o4([
  property({ type: Boolean, reflect: true })
], n5.prototype, "disabled");
o4([
  property({ type: Boolean, reflect: true })
], n5.prototype, "readonly");
o4([
  property({ type: Boolean, reflect: true })
], n5.prototype, "required");
o4([
  property({ type: Boolean, reflect: true })
], n5.prototype, "optional");
o4([
  property({ type: String })
], n5.prototype, "tooltip");
o4([
  property({ type: String, reflect: true })
], n5.prototype, "form");
o4([
  property({ type: String })
], n5.prototype, "pattern");
o4([
  property({ type: Number })
], n5.prototype, "maxlength");
o4([
  property({ type: String })
], n5.prototype, "ariaLabel");
o4([
  property({ type: String, reflect: true })
], n5.prototype, "width");
o4([
  property({ type: Number })
], n5.prototype, "step");
o4([
  property({ type: Number })
], n5.prototype, "min");
o4([
  property({ type: Number })
], n5.prototype, "max");
o4([
  property({ type: Boolean, reflect: true })
], n5.prototype, "inverted");
o4([
  property({ type: Boolean, reflect: true })
], n5.prototype, "showError");
o4([
  property({ type: String })
], n5.prototype, "errorMessage");
o4([
  query("input")
], n5.prototype, "_inputEl");
o4([
  state()
], n5.prototype, "showPassword");
customElements.get("nys-textinput") || customElements.define("nys-textinput", n5);

// ../../nys-checkbox/dist/nys-checkbox.js
var E5 = Object.defineProperty;
var s = (u17, e5, t11, a12) => {
  for (var h23 = void 0, d21 = u17.length - 1, l17; d21 >= 0; d21--)
    (l17 = u17[d21]) && (h23 = l17(e5, t11, h23) || h23);
  return h23 && E5(e5, t11, h23), h23;
};
var c8 = class c9 extends q2 {
  constructor() {
    super(...arguments), this.checked = false, this.disabled = false, this.required = false, this.label = "", this.description = "", this.id = "", this.name = "", this.value = "", this.form = null, this.showError = false, this.errorMessage = "", this.groupExist = false, this.tile = false, this.tooltip = "", this.size = "md", this.other = false, this.showOtherError = false, this.labelledby = "", this.hideLabel = false, this._mobileQuery = window.matchMedia("(max-width: 479px)"), this.isMobile = this._mobileQuery.matches, this._hasUserInteracted = false, this._manageLabelClick = () => {
      const e5 = this.shadowRoot?.querySelector(
        ".nys-checkbox__main-container"
      ), t11 = this.shadowRoot?.querySelector("input");
      !e5 || !t11 || e5.addEventListener("click", (a12) => {
        a12.target.tagName.toLowerCase() !== "input" && (this.disabled || (t11.click(), t11.focus()));
      });
    }, this._handleMobileQuery = () => {
      this.isMobile = this._mobileQuery.matches;
    };
  }
  // need this flag for "eager mode"
  async getInputElement() {
    return await this.updateComplete, this.shadowRoot?.querySelector("input") || null;
  }
  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   * Form association, ElementInternals, and id generation are provided by
   * NysFormControlElement (@nysds/internals).
   */
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("invalid", this._handleInvalid), this.addEventListener("blur", this._handleBlur), this._mobileQuery.addEventListener("change", this._handleMobileQuery);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("invalid", this._handleInvalid), this.removeEventListener("blur", this._handleBlur), this._mobileQuery.removeEventListener("change", this._handleMobileQuery);
  }
  firstUpdated() {
    this._setValue(), this._manageRequire(), this._manageLabelClick(), this.labelledby && this._syncExternalLabel();
  }
  willUpdate(e5) {
    if (e5.has("labelledby") && !this.labelledby) {
      const t11 = this.shadowRoot?.querySelector("input");
      t11 && D(t11, "labelledby", []);
    }
  }
  updated(e5) {
    e5.has("labelledby") && this.labelledby && this._syncExternalLabel();
  }
  /**
   * Point the native <input> at a light-DOM element that IDREF attributes cannot
   * reach across the shadow boundary. associateControlRefs sets the control's own
   * ariaLabelledByElements (honored in Chromium) plus a string aria-label fallback
   * for engines that do not yet resolve element references.
   *
   * Only ever called with an external labelledby set: with no external target the
   * native input keeps the internal same-root aria-labelledby IDREF that render()
   * emits, and must not be touched.
   */
  _syncExternalLabel() {
    const e5 = this.shadowRoot?.querySelector("input");
    if (!e5) return;
    const t11 = this.getRootNode().getElementById(
      this.labelledby
    );
    D(e5, "labelledby", [t11]);
  }
  /**
   * Form Integration
   * --------------------------------------------------------------------------
   */
  _setValue() {
    this.groupExist || this.setFormValue(this.checked ? this.value : null);
  }
  _manageRequire() {
    const e5 = this.shadowRoot?.querySelector("input"), t11 = this.errorMessage || "This field is required";
    e5 && (this.required && !this.checked ? this.setValidityFromState({ valueMissing: true }, t11, e5) : this.clearValidity());
  }
  _setValidityMessage(e5 = "") {
    const t11 = this.shadowRoot?.querySelector("input");
    t11 && (this.showError = !!e5, this.errorMessage?.trim() && e5 !== "" && (e5 = this.errorMessage), e5 ? this.setValidityFromState({ customError: true }, e5, t11) : this.clearValidity());
  }
  _validate() {
    const e5 = this.shadowRoot?.querySelector("input");
    if (!e5) return;
    const t11 = e5.validity;
    let a12 = "";
    t11.valueMissing && (a12 = "This field is required"), this._setValidityMessage(a12);
  }
  // Called automatically when the parent form is reset
  formResetCallback() {
    this.checked = false, this.setFormValue(null);
    const e5 = this.shadowRoot?.querySelector("input");
    e5 && (e5.checked = false), this.showError = false, this.errorMessage = "", this.clearValidity(), this.requestUpdate();
  }
  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  // This helper function is called to perform the element's native validation.
  checkValidity() {
    if (this.required && !this.checked)
      return false;
    const e5 = this.shadowRoot?.querySelector("input");
    return e5 ? e5.checkValidity() : true;
  }
  _handleInvalid(e5) {
    e5.preventDefault(), this.showError = true, this._validate();
    const t11 = this.shadowRoot?.querySelector("input");
    if (t11) {
      const a12 = this.internals?.form;
      a12 ? Array.from(a12.elements).find(
        (l17) => typeof l17.checkValidity == "function" && !l17.checkValidity()
      ) === this && t11.focus() : t11.focus();
    }
  }
  get _hasDescription() {
    const e5 = this.querySelector('[slot="description"]');
    return !!this.description || !!e5;
  }
  get _isStandalone() {
    return this.parentElement?.tagName.toLowerCase() !== "nys-checkboxgroup";
  }
  _emitChangeEvent() {
    this.dispatchEvent(
      new CustomEvent("nys-change", {
        detail: {
          id: this.id,
          checked: this.checked,
          name: this.name,
          value: this.value
        },
        bubbles: true,
        composed: true
      })
    );
  }
  _emitOtherInputEvent() {
    this.dispatchEvent(
      new CustomEvent("nys-other-input", {
        detail: {
          id: this.id,
          name: this.name,
          value: this.value
        },
        bubbles: true,
        composed: true
      })
    );
  }
  // Handle checkbox change event
  async _handleChange(e5) {
    const { checked: t11 } = e5.target, a12 = this.checked;
    this.checked = t11, this.groupExist || this.setFormValue(this.checked ? this.value : null), this.other && a12 && !t11 && (this.showOtherError = false, this._hasUserInteracted = false, this._dispatchClearError()), this._validate(), this._emitChangeEvent();
  }
  _handleFocus() {
    this.dispatchEvent(new Event("nys-focus"));
  }
  _handleBlur() {
    this.dispatchEvent(new Event("nys-blur")), this.other && this.checked && (this._hasUserInteracted = true, this._validateOtherAndEmitError());
  }
  _handleTextInputBlur() {
    this._hasUserInteracted = true, this._validateOtherAndEmitError();
  }
  async _handleKeydown(e5) {
    e5.code === "Space" && (e5.preventDefault(), this.disabled || (this.checked = !this.checked, this.setFormValue(this.checked ? this.value : null), await this.updateComplete, this._validate(), this._emitChangeEvent()));
  }
  _handleTextInput(e5) {
    let a12 = e5.target.value;
    this.value = a12, this._hasUserInteracted && this._validateOtherAndEmitError(), this._emitOtherInputEvent();
  }
  _validateOtherAndEmitError() {
    if (!this.other) return;
    if (!this.checked || !this._hasUserInteracted) {
      this.showOtherError = false, this._dispatchClearError();
      return;
    }
    const e5 = this.value.trim() === "";
    this.showOtherError = e5, e5 ? this.dispatchEvent(
      new CustomEvent("nys-error", {
        detail: {
          id: this.id,
          name: this.name,
          type: "other",
          message: "Please enter a value for this option.",
          sourceCheckbox: this
        },
        bubbles: true,
        composed: true
      })
    ) : this._dispatchClearError();
  }
  _dispatchClearError() {
    this.dispatchEvent(
      new CustomEvent("nys-error-clear", {
        detail: { sourceCheckbox: this },
        bubbles: true,
        composed: true
      })
    );
  }
  render() {
    return html`
      <div class="nys-checkbox">
        <div
          class="nys-checkbox__main-container ${this._hasDescription ? "has-description" : ""}"
        >
          <div class="nys-checkbox__checkbox-wrapper">
            <input
              id=${this.id + "--native"}
              class="nys-checkbox__checkbox"
              type="checkbox"
              name="${ifDefined(this.name ? this.name : void 0)}"
              .checked=${this.checked}
              ?disabled=${this.disabled}
              .value=${this.value}
              ?required="${this.required}"
              form=${ifDefined(this.form || void 0)}
              aria-checked="${this.checked}"
              aria-disabled="${this.disabled ? "true" : "false"}"
              aria-required="${this.required}"
              aria-invalid=${this.showError ? "true" : "false"}
              aria-errormessage=${this.id + "--error"}
              aria-describedby=${ifDefined(
      this.showError ? this.id + "--error" : void 0
    )}
              @change="${this._handleChange}"
              @focus="${this._handleFocus}"
              @keydown="${this._handleKeydown}"
              aria-labelledby=${ifDefined(
      !this.labelledby && (this.label || this.other) ? this.id + "--label" : void 0
    )}
            />
            ${this.checked ? html`<nys-icon
                  name="check"
                  size="${this.size === "md" ? "4xl" : this.size === "sm" ? "2xl" : "4xl"}"
                  class="nys-checkbox__icon"
                ></nys-icon>` : ""}
          </div>
          ${this.hideLabel || this.labelledby || !(this.label || this.other) ? nothing : html`<nys-label
                id="${this.id}--label"
                tooltip=${this.tooltip}
                label="${this.label || (this.other ? "Other" : "")}"
                description=${ifDefined(this.description || void 0)}
                flag=${ifDefined(this.required ? "required" : void 0)}
                class=${this._isStandalone ? "standalone" : ""}
              >
                <slot name="description" slot="description"
                  >${this.description}</slot
                >
              </nys-label>`}
        </div>
        <div class="nys-checkbox__other-container">
          ${this.other && this.checked ? html`
                <nys-textinput
                  .value=${this.value}
                  id=${"radiobutton-other-" + this.id}
                  @nys-input=${this._handleTextInput}
                  @nys-blur=${this._handleTextInputBlur}
                  ariaLabel="Other"
                  aria-invalid=${this.showOtherError ? "true" : "false"}
                  width=${this.isMobile ? "full" : "md"}
                  ?disabled=${this.disabled}
                ></nys-textinput>
              ` : ""}
        </div>
      </div>
      ${this.parentElement?.tagName.toLowerCase() !== "nys-checkboxgroup" ? html`<nys-errormessage
            id=${this.id + "--error"}
            class="single-error-message"
            ?showError=${this.showError}
            errorMessage=${this.internals?.validationMessage || this.errorMessage}
            .showDivider=${!this.tile}
          ></nys-errormessage>` : ""}
    `;
  }
};
c8.styles = unsafeCSS(z3), c8.shadowRootOptions = __spreadProps(__spreadValues({}, LitElement.shadowRootOptions), {
  delegatesFocus: true
});
var i8 = c8;
s([
  property({ type: Boolean, reflect: true })
], i8.prototype, "checked");
s([
  property({ type: Boolean, reflect: true })
], i8.prototype, "disabled");
s([
  property({ type: Boolean, reflect: true })
], i8.prototype, "required");
s([
  property({ type: String })
], i8.prototype, "label");
s([
  property({ type: String })
], i8.prototype, "description");
s([
  property({ type: String, reflect: true })
], i8.prototype, "id");
s([
  property({ type: String, reflect: true })
], i8.prototype, "name");
s([
  property({ type: String })
], i8.prototype, "value");
s([
  property({ type: String, reflect: true })
], i8.prototype, "form");
s([
  property({ type: Boolean, reflect: true })
], i8.prototype, "showError");
s([
  property({ type: String })
], i8.prototype, "errorMessage");
s([
  property({ type: Boolean })
], i8.prototype, "groupExist");
s([
  property({ type: Boolean, reflect: true })
], i8.prototype, "tile");
s([
  property({ type: String })
], i8.prototype, "tooltip");
s([
  property({ type: String, reflect: true })
], i8.prototype, "size");
s([
  property({ type: Boolean, reflect: true })
], i8.prototype, "other");
s([
  property({ type: Boolean })
], i8.prototype, "showOtherError");
s([
  property({ type: String })
], i8.prototype, "labelledby");
s([
  property({ type: Boolean })
], i8.prototype, "hideLabel");
s([
  state()
], i8.prototype, "isMobile");
customElements.get("nys-checkbox") || customElements.define("nys-checkbox", i8);

// ../../nys-combobox/dist/nys-combobox.js
var w9 = 0;
function k5(d21) {
  return `${d21}-${Date.now()}-${w9++}`;
}
var $5 = (d21) => {
  class o18 extends d21 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = k5(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return o18;
};
var O2 = (d21) => {
  class o18 extends $5(d21) {
    constructor() {
      super(...arguments), this.__internals = null;
    }
    get internals() {
      if (this.__internals) return this.__internals;
      if (typeof this.attachInternals == "function")
        try {
          this.__internals = this.attachInternals();
        } catch {
          this.__internals = null;
        }
      return this.__internals;
    }
    get defaultRole() {
      return null;
    }
    setHostAria(e5, t11) {
      const i21 = this.internals;
      if (i21 && e5 in i21) {
        i21[e5] = t11;
        return;
      }
      const r13 = I3(e5);
      t11 === null ? this.removeAttribute(r13) : this.setAttribute(r13, t11);
    }
    reflectDefaultSemantics() {
      const e5 = this.defaultRole;
      e5 && this.setHostAria("role", e5);
    }
    connectedCallback() {
      super.connectedCallback(), this.reflectDefaultSemantics();
    }
  }
  return o18;
};
function I3(d21) {
  if (d21 === "role") return "role";
  const o18 = d21.replace(/^aria/, "");
  return "aria-" + o18.charAt(0).toLowerCase() + o18.slice(1);
}
var V3 = (d21) => {
  const o18 = class extends O2(d21) {
    setFormValue(t11) {
      this.internals?.setFormValue(t11 ?? null);
    }
    setValidityFromState(t11, i21, r13) {
      const c21 = this.internals;
      if (!c21) return;
      const h23 = Object.values(t11).some(Boolean);
      h23 ? c21.setValidity(t11, i21 ?? "Invalid value", r13) : c21.setValidity({}), this.setHostAria("ariaInvalid", h23 ? "true" : "false");
    }
    clearValidity() {
      this.internals?.setValidity({}), this.setHostAria("ariaInvalid", "false");
    }
    checkValidity() {
      return this.internals?.checkValidity() ?? true;
    }
    reportValidity() {
      return this.internals?.reportValidity() ?? true;
    }
    formResetCallback() {
      this.clearValidity();
    }
  };
  return o18.formAssociated = true, o18;
};
var E6 = V3(LitElement);
var C4 = ':host{--_nys-combobox-width: 100%;--_nys-combobox-height: var(--nys-size-500, 40px);--_nys-combobox-border-radius: var(--nys-radius-md, 4px);--_nys-combobox-border-width: var(--nys-border-width-sm, 1px);--_nys-combobox-border-color: var(--nys-color-neutral-400, #909395);--_nys-combobox-color: var( --nys-color-text, var(--nys-color-neutral-900, #1b1b1b) );--_nys-combobox-padding: var(--nys-space-100, 8px) var(--nys-space-150, 12px);--_nys-combobox-gap: var(--nys-space-50, 4px);--_nys-combobox-background-color: var( --nys-color-ink-reverse, var(--nys-color-white, #ffffff) );--_nys-combobox-outline-color--hover: var(--nys-color-neutral-900, #1b1b1b);--_nys-combobox-outline-width: var(--nys-border-width-sm, 1px);--_nys-combobox-outline-color--focus: var(--nys-color-focus, #004dd1);--_nys-combobox-background-color--disabled: var( --nys-color-neutral-10, #f6f6f6 );--_nys-combobox-border-color--disabled: var(--nys-color-neutral-200, #bec0c1);--_nys-combobox-color--disabled: var( --nys-color-text-disabled, var(--nys-color-neutral-200, #bec0c1) );--_nys-combobox-background-color--dropdown: var( --nys-color-ink-reverse, var(--nys-color-white, #ffffff) );--_nys-combobox-border-color--dropdown: var(--nys-color-neutral-400, #909395);--_nys-combobox-shadow--dropdown: var( --nys-shadow-lg, 0 4px 8px rgba(0, 0, 0, .1) );--_nys-combobox-max-height--dropdown: var(--nys-size-3000, 300px);--_nys-combobox-padding--option: var(--nys-space-100, 8px) var(--nys-space-150, 12px);--_nys-combobox-background-color--option--hover: var( --nys-color-neutral-10, #f6f6f6 );--_nys-combobox-background-color--option--active: var( --nys-color-neutral-50, #ededed );--_nys-combobox-background-color--option--disabled: var( --nys-color-white, #ffffff );--_nys-combobox-color--option--disabled: var( --nys-color-text-disabled, #bec0c1 );--_nys-combobox-background-color--option--selected: var( --nys-theme-weaker, #eff6fb );--_nys-combobox-border-color--option--selected: var( --nys-color-theme-mid, #457aa5 );--_nys-combobox-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-combobox-font-size: var(--nys-font-size-ui-md, 16px);--_nys-combobox-font-weight: var(--nys-font-weight-regular, 400);--_nys-combobox-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-combobox-letter-spacing: var( --nys-font-letterspacing-ui-md, var(--nys-font-letterspacing-400, .044px) )}:host([width=sm]){--_nys-combobox-width: var(--nys-form-width-sm, 88px)}:host([width=md]){--_nys-combobox-width: var(--nys-form-width-md, 200px)}:host([width=lg]){--_nys-combobox-width: var(--nys-form-width-lg, 384px)}:host([width=full]){--_nys-combobox-width: 100%;flex:1}:host([showError]){--_nys-combobox-border-color: var(--nys-color-danger, #b52c2c)}:host([inverted]){--_nys-combobox-outline-color--focus: var(--nys-color-focus-reverse, #7aa5e7)}.nys-combobox{font-weight:var(--_nys-combobox-font-weight);font-family:var(--_nys-combobox-font-family);font-size:var(--_nys-combobox-font-size);line-height:var(--_nys-combobox-line-height);letter-spacing:var(--_nys-combobox-letter-spacing);color:var(--_nys-combobox-color);gap:var(--_nys-combobox-gap);display:flex;flex-direction:column;position:relative}.nys-combobox__container{width:var(--_nys-combobox-width);max-width:100%;position:relative}.nys-combobox__input-wrapper{position:relative;display:flex;align-items:center;background-color:var(--_nys-combobox-background-color);border-radius:var(--_nys-combobox-border-radius)}.nys-combobox__input{color:var(--_nys-combobox-color);border-radius:var(--_nys-combobox-border-radius);border:solid var(--_nys-combobox-border-color) var(--_nys-combobox-border-width);outline-color:transparent;outline-width:var(--_nys-combobox-outline-width);outline-style:solid;padding:var(--_nys-combobox-padding);padding-right:calc(var(--nys-size-400, 32px) + var(--nys-space-100, 8px));width:100%;height:var(--_nys-combobox-height);box-sizing:border-box;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;background-color:transparent;font:inherit;cursor:text}.nys-combobox__input:not(:placeholder-shown){padding-right:calc(var(--nys-size-400, 32px) * 2 + var(--nys-space-100, 8px))}.nys-combobox__input:hover:not(:disabled):not(:focus):not([readonly]){outline-color:var(--_nys-combobox-outline-color--hover);border-color:var(--_nys-combobox-outline-color--hover)}.nys-combobox__input:focus:not([readonly]){outline-color:var(--_nys-combobox-outline-color--focus);border-color:var(--_nys-combobox-outline-color--focus);caret-color:var(--_nys-combobox-outline-color--focus)}.nys-combobox__input:disabled{background-color:var(--_nys-combobox-background-color--disabled);border-color:var(--_nys-combobox-border-color--disabled);color:var(--_nys-combobox-color--disabled);cursor:not-allowed}.nys-combobox__buttons{display:flex;position:absolute;right:var(--nys-space-150, 12px);gap:var(--nys-space-150, 12px)}.nys-combobox__buttons nys-button{--_nys-button-padding--y: var(--nys-space-50, 4px);--_nys-button-padding--x: var(--nys-space-50, 4px);--_nys-button-height: var(--nys-size-300, 32px);--_nys-button-width: var(--nys-size-400, 32px)}.nys-combobox__buttons .nys-combobox__chevron{border-inline-start:solid var(--nys-color-neutral-200, #bec0c1) var(--nys-border-width-sm, 1px);padding-inline-start:var(--nys-space-150, 12px)}.nys-combobox__listbox{position:absolute;left:0;right:0;top:calc(100% + var(--nys-space-50, 4px));background-color:var(--_nys-combobox-background-color--dropdown);border:solid var(--_nys-combobox-border-color--dropdown) var(--_nys-combobox-border-width);border-radius:var(--_nys-combobox-border-radius);box-shadow:var(--_nys-combobox-shadow--dropdown);max-height:var(--_nys-combobox-max-height--dropdown);overflow-y:auto;z-index:1000;box-sizing:border-box}.nys-combobox__listbox--above{top:auto;bottom:calc(100% + var(--nys-space-50, 4px))}.nys-combobox__option{padding:var(--_nys-combobox-padding--option);cursor:pointer;-webkit-user-select:none;user-select:none;transition:background-color .15s ease;border-bottom:var(--nys-border-width-sm, 1px) solid var(--nys-color-neutral-50, #ededed);background-color:var(--_nys-combobox-background-color)}.nys-combobox__option:hover:not([disabled]):not(.nys-combobox__option--selected){background-color:var(--_nys-combobox-background-color--option--hover)}.nys-combobox__option:active:not([disabled]):not(.nys-combobox__option--selected){background-color:var(--_nys-combobox-background-color--option--active)}.nys-combobox__option--selected:not([disabled]){background-color:var(--_nys-combobox-background-color--option--selected);border:var(--_nys-combobox-border-color--option--selected) solid 1px}.nys-combobox__option--focused:not([disabled]):not(:hover){outline:var(--_nys-combobox-outline-color--focus) solid 2px;outline-offset:-2px}.nys-combobox__option[disabled]{background-color:var(--_nys-combobox-background-color--option--disabled);color:var(--_nys-combobox-color--option--disabled);cursor:not-allowed}.nys-combobox__optgroup{padding:var(--nys-space-100, 8px) var(--nys-space-150, 12px);border-bottom:var(--nys-border-width-sm, 1px) solid var(--nys-color-neutral-50, #ededed);-webkit-user-select:none;user-select:none;color:var(--nys-color-text);font-family:var(--nys-font-family-ui, "Proxima Nova");font-size:var(--nys-font-size-ui-md, 16px);font-style:normal;font-weight:700;line-height:var(--nys-font-lineheight-ui-md, 24px);letter-spacing:var(--nys-font-letterspacing-ui-md, .044px)}.nys-combobox__optgroup~.nys-combobox__option{padding-left:var(--nys-space-300, 24px)}.nys-combobox__no-results{background-color:var(--_nys-combobox-background-color);padding:var(--_nys-combobox-padding--option);color:var(--_nys-combobox-color);cursor:not-allowed}.nys-combobox__listbox::-webkit-scrollbar{width:var(--nys-space-100, 8px)}.nys-combobox__listbox::-webkit-scrollbar-track{background:var(--nys-color-neutral-50, #eeeeee);border-radius:var(--_nys-combobox-border-radius)}.nys-combobox__listbox::-webkit-scrollbar-thumb{background:var(--nys-color-neutral-300, #a7a9ab);border-radius:var(--_nys-combobox-border-radius)}.nys-combobox__listbox::-webkit-scrollbar-thumb:hover{background:var(--nys-color-neutral-400, #909395)}';
var D2 = Object.defineProperty;
var l = (d21, o18, s13, e5) => {
  for (var t11 = void 0, i21 = d21.length - 1, r13; i21 >= 0; i21--)
    (r13 = d21[i21]) && (t11 = r13(o18, s13, t11) || t11);
  return t11 && D2(o18, s13, t11), t11;
};
var f6 = class f7 extends E6 {
  constructor() {
    super(...arguments), this.id = "", this.name = "", this.label = "", this.description = "", this.value = "", this.disabled = false, this.required = false, this.optional = false, this.tooltip = "", this.form = null, this.width = "full", this.inverted = false, this.showError = false, this.errorMessage = "", this._isOpen = false, this._filterText = "", this._highlightedIndex = -1, this._options = [], this._filteredOptions = [], this._dropdownAbove = false, this._announcement = "", this._originalErrorMessage = "", this._hasUserInteracted = false, this._selectedLabel = "", this._defaultValue = "", this._hasResolvedSlottedValue = false, this._handleDocumentClick = (o18) => {
      o18.target === this || this.shadowRoot?.contains(o18.target) || this._closeDropdown();
    };
  }
  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   * Form association, ElementInternals, and id generation are provided by
   * NysFormControlElement (@nysds/internals).
   */
  connectedCallback() {
    super.connectedCallback(), this._originalErrorMessage = this.errorMessage ?? "", this.addEventListener("invalid", this._handleInvalid), document.addEventListener("click", this._handleDocumentClick);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("invalid", this._handleInvalid), document.removeEventListener("click", this._handleDocumentClick);
  }
  firstUpdated() {
    this._setValue(), this._defaultValue = this.value;
  }
  // Derive display state from `value` before rendering, not after, so Lit
  // doesn't have to schedule a second update (see lit.dev/msg/change-in-update).
  willUpdate(o18) {
    if (o18.has("value")) {
      const s13 = this._options.find((e5) => e5.value === this.value);
      this._selectedLabel = s13 ? s13.label : "", this._filterText = this._selectedLabel;
    }
  }
  updated(o18) {
    o18.has("value") && this._setValue(), o18.has("_isOpen") && this._isOpen && this.updateComplete.then(() => {
      this._positionDropdown(), this._scrollToHighlighted();
    });
  }
  /**
   * Slot handling
   * --------------------------------------------------------------------------
   */
  _handleSlotChange() {
    const o18 = this.shadowRoot?.querySelector(
      'slot:not([name="description"])'
    );
    if (!o18) return;
    const s13 = o18.assignedElements({ flatten: true }), e5 = [];
    let t11 = "";
    if (s13.forEach((i21) => {
      if (i21.tagName === "OPTION") {
        const r13 = i21;
        e5.push({
          value: r13.value,
          label: r13.textContent?.trim() || r13.value,
          disabled: r13.disabled
        }), r13.selected && !t11 && (t11 = r13.value);
      } else if (i21.tagName === "OPTGROUP") {
        const r13 = i21, c21 = r13.label;
        Array.from(r13.children).forEach((h23) => {
          if (h23.tagName === "OPTION") {
            const b24 = h23;
            e5.push({
              value: b24.value,
              label: b24.textContent?.trim() || b24.value,
              disabled: b24.disabled || r13.disabled,
              group: c21
            }), b24.selected && !t11 && (t11 = b24.value);
          }
        });
      }
    }), this._options = e5, this._filteredOptions = e5, this._hasResolvedSlottedValue || (this._hasResolvedSlottedValue = true, !this.value && t11 && (this.value = t11), this._defaultValue = this.value), this.value) {
      const i21 = this._options.find((r13) => r13.value === this.value);
      i21 && (this._selectedLabel = i21.label, this._filterText = i21.label);
    }
  }
  /**
   * Form Integration
   * --------------------------------------------------------------------------
   */
  _setValue() {
    this.setFormValue(this.value), this._manageRequire();
  }
  _manageRequire() {
    const o18 = this.errorMessage || "This field is required";
    this.required && (!this.value || this.value?.trim() === "") ? this.setValidityFromState({ valueMissing: true }, o18, this._input) : (this.clearValidity(), this._hasUserInteracted = false);
  }
  _setValidityMessage(o18 = "") {
    this.showError = !!o18, this._originalErrorMessage?.trim() && o18 !== "" ? this.errorMessage = this._originalErrorMessage : this.errorMessage = o18, o18 ? this.setValidityFromState(
      { customError: true },
      this.errorMessage,
      this._input
    ) : this.clearValidity();
  }
  _validate() {
    if (!this._input) return;
    const o18 = this._input.validity;
    let s13 = "";
    const e5 = this._input && !this._options.some((t11) => t11.value === this.value);
    o18.valueMissing || e5 ? s13 = "This field is required" : s13 = this._input.validationMessage, this._setValidityMessage(s13);
  }
  formResetCallback() {
    this.value = this._defaultValue, this._filterText = this._defaultValue ? this._options.find((o18) => o18.value === this._defaultValue)?.label ?? "" : "", this._selectedLabel = this._filterText, this._input && (this._input.value = this._filterText), this.setFormValue(this.value), this.showError = false, this.errorMessage = "", this.clearValidity(), this.requestUpdate();
  }
  checkValidity() {
    return this._input ? this._input.checkValidity() : true;
  }
  _handleInvalid(o18) {
    if (o18.preventDefault(), this._hasUserInteracted = true, this._validate(), this._input) {
      const s13 = this.internals?.form;
      s13 ? Array.from(s13.elements).find(
        (i21) => typeof i21.checkValidity == "function" && !i21.checkValidity()
      ) === this && this._input.focus() : this._input.focus();
    }
  }
  /**
   * Dropdown positioning
   * --------------------------------------------------------------------------
   */
  _positionDropdown() {
    if (!this._listbox || !this._input) return;
    const o18 = this._input.getBoundingClientRect(), s13 = this._listbox.offsetHeight, t11 = window.innerHeight - o18.bottom, i21 = o18.top;
    this._dropdownAbove = t11 < s13 && i21 > t11;
  }
  /**
   * Filtering
   * --------------------------------------------------------------------------
   */
  _filterOptions(o18) {
    if (!o18) {
      this._filteredOptions = this._options;
      return;
    }
    const s13 = o18.toLowerCase();
    this._filteredOptions = this._options.filter(
      (e5) => e5.label.toLowerCase().includes(s13)
    );
  }
  /**
   * Keyboard navigation
   * --------------------------------------------------------------------------
   */
  _scrollToHighlighted() {
    if (!this._listbox || this._highlightedIndex < 0) return;
    const o18 = this._listbox.querySelector(
      `[data-index="${this._highlightedIndex}"]`
    );
    o18 && o18.scrollIntoView({ block: "nearest" });
  }
  _handleKeyDown(o18) {
    switch (o18.key) {
      case "ArrowDown":
        o18.preventDefault(), this._isOpen ? this._moveHighlight(1) : this._openDropdown();
        break;
      case "ArrowUp":
        o18.preventDefault(), this._isOpen ? this._moveHighlight(-1) : this._openDropdown();
        break;
      case "Enter":
        o18.preventDefault(), this._isOpen && this._highlightedIndex >= 0 && this._selectOption(this._filteredOptions[this._highlightedIndex]);
        break;
      case "Escape":
        o18.preventDefault(), this._closeDropdown(), this._filterText = this._selectedLabel;
        break;
      case "Tab":
        this._isOpen && (this._closeDropdown(), this._filterText = this._selectedLabel);
        break;
    }
  }
  _moveHighlight(o18) {
    if (this._filteredOptions.filter((_17) => !_17.disabled).length === 0) return;
    let e5 = this._highlightedIndex + o18;
    for (e5 < 0 ? e5 = this._filteredOptions.length - 1 : e5 >= this._filteredOptions.length && (e5 = 0); this._filteredOptions[e5]?.disabled; )
      e5 += o18, e5 < 0 && (e5 = this._filteredOptions.length - 1), e5 >= this._filteredOptions.length && (e5 = 0);
    this._highlightedIndex = e5, this._scrollToHighlighted();
    const t11 = this._filteredOptions[e5], i21 = this._filteredOptions[e5 - o18], r13 = this._filteredOptions.filter(
      (_17) => !_17.disabled
    ), c21 = r13.findIndex((_17) => _17.value === t11.value) + 1, h23 = t11.value === this.value ? "selected" : "unselected", x24 = t11.group && t11.group !== i21?.group ? `${t11.group}, ` : "";
    this._announcement = `${x24} ${t11.label} ${c21} of ${r13.length}, ${h23}`;
  }
  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */
  _handleInput(o18) {
    const s13 = o18.target;
    this._filterText = s13.value, this._filterOptions(this._filterText), this._isOpen || this._openDropdown(), this._highlightedIndex = 0;
    const e5 = this._filteredOptions.filter((t11) => !t11.disabled).length;
    this._announcement = e5 > 0 ? `${e5} options available` : "No results found", this._hasUserInteracted && this._validate(), this.dispatchEvent(
      new CustomEvent("nys-input", {
        detail: { id: this.id, value: this._filterText },
        bubbles: true,
        composed: true
      })
    );
  }
  _handleFocus() {
    this.dispatchEvent(
      new Event("nys-focus", { bubbles: true, composed: true })
    );
  }
  _handleBlur(o18) {
    const s13 = o18.relatedTarget;
    s13 && this._listbox?.contains(s13) || ((!this.value || this._filterText !== this._selectedLabel) && (this._filterText = this._selectedLabel, this._filterOptions("")), this._closeDropdown(), this._hasUserInteracted || (this._hasUserInteracted = true), this._validate(), this.dispatchEvent(
      new Event("nys-blur", { bubbles: true, composed: true })
    ));
  }
  _handleIconClick() {
    this.disabled || (this._isOpen ? this._closeDropdown() : (this._input.focus(), this._openDropdown()));
  }
  _handleClearClick(o18) {
    o18.stopPropagation(), this.value = "", this._filterText = "", this._selectedLabel = "", this._filterOptions(""), this.setFormValue(""), this._closeDropdown(), this._input.focus(), this._handleChange();
  }
  _handleOptionClick(o18) {
    o18.disabled || this._selectOption(o18);
  }
  _handleOptionMouseEnter(o18) {
    this._highlightedIndex = o18;
  }
  _selectOption(o18) {
    this.value = o18.value, this._selectedLabel = o18.label, this._filterText = o18.label, this.setFormValue(this.value), this._input.focus(), this._closeDropdown(), this._filterOptions(""), this._setValidityMessage(""), this._hasUserInteracted && this._validate(), this._handleChange();
  }
  _handleChange() {
    this.dispatchEvent(
      new CustomEvent("nys-change", {
        detail: { id: this.id, value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }
  _openDropdown() {
    this._isOpen = true, this._highlightedIndex = this._filteredOptions.findIndex(
      (o18) => o18.value === this.value
    ), this._highlightedIndex < 0 && (this._highlightedIndex = 0);
  }
  _closeDropdown() {
    this._isOpen = false, this._highlightedIndex = -1;
  }
  /**
   * Render helpers
   * --------------------------------------------------------------------------
   */
  _renderOptions() {
    let o18 = "";
    const s13 = [];
    return this._filteredOptions.forEach((e5, t11) => {
      e5.group && e5.group !== o18 && (o18 = e5.group, s13.push(html`
          <div class="nys-combobox__optgroup" role="presentation">
            ${e5.group}
          </div>
        `));
      const i21 = t11 === this._highlightedIndex, r13 = e5.value === this.value;
      s13.push(html`
        <div
          class="nys-combobox__option ${i21 ? "nys-combobox__option--focused" : ""} ${r13 ? "nys-combobox__option--selected" : ""}"
          role="option"
          id="${this.id}--option-${t11}"
          data-index="${t11}"
          aria-selected="${r13}"
          aria-disabled="${e5.disabled || false}"
          ?disabled=${e5.disabled}
          @click=${() => this._handleOptionClick(e5)}
          @mouseenter=${() => this._handleOptionMouseEnter(t11)}
        >
          ${e5.label}
        </div>
      `);
    }), s13.length === 0 ? html`
        <div class="nys-combobox__no-results" role="option">
          No results found
        </div>
      ` : s13;
  }
  render() {
    return html`
      <div class="nys-combobox">
        <nys-label
          id="${this.id}--label"
          label=${this.label}
          description=${this.description}
          flag=${this.required ? "required" : this.optional ? "optional" : ""}
          tooltip=${this.tooltip}
          ?inverted=${this.inverted}
        >
          <slot name="description" slot="description">${this.description}</slot>
        </nys-label>
        <div
          class="nys-combobox__container ${this._isOpen ? "nys-combobox__container--open" : ""}"
        >
          <div class="nys-combobox__input-wrapper">
            <input
              class="nys-combobox__input"
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded="${this._isOpen}"
              aria-controls="${this.id}--listbox"
              aria-activedescendant="${this._highlightedIndex >= 0 ? `${this.id}--option-${this._highlightedIndex}` : ""}"
              name=${this.name}
              id=${this.id + "--native"}
              ?disabled=${this.disabled}
              ?required=${this.required}
              aria-required=${this.required}
              aria-disabled="${this.disabled}"
              aria-labelledby=${ifDefined(
      this.label ? this.id + "--label" : void 0
    )}
              aria-label=${ifDefined(
      !this.label && this.description ? this.description : void 0
    )}
              aria-invalid=${this.showError ? "true" : "false"}
              aria-errormessage=${this.id + "--error"}
              aria-describedby=${ifDefined(
      this.showError ? this.id + "--error" : void 0
    )}
              .value=${this._filterText}
              form=${ifDefined(this.form || void 0)}
              @input=${this._handleInput}
              @focus="${this._handleFocus}"
              @blur="${this._handleBlur}"
              @keydown="${this._handleKeyDown}"
            />
            <div class="nys-combobox__buttons">
              ${this.value ? html`
                    <nys-button
                      class="nys-combobox__clear"
                      label="Clear selection"
                      variant="ghost"
                      size="sm"
                      circle
                      @nys-click=${this._handleClearClick}
                      ?disabled=${this.disabled}
                    >
                      <nys-icon
                        slot="suffix-icon"
                        size="20"
                        name="close"
                      ></nys-icon>
                    </nys-button>
                  ` : ""}
              <nys-button
                class="nys-combobox__chevron"
                label="Toggle dropdown"
                variant="ghost"
                size="sm"
                circle
                @nys-click=${this._handleIconClick}
                ?disabled=${this.disabled}
              >
                <nys-icon
                  slot="suffix-icon"
                  size="20"
                  name="chevron_down"
                ></nys-icon>
              </nys-button>
            </div>
          </div>
          ${this._isOpen ? html`
                <div
                  class="nys-combobox__listbox ${this._dropdownAbove ? "nys-combobox__listbox--above" : ""}"
                  id="${this.id}--listbox"
                  role="listbox"
                  tabindex="-1"
                >
                  ${this._renderOptions()}
                </div>
              ` : ""}
        </div>
        <slot
          style="display: none;"
          @slotchange=${this._handleSlotChange}
        ></slot>
        <nys-errormessage
          id=${this.id + "--error"}
          ?showError=${this.showError}
          errorMessage=${this.errorMessage}
        ></nys-errormessage>
        <div
          aria-live="polite"
          aria-atomic="true"
          style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;"
        >
          ${this._announcement}
        </div>
      </div>
    `;
  }
};
f6.styles = unsafeCSS(C4), f6.shadowRootOptions = __spreadProps(__spreadValues({}, LitElement.shadowRootOptions), {
  delegatesFocus: true
});
var n6 = f6;
l([
  property({ type: String, reflect: true })
], n6.prototype, "id");
l([
  property({ type: String, reflect: true })
], n6.prototype, "name");
l([
  property({ type: String })
], n6.prototype, "label");
l([
  property({ type: String })
], n6.prototype, "description");
l([
  property({ type: String })
], n6.prototype, "value");
l([
  property({ type: Boolean, reflect: true })
], n6.prototype, "disabled");
l([
  property({ type: Boolean, reflect: true })
], n6.prototype, "required");
l([
  property({ type: Boolean, reflect: true })
], n6.prototype, "optional");
l([
  property({ type: String })
], n6.prototype, "tooltip");
l([
  property({ type: String, reflect: true })
], n6.prototype, "form");
l([
  property({ type: String, reflect: true })
], n6.prototype, "width");
l([
  property({ type: Boolean, reflect: true })
], n6.prototype, "inverted");
l([
  property({ type: Boolean, reflect: true })
], n6.prototype, "showError");
l([
  property({ type: String })
], n6.prototype, "errorMessage");
l([
  state()
], n6.prototype, "_isOpen");
l([
  state()
], n6.prototype, "_filterText");
l([
  state()
], n6.prototype, "_highlightedIndex");
l([
  state()
], n6.prototype, "_options");
l([
  state()
], n6.prototype, "_filteredOptions");
l([
  state()
], n6.prototype, "_dropdownAbove");
l([
  state()
], n6.prototype, "_announcement");
l([
  query("input")
], n6.prototype, "_input");
l([
  query(".nys-combobox__listbox")
], n6.prototype, "_listbox");
customElements.get("nys-combobox") || customElements.define("nys-combobox", n6);

// ../../nys-datepicker/dist/nys-datepicker.js
var Ke2 = 0;
function Ge(t11) {
  return `${t11}-${Date.now()}-${Ke2++}`;
}
var Qe2 = (t11) => {
  class e5 extends t11 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = Ge(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return e5;
};
var Xe2 = (t11) => {
  class e5 extends Qe2(t11) {
    constructor() {
      super(...arguments), this.__internals = null;
    }
    get internals() {
      if (this.__internals) return this.__internals;
      if (typeof this.attachInternals == "function")
        try {
          this.__internals = this.attachInternals();
        } catch {
          this.__internals = null;
        }
      return this.__internals;
    }
    get defaultRole() {
      return null;
    }
    setHostAria(s13, r13) {
      const n13 = this.internals;
      if (n13 && s13 in n13) {
        n13[s13] = r13;
        return;
      }
      const i21 = Je2(s13);
      r13 === null ? this.removeAttribute(i21) : this.setAttribute(i21, r13);
    }
    reflectDefaultSemantics() {
      const s13 = this.defaultRole;
      s13 && this.setHostAria("role", s13);
    }
    connectedCallback() {
      super.connectedCallback(), this.reflectDefaultSemantics();
    }
  }
  return e5;
};
function Je2(t11) {
  if (t11 === "role") return "role";
  const e5 = t11.replace(/^aria/, "");
  return "aria-" + e5.charAt(0).toLowerCase() + e5.slice(1);
}
var Ve2 = (t11) => {
  const e5 = class extends Xe2(t11) {
    setFormValue(r13) {
      this.internals?.setFormValue(r13 ?? null);
    }
    setValidityFromState(r13, n13, i21) {
      const o18 = this.internals;
      if (!o18) return;
      const c21 = Object.values(r13).some(Boolean);
      c21 ? o18.setValidity(r13, n13 ?? "Invalid value", i21) : o18.setValidity({}), this.setHostAria("ariaInvalid", c21 ? "true" : "false");
    }
    clearValidity() {
      this.internals?.setValidity({}), this.setHostAria("ariaInvalid", "false");
    }
    checkValidity() {
      return this.internals?.checkValidity() ?? true;
    }
    reportValidity() {
      return this.internals?.reportValidity() ?? true;
    }
    formResetCallback() {
      this.clearValidity();
    }
  };
  return e5.formAssociated = true, e5;
};
var Ze2 = Ve2(LitElement);
var et2 = ':host{--_nys-datepicker-width: fit-content;--_nys-datepicker-width--input: var(--nys-form-width-md, 200px);--_nys-datepicker-gap: var(--nys-space-100, 8px);--_nys-datepicker-height: var(--nys-size-600, 48px);--_nys-datepicker-radius: var(--nys-radius-xl, 12px);--_nys-datepicker-color: var( --nys-color-text, var(--nys-color-neutral-900, #1b1b1b) );--_nys-datepicker-color--disabled: var(--nys-color-text-disabled, #bec0c1);--_nys-datepicker-space-sm: var(--nys-space-50, 4px);--_nys-datepicker-space-md: var(--nys-space-100, 8px);--_nys-datepicker-space-lg: var(--nys-space-150, 12px);--_nys-datepicker-border-width: var(--nys-border-width-sm, 1px);--_nys-datepicker-border-color: var(--nys-color-neutral-400, #909395);--_nys-datepicker-border-radius: var(--nys-radius-md, 4px);--_nys-datepicker-outline-color--hover: var(--nys-color-neutral-900, #1b1b1b);--_nys-datepicker-outline-color--focus: var(--nys-color-focus, #004dd1);--_nys-datepicker-font-size: var(--nys-font-size-ui-md, 16px);--_nys-datepicker-font-weight: var(--nys-font-weight-regular, 400);--_nys-datepicker-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-datepicker-letterspacing: var(--nys-font-letterspacing-ui-md, .044px);--_nys-datepicker-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-datepicker-text-color: var(--nys-color-text, #1b1b1b);--_nys-datepicker-text-disabled: var(--nys-color-text-disabled, #bec0c1);--_nys-datepicker-background-color: var(--nys-color-ink-reverse, #ffffff);--_nys-datepicker-background-color--button--active: var( --nys-color-gray-100, #d0d0ce );--_nys-datepicker-padding--calendar: var(--nys-space-200, 16px);--_nys-datepicker-color--calendar--weekends: var( --nys-color-text-weaker, #797c7f );--_nys-datepicker-gap--calendar-row: var(--nys-space-2-px, 2px);--_nys-datepicker-font-size--date: var(--nys-font-size-ui-sm, 14px);--_nys-datepicker-background-color--date--hover: var( --nys-color-neutral-50, #ededed );--_nys-datepicker-background-color--date--active: var( --nys-color-neutral-100, #d0d0ce );--_nys-datepicker-background-color--date--selected: var( --nys-color-info-weak, #e5effa );--_nys-datepicker-focus-ring--date: var(--nys-color-link, #004dd1);--_nys-datepicker-color--date: var(--nys-color-text, #1b1b1b);--_nys-datepicker-color--date--hover: var(--nys-color-text, #1b1b1b);--_nys-datepicker-color--date--selected: var(--nys-color-info, #004dd1);--_nys-datepicker-color--date--disabled: var( --nys-color-text-disabled, #bec0c1 );--_nys-datepicker-border-color--date--disabled: var( --nys-color-neutral-200, #bec0c1 );--_nys-datepicker-background-color--navigation--hover: var( --nys-color-neutral-10, #f6f6f6 );--_nys-datepicker-background-color--navigation--pressed: var( --nys-color-neutral-50, #ededed );--_nys-datepicker-background-color--navigation--disabled: var( --nys-color-neutral-10, #f6f6f6 );--_nys-datepicker-color--navigation--hover: var( --nys-color-neutral-900, #1b1b1b );--_nys-datepicker-color--navigation--pressed: var( --nys-color-neutral-900, #1b1b1b );--_nys-datepicker-color--navigation--disabled: var( --nys-color-neutral-200, #bec0c1 );--_nys-datepicker-box-shadow-border--navigation: inset 0 0 0 1px var(--nys-color-neutral-900, #1b1b1b)}:host([width=lg]){--_nys-datepicker-width--input: var(--nys-form-width-lg, 384px)}:host([width=full]){--_nys-datepicker-width--input: 100%}:host([showError]){--_nys-datepicker-border-color: var(--nys-color-danger, #b52c2c)}:host([inverted]){--_nys-datepicker-outline-color--focus: var( --nys-color-focus-reverse, #7aa5e7 )}.nys-datepicker--container{position:relative;display:flex;flex-direction:column;gap:var(--_nys-datepicker-space-sm);font-family:var(--_nys-datepicker-font-family);font-size:var(--_nys-datepicker-font-size);font-weight:var(--_nys-datepicker-font-weight);line-height:var(--_nys-datepicker-line-height);width:100%}.nys-datepicker--container .nys-datepicker--input-container{position:relative;width:var(--_nys-datepicker-width--input);display:flex;cursor:pointer}.nys-datepicker--container .nys-datepicker--input-container.disabled #calendar-button{cursor:not-allowed;color:var(--_nys-datepicker-color--date--disabled)}.nys-datepicker--container .nys-datepicker--input-container .nys-datepicker--input{cursor:text;text-align:start;font-family:var(--_nys-datepicker-font-family);font-size:var(--_nys-datepicker-font-size);flex:1;height:24px;outline:transparent solid 1px;border-radius:var(--_nys-datepicker-border-radius);border:var(--_nys-datepicker-border-width) solid var(--_nys-datepicker-border-color);background-color:var(--_nys-datepicker-background-color);padding:var(--_nys-datepicker-space-md) var(--_nys-datepicker-space-md) var(--_nys-datepicker-space-md) var(--_nys-datepicker-space-lg);color:var(--_nys-datepicker-color)}.nys-datepicker--container .nys-datepicker--input-container .nys-datepicker--input:hover{outline-color:var(--_nys-datepicker-outline-color--hover);border-color:var(--_nys-datepicker-outline-color--hover)}.nys-datepicker--container .nys-datepicker--input-container .nys-datepicker--input:focus{outline-color:var(--_nys-datepicker-outline-color--focus);border-color:var(--_nys-datepicker-outline-color--focus)}.nys-datepicker--container .nys-datepicker--input-container .nys-datepicker--input:disabled{border:var(--_nys-datepicker-border-width) solid var(--_nys-datepicker-color--navigation--disabled);cursor:not-allowed;color:var(--_nys-datepicker-color--disabled)}.nys-datepicker--container .nys-datepicker--input-container .nys-datepicker--input::-webkit-date-and-time-value{text-align:start}.nys-datepicker--container .nys-datepicker--input-container input[type=date]::-webkit-inner-spin-button,.nys-datepicker--container .nys-datepicker--input-container input[type=date]::-webkit-calendar-picker-indicator{display:none;appearance:none}.nys-datepicker--container .nys-datepicker--input-container #calendar-button{display:flex;align-items:center;justify-content:center;padding:var(--_nys-datepicker-space-sm);border-radius:var(--_nys-datepicker-border-radius);border:var(--_nys-datepicker-border-width) solid var(--_nys-datepicker-background-color);outline:transparent solid 1px;background-color:var(--_nys-datepicker-background-color);position:absolute;top:50%;right:var(--_nys-datepicker-space-sm);transform:translateY(-50%);cursor:pointer}.nys-datepicker--container .nys-datepicker--input-container #calendar-button:hover{outline-color:var(--_nys-datepicker-background-color--date--hover);border-color:var(--_nys-datepicker-background-color--date--hover);background:var(--_nys-datepicker-background-color--date--hover)}.nys-datepicker--container .nys-datepicker--input-container #calendar-button:active{outline-color:var(--_nys-datepicker-background-color--button--active);border-color:var(--_nys-datepicker-background-color--button--active);background:var(--_nys-datepicker-background-color--button--active)}.nys-datepicker--container .nys-datepicker--input-container #calendar-button:focus:not(:active):not(:disabled){outline-color:var(--_nys-datepicker-outline-color--focus);border-color:var(--_nys-datepicker-outline-color--focus)}.nys-datepicker--container .wc-datepicker--container{display:flex;width:fit-content}.nys-datepicker--container .wc-datepicker--container *{flex:1}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;border:0}wc-datepicker{display:none;padding:var(--_nys-datepicker-padding--calendar);border-radius:var(--_nys-datepicker-border-radius);border:var(--_nys-datepicker-border-width) solid var(--nys-color-neutral-100, #d0d0ce);background-color:var(--_nys-datepicker-background-color);box-shadow:0 4px 6px -1px var(--nys-color-black-transparent-100, rgba(27, 27, 27, .1)),0 4px 6px -1px var(--nys-color-black-transparent-50, rgba(27, 27, 27, .01));color:var(--_nys-datepicker-text-color);margin-bottom:3px}wc-datepicker.active{display:flex;flex-direction:column-reverse;position:absolute;z-index:1}wc-datepicker .position-top{box-shadow:0 -4px 6px -1px var(--nys-color-black-transparent-100, rgba(27, 27, 27, .1)),0 -4px 6px -1px var(--nys-color-black-transparent-50, rgba(27, 27, 27, .01))}wc-datepicker *,wc-datepicker *:before,wc-datepicker *:after{margin:0;box-sizing:border-box}.wc-datepicker{display:block;width:min-content;font-family:var(--_nys-datepicker-font-family);font-size:var(--_nys-datepicker-font-size--date);font-weight:400;line-height:var(--_nys-datepicker-line-height);letter-spacing:var(--_nys-datepicker-letterspacing)}.wc-datepicker--disabled *:disabled{opacity:.5;cursor:not-allowed}.wc-datepicker--disabled .wc-datepicker__date{cursor:not-allowed;opacity:.5}.wc-datepicker--disabled .wc-datepicker__date:focus{outline:none;border-color:var(--_nys-datepicker-border-color--date--disabled);box-shadow:none}.wc-datepicker--disabled .wc-datepicker__date:hover:not(.wc-datepicker__date--selected){background-color:transparent}.wc-datepicker--disabled .wc-datepicker__date--selected:hover{color:var(--_nys-datepicker-background-color);background-color:var(--_nys-datepicker-background-color--date--selected)}.wc-datepicker--disabled #wc-month-dropdown-icon{color:var(--_nys-datepicker-color--date--disabled)}.wc-datepicker__header{display:flex;align-items:center;gap:var(--_nys-datepicker-space-sm)}.wc-datepicker__current-month{display:flex;flex-grow:1;gap:var(--_nys-datepicker-space-sm)}.wc-datepicker__month-select,.wc-datepicker__year-select{display:flex;align-items:center;font-size:var(--_nys-datepicker-font-size);font-family:var(--_nys-datepicker-font-family);padding:var(--_nys-datepicker-space-md) var(--_nys-datepicker-space-lg);border:solid var(--_nys-datepicker-border-width) var(--_nys-datepicker-border-color);border-radius:.25rem;color:var(--_nys-datepicker-color);background-color:var(--_nys-datepicker-background-color);line-height:var(--_nys-datepicker-line-height)}.wc-datepicker__month-select:hover:not(:disabled),.wc-datepicker__year-select:hover:not(:disabled){border:var(--_nys-datepicker-border-width) solid var(--_nys-datepicker-color--navigation--hover);background-color:var(--_nys-datepicker-background-color--navigation--hover);box-shadow:var(--_nys-datepicker-box-shadow-border--navigation)}.wc-datepicker__month-select:active:not(:disabled),.wc-datepicker__month-select[aria-pressed=true],.wc-datepicker__year-select:active:not(:disabled),.wc-datepicker__year-select[aria-pressed=true]{border:var(--_nys-datepicker-border-width) solid var(--_nys-datepicker-color--navigation--pressed);background-color:var(--_nys-datepicker-background-color--navigation--pressed);box-shadow:var(--_nys-datepicker-box-shadow-border--navigation)}.wc-datepicker__month-select:disabled,.wc-datepicker__month-select[aria-disabled=true],.wc-datepicker__year-select:disabled,.wc-datepicker__year-select[aria-disabled=true]{border:var(--_nys-datepicker-border-width) solid var(--_nys-datepicker-color--navigation--disabled);background-color:var(--_nys-datepicker-background-color--navigation--disabled);color:var(--_nys-datepicker-color--disabled)}.wc-datepicker .month-wrapper{position:relative;width:135px;display:flex;align-items:center;align-self:stretch}.wc-datepicker .month-wrapper #wc-month-dropdown-icon{position:absolute;right:10px;top:50%;transform:translateY(-50%);pointer-events:none}.wc-datepicker__month-select{width:100%;max-width:100%;flex-grow:1;cursor:pointer;appearance:none;text-overflow:ellipsis;padding-right:var(--nys-space-400, 32px)}.wc-datepicker__month-select>*{width:91px;height:24px}.wc-datepicker__year-select{border:solid var(--_nys-datepicker-border-width) var(--_nys-datepicker-border-color);border-radius:.25rem;padding-right:var(--_nys-datepicker-space-sm);max-width:5rem}.wc-datepicker__previous-month-button,.wc-datepicker__next-month-button,.wc-datepicker__previous-year-button,.wc-datepicker__next-year-button{display:inline-flex;width:40px;max-width:40px;max-height:42px;padding:var(--_nys-datepicker-space-lg);justify-content:center;align-items:center;border:solid var(--_nys-datepicker-border-width) var(--_nys-datepicker-border-color);border-radius:.25rem;color:var(--_nys-datepicker-color--date);background-color:var(--_nys-datepicker-background-color);cursor:pointer}.wc-datepicker__previous-month-button:hover:not(:disabled),.wc-datepicker__next-month-button:hover:not(:disabled),.wc-datepicker__previous-year-button:hover:not(:disabled),.wc-datepicker__next-year-button:hover:not(:disabled){background-color:var(--_nys-datepicker-background-color--navigation--hover);box-shadow:var(--_nys-datepicker-box-shadow-border--navigation);border:var(--_nys-datepicker-border-width) solid var(--_nys-datepicker-color--navigation--hover)}.wc-datepicker__previous-month-button:active:not(:disabled),.wc-datepicker__previous-month-button[aria-pressed=true],.wc-datepicker__next-month-button:active:not(:disabled),.wc-datepicker__next-month-button[aria-pressed=true],.wc-datepicker__previous-year-button:active:not(:disabled),.wc-datepicker__previous-year-button[aria-pressed=true],.wc-datepicker__next-year-button:active:not(:disabled),.wc-datepicker__next-year-button[aria-pressed=true]{background-color:var(--_nys-datepicker-background-color--navigation--pressed);box-shadow:var(--_nys-datepicker-box-shadow-border--navigation);border:var(--_nys-datepicker-border-width) solid var(--_nys-datepicker-color--navigation--pressed)}.wc-datepicker__previous-month-button:disabled,.wc-datepicker__previous-month-button[aria-disabled=true],.wc-datepicker__next-month-button:disabled,.wc-datepicker__next-month-button[aria-disabled=true],.wc-datepicker__previous-year-button:disabled,.wc-datepicker__previous-year-button[aria-disabled=true],.wc-datepicker__next-year-button:disabled,.wc-datepicker__next-year-button[aria-disabled=true]{background-color:var(--_nys-datepicker-background-color--navigation--disabled);border:var(--_nys-datepicker-border-width) solid var(--_nys-datepicker-color--navigation--disabled);color:var(--_nys-datepicker-color--disabled)}.wc-datepicker__calendar{width:100%;table-layout:fixed;border-collapse:collapse}.wc-datepicker__weekday{padding:var(--_nys-datepicker-padding--calendar) 0 var(--_nys-datepicker-space-sm) 0;min-width:var(--nys-size-500, 40px);font-weight:600;aspect-ratio:1}.wc-datepicker__weekday>span{width:42.3px;height:24px;display:flex;justify-content:center;align-items:center}.wc-datepicker__weekday[aria-label=Saturday],.wc-datepicker__weekday[aria-label=Sunday]{color:var(--_nys-datepicker-color--calendar--weekends)}.wc-datepicker__date{padding:var(--_nys-datepicker-space-md);text-align:center;cursor:pointer;border-radius:var(--nys-radius-lg)}.wc-datepicker__date:focus,.wc-datepicker__date:focus-visible{outline:none}.wc-datepicker__date:focus{box-shadow:inset 0 0 0 2px var(--_nys-datepicker-focus-ring--date)}.wc-datepicker__date:hover:not(.wc-datepicker__date--selected):not(:active){color:var(--_nys-datepicker-color--date--hover);background-color:var(--_nys-datepicker-background-color--date--hover)}.wc-datepicker__date:active{color:var(--_nys-datepicker-color--date--hover);background-color:var(--_nys-datepicker-background-color--date--active)}.wc-datepicker__date>*{display:flex;justify-content:center;align-items:center;aspect-ratio:1;width:24.3px;height:24px}.wc-datepicker__date--today{font-weight:600;color:var(--_nys-datepicker-color--date--selected)}.wc-datepicker__date--today>*{font-style:normal;text-decoration-line:underline}.wc-datepicker__date--selected{text-decoration-line:none;background-color:var(--_nys-datepicker-background-color--date--selected);color:var(--_nys-datepicker-color--date--selected)}.wc-datepicker__date--selected>*{font-weight:600}.wc-datepicker__date--disabled{color:var(--_nys-datepicker-color--date--disabled);cursor:default}.wc-datepicker__date--disabled:not(.wc-datepicker__date--disabled--selected,.wc-datepicker__date--disabled--in-range):hover{background-color:transparent}.wc-datepicker__date.wc-datepicker__date--overflowing{color:var(--_nys-datepicker-text-disabled)}.wc-datepicker__date.wc-datepicker__date--overflowing:hover,.wc-datepicker__date.wc-datepicker__date--overflowing:active{color:var(--_nys-datepicker-color)}.wc-datepicker--button-container{display:flex;padding-top:var(--_nys-datepicker-space-lg);align-items:flex-end;gap:var(--_nys-datepicker-padding--calendar);align-self:stretch}.wc-datepicker tr.wc-datepicker__calendar-row.sc-wc-datepicker{display:flex;align-items:center;gap:var(--_nys-datepicker-gap--calendar-row);align-self:stretch}';
var R = {
  allRenderFn: false,
  cmpDidLoad: true,
  cmpDidUnload: false,
  cmpDidUpdate: true,
  cmpDidRender: true,
  cmpWillLoad: true,
  cmpWillUpdate: true,
  cmpWillRender: true,
  connectedCallback: true,
  disconnectedCallback: true,
  element: true,
  event: true,
  hasRenderFn: true,
  lifecycle: true,
  hostListener: true,
  hostListenerTargetWindow: true,
  hostListenerTargetDocument: true,
  hostListenerTargetBody: true,
  hostListenerTargetParent: false,
  hostListenerTarget: true,
  member: true,
  method: true,
  mode: true,
  observeAttribute: true,
  prop: true,
  propMutable: true,
  reflect: true,
  scoped: true,
  shadowDom: true,
  slot: true,
  cssAnnotations: true,
  state: true,
  style: true,
  svg: true,
  updatable: true,
  vdomAttribute: true,
  vdomXlink: true,
  vdomClass: true,
  vdomFunctional: true,
  vdomKey: true,
  vdomListener: true,
  vdomRef: true,
  vdomPropOrAttr: true,
  vdomRender: true,
  vdomStyle: true,
  vdomText: true,
  watchCallback: true,
  taskQueue: true,
  hotModuleReplacement: false,
  isDebug: false,
  isDev: false,
  isTesting: false,
  hydrateServerSide: false,
  hydrateClientSide: false,
  lifecycleDOMEvents: false,
  lazyLoad: false,
  profile: false,
  slotRelocation: true,
  appendChildSlotFix: false,
  cloneNodeFix: false,
  hydratedAttribute: false,
  hydratedClass: true,
  safari10: false,
  scriptDataOpts: false,
  scopedSlotTextContentFix: false,
  shadowDomShim: false,
  slotChildNodesFix: false,
  invisiblePrehydration: true,
  propBoolean: true,
  propNumber: true,
  propString: true,
  cssVarShim: false,
  constructableCSS: true,
  cmpShouldUpdate: true,
  devTools: false,
  dynamicImportShim: false,
  shadowDelegatesFocus: true,
  initializeNextTick: false,
  asyncLoading: false,
  asyncQueue: false,
  transformTagName: false,
  attachStyles: true
};
var B2;
var we;
var X2;
var De = false;
var H2 = false;
var se2 = false;
var $6 = false;
var ne = null;
var te = false;
var T = (t11, e5 = "") => () => {
};
var oe2 = "http://www.w3.org/1999/xlink";
var ce2 = {};
var tt = "http://www.w3.org/2000/svg";
var at = "http://www.w3.org/1999/xhtml";
var st = (t11) => t11 != null;
var re2 = (t11) => (t11 = typeof t11, t11 === "object" || t11 === "function");
function rt(t11) {
  var e5, a12, s13;
  return (s13 = (a12 = (e5 = t11.head) === null || e5 === void 0 ? void 0 : e5.querySelector('meta[name="csp-nonce"]')) === null || a12 === void 0 ? void 0 : a12.getAttribute("content")) !== null && s13 !== void 0 ? s13 : void 0;
}
var h8 = (t11, e5, ...a12) => {
  let s13 = null, r13 = null, n13 = null, i21 = false, o18 = false;
  const c21 = [], l17 = (d21) => {
    for (let p19 = 0; p19 < d21.length; p19++)
      s13 = d21[p19], Array.isArray(s13) ? l17(s13) : s13 != null && typeof s13 != "boolean" && ((i21 = typeof t11 != "function" && !re2(s13)) && (s13 = String(s13)), i21 && o18 ? c21[c21.length - 1].$text$ += s13 : c21.push(i21 ? j2(null, s13) : s13), o18 = i21);
  };
  if (l17(a12), e5) {
    e5.key && (r13 = e5.key), e5.name && (n13 = e5.name);
    {
      const d21 = e5.className || e5.class;
      d21 && (e5.class = typeof d21 != "object" ? d21 : Object.keys(d21).filter((p19) => d21[p19]).join(" "));
    }
  }
  if (typeof t11 == "function")
    return t11(e5 === null ? {} : e5, c21, nt);
  const u17 = j2(t11, null);
  return u17.$attrs$ = e5, c21.length > 0 && (u17.$children$ = c21), u17.$key$ = r13, u17.$name$ = n13, u17;
};
var j2 = (t11, e5) => {
  const a12 = {
    $flags$: 0,
    $tag$: t11,
    $text$: e5,
    $elm$: null,
    $children$: null
  };
  return a12.$attrs$ = null, a12.$key$ = null, a12.$name$ = null, a12;
};
var xe = {};
var it = (t11) => t11 && t11.$tag$ === xe;
var nt = {
  forEach: (t11, e5) => t11.map(le2).forEach(e5),
  map: (t11, e5) => t11.map(le2).map(e5).map(ot)
};
var le2 = (t11) => ({
  vattrs: t11.$attrs$,
  vchildren: t11.$children$,
  vkey: t11.$key$,
  vname: t11.$name$,
  vtag: t11.$tag$,
  vtext: t11.$text$
});
var ot = (t11) => {
  if (typeof t11.vtag == "function") {
    const a12 = Object.assign({}, t11.vattrs);
    return t11.vkey && (a12.key = t11.vkey), t11.vname && (a12.name = t11.vname), h8(t11.vtag, a12, ...t11.vchildren || []);
  }
  const e5 = j2(t11.vtag, t11.vtext);
  return e5.$attrs$ = t11.vattrs, e5.$children$ = t11.vchildren, e5.$key$ = t11.vkey, e5.$name$ = t11.vname, e5;
};
var ct = (t11) => At2.map((e5) => e5(t11)).find((e5) => !!e5);
var lt = (t11, e5) => t11 != null && !re2(t11) ? e5 & 4 ? t11 === "false" ? false : t11 === "" || !!t11 : e5 & 2 ? parseFloat(t11) : e5 & 1 ? String(t11) : t11 : t11;
var dt = (t11) => t11;
var de = (t11, e5, a12) => {
  const s13 = dt(t11);
  return {
    emit: (r13) => ut2(s13, e5, {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: r13
    })
  };
};
var ut2 = (t11, e5, a12) => {
  const s13 = b11.ce(e5, a12);
  return t11.dispatchEvent(s13), s13;
};
var ue2 = /* @__PURE__ */ new WeakMap();
var ht = (t11, e5, a12) => {
  let s13 = K.get(t11);
  qt && a12 ? (s13 = s13 || new CSSStyleSheet(), typeof s13 == "string" ? s13 = e5 : s13.replaceSync(e5)) : s13 = e5, K.set(t11, s13);
};
var pt2 = (t11, e5, a12, s13) => {
  var r13;
  let n13 = Se(e5, a12);
  const i21 = K.get(n13);
  if (t11 = t11.nodeType === 11 ? t11 : w10, i21)
    if (typeof i21 == "string") {
      t11 = t11.head || t11;
      let o18 = ue2.get(t11), c21;
      if (o18 || ue2.set(t11, o18 = /* @__PURE__ */ new Set()), !o18.has(n13)) {
        {
          c21 = w10.createElement("style"), c21.innerHTML = i21;
          const l17 = (r13 = b11.$nonce$) !== null && r13 !== void 0 ? r13 : rt(w10);
          l17 != null && c21.setAttribute("nonce", l17), t11.insertBefore(c21, t11.querySelector("link"));
        }
        o18 && o18.add(n13);
      }
    } else t11.adoptedStyleSheets.includes(i21) || (t11.adoptedStyleSheets = [...t11.adoptedStyleSheets, i21]);
  return n13;
};
var ft2 = (t11) => {
  const e5 = t11.$cmpMeta$, a12 = t11.$hostElement$, s13 = e5.$flags$, r13 = T("attachStyles", e5.$tagName$), n13 = pt2(a12.shadowRoot ? a12.shadowRoot : a12.getRootNode(), e5, t11.$modeName$);
  s13 & 10 && (a12["s-sc"] = n13, a12.classList.add(n13 + "-h"), s13 & 2 && a12.classList.add(n13 + "-s")), r13();
};
var Se = (t11, e5) => "sc-" + (e5 && t11.$flags$ & 32 ? t11.$tagName$ + "-" + e5 : t11.$tagName$);
var he = (t11, e5, a12, s13, r13, n13) => {
  if (a12 !== s13) {
    let i21 = ge(t11, e5), o18 = e5.toLowerCase();
    if (e5 === "class") {
      const c21 = t11.classList, l17 = pe2(a12), u17 = pe2(s13);
      c21.remove(...l17.filter((d21) => d21 && !u17.includes(d21))), c21.add(...u17.filter((d21) => d21 && !l17.includes(d21)));
    } else if (e5 === "style") {
      for (const c21 in a12)
        (!s13 || s13[c21] == null) && (c21.includes("-") ? t11.style.removeProperty(c21) : t11.style[c21] = "");
      for (const c21 in s13)
        (!a12 || s13[c21] !== a12[c21]) && (c21.includes("-") ? t11.style.setProperty(c21, s13[c21]) : t11.style[c21] = s13[c21]);
    } else if (e5 !== "key")
      if (e5 === "ref")
        s13 && s13(t11);
      else if (!t11.__lookupSetter__(e5) && e5[0] === "o" && e5[1] === "n")
        e5[2] === "-" ? e5 = e5.slice(3) : ge(V4, o18) ? e5 = o18.slice(2) : e5 = o18[2] + e5.slice(3), a12 && b11.rel(t11, e5, a12, false), s13 && b11.ael(t11, e5, s13, false);
      else {
        const c21 = re2(s13);
        if ((i21 || c21 && s13 !== null) && !r13)
          try {
            if (t11.tagName.includes("-"))
              t11[e5] = s13;
            else {
              const u17 = s13 ?? "";
              e5 === "list" ? i21 = false : (a12 == null || t11[e5] != u17) && (t11[e5] = u17);
            }
          } catch {
          }
        let l17 = false;
        o18 !== (o18 = o18.replace(/^xlink\:?/, "")) && (e5 = o18, l17 = true), s13 == null || s13 === false ? (s13 !== false || t11.getAttribute(e5) === "") && (l17 ? t11.removeAttributeNS(oe2, e5) : t11.removeAttribute(e5)) : (!i21 || n13 & 4 || r13) && !c21 && (s13 = s13 === true ? "" : s13, l17 ? t11.setAttributeNS(oe2, e5, s13) : t11.setAttribute(e5, s13));
      }
  }
};
var yt = /\s/;
var pe2 = (t11) => t11 ? t11.split(yt) : [];
var Me = (t11, e5, a12, s13) => {
  const r13 = e5.$elm$.nodeType === 11 && e5.$elm$.host ? e5.$elm$.host : e5.$elm$, n13 = t11 && t11.$attrs$ || ce2, i21 = e5.$attrs$ || ce2;
  for (s13 in n13)
    s13 in i21 || he(r13, s13, n13[s13], void 0, a12, e5.$flags$);
  for (s13 in i21)
    he(r13, s13, n13[s13], i21[s13], a12, e5.$flags$);
};
var z4 = (t11, e5, a12, s13) => {
  const r13 = e5.$children$[a12];
  let n13 = 0, i21, o18, c21;
  if (De || (se2 = true, r13.$tag$ === "slot" && (B2 && s13.classList.add(B2 + "-s"), r13.$flags$ |= r13.$children$ ? (
    // slot element has fallback content
    2
  ) : (
    // slot element does not have fallback content
    1
  ))), r13.$text$ !== null)
    i21 = r13.$elm$ = w10.createTextNode(r13.$text$);
  else if (r13.$flags$ & 1)
    i21 = r13.$elm$ = w10.createTextNode("");
  else {
    if ($6 || ($6 = r13.$tag$ === "svg"), i21 = r13.$elm$ = w10.createElementNS($6 ? tt : at, r13.$flags$ & 2 ? "slot-fb" : r13.$tag$), $6 && r13.$tag$ === "foreignObject" && ($6 = false), Me(null, r13, $6), st(B2) && i21["s-si"] !== B2 && i21.classList.add(i21["s-si"] = B2), r13.$children$)
      for (n13 = 0; n13 < r13.$children$.length; ++n13)
        o18 = z4(t11, r13, n13, i21), o18 && i21.appendChild(o18);
    r13.$tag$ === "svg" ? $6 = false : i21.tagName === "foreignObject" && ($6 = true);
  }
  return i21["s-hn"] = X2, r13.$flags$ & 3 && (i21["s-sr"] = true, i21["s-cr"] = we, i21["s-sn"] = r13.$name$ || "", c21 = t11 && t11.$children$ && t11.$children$[a12], c21 && c21.$tag$ === r13.$tag$ && t11.$elm$ && P2(t11.$elm$, false)), i21;
};
var P2 = (t11, e5) => {
  b11.$flags$ |= 1;
  const a12 = t11.childNodes;
  for (let s13 = a12.length - 1; s13 >= 0; s13--) {
    const r13 = a12[s13];
    r13["s-hn"] !== X2 && r13["s-ol"] && (Le(r13).insertBefore(r13, ie(r13)), r13["s-ol"].remove(), r13["s-ol"] = void 0, se2 = true), e5 && P2(r13, e5);
  }
  b11.$flags$ &= -2;
};
var Ce = (t11, e5, a12, s13, r13, n13) => {
  let i21 = t11["s-cr"] && t11["s-cr"].parentNode || t11, o18;
  for (i21.shadowRoot && i21.tagName === X2 && (i21 = i21.shadowRoot); r13 <= n13; ++r13)
    s13[r13] && (o18 = z4(null, a12, r13, t11), o18 && (s13[r13].$elm$ = o18, i21.insertBefore(o18, ie(e5))));
};
var Te = (t11, e5, a12, s13, r13) => {
  for (; e5 <= a12; ++e5)
    (s13 = t11[e5]) && (r13 = s13.$elm$, Be2(s13), H2 = true, r13["s-ol"] ? r13["s-ol"].remove() : P2(r13, true), r13.remove());
};
var gt = (t11, e5, a12, s13) => {
  let r13 = 0, n13 = 0, i21 = 0, o18 = 0, c21 = e5.length - 1, l17 = e5[0], u17 = e5[c21], d21 = s13.length - 1, p19 = s13[0], k17 = s13[d21], _17, S12;
  for (; r13 <= c21 && n13 <= d21; )
    if (l17 == null)
      l17 = e5[++r13];
    else if (u17 == null)
      u17 = e5[--c21];
    else if (p19 == null)
      p19 = s13[++n13];
    else if (k17 == null)
      k17 = s13[--d21];
    else if (Y(l17, p19))
      O3(l17, p19), l17 = e5[++r13], p19 = s13[++n13];
    else if (Y(u17, k17))
      O3(u17, k17), u17 = e5[--c21], k17 = s13[--d21];
    else if (Y(l17, k17))
      (l17.$tag$ === "slot" || k17.$tag$ === "slot") && P2(l17.$elm$.parentNode, false), O3(l17, k17), t11.insertBefore(l17.$elm$, u17.$elm$.nextSibling), l17 = e5[++r13], k17 = s13[--d21];
    else if (Y(u17, p19))
      (l17.$tag$ === "slot" || k17.$tag$ === "slot") && P2(u17.$elm$.parentNode, false), O3(u17, p19), t11.insertBefore(u17.$elm$, l17.$elm$), u17 = e5[--c21], p19 = s13[++n13];
    else {
      for (i21 = -1, o18 = r13; o18 <= c21; ++o18)
        if (e5[o18] && e5[o18].$key$ !== null && e5[o18].$key$ === p19.$key$) {
          i21 = o18;
          break;
        }
      i21 >= 0 ? (S12 = e5[i21], S12.$tag$ !== p19.$tag$ ? _17 = z4(e5 && e5[n13], a12, i21, t11) : (O3(S12, p19), e5[i21] = void 0, _17 = S12.$elm$), p19 = s13[++n13]) : (_17 = z4(e5 && e5[n13], a12, n13, t11), p19 = s13[++n13]), _17 && Le(l17.$elm$).insertBefore(_17, ie(l17.$elm$));
    }
  r13 > c21 ? Ce(t11, s13[d21 + 1] == null ? null : s13[d21 + 1].$elm$, a12, s13, n13, d21) : n13 > d21 && Te(e5, r13, c21);
};
var Y = (t11, e5) => t11.$tag$ === e5.$tag$ ? t11.$tag$ === "slot" ? t11.$name$ === e5.$name$ : t11.$key$ === e5.$key$ : false;
var ie = (t11) => t11 && t11["s-ol"] || t11;
var Le = (t11) => (t11["s-ol"] ? t11["s-ol"] : t11).parentNode;
var O3 = (t11, e5) => {
  const a12 = e5.$elm$ = t11.$elm$, s13 = t11.$children$, r13 = e5.$children$, n13 = e5.$tag$, i21 = e5.$text$;
  let o18;
  i21 === null ? ($6 = n13 === "svg" ? true : n13 === "foreignObject" ? false : $6, n13 === "slot" || Me(t11, e5, $6), s13 !== null && r13 !== null ? gt(a12, s13, e5, r13) : r13 !== null ? (t11.$text$ !== null && (a12.textContent = ""), Ce(a12, null, e5, r13, 0, r13.length - 1)) : s13 !== null && Te(s13, 0, s13.length - 1), $6 && n13 === "svg" && ($6 = false)) : (o18 = a12["s-cr"]) ? o18.parentNode.textContent = i21 : t11.$text$ !== i21 && (a12.data = i21);
};
var Ee = (t11) => {
  const e5 = t11.childNodes;
  let a12, s13, r13, n13, i21, o18;
  for (s13 = 0, r13 = e5.length; s13 < r13; s13++)
    if (a12 = e5[s13], a12.nodeType === 1) {
      if (a12["s-sr"]) {
        for (i21 = a12["s-sn"], a12.hidden = false, n13 = 0; n13 < r13; n13++)
          if (o18 = e5[n13].nodeType, e5[n13]["s-hn"] !== a12["s-hn"] || i21 !== "") {
            if (o18 === 1 && i21 === e5[n13].getAttribute("slot")) {
              a12.hidden = true;
              break;
            }
          } else if (o18 === 1 || o18 === 3 && e5[n13].textContent.trim() !== "") {
            a12.hidden = true;
            break;
          }
      }
      Ee(a12);
    }
};
var m10 = [];
var Re = (t11) => {
  let e5, a12, s13, r13, n13, i21, o18 = 0;
  const c21 = t11.childNodes, l17 = c21.length;
  for (; o18 < l17; o18++) {
    if (e5 = c21[o18], e5["s-sr"] && (a12 = e5["s-cr"]) && a12.parentNode)
      for (s13 = a12.parentNode.childNodes, r13 = e5["s-sn"], i21 = s13.length - 1; i21 >= 0; i21--)
        a12 = s13[i21], !a12["s-cn"] && !a12["s-nr"] && a12["s-hn"] !== e5["s-hn"] && (fe2(a12, r13) ? (n13 = m10.find((u17) => u17.$nodeToRelocate$ === a12), H2 = true, a12["s-sn"] = a12["s-sn"] || r13, n13 ? n13.$slotRefNode$ = e5 : m10.push({
          $slotRefNode$: e5,
          $nodeToRelocate$: a12
        }), a12["s-sr"] && m10.map((u17) => {
          fe2(u17.$nodeToRelocate$, a12["s-sn"]) && (n13 = m10.find((d21) => d21.$nodeToRelocate$ === a12), n13 && !u17.$slotRefNode$ && (u17.$slotRefNode$ = n13.$slotRefNode$));
        })) : m10.some((u17) => u17.$nodeToRelocate$ === a12) || m10.push({
          $nodeToRelocate$: a12
        }));
    e5.nodeType === 1 && Re(e5);
  }
};
var fe2 = (t11, e5) => t11.nodeType === 1 ? t11.getAttribute("slot") === null && e5 === "" || t11.getAttribute("slot") === e5 : t11["s-sn"] === e5 ? true : e5 === "";
var Be2 = (t11) => {
  t11.$attrs$ && t11.$attrs$.ref && t11.$attrs$.ref(null), t11.$children$ && t11.$children$.map(Be2);
};
var kt = (t11, e5) => {
  const a12 = t11.$hostElement$, s13 = t11.$cmpMeta$, r13 = t11.$vnode$ || j2(null, null), n13 = it(e5) ? e5 : h8(null, null, e5);
  X2 = a12.tagName, s13.$attrsToReflect$ && (n13.$attrs$ = n13.$attrs$ || {}, s13.$attrsToReflect$.map(([i21, o18]) => n13.$attrs$[o18] = a12[i21])), n13.$tag$ = null, n13.$flags$ |= 4, t11.$vnode$ = n13, n13.$elm$ = r13.$elm$ = a12.shadowRoot || a12, B2 = a12["s-sc"], we = a12["s-cr"], De = (s13.$flags$ & 1) !== 0, H2 = false, O3(r13, n13);
  {
    if (b11.$flags$ |= 1, se2) {
      Re(n13.$elm$);
      let i21, o18, c21, l17, u17, d21, p19 = 0;
      for (; p19 < m10.length; p19++)
        i21 = m10[p19], o18 = i21.$nodeToRelocate$, o18["s-ol"] || (c21 = w10.createTextNode(""), c21["s-nr"] = o18, o18.parentNode.insertBefore(o18["s-ol"] = c21, o18));
      for (p19 = 0; p19 < m10.length; p19++)
        if (i21 = m10[p19], o18 = i21.$nodeToRelocate$, i21.$slotRefNode$) {
          for (l17 = i21.$slotRefNode$.parentNode, u17 = i21.$slotRefNode$.nextSibling, c21 = o18["s-ol"]; c21 = c21.previousSibling; )
            if (d21 = c21["s-nr"], d21 && d21["s-sn"] === o18["s-sn"] && l17 === d21.parentNode && (d21 = d21.nextSibling, !d21 || !d21["s-nr"])) {
              u17 = d21;
              break;
            }
          (!u17 && l17 !== o18.parentNode || o18.nextSibling !== u17) && o18 !== u17 && (!o18["s-hn"] && o18["s-ol"] && (o18["s-hn"] = o18["s-ol"].parentNode.nodeName), l17.insertBefore(o18, u17));
        } else
          o18.nodeType === 1 && (o18.hidden = true);
    }
    H2 && Ee(n13.$elm$), b11.$flags$ &= -2, m10.length = 0;
  }
};
var vt = (t11, e5) => {
};
var Oe = (t11, e5) => (t11.$flags$ |= 16, vt(t11, t11.$ancestorComponent$), Wt(() => bt2(t11, e5)));
var bt2 = (t11, e5) => {
  const a12 = t11.$hostElement$, s13 = T("scheduleUpdate", t11.$cmpMeta$.$tagName$), r13 = a12;
  let n13;
  return e5 ? n13 = I4(r13, "componentWillLoad") : n13 = I4(r13, "componentWillUpdate"), n13 = ye(n13, () => I4(r13, "componentWillRender")), s13(), ye(n13, () => $t(t11, r13, e5));
};
var $t = async (t11, e5, a12) => {
  const s13 = t11.$hostElement$, r13 = T("update", t11.$cmpMeta$.$tagName$);
  s13["s-rc"], a12 && ft2(t11);
  const n13 = T("render", t11.$cmpMeta$.$tagName$);
  _t(t11, e5, s13), n13(), r13(), mt2(t11);
};
var _t = (t11, e5, a12) => {
  try {
    ne = e5, e5 = e5.render && e5.render(), t11.$flags$ &= -17, t11.$flags$ |= 2, (R.hasRenderFn || R.reflect) && (R.vdomRender || R.reflect) && (R.hydrateServerSide || kt(t11, e5));
  } catch (o18) {
    q3(o18, t11.$hostElement$);
  }
  return ne = null, null;
};
var mt2 = (t11) => {
  const e5 = t11.$cmpMeta$.$tagName$, a12 = t11.$hostElement$, s13 = T("postUpdate", e5), r13 = a12;
  t11.$ancestorComponent$, I4(r13, "componentDidRender"), t11.$flags$ & 64 ? (I4(r13, "componentDidUpdate"), s13()) : (t11.$flags$ |= 64, I4(r13, "componentDidLoad"), s13());
};
var I4 = (t11, e5, a12) => {
  if (t11 && t11[e5])
    try {
      return t11[e5](a12);
    } catch (s13) {
      q3(s13);
    }
};
var ye = (t11, e5) => t11 && t11.then ? t11.then(e5) : e5();
var wt = (t11, e5) => J(t11).$instanceValues$.get(e5);
var Dt = (t11, e5, a12, s13) => {
  const r13 = J(t11), n13 = t11, i21 = r13.$instanceValues$.get(e5), o18 = r13.$flags$, c21 = n13;
  a12 = lt(a12, s13.$members$[e5][0]);
  const l17 = Number.isNaN(i21) && Number.isNaN(a12);
  if (a12 !== i21 && !l17) {
    r13.$instanceValues$.set(e5, a12);
    {
      if (s13.$watchers$ && o18 & 128) {
        const d21 = s13.$watchers$[e5];
        d21 && d21.map((p19) => {
          try {
            c21[p19](a12, i21, e5);
          } catch (k17) {
            q3(k17, n13);
          }
        });
      }
      if ((o18 & 18) === 2) {
        if (c21.componentShouldUpdate && c21.componentShouldUpdate(a12, i21, e5) === false)
          return;
        Oe(r13, false);
      }
    }
  }
};
var xt2 = (t11, e5, a12) => {
  if (e5.$members$) {
    t11.watchers && (e5.$watchers$ = t11.watchers);
    const s13 = Object.entries(e5.$members$), r13 = t11.prototype;
    s13.map(([n13, [i21]]) => {
      (i21 & 31 || i21 & 32) && Object.defineProperty(r13, n13, {
        get() {
          return wt(this, n13);
        },
        set(o18) {
          Dt(this, n13, o18, e5);
        },
        configurable: true,
        enumerable: true
      });
    });
    {
      const n13 = /* @__PURE__ */ new Map();
      r13.attributeChangedCallback = function(i21, o18, c21) {
        b11.jmp(() => {
          const l17 = n13.get(i21);
          if (this.hasOwnProperty(l17))
            c21 = this[l17], delete this[l17];
          else if (r13.hasOwnProperty(l17) && typeof this[l17] == "number" && this[l17] == c21)
            return;
          this[l17] = c21 === null && typeof this[l17] == "boolean" ? false : c21;
        });
      }, t11.observedAttributes = s13.filter(
        ([i21, o18]) => o18[0] & 15
        /* MEMBER_FLAGS.HasAttribute */
      ).map(([i21, o18]) => {
        const c21 = o18[1] || i21;
        return n13.set(c21, i21), o18[0] & 512 && e5.$attrsToReflect$.push([i21, c21]), c21;
      });
    }
  }
  return t11;
};
var St2 = async (t11, e5, a12, s13, r13) => {
  if ((e5.$flags$ & 32) === 0 && (r13 = t11.constructor, e5.$flags$ |= 32, customElements.whenDefined(a12.$tagName$).then(() => e5.$flags$ |= 128), r13.style)) {
    let i21 = r13.style;
    typeof i21 != "string" && (i21 = i21[e5.$modeName$ = ct(t11)]);
    const o18 = Se(a12, e5.$modeName$);
    if (!K.has(o18)) {
      const c21 = T("registerStyles", a12.$tagName$);
      ht(o18, i21, !!(a12.$flags$ & 1)), c21();
    }
  }
  e5.$ancestorComponent$, Oe(e5, true);
};
var Mt = (t11) => {
};
var Ct = (t11) => {
  if ((b11.$flags$ & 1) === 0) {
    const e5 = J(t11), a12 = e5.$cmpMeta$, s13 = T("connectedCallback", a12.$tagName$);
    e5.$flags$ & 1 ? (Ie(t11, e5, a12.$listeners$), Mt(e5.$lazyInstance$)) : (e5.$flags$ |= 1, a12.$flags$ & 12 && Tt(t11), a12.$members$ && Object.entries(a12.$members$).map(([r13, [n13]]) => {
      if (n13 & 31 && t11.hasOwnProperty(r13)) {
        const i21 = t11[r13];
        delete t11[r13], t11[r13] = i21;
      }
    }), St2(t11, e5, a12)), s13();
  }
};
var Tt = (t11) => {
  const e5 = t11["s-cr"] = w10.createComment("");
  e5["s-cn"] = true, t11.insertBefore(e5, t11.firstChild);
};
var Lt = (t11) => {
  if ((b11.$flags$ & 1) === 0) {
    const e5 = J(t11);
    e5.$rmListeners$ && (e5.$rmListeners$.map((a12) => a12()), e5.$rmListeners$ = void 0);
  }
};
var Et2 = (t11, e5) => {
  const a12 = {
    $flags$: e5[0],
    $tagName$: e5[1]
  };
  a12.$members$ = e5[2], a12.$listeners$ = e5[3], a12.$watchers$ = t11.$watchers$, a12.$attrsToReflect$ = [];
  const s13 = t11.prototype.connectedCallback, r13 = t11.prototype.disconnectedCallback;
  return Object.assign(t11.prototype, {
    __registerHost() {
      It(this, a12);
    },
    connectedCallback() {
      Ct(this), s13 && s13.call(this);
    },
    disconnectedCallback() {
      Lt(this), r13 && r13.call(this);
    },
    __attachShadow() {
      this.attachShadow({
        mode: "open",
        delegatesFocus: !!(a12.$flags$ & 16)
      });
    }
  }), t11.is = a12.$tagName$, xt2(t11, a12);
};
var Ie = (t11, e5, a12, s13) => {
  a12 && a12.map(([r13, n13, i21]) => {
    const o18 = Bt(t11, r13), c21 = Rt(e5, i21), l17 = Ot2(r13);
    b11.ael(o18, n13, c21, l17), (e5.$rmListeners$ = e5.$rmListeners$ || []).push(() => b11.rel(o18, n13, c21, l17));
  });
};
var Rt = (t11, e5) => (a12) => {
  try {
    R.lazyLoad || t11.$hostElement$[e5](a12);
  } catch (s13) {
    q3(s13);
  }
};
var Bt = (t11, e5) => e5 & 4 ? w10 : e5 & 8 ? V4 : e5 & 16 ? w10.body : t11;
var Ot2 = (t11) => Ft ? {
  passive: (t11 & 1) !== 0,
  capture: (t11 & 2) !== 0
} : (t11 & 2) !== 0;
var Ae = /* @__PURE__ */ new WeakMap();
var J = (t11) => Ae.get(t11);
var It = (t11, e5) => {
  const a12 = {
    $flags$: 0,
    $hostElement$: t11,
    $cmpMeta$: e5,
    $instanceValues$: /* @__PURE__ */ new Map()
  };
  return Ie(t11, a12, e5.$listeners$), Ae.set(t11, a12);
};
var ge = (t11, e5) => e5 in t11;
var q3 = (t11, e5) => (0, console.error)(t11, e5);
var K = /* @__PURE__ */ new Map();
var At2 = [];
var V4 = typeof window < "u" ? window : {};
var w10 = V4.document || { head: {} };
var Nt = V4.HTMLElement || class {
};
var b11 = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: (t11) => t11(),
  raf: (t11) => requestAnimationFrame(t11),
  ael: (t11, e5, a12, s13) => t11.addEventListener(e5, a12, s13),
  rel: (t11, e5, a12, s13) => t11.removeEventListener(e5, a12, s13),
  ce: (t11, e5) => new CustomEvent(t11, e5)
};
var Ft = (() => {
  let t11 = false;
  try {
    w10.addEventListener("e", null, Object.defineProperty({}, "passive", {
      get() {
        t11 = true;
      }
    }));
  } catch {
  }
  return t11;
})();
var Pt = (t11) => Promise.resolve(t11);
var qt = (() => {
  try {
    return new CSSStyleSheet(), typeof new CSSStyleSheet().replaceSync == "function";
  } catch {
  }
  return false;
})();
var ke = [];
var Ne = [];
var Yt = (t11, e5) => (a12) => {
  t11.push(a12), te || (te = true, e5 && b11.$flags$ & 4 ? Ut(ae2) : b11.raf(ae2));
};
var ve = (t11) => {
  for (let e5 = 0; e5 < t11.length; e5++)
    try {
      t11[e5](performance.now());
    } catch (a12) {
      q3(a12);
    }
  t11.length = 0;
};
var ae2 = () => {
  ve(ke), ve(Ne), (te = ke.length > 0) && b11.raf(ae2);
};
var Ut = (t11) => Pt().then(t11);
var Wt = Yt(Ne, true);
function U(t11, e5) {
  const a12 = new Date(t11);
  return a12.setDate(a12.getDate() + e5), a12;
}
function Ht(t11, e5, a12) {
  const s13 = [], r13 = G2(t11), n13 = r13.getDay() === 0 ? 7 : r13.getDay(), i21 = N(t11), o18 = i21.getDay() === 0 ? 7 : i21.getDay(), c21 = a12 === 1 ? 7 : a12 - 1, l17 = [], u17 = [];
  {
    let k17 = (7 - a12 + n13) % 7, _17 = Q2(r13);
    for (; k17 > 0; )
      l17.push(_17), _17 = Q2(_17), k17 -= 1;
    l17.reverse();
    let L8 = (7 - o18 + c21) % 7, E14 = F(i21);
    for (; L8 > 0; )
      u17.push(E14), E14 = F(E14), L8 -= 1;
  }
  let d21 = r13;
  for (; d21.getMonth() === t11.getMonth(); )
    s13.push(d21), d21 = F(d21);
  return [...l17, ...s13, ...u17];
}
function G2(t11) {
  return v9(/* @__PURE__ */ new Date(`${String(Pe(t11)).padStart(4, "0")}-${String(Fe(t11)).padStart(2, "0")}-01`));
}
function M2(t11) {
  if (t11 instanceof Date)
    return `${t11.getFullYear()}-${String(t11.getMonth() + 1).padStart(2, "0")}-${String(t11.getDate()).padStart(2, "0")}`;
}
function N(t11) {
  const e5 = G2(t11);
  return e5.setMonth(e5.getMonth() + 1), e5.setDate(e5.getDate() - 1), e5;
}
function Fe(t11) {
  return t11.getMonth() + 1;
}
function jt(t11) {
  return new Array(12).fill(void 0).map((e5, a12) => {
    const s13 = v9(/* @__PURE__ */ new Date(`2006-${String(a12 + 1).padStart(2, "0")}-01`));
    return Intl.DateTimeFormat(t11, {
      month: "long"
    }).format(s13);
  });
}
function F(t11) {
  return U(t11, 1);
}
function Z(t11) {
  const e5 = new Date(t11);
  return e5.setDate(1), e5.setMonth(e5.getMonth() + 1), e5;
}
function be(t11) {
  const e5 = new Date(t11);
  return e5.setFullYear(e5.getFullYear() + 1), e5;
}
function Q2(t11) {
  return W(t11, 1);
}
function ee(t11) {
  const e5 = new Date(t11);
  return e5.setDate(1), e5.setMonth(e5.getMonth() - 1), e5;
}
function $e2(t11) {
  const e5 = new Date(t11);
  return e5.setFullYear(e5.getFullYear() - 1), e5;
}
function zt(t11, e5) {
  return new Array(7).fill(void 0).map((a12, s13) => (t11 + s13) % 7 + 1).map((a12) => {
    const s13 = v9(/* @__PURE__ */ new Date(`2006-01-0${a12}`));
    return [
      Intl.DateTimeFormat(e5, {
        weekday: "short"
      }).format(s13).slice(0, 3),
      Intl.DateTimeFormat(e5, {
        weekday: "long"
      }).format(s13)
    ];
  });
}
function Pe(t11) {
  return t11.getFullYear();
}
function _e(t11, e5) {
  if (!t11 || !e5 || !e5.from || !e5.to)
    return false;
  const a12 = e5.from < e5.to ? e5.from : e5.to, s13 = e5.from < e5.to ? e5.to : e5.from;
  return t11 >= a12 && t11 <= s13;
}
function x9(t11, e5) {
  return !t11 || !e5 ? false : t11.getFullYear() === e5.getFullYear() && t11.getMonth() === e5.getMonth() && t11.getDate() === e5.getDate();
}
function v9(t11) {
  const e5 = new Date(t11);
  return e5.setMinutes(e5.getMinutes() + e5.getTimezoneOffset()), e5;
}
function W(t11, e5) {
  const a12 = new Date(t11);
  return a12.setDate(a12.getDate() - e5), a12;
}
var Kt = ".visually-hidden.sc-wc-datepicker{position:absolute;overflow:hidden;width:1px;height:1px;white-space:nowrap;clip:rect(0 0 0 0);clip-path:inset(50%)}";
var Gt = {
  clearButton: "Clear value",
  monthSelect: "Select month",
  nextMonthButton: "Next month",
  nextYearButton: "Next year",
  picker: "Choose date",
  previousMonthButton: "Previous month",
  previousYearButton: "Previous year",
  todayButton: "Show today",
  yearSelect: "Select year"
};
var Qt = Et2(class extends Nt {
  constructor() {
    super(), this.__registerHost(), this.selectDate = de(this, "selectDate"), this.changeMonth = de(this, "changeMonth"), this.disabled = false, this.disableDate = () => false, this.elementClassName = "wc-datepicker", this.firstDayOfWeek = 0, this.goToRangeStartOnSelect = true, this.labels = Gt, this.locale = navigator?.language || "en-US", this.maxSearchDays = 365, this.showClearButton = false, this.showMonthStepper = true, this.showTodayButton = false, this.showYearStepper = false, this.startDate = M2(/* @__PURE__ */ new Date()), this.pendingClick = false, this.init = () => {
      this.currentDate = this.startDate ? v9(new Date(this.startDate)) : /* @__PURE__ */ new Date(), this.updateWeekdays(), this.handleMinDate(), this.handleMaxDate();
    }, this.getAvailableDate = (t11, e5) => {
      let a12, s13 = false;
      switch (e5) {
        case "previousDay":
          a12 = Q2(t11);
          break;
        case "nextDay":
          a12 = F(t11);
          break;
        case "previousSameWeekDay":
          a12 = W(t11, 7);
          break;
        case "nextSameWeekDay":
          a12 = U(t11, 7);
          break;
        case "firstOfMonth":
          a12 = G2(t11);
          break;
        case "lastOfMonth":
          a12 = N(t11);
          break;
        case "previousMonth":
          a12 = ee(t11);
          break;
        case "nextMonth":
          a12 = Z(t11);
          break;
        case "previousYear":
          a12 = $e2(t11);
          break;
        case "nextYear":
          a12 = be(t11);
          break;
      }
      for (; this.disableDate(a12) && !s13; ) {
        switch (e5) {
          case "previousDay":
          case "lastOfMonth":
            a12 = Q2(a12);
            break;
          case "nextDay":
          case "firstOfMonth":
          case "previousMonth":
          case "nextMonth":
          case "previousYear":
          case "nextYear":
            a12 = F(a12);
            break;
          case "previousSameWeekDay":
            a12 = W(a12, 7);
            break;
          case "nextSameWeekDay":
            a12 = U(a12, 7);
            break;
        }
        switch (e5) {
          case "firstOfMonth":
          case "lastOfMonth":
          case "previousYear":
          case "nextYear":
            s13 = a12.getMonth() !== t11.getMonth();
            break;
          case "previousMonth":
            s13 = a12.getMonth() !== t11.getMonth() - 1;
            break;
          case "nextMonth":
            s13 = a12.getMonth() !== t11.getMonth() + 1;
            break;
          default:
            s13 = !_e(a12, {
              from: W(t11, this.maxSearchDays),
              to: U(t11, this.maxSearchDays)
            });
            break;
        }
      }
      return s13 ? t11 : a12;
    }, this.nextMonth = () => {
      this.updateCurrentDate(Z(this.currentDate));
    }, this.nextYear = () => {
      this.updateCurrentDate(be(this.currentDate));
    }, this.previousMonth = () => {
      this.updateCurrentDate(ee(this.currentDate));
    }, this.previousYear = () => {
      this.updateCurrentDate($e2(this.currentDate));
    }, this.showToday = () => {
      this.updateCurrentDate(/* @__PURE__ */ new Date());
    }, this.clear = () => {
      this.value = void 0, this.selectDate.emit(void 0);
    }, this.onClick = (t11) => {
      if (this.disabled)
        return;
      this.pendingClick = false;
      const e5 = t11.target.closest("[data-date]");
      if (!e5)
        return;
      const a12 = v9(new Date(e5.dataset.date));
      this.isDateDisabled(a12) || (this.updateCurrentDate(a12), this.onSelectDate(a12));
    }, this.onMonthSelect = (t11) => {
      const e5 = +t11.target.value - 1, a12 = this.currentDate.getDate(), s13 = new Date(this.currentDate.getFullYear(), e5, 1), r13 = N(s13).getDate(), n13 = Math.min(a12, r13), i21 = new Date(this.currentDate.getFullYear(), e5, n13);
      this.updateCurrentDate(i21);
    }, this.onYearSelect = (t11) => {
      let e5 = +t11.target.value;
      const a12 = t11.target;
      isNaN(e5) ? (e5 = (/* @__PURE__ */ new Date()).getFullYear(), a12.value = String(e5)) : e5 < 0 ? (e5 = 0, a12.value = String(e5)) : e5 > 9999 && (e5 = 9999, a12.value = String(e5));
      const s13 = this.currentDate.getDate(), r13 = this.currentDate.getMonth(), n13 = /* @__PURE__ */ new Date();
      n13.setFullYear(e5, r13, 1);
      const i21 = N(n13).getDate(), o18 = Math.min(s13, i21), c21 = /* @__PURE__ */ new Date();
      c21.setFullYear(e5, r13, o18), this.updateCurrentDate(c21);
    }, this.onKeyDown = (t11) => {
      this.disabled || (t11.code === "ArrowLeft" ? (t11.preventDefault(), this.updateCurrentDate(this.getAvailableDate(this.currentDate, "previousDay"), true)) : t11.code === "ArrowRight" ? (t11.preventDefault(), this.updateCurrentDate(this.getAvailableDate(this.currentDate, "nextDay"), true)) : t11.code === "ArrowUp" ? (t11.preventDefault(), this.updateCurrentDate(this.getAvailableDate(this.currentDate, "previousSameWeekDay"), true)) : t11.code === "ArrowDown" ? (t11.preventDefault(), this.updateCurrentDate(this.getAvailableDate(this.currentDate, "nextSameWeekDay"), true)) : t11.code === "PageUp" ? (t11.preventDefault(), t11.shiftKey ? this.updateCurrentDate(this.getAvailableDate(this.currentDate, "previousYear"), true) : this.updateCurrentDate(this.getAvailableDate(this.currentDate, "previousMonth"), true)) : t11.code === "PageDown" ? (t11.preventDefault(), t11.shiftKey ? this.updateCurrentDate(this.getAvailableDate(this.currentDate, "nextYear"), true) : this.updateCurrentDate(this.getAvailableDate(this.currentDate, "nextMonth"), true)) : t11.code === "Home" ? (t11.preventDefault(), this.updateCurrentDate(this.getAvailableDate(this.currentDate, "firstOfMonth"), true)) : t11.code === "End" ? (t11.preventDefault(), this.updateCurrentDate(this.getAvailableDate(this.currentDate, "lastOfMonth"), true)) : (t11.code === "Space" || t11.code === "Enter") && (t11.preventDefault(), this.isDateDisabled(this.currentDate) || this.onSelectDate(this.currentDate)));
    }, this.onMouseEnter = (t11) => {
      if (this.disabled)
        return;
      const e5 = v9(new Date(t11.target.closest("td").dataset.date));
      this.hoveredDate = e5;
    }, this.onMouseLeave = () => {
      this.hoveredDate = void 0;
    }, this.onMouseDown = () => {
      this.pendingClick = true;
    }, this.onFocus = (t11) => {
      if (this.pendingClick)
        return;
      const e5 = v9(new Date(t11.target.dataset.date));
      x9(e5, this.currentDate) || this.updateCurrentDate(e5);
    };
  }
  componentWillLoad() {
    this.init();
  }
  watchFirstDayOfWeek() {
    this.updateWeekdays();
  }
  watchLocale() {
    this.locale || (this.locale = navigator?.language || "en-US"), this.updateWeekdays();
  }
  watchRange() {
    this.value = void 0, this.selectDate.emit(void 0);
  }
  watchStartDate() {
    this.currentDate = this.startDate ? v9(new Date(this.startDate)) : /* @__PURE__ */ new Date();
  }
  watchValue() {
    this.value && (Array.isArray(this.value) ? this.currentDate = this.value.length > 1 && !this.goToRangeStartOnSelect ? this.value[1] : this.value[0] : this.value instanceof Date && (this.currentDate = this.value));
  }
  handleMinDate() {
    this.minDate && this.currentDate < v9(new Date(this.minDate)) && (this.currentDate = v9(new Date(this.minDate)));
  }
  handleMaxDate() {
    this.maxDate && this.currentDate > v9(new Date(this.maxDate)) && (this.currentDate = v9(new Date(this.maxDate)));
  }
  componentDidRender() {
    this.moveFocusAfterMonthChanged && (this.focusDate(this.currentDate), this.moveFocusAfterMonthChanged = false);
  }
  updateWeekdays() {
    this.weekdays = zt(this.firstDayOfWeek === 0 ? 7 : this.firstDayOfWeek, this.locale);
  }
  getClassName(t11) {
    return t11 ? `${this.elementClassName}__${t11}` : this.elementClassName;
  }
  getCalendarRows() {
    const t11 = Ht(this.currentDate, true, this.firstDayOfWeek === 0 ? 7 : this.firstDayOfWeek), e5 = [];
    for (let a12 = 0; a12 < t11.length; a12 += 7) {
      const s13 = t11.slice(a12, a12 + 7);
      e5.push(s13);
    }
    return e5;
  }
  getTitle() {
    if (this.value)
      if (this.isRangeValue(this.value)) {
        const t11 = Intl.DateTimeFormat(this.locale, {
          day: "numeric",
          month: "long",
          year: "numeric"
        }).format(this.value[0]), e5 = this.value[1] ? Intl.DateTimeFormat(this.locale, {
          day: "numeric",
          month: "long",
          year: "numeric"
        }).format(this.value[1]) : void 0;
        return e5 ? `${t11} - ${e5}` : t11;
      } else
        return Intl.DateTimeFormat(this.locale, {
          day: "numeric",
          month: "long",
          year: "numeric"
        }).format(this.value);
  }
  focusDate(t11) {
    var e5;
    (e5 = this.el.querySelector(`[data-date="${M2(t11)}"]`)) === null || e5 === void 0 || e5.focus();
  }
  updateCurrentDate(t11, e5) {
    const a12 = t11.getMonth(), s13 = t11.getFullYear();
    if (s13 > 9999 || s13 < 0)
      return;
    (a12 !== this.currentDate.getMonth() || s13 !== this.currentDate.getFullYear()) && (this.changeMonth.emit({
      month: Fe(t11),
      year: Pe(t11),
      day: t11.getDate()
    }), e5 && (this.moveFocusAfterMonthChanged = true)), this.currentDate = t11, e5 && this.focusDate(this.currentDate);
  }
  onSelectDate(t11) {
    var e5, a12;
    if (!this.isDateDisabled(t11))
      if (this.isRangeValue(this.value)) {
        const s13 = ((e5 = this.value) === null || e5 === void 0 ? void 0 : e5[0]) === void 0 || this.value.length === 2 ? [t11] : [this.value[0], t11];
        s13.length === 2 && s13[0] > s13[1] && s13.reverse();
        const r13 = s13[1] === void 0 ? [M2(s13[0])] : [M2(s13[0]), M2(s13[1])];
        this.value = s13, this.selectDate.emit(r13);
      } else {
        if (((a12 = this.value) === null || a12 === void 0 ? void 0 : a12.getTime()) === t11.getTime())
          return;
        this.value = t11, this.selectDate.emit(M2(t11));
      }
  }
  // @ts-ignore
  isRangeValue(t11) {
    return this.range;
  }
  get isPreviousMonthDisabled() {
    if (!this.minDate)
      return false;
    const t11 = ee(this.currentDate), e5 = v9(new Date(this.minDate));
    return N(t11) < e5;
  }
  get isNextMonthDisabled() {
    if (!this.maxDate)
      return false;
    const t11 = Z(this.currentDate), e5 = v9(new Date(this.maxDate));
    return G2(t11) > e5;
  }
  isDateDisabled(t11) {
    if (this.disableDate(t11))
      return true;
    const e5 = this.minDate && t11 < v9(new Date(this.minDate)), a12 = this.maxDate && t11 > v9(new Date(this.maxDate));
    return !!(e5 || a12);
  }
  render() {
    const t11 = this.showTodayButton || this.showClearButton;
    return h8(xe, null, h8("div", { "aria-disabled": String(this.disabled), "aria-label": this.labels.picker, class: {
      [this.getClassName()]: true,
      [`${this.getClassName()}--disabled`]: this.disabled
    }, role: "group" }, h8("div", { class: this.getClassName("header") }, h8("span", { "aria-atomic": "true", "aria-live": "polite", class: "visually-hidden" }, this.getTitle()), this.showYearStepper && h8("button", { "aria-label": this.labels.previousYearButton, class: this.getClassName("previous-year-button"), disabled: this.disabled, innerHTML: this.previousYearButtonContent || void 0, onClick: this.previousYear, type: "button" }, h8("svg", { fill: "none", height: "24", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "24" }, h8("polyline", { points: "11 17 6 12 11 7" }), h8("polyline", { points: "18 17 13 12 18 7" }))), this.showMonthStepper && h8("button", { "aria-label": this.labels.previousMonthButton, class: {
      [this.getClassName("previous-month-button")]: true,
      [this.getClassName("next-month-button--disabled")]: this.isPreviousMonthDisabled
    }, disabled: this.disabled || this.isPreviousMonthDisabled, innerHTML: this.previousMonthButtonContent || void 0, onClick: this.previousMonth, type: "button" }, h8("svg", { fill: "none", height: "24", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "24" }, h8("polyline", { points: "15 18 9 12 15 6" }))), h8("span", { class: this.getClassName("current-month") }, h8("select", { title: this.labels.monthSelect, "aria-label": this.labels.monthSelect, class: this.getClassName("month-select"), disabled: this.disabled, onChange: this.onMonthSelect }, jt(this.locale).map((e5, a12) => h8("option", { key: e5, selected: this.currentDate.getMonth() === a12, value: a12 + 1 }, e5))), h8("input", { title: this.labels.yearSelect, "aria-label": this.labels.yearSelect, class: this.getClassName("year-select"), disabled: this.disabled, max: 9999, maxLength: 4, min: 1, onChange: this.onYearSelect, type: "number", value: this.currentDate.getFullYear() })), this.showMonthStepper && h8("button", { "aria-label": this.labels.nextMonthButton, class: {
      [this.getClassName("next-month-button")]: true,
      [this.getClassName("next-month-button--disabled")]: this.isNextMonthDisabled
    }, disabled: this.disabled || this.isNextMonthDisabled, innerHTML: this.nextMonthButtonContent || void 0, onClick: this.nextMonth, type: "button" }, h8("svg", { fill: "none", height: "24", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "24" }, h8("polyline", { points: "9 18 15 12 9 6" }))), this.showYearStepper && h8("button", { "aria-label": this.labels.nextYearButton, class: this.getClassName("next-year-button"), disabled: this.disabled, innerHTML: this.nextYearButtonContent || void 0, onClick: this.nextYear, type: "button" }, h8("svg", { fill: "none", height: "24", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", stroke: "currentColor", viewBox: "0 0 24 24", width: "24" }, h8("polyline", { points: "13 17 18 12 13 7" }), h8("polyline", { points: "6 17 11 12 6 7" })))), h8("div", { class: this.getClassName("body") }, h8("table", { class: this.getClassName("calendar"), onKeyDown: this.onKeyDown, role: "grid" }, h8("thead", { class: this.getClassName("calendar-header") }, h8("tr", { class: this.getClassName("weekday-row") }, this.weekdays.map((e5) => h8("th", { "aria-label": e5[1], abbr: e5[1], class: this.getClassName("weekday"), key: e5[0], scope: "col" }, h8("span", null, e5[0]))))), h8("tbody", null, this.getCalendarRows().map((e5) => {
      const a12 = `row-${e5[0].getMonth()}-${e5[0].getDate()}`;
      return h8("tr", { class: this.getClassName("calendar-row"), key: a12 }, e5.map((s13) => {
        var r13, n13, i21, o18, c21;
        const l17 = x9(s13, this.currentDate), u17 = s13.getMonth() !== this.currentDate.getMonth(), d21 = Array.isArray(this.value) ? x9(s13, this.value[0]) || x9(s13, this.value[1]) : x9(s13, this.value), p19 = this.isRangeValue ? _e(s13, {
          from: (r13 = this.value) === null || r13 === void 0 ? void 0 : r13[0],
          to: ((n13 = this.value) === null || n13 === void 0 ? void 0 : n13[1]) || this.hoveredDate || this.currentDate
        }) : false, k17 = !((i21 = this.value) === null || i21 === void 0) && i21[0] ? [
          (o18 = this.value) === null || o18 === void 0 ? void 0 : o18[0],
          ((c21 = this.value) === null || c21 === void 0 ? void 0 : c21[1]) || this.hoveredDate
        ].sort((We2, He) => We2 - He) : [], _17 = this.range && x9(k17[0], s13), S12 = this.range && x9(k17[1], s13), L8 = x9(s13, /* @__PURE__ */ new Date()), E14 = this.isDateDisabled(s13), qe2 = `cell-${s13.getMonth()}-${s13.getDate()}`, Ye2 = {
          [this.getClassName("date")]: true,
          [this.getClassName("date--current")]: l17,
          [this.getClassName("date--disabled")]: E14,
          [this.getClassName("date--overflowing")]: u17,
          [this.getClassName("date--today")]: L8,
          [this.getClassName("date--selected")]: d21,
          [this.getClassName("date--in-range")]: p19,
          [this.getClassName("date--start")]: _17,
          [this.getClassName("date--end")]: S12
        }, Ue = d21 ? "strong" : L8 ? "em" : "span";
        return h8("td", { "aria-disabled": String(E14), "aria-selected": d21 ? "true" : void 0, "aria-current": L8 ? "date" : d21 ? "true" : void 0, class: Ye2, "data-date": M2(s13), key: qe2, onClick: this.onClick, onMouseDown: this.onMouseDown, onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave, onFocus: this.onFocus, role: "gridcell", tabIndex: x9(s13, this.currentDate) && !this.disabled ? 0 : -1 }, h8(Ue, { "aria-hidden": "true" }, s13.getDate()), h8("span", { class: "visually-hidden" }, Intl.DateTimeFormat(this.locale, {
          day: "numeric",
          month: "long",
          year: "numeric"
        }).format(s13)));
      }));
    })))), t11 && h8("div", { class: this.getClassName("footer") }, this.showTodayButton && h8("button", { class: this.getClassName("today-button"), disabled: this.disabled, innerHTML: this.todayButtonContent || void 0, onClick: this.showToday, type: "button" }, this.labels.todayButton), this.showClearButton && h8("button", { class: this.getClassName("clear-button"), disabled: this.disabled, innerHTML: this.clearButtonContent || void 0, onClick: this.clear, type: "button" }, this.labels.clearButton))));
  }
  get el() {
    return this;
  }
  static get watchers() {
    return {
      firstDayOfWeek: ["watchFirstDayOfWeek"],
      locale: ["watchLocale"],
      range: ["watchRange"],
      startDate: ["watchStartDate"],
      value: ["watchValue"],
      minDate: ["handleMinDate"],
      maxDate: ["handleMaxDate"]
    };
  }
  static get style() {
    return Kt;
  }
}, [2, "wc-datepicker", {
  clearButtonContent: [1, "clear-button-content"],
  disabled: [4],
  disableDate: [16],
  elementClassName: [1, "element-class-name"],
  firstDayOfWeek: [2, "first-day-of-week"],
  goToRangeStartOnSelect: [4, "go-to-range-start-on-select"],
  range: [4],
  labels: [16],
  locale: [1],
  maxDate: [1, "max-date"],
  maxSearchDays: [2, "max-search-days"],
  minDate: [1, "min-date"],
  nextMonthButtonContent: [1, "next-month-button-content"],
  nextYearButtonContent: [1, "next-year-button-content"],
  previousMonthButtonContent: [1, "previous-month-button-content"],
  previousYearButtonContent: [1, "previous-year-button-content"],
  showClearButton: [4, "show-clear-button"],
  showMonthStepper: [4, "show-month-stepper"],
  showTodayButton: [4, "show-today-button"],
  showYearStepper: [4, "show-year-stepper"],
  startDate: [1, "start-date"],
  todayButtonContent: [1, "today-button-content"],
  value: [1040],
  currentDate: [32],
  hoveredDate: [32],
  weekdays: [32]
}]);
var Xt = Qt;
var Jt = Object.defineProperty;
var y5 = (t11, e5, a12, s13) => {
  for (var r13 = void 0, n13 = t11.length - 1, i21; n13 >= 0; n13--)
    (i21 = t11[n13]) && (r13 = i21(e5, a12, r13) || r13);
  return r13 && Jt(e5, a12, r13), r13;
};
customElements.get("wc-datepicker") || customElements.define("wc-datepicker", Xt);
var C5;
var f8 = (C5 = class extends Ze2 {
  constructor() {
    super(...arguments), this.id = "", this.name = "", this.width = "full", this.hideTodayButton = false, this.hideClearButton = false, this.disabled = false, this.required = false, this.optional = false, this.showError = false, this.errorMessage = "", this.form = null, this.tooltip = "", this.type = "date", this.label = "", this.description = "", this.startDate = "", this.minDate = "", this.maxDate = "", this.inverted = false, this.value = void 0, this.datepickerIsOpen = false, this.DATEPICKER_GAP = 4, this._hasUserInteracted = false, this._onKeydownEsc = (e5) => {
      if (e5.key !== "Escape" || e5.code !== "Escape" || !this.datepickerIsOpen) return;
      e5.preventDefault(), e5.stopPropagation(), this.shadowRoot?.querySelector("wc-datepicker")?.classList.remove("active"), this.datepickerIsOpen = false, this.removeEventListener("keydown", this._handleFocusTrap), this.shadowRoot?.querySelector("input")?.focus();
    }, this._handleScrollReposition = () => {
      this.datepickerIsOpen && this._positionDatepicker();
    };
  }
  // need this flag for "eager mode"
  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   * Form association, ElementInternals, and id generation are provided by
   * NysFormControlElement (@nysds/internals).
   */
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("invalid", this._handleInvalid), this.addEventListener("focusout", this._handleBlur), this.addEventListener("keydown", this._onKeydownEsc);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._stopDatepickerPositioning(), this.removeEventListener("invalid", this._handleInvalid), this.removeEventListener("focusout", this._handleBlur), this.removeEventListener("keydown", this._onKeydownEsc);
  }
  async firstUpdated() {
    this._setValue(this.value), !(this._shouldUseNativeDatepicker() || !await this._whenWcDatepickerReady()) && (setTimeout(() => this._replaceButtonSVG(), 0), setTimeout(() => this._addMonthDropdownIcon(), 0), setTimeout(() => this._handleDateChange(), 0), setTimeout(() => this._onDocumentClick(), 0));
  }
  updated(e5) {
    if (super.updated(e5), e5.has("value")) {
      const a12 = e5.get("value"), s13 = this.value;
      !s13 && a12 !== s13 ? (this.setFormValue(""), this._manageRequire()) : s13 && this._setValue(s13);
    }
  }
  async _whenWcDatepickerReady() {
    await customElements.whenDefined("wc-datepicker");
    const e5 = this.shadowRoot?.querySelector(
      "wc-datepicker"
    );
    return e5 ? ("updateComplete" in e5 && await e5.updateComplete, await new Promise((a12) => requestAnimationFrame(a12)), e5) : null;
  }
  /**
   * Form Integration
   * --------------------------------------------------------------------------
   */
  /**
   * Form helper methods:
   * - _setValue: set internal value and trigger validation
   * - _manageRequire: handle required state
   * - _validate: actively validate and show errors
   * - checkValidity: passive boolean check without UI
   * - _setValidityMessage: sync validation message with UI and internals
   * - _handleInvalid: handle form invalid event and focus first invalid field
   */
  _setValue(e5) {
    if (!e5) {
      this.value = void 0, this.setFormValue(""), this._manageRequire();
      return;
    }
    const a12 = e5 instanceof Date ? e5 : this._parseLocalDate(e5), s13 = [
      a12.getFullYear(),
      String(a12.getMonth() + 1).padStart(2, "0"),
      String(a12.getDate()).padStart(2, "0")
    ].join("-");
    this.value = a12, this.setFormValue(s13);
    const r13 = this.shadowRoot?.querySelector("input");
    r13 && (r13.value = s13);
    const n13 = this.shadowRoot?.querySelector("wc-datepicker");
    n13 && (n13.value = a12), this._manageRequire();
  }
  // Called to internally set the initial internalElement required flag.
  _manageRequire() {
    const e5 = this.shadowRoot?.querySelector("input");
    if (!e5) return;
    const a12 = this.errorMessage || "This field is required.";
    this.required && !this.value ? this.setValidityFromState({ valueMissing: true }, a12, e5) : this.clearValidity();
  }
  /**
   * Actively validates the component:
   * - Updates internal validity state
   * - Updates UI (e.g. showError)
   * - Called on blur/change or form submission
   */
  _validate() {
    const e5 = this.shadowRoot?.querySelector("input");
    if (!e5) return;
    this._manageRequire();
    let a12 = "";
    e5.validity.valueMissing ? a12 = this.errorMessage || "This field is required." : a12 = e5.validationMessage, this._setValidityMessage(a12);
  }
  /**
   * Passive check of validity:
   * - Returns true/false
   * - Does NOT update UI or show errors
   * - Used in form submission checks
   */
  checkValidity() {
    const e5 = this.shadowRoot?.querySelector("input");
    return e5 ? e5.checkValidity() : true;
  }
  // Sets custom validity message
  _setValidityMessage(e5 = "") {
    const a12 = this.shadowRoot?.querySelector("input");
    a12 && (!e5 && this.showError && this.errorMessage?.trim() || (this.showError = !!e5, this.errorMessage?.trim() && e5 !== "" && (e5 = this.errorMessage), e5 ? this.setValidityFromState({ customError: true }, e5, a12) : this.clearValidity()));
  }
  // Handles native 'invalid' events
  _handleInvalid(e5) {
    e5.preventDefault(), this._hasUserInteracted = true, this._validate();
    const a12 = this.shadowRoot?.querySelector("input");
    if (a12) {
      const s13 = this.internals?.form;
      s13 ? Array.from(s13.elements).find(
        (i21) => typeof i21.checkValidity == "function" && !i21.checkValidity()
      ) === this && a12.focus() : a12.focus();
    }
  }
  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  /**
   * Replaces the default wc-datepicker month navigation buttons
   * with NYS icon components for previous and next month.
   */
  _replaceButtonSVG() {
    const e5 = this.shadowRoot?.querySelector("wc-datepicker");
    if (!e5) return;
    const a12 = e5.querySelector(
      ".wc-datepicker__next-month-button"
    ), s13 = e5.querySelector(
      ".wc-datepicker__previous-month-button"
    );
    !a12 || !s13 || (s13.innerHTML = `
    <nys-icon name="arrow_back" size="18"></nys-icon>
  `, a12.innerHTML = `
    <nys-icon name="arrow_forward" size="18"></nys-icon>
  `);
  }
  _addMonthDropdownIcon() {
    const e5 = this.shadowRoot?.querySelector("wc-datepicker");
    if (!e5) return;
    const a12 = e5.querySelector(
      ".wc-datepicker__month-select"
    );
    if (a12 && !a12.parentElement?.classList.contains("month-wrapper")) {
      const s13 = document.createElement("span");
      s13.className = "month-wrapper", a12.parentNode?.insertBefore(s13, a12), s13.appendChild(a12);
      const r13 = document.createElement("nys-icon");
      r13.setAttribute("name", "chevron_down"), r13.setAttribute("id", "wc-month-dropdown-icon"), r13.setAttribute("size", "20"), s13.appendChild(r13);
    }
  }
  // Creates a Date at local midnight to avoid UTC timezone shifting
  _parseLocalDate(e5) {
    const [a12, s13, r13] = e5.split("-").map(Number);
    return new Date(a12, s13 - 1, r13);
  }
  _setTodayDate() {
    const e5 = /* @__PURE__ */ new Date();
    e5.setHours(0, 0, 0, 0), this._setValue(e5), this._setFocusOnTodayDate();
  }
  async _setFocusOnTodayDate(e5 = false) {
    if (this.minDate) {
      const i21 = /* @__PURE__ */ new Date();
      i21.setHours(0, 0, 0, 0);
      const o18 = this._parseLocalDate(this.minDate);
      if (i21 < o18) return;
    }
    const a12 = /* @__PURE__ */ new Date();
    a12.setHours(0, 0, 0, 0);
    const s13 = [
      a12.getFullYear(),
      String(a12.getMonth() + 1).padStart(2, "0"),
      String(a12.getDate()).padStart(2, "0")
    ].join("-"), r13 = this.shadowRoot?.querySelector("wc-datepicker");
    if (!r13) return;
    const n13 = r13.querySelector(
      `td[data-date="${s13}"]`
    );
    n13 && (e5 || n13.focus());
  }
  _isOutOfRange(e5) {
    if (this.minDate) {
      const a12 = this._parseLocalDate(this.minDate);
      if (e5 < a12) return true;
    }
    if (this.maxDate) {
      const a12 = this._parseLocalDate(this.maxDate);
      if (e5 > a12) return true;
    }
    return false;
  }
  _dispatchInputEvent() {
    this.dispatchEvent(
      new CustomEvent("nys-input", {
        detail: { id: this.id, value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }
  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */
  _handleInputKeydown(e5) {
    this.disabled || this._shouldUseNativeDatepicker() || ((e5.key == " " || e5.code == "Space") && (e5.preventDefault(), this._openDatepicker()), (e5.key === "Escape" || e5.code === "Escape") && (e5.preventDefault(), this.shadowRoot?.querySelector("wc-datepicker")?.classList.remove("active")));
  }
  _handleBlur(e5) {
    const a12 = e5.relatedTarget;
    if (a12 && (this.contains(a12) || this.shadowRoot?.contains(a12)) || this.datepickerIsOpen && !a12)
      return;
    this._hasUserInteracted || (this._hasUserInteracted = true), this.shadowRoot?.querySelector("wc-datepicker")?.classList.remove("active"), this.datepickerIsOpen = false, this._validate(), this.dispatchEvent(
      new Event("nys-blur", { bubbles: true, composed: true })
    ), this.removeEventListener("keydown", this._handleFocusTrap);
  }
  // For when users click outside of the datepicker, we remove the calendar popup
  _onDocumentClick() {
    if (this._shouldUseNativeDatepicker()) return;
    const e5 = (a12) => {
      const s13 = a12.composedPath(), r13 = this.shadowRoot?.querySelector(
        ".nys-datepicker--input-container"
      ), n13 = this.shadowRoot?.querySelector(
        ".wc-datepicker--container"
      ), i21 = this.shadowRoot?.querySelector("wc-datepicker");
      r13 && s13.includes(r13) || n13 && s13.includes(n13) || i21 && s13.includes(i21) || i21?.classList.remove("active");
    };
    document.addEventListener("click", e5);
  }
  _toggleDatepicker() {
    if (this.disabled) return;
    if (this._shouldUseNativeDatepicker()) {
      const s13 = this.shadowRoot?.querySelector(
        "input"
      );
      s13 && s13.focus();
      return;
    }
    const a12 = this.shadowRoot?.querySelector("wc-datepicker")?.classList.toggle("active");
    this.datepickerIsOpen = !!a12, a12 ? (this.value || this._setFocusOnTodayDate(), this._startDatepickerPositioning(), this.addEventListener("keydown", this._handleFocusTrap)) : this._stopDatepickerPositioning();
  }
  _openDatepicker() {
    if (this.disabled || this._shouldUseNativeDatepicker()) return;
    const e5 = this.shadowRoot?.querySelector("wc-datepicker");
    e5 && (this.value || this._setFocusOnTodayDate(true), e5?.classList.add("active"), this.datepickerIsOpen = true, this._startDatepickerPositioning(), this.addEventListener("keydown", this._handleFocusTrap));
  }
  _handleDateChange() {
    const e5 = this.shadowRoot?.querySelector("wc-datepicker");
    e5 && e5.addEventListener("selectDate", (a12) => {
      const s13 = a12.detail, r13 = this._parseLocalDate(s13);
      if (this._isOutOfRange(r13)) {
        e5.classList.add("active");
        return;
      }
      this._setValue(r13), this._validate(), this._dispatchInputEvent(), e5.classList.remove("active"), this.datepickerIsOpen = false, this.removeEventListener("keydown", this._handleFocusTrap);
    });
  }
  _handleTodayClick() {
    this.disabled || (this._setTodayDate(), this._hasUserInteracted = true, this._validate(), this._dispatchInputEvent());
  }
  _handleClearClick() {
    if (this.disabled) return;
    this.value = void 0, this.setFormValue("");
    const e5 = this.shadowRoot?.querySelector("input");
    e5 && (e5.value = ""), this._hasUserInteracted = true, this._validate(), this._dispatchInputEvent();
  }
  _handleInputChange(e5) {
    const a12 = e5.target;
    if (!a12) return;
    const s13 = this._getValidDateFromInput(a12.value);
    if (!s13) {
      a12.value || (this.value = void 0, this.setFormValue(""), this._hasUserInteracted && this._validate());
      return;
    }
    this._setValue(s13), this._hasUserInteracted && this._validate(), this._dispatchInputEvent();
  }
  _getValidDateFromInput(e5) {
    const s13 = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e5);
    return !s13 || Number(s13[1]) < 1e3 ? null : this._parseLocalDate(e5);
  }
  _handleFocusTrap(e5) {
    if (!this.datepickerIsOpen || e5.key !== "Tab") return;
    const a12 = this.shadowRoot?.querySelector(
      ".wc-datepicker--container"
    );
    if (!a12) return;
    const s13 = [
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "[tabindex]:not([tabindex='-1'])"
    ], r13 = [];
    if (a12.querySelectorAll("nys-button").forEach((c21) => {
      r13.push(c21);
    }), r13.push(
      ...Array.from(
        a12.querySelectorAll(s13.join(","))
      ).filter((c21) => c21.offsetParent !== null)
    ), r13.length === 0) return;
    const n13 = r13[0], i21 = r13[r13.length - 1], o18 = this.shadowRoot?.activeElement;
    e5.shiftKey ? o18 === n13 && (e5.preventDefault(), i21.focus()) : o18 === i21 && (e5.preventDefault(), n13.focus());
  }
  _isSafari() {
    const e5 = navigator.userAgent;
    return /Safari/.test(e5) && !/Chrome|Chromium|Edg/.test(e5);
  }
  /**
   * Determines whether the current device uses a coarse pointer.
   * A coarse pointer usually means touch-based input where precise pointing
   * is not expected, such as fingers on phones and most tablets.
   *
   * Note: This is not a guarantee of a mobile device.
   * Some non-mobile devices may also report a coarse pointer,
   * and some mobile devices may not.
   *
   * @returns `true` if the device reports a coarse pointer, otherwise `false`.
   */
  _isMobile() {
    return window.matchMedia("(pointer: coarse)").matches;
  }
  _shouldUseNativeDatepicker() {
    return this._isSafari() || this._isMobile();
  }
  /**
   * Auto-Positioning
   * --------------------------------------------------------------------------
   * Opens the calendar below the input by default. If there isn't enough
   * room below (and there's more room above), it opens above instead.
   */
  _positionDatepicker() {
    const e5 = this.shadowRoot?.querySelector("wc-datepicker"), a12 = this.shadowRoot?.querySelector(
      ".nys-datepicker--input-container"
    ), s13 = this.shadowRoot?.querySelector(
      ".nys-datepicker--container"
    );
    if (!e5 || !a12 || !s13) return;
    e5.classList.remove("position-top"), e5.style.top = "";
    const r13 = e5?.getBoundingClientRect();
    if (window.innerHeight - r13?.bottom < this.DATEPICKER_GAP) {
      const i21 = a12.getBoundingClientRect(), o18 = s13.getBoundingClientRect(), c21 = i21.top - o18.top - r13.height - this.DATEPICKER_GAP;
      e5.style.top = `${c21}px`, e5.classList.add("position-top");
    }
  }
  _startDatepickerPositioning() {
    this._positionDatepicker(), window.addEventListener("scroll", this._handleScrollReposition, true);
  }
  _stopDatepickerPositioning() {
    window.removeEventListener("scroll", this._handleScrollReposition, true);
  }
  render() {
    const e5 = this._shouldUseNativeDatepicker();
    return html` <div class="nys-datepicker--container">
        <nys-label
          id="${this.id}--label"
          label=${this.label}
          description=${this.description}
          flag=${this.required ? "required" : this.optional ? "optional" : ""}
          tooltip=${this.tooltip}
          ?inverted=${this.inverted}
        ></nys-label>
        <div
          class="nys-datepicker--input-container ${this.disabled ? "disabled" : ""}"
        >
          <input
            id=${this.id}
            class="nys-datepicker--input"
            type="date"
            min=${ifDefined(this.minDate || void 0)}
            max=${this.maxDate || "9999-12-31"}
            ?required=${this.required}
            .value=${this.value instanceof Date ? this.value.toISOString().split("T")[0] : this.value || ""}
            ?disabled=${this.disabled}
            aria-labelledby=${ifDefined(
      this.label ? this.id + "--label" : void 0
    )}
            aria-label=${ifDefined(
      !this.label && this.ariaLabel ? this.ariaLabel : void 0
    )}
            aria-disabled=${ifDefined(this.disabled ? "true" : void 0)}
            aria-required=${ifDefined(this.required ? "true" : void 0)}
            aria-invalid=${this.showError ? "true" : "false"}
            aria-errormessage=${this.id + "--error"}
            aria-describedby=${ifDefined(
      this.showError ? this.id + "--error" : void 0
    )}
            @click=${this._openDatepicker}
            @input=${this._handleInputChange}
            @blur=${this._handleBlur}
            @keydown=${this._handleInputKeydown}
          />
          ${e5 ? null : html`
                <button
                  id="calendar-button"
                  @click=${this._toggleDatepicker}
                  tabindex=${this.disabled ? "-1" : "0"}
                  ?disabled=${this.disabled}
                  aria-label="Open calendar"
                  aria-haspopup="dialog"
                  aria-controls="wc-datepicker-popup"
                  aria-expanded=${this.datepickerIsOpen ? "true" : "false"}
                >
                  <nys-icon name="calendar_month" size="24"></nys-icon>
                </button>
              `}
        </div>

        <div class="wc-datepicker--container">
          <wc-datepicker
            id="wc-datepicker-popup"
            locale="en-US"
            .value=${this.value instanceof Date ? this.value : this.value ? this._parseLocalDate(this.value) : void 0}
            ?disabled=${this.disabled}
            start-date=${ifDefined(this.startDate ? this.startDate : void 0)}
            min-date=${ifDefined(this.minDate || void 0)}
            max-date=${ifDefined(this.maxDate || void 0)}
            role="dialog"
            aria-modal=${this.datepickerIsOpen ? "true" : "false"}
          >
            ${!this.hideTodayButton || !this.hideClearButton ? html`
                  <div class="wc-datepicker--button-container">
                    ${this.hideTodayButton ? null : html`
                          <nys-button
                            label="Today"
                            size="sm"
                            fullWidth
                            variant="outline"
                            ?disabled=${this.disabled}
                            @nys-click=${this._handleTodayClick}
                          ></nys-button>
                        `}
                    ${this.hideClearButton ? null : html`
                          <nys-button
                            label="Clear"
                            size="sm"
                            fullWidth
                            variant="outline"
                            ?disabled=${this.disabled}
                            @nys-click=${this._handleClearClick}
                          ></nys-button>
                        `}
                  </div>
                ` : null}
          </wc-datepicker>
        </div>
      </div>
      <nys-errormessage
        id=${this.id + "--error"}
        ?showError=${this.showError}
        errorMessage=${this.internals.validationMessage || this.errorMessage}
      ></nys-errormessage>`;
  }
}, C5.styles = unsafeCSS(et2), C5.shadowRootOptions = __spreadProps(__spreadValues({}, LitElement.shadowRootOptions), {
  delegatesFocus: true
}), C5);
y5([
  property({ type: String, reflect: true })
], f8.prototype, "id");
y5([
  property({ type: String, reflect: true })
], f8.prototype, "name");
y5([
  property({ type: String, reflect: true })
], f8.prototype, "width");
y5([
  property({ type: Boolean })
], f8.prototype, "hideTodayButton");
y5([
  property({ type: Boolean })
], f8.prototype, "hideClearButton");
y5([
  property({ type: Boolean, reflect: true })
], f8.prototype, "disabled");
y5([
  property({ type: Boolean, reflect: true })
], f8.prototype, "required");
y5([
  property({ type: Boolean, reflect: true })
], f8.prototype, "optional");
y5([
  property({ type: Boolean, reflect: true })
], f8.prototype, "showError");
y5([
  property({ type: String })
], f8.prototype, "errorMessage");
y5([
  property({ type: String, reflect: true })
], f8.prototype, "form");
y5([
  property({ type: String })
], f8.prototype, "tooltip");
y5([
  property({ type: String })
], f8.prototype, "type");
y5([
  property({ type: String })
], f8.prototype, "label");
y5([
  property({ type: String })
], f8.prototype, "description");
y5([
  property({ type: String })
], f8.prototype, "startDate");
y5([
  property({ type: String })
], f8.prototype, "minDate");
y5([
  property({ type: String })
], f8.prototype, "maxDate");
y5([
  property({ type: Boolean, reflect: true })
], f8.prototype, "inverted");
y5([
  property({
    type: Object,
    converter: {
      fromAttribute: (t11) => t11 ? f8.prototype._parseLocalDate(t11) : void 0,
      toAttribute: (t11) => t11 ? typeof t11 == "string" ? t11 : t11.toISOString().split("T")[0] : ""
    }
  })
], f8.prototype, "value");
y5([
  state()
], f8.prototype, "datepickerIsOpen");
var Vt = f8;
customElements.get("nys-datepicker") || customElements.define("nys-datepicker", Vt);

// ../../nys-divider/dist/nys-divider.js
var v10 = 0;
function y6(e5) {
  return `${e5}-${Date.now()}-${v10++}`;
}
var p7 = (e5) => {
  class r13 extends e5 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = y6(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return r13;
};
var _5 = (e5) => {
  class r13 extends p7(e5) {
    constructor() {
      super(...arguments), this.__internals = null;
    }
    get internals() {
      if (this.__internals) return this.__internals;
      if (typeof this.attachInternals == "function")
        try {
          this.__internals = this.attachInternals();
        } catch {
          this.__internals = null;
        }
      return this.__internals;
    }
    get defaultRole() {
      return null;
    }
    setHostAria(n13, t11) {
      const s13 = this.internals;
      if (s13 && n13 in s13) {
        s13[n13] = t11;
        return;
      }
      const i21 = m11(n13);
      t11 === null ? this.removeAttribute(i21) : this.setAttribute(i21, t11);
    }
    reflectDefaultSemantics() {
      const n13 = this.defaultRole;
      n13 && this.setHostAria("role", n13);
    }
    connectedCallback() {
      super.connectedCallback(), this.reflectDefaultSemantics();
    }
  }
  return r13;
};
function m11(e5) {
  if (e5 === "role") return "role";
  const r13 = e5.replace(/^aria/, "");
  return "aria-" + r13.charAt(0).toLowerCase() + r13.slice(1);
}
var b12 = _5(LitElement);
var g6 = ":host{--_nys-divider-size: var(--nys-size-1px, 1px);--_nys-divider-color: var(--nys-color-neutral-500, #797c7f);--_nys-divider-width: 100%}:host([inverted]){--_nys-divider-color: var(--nys-color-ink-reverse, #ffffff)}:host([subtle]){--_nys-divider-color: var(--nys-color-neutral-100, #e4e5e6)}.nys-divider{width:var(--_nys-divider-width);height:var(--_nys-divider-size);background-color:var(--_nys-divider-color);flex:1 0 0;margin:0;border:none}";
var x10 = Object.defineProperty;
var d5 = (e5, r13, a12, n13) => {
  for (var t11 = void 0, s13 = e5.length - 1, i21; s13 >= 0; s13--)
    (i21 = e5[s13]) && (t11 = i21(r13, a12, t11) || t11);
  return t11 && x10(r13, a12, t11), t11;
};
var o5 = class o6 extends b12 {
  constructor() {
    super(...arguments), this.inverted = false, this.subtle = false;
  }
  /**
   * The host element IS the separator, so reflect role="separator" onto the host
   * via internals. A horizontal separator's implicit aria-orientation is
   * "horizontal", which matches this component, so no explicit orientation is set.
   */
  get defaultRole() {
    return "separator";
  }
  connectedCallback() {
    super.connectedCallback();
  }
  render() {
    return html`<hr
      class="nys-divider"
      role="presentation"
      aria-hidden="true"
    />`;
  }
};
o5.styles = unsafeCSS(g6);
var l2 = o5;
d5([
  property({ type: Boolean, reflect: true })
], l2.prototype, "inverted");
d5([
  property({ type: Boolean, reflect: true })
], l2.prototype, "subtle");
customElements.get("nys-divider") || customElements.define("nys-divider", l2);

// ../../nys-dropdownmenu/dist/chunks/nys-dropdownmenuitem-EV-AQ4zl.js
var y7 = 0;
function c10(o18) {
  return `${o18}-${Date.now()}-${y7++}`;
}
var b13 = (o18) => {
  class e5 extends o18 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = c10(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return e5;
};
var h9 = b13(LitElement);
var w11 = ':host{--_nys-dropdownmenu-width: 180px;--_nys-dropdownmenu-height: 100%;--_nys-dropdownmenu-radius: var(--nys-radius-md, 4px);--_nys-dropdownmenu-border-width: var(--nys-border-width-sm, 1px);--_nys-dropdownmenu-border-color: var(--nys-color-neutral-100, #d0d0ce);--_nys-dropdownmenu-background-color: var(--nys-color-ink-reverse, #ffffff);--_nys-dropdownmenu-boxshadow-color-100: var( --nys-color-black-transparent-100, rgba(27, 27, 27, .1) );--_nys-dropdownmenu-boxshadow-color-50: var( --nys-color-black-transparent-50, rgba(27, 27, 27, .01) );--_nys-dropdownmenu-gap: var(--nys-space-2px, 2px);--_nys-dropdownmenu-padding: var(--nys-space-100, 8px);--_nys-dropdownmenu-font-size: var(--nys-font-size-ui-md, 16px);--_nys-dropdownmenu-font-weight: var(font-weight: 400);--_nys-dropdownmenu-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-dropdownmenu-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-dropdownmenuitem-color: var(--nys-color-text, #1b1b1b);--_nys-dropdownmenuitem-gap: var(--nys-space-100, 8px);--_nys-dropdownmenuitem-padding: var(--nys-space-200, 16px) var(--nys-space-100, 8px);--_nys-dropdownmenuitem-border-radius: var(--nys-radius-md, 4px);--_nys-dropdownmenuitem-background-color: var(--nys-color-white, #ffffff);--_nys-dropdownmenuitem-background-color--hover: var( --nys-color-neutral-10, #f6f6f6 );--_nys-dropdownmenuitem-background-color--active: var( --nys-color-neutral-50, #ededed );--_nys-dropdownmenuitem-color--disabled: var( --nys-color-text-disabled, #bec0c1 );--_nys-dropdownmenuitem-outline-width: var(--nys-border-width-md, 2px);--_nys-dropdownmenuitem-outline-color: var(--nys-color-focus, #004dd1)}.nys-dropdownmenu{position:fixed;top:0;left:0;z-index:1776}.nys-dropdownmenu.active ul{display:flex}.nys-dropdownmenu ul{display:none;align-items:flex-start;flex-direction:column;gap:var(--_nys-dropdownmenu-gap);width:var(--_nys-dropdownmenu-width);height:var(--_nys-dropdownmenu-height);border-radius:var(--_nys-dropdownmenu-radius);border:var(--_nys-dropdownmenu-border-width) solid var(--_nys-dropdownmenu-border-color);background-color:var(--_nys-dropdownmenu-background-color);box-shadow:0 4px 6px -1px var(--_nys-dropdownmenu-boxshadow-color-100),0 4px 6px -1px var(--_nys-dropdownmenu-boxshadow-color-50);padding:var(--_nys-dropdownmenu-padding);font-family:var(--_nys-dropdownmenu-font-family);font-size:var(--_nys-dropdownmenu-font-size);font-weight:var(--_nys-dropdownmenu-font-weight);line-height:var(--_nys-dropdownmenu-line-height);overflow:hidden;margin:0}.nys-dropdownmenuitem{list-style:none;width:var(--_nys-dropdownmenu-width);padding:0;margin:0}.nys-dropdownmenuitem a,.nys-dropdownmenuitem button{display:flex;gap:var(--_nys-dropdownmenuitem-gap);padding:var(--_nys-dropdownmenuitem-padding);border-radius:var(--_nys-dropdownmenuitem-border-radius);background-color:var(--_nys-dropdownmenuitem-background-color);width:100%;box-sizing:border-box;text-decoration:none;text-wrap:wrap;color:var(--_nys-dropdownmenuitem-color);transition:.05s ease-in-out all;border:none;font-family:var(--_nys-dropdownmenu-font-family);font-size:var(--_nys-dropdownmenu-font-size);font-weight:var(--_nys-dropdownmenu-font-weight);line-height:var(--_nys-dropdownmenu-line-height);cursor:pointer}.nys-dropdownmenuitem a nys-icon,.nys-dropdownmenuitem button nys-icon{margin-top:2.5px}.nys-dropdownmenuitem a:hover:not(.disabled):not([aria-disabled=true]),.nys-dropdownmenuitem button:hover:not(.disabled):not([aria-disabled=true]){background-color:var(--_nys-dropdownmenuitem-background-color--hover)}.nys-dropdownmenuitem a:active:not(.disabled):not([aria-disabled=true]),.nys-dropdownmenuitem button:active:not(.disabled):not([aria-disabled=true]){background-color:var(--_nys-dropdownmenuitem-background-color--active)}.nys-dropdownmenuitem a:focus-visible:not(.disabled):not([aria-disabled=true]):not([focus-ring-false]),.nys-dropdownmenuitem button:focus-visible:not(.disabled):not([aria-disabled=true]):not([focus-ring-false]){position:relative;outline:var(--_nys-dropdownmenuitem-outline-width) solid var(--_nys-dropdownmenuitem-outline-color)}.nys-dropdownmenuitem a.disabled,.nys-dropdownmenuitem a[aria-disabled=true],.nys-dropdownmenuitem button.disabled,.nys-dropdownmenuitem button[aria-disabled=true]{color:var(--_nys-dropdownmenuitem-color--disabled);pointer-events:none;cursor:default}';
var f9 = Object.defineProperty;
var t4 = (o18, e5, a12, v20) => {
  for (var r13 = void 0, l17 = o18.length - 1, p19; l17 >= 0; l17--)
    (p19 = o18[l17]) && (r13 = p19(e5, a12, r13) || r13);
  return r13 && f9(e5, a12, r13), r13;
};
var s2 = class s3 extends h9 {
  constructor() {
    super(...arguments), this.label = "", this.href = "", this.disabled = false, this.target = "_self", this.prefixIcon = "", this.divider = "";
  }
  // super.connectedCallback() (NysElement) auto-assigns this.id when
  // one is not provided (prefix = localName, i.e. "nys-dropdownmenuitem-<ts>-<n>").
  // role="menuitem" intentionally stays on the inner <a>/<button>, so this
  // component keeps defaultRole = null and does not move a role onto the host.
  connectedCallback() {
    super.connectedCallback();
  }
  _handleClick(e5) {
    if (this.disabled) {
      e5.preventDefault();
      return;
    }
    this.dispatchEvent(
      new CustomEvent("nys-click", {
        bubbles: true,
        composed: true,
        detail: __spreadValues({
          id: this.id,
          label: this.label
        }, this.href && { href: this.href })
      })
    );
  }
  render() {
    const e5 = !!this.href;
    return html`<li class="nys-dropdownmenuitem" role="presentation">
      ${e5 ? html` <a
            class=${this.disabled ? "disabled" : ""}
            href=${this.disabled ? "" : this.href}
            role="menuitem"
            aria-disabled="${this.disabled ? "true" : "false"}"
            aria-label=${this.label}
            tabindex=${this.disabled ? "-1" : "0"}
            @click="${this._handleClick}"
            target="${this.target}"
          >
            ${this.prefixIcon ? html`<nys-icon size="16" name=${this.prefixIcon}></nys-icon>` : ""}
            ${this.label}</a
          >` : html`
            <button
              class=${this.disabled ? "disabled" : ""}
              type="button"
              role="menuitem"
              aria-disabled="${this.disabled ? "true" : "false"}"
              aria-label=${this.label}
              tabindex=${this.disabled ? "-1" : "0"}
              ?disabled=${this.disabled}
              @click="${this._handleClick}"
            >
              ${this.prefixIcon ? html`<nys-icon size="16" name=${this.prefixIcon}></nys-icon>` : ""}
              ${this.label}
            </button>
          `}
    </li>`;
  }
};
s2.styles = unsafeCSS(w11), s2.shadowRootOptions = __spreadProps(__spreadValues({}, LitElement.shadowRootOptions), {
  delegatesFocus: true
});
var n7 = s2;
t4([
  property({ type: String })
], n7.prototype, "label");
t4([
  property({ type: String })
], n7.prototype, "href");
t4([
  property({ type: Boolean, reflect: true })
], n7.prototype, "disabled");
t4([
  property({ type: String })
], n7.prototype, "target");
t4([
  property({ type: String })
], n7.prototype, "prefixIcon");
t4([
  property({ type: String })
], n7.prototype, "divider");
customElements.get("nys-dropdownmenuitem") || customElements.define("nys-dropdownmenuitem", n7);

// ../../nys-dropdownmenu/dist/nys-dropdownmenu.js
var w12 = Object.defineProperty;
var c11 = (u17, t11, e5, n13) => {
  for (var s13 = void 0, i21 = u17.length - 1, o18; i21 >= 0; i21--)
    (o18 = u17[i21]) && (s13 = o18(t11, e5, s13) || s13);
  return s13 && w12(t11, e5, s13), s13;
};
var d6 = class d7 extends h9 {
  /**
   * Lifecycle Methods
   * --------------------------------------------------------------------------
   */
  constructor() {
    super(), this.for = "", this.showDropdown = false, this.label = "", this.position = null, this._trigger = null, this._menuElement = null, this._ariaTarget = null, this._lastFocusedIndex = 0, this.GAP = 4, this._resizeObserver = null, this._toggleDropdown = async () => {
      this.showDropdown = !this.showDropdown, this._ariaTarget?.setAttribute("aria-expanded", String(this.showDropdown)), this.showDropdown ? (window.addEventListener("scroll", this._handleWindowScroll, true), this._resizeObserver = new ResizeObserver(() => {
        this.showDropdown && this._positionMenu();
      }), this._resizeObserver.observe(document.documentElement), document.addEventListener("click", this._handleDocumentClick), this._menuElement = this.shadowRoot?.querySelector(
        ".nys-dropdownmenu"
      ), this._menuElement.addEventListener("keydown", this._handleMenuKeydown), await this.updateComplete, this._positionMenu(), this._focusOnItem(this._lastFocusedIndex)) : (window.removeEventListener("scroll", this._handleWindowScroll, true), document.removeEventListener("click", this._handleDocumentClick), this._menuElement.removeEventListener(
        "keydown",
        this._handleMenuKeydown
      ), this._resizeObserver?.disconnect(), this._resizeObserver = null);
    }, this._handleDocumentClick = (t11) => {
      if (!this.showDropdown) return;
      const e5 = t11?.composedPath(), n13 = e5.includes(this), s13 = this._trigger && e5.includes(this._trigger);
      !n13 && !s13 && this._closeDropdown();
    }, this._handleTriggerKeydown = (t11) => {
      t11.defaultPrevented || t11.key === "Escape" && this.showDropdown && (t11.preventDefault(), this._closeDropdown());
    }, this._handleMenuKeydown = (t11) => {
      const e5 = this._getMenuItems(), n13 = e5.indexOf(document.activeElement);
      switch (t11.key) {
        case "Escape":
          t11.preventDefault(), this._closeDropdown();
          break;
        case "ArrowDown":
        case "ArrowRight":
          t11.preventDefault();
          const s13 = n13 < e5.length - 1 ? n13 + 1 : 0;
          this._lastFocusedIndex = s13, e5[s13].focus();
          break;
        case "ArrowUp":
        case "ArrowLeft":
          t11.preventDefault();
          const i21 = n13 > 0 ? n13 - 1 : e5.length - 1;
          this._lastFocusedIndex = i21, e5[i21].focus();
          break;
        case "Tab":
          n13 >= e5.length - 1 && !t11.shiftKey && this._closeDropdown();
          break;
      }
    }, this._handleWindowScroll = () => {
      this.showDropdown && this._positionMenu();
    };
  }
  // super.connectedCallback() (NysElement) auto-assigns this.id when
  // one is not provided (prefix = localName, i.e. "nys-dropdownmenu-<ts>-<n>").
  // The menu/menuitem roles intentionally stay on the inner <ul>/items, so this
  // component keeps defaultRole = null and does not move a role onto the host.
  connectedCallback() {
    super.connectedCallback();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
  }
  async firstUpdated() {
    await this.updateComplete, this.applyInverseTransform(), this._connectTrigger(), this._handleMenuClick();
  }
  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  _findTrigger() {
    const t11 = this.for;
    if (!t11) return null;
    let e5 = document.getElementById(t11);
    if (e5) return e5;
    const n13 = (s13) => {
      for (const i21 of Array.from(s13.querySelectorAll("*"))) {
        const o18 = i21.shadowRoot;
        if (o18) {
          const r13 = o18.getElementById(t11);
          if (r13) return r13;
          const a12 = n13(o18);
          if (a12) return a12;
        }
      }
      return null;
    };
    return n13(document);
  }
  _connectTrigger() {
    const t11 = this._findTrigger();
    if (!t11) return;
    this._trigger = t11;
    const e5 = t11.tagName.toLowerCase() === "nys-button" ? t11.shadowRoot?.querySelector("button") ?? t11 : t11;
    e5.setAttribute("aria-haspopup", "menu"), e5.setAttribute("aria-expanded", "false"), this._ariaTarget = e5, this._trigger.addEventListener("click", this._toggleDropdown), this._trigger.addEventListener("keydown", this._handleTriggerKeydown);
  }
  _closeDropdown() {
    this.showDropdown = false, this._ariaTarget?.setAttribute("aria-expanded", "false"), this._trigger?.focus();
  }
  _getMenuItems() {
    return (this.shadowRoot?.querySelector("slot")?.assignedElements({ flatten: true }) || []).filter(
      (n13) => n13 && !n13.hasAttribute("disabled")
    );
  }
  async _focusOnItem(t11 = 0) {
    await new Promise((s13) => requestAnimationFrame(s13));
    const e5 = this._getMenuItems(), n13 = e5[Math.min(t11, e5.length - 1)];
    n13 && n13.focus();
  }
  // In some iframes (like Storybook's) or embedded containers , parent elements may have CSS transforms applied, creating a new coordinate context.
  // This function removes such transforms to prevent them from affecting tooltip positioning calculations.
  applyInverseTransform() {
    document.querySelectorAll('div[scale="1"]').forEach((t11) => {
      t11.style.transform = "none";
    });
  }
  /**
   * Position Logic
   * --------------------------------------------------------------------------
   */
  /**
   * The controller function for positioning the dropdown menu.
   * The logic diverts to if user sets position or we auto position the dropdown menu
   */
  _positionMenu() {
    if (!this._trigger || (this._menuElement = this.shadowRoot?.querySelector(
      ".nys-dropdownmenu"
    ), !this._menuElement)) return;
    const t11 = this.position ? this._setUserPosition(this.position) : this._autoPosition(), e5 = this._calculateCoordinates(t11);
    this._applyPosition(e5);
  }
  _setUserPosition(t11) {
    const e5 = this._checkSpaceAvailable(), n13 = this._menuElement.getBoundingClientRect();
    return this._checkPositionFits(
      t11,
      e5,
      n13
    ) ? t11 : this._findBestAlternative(t11, e5, n13);
  }
  /**
   * Auto Positioning of the dropdown menu relies on the best surrounding space available
   * to select the desirable position.
   */
  _autoPosition() {
    const t11 = this._checkSpaceAvailable(), e5 = this._menuElement.getBoundingClientRect(), n13 = "bottom-end";
    return this._checkPositionFits(n13, t11, e5) ? n13 : this._findBestAlternative(n13, t11, e5);
  }
  /**
   * Checks if the dropdown menu fits inside the viewport on the given side of the trigger.
   * Overrides user set position for auto-positioning if user's desire space is not available
   */
  _checkSpaceAvailable() {
    if (!this._trigger)
      return { top: 0, bottom: 0, start: 0, end: 0 };
    const t11 = this._trigger.getBoundingClientRect(), e5 = window.innerWidth, n13 = window.innerHeight;
    return {
      top: t11.top,
      bottom: n13 - t11.bottom,
      start: t11.left,
      end: e5 - t11.right
    };
  }
  _checkPositionFits(t11, e5, n13) {
    const s13 = n13.width, i21 = n13.height, [o18, r13] = t11.split("-"), a12 = o18 === "bottom" ? e5.bottom >= i21 + this.GAP : e5.top >= i21 + this.GAP, m32 = r13 === "start" ? e5.end >= s13 : e5.start >= s13;
    return a12 && m32;
  }
  /**
   * This position is called for when user's set position didn't fit OR auto positioning when default position doesn't fit
   * We look for the best alternative positions in order of preference base on the set position (e.g. bottom-start => bottom-end).
   * @param userPosition
   * @param space
   * @param menuRect
   */
  _findBestAlternative(t11, e5, n13) {
    const [s13, i21] = t11.split("-"), o18 = [
      `${s13 === "bottom" ? "top" : "bottom"}-${i21}`,
      // Flip vertical
      `${s13}-${i21 === "start" ? "end" : "start"}`,
      // Flip horizontal
      `${s13 === "bottom" ? "top" : "bottom"}-${i21 === "start" ? "end" : "start"}`
      // Flip both
    ];
    for (const r13 of o18)
      if (this._checkPositionFits(r13, e5, n13))
        return r13;
    return this._findMostAvailableSpace(e5);
  }
  _findMostAvailableSpace(t11) {
    const e5 = t11.bottom >= t11.top ? "bottom" : "top", n13 = t11.start >= t11.end ? "start" : "end";
    return `${e5}-${n13}`;
  }
  /**
   * A valid ideal position has been chosen.
   * This function calculates the coordinate of the trigger to properly position the dropdown menu.
   * @param position
   * @returns
   */
  _calculateCoordinates(t11) {
    if (!this._trigger || !this._menuElement)
      return { top: 0, left: 0 };
    const e5 = this._trigger.getBoundingClientRect(), n13 = this._menuElement.getBoundingClientRect(), [s13, i21] = t11.split("-");
    let o18 = 0, r13 = 0;
    return s13 === "bottom" ? o18 = e5.bottom + this.GAP : o18 = e5.top - n13.height - this.GAP, i21 === "start" ? r13 = e5.left : r13 = e5.right - n13.width, { top: o18, left: r13 };
  }
  _applyPosition(t11) {
    this._menuElement && (this._menuElement.style.top = `${t11.top}px`, this._menuElement.style.left = `${t11.left}px`);
  }
  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */
  _handleMenuClick() {
    this.addEventListener("nys-click", (t11) => {
      const e5 = this._getMenuItems(), n13 = t11.detail?.id, s13 = e5.findIndex((i21) => i21.id === n13);
      s13 !== -1 && (this._lastFocusedIndex = s13), this._closeDropdown();
    });
  }
  render() {
    return html`<div
      class="nys-dropdownmenu ${this.showDropdown ? "active" : ""}"
      for=${this.for}
      ?hidden=${!this.showDropdown}
    >
      <ul role="menu" aria-label=${this.label || "Menu"}>
        <slot></slot>
      </ul>
    </div>`;
  }
};
d6.styles = unsafeCSS(w11);
var l3 = d6;
c11([
  property({ type: String, reflect: true })
], l3.prototype, "for");
c11([
  property({ type: Boolean })
], l3.prototype, "showDropdown");
c11([
  property({ type: String })
], l3.prototype, "label");
c11([
  property({ type: String, reflect: true })
], l3.prototype, "position");
customElements.get("nys-dropdownmenu") || customElements.define("nys-dropdownmenu", l3);

// ../../nys-fileinput/dist/chunks/nys-fileitem-BBRADK5s.js
var v11 = 0;
function _6(r13) {
  return `${r13}-${Date.now()}-${v11++}`;
}
function b14(r13) {
  return r13.filter((e5) => !!e5);
}
var x11 = {
  labelledby: "ariaLabelledByElements",
  describedby: "ariaDescribedByElements"
};
var w13 = {
  labelledby: "aria-label",
  describedby: "aria-description"
};
function D3(r13, e5, n13) {
  const i21 = b14(n13), t11 = x11[e5], s13 = w13[e5], a12 = r13;
  t11 in r13 && (a12[t11] = i21.length ? i21 : null);
  const l17 = i21.map((c21) => c21.textContent?.trim() ?? "").filter(Boolean).join(" ");
  l17 ? r13.setAttribute(s13, l17) : r13.removeAttribute(s13);
}
var y8 = (r13) => {
  class e5 extends r13 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = _6(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return e5;
};
var k6 = y8(LitElement);
var $7 = (r13) => {
  class e5 extends y8(r13) {
    constructor() {
      super(...arguments), this.__internals = null;
    }
    get internals() {
      if (this.__internals) return this.__internals;
      if (typeof this.attachInternals == "function")
        try {
          this.__internals = this.attachInternals();
        } catch {
          this.__internals = null;
        }
      return this.__internals;
    }
    get defaultRole() {
      return null;
    }
    setHostAria(i21, t11) {
      const s13 = this.internals;
      if (s13 && i21 in s13) {
        s13[i21] = t11;
        return;
      }
      const a12 = I5(i21);
      t11 === null ? this.removeAttribute(a12) : this.setAttribute(a12, t11);
    }
    reflectDefaultSemantics() {
      const i21 = this.defaultRole;
      i21 && this.setHostAria("role", i21);
    }
    connectedCallback() {
      super.connectedCallback(), this.reflectDefaultSemantics();
    }
  }
  return e5;
};
function I5(r13) {
  if (r13 === "role") return "role";
  const e5 = r13.replace(/^aria/, "");
  return "aria-" + e5.charAt(0).toLowerCase() + e5.slice(1);
}
var V5 = (r13) => {
  const e5 = class extends $7(r13) {
    setFormValue(t11) {
      this.internals?.setFormValue(t11 ?? null);
    }
    setValidityFromState(t11, s13, a12) {
      const l17 = this.internals;
      if (!l17) return;
      const c21 = Object.values(t11).some(Boolean);
      c21 ? l17.setValidity(t11, s13 ?? "Invalid value", a12) : l17.setValidity({}), this.setHostAria("ariaInvalid", c21 ? "true" : "false");
    }
    clearValidity() {
      this.internals?.setValidity({}), this.setHostAria("ariaInvalid", "false");
    }
    checkValidity() {
      return this.internals?.checkValidity() ?? true;
    }
    reportValidity() {
      return this.internals?.reportValidity() ?? true;
    }
    formResetCallback() {
      this.clearValidity();
    }
  };
  return e5.formAssociated = true, e5;
};
var M3 = V5(LitElement);
var A2 = ':host{--_nys-fileitem-border-radius: var(--nys-radius-md, 4px);--_nys-fileitem-padding: var(--nys-space-100, 8px) var(--nys-space-200, 16px);--_nys-fileitem-background-color: var(--nys-color-ink-reverse, #ffffff);--_nys-fileitem-border-color: var(--nys-color-neutral-100, #d0d0ce);--_nys-fileitem-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-fileitem-font-size: var(--nys-font-size-ui-md, 16px);--_nys-fileitem-font-weight: var(--nys-font-weight-regular, 400);--_nys-fileitem-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-fileitem-letter-spacing: var(--nys-font-letterspacing-ui-md, .044px);--_nys-fileitem-background-color--progress: var( --nys-color-neutral-50, #ededed );--_nys-fileitem-background-color--progress--fill: var( --nys-color-info, #004dd1 )}.file-item{position:relative;border-radius:var(--_nys-fileitem-border-radius);border-width:var(--nys-border-width-sm, 1px);border-style:solid;border-color:var(--_nys-fileitem-border-color);background-color:var(--_nys-fileitem-background-color)}.file-item.error{--_nys-fileitem-border-color: var(--nys-color-danger, #b52c2c)}.file-item__main{display:flex;place-items:center center;gap:var(--_nys-fileinput-gap);padding:var(--_nys-fileitem-padding);height:56px;box-sizing:border-box}.file-item__info{display:flex;flex-direction:column;flex:1;min-width:0;font-family:var(--_nys-fileitem-font-family);font-size:var(--_nys-fileitem-font-size);font-style:normal;font-weight:var(--_nys-fileitem-font-weight);line-height:var(--_nys-fileitem-line-height);letter-spacing:var(--_nys-fileitem-letter-spacing)}.file-item__info-name{display:flex;max-width:100%;overflow:hidden;white-space:nowrap;align-items:center}.file-item__info-name-start{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex-shrink:1;min-width:0}.file-item p{margin:0}.file-item__error{color:var(--nys-color-danger, #b52c2c);text-overflow:ellipsis;font-weight:700}progress{position:absolute;bottom:0;display:flex;width:100%;height:6px;border-radius:var(--nys-radius-round, 1776px);background:var(--_nys-fileitem-background-color--progress--fill);overflow:hidden;appearance:none}progress::-moz-progress-bar{background-color:var(--_nys-fileitem-background-color--progress)}progress::-webkit-progress-value{background-color:var(--_nys-fileitem-background-color--progress--fill)}progress::-webkit-progress-bar{background-color:var(--_nys-fileitem-background-color--progress)}.file-icon[name=progress_activity]{animation:spin 1s linear infinite}.file-icon[name=error]{color:var(--nys-color-danger, #b52c2c)}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}';
var C6 = Object.defineProperty;
var m12 = (r13, e5, n13, i21) => {
  for (var t11 = void 0, s13 = r13.length - 1, a12; s13 >= 0; s13--)
    (a12 = r13[s13]) && (t11 = a12(e5, n13, t11) || t11);
  return t11 && C6(e5, n13, t11), t11;
};
var d8 = class d9 extends k6 {
  constructor() {
    super(...arguments), this.filename = "", this.status = "pending", this.progress = 0, this.errorMessage = "";
  }
  /**
   * True when this item is actually in an error state. `aria-invalid` reflects
   * this rather than being hardcoded, so a healthy item is never announced as
   * invalid.
   */
  get _isInvalid() {
    return this.status === "error" || !!this.errorMessage;
  }
  /** True only when the error element is rendered, so the IDREF can resolve. */
  get _hasErrorText() {
    return !!this.errorMessage;
  }
  /**
   * Stable id of the element that holds the error text. `aria-errormessage` and
   * `aria-describedby` take an IDREF, so they must point at this — never at the
   * message text itself. Derived from the host id (auto-generated by NysElement)
   * rather than the filename, which is not id-safe and not stable.
   */
  get _errorId() {
    return `${this.id}--error`;
  }
  _handleRemove() {
    this.dispatchEvent(
      new CustomEvent("nys-fileRemove", {
        detail: { filename: this.filename },
        bubbles: true,
        composed: true
      })
    );
  }
  splitFilename(e5) {
    const n13 = e5.lastIndexOf("."), i21 = n13 !== -1 ? e5.slice(n13) : "", t11 = n13 !== -1 ? e5.slice(0, n13) : e5, s13 = t11.slice(0, t11.length - 3), a12 = t11.slice(-3);
    return { startPart: s13, endPart: a12, extension: i21 };
  }
  render() {
    const { startPart: e5, endPart: n13, extension: i21 } = this.splitFilename(this.filename);
    return html`
      <div
        class="file-item ${this.status}"
        aria-busy=${this.status === "processing" ? "true" : "false"}
        aria-label="You have selected ${this.filename}"
        aria-invalid=${this._isInvalid ? "true" : "false"}
        aria-errormessage=${ifDefined(
      this._hasErrorText ? this._errorId : void 0
    )}
        aria-describedby=${ifDefined(
      this._hasErrorText ? this._errorId : void 0
    )}
      >
        <div class="file-item__main" role="group">
          <nys-icon
            class="file-icon"
            name=${this.status === "processing" ? "progress_activity" : this.status === "error" ? "error" : "attach_file"}
            size="2xl"
          ></nys-icon>
          <div class="file-item__info">
            <div class="file-item__info-name">
              <span class="file-item__info-name-start">${e5}</span>
              <span class="file-item__info-name-end"
                >${n13}${i21}</span
              >
            </div>
            ${this.errorMessage ? html`<p
                  class="file-item__error"
                  role="alert"
                  aria-live="assertive"
                  id=${this._errorId}
                >
                  ${this.errorMessage}
                </p>` : null}
          </div>
          <nys-button
            circle
            icon="close"
            label="Remove file: ${this.filename}"
            size="sm"
            variant="ghost"
            @nys-click=${this._handleRemove}
          ></nys-button>
        </div>
        ${this.status === "processing" ? html`<div
              class="file-item__progress-container"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow="${this.progress}"
              aria-label="Upload progress for ${this.filename}"
            >
              <progress value=${this.progress} max="100"></progress>
            </div>` : null}
      </div>
    `;
  }
};
d8.styles = unsafeCSS(A2), d8.shadowRootOptions = __spreadProps(__spreadValues({}, LitElement.shadowRootOptions), {
  delegatesFocus: true
});
var o7 = d8;
m12([
  property({ type: String })
], o7.prototype, "filename");
m12([
  property({ type: String })
], o7.prototype, "status");
m12([
  property({ type: Number })
], o7.prototype, "progress");
m12([
  property({ type: String })
], o7.prototype, "errorMessage");
customElements.get("nys-fileitem") || customElements.define("nys-fileitem", o7);

// ../../nys-fileinput/dist/nys-fileinput.js
async function m13(p19, e5) {
  if (!e5 || e5.trim() === "") return true;
  const t11 = e5.toLowerCase().split(",").map((r13) => r13.trim()), i21 = p19.name.toLowerCase(), s13 = i21.includes(".") ? i21.split(".").pop() : "";
  for (const r13 of t11)
    if (r13.startsWith(".") && r13.slice(1) === s13 || r13.endsWith("/*") && p19.type.startsWith(r13.slice(0, -1)) || p19.type === r13)
      return true;
  return false;
}
var b15 = ':host{--_nys-fileinput-gap: var(--nys-space-100, 8px);--_nys-fileinput-font-size: var(--nys-font-size-ui-md, 16px);--_nys-fileinput-font-weight: var(--nys-font-weight-semibold, 600);--_nys-fileinput-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-fileinput-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-fileinput-background-color--dropzone: var( --nys-color-ink-reverse, #ffffff );--_nys-fileinput-background-color--dropzone--disabled: var( --nys-color-neutral-10, #f6f6f6 );--_nys-fileinput-background-color--dropzone--active: var( --nys-color-theme-faint, #f7fafd );--_nys-fileinput-border-radius--dropzone: var( --nys-radius-lg, var(--nys-space-100, 8px) );--_nys-fileinput-border-style: dashed;--_nys-fileinput-border-color: var(--nys-color-neutral-200, #bec0c1);--_nys-fileinput-border-width: var(--nys-border-width-sm, 1px)}.nys-fileinput{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:var(--_nys-fileinput-gap);font-family:var(--_nys-fileinput-font-family);font-size:var(--_nys-fileinput-font-size);font-weight:var(--_nys-fileinput-font-weight);line-height:var(--_nys-fileinput-line-height)}:host([width=lg]) .nys-fileinput{max-width:var(--nys-form-width-lg, 384px)}ul{list-style-type:none;padding:0;margin:0;width:100%;display:flex;flex-direction:column;gap:var(--_nys-fileinput-gap)}.nys-fileinput__dropzone{display:flex;padding:var(--nys-space-400, 32px) var(--nys-space-200, 16px);justify-content:center;align-items:center;gap:12px;align-self:stretch;border-radius:var(--_nys-fileinput-border-radius--dropzone);outline:var(--_nys-fileinput-border-width) var(--_nys-fileinput-border-style) var(--_nys-fileinput-border-color);background-color:var(--_nys-fileinput-background-color--dropzone);transition:all 60ms ease-in-out}.nys-fileinput__dropzone:hover{cursor:pointer;--_nys-fileinput-border-width: var(--nys-border-width-md, 2px);--_nys-fileinput-border-color: var(--nys-color-neutral-700, #4a4d4f)}.nys-fileinput__dropzone.drag-active{--_nys-fileinput-border-width: var(--nys-border-width-md, 2px);--_nys-fileinput-border-color: var(--nys-color-theme, #154973);--_nys-fileinput-border-style: solid}.nys-fileinput__dropzone.error{--_nys-fileinput-border-color: var(--nys-color-danger, #b52c2c)}.nys-fileinput__dropzone.error:hover{--_nys-fileinput-border-width: var(--nys-border-width-md, 2px);--_nys-fileinput-border-color: var(--nys-color-emergency, #721c1c)}.nys-fileinput__dropzone.disabled{cursor:not-allowed;--_nys-fileinput-border-color: var(--nys-color-neutral-300, #a7a9ab);--_nys-fileinput-border-width: var(--nys-border-width-sm, 1px);background-color:var(--_nys-fileinput-background-color--dropzone--disabled);color:var(--_nys-fileinput-color--dropzone--disabled)}progress{display:flex;width:100%;height:6px;border-radius:var(--nys-radius-round, 1776px);background-color:var(--_nys-fileinput-progress-background);overflow:hidden;appearance:none;border:none}progress::-moz-progress-bar{background-color:var(--_nys-fileinput-progress-background)}progress::-webkit-progress-value{background-color:var(--_nys-fileinput-progress-background)}progress::-webkit-progress-bar{background-color:var(--_nys-fileinput-progress-background)}';
var F2 = Object.defineProperty;
var w14 = Object.getOwnPropertyDescriptor;
var l4 = (p19, e5, t11, i21) => {
  for (var s13 = i21 > 1 ? void 0 : i21 ? w14(e5, t11) : e5, r13 = p19.length - 1, a12; r13 >= 0; r13--)
    (a12 = p19[r13]) && (s13 = (i21 ? a12(e5, t11, s13) : a12(s13)) || s13);
  return i21 && s13 && F2(e5, t11, s13), s13;
};
var u4 = class u5 extends M3 {
  constructor() {
    super(...arguments), this.id = "", this.name = "", this.label = "", this.description = "", this.multiple = false, this.form = null, this.tooltip = "", this.accept = "", this.disabled = false, this.required = false, this.optional = false, this.showError = false, this.errorMessage = "", this.dropzone = false, this.width = "full", this.inverted = false, this._selectedFiles = [], this._dragActive = false;
  }
  get files() {
    return this._selectedFiles.map((e5) => e5.file);
  }
  set files(e5) {
    this._selectedFiles = [];
    const t11 = this.renderRoot?.querySelector(
      ".hidden-file-input"
    );
    t11 && (t11.value = ""), (e5 ?? []).forEach((i21) => this._saveSelectedFiles(i21)), this._setValue(), this._validate(), this.requestUpdate();
  }
  get value() {
    return this._selectedFiles[0]?.file ?? null;
  }
  set value(e5) {
    this.files = e5 ? [e5] : [];
  }
  /**
   * Programmatically set the selection and await async validation/processing.
   * Same as assigning `files`, but resolves once every file has finished its
   * magic-byte validation and read — use when you need to read `checkValidity()`
   * or the settled selection immediately after.
   */
  async setFiles(e5) {
    this._selectedFiles = [];
    const t11 = this.renderRoot?.querySelector(
      ".hidden-file-input"
    );
    t11 && (t11.value = "");
    for (const i21 of e5 ?? [])
      await this._saveSelectedFiles(i21);
    this._setValue(), this._validate(), this.requestUpdate();
  }
  get _isDropDisabled() {
    return this.disabled || !this.multiple && this._selectedFiles.length > 0;
  }
  get _innerNysButton() {
    return this.renderRoot.querySelector(
      '[name="file-btn"]'
    )?.shadowRoot?.querySelector(
      "button"
    );
  }
  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   * Form association, ElementInternals, and id generation are provided by
   * NysFormControlElement (@nysds/internals).
   */
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("invalid", this._handleInvalid);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("invalid", this._handleInvalid);
  }
  firstUpdated() {
    this._setValue();
  }
  updated() {
    this._syncControlErrorAssociation();
  }
  /**
   * Point the exposed control at the rendered <nys-errormessage> and, in
   * dropzone mode, at the "or drag here" instructional text.
   *
   * The native <input type="file"> is `hidden`, `aria-hidden` and `tabindex="-1"`,
   * so it is not in the accessibility tree and must not carry these
   * associations. The element a user actually reaches is the <button> inside the
   * "Choose file" <nys-button>'s shadow root — that's also the keyboard path for
   * the dropzone (Enter/Space opens the native file picker via real button
   * semantics); the dropzone `<div>` itself is a non-interactive, pointer-only
   * drop target and never receives focus.
   *
   * The button and these targets sit in different shadow roots, so an IDREF
   * written on the button would dangle. ARIA element reflection does cross into a
   * shadow-including ancestor tree, so associateControlRefs sets the control's own
   * ariaDescribedByElements (plus an aria-description string fallback for engines
   * that expose the IDL but do not yet honor it). aria-describedby — not
   * aria-errormessage — is what Blink actually surfaces for a control inside a
   * shadow root; see src/scripts/verify-a11y-names.mjs. aria-errormessage is set
   * through its element-reflection form where the engine supports it.
   */
  async _syncControlErrorAssociation() {
    const e5 = this.renderRoot?.querySelector('[name="file-btn"]');
    if (!e5) return;
    customElements.get("nys-button") || await customElements.whenDefined("nys-button"), await e5.updateComplete;
    const t11 = this._innerNysButton;
    if (!t11) return;
    const i21 = this.showError ? this.renderRoot?.querySelector(
      "nys-errormessage"
    ) : null, s13 = this.dropzone && !this._dragActive ? this.renderRoot?.querySelector(
      ".nys-fileinput__dropzone-hint"
    ) : null;
    t11.setAttribute("aria-invalid", i21 ? "true" : "false"), D3(t11, "describedby", [s13, i21]);
    const r13 = this.internals?.validationMessage || this.errorMessage, a12 = [
      s13?.textContent?.trim() || void 0,
      i21 && r13 ? r13 : void 0
    ].filter((f21) => !!f21);
    a12.length ? t11.setAttribute("aria-description", a12.join(" ")) : t11.removeAttribute("aria-description");
    const c21 = t11;
    "ariaErrorMessageElements" in t11 && (c21.ariaErrorMessageElements = i21 ? [i21] : null);
  }
  /**
   * Form Integration
   * --------------------------------------------------------------------------
   */
  _setValue() {
    if (this.multiple) {
      const e5 = this._selectedFiles.map((t11) => t11.file);
      if (e5.length > 0) {
        const t11 = new FormData();
        e5.forEach((i21) => {
          t11.append(this.name, i21);
        }), this.setFormValue(t11);
      } else
        this.setFormValue(null);
    } else {
      const e5 = this._selectedFiles[0]?.file || null;
      this.setFormValue(e5);
    }
    this._manageRequire();
  }
  // Called to internally set the initial internalElement required flag.
  _manageRequire() {
    const e5 = this.shadowRoot?.querySelector("input");
    if (!e5) return;
    const t11 = this.errorMessage || "Please upload a file.";
    this.required && this._selectedFiles.length == 0 ? this.setValidityFromState({ valueMissing: true }, t11, e5) : this.clearValidity();
  }
  _setValidityMessage(e5 = "") {
    const t11 = this.shadowRoot?.querySelector("input");
    t11 && (this.showError = e5 === (this.errorMessage || "Please upload a file."), this.errorMessage?.trim() && e5 !== "" && (e5 = this.errorMessage), e5 ? this.setValidityFromState({ customError: true }, e5, t11) : this.clearValidity());
  }
  _validate() {
    const e5 = this._selectedFiles.some(
      (s13) => s13.status === "error"
    ), t11 = this.required && this._selectedFiles.length === 0;
    let i21 = "";
    t11 ? i21 = this.errorMessage || "Please upload a file." : e5 && (i21 = "One or more files are invalid."), this._setValidityMessage(i21);
  }
  // This helper function is called to perform the element's native validation.
  checkValidity() {
    const e5 = this.shadowRoot?.querySelector("input");
    return e5 ? e5.checkValidity() : true;
  }
  // Called automatically when the parent form is reset
  formResetCallback() {
    this._selectedFiles = [];
    const e5 = this.shadowRoot?.querySelector(
      ".hidden-file-input"
    );
    e5 && (e5.value = ""), this.setFormValue(null), this.showError = false, this.errorMessage = "", this.clearValidity(), this.requestUpdate();
  }
  _handleInvalid(e5) {
    e5.preventDefault(), this._validate();
    const t11 = this._innerNysButton;
    if (t11) {
      const i21 = this.internals?.form;
      i21 ? Array.from(i21.elements).find(
        (a12) => typeof a12.checkValidity == "function" && !a12.checkValidity()
      ) === this && (t11.focus(), t11.classList.add("active-focus")) : (t11.focus(), t11.classList.add("active-focus"));
    }
  }
  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  // Store the files to be displayed
  async _saveSelectedFiles(e5) {
    if (this._selectedFiles.some(
      (s13) => s13.file.name == e5.name
    ) || !this.multiple && this._selectedFiles.length >= 1) return;
    const i21 = {
      file: e5,
      progress: 0,
      status: "pending"
    };
    return this._selectedFiles.push(i21), await this._processFile(i21), this._setValue(), this._validate(), i21;
  }
  // Read the contents of stored files, this will indicate loading progress of the uploaded files
  async _processFile(e5) {
    e5.status = "processing";
    try {
      if (!await m13(e5.file, this.accept)) {
        e5.status = "error", e5.errorMsg = "File type is invalid.", this.requestUpdate();
        return;
      }
      const i21 = new FileReader();
      i21.onprogress = (s13) => {
        if (s13.lengthComputable) {
          const r13 = Math.round(s13.loaded * 100 / s13.total);
          e5.progress = r13, this.requestUpdate();
        }
      }, i21.onload = () => {
        e5.progress = 100, e5.status = "done", this.requestUpdate();
      }, i21.onerror = () => {
        e5.status = "error", e5.errorMsg = "Failed to load file.", this.requestUpdate();
      }, i21.readAsArrayBuffer(e5.file);
    } catch {
      e5.status = "error", e5.errorMsg = "Error validating file.", this.requestUpdate();
    }
  }
  // Fire nys-blur only when focus leaves the whole component, not when it
  // moves between internal controls (the button, remove buttons, etc.).
  // Uses focusout (bubbles) since blur does not.
  _handleBlur(e5) {
    const t11 = e5.relatedTarget;
    t11 && this.renderRoot.contains(t11) || (this._validate(), this.dispatchEvent(
      new Event("nys-blur", { bubbles: true, composed: true })
    ));
  }
  _dispatchChangeEvent(e5) {
    this.dispatchEvent(
      new CustomEvent("nys-change", {
        detail: {
          id: this.id,
          files: this._selectedFiles,
          changedFiles: e5
        },
        bubbles: true,
        composed: true
      })
    );
  }
  _openFileDialog() {
    this.renderRoot.querySelector(
      ".hidden-file-input"
    )?.click();
  }
  _handlePostFileSelectionFocus() {
    if (this.multiple) {
      const e5 = this._innerNysButton;
      e5 && e5.focus();
    } else
      this._focusFirstFileItemIfSingleMode();
  }
  async _focusFirstFileItemIfSingleMode() {
    if (!this.multiple) {
      await this.updateComplete;
      const t11 = this.renderRoot.querySelector(
        "nys-fileitem"
      )?.shadowRoot?.querySelector(
        ".file-item"
      );
      t11 && (t11.setAttribute("tabindex", "-1"), t11.focus());
    }
  }
  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */
  // Access the selected files & add new files to the internal list via the hidden <input type="file">
  async _handleFileChange(e5) {
    const i21 = e5.target.files, s13 = i21 ? Array.from(i21) : [], r13 = await this._addFiles(s13);
    this.requestUpdate(), r13.length && this._dispatchChangeEvent(r13), this._handlePostFileSelectionFocus();
  }
  _handleFileRemove(e5) {
    const t11 = e5.detail.filename, i21 = this._selectedFiles.find(
      (s13) => s13.file.name === t11
    );
    if (this._selectedFiles = this._selectedFiles.filter(
      (s13) => s13.file.name !== t11
    ), this._selectedFiles.length === 0) {
      const s13 = this.shadowRoot?.querySelector(
        "input"
      );
      s13 && (s13.value = "");
    }
    this._setValue(), this._validate(), this.requestUpdate(), i21 && this._dispatchChangeEvent([i21]);
  }
  _onDragOver(e5) {
    this.disabled || (e5.stopPropagation(), e5.preventDefault(), this._dragActive || (this._dragActive = true, this.requestUpdate()));
  }
  // Mostly used for styling purpose
  _onDragLeave(e5) {
    this.disabled || (e5.stopPropagation(), e5.preventDefault(), e5.currentTarget === e5.target && (this._dragActive = false, this.requestUpdate()));
  }
  async _onDrop(e5) {
    if (this.disabled) return;
    e5.preventDefault(), this._dragActive = false, this.requestUpdate();
    const t11 = e5.dataTransfer?.files;
    if (!t11) return;
    const i21 = Array.from(t11), s13 = this.multiple ? i21 : [i21[0]], r13 = await this._addFiles(s13);
    this.requestUpdate(), r13.length && this._dispatchChangeEvent(r13);
  }
  async _addFiles(e5) {
    return (await Promise.all(
      e5.map((i21) => this._saveSelectedFiles(i21))
    )).filter(
      (i21) => i21 !== void 0
    );
  }
  render() {
    return html`<div
      class="nys-fileinput"
      @nys-fileRemove=${this._handleFileRemove}
      @focusout=${this._handleBlur}
    >
      <nys-label
        id="${this.id}--label"
        label=${this.label}
        description=${this.description}
        flag=${this.required ? "required" : this.optional ? "optional" : ""}
        tooltip=${this.tooltip}
        ?inverted=${this.inverted}
        @nys-label-click=${this._openFileDialog}
      >
        <slot name="description" slot="description">${this.description}</slot>
      </nys-label>

      <input
        id=${this.id + "--native"}
        class="hidden-file-input"
        tabindex="-1"
        type="file"
        name=${this.name}
        accept=${this.accept}
        form=${ifDefined(this.form || void 0)}
        ?multiple=${this.multiple}
        ?required=${this.required}
        ?disabled=${this.disabled || !this.multiple && this._selectedFiles.length > 0}
        aria-labelledby=${ifDefined(
      this.label ? this.id + "--label" : void 0
    )}
        aria-label=${ifDefined(
      !this.label && this.ariaLabel ? this.ariaLabel : void 0
    )}
        aria-disabled="${this.disabled}"
        aria-hidden="true"
        @change=${this._handleFileChange}
        hidden
      />

      ${this.dropzone ? html`<div
            class="nys-fileinput__dropzone
            ${this._dragActive ? "drag-active" : ""}
            ${this._isDropDisabled ? "disabled" : ""}
            ${this.showError && !this._isDropDisabled ? "error" : ""}"
            @click=${this._isDropDisabled ? null : (e5) => {
      e5.target.closest("nys-button") || this._openFileDialog();
    }}
            @dragover=${this._isDropDisabled ? null : this._onDragOver}
            @dragleave=${this._isDropDisabled ? null : this._onDragLeave}
            @drop=${this._isDropDisabled ? null : this._onDrop}
          >
            ${this._dragActive ? html`<p>Drop file to upload</p>` : html` <nys-button
                    id="choose-files-btn-drag"
                    name="file-btn"
                    label=${this.multiple ? "Choose files" : "Choose file"}
                    variant="outline"
                    ?disabled=${this._isDropDisabled}
                    @nys-click="${(e5) => {
      e5.preventDefault(), e5.stopPropagation(), this._openFileDialog();
    }}"
                  ></nys-button>
                  <p
                    id="${this.id}--dropzone-hint"
                    class="nys-fileinput__dropzone-hint"
                  >
                    or drag here
                  </p>`}
          </div>` : html`<nys-button
            id="choose-files-btn"
            name="file-btn"
            label=${this.multiple ? "Choose files" : "Choose file"}
            variant="outline"
            ?disabled=${this.disabled || !this.multiple && this._selectedFiles.length > 0}
            @nys-click=${this._openFileDialog}
          ></nys-button>`}
      ${this.showError ? html`
            <nys-errormessage
              id=${this.id + "--error"}
              ?showError=${this.showError}
              errorMessage=${this.internals?.validationMessage || this.errorMessage}
            ></nys-errormessage>
          ` : null}
      ${this._selectedFiles.length > 0 ? html`
            <ul>
              ${this._selectedFiles.map(
      (e5) => html`<li>
                    <nys-fileitem
                      filename=${e5.file.name}
                      status=${e5.status}
                      progress=${e5.progress}
                      errorMessage=${e5.errorMsg || ""}
                    ></nys-fileitem>
                  </li>`
    )}
            </ul>
          ` : null}
    </div>`;
  }
};
u4.styles = unsafeCSS(b15), u4.shadowRootOptions = __spreadProps(__spreadValues({}, LitElement.shadowRootOptions), {
  delegatesFocus: true
});
var o8 = u4;
l4([
  property({ type: String, reflect: true })
], o8.prototype, "id", 2);
l4([
  property({ type: String, reflect: true })
], o8.prototype, "name", 2);
l4([
  property({ type: String })
], o8.prototype, "label", 2);
l4([
  property({ type: String })
], o8.prototype, "description", 2);
l4([
  property({ type: Boolean })
], o8.prototype, "multiple", 2);
l4([
  property({ type: String, reflect: true })
], o8.prototype, "form", 2);
l4([
  property({ type: String })
], o8.prototype, "tooltip", 2);
l4([
  property({ type: String })
], o8.prototype, "accept", 2);
l4([
  property({ type: Boolean, reflect: true })
], o8.prototype, "disabled", 2);
l4([
  property({ type: Boolean, reflect: true })
], o8.prototype, "required", 2);
l4([
  property({ type: Boolean, reflect: true })
], o8.prototype, "optional", 2);
l4([
  property({ type: Boolean, reflect: true })
], o8.prototype, "showError", 2);
l4([
  property({ type: String })
], o8.prototype, "errorMessage", 2);
l4([
  property({ type: Boolean })
], o8.prototype, "dropzone", 2);
l4([
  property({ type: String, reflect: true })
], o8.prototype, "width", 2);
l4([
  property({ type: Boolean, reflect: true })
], o8.prototype, "inverted", 2);
l4([
  property({ attribute: false })
], o8.prototype, "files", 1);
l4([
  property({ attribute: false })
], o8.prototype, "value", 1);
customElements.get("nys-fileinput") || customElements.define("nys-fileinput", o8);

// ../../nys-globalfooter/dist/nys-globalfooter.js
var u6 = 0;
function x12(s13) {
  return `${s13}-${Date.now()}-${u6++}`;
}
var w15 = (s13) => {
  class o18 extends s13 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = x12(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return o18;
};
var L4 = w15(LitElement);
var k7 = ':host{--_nys-globalfooter-color: var( --nys-color-text, var(--nys-color-neutral-900, #1b1b1b) );--_nys-globalfooter-background-color: var( --nys-color-theme-weaker, var(--nys-color-state-blue-50, #eff6fb) );--_nys-globalfooter-gap: var(--nys-space-300, 24px);--_nys-globalfooter-gap--heading-container: var(--nys-space-150, 12px);--_nys-globalfooter-padding--y: var(--nys-space-400, 32px);--_nys-globalfooter-padding--gutter: var(--nys-gutter-sm, 20px);--_nys-globalfooter-font-size--agency: var( --nys-font-size-agency-xl, var(--nys-font-size-2xl, 22px) );--_nys-globalfooter-font-size--link: var( --nys-font-size-body-md, var(--nys-font-size-md, 16px) );--_nys-globalfooter-line-height--agency: normal;--_nys-globalfooter-font-weight--regular: var(--nys-font-weight-regular, 400);--_nys-globalfooter-font-weight--semibold: var( --nys-font-weight-semibold, 600 );--_nys-globalfooter-max-width--content: var( --nys-globalfooter-max-width--content, 1280px );--_nys-globalfooter-font-family--agency: var( --nys-font-family-agency, "D Sari", Arial, sans-serif );--_nys-globalfooter-column-gap: var(--nys-space-400, 32px);--_nys-globalfooter-row-gap: var(--nys-space-400, 32px);--_nys-globalfooter-line-height--link: var(--nys-font-lineheight-ui-md, 24px);--_nys-globalfooter-letter-spacing: var( --nys-font-letterspacing-ui-md, var(--nys-font-letterspacing-400, .044px) );--_nys-globalfooter-font-family--link: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-globalfooter-text-decoration-thickness: var(--nys-size-2px, 2px);--_nys-globalfooter-background--divider: var(--nys-color-theme, #154973);--_nys-globalfooter-margin--divider: var(--nys-space-50, 4px)}.nys-globalfooter{display:flex;padding:var(--_nys-globalfooter-padding--y) var(--_nys-globalfooter-padding--gutter);justify-content:center;background-color:var(--_nys-globalfooter-background-color);color:var(--_nys-globalfooter-color);width:100%;box-sizing:border-box}.nys-globalfooter .nys-globalfooter__main-container{display:flex;flex-direction:column;gap:var(--_nys-globalfooter-gap);width:100%;max-width:var(--_nys-globalfooter-max-width--content)}.nys-globalfooter .nys-globalfooter__main-container .nys-globalfooter__heading-container{display:flex;flex-direction:column;gap:var(--_nys-globalfooter-gap--heading-container)}.nys-globalfooter .nys-globalfooter__main-container .nys-globalfooter__heading-container .nys-globalfooter__name{text-align:left;margin:0;color:var(--_nys-globalfooter-color);font-family:var(--_nys-globalfooter-font-family--agency);font-size:var(--_nys-globalfooter-font-size--agency);font-style:normal;font-weight:var(--_nys-globalfooter-font-weight--semibold);line-height:var(--_nys-globalfooter-line-height--agency);letter-spacing:normal}.nys-globalfooter .nys-globalfooter__main-container .nys-globalfooter__heading-container .nys-globalfooter__subheading{margin:0}ul{list-style-type:none;padding:0;margin:0}li{margin:0;padding:0}a,span{color:var(--_nys-globalfooter-color);text-decoration:none;font-family:var(--_nys-globalfooter-font-family--link);font-size:var(--_nys-globalfooter-font-size--link);font-style:normal;font-weight:var(--_nys-globalfooter-font-weight--semibold);line-height:var(--_nys-globalfooter-line-height--link);letter-spacing:var(--_nys-globalfooter-letter-spacing)}ul li>span+ul li a{font-weight:var(--_nys-globalfooter-font-weight--regular)}a:hover{text-decoration:underline}a:active{text-decoration-thickness:var(--_nys-globalfooter-text-decoration-thickness)}.nys-globalfooter__content{width:100%}.nys-globalfooter__content ul{display:flex;flex-flow:column wrap;gap:var(--_nys-globalfooter-row-gap) var(--_nys-globalfooter-column-gap)}.nys-globalfooter__content ul li:has(span~ul){flex:1;display:flex;flex-direction:column}.nys-globalfooter__content ul:has(li>span~ul){--_nys-globalfooter-column-gap: var(--nys-space-500, 40px)}.nys-globalfooter__content ul li>span~ul{display:flex;flex-direction:column;gap:var(--nys-space-200, 16px)}.divider{margin-top:var(--_nys-globalfooter-margin--divider);margin-bottom:var(--nys-space-300, 24px)}@media(min-width:768px){.nys-globalfooter__content ul{flex-direction:row}.nys-globalfooter__content ul li:has(span~ul){flex:1 0 205px}:host{--_nys-globalfooter-padding--gutter: var(--nys-gutter-lg, 32px);--_nys-globalfooter-row-gap: var(--nys-space-600, 48px)}}@media(min-width:1280px){:host{--_nys-globalfooter-padding--gutter: var(--nys-gutter-xl, 64px)}}';
var S5 = Object.defineProperty;
var i9 = (s13, o18, l17, r13) => {
  for (var e5 = void 0, n13 = s13.length - 1, a12; n13 >= 0; n13--)
    (a12 = s13[n13]) && (e5 = a12(o18, l17, e5) || e5);
  return e5 && S5(o18, l17, e5), e5;
};
var E7 = "Site";
var d10 = class d11 extends L4 {
  constructor() {
    super(...arguments), this.id = "", this.agencyName = "", this.agencySubheading = "", this.homepageLink = "", this.landmarkLabel = "", this.slotHasContent = true;
  }
  /**
   * Lifecycle Methods
   * --------------------------------------------------------------------------
   */
  // No connectedCallback override is needed here: NysElement's own
  // connectedCallback already assigns an id when one is not provided, and it runs
  // automatically because this class does not override it. The contentinfo landmark
  // intentionally stays on the inner <footer> element (and is given an accessible
  // name from the agency name so multiple footers on a page are distinguishable),
  // so this component keeps defaultRole = null and does not move a role onto the host.
  firstUpdated() {
    this.shadowRoot?.querySelector("slot")?.addEventListener("slotchange", () => this._handleSlotChange()), this._handleSlotChange();
  }
  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  // Gets called when the slot content changes and directly appends the slotted elements into the shadow DOM
  async _handleSlotChange() {
    const o18 = this.shadowRoot?.querySelector("slot");
    if (!o18) return;
    const l17 = o18?.assignedNodes({ flatten: true }).filter((n13) => n13.nodeType === Node.ELEMENT_NODE);
    await Promise.resolve(), this.slotHasContent = l17.length > 0;
    const r13 = this.shadowRoot?.querySelector(
      ".nys-globalfooter__content"
    ), e5 = l17?.some(
      (n13) => n13.tagName === "H4"
    );
    r13 && (r13.classList.toggle("columns", e5), r13.classList.toggle("small", !e5), r13.innerHTML = "", l17.forEach((a12) => {
      if (a12.nodeType === Node.ELEMENT_NODE) {
        const g13 = a12.cloneNode(true);
        ["script", "iframe", "object", "embed", "img"].forEach((h23) => {
          g13.querySelectorAll(h23).forEach((p19) => p19.remove());
        }), r13.appendChild(g13), a12.remove();
      }
    }), r13.querySelectorAll("span").forEach((a12) => {
      const g13 = document.createElement("nys-divider");
      g13.classList.add("divider"), a12.insertAdjacentElement("afterend", g13);
    }));
  }
  /**
   * Id of the heading that names the contentinfo landmark, or undefined when no
   * agency name was given.
   *
   * The documented pairing puts this footer above `nys-unavfooter`, which leaves a
   * page with two `contentinfo` landmarks. Pointing at the visible heading rather
   * than repeating the agency name in an `aria-label` keeps the two in sync and lets
   * the name be translated along with the rest of the page.
   */
  get _contentinfoLabelledBy() {
    if (!this._landmarkLabelOverride)
      return this.agencyName?.trim() ? `${this.id}-name` : void 0;
  }
  /** The author's landmark name, or undefined when they gave none. */
  get _landmarkLabelOverride() {
    return this.landmarkLabel?.trim() || void 0;
  }
  /**
   * Literal name for the contentinfo: the author's override, or the "Site"
   * default when there is no agency heading to reference. Undefined whenever
   * `_contentinfoLabelledBy` has something to point at, so the landmark never
   * carries both.
   */
  get _contentinfoLabel() {
    return this._landmarkLabelOverride ? this._landmarkLabelOverride : this._contentinfoLabelledBy ? void 0 : E7;
  }
  render() {
    const o18 = html`<h2
      id="${this.id}-name"
      class="nys-globalfooter__name"
    >
      ${this.agencyName}
    </h2>`;
    return html`
      <footer
        class="nys-globalfooter"
        aria-labelledby=${ifDefined(this._contentinfoLabelledBy)}
        aria-label=${ifDefined(this._contentinfoLabel)}
      >
        <div class="nys-globalfooter__main-container">
          <div class="nys-globalfooter__heading-container">
            ${this.homepageLink?.trim() ? html`<a href=${this.homepageLink?.trim()}>${o18}</a>` : o18}
            ${this.agencySubheading ? html`<p class="nys-globalfooter__subheading">
                  ${this.agencySubheading}
                </p>` : nothing}
          </div>
          ${this.slotHasContent ? html`<div class="nys-globalfooter__content">
                <slot
                  style="display: hidden"
                  @slotchange="${this._handleSlotChange}"
                ></slot>
              </div>` : ""}
        </div>
      </footer>
    `;
  }
};
d10.styles = unsafeCSS(k7);
var t5 = d10;
i9([
  property({ type: String, reflect: true })
], t5.prototype, "id");
i9([
  property({ type: String })
], t5.prototype, "agencyName");
i9([
  property({ type: String })
], t5.prototype, "agencySubheading");
i9([
  property({ type: String })
], t5.prototype, "homepageLink");
i9([
  property({ type: String })
], t5.prototype, "landmarkLabel");
i9([
  state()
], t5.prototype, "slotHasContent");
customElements.get("nys-globalfooter") || customElements.define("nys-globalfooter", t5);

// ../../nys-globalheader/dist/nys-globalheader.js
var m14 = `<svg xmlns="http://www.w3.org/2000/svg" width="91" height="55" viewBox="0 0 91 55" fill="none">
  <path d="M55.1158 7.50499L58.2905 12.6494V7.5189C58.2905 7.5189 58.6487 7.26356 59.5098 7.26356C60.3708 7.26356 60.7378 7.5189 60.7378 7.5189V16.4327C60.7378 16.4327 60.3942 16.689 59.5215 16.689C58.6487 16.689 58.3295 16.4605 58.3295 16.4605L55.1421 11.3171V16.4337C55.1421 16.4337 54.7848 16.69 53.9111 16.69C53.0374 16.69 52.7065 16.4337 52.7065 16.4337V7.51989C52.7065 7.51989 53.0384 7.26456 53.9248 7.26456C54.8112 7.26456 55.1148 7.50697 55.1148 7.50697L55.1158 7.50499Z" fill="white"/>
  <path d="M67.2209 12.5948H64.9063V14.8709H68.2538C68.2538 14.8709 68.5047 15.1531 68.5047 15.772C68.5047 16.391 68.2538 16.688 68.2538 16.688H62.4589V7.26257H67.9892C67.9892 7.26257 68.2538 7.54572 68.2538 8.17859C68.2538 8.81146 67.9892 9.09362 67.9892 9.09362H64.9063V10.7637H67.2209C67.2209 10.7637 67.4728 11.0598 67.4728 11.6787C67.4728 12.2977 67.2209 12.5948 67.2209 12.5948Z" fill="white"/>
  <path d="M71.4802 16.4327L68.9791 7.5189C68.9791 7.5189 69.3491 7.26356 70.2101 7.26356C71.0711 7.26356 71.4275 7.5189 71.4275 7.5189L72.6839 12.0434C72.7766 12.3802 72.8166 12.6365 72.8557 12.7845C72.8557 12.7428 72.9221 12.3663 73.0011 12.0573L74.0984 7.5189C74.0984 7.5189 74.5211 7.26356 75.1176 7.26356C75.7141 7.26356 76.084 7.5189 76.084 7.5189L77.3004 12.7845C77.3004 12.6623 77.3795 12.3255 77.4586 12.0573L78.756 7.5189C78.7686 7.5189 79.1132 7.26356 79.9596 7.26356C80.806 7.26356 81.1897 7.5189 81.1897 7.5189L78.6496 16.4327C78.6496 16.4327 78.2922 16.6751 77.4859 16.689C76.5468 16.689 76.2158 16.4327 76.2158 16.4327L75.223 12.2987C75.1449 11.9887 75.0902 11.6529 75.0785 11.5844L74.9184 12.2987L73.9266 16.4327C73.9266 16.4327 73.583 16.689 72.7092 16.689C71.8355 16.689 71.4802 16.4327 71.4802 16.4327Z" fill="white"/>
  <path d="M54.3485 19.2195L55.4331 21.1579C55.804 21.8176 56.0022 22.5587 56.0285 22.6521C56.0559 22.5587 56.2404 21.8315 56.624 21.1579L57.735 19.2195C57.735 19.2195 58.0659 18.9771 58.8723 18.9771C59.786 18.9771 60.1697 19.2861 60.1697 19.2861L57.2449 24.4295V28.1453C57.2449 28.1453 56.9013 28.4026 56.0276 28.4026C55.1539 28.4026 54.8239 28.1453 54.8239 28.1453V24.3898L51.8991 19.2871C51.8991 19.2871 52.2965 18.9781 53.2082 18.9781C53.9892 18.9781 54.3465 19.2205 54.3465 19.2205L54.3485 19.2195Z" fill="white"/>
  <path d="M64.6017 28.497C61.4788 28.497 60.117 26.6381 60.117 23.7033C60.117 20.7684 61.4798 18.8827 64.6017 18.8827C67.7237 18.8827 69.0865 20.7674 69.0865 23.7033C69.0865 26.6391 67.711 28.497 64.6017 28.497ZM64.6017 26.6778C65.9235 26.6778 66.6391 25.4667 66.6391 23.7033C66.6391 21.9398 65.9235 20.7138 64.6017 20.7138C63.2799 20.7138 62.5653 21.9398 62.5653 23.7033C62.5653 25.4667 63.2789 26.6778 64.6017 26.6778Z" fill="white"/>
  <path d="M72.844 28.1463C72.844 28.1463 72.4867 28.4036 71.6129 28.4036C70.7392 28.4036 70.4083 28.1463 70.4083 28.1463V19.3546C70.4083 19.3546 71.4011 18.8837 73.2266 18.8837C75.9913 18.8837 77.275 19.9607 77.275 21.8454C77.275 23.7301 75.8722 24.4563 75.7004 24.4712L77.8432 28.0936C77.5796 28.2675 76.8523 28.4026 76.3623 28.4026C75.7267 28.4026 75.225 28.1741 75.225 28.1741L73.6113 25.3068C73.5175 25.1041 73.3858 24.9561 73.1612 24.9561H72.844V28.1463ZM73.5322 20.7148C73.1349 20.7148 72.844 20.7952 72.844 20.7952V23.138H73.5049C74.4694 23.138 74.8413 22.4514 74.8413 21.9269C74.8413 21.2403 74.3786 20.7148 73.5322 20.7148Z" fill="white"/>
  <path d="M87.211 28.0787C87.211 28.0787 86.5901 28.4026 85.5836 28.4026C84.7236 28.4026 84.3663 28.1741 84.3663 28.1741L81.2317 23.8384V28.1463C81.2317 28.1463 80.9007 28.4036 80.027 28.4036C79.1533 28.4036 78.797 28.1463 78.797 28.1463V19.2344C78.797 19.2344 79.1533 18.9781 80.027 18.9781C80.9007 18.9781 81.2317 19.2344 81.2317 19.2344V23.4221L84.2618 19.2205C84.2618 19.2205 84.6182 18.9781 85.4782 18.9781C86.4701 18.9781 86.8684 19.3139 86.8684 19.3139L83.9045 23.4221L87.212 28.0797L87.211 28.0787Z" fill="white"/>
  <path d="M58.9806 31.3374C59.1515 32.1988 58.7014 32.8853 58.1987 33.0602C57.7096 32.7244 56.9296 32.4273 56.1096 32.4273C55.2895 32.4273 54.8122 32.7502 54.8122 33.2082C54.8122 33.6394 55.1958 33.7874 56.214 34.1252L57.4841 34.5415C58.8479 34.9985 59.6933 35.7 59.6933 37.1803C59.6933 38.8911 58.5823 40.2105 55.8831 40.2105C53.9912 40.2105 52.8256 39.5637 52.4029 39.1335C52.2711 38.5007 52.6137 37.7059 53.1057 37.4505C53.5284 37.7744 54.7848 38.3934 56.0676 38.3934C56.8359 38.3934 57.2596 38.1112 57.2596 37.5986C57.2596 37.2359 57.034 37.0064 56.5049 36.8306L54.3758 36.1719C53.2365 35.8073 52.3775 34.9737 52.3775 33.6126C52.3775 31.6732 53.6729 30.5973 56.0676 30.5973C57.5895 30.5973 58.4779 31.0145 58.9806 31.3374Z" fill="white"/>
  <path d="M60.3542 32.5227C60.3542 32.5227 60.1023 32.2534 60.1023 31.6067C60.1023 30.9599 60.3542 30.6906 60.3542 30.6906H67.5382C67.5382 30.6906 67.7901 30.9738 67.7901 31.6067C67.7901 32.2395 67.5382 32.5227 67.5382 32.5227H65.1562V39.8608C65.1562 39.8608 64.8136 40.1161 63.9525 40.1161C63.0915 40.1161 62.7088 39.8608 62.7088 39.8608V32.5227H60.3542Z" fill="white"/>
  <path d="M72.7502 30.9341L76.3232 39.8201C76.3232 39.8201 75.9659 40.1171 75.0658 40.1171C74.2321 40.1171 73.9032 39.8747 73.9032 39.8747L73.254 38.3258H69.8538L69.2446 39.8747C69.2446 39.8747 68.901 40.1171 68.081 40.1171C67.1819 40.1171 66.7972 39.8201 66.7972 39.8201L70.3702 30.9341C70.3702 30.9341 70.7002 30.6916 71.5592 30.6916C72.4183 30.6916 72.7502 30.9341 72.7502 30.9341ZM70.5674 36.5216H72.5394L71.8775 34.9051C71.7457 34.5822 71.5729 33.9226 71.5583 33.855C71.5329 33.9226 71.3337 34.5822 71.2156 34.9051L70.5674 36.5216Z" fill="white"/>
  <path d="M75.5949 32.5227C75.5949 32.5227 75.3431 32.2534 75.3431 31.6067C75.3431 30.9599 75.5949 30.6906 75.5949 30.6906H82.779C82.779 30.6906 83.0298 30.9738 83.0298 31.6067C83.0298 32.2395 82.779 32.5227 82.779 32.5227H80.397V39.8608C80.397 39.8608 80.0543 40.1161 79.1933 40.1161C78.3323 40.1161 77.9496 39.8608 77.9496 39.8608V32.5227H75.5949Z" fill="white"/>
  <path d="M88.9047 36.0228H86.5891V38.299H89.9356C89.9356 38.299 90.1875 38.5821 90.1875 39.2001C90.1875 39.8181 89.9356 40.1161 89.9356 40.1161H84.1408V30.6897H89.6711C89.6711 30.6897 89.9356 30.9728 89.9356 31.6057C89.9356 32.2385 89.6711 32.5217 89.6711 32.5217H86.5882V34.1908H88.9038C88.9038 34.1908 89.1547 34.4879 89.1547 35.1078C89.1547 35.7278 88.9038 36.0219 88.9038 36.0219L88.9047 36.0228Z" fill="white"/>
  <path d="M51.7107 54.9999C51.577 54.9999 51.4335 54.974 51.2939 54.8965C51.085 54.7803 50.9395 54.5876 50.8858 54.3551C50.8233 54.0868 50.8936 53.7868 51.082 53.5116L51.1426 53.4202C51.2041 53.3268 51.2685 53.2354 51.3407 53.1519C51.4218 53.0595 51.5047 52.995 51.5741 52.9493C51.5243 52.6691 51.5418 52.4267 51.5682 52.2061C51.5877 52.0233 51.6346 51.8683 51.6726 51.7451C51.6892 51.6925 51.7058 51.6388 51.7185 51.5812C51.8201 51.145 51.8855 50.7397 51.9206 50.3453C51.9528 49.9916 51.947 49.9846 51.8864 49.9061C51.7 49.6707 51.3847 49.5018 51.0498 49.3229C50.8878 49.2365 50.7286 49.1491 50.5754 49.0557C49.607 48.4536 48.6376 47.8505 47.6701 47.2465L47.3294 47.0339C47.2513 46.9862 47.1147 46.9156 46.9516 46.8282C45.8817 46.2659 45.172 45.8526 45.0539 45.2595C45.0363 45.173 44.9465 44.9644 44.884 44.864C44.8411 44.8611 44.7307 44.8521 44.6546 44.8471C44.3032 44.8183 43.7711 44.7726 43.3484 44.3196C43.2635 44.2272 43.1786 44.1408 43.1005 44.0583C42.5098 43.4443 42.0003 42.9148 41.9329 41.5993C41.9241 41.4275 41.9251 41.2506 41.928 41.0728C41.9339 40.5283 41.927 40.1836 41.7103 39.962C41.6078 39.8567 41.435 39.7862 41.2349 39.7037C40.9889 39.6034 40.7097 39.4881 40.45 39.2686C40.37 39.2 40.2792 39.1007 40.1776 38.9854C40.0712 38.8602 39.9082 38.6724 39.7969 38.6337C38.974 38.3436 37.986 38.3178 36.96 38.3178L3.07245 38.2909C2.85964 38.2909 2.66927 38.3138 2.48477 38.3347C2.07378 38.3823 1.60812 38.437 1.2313 38.0962C0.866192 37.7664 0.815429 37.2607 0.814452 36.8076L0.8125 34.3993C0.8125 34.2722 0.847644 34.147 0.913051 34.0387C1.22544 33.529 1.83265 33.2558 2.3686 33.0144C2.56872 32.924 2.77666 32.8316 2.88795 32.7571C3.17593 32.5623 3.43561 32.302 3.7109 32.0248C3.91688 31.8182 4.13068 31.6046 4.36887 31.4059C4.69786 31.1317 5.07078 30.931 5.43296 30.7372C5.74535 30.5703 6.03821 30.4124 6.24127 30.2395C6.38575 30.1173 6.49216 29.9146 6.61906 29.6792C6.75476 29.4238 6.90998 29.1337 7.15208 28.8804C7.41273 28.6081 7.7427 28.4194 8.03263 28.2535C8.69744 27.871 8.68182 27.8322 8.57736 27.5769C8.52855 27.4577 8.48072 27.3553 8.43972 27.2639C8.24447 26.8357 8.07754 26.4681 8.19078 25.7051C8.2025 25.6306 8.21616 25.5521 8.22983 25.4706C8.25619 25.3325 8.30305 25.0772 8.27571 25.0037C8.27571 25.0037 8.26204 24.9927 8.23471 24.9778C8.21128 24.9659 8.12928 24.9669 8.06875 24.9679C7.87448 24.9659 7.51914 24.9768 7.2497 24.6689C6.98124 24.3629 6.99686 23.9555 7.03982 23.6356C7.08179 23.3127 7.06032 23.1051 7.03982 22.9223C6.95684 22.1453 7.21358 21.7817 8.10097 21.424C10.7524 20.351 12.901 19.9884 14.8613 20.2805C14.9775 20.2974 15.1356 20.2656 15.3182 20.2269C15.5944 20.1702 15.9351 20.1017 16.312 20.1752L18.3952 20.5766C19.2475 20.7415 19.6653 20.9054 20.3047 21.4995C20.6327 21.8046 20.7655 21.7718 21.3327 21.5661C21.6168 21.4638 21.9399 21.3485 22.3323 21.2949C22.9727 21.2084 23.5731 21.2661 24.153 21.3227C24.4136 21.3475 24.6762 21.3734 24.9408 21.3843C25.2356 21.3952 25.6085 21.2561 25.9717 21.121C26.1318 21.0614 26.2889 21.0028 26.4412 20.9541C26.78 20.8468 27.0973 20.7991 27.4038 20.7514C27.5551 20.7266 27.7064 20.7037 27.8607 20.6729C27.8714 20.6531 27.8821 20.6332 27.8939 20.6113C27.9417 20.5249 27.9944 20.4345 28.0598 20.3411C28.3419 19.9497 28.7471 19.7003 29.0722 19.4966L29.2078 19.4122C29.5564 19.1916 29.8629 18.9879 30.105 18.7386C30.5423 18.2796 31.1232 18.3114 31.5108 18.3312C31.6455 18.3392 31.8495 18.3481 31.91 18.3223C32.1678 18.207 31.9413 17.3993 31.8065 16.9165C31.7119 16.5777 31.6299 16.2846 31.6133 16.0183C31.5664 15.2642 31.9764 14.7317 32.3064 14.3045C32.5651 13.9687 32.7213 13.7481 32.7164 13.5355C32.7164 13.4948 32.7027 13.4382 32.6851 13.3845C32.4587 13.4948 32.0955 13.6369 31.6796 13.4421C31.0129 13.1302 30.6468 12.0264 30.8508 11.3985C31.0197 10.8779 31.54 10.5421 31.9198 10.2957L32.0565 10.2053C32.3806 9.98471 32.7242 9.79792 33.0542 9.6181C33.5159 9.36873 33.9513 9.13227 34.2949 8.82726C34.4404 8.69711 34.5761 8.56994 34.7089 8.44376C35.0076 8.1626 35.3161 7.8715 35.6792 7.61319C35.7056 7.5188 35.728 7.34096 35.7437 7.22571C35.7729 7.00714 35.8022 6.78062 35.8803 6.5849C36.2513 5.64304 37.1592 4.90884 37.9597 4.25908C38.2252 4.04448 38.4771 3.84081 38.6743 3.65602C38.7992 3.53878 38.9222 3.42055 39.0452 3.30332C39.6388 2.73701 40.2509 2.15084 40.9967 1.68289C41.601 1.30536 42.3898 0.833439 43.1249 0.552274C44.0972 0.1807 44.5579 0.208518 45.4766 0.262168L45.6474 0.27111C47.3607 0.371455 49.1384 0.32476 50.8575 0.281045C51.7205 0.258194 52.5796 0.235343 53.4347 0.230376C53.6651 0.230376 54.0156 0.185667 54.3836 0.138972C55.6078 -0.0140291 56.994 -0.188888 57.7818 0.503592C58.1118 0.792705 58.2924 1.19806 58.3031 1.67594C58.311 2.05248 58.1567 2.33464 58.0435 2.54129C58.0064 2.60686 57.9527 2.7082 57.9458 2.74297C57.9488 2.73205 57.9849 2.78768 58.0103 2.82742C58.1362 3.01718 58.3686 3.37088 58.2748 3.89843C58.2397 4.10111 58.1811 4.3167 58.1216 4.53528C58.0464 4.81147 57.9693 5.09761 57.9624 5.31419C57.9498 5.69073 57.6335 5.99376 57.2703 5.97289C56.9013 5.95998 56.6104 5.64603 56.6231 5.26849C56.6367 4.89195 56.7392 4.50944 56.831 4.17264C56.8788 3.9948 56.9276 3.82094 56.9569 3.65502C56.9481 3.65502 56.9218 3.62323 56.8993 3.58746C56.791 3.42254 56.6065 3.14535 56.6065 2.73701C56.6065 2.36345 56.7607 2.08328 56.873 1.87862C56.9072 1.81702 56.9589 1.72462 56.9657 1.69084C56.9608 1.58354 56.9267 1.55274 56.9072 1.53685C56.5694 1.23979 55.2544 1.40372 54.5496 1.49313C54.1386 1.5438 53.752 1.59348 53.4435 1.59547C52.5971 1.60043 51.7439 1.62229 50.8907 1.64315C49.1442 1.68886 47.3382 1.73654 45.5722 1.63421L45.3985 1.62328C44.5345 1.57162 44.3022 1.55871 43.5964 1.82894C42.9618 2.07235 42.2101 2.5244 41.7006 2.84431C41.0699 3.23973 40.533 3.75338 39.9648 4.29683C39.8379 4.41804 39.712 4.53925 39.5831 4.65947C39.3479 4.87804 39.0794 5.09661 38.7953 5.32611C38.1237 5.87056 37.3642 6.48555 37.1231 7.09457C37.1065 7.14425 37.085 7.30221 37.0713 7.40753C37.0147 7.84666 36.9424 8.3931 36.5041 8.69016C36.1927 8.90277 35.9145 9.16704 35.6187 9.44523C35.4771 9.57935 35.3317 9.71546 35.1774 9.85257C34.7186 10.2629 34.1924 10.548 33.6838 10.8222C33.3675 10.9931 33.0698 11.1541 32.8033 11.3369C32.7554 11.3707 32.6978 11.4064 32.6373 11.4462C32.5114 11.5276 32.2332 11.7065 32.1346 11.8217C32.1424 11.8992 32.1726 12.0115 32.2117 12.1009C32.3757 12.0214 32.6041 11.924 32.8804 11.9459C33.6633 12.0135 34.0401 12.8937 34.0558 13.4988C34.0743 14.2191 33.677 14.7337 33.3587 15.145C33.0971 15.4868 32.9351 15.7074 32.9487 15.9319C32.9565 16.0511 33.0288 16.3114 33.0932 16.5419C33.3314 17.3933 33.7746 18.978 32.4479 19.5701C32.0965 19.7281 31.7314 19.7082 31.4375 19.6933C31.3126 19.6864 31.1046 19.6764 31.047 19.7023C30.7171 20.051 30.3227 20.3113 29.9166 20.5706L29.7692 20.663C29.5212 20.816 29.2654 20.976 29.1405 21.1488C29.1083 21.1935 29.0819 21.2412 29.0585 21.2859C28.9345 21.5085 28.7256 21.884 28.174 21.9993C27.9827 22.04 27.7943 22.0708 27.6059 22.0996C27.3364 22.1414 27.0807 22.1811 26.8386 22.2566C26.7087 22.2993 26.5711 22.35 26.4334 22.4017C25.9697 22.5745 25.4435 22.7732 24.8871 22.7474C24.5981 22.7355 24.3131 22.7087 24.027 22.6808C23.4989 22.6282 22.9981 22.5805 22.511 22.6481C22.2572 22.6828 22.0258 22.7653 21.7817 22.8537C21.1716 23.0733 20.3369 23.3733 19.4046 22.508C18.9927 22.1265 18.8267 22.049 18.1473 21.9178L16.065 21.5164C15.942 21.4936 15.775 21.5264 15.5818 21.5651C15.3289 21.6168 15.0136 21.6784 14.6719 21.6297C12.9508 21.3724 11.0218 21.7112 8.59689 22.6928C8.49829 22.7325 8.42703 22.7643 8.37431 22.7891C8.39579 22.9779 8.42312 23.2491 8.39091 23.6217C8.53343 23.6416 8.69353 23.6843 8.86047 23.7737C9.81228 24.2834 9.63461 25.256 9.5487 25.724C9.53601 25.7876 9.52528 25.8511 9.51551 25.9127C9.4628 26.2694 9.49501 26.3429 9.65511 26.6917C9.70392 26.798 9.75664 26.9162 9.81326 27.0543C10.3941 28.4681 9.28415 29.1039 8.68865 29.4447C8.46705 29.5719 8.23764 29.701 8.11268 29.8331C7.99944 29.9524 7.89987 30.1372 7.79541 30.3329C7.62945 30.6448 7.44104 30.9975 7.10522 31.2847C6.79088 31.5529 6.41894 31.7536 6.05871 31.9454C5.74144 32.1153 5.44077 32.2762 5.21623 32.464C5.02782 32.6219 4.84527 32.8048 4.65295 32.9985C4.34252 33.3085 4.02524 33.6294 3.62499 33.8976C3.41901 34.0347 3.17203 34.147 2.9104 34.2652C2.69661 34.3606 2.33443 34.5225 2.14992 34.6626L2.15383 36.8096C2.15383 36.8881 2.15578 36.9527 2.15871 37.0023C2.21533 36.9974 2.27586 36.9904 2.32662 36.9835C2.5287 36.9606 2.77959 36.9308 3.06952 36.9308L36.9581 36.9566C38.0573 36.9566 39.2141 36.9884 40.2304 37.3471C40.6755 37.5021 40.9801 37.8538 41.1812 38.0853C41.2281 38.1399 41.2681 38.1896 41.3052 38.2234C41.4018 38.3048 41.5551 38.3674 41.7328 38.441C42.0129 38.5562 42.3615 38.7003 42.6572 39.0043C43.2811 39.6411 43.2713 40.4469 43.2645 41.0927C43.2606 41.2417 43.2606 41.3897 43.2664 41.5328C43.3084 42.3326 43.5261 42.5581 44.0532 43.1055C44.1372 43.1929 44.2251 43.2853 44.3188 43.3847C44.3842 43.4542 44.5287 43.4701 44.761 43.491C45.0412 43.5138 45.3897 43.5417 45.6953 43.7751C46.0291 44.0275 46.2546 44.5888 46.3376 44.8809C46.5455 45.0846 47.2777 45.4711 47.5647 45.6211C47.7639 45.7264 47.9298 45.8158 48.0265 45.8754L48.3672 46.088C49.3346 46.6891 50.3011 47.2922 51.2705 47.8943C51.3993 47.9727 51.533 48.0463 51.6707 48.1188C52.0924 48.3443 52.5698 48.6006 52.9291 49.0567C53.3215 49.5544 53.2942 50.0045 53.259 50.4029C53.3156 50.2936 53.3781 50.1893 53.4513 50.0879C53.5841 49.8982 53.7393 49.7541 53.877 49.626C54.0136 49.4998 54.1073 49.4104 54.1396 49.3388C54.1132 49.2772 54.0527 49.1739 54.0117 49.1034C53.8487 48.8232 53.6271 48.4387 53.7315 47.9857C53.7725 47.8108 53.8789 47.6588 54.0283 47.5634C54.0849 47.5276 54.205 47.4591 54.3631 47.3717C54.5818 47.2495 55.1373 46.9405 55.475 46.71C54.9723 45.5913 55.1392 44.2163 55.2886 42.9843C55.3345 42.6038 55.3784 42.2451 55.3989 41.9222C55.4204 41.5467 55.7337 41.2606 56.1076 41.2834C56.4776 41.3063 56.7588 41.6301 56.7353 42.0057C56.7148 42.3693 56.667 42.7498 56.6182 43.1522C56.4776 44.3166 56.3165 45.637 56.833 46.3911C56.954 46.5669 56.994 46.7895 56.9452 47.0021C56.8417 47.4502 56.3898 47.7879 55.1958 48.4606C55.352 48.7308 55.5395 49.0904 55.4731 49.5167C55.4623 49.5812 55.4487 49.6428 55.4321 49.7015C55.766 49.5793 56.1154 49.464 56.4845 49.3577C57.8775 48.9543 59.3409 48.7745 61.225 48.7745C62.0587 48.7745 62.8006 48.5053 63.5874 48.2211C64.2103 47.9946 64.8546 47.7621 65.576 47.6508C66.1852 47.5555 66.5005 47.7562 66.7728 47.9688C66.8636 48.0403 66.93 48.09 67.0442 48.1357C67.3625 48.2619 67.7325 48.2211 68.1601 48.1754C68.5925 48.1277 69.0836 48.0731 69.5844 48.2042C69.8821 48.2837 70.09 48.5579 70.0861 48.8709C70.0744 50.0571 68.5076 50.5459 67.7549 50.7814L67.0384 51.0099C66.4985 51.1848 65.9567 51.3586 65.41 51.5176C65.1631 51.5881 64.918 51.6587 64.672 51.7223C64.3889 51.7948 64.099 51.9597 63.7944 52.1316C63.481 52.3094 63.1579 52.4922 62.786 52.6174C62.1426 52.83 61.4837 52.9413 60.6471 52.9761C60.4069 52.987 60.1746 53.0943 59.9295 53.2056C59.5674 53.3735 59.1154 53.5801 58.6107 53.4132C58.3949 53.3864 57.5534 53.6775 57.1502 53.8196C56.832 53.9289 56.5577 54.0242 56.3419 54.0759C55.598 54.2528 54.8415 54.3918 54.1103 54.527L53.5968 54.6223C53.1516 54.7058 52.7035 54.7922 52.2613 54.8926L52.2076 54.9085C52.0797 54.9482 51.9021 55.0038 51.7078 55.0038L51.7107 54.9999ZM53.0735 51.6746C53.0569 51.7471 53.0403 51.8196 53.0237 51.8941C53.0032 51.9806 52.9788 52.064 52.9544 52.1455C52.9281 52.2359 52.9066 52.3055 52.8988 52.3651C52.8793 52.5379 52.8773 52.6313 52.8978 52.7247C52.9495 52.9791 52.9388 53.1907 52.8949 53.3645C53.0482 53.3347 53.2024 53.3049 53.3566 53.2751L53.875 53.1808C54.5896 53.0486 55.3296 52.9125 56.0412 52.7436C56.1906 52.7078 56.4483 52.6194 56.7217 52.525C57.7721 52.1604 58.4994 51.9359 59.0295 52.1127C59.0646 52.1058 59.2559 52.0173 59.3828 51.9597C59.7001 51.8137 60.0945 51.6328 60.5924 51.611C61.3021 51.5812 61.8498 51.4908 62.372 51.3169C62.622 51.2345 62.8748 51.0914 63.1442 50.9374C63.5123 50.7298 63.892 50.5142 64.3469 50.3969C64.5793 50.3373 64.8136 50.2707 65.0459 50.2042C65.5789 50.0482 66.11 49.8773 66.6362 49.7064L67.1253 49.5514C66.9388 49.5246 66.7504 49.4779 66.56 49.4014C66.2672 49.2862 66.0836 49.1411 65.9616 49.0457C65.9313 49.0229 65.906 48.999 65.8757 48.9812C65.8737 48.9851 65.8405 48.9851 65.7781 48.9941C65.1845 49.0855 64.6281 49.2862 64.0394 49.4998C63.1794 49.8107 62.293 50.1326 61.2279 50.1326C59.4717 50.1326 58.1235 50.2966 56.8535 50.6642C55.7142 50.992 54.7868 51.3984 54.0166 51.9031C53.7901 52.0521 53.5001 52.0481 53.2776 51.8951C53.1917 51.8365 53.1214 51.76 53.0735 51.6716V51.6746Z" fill="white"/>
  <path d="M67.6348 51.8019C67.6348 51.8019 67.6173 51.782 67.6173 51.7303C67.6173 51.6787 67.6348 51.6588 67.6348 51.6588H68.5564C68.5564 51.6588 68.5749 51.6806 68.5749 51.7303C68.5749 51.78 68.5564 51.8019 68.5564 51.8019H68.1932V52.9205C68.1932 52.9205 68.1659 52.9404 68.0976 52.9404C68.0292 52.9404 67.998 52.9205 67.998 52.9205V51.8019H67.6348Z" fill="white"/>
  <path d="M69.4282 52.8659C69.4135 52.8748 69.3891 52.8858 69.3471 52.8858C69.3178 52.8858 69.2837 52.8798 69.27 52.8659L68.9889 52.1476C68.9723 52.1088 68.9459 52.0323 68.944 52.0214C68.944 52.0264 68.9371 52.1277 68.9332 52.1565L68.8815 52.9205C68.8815 52.9205 68.8561 52.9404 68.7858 52.9404C68.7155 52.9404 68.6862 52.9205 68.6862 52.9205L68.7839 51.6787C68.7839 51.6787 68.8112 51.6588 68.8776 51.6588C68.9518 51.6588 68.9781 51.6787 68.9781 51.6787L69.3042 52.5162L69.3471 52.6533C69.3481 52.6473 69.3774 52.5559 69.392 52.5162L69.7181 51.6787C69.7181 51.6787 69.7464 51.6588 69.8206 51.6588C69.886 51.6588 69.9124 51.6787 69.9124 51.6787L70.01 52.9205C70.01 52.9205 69.9807 52.9404 69.9104 52.9404C69.8401 52.9404 69.8167 52.9205 69.8167 52.9205L69.763 52.1546L69.7523 52.0194C69.7523 52.0194 69.722 52.1148 69.7093 52.1456L69.4282 52.8659Z" fill="white"/>
</svg>`;
var f10 = 0;
function v12(r13) {
  return `${r13}-${Date.now()}-${f10++}`;
}
var L5 = (r13) => {
  class e5 extends r13 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = v12(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return e5;
};
var x13 = L5(LitElement);
var k8 = ':host{--_nys-globalheader-color: var( --nys-color-text-reverse, var(--nys-color-white, #ffffff) );--_nys-globalheader-link-color: var( --nys-color-link-reverse-neutral, var(--nys-color-white, #ffffff) );--_nys-globalheader-background-color: var( --nys-color-theme, var(--nys-color-state-blue-700, #154973) );--_nys-globalheader-gap: var(--nys-space-150, 12px);--_nys-globalheader-padding: var(--nys-space-250, 20px) var(--nys-space-250, 20px) var(--nys-space-200, 16px);--_nys-globalheader-font-family--menu: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-globalheader-line-height: normal;--_nys-globalheader-letter-spacing: normal;--_nys-globalheader-font-weight: var(--nys-font-weight-semibold, 600);--_nys-globalheader-max-width--content: var( --nys-globalheader-max-width--content, 1280px );--_nys-globalheader-gap--text: var(--nys-space-100, 8px);--_nys-globalheader-font-size--heading: var( --nys-font-size-agency-xl, var(--nys-font-size-2xl, 22px) );--_nys-globalheader-font-size--subheading: var( --nys-font-size-agency-md, var(--nys-font-size-md, 16px) );--_nys-globalheader-font-family--headings: var( --nys-font-family-agency, "D Sari", Arial, sans-serif );--_nys-globalheader-line-height--menu: var(--nys-font-lineheight-ui-md, 24px);--_nys-globalheader-letter-spacing--menu: var( --nys-font-letterspacing-ui-md, var(--nys-font-letterspacing-400, .044px) );--_nys-globalheader-text-decoration-thickness--menu: var(--nys-size-2px, 2px);--_nys-globalheader-link-padding: var(--nys-space-300, 24px) var(--nys-space-200, 16px);--_nys-globalheader-font-size--menu-btn: var(--nys-font-size-ui-xs, 12px);--_nys-globalheader-line-height--menu-btn: var( --nys-font-lineheight-ui-xs, 20px );--_nys-globalheader-letter-spacing--menu-btn: var( --nys-font-letterspacing-ui-xs, .057px );--_nys-globalheader-border-color--menu: var(--nys-color-theme-mid, #457aa5);--_nys-globalheader-background-color--menu--hover: var( --nys-color-theme-strong, #0e324f );--_nys-globalheader-background-color--menu--active: var( --nys-color-theme-stronger, #081b2b )}ul{list-style-type:none;padding:0;margin:0}li{display:block;margin:0;padding:0;box-sizing:border-box}a{color:var(--_nys-globalheader-color);text-decoration:none;font-family:var(--_nys-globalheader-font-family--menu);font-style:normal;font-weight:400;line-height:var(--_nys-globalheader-line-height--menu);letter-spacing:var(--_nys-globalheader-letter-spacing--menu)}::slotted([slot=user-actions]){display:flex;align-items:center;margin-inline-start:auto;--_nys-button-outline-color: var( --nys-color-ink-reverse, var(--nys-color-white, #ffffff) )}.nys-globalheader{display:flex;justify-content:center;padding:var(--_nys-globalheader-padding);background-color:var(--_nys-globalheader-background-color);color:var(--_nys-globalheader-color);width:100%;min-height:76px;box-sizing:border-box}a#nys-globalheader__logolink{outline-offset:var(--nys-space-2px, 2px);outline-color:var(--nys-color-ink-reverse, #ffffff);margin:auto 0}.nys-globalheader__logo svg{vertical-align:top;width:auto}.nys-globalheader__main-container{display:flex;gap:var(--_nys-globalheader-gap);max-width:var(--_nys-globalheader-max-width--content);width:100%}@media(min-width:1024px){.nys-globalheader__main-container{align-items:center}}.nys-globalheader__name-container{display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:var(--_nys-globalheader-gap--text)}.nys-globalheader__name{margin:0;color:var(--_nys-globalheader-color);font-family:var(--_nys-globalheader-font-family--headings);font-size:var(--_nys-globalheader-font-size--heading);font-style:normal;font-weight:var(--_nys-globalheader-font-weight);line-height:var(--_nys-globalheader-line-height);letter-spacing:var(--_nys-globalheader-letter-spacing);overflow-wrap:break-word}.nys-globalheader__agencyName{font-size:var(--_nys-globalheader-font-size--subheading)}.nys-globalheader__agencyName.main{font-size:var(--_nys-globalheader-font-size--heading)}.nys-globalheader__content{display:none;font-family:var(--_nys-globalheader-font-family--menu)}.nys-globalheader__content ul{display:flex;flex-flow:column wrap;align-items:center}.nys-globalheader__content ul a:hover{text-decoration:underline;text-decoration-style:solid;text-decoration-skip-ink:auto;text-decoration-thickness:7%;text-underline-offset:auto;text-underline-position:from-font}.nys-globalheader__content ul a:active{text-decoration-thickness:var(--_nys-globalheader-text-decoration-thickness--menu)}.nys-globalheader__content li.active a,.nys-globalheader__content-mobile li.active a{font-weight:700}.nys-globalheader__content li.active{border-bottom:8px solid var(--nys-color-theme-weak, #cddde9)}.nys-globalheader__content li.active a{margin-bottom:calc(-1 * var(--nys-space-100, 8px))}.nys-globalheader__content-mobile li.active a{border-left:8px solid var(--nys-color-theme-weak, #cddde9);border-bottom:1px solid var(--_nys-globalheader-border-color--menu)}.nys-globalheader__content ul li.active a:hover{text-decoration:none}.nys-globalheader__content-mobile{position:absolute;z-index:10;display:flex;flex-direction:column;justify-content:center;background-color:var(--_nys-globalheader-background-color);width:fit-content}.nys-globalheader__content-mobile.close{display:none}.nys-globalheader__content-mobile ul{display:flex;flex-direction:column}.nys-globalheader__content-mobile ul li:first-child a{border-top:1px solid var(--_nys-globalheader-color)}.nys-globalheader__content-mobile ul li a{display:flex;padding:24px;align-items:center;gap:8px;align-self:stretch;border-bottom:1px solid var(--_nys-globalheader-border-color--menu);background-color:var(--_nys-globalheader-background-color)}.nys-globalheader__content-mobile ul li a:hover{background-color:var(--_nys-globalheader-background-color--menu--hover)}.nys-globalheader__content-mobile ul li a:active{background-color:var(--_nys-globalheader-background-color--menu--active)}.nys-globalheader__name-container-link{display:flex;flex-direction:column;justify-content:center}.nys-globalheader__button-container{display:flex;justify-content:center;align-items:center}.nys-globalheader__mobile-menu-button{flex-direction:column;gap:3px;width:50px;height:50px;background-color:var(--_nys-globalheader-background-color);border:none;cursor:pointer;display:flex;justify-content:center;align-items:center;padding:0;color:var(--_nys-globalheader-color)}.nys-globalheader__mobile-menu-button-text{font-size:var(--_nys-globalheader-font-size--menu-btn);line-height:var(--_nys-globalheader-line-height--menu-btn);letter-spacing:var(--_nys-globalheader-letter-spacing--menu-btn)}@media(min-width:768px){:host{--_nys-globalheader-padding: var(--nys-space-250, 20px) var(--nys-size-400, 32px) var(--nys-size-200, 16px)}}@media(min-width:1024px){.nys-globalheader__content{display:flex}.nys-globalheader__content ul{flex-direction:row}.nys-globalheader__content-mobile,.nys-globalheader__button-container{display:none}li{display:flex;align-items:center;padding:var(--_nys-globalheader-link-padding)}:host{--_nys-globalheader-gap: var(--nys-space-500, 40px);--_nys-globalheader-padding: var(--nys-space-50, 4px) var(--nys-size-400, 32px) 0}}@media(min-width:1280px){:host{--_nys-globalheader-padding: var(--nys-space-50, 4px) var(--nys-space-800, 64px) 0}}';
var M4 = Object.defineProperty;
var s4 = (r13, e5, n13, o18) => {
  for (var t11 = void 0, a12 = r13.length - 1, l17; a12 >= 0; a12--)
    (l17 = r13[a12]) && (t11 = l17(e5, n13, t11) || t11);
  return t11 && M4(e5, n13, t11), t11;
};
var u7 = "[aria-current]:not([aria-current='false'])";
var y9 = (r13) => r13.matches(u7);
var w16 = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex^="-"])'
].join(", ");
var E8 = ".nys-globalheader__mobile-menu-button";
var S6 = "(min-width: 1024px)";
var N2 = "Site";
var $8 = (r13) => r13.getClientRects().length > 0;
var h10 = class h11 extends x13 {
  constructor() {
    super(...arguments), this.id = "", this.appName = "", this.agencyName = "", this.homepageLink = "", this.nysLogo = false, this.landmarkLabel = "", this._isMobileMenuOpen = false, this._hasLinkContent = false, this._authorSetsCurrent = false, this._desktopMedia = window.matchMedia(S6), this._boundClickOutside = (e5) => {
      if (!this._isMobileMenuOpen) return;
      e5.composedPath().includes(this) || this._closeMobileMenu();
    }, this._boundBreakpointChange = (e5) => {
      e5.matches && this._closeMobileMenu();
    }, this._boundKeyDown = (e5) => {
      if (this._isMobileMenuOpen) {
        if (e5.key === "Escape") {
          e5.preventDefault(), this._closeMobileMenu(true);
          return;
        }
        e5.key === "Tab" && this._trapMobileMenuFocus(e5);
      }
    };
  }
  /**
   * Lifecycle Methods
   * --------------------------------------------------------------------------
   */
  connectedCallback() {
    super.connectedCallback(), document.addEventListener("click", this._boundClickOutside), document.addEventListener("keydown", this._boundKeyDown), this._desktopMedia.addEventListener("change", this._boundBreakpointChange);
  }
  firstUpdated() {
    this.shadowRoot?.querySelector("slot")?.addEventListener("slotchange", () => this._handleListSlotChange()), this._handleListSlotChange(), this._listenLinkClicks();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), document.removeEventListener("click", this._boundClickOutside), document.removeEventListener("keydown", this._boundKeyDown), this._desktopMedia.removeEventListener(
      "change",
      this._boundBreakpointChange
    );
  }
  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  _highlightActiveLink(e5) {
    const n13 = Array.from(e5.querySelectorAll("a"));
    if (this._authorSetsCurrent) {
      n13.forEach((a12) => {
        a12.closest("li")?.classList.toggle("active", y9(a12));
      });
      return;
    }
    const o18 = window.location.pathname.replace(/\/+$/, "") || "/";
    let t11 = {
      li: null,
      length: 0
    };
    n13.forEach((a12) => {
      const l17 = this._normalizePath(a12.getAttribute("href"));
      l17 && (l17 === "/" && o18 === "/" ? t11 = { li: a12.closest("li"), length: 1 } : o18.startsWith(l17) && l17.length > t11.length && (t11 = {
        li: a12.closest("li"),
        length: l17.length
      }));
    }), n13.forEach((a12) => {
      a12.closest("li")?.classList.remove("active"), a12.removeAttribute("aria-current");
    }), t11.li?.classList.add("active"), t11.li?.querySelector("a")?.setAttribute("aria-current", "page");
  }
  // Gets called when the slot content changes and directly appends the slotted elements into the shadow DOM
  async _handleListSlotChange() {
    const e5 = this.shadowRoot?.querySelector(
      'slot:not([name="user-actions"])'
    );
    if (!e5) return;
    const n13 = e5.assignedNodes({ flatten: true }).filter((t11) => t11.nodeType === Node.ELEMENT_NODE);
    this._authorSetsCurrent = n13.some(
      (t11) => y9(t11) || !!t11.querySelector(u7)
    );
    const o18 = [
      this.shadowRoot?.querySelector(".nys-globalheader__content"),
      this.shadowRoot?.querySelector(".nys-globalheader__content-mobile")
    ];
    if (!o18.some((t11) => !t11)) {
      for (const t11 of o18)
        t11.innerHTML = "", n13.forEach((a12) => {
          t11.appendChild(a12.cloneNode(true));
        }), this._highlightActiveLink(t11);
      await this.updateComplete, this._hasLinkContent = n13.length > 0;
    }
  }
  // Normalize paths so that links like "name", "/name/", and "/" match window.location.pathname.
  // This ensures consistent active-link behavior regardless of how hrefs are written.
  _normalizePath(e5) {
    if (!e5) return null;
    try {
      return new URL(e5, window.location.origin).pathname.replace(/\/+$/, "") || "/";
    } catch {
      return null;
    }
  }
  _toggleMobileMenu() {
    this._isMobileMenuOpen = !this._isMobileMenuOpen;
  }
  /** The toggle, which is both the trap's first stop and where focus returns. */
  get _menuButton() {
    return this.shadowRoot?.querySelector(E8) ?? null;
  }
  get _mobileNav() {
    return this.shadowRoot?.querySelector(
      ".nys-globalheader__content-mobile"
    ) ?? null;
  }
  /**
   * Closes the mobile menu.
   *
   * `restoreFocus` moves focus back to the toggle, which is required whenever the
   * menu is dismissed by keyboard: the closed menu is `display: none`, so focus
   * sitting on one of its links would otherwise be dropped to the top of the
   * document (WCAG 2.4.3 Focus Order). A click outside is a pointer gesture that
   * lands somewhere the user chose, so that path leaves focus alone.
   */
  _closeMobileMenu(e5 = false) {
    this._isMobileMenuOpen && (this._isMobileMenuOpen = false, e5 && this.updateComplete.then(() => this._menuButton?.focus()));
  }
  /**
   * Toggle first, then the menu's own links — the tab order a sighted keyboard
   * user sees, so the trap cycles in the order the menu reads.
   */
  _focusableMenuElements() {
    const e5 = this._mobileNav, n13 = e5 ? Array.from(e5.querySelectorAll(w16)) : [];
    return [this._menuButton, ...n13].filter(
      (o18) => !!o18 && $8(o18)
    );
  }
  /**
   * The focused element, but only when it is one of the menu's own stops.
   *
   * `document.activeElement` reports the host for anything focused inside this
   * shadow root, so the shadow root's own `activeElement` is what identifies the
   * real stop.
   */
  _activeMenuElement(e5) {
    const n13 = this.shadowRoot?.activeElement;
    return n13 && e5.includes(n13) ? n13 : null;
  }
  /**
   * Keeps Tab / Shift+Tab inside the open mobile menu (#1101).
   *
   * The open menu covers the page, so tabbing out of it silently moves focus to
   * content the user cannot see (WCAG 2.4.3, 2.1.2). Wrapping at both ends keeps
   * every stop reachable, and Escape (handled alongside this) is the documented
   * way out.
   */
  _trapMobileMenuFocus(e5) {
    const n13 = this._focusableMenuElements();
    if (n13.length === 0) return;
    const o18 = n13[0], t11 = n13[n13.length - 1], a12 = this._activeMenuElement(n13);
    if (!a12) {
      e5.preventDefault(), (e5.shiftKey ? t11 : o18).focus();
      return;
    }
    e5.shiftKey && a12 === o18 ? (e5.preventDefault(), t11.focus()) : !e5.shiftKey && a12 === t11 && (e5.preventDefault(), o18.focus());
  }
  // Listens for click events on links to mark them active
  _listenLinkClicks() {
    this.shadowRoot?.querySelectorAll(
      ".nys-globalheader__content, .nys-globalheader__content-mobile"
    )?.forEach((n13) => {
      n13?.addEventListener("click", (o18) => {
        const a12 = o18.target.closest("a");
        if (!a12 || this._authorSetsCurrent) return;
        n13.querySelectorAll("li.active").forEach((c21) => {
          c21.classList.remove("active"), c21.querySelector("a")?.removeAttribute("aria-current");
        });
        const l17 = a12.closest("li");
        l17 && (l17.classList.add("active"), a12.setAttribute("aria-current", "page"));
      });
    });
  }
  /**
   * Id of the element that names the banner landmark, or undefined when this
   * header carries no title to point at.
   *
   * The documented pairing puts this header below `nys-unavheader`, which leaves a
   * page with two `banner` landmarks. Naming each one keeps landmark navigation
   * useful instead of announcing "banner, banner" (axe `landmark-unique`). The name
   * references the visible title rather than repeating it in an `aria-label`, so it
   * cannot drift out of sync and is translated along with the rest of the page.
   */
  get _bannerLabelledBy() {
    if (!this._landmarkLabelOverride) {
      if (this.appName?.trim()) return `${this.id}-appname`;
      if (this.agencyName?.trim()) return `${this.id}-agencyname`;
    }
  }
  /** The author's landmark name, or undefined when they gave none. */
  get _landmarkLabelOverride() {
    return this.landmarkLabel?.trim() || void 0;
  }
  /**
   * Literal name for the banner: the author's override, or the "Site" default when
   * there is no visible title to reference. Undefined whenever `_bannerLabelledBy`
   * has something to point at, so the landmark never carries both.
   */
  get _bannerLabel() {
    return this._landmarkLabelOverride ? this._landmarkLabelOverride : this._bannerLabelledBy ? void 0 : N2;
  }
  /**
   * App/agency title block. Rendered on its own so the linked and unlinked
   * variants cannot drift apart — the ids here are what names the banner.
   */
  _renderNameContainer() {
    return html`
      <div class="nys-globalheader__name-container">
        ${this.appName?.trim().length > 0 ? html`<div
              id="${this.id}-appname"
              class="nys-globalheader__appName nys-globalheader__name"
            >
              ${this.appName}
            </div> ` : ""}
        ${this.agencyName?.trim().length > 0 ? html`<div
              id="${this.id}-agencyname"
              class="nys-globalheader__agencyName nys-globalheader__name ${this.appName?.trim().length > 0 ? "" : "main"}"
            >
              ${this.agencyName}
            </div> ` : ""}
      </div>
    `;
  }
  _renderBrandMark() {
    return this.nysLogo ? html`${this._getNysLogo()}` : "";
  }
  _getNysLogo() {
    const o18 = new DOMParser().parseFromString(m14, "image/svg+xml").documentElement;
    return o18.id = "nys-unavheader__logo", o18;
  }
  render() {
    return html`
      <header
        class="nys-globalheader"
        aria-labelledby=${ifDefined(this._bannerLabelledBy)}
        aria-label=${ifDefined(this._bannerLabel)}
      >
        <div class="nys-globalheader__main-container">
          ${this._hasLinkContent ? html` <div class="nys-globalheader__button-container">
                <button
                  type="button"
                  class="nys-globalheader__mobile-menu-button"
                  aria-expanded="${this._isMobileMenuOpen}"
                  aria-controls="${this.id}-mobile-nav"
                  @click="${this._toggleMobileMenu}"
                >
                  <nys-icon
                    name="${this._isMobileMenuOpen ? "close" : "menu"}"
                    size="32"
                    aria-hidden="true"
                  ></nys-icon>
                  <span class="nys-globalheader__mobile-menu-button-text"
                    >${this._isMobileMenuOpen ? "CLOSE" : "MENU"}</span
                  >
                </button>
              </div>` : ""}
          ${this._renderBrandMark()}
          ${this.homepageLink?.trim() ? html`<a
                class="nys-globalheader__name-container-link"
                href=${this.homepageLink?.trim()}
              >
                ${this._renderNameContainer()}
              </a>` : this._renderNameContainer()}
          <nav
            class="nys-globalheader__content"
            aria-label="Primary"
            ?hidden="${!this._hasLinkContent}"
          ></nav>
          <slot
            style="display: none;"
            @slotchange="${this._handleListSlotChange}"
          ></slot>
          <slot name="user-actions"></slot>
        </div>
      </header>
      <nav
        id="${this.id}-mobile-nav"
        class="nys-globalheader__content-mobile ${this._isMobileMenuOpen ? "" : "close"}"
        aria-label="Primary mobile"
        ?hidden="${!this._hasLinkContent}"
      ></nav>
    `;
  }
};
h10.styles = unsafeCSS(k8);
var i10 = h10;
s4([
  property({ type: String, reflect: true })
], i10.prototype, "id");
s4([
  property({ type: String })
], i10.prototype, "appName");
s4([
  property({ type: String })
], i10.prototype, "agencyName");
s4([
  property({ type: String })
], i10.prototype, "homepageLink");
s4([
  property({ type: Boolean })
], i10.prototype, "nysLogo");
s4([
  property({ type: String })
], i10.prototype, "landmarkLabel");
s4([
  state()
], i10.prototype, "_isMobileMenuOpen");
s4([
  state()
], i10.prototype, "_hasLinkContent");
customElements.get("nys-globalheader") || customElements.define("nys-globalheader", i10);

// ../../nys-iconlist/dist/chunks/nys-iconlistitem-Ds544kSE.js
var v13 = 0;
function g7(i21) {
  return `${i21}-${Date.now()}-${v13++}`;
}
var f11 = (i21) => {
  class t11 extends i21 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = g7(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return t11;
};
var h12 = f11(LitElement);
var _7 = '@charset "UTF-8";:host{--_nys-iconlistitem-gap: var(--nys-space-150, 12px);--_nys-iconlistitem-align-items: center;display:block;color:var(--nys-color-text);--_nys-iconlistitem-font-family: var( --nys-font-family-ui, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif );--_nys-iconlistitem-font-size: var(--nys-font-size-ui-lg, 18px);--_nys-iconlistitem-font-style: normal;--_nys-iconlistitem-font-weight: 600;--_nys-iconlistitem-line-height: var( --nys-font-lineheight-ui-lg, 28px );--_nys-iconlistitem-letter-spacing: var( --nys-font-letterspacing-ui-lg, .028px );--_nys-iconlistitem-color--divider: var(--nys-color-neutral-100, #d0d0ce);--_nys-iconlistitem-width--divider: var(--nys-size-1px, 1px);--_nys-iconlistitem-spacing--divider: var(--nys-space-150, 12px);--_nys-iconlistitem-padding--icon: var(--nys-space-50, 4px)}:host([data-has-secondary]){--_nys-iconlistitem-align-items: flex-start}.nys-iconlistitem{display:flex;gap:var(--_nys-iconlistitem-gap);align-items:var(--_nys-iconlistitem-align-items);padding-bottom:var(--_nys-iconlistitem-spacing--divider)}:host([divider]) .nys-iconlistitem{padding-bottom:var(--_nys-iconlistitem-spacing--divider);margin-bottom:var(--_nys-iconlistitem-spacing--divider);border-bottom:var(--_nys-iconlistitem-width--divider) solid var(--_nys-iconlistitem-color--divider)}.nys-iconlistitem__icon{padding:var(--_nys-iconlistitem-padding--icon)}.nys-iconlistitem__label{display:flex;flex-direction:column;font-family:var(--_nys-iconlistitem-font-family);font-size:var(--_nys-iconlistitem-font-size);font-style:var(--_nys-iconlistitem-font-style);font-weight:var(--_nys-iconlistitem-font-weight);line-height:var(--_nys-iconlistitem-line-height);letter-spacing:var(--_nys-iconlistitem-letter-spacing)}';
var u8 = Object.defineProperty;
var d12 = (i21, t11, s13, a12) => {
  for (var e5 = void 0, o18 = i21.length - 1, r13; o18 >= 0; o18--)
    (r13 = i21[o18]) && (e5 = r13(t11, s13, e5) || e5);
  return e5 && u8(t11, s13, e5), e5;
};
var l5 = class l6 extends h12 {
  constructor() {
    super(...arguments), this.icon = "", this.divider = false;
  }
  connectedCallback() {
    super.connectedCallback(), !this.hasAttribute("role") && this.parentElement?.tagName.toLowerCase() === "nys-iconlist" && this.setAttribute("role", "listitem");
  }
  _handleSecondarySlotChange(t11) {
    const a12 = t11.target.assignedNodes({ flatten: true }).length > 0;
    this.toggleAttribute("data-has-secondary", a12);
  }
  render() {
    return html`
      <div class="nys-iconlistitem">
        <nys-icon
          name=${this.icon}
          size="20"
          class="nys-iconlistitem__icon"
        ></nys-icon>
        <div class="nys-iconlistitem__label">
          <slot></slot>
          <slot
            name="secondary"
            @slotchange=${this._handleSecondarySlotChange}
          ></slot>
        </div>
      </div>
    `;
  }
};
l5.styles = unsafeCSS(_7);
var n8 = l5;
d12([
  property({ type: String })
], n8.prototype, "icon");
d12([
  property({ type: Boolean, reflect: true })
], n8.prototype, "divider");
customElements.get("nys-iconlistitem") || customElements.define("nys-iconlistitem", n8);

// ../../nys-iconlist/dist/nys-iconlist.js
var y10 = "nys-iconlist{--_nys-iconlist-width: 100%;display:block;width:var(--_nys-iconlist-width)}nys-iconlist>:not(nys-iconlistitem){display:none}";
var p8 = Object.defineProperty;
var a9 = (n13, t11, e5, d21) => {
  for (var i21 = void 0, r13 = n13.length - 1, l17; r13 >= 0; r13--)
    (l17 = n13[r13]) && (i21 = l17(t11, e5, i21) || i21);
  return i21 && p8(t11, e5, i21), i21;
};
var s5 = null;
function m15() {
  s5 || typeof document > "u" || (s5 = new CSSStyleSheet(), s5.replaceSync(y10), document.adoptedStyleSheets = [...document.adoptedStyleSheets, s5]);
}
var o9 = class extends h12 {
  constructor() {
    super(...arguments), this.id = "", this.divider = false, this._childObserver = new MutationObserver(() => this._syncDividers()), this._warnedChildren = /* @__PURE__ */ new WeakSet();
  }
  // The host must not be a shadow host: Chrome ≥150 demotes role="listitem"
  // on elements slotted into a shadow-host list, so the items have to be
  // direct DOM children of the element carrying role="list".
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback(), m15(), this.hasAttribute("role") || this.setAttribute("role", "list"), this._childObserver.observe(this, { childList: true }), this._syncDividers();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._childObserver.disconnect();
  }
  updated(t11) {
    super.updated(t11), t11.has("divider") && this._syncDividers();
  }
  _syncDividers() {
    const t11 = Array.from(this.children).filter(
      (e5) => e5.tagName.toLowerCase() === "nys-iconlistitem"
    );
    Array.from(this.children).forEach((e5) => {
      e5.tagName.toLowerCase() !== "nys-iconlistitem" && !this._warnedChildren.has(e5) && (this._warnedChildren.add(e5), console.warn(
        `nys-iconlist: <${e5.tagName.toLowerCase()}> is not a <nys-iconlistitem> and will be hidden (display: none), removing it from the accessibility tree. Only <nys-iconlistitem> elements are supported as children.`,
        e5
      ));
    }), t11.forEach((e5, d21) => {
      e5.toggleAttribute("divider", this.divider && d21 < t11.length - 1);
    });
  }
};
a9([
  property({ type: String, reflect: true })
], o9.prototype, "id");
a9([
  property({ type: Boolean, reflect: true })
], o9.prototype, "divider");
customElements.get("nys-iconlist") || customElements.define("nys-iconlist", o9);

// ../../nys-modal/dist/nys-modal.js
var w17 = 0;
function x14(l17) {
  return `${l17}-${Date.now()}-${w17++}`;
}
var E9 = (l17) => {
  class e5 extends l17 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = x14(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return e5;
};
var S7 = E9(LitElement);
var B3 = ':host{--_nys-modal-width: 439px;--_nys-modal-min-width: 320px;--_nys-modal-border-radius: var(--nys-radius-lg, 8px);--_nys-modal-border-color: var(--nys-color-neutral-200, #bec0c1);--_nys-modal-border-width: 1px;--_nys-modal-background-color: var(--nys-color-surface, #ffffff);--_nys-modal-margin: var(--nys-space-250, 20px);--_nys-modal-padding: var(--nys-space-300, 24px);--_nys-modal-gap: var(--nys-space-200, 16px);--_nys-modal-background-color--overlay: var( --nys-color-black-transparent-700, rgba(27, 27, 27, .7) );--_nys-modal-gap--header: var(--nys-space-100, 8px);--_nys-modal-gap--footer: var(--nys-space-250, 20px);--_nys-modal-font-size: var( --nys-font-size-body-md, var(--nys-font-size-md, 16px) );--_nys-modal-font-size--subheader: var( --nys-font-size-body-lg, var(--nys-font-size-lg, 18px) );--_nys-modal-font-weight--header: var(--nys-font-weight-bold, 700);--_nys-modal-font-weight--subheader: var(--nys-font-weight-semibold, 600);--_nys-modal-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-modal-line-height--subheader: var(--nys-font-lineheight-body-lg, 28px);--_nys-modal-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) )}*{box-sizing:border-box}::slotted(*){max-width:100%;box-sizing:border-box}::slotted(p){margin:0!important}h2,p{flex:1;margin:0}.nys-modal-overlay{position:fixed;top:0;left:0;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;z-index:1000;background:var(--_nys-modal-background-color--overlay)}.nys-modal{display:flex;flex-direction:column;max-height:calc(100vh - 2 * var(--_nys-modal-margin));margin:var(--_nys-modal-margin);padding:var(--_nys-modal-padding);gap:var(--_nys-modal-gap);width:var(--_nys-modal-width);border-radius:var(--_nys-modal-border-radius);border:var(--_nys-modal-border-width) solid var(--_nys-modal-border-color);font-family:var(--_nys-modal-font-family);font-size:var(--_nys-modal-font-size);line-height:var(--_nys-modal-line-height);background:var(--_nys-modal-background-color);position:relative;z-index:10000}.nys-modal_header{display:flex;flex-direction:column;align-items:flex-start;gap:var(--_nys-modal-gap--header)}.nys-modal_header p{font-size:var(--_nys-modal-font-size--subheader);font-weight:var(--_nys-modal-font-weight--subheader);line-height:var(--_nys-modal-line-height--subheader)}.nys-modal_header-inner{display:flex;align-items:center;justify-content:space-between;width:100%;font-weight:var(--_nys-modal-font-weight--header)}.nys-modal_body{display:flex;flex-direction:column;align-items:flex-start;min-height:0}.nys-modal_body-inner{overflow:auto;width:100%;max-height:100%}.nys-modal_body.hidden{display:none}.nys-modal_footer ::slotted(*){display:flex;flex-direction:column-reverse;justify-content:center;gap:var(--_nys-modal-gap--footer);align-self:stretch}.nys-modal_footer.hidden ::slotted(*){display:none}@media(min-width:480px){.nys-modal_footer ::slotted(*){flex-direction:row;justify-content:flex-end;align-items:center}.nys-modal{--_nys-modal-width: 439px}}@media(min-width:768px){.nys-modal{--_nys-modal-width: 600px}}@media(min-width:1024px){.nys-modal{--_nys-modal-width: 752px}}@media(min-width:1280px){.nys-modal{--_nys-modal-width: 840px}}';
var $9 = Object.defineProperty;
var n9 = (l17, e5, o18, i21) => {
  for (var t11 = void 0, r13 = l17.length - 1, h23; r13 >= 0; r13--)
    (h23 = l17[r13]) && (t11 = h23(e5, o18, t11) || t11);
  return t11 && $9(e5, o18, t11), t11;
};
var v14 = class v15 extends S7 {
  /**
   * Lifecycle Methods
   * --------------------------------------------------------------------------
   */
  constructor() {
    super(), this.id = "", this.heading = "", this.ariaLabel = "", this.subheading = "", this.open = false, this.mandatory = false, this.width = "md", this._actionButtonSlot = null, this._prevFocusedElement = null, this._originalBodyOverflow = null, this._mobileMedia = window.matchMedia("(max-width: 480px)"), this.hasBodySlots = false, this.hasActionSlots = false, this._boundHandleKeydown = (e5) => this._handleKeydown(e5), this._handleBodySlotChange = async () => {
      const e5 = this.shadowRoot?.querySelector("slot");
      e5 && (this.hasBodySlots = e5.assignedNodes({ flatten: true }).some(
        (o18) => o18.nodeType === Node.ELEMENT_NODE || o18.textContent?.trim()
      ));
    };
  }
  connectedCallback() {
    super.connectedCallback(), this._mobileMedia.addEventListener(
      "change",
      this._updateSlottedButtonWidth
    ), window.addEventListener("keydown", this._boundHandleKeydown);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._restoreBodyScroll(), this._mobileMedia.removeEventListener(
      "change",
      this._updateSlottedButtonWidth
    ), window.removeEventListener("keydown", this._boundHandleKeydown);
  }
  async updated(e5) {
    e5.has("open") && (this.open ? (this._hideBodyScroll(), this._dispatchOpenEvent(), await this.updateComplete, this._savePrevFocused(), this._focusOnModal()) : (this._restorePrevFocused(), this._restoreBodyScroll(), this._dispatchCloseEvent()));
  }
  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  _hideBodyScroll() {
    this._originalBodyOverflow === null && (this._originalBodyOverflow = document.body.style.overflow), document.body.style.overflow = "hidden";
  }
  _restoreBodyScroll() {
    this._originalBodyOverflow !== null && (document.body.style.overflow = this._originalBodyOverflow, this._originalBodyOverflow = null);
  }
  _savePrevFocused() {
    this._prevFocusedElement = document.activeElement;
  }
  _focusOnModal() {
    this.shadowRoot?.querySelector(".nys-modal")?.focus();
  }
  async _restorePrevFocused() {
    this._prevFocusedElement?.focus(), this._prevFocusedElement = null;
  }
  // Determines whether we hide the action buttons slot container based on if user put in action buttons
  async _handleActionSlotChange() {
    const e5 = this.shadowRoot?.querySelector(
      'slot[name="actions"]'
    );
    e5 && (this.hasActionSlots = e5.assignedNodes({ flatten: true }).some(
      (o18) => o18.nodeType === Node.ELEMENT_NODE || o18.textContent?.trim()
    ), this._actionButtonSlot = e5, this._updateSlottedButtonWidth());
  }
  // Design has it that the slotted action buttons should be fullWidth and display:column direction for mobile view.
  // Therefore, we need to account for mobile size and screen resizes
  _updateSlottedButtonWidth() {
    if (!this._actionButtonSlot) return;
    const e5 = this._mobileMedia.matches;
    this._actionButtonSlot.assignedElements().forEach((o18) => {
      o18.querySelectorAll("nys-button").forEach((i21) => {
        e5 ? i21?.setAttribute("fullWidth", "") : i21?.removeAttribute("fullWidth");
      });
    });
  }
  _dispatchOpenEvent() {
    this.dispatchEvent(
      new CustomEvent("nys-open", {
        detail: { id: this.id },
        bubbles: true,
        composed: true
      })
    );
  }
  _dispatchCloseEvent() {
    this.dispatchEvent(
      new CustomEvent("nys-close", {
        detail: { id: this.id },
        bubbles: true,
        composed: true
      })
    );
  }
  _getAriaDescribedBy() {
    const e5 = [];
    return this.subheading && e5.push(`${this.id}-subheading`), this.hasBodySlots && e5.push(`${this.id}-desc`), e5.join(" ");
  }
  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */
  async _handleKeydown(e5) {
    if (this.open && (e5.key === "Escape" && !this.mandatory && (e5.preventDefault(), this._closeModal()), e5.key === "Tab")) {
      const o18 = this.shadowRoot?.querySelector(".nys-modal");
      if (!o18) return;
      const i21 = 'a[href], area[href], button:not([disabled]), details, iframe, object, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [contentEditable="true"], [tabindex]:not([tabindex^="-"])', t11 = [], r13 = o18.querySelector("nys-button");
      r13 && t11.push(r13);
      const h23 = Array.from(o18.querySelectorAll("slot"));
      for (const y17 of h23) {
        const m32 = y17.assignedElements({ flatten: true });
        for (const a12 of m32)
          a12 instanceof HTMLElement && a12.matches(i21) && t11.push(a12), a12.querySelectorAll("nys-button").forEach(
            (f21) => {
              t11.push(f21);
            }
          );
      }
      if (t11.length > 0) {
        const y17 = t11[0], m32 = t11[t11.length - 1];
        let a12 = document.activeElement, f21 = t11.indexOf(
          a12
        );
        if (e5.shiftKey) {
          e5.preventDefault();
          let u17 = f21 - 1;
          u17 < 0 && (u17 = t11.length - 1), t11[u17].focus();
        } else
          a12 === m32 && (e5.preventDefault(), y17.focus());
      }
    }
  }
  _closeModal() {
    this.open = false, this._dispatchCloseEvent();
  }
  render() {
    const e5 = !!this.heading?.trim(), o18 = e5 ? `${this.id}-heading` : void 0, i21 = e5 ? void 0 : this.ariaLabel?.trim() || void 0, t11 = this._getAriaDescribedBy() || void 0;
    return this.open ? html`<div class="nys-modal-overlay">
          <div
            class="nys-modal"
            tabindex="-1"
            role="dialog"
            aria-modal="true"
            aria-labelledby="${ifDefined(o18)}"
            aria-label="${ifDefined(i21)}"
            aria-describedby="${ifDefined(t11)}"
          >
            <div class="nys-modal_header">
              <div class="nys-modal_header-inner">
                ${e5 ? html`<h2 id="${this.id}-heading">${this.heading}</h2>` : ""}
                ${this.mandatory ? "" : html`<nys-button
                      id="dismiss-modal"
                      circle
                      icon="close"
                      variant="ghost"
                      label="Close this window"
                      @nys-click=${this._closeModal}
                    ></nys-button>`}
              </div>
              ${this.subheading ? html`<p id="${this.id}-subheading">${this.subheading}</p>` : ""}
            </div>

            <div
              id="${this.id}-desc"
              class="nys-modal_body ${this.hasBodySlots ? "" : "hidden"}"
            >
              <div class="nys-modal_body-inner">
                <slot @slotchange=${this._handleBodySlotChange}></slot>
              </div>
            </div>

            <div
              class="nys-modal_footer ${this.hasActionSlots ? "" : "hidden"}"
            >
              <slot
                name="actions"
                @slotchange=${this._handleActionSlotChange}
              ></slot>
            </div>
          </div>
        </div>` : "";
  }
};
v14.styles = unsafeCSS(B3);
var s6 = v14;
n9([
  property({ type: String, reflect: true })
], s6.prototype, "id");
n9([
  property({ type: String })
], s6.prototype, "heading");
n9([
  property({ type: String })
], s6.prototype, "ariaLabel");
n9([
  property({ type: String })
], s6.prototype, "subheading");
n9([
  property({ type: Boolean, reflect: true })
], s6.prototype, "open");
n9([
  property({ type: Boolean, reflect: true })
], s6.prototype, "mandatory");
n9([
  property({ type: String, reflect: true })
], s6.prototype, "width");
n9([
  state()
], s6.prototype, "hasBodySlots");
n9([
  state()
], s6.prototype, "hasActionSlots");
customElements.get("nys-modal") || customElements.define("nys-modal", s6);

// ../../nys-select/dist/nys-option.js
var h13 = Object.defineProperty;
var i11 = (r13, e5, o18, f21) => {
  for (var t11 = void 0, n13 = r13.length - 1, d21; n13 >= 0; n13--)
    (d21 = r13[n13]) && (t11 = d21(e5, o18, t11) || t11);
  return t11 && h13(e5, o18, t11), t11;
};
var s7 = class extends LitElement {
  constructor() {
    super(...arguments), this.disabled = false, this.selected = false, this.value = "", this.label = "", this.hidden = false;
  }
  firstUpdated() {
    const e5 = this.shadowRoot?.querySelector("slot");
    e5 && e5.addEventListener("slotchange", () => {
      const o18 = e5.assignedNodes({ flatten: true });
      o18.length > 0 && (this.label = o18[0].textContent?.trim() || "");
    });
  }
  render() {
    return html`
      <option
        ?disabled=${this.disabled}
        ?selected=${this.selected}
        value=${this.value}
        label=${this.label}
        ?hidden=${this.hidden}
      >
        <slot>${this.label}</slot>
      </option>
    `;
  }
};
i11([
  property({ type: Boolean, reflect: true })
], s7.prototype, "disabled");
i11([
  property({ type: Boolean, reflect: true })
], s7.prototype, "selected");
i11([
  property({ type: String })
], s7.prototype, "value");
i11([
  property({ type: String })
], s7.prototype, "label");
i11([
  property({ type: Boolean, reflect: true })
], s7.prototype, "hidden");
customElements.get("nys-option") || customElements.define("nys-option", s7);

// ../../nys-pagination/dist/nys-pagination.js
var _8 = 0;
function P3(i21) {
  return `${i21}-${Date.now()}-${_8++}`;
}
var m16 = (i21) => {
  class t11 extends i21 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = P3(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return t11;
};
var x15 = m16(LitElement);
var k9 = ':host{--_nys-pagination-width: fit-content;--_nys-pagination-height: var(--nys-size-500, 40px);--_nys-pagination-radius: var(--nys-radius-xl, 12px);--_nys-pagination-gap: var(--nys-space-100, 8px);--_nys-pagination-font-size: var(--nys-font-size-ui-md, 16px);--_nys-pagination-font-weight: var(--nys-font-weight-semibold, 600);--_nys-pagination-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-pagination-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) )}.nys-pagination{width:var(--_nys-pagination-width);height:var(--_nys-pagination-height);border-radius:var(--_nys-pagination-radius);display:flex;align-items:center;justify-content:center;gap:var(--_nys-pagination-gap);font-family:var(--_nys-pagination-font-family);font-size:var(--_nys-pagination-font-size);font-weight:var(--_nys-pagination-font-weight);line-height:var(--_nys-pagination-line-height)}nys-button{--_nys-button-height: var(--_nys-pagination-height);--_nys-button-border-width: var(--nys-border-width-sm, 1px);--_nys-button-border-radius: var(--nys-radius-md, 4px);--_nys-button-padding--x: var(--nys-space-200, 16px)}nys-button[variant=outline]{--nys-button-background-color: var(--nys-color-ink-reverse, #ffffff);--nys-button-background-color--hover: var(--nys-color-neutral-10, #f6f6f6);--nys-button-background-color--active: var(--nys-color-neutral-50, #ededed);--nys-button-border-color: var(--nys-color-neutral-200, #bec0c1);--nys-button-border-color--hover: var(--nys-color-neutral-600, #62666a);--nys-button-border-color--active: var(--nys-color-neutral-900, #1b1b1b);--nys-button-color: var(--nys-color-link, #004dd1);--nys-button-color--hover: var(--nys-color-link-strong, #003ba1);--nys-button-color--active: var(--nys-color-link-strong, #003ba1)}nys-button[variant=filled]{--nys-button-background-color: var(--nys-color-link, #004dd1);--nys-button-background-color--hover: var(--nys-color-link-strong, #003ba1);--nys-button-background-color--active: var( --nys-color-link-strongest, #002971 );--nys-button-border-color: var(--nys-color-link, #004dd1);--nys-button-border-color--hover: var(--nys-color-link-strong, #003ba1);--nys-button-border-color--active: var(--nys-color-link-strongest, #002971);--nys-button-color: var(--nys-color-ink-reverse, #ffffff);--nys-button-color--hover: var(--nys-color-ink-reverse, #ffffff);--nys-button-color--active: var(--nys-color-ink-reverse, #ffffff)}nys-button#previous,nys-button#next,nys-button#previous--mobile,nys-button#next--mobile{--nys-button-color: var(--nys-color-text, #1b1b1b);--nys-button-color--hover: var(--nys-color-text, #1b1b1b);--nys-button-color--active: var(--nys-color-text, #1b1b1b);--_nys-button-padding--x: var(--nys-space-150, 12px)}nys-button#previous--mobile,nys-button#next--mobile{display:none}.nys-pagination__ellipsis{box-sizing:border-box;display:flex;align-items:center;justify-content:center;height:var(--_nys-pagination-height);padding-inline:var(--nys-space-2px, 2px);color:var(--nys-color-text, #1b1b1b)}:host([currentPage="3"]) #first-spacer,:host([_twoBeforeLast]) #last-spacer{display:none}@media(min-width:0)and (max-width:767px){nys-button#prev-page,nys-button#next-page{display:none}:host([currentPage="3"]) #first-spacer,:host([_twoBeforeLast]) #last-spacer{display:flex}nys-button#previous--mobile,nys-button#next--mobile{display:block}nys-button#previous,nys-button#next{display:none}}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}';
var w18 = Object.defineProperty;
var u9 = (i21, t11, e5, o18) => {
  for (var s13 = void 0, n13 = i21.length - 1, r13; n13 >= 0; n13--)
    (r13 = i21[n13]) && (s13 = r13(t11, e5, s13) || s13);
  return s13 && w18(t11, e5, s13), s13;
};
var f12 = class f13 extends x15 {
  /**
   * Lifecycle Methods
   * --------------------------------------------------------------------------
   */
  constructor() {
    super(), this.id = "", this.name = "", this.currentPage = 1, this.totalPages = 1, this._twoBeforeLast = false, this._focusKeyBeforeUpdate = null, this._focusRestoreToken = 0;
  }
  willUpdate(t11) {
    if (this.totalPages < 1 && (this.totalPages = 1), t11.has("currentPage") || t11.has("totalPages")) {
      const e5 = this._clampPage(this.currentPage);
      e5 !== this.currentPage && (this.currentPage = e5);
      const o18 = this.currentPage === this.totalPages - 2;
      o18 !== this._twoBeforeLast && (this._twoBeforeLast = o18);
    }
    this._focusKeyBeforeUpdate = this._focusKeyOf(
      this.shadowRoot?.activeElement ?? null
    );
  }
  updated() {
    const t11 = this._focusKeyBeforeUpdate;
    this._focusKeyBeforeUpdate = null, t11 && this._restoreFocus(t11);
  }
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  _clampPage(t11) {
    return t11 < 1 ? 1 : t11 > this.totalPages ? this.totalPages : t11;
  }
  /**
   * Stable identity for a control in the shadow root, one that survives a re-render.
   *
   * DOM position is not that identity: the window of visible page numbers slides as the
   * user pages through, and Lit reuses the element sitting at a given position, so the
   * button under the user's focus silently starts navigating to a different page. Page
   * buttons are therefore identified by the page they navigate to, and the fixed
   * Previous/Next controls by their id.
   */
  _focusKeyOf(t11) {
    if (!t11) return null;
    const e5 = t11.getAttribute("data-page");
    return e5 ? `page:${e5}` : t11.id ? `control:${t11.id}` : null;
  }
  /** Resolve a focus key back to the control that now carries that identity. */
  _controlForKey(t11) {
    const e5 = this.shadowRoot;
    if (!e5) return null;
    const o18 = t11.indexOf(":"), s13 = t11.slice(0, o18), n13 = t11.slice(o18 + 1);
    return s13 === "page" ? e5.querySelector(`nys-button[data-page="${n13}"]`) : e5.getElementById(n13);
  }
  /**
   * A control has to be both enabled and rendered to take focus. `getClientRects()`
   * covers the responsive rules that swap the desktop Previous/Next for their
   * icon-only mobile twins, and hide the page neighbors on narrow screens.
   */
  _isFocusable(t11) {
    return !!t11 && !t11.hasAttribute("disabled") && t11.getClientRects().length > 0;
  }
  /**
   * Where focus goes when the control the user was on is gone or has just been
   * disabled: the current page's button. It is always rendered, it is never disabled,
   * and it announces the page the user just landed on.
   */
  _fallbackFocusTarget() {
    const t11 = this.shadowRoot;
    if (!t11) return null;
    const e5 = t11.querySelector(
      `nys-button[data-page="${this.currentPage}"]`
    );
    return this._isFocusable(e5) ? e5 : Array.from(
      t11.querySelectorAll("nys-button")
    ).find((s13) => this._isFocusable(s13)) ?? null;
  }
  /**
   * Keep keyboard focus on the control the user was operating.
   *
   * Two things pull focus out from under them otherwise. Reaching the first or last page
   * disables Previous/Next while it still holds focus, which drops focus to `<body>` and
   * ends the keyboard journey. And activating a page slides the window of page numbers,
   * so the button that keeps focus by DOM position is now a different, non-current page.
   */
  async _restoreFocus(t11) {
    const e5 = this.shadowRoot;
    if (!e5) return;
    const o18 = Array.from(e5.querySelectorAll("nys-button")), s13 = ++this._focusRestoreToken;
    if (await Promise.allSettled(
      o18.map((y17) => y17.updateComplete)
    ), s13 !== this._focusRestoreToken || !this.isConnected) return;
    const n13 = this._controlForKey(t11), r13 = this._isFocusable(n13) ? n13 : this._fallbackFocusTarget();
    r13 && r13 !== e5.activeElement && r13.focus();
  }
  renderPageButtons() {
    const t11 = [], e5 = (l17, p19) => {
      const d21 = l17 === this.currentPage;
      t11.push(html`
        <nys-button
          label=${String(l17)}
          ariaCurrent=${ifDefined(d21 ? "page" : void 0)}
          data-page=${l17}
          id=${ifDefined(p19)}
          variant=${d21 ? "filled" : "outline"}
          size="sm"
          @nys-click="${() => this._handlePageClick(l17)}"
        ></nys-button>
      `);
    }, o18 = (l17) => {
      t11.push(
        html`<span class="nys-pagination__ellipsis" id=${l17} aria-hidden="true"
          >...</span
        >`
      );
    }, n13 = this.totalPages, r13 = this.currentPage - 1, y17 = this.currentPage + 1;
    return e5(1), this.currentPage > 2 && o18("first-spacer"), r13 > 1 && e5(r13, "prev-page"), this.currentPage !== 1 && this.currentPage !== n13 && e5(this.currentPage, "current-page"), y17 < n13 && e5(y17, "next-page"), this.currentPage < n13 - 1 && o18("last-spacer"), n13 > 1 && e5(n13), t11;
  }
  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */
  _handlePageClick(t11) {
    this.currentPage = this._clampPage(t11), this.dispatchEvent(
      new CustomEvent("nys-change", {
        detail: { page: this.currentPage },
        bubbles: true,
        composed: true
      })
    );
  }
  render() {
    return this.totalPages <= 1 ? null : html`<nav class="nys-pagination" aria-label="Pagination">
      <nys-button
        id="previous"
        label="Previous"
        prefixIcon="chevron_left"
        variant="outline"
        size="sm"
        ?disabled=${this.currentPage === 1}
        @nys-click="${() => this._handlePageClick(this.currentPage - 1)}"
      ></nys-button>
      <nys-button
        id="previous--mobile"
        prefixIcon="chevron_left"
        variant="outline"
        size="sm"
        ?disabled=${this.currentPage === 1}
        @nys-click="${() => this._handlePageClick(this.currentPage - 1)}"
        ><span class="sr-only">Previous Page</span></nys-button
      >
      ${this.renderPageButtons()}
      <nys-button
        id="next"
        label="Next"
        suffixIcon="chevron_right"
        variant="outline"
        size="sm"
        ?disabled=${this.currentPage === this.totalPages}
        @nys-click="${() => this._handlePageClick(this.currentPage + 1)}"
      ></nys-button>
      <nys-button
        id="next--mobile"
        suffixIcon="chevron_right"
        variant="outline"
        size="sm"
        ?disabled=${this.currentPage === this.totalPages}
        @nys-click="${() => this._handlePageClick(this.currentPage + 1)}"
        ><span class="sr-only">Next Page</span></nys-button
      >
    </nav>`;
  }
  /****************** 🪡 in the Haystack Release ******/
  /****************** designsystem@its.ny.gov ********/
};
f12.styles = unsafeCSS(k9);
var a10 = f12;
u9([
  property({ type: String, reflect: true })
], a10.prototype, "id");
u9([
  property({ type: String, reflect: true })
], a10.prototype, "name");
u9([
  property({ type: Number, reflect: true })
], a10.prototype, "currentPage");
u9([
  property({ type: Number, reflect: true })
], a10.prototype, "totalPages");
u9([
  property({ type: Boolean, reflect: true })
], a10.prototype, "_twoBeforeLast");
customElements.get("nys-pagination") || customElements.define("nys-pagination", a10);

// ../../nys-processlist/dist/chunks/nys-processlistitem-6GcC6PH0.js
var h14 = 0;
function d13(s13) {
  return `${s13}-${Date.now()}-${h14++}`;
}
var v16 = (s13) => {
  class e5 extends s13 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = d13(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return e5;
};
var g8 = v16(LitElement);
var f14 = '@charset "UTF-8";:host{display:block;--_nys-processlist-gap: var(--nys-space-150, 12px);--_nys-processlist-theme--step: var(--nys-color-theme, #154973);--_nys-processlist-theme--connector: var(--nys-color-theme-weak, #cddde9);--_nys-processlist-color--step: var(--_nys-processlist-theme--step);--_nys-processlist-background-color--step: var(--nys-color-surface, #ffffff);--_nys-processlist-border-color--step: var(--_nys-processlist-theme--step);--_nys-processlist-color--connector: var(--_nys-processlist-theme--connector);--_nys-processlist-width--connector: var(--nys-size-2px, 2px);--_nys-processlist-size--step: var(--nys-size-400, 32px);--_nys-processlistitem-min-height: var(--nys-space-600, 48px);--_nys-processlistitem-gap: var(--nys-space-250, 20px);--_nys-processlistitem-padding-top: var(--nys-space-50, 4px);--_nys-processlistitem-font-family: var(--nys-font-family-ui, "Proxima Nova");--_nys-processlistitem-font-size: var(--nys-font-size-ui-lg, 18px);--_nys-processlistitem-font-weight: 600;--_nys-processlistitem-line-height: var(--nys-font-lineheight-ui-lg, 28px);--_nys-processlistitem-letter-spacing: var( --nys-font-letterspacing-ui-lg, .028px );--_nys-processlistitem-font-size--description: var( --nys-font-size-ui-md, 16px );--_nys-processlistitem-font-weight--description: var( --nys-font-weight-regular, 400 );--_nys-processlistitem-line-height--description: var( --nys-font-lineheight-ui-md, 24px );--_nys-processlistitem-letter-spacing--description: var( --nys-font-letterspacing-ui-md, .044px );--_nys-processlistitem-color--label: var(--nys-color-text, #1b1b1b);--_nys-processlistitem-color--description: var( --nys-color-text-weak, #4a4d4f );--_nys-processlistitem-gap--text: var(--nys-space-4px, 4px)}.nys-processlistitem{display:flex;gap:var(--_nys-processlist-gap)}.nys-processlistitem__stepwrapper{min-height:var(--_nys-processlistitem-min-height);display:flex;align-items:center;flex-direction:column}.nys-processlistitem__step{min-width:var(--_nys-processlist-size--step);width:var(--_nys-processlist-size--step);max-width:var(--_nys-processlist-size--step);min-height:var(--_nys-processlist-size--step);height:var(--_nys-processlist-size--step);max-height:var(--_nys-processlist-size--step);display:flex;align-items:center;justify-content:center;color:var(--_nys-processlist-color--step);background-color:var(--_nys-processlist-background-color--step);border:solid var(--nys-size-1px) var(--_nys-processlist-border-color--step);border-radius:var(--nys-radius-round);text-align:center;font-family:var(--_nys-processlistitem-font-family);font-size:var(--_nys-processlistitem-font-size);font-style:normal;font-weight:var(--_nys-processlistitem-font-weight);line-height:var(--_nys-processlistitem-line-height);letter-spacing:var(--_nys-processlistitem-letter-spacing)}.nys-processlistitem__connector{height:-moz-available;height:-webkit-fill-available;height:fill-available;background-color:var(--_nys-processlist-color--connector);width:var(--_nys-processlist-width--connector)}:host(:last-of-type) .nys-processlistitem__connector{display:none}.nys-processlistitem__content{width:100%;margin-bottom:var(--_nys-processlistitem-gap);padding-top:var(--_nys-processlistitem-padding-top);display:flex;flex-direction:column;align-items:flex-start;gap:var(--_nys-processlistitem-gap--text);font-family:var(--_nys-processlistitem-font-family);font-style:normal;text-align:left}.nys-processlistitem__label{color:var(--_nys-processlistitem-color--label);font-size:var(--_nys-processlistitem-font-size);font-weight:var(--_nys-processlistitem-font-weight);line-height:var(--_nys-processlistitem-line-height);letter-spacing:var(--_nys-processlistitem-letter-spacing)}.nys-processlistitem__description{margin:0;color:var(--_nys-processlistitem-color--description);font-size:var(--_nys-processlistitem-font-size--description);font-weight:var(--_nys-processlistitem-font-weight--description);line-height:var(--_nys-processlistitem-line-height--description);letter-spacing:var(--_nys-processlistitem-letter-spacing--description)}';
var u10 = Object.defineProperty;
var o10 = (s13, e5, r13, x24) => {
  for (var t11 = void 0, n13 = s13.length - 1, c21; n13 >= 0; n13--)
    (c21 = s13[n13]) && (t11 = c21(e5, r13, t11) || t11);
  return t11 && u10(e5, r13, t11), t11;
};
var l7 = class l8 extends g8 {
  constructor() {
    super(...arguments), this.label = "", this.description = "", this._step = 1;
  }
  /**
   * A description is shown when either the property or the slot has content, so an item with
   * neither renders no empty paragraph.
   */
  get _hasDescription() {
    return !!this.description || !!this.querySelector('[slot="description"]');
  }
  /**
   * Sets the rendered step number.
   * @internal Called by `<nys-processlist>`; not intended for direct use.
   */
  setStep(e5) {
    this._step = e5;
  }
  connectedCallback() {
    super.connectedCallback(), !this.hasAttribute("role") && this.parentElement?.tagName.toLowerCase() === "nys-processlist" && this.setAttribute("role", "listitem");
  }
  render() {
    return html`
      <div class="nys-processlistitem">
        <!-- Not aria-hidden: role="list" carries no ordering, so the rendered
             number is the only thing conveying sequence to assistive tech. -->
        <div class="nys-processlistitem__stepwrapper">
          <div class="nys-processlistitem__step">${this._step}</div>
          <div class="nys-processlistitem__connector"></div>
        </div>
        <div class="nys-processlistitem__content">
          <div class="nys-processlistitem__label">${this.label}</div>
          ${this._hasDescription ? html`<p class="nys-processlistitem__description">
                <slot name="description">${this.description}</slot>
              </p>` : ""}
        </div>
      </div>
    `;
  }
};
l7.styles = unsafeCSS(f14);
var i12 = l7;
o10([
  property({ type: String })
], i12.prototype, "label");
o10([
  property({ type: String })
], i12.prototype, "description");
o10([
  state()
], i12.prototype, "_step");
customElements.get("nys-processlistitem") || customElements.define("nys-processlistitem", i12);

// ../../nys-processlist/dist/nys-processlist.js
var h15 = 'nys-processlist{display:block;max-width:784px}nys-processlist>:not(nys-processlistitem){display:none}nys-processlist[strong]>nys-processlistitem{--_nys-processlist-color--step: var(--nys-color-surface, #ffffff);--_nys-processlist-background-color--step: var( --_nys-processlist-theme--step )}nys-processlist[neutral]>nys-processlistitem{--_nys-processlist-theme--step: var(--nys-color-neutral-600, #62666a);--_nys-processlist-theme--connector: var(--nys-color-neutral-100, #d0d0ce)}nys-processlist[strong][neutral]>nys-processlistitem{--_nys-processlist-theme--connector: var(--nys-color-neutral-200, #bec0c1)}nys-processlist[size=sm]>nys-processlistitem{--_nys-processlistitem-font-family: var(--nys-font-family-ui, "Proxima Nova");--_nys-processlistitem-font-size: var(--nys-font-size-ui-sm, 14px);--_nys-processlistitem-font-weight: 600;--_nys-processlistitem-line-height: var(--nys-font-lineheight-ui-sm, 24px);--_nys-processlistitem-letter-spacing: var( --p-type-unpublished-font-letterspacing-ui-sm, .044px );--_nys-processlist-size--step: var(--nys-size-300, 24px);--_nys-processlistitem-padding-top: var(--nys-space-1px, 1px);--_nys-processlistitem-font-size--description: var( --nys-font-size-ui-sm, 14px );--_nys-processlistitem-line-height--description: var( --nys-font-lineheight-ui-sm, 24px );--_nys-processlistitem-letter-spacing--description: var( --nys-font-letterspacing-ui-sm, .044px )}';
var d14 = Object.defineProperty;
var n10 = (p19, t11, o18, s13) => {
  for (var e5 = void 0, c21 = p19.length - 1, a12; c21 >= 0; c21--)
    (a12 = p19[c21]) && (e5 = a12(t11, o18, e5) || e5);
  return e5 && d14(t11, o18, e5), e5;
};
var l9 = null;
function m17() {
  l9 || typeof document > "u" || (l9 = new CSSStyleSheet(), l9.replaceSync(h15), document.adoptedStyleSheets = [...document.adoptedStyleSheets, l9]);
}
var i13 = class extends g8 {
  constructor() {
    super(...arguments), this.id = "", this.strong = false, this.neutral = false, this.size = "md", this.initialStep = 1, this._childObserver = new MutationObserver(() => this._syncSteps()), this._warnedChildren = /* @__PURE__ */ new WeakSet();
  }
  // The host must not be a shadow host: Chrome ≥150 demotes role="listitem"
  // on elements slotted into a shadow-host list, so the items have to be
  // direct DOM children of the element carrying role="list".
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback(), m17(), this.hasAttribute("role") || this.setAttribute("role", "list"), this._childObserver.observe(this, { childList: true }), this._syncSteps();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._childObserver.disconnect();
  }
  updated(t11) {
    super.updated(t11), t11.has("initialStep") && this._syncSteps();
  }
  // Ordering lives on the list, not the item, so numbers stay correct when
  // items are added, removed, or reordered.
  _syncSteps() {
    const t11 = Array.from(this.children).filter(
      (s13) => s13.tagName.toLowerCase() === "nys-processlistitem"
    );
    Array.from(this.children).forEach((s13) => {
      s13.tagName.toLowerCase() !== "nys-processlistitem" && !this._warnedChildren.has(s13) && (this._warnedChildren.add(s13), console.warn(
        `nys-processlist: <${s13.tagName.toLowerCase()}> is not a <nys-processlistitem> and will be hidden (display: none), removing it from the accessibility tree. Only <nys-processlistitem> elements are supported as children.`,
        s13
      ));
    });
    const o18 = Number.isFinite(this.initialStep) && this.initialStep >= 1 ? Math.floor(this.initialStep) : 1;
    t11.forEach((s13, e5) => {
      s13.setStep(e5 + o18);
    });
  }
};
n10([
  property({ type: String, reflect: true })
], i13.prototype, "id");
n10([
  property({ type: Boolean, reflect: true })
], i13.prototype, "strong");
n10([
  property({ type: Boolean, reflect: true })
], i13.prototype, "neutral");
n10([
  property({ type: String, reflect: true })
], i13.prototype, "size");
n10([
  property({ type: Number, reflect: true })
], i13.prototype, "initialStep");
customElements.get("nys-processlist") || customElements.define("nys-processlist", i13);

// ../../nys-radiobutton/dist/chunks/nys-radiogroup-CVzq4XsP.js
var m18 = 0;
function k10(d21) {
  return `${d21}-${Date.now()}-${m18++}`;
}
var w19 = (d21) => {
  class t11 extends d21 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = k10(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return t11;
};
var x16 = (d21) => {
  class t11 extends w19(d21) {
    constructor() {
      super(...arguments), this.__internals = null;
    }
    get internals() {
      if (this.__internals) return this.__internals;
      if (typeof this.attachInternals == "function")
        try {
          this.__internals = this.attachInternals();
        } catch {
          this.__internals = null;
        }
      return this.__internals;
    }
    get defaultRole() {
      return null;
    }
    setHostAria(e5, r13) {
      const i21 = this.internals;
      if (i21 && e5 in i21) {
        i21[e5] = r13;
        return;
      }
      const n13 = $10(e5);
      r13 === null ? this.removeAttribute(n13) : this.setAttribute(n13, r13);
    }
    reflectDefaultSemantics() {
      const e5 = this.defaultRole;
      e5 && this.setHostAria("role", e5);
    }
    connectedCallback() {
      super.connectedCallback(), this.reflectDefaultSemantics();
    }
  }
  return t11;
};
function $10(d21) {
  if (d21 === "role") return "role";
  const t11 = d21.replace(/^aria/, "");
  return "aria-" + t11.charAt(0).toLowerCase() + t11.slice(1);
}
var E10 = (d21) => {
  const t11 = class extends x16(d21) {
    setFormValue(r13) {
      this.internals?.setFormValue(r13 ?? null);
    }
    setValidityFromState(r13, i21, n13) {
      const l17 = this.internals;
      if (!l17) return;
      const h23 = Object.values(r13).some(Boolean);
      h23 ? l17.setValidity(r13, i21 ?? "Invalid value", n13) : l17.setValidity({}), this.setHostAria("ariaInvalid", h23 ? "true" : "false");
    }
    clearValidity() {
      this.internals?.setValidity({}), this.setHostAria("ariaInvalid", "false");
    }
    checkValidity() {
      return this.internals?.checkValidity() ?? true;
    }
    reportValidity() {
      return this.internals?.reportValidity() ?? true;
    }
    formResetCallback() {
      this.clearValidity();
    }
  };
  return t11.formAssociated = true, t11;
};
var R2 = E10(LitElement);
var A3 = `:host{--_nys-radiobutton-size: var(--nys-size-400, 32px);--_nys-radiobutton-border-radius: var(--nys-radius-md, 4px);--_nys-radiobutton-border-width: var(--nys-border-width-md, 2px);--_nys-radiobutton-outline-color: var(--nys-color-focus, #004dd1);--_nys-radiobutton-outline-width: var(--nys-border-width-md, 2px);--_nys-radiobutton-outline-offset: var(--nys-space-2px, 2px);--_nys-radiobutton-gap: var(--nys-space-150, 12px);--_nys-radiogroup-gap: var(--nys-space-200, 16px);--_nys-radiobutton-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-radiobutton-font-size: var(--nys-font-size-ui-md, 16px);--_nys-radiobutton-font-weight--label: var(--nys-font-weight-regular, 400);--_nys-radiobutton-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-radiobutton-color: var( --nys-color-text, var(--nys-color-neutral-900, #1b1b1b) );--_nys-radiobutton-background-color: var(--nys-color-ink-reverse, #ffffff);--_nys-radiobutton-border-color: var(--nys-color-neutral-600, #62666a);--_nys-radiobutton-background-color--hover: var( --nys-color-neutral-50, #ededed );--_nys-radiobutton-border-color--hover: var(--nys-color-ink, #1b1b1b);--_nys-radiobutton-background-color--active: var( --nys-color-neutral-100, #d0d0ce );--_nys-radiobutton-border-color--active: var(--nys-color-ink, #1b1b1b);--_nys-radiobutton-background-color--checked: var(--nys-color-theme, #154973);--_nys-radiobutton-background-color--disabled: var( --nys-color-ink-reverse, #f0f0f0 );--_nys-radiobutton-color--disabled: var(--nys-color-text-disabled, #bec0c1);--_nys-radiobutton-border-color--disabled: var( --nys-color-neutral-100, #d0d0ce );--_nys-radiobutton-background-color--checked--disabled: var( --nys-color-neutral-100, #d0d0ce );--_nys-radiobutton-border-color--checked--disabled: var( --nys-color-neutral-100, #d0d0ce )}:host([size=sm]){--_nys-radiobutton-size: var(--nys-size-300, 24px);--_nys-radiobutton-border-radius: var(--nys-radius-sm, 2px);--_nys-radiogroup-gap: var(--nys-space-100, 8px);--_nys-radiobutton-gap: var(--nys-space-100, 8px)}:host([size=md]){--_nys-radiobutton-size: var(--nys-size-400, 32px);--_nys-radiobutton-border-radius: var(--nys-radius-md, 4px);--_nys-radiogroup-gap: var(--nys-space-200, 16px);--_nys-radiobutton-gap: var(--nys-space-150, 12px)}:host([tile]){--_nys-radiobutton-font-weight--label: var(--nys-font-weight-semibold, 600);--_nys-radiobutton-border-width--tile: var(--nys-border-width-sm, 1px);--_nys-radiobutton-border-radius--tile: var(--nys-radius-md, 4px);--_nys-radiobutton-border-color--tile: var(--nys-color-neutral-100, #d0d0ce);--_nys-radiobutton-background-color--tile: var( --nys-color-ink-reverse, #ffffff );--_nys-radiobutton-padding--x--tile: var(--nys-space-250, 20px);--_nys-radiobutton-padding--y--tile: var(--nys-space-200, 16px);--_nys-radiobutton-border-color--tile--hover: var( --nys-color-neutral-700, #4a4d4f );--_nys-radiobutton-background-color--tile--hover: var( --nys-color-ink-reverse, #ffffff );--_nys-radiobutton-border-color--tile--active: var( --nys-color-neutral-900, #1b1b1b );--_nys-radiobutton-background-color--tile--active: var( --nys-color-ink-reverse, #ffffff );--_nys-radiobutton-border-color--tile--checked: var( --nys-color-theme-mid, #457aa5 );--_nys-radiobutton-background-color--tile--checked: var( --nys-color-theme-faint, #f7fafd );--_nys-radiobutton-border-color--tile--disabled: var( --nys-color-neutral-100, #d0d0ce );--_nys-radiobutton-background-color--tile--disabled: var( --nys-color-ink-reverse, #ffffff )}:host([tile][size=sm]){--_nys-radiobutton-padding--x--tile: var(--nys-space-200, 16px);--_nys-radiobutton-padding--y--tile: var(--nys-space-150, 12px)}:host([tile][showError]){--_nys-radiobutton-border-color--tile: var(--nys-color-danger, #b52c2c);--_nys-radiobutton-border-color--tile--hover: var( --nys-color-danger, #b52c2c );--_nys-radiobutton-border-color--tile--active: var( --nys-color-danger, #b52c2c );--_nys-radiobutton-border-color--tile--checked: var( --nys-color-danger, #b52c2c )}.nys-radiogroup{display:flex;flex-direction:column;gap:var(--nys-space-200, 16px);font-family:var(--_nys-radiobutton-font-family);font-size:var(--_nys-radiobutton-font-size);line-height:var(--_nys-radiobutton-line-height)}.nys-radiogroup legend{margin-bottom:var(--nys-space-200, 16px)}.nys-radiogroup__content{gap:var(--_nys-radiogroup-gap);display:flex;flex-direction:column}.nys-radiobutton{display:flex;flex-direction:column;font-family:var(--_nys-radiobutton-font-family);font-size:var(--_nys-radiobutton-font-size);line-height:var(--_nys-radiobutton-line-height);border-radius:var(--_nys-radiobutton-border-radius--tile);border:var(--_nys-radiobutton-border-width--tile) solid var(--_nys-radiobutton-border-color--tile);background-color:var(--_nys-radiobutton-background-color--tile);padding:var(--_nys-radiobutton-padding--y--tile) var(--_nys-radiobutton-padding--x--tile)}.nys-radiobutton__radio{appearance:none;width:var(--_nys-radiobutton-size);height:var(--_nys-radiobutton-size);min-width:var(--_nys-radiobutton-size);min-height:var(--_nys-radiobutton-size);max-width:var(--_nys-radiobutton-size);max-height:var(--_nys-radiobutton-size);border:solid var(--_nys-radiobutton-border-width) var(--_nys-radiobutton-border-color);background-color:var(--_nys-radiobutton-background-color);border-radius:100%;background-repeat:no-repeat;background-position:center;background-size:contain;outline-offset:var(--_nys-radiobutton-outline-offset);outline:none;margin:0 0 auto;box-sizing:border-box}.nys-radiobutton:hover,.nys-radiobutton:hover *{cursor:pointer}.nys-radiobutton__radio:not(:disabled):checked{background-image:url('data:image/svg+xml;utf8,<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="11" stroke="white" stroke-width="6"/></svg>');background-color:var(--_nys-radiobutton-background-color--checked)}:host([tile]) .nys-radiobutton:has(.nys-radiobutton__radio:not(:disabled):checked){border-color:var(--_nys-radiobutton-border-color--tile--checked);background-color:var(--_nys-radiobutton-background-color--tile--checked)}:host([tile]) .nys-radiobutton:has(.nys-radiobutton__radio:not(:disabled):checked:hover){cursor:default}.nys-radiobutton__radio:disabled:checked{background-image:url('data:image/svg+xml;utf8,<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="11" stroke="white" stroke-width="6"/></svg>');border-color:var(--_nys-radiobutton-border-color--checked--disabled);background-color:var(--_nys-radiobutton-background-color--checked--disabled)}:host([tile]) .nys-radiobutton:has(.nys-radiobutton__radio:disabled){border-color:var(--_nys-radiobutton-border-color--tile--disabled);background-color:var(--_nys-radiobutton-background-color--tile--disabled)}.nys-radiobutton__radio:disabled{background-color:var(--_nys-radiobutton-background-color--disabled);border-color:var(--_nys-radiobutton-border-color--disabled);cursor:not-allowed}.nys-radiobutton__radio:hover:not(:disabled):not(:checked),.nys-radiobutton:hover .nys-radiobutton__radio:not(:disabled):not(:checked){border-color:var(--_nys-radiobutton-border-color--hover);background-color:var(--_nys-radiobutton-background-color--hover)}:host([tile]) .nys-radiobutton:hover:has(.nys-radiobutton__radio:not(:disabled):not(:checked)){border-color:var(--_nys-radiobutton-border-color--tile--hover);background-color:var(--_nys-radiobutton-background-color--tile--hover);outline:solid var(--_nys-radiobutton-border-width--tile) var(--_nys-radiobutton-border-color--tile--hover)}.nys-radiobutton__radio:active:not(:disabled):not(:checked),.nys-radiobutton:active .nys-radiobutton__radio:not(:disabled):not(:checked){border-color:var(--_nys-radiobutton-border-color--active);background-color:var(--_nys-radiobutton-background-color--active)}:host([tile]) .nys-radiobutton:active:has(.nys-radiobutton__radio:not(:disabled):not(:checked)){border-color:var(--_nys-radiobutton-border-color--tile--active);background-color:var(--_nys-radiobutton-background-color--tile--active);outline:solid var(--_nys-radiobutton-border-width--tile) var(--_nys-radiobutton-border-color--tile--active)}:host(:focus-visible){outline:none}:host(:focus-visible) .nys-radiobutton__radio{outline:solid var(--_nys-radiobutton-outline-width) var(--_nys-radiobutton-outline-color)}.nys-radiobutton__radio:focus-visible,.nys-radiobutton__radio--invalid-focus{outline:solid var(--_nys-radiobutton-outline-width) var(--_nys-radiobutton-outline-color);outline-offset:var(--_nys-radiobutton-outline-offset)}.nys-radiobutton__main-container{display:flex;align-items:center}.nys-radiobutton__other-container{display:flex;padding-inline-start:calc(var(--_nys-radiobutton-size) + var(--_nys-radiobutton-gap))}.nys-radiobutton__main-container>nys-label{--_nys-label-font-weight: var(--_nys-radiobutton-font-weight--label);display:flex;padding-inline-start:var(--_nys-radiobutton-gap)}:host([tile]) .nys-radiobutton__main-container>nys-label{--_nys-description-font-style: normal}.nys-radiobutton:has(.nys-radiobutton__radio:disabled) .nys-radiobutton__main-container>nys-label,.nys-radiobutton:has(.nys-radiobutton__radio:disabled) .nys-radiobutton__main-container>nys-label *{cursor:not-allowed;--_nys-label-cursor: not-allowed;--_nys-label-color: var(--_nys-radiobutton-color--disabled);--_nys-description-color: var(--_nys-radiobutton-color--disabled);color:var(--_nys-radiobutton-color--disabled)}fieldset{all:unset;display:contents}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;border:0}`;
var S8 = Object.defineProperty;
var a11 = (d21, t11, o18, e5) => {
  for (var r13 = void 0, i21 = d21.length - 1, n13; i21 >= 0; i21--)
    (n13 = d21[i21]) && (r13 = n13(t11, o18, r13) || r13);
  return r13 && S8(t11, o18, r13), r13;
};
var _9 = class _10 extends R2 {
  constructor() {
    super(...arguments), this.id = "", this.name = "", this.required = false, this.optional = false, this.showError = false, this.errorMessage = "", this.label = "", this.description = "", this.tile = false, this.tooltip = "", this.form = null, this.size = "md", this._showOtherError = false, this.selectedValue = null, this._slottedDescriptionText = "", this._radios = [], this.isMobile = false, this._hasUserInteracted = false, this._handleMobileQuery = () => {
      this.isMobile = this._mobileQuery.matches;
    }, this._handleRadiobtnClick = (t11) => {
      t11.disabled || this.shadowRoot?.querySelector(`#input-${t11.id}`)?.click();
    };
  }
  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   * Form association, ElementInternals, and id generation are provided by
   * NysFormControlElement (@nysds/internals). super.connectedCallback()
   * assigns an id (prefix = localName) when one is not provided.
   */
  // The host is the semantic grouping element: expose role="radiogroup" on the
  // host's accessibility node via the shared ReflectsAriaMixin instead of a
  // hand-attached ElementInternals.
  get defaultRole() {
    return "radiogroup";
  }
  connectedCallback() {
    super.connectedCallback(), this._mobileQuery = window.matchMedia("(max-width: 479px)"), this.isMobile = this._mobileQuery.matches, this._mobileQuery.addEventListener("change", this._handleMobileQuery), this.addEventListener("invalid", this._handleInvalid), this._childObserver = new MutationObserver(() => {
      this._radios = this._getAllRadios(), this.requestUpdate();
    }), this._childObserver.observe(this, { childList: true });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("invalid", this._handleInvalid), this._mobileQuery.removeEventListener("change", this._handleMobileQuery), this._childObserver?.disconnect();
  }
  async firstUpdated() {
    await this.updateComplete, this._radios = this._getAllRadios(), this._initializeCheckedRadioValue(), this._setValue(), this._setRadioButtonRequire(), this._updateRadioButtonsSize(), this._getSlotDescriptionForAria(), this._initializeChildAttributes(), this._updateGroupTabIndex();
  }
  updated(t11) {
    (t11.has("required") || t11.has("selectedValue")) && (this.showError || this._manageRequire()), t11.has("size") && this._updateRadioButtonsSize(), this._updateGroupTabIndex(), this._forwardRadioDescriptions();
  }
  /**
   * Form Integration
   * --------------------------------------------------------------------------
   */
  _setValue() {
    this.setFormValue(this.selectedValue);
  }
  _setRadioButtonRequire() {
    this.querySelectorAll("nys-radiobutton").forEach((o18, e5) => {
      this.required && e5 === 0 && o18.setAttribute("required", "required");
    });
  }
  async _manageRequire() {
    const t11 = this.errorMessage || "Please select an option.", e5 = Array.from(this.querySelectorAll("nys-radiobutton"))[0];
    if (e5) {
      const r13 = this.shadowRoot?.querySelector(
        `#input-${e5.id}`
      );
      this.required && !this.selectedValue ? this.setValidityFromState(
        { valueMissing: true },
        t11,
        r13 ?? e5
        // pass the custom element, not shadow input
      ) : (this.showError = false, this.clearValidity());
    }
  }
  checkValidity() {
    const t11 = Array.from(this.querySelectorAll("nys-radiobutton"));
    return !this.required || t11.some((e5) => e5.checked);
  }
  // Need to account for if radiogroup already have a radiobutton checked at initialization
  _initializeCheckedRadioValue() {
    const t11 = this.querySelector("nys-radiobutton[checked]");
    t11 && (this.selectedValue = t11.getAttribute("value"), this.setFormValue(this.selectedValue));
  }
  // Core Keyboard & Click Logic
  _getAllRadios() {
    return Array.from(
      this.querySelectorAll("nys-radiobutton")
    );
  }
  // Arrow / Space / Enter navigation at group level
  async _handleKeyDown(t11) {
    if (![
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      " ",
      "Enter"
    ].includes(t11.key) || (t11.key === "ArrowLeft" || t11.key === "ArrowRight") && t11.composedPath().some((v20) => v20.tagName === "NYS-TEXTINPUT"))
      return;
    t11.preventDefault();
    const e5 = this._getAllRadios().filter((u17) => !u17.disabled), r13 = t11.target, i21 = e5.find(
      (u17) => this.shadowRoot?.querySelector(`#input-${u17.id}`) === r13
    ) || e5.find((u17) => u17.checked) || e5[0];
    let n13 = 0;
    ["ArrowUp", "ArrowLeft"].includes(t11.key) ? n13 = -1 : ["ArrowDown", "ArrowRight"].includes(t11.key) && (n13 = 1);
    let l17 = e5.indexOf(i21) + n13;
    l17 < 0 && (l17 = e5.length - 1), l17 >= e5.length && (l17 = 0);
    const h23 = e5[l17];
    this._selectRadio(h23), await this.updateComplete, this._updateGroupTabIndex(), this.shadowRoot?.querySelector(`#input-${h23.id}`)?.focus();
  }
  _updateGroupTabIndex() {
    const t11 = this._getAllRadios(), o18 = t11.find((e5) => e5.checked && !e5.disabled) || t11.find((e5) => !e5.disabled);
    t11.forEach((e5) => {
      const r13 = this.shadowRoot?.querySelector(
        `#input-${e5.id}`
      );
      r13 && (r13.tabIndex = e5 === o18 ? 0 : -1);
    });
  }
  // This callback is automatically called when the parent form is reset.
  formResetCallback() {
    this.querySelectorAll("nys-radiobutton").forEach((o18) => {
      o18.checked = false;
    }), this.selectedValue = null, this.setFormValue(null), this.showError = false, this.errorMessage = "", this.clearValidity(), this._hasUserInteracted = false, this.requestUpdate();
  }
  _handleSlotChange() {
    this._radios = Array.from(this.querySelectorAll("nys-radiobutton")), this.requestUpdate();
  }
  // Apply ARIA & initial tabindex to each child radio
  _initializeChildAttributes() {
    this._getAllRadios().forEach((o18) => {
      o18.getAttribute("tabindex") !== "-1" && o18.setAttribute("tabindex", "-1");
    });
  }
  _updateRadioButtonsSize() {
    this.querySelectorAll("nys-radiobutton").forEach((o18) => {
      o18.getAttribute("size") !== this.size && o18.setAttribute("size", this.size);
    });
  }
  _selectRadio(t11) {
    if (t11.checked || t11.disabled) return;
    this._getAllRadios().forEach((e5) => {
      e5.checked = false;
    }), t11.checked = true, this._showOtherError = false, this._hasUserInteracted = false, this.name = t11.name, this.selectedValue = t11.value, this.setFormValue(this.selectedValue), this.clearValidity(), this.showError = false, this._updateGroupTabIndex(), this.requestUpdate(), this.dispatchEvent(
      new CustomEvent("nys-change", {
        detail: {
          id: t11.id,
          checked: t11.checked,
          name: t11.name,
          value: t11.value
        },
        bubbles: true,
        composed: true
      })
    );
  }
  // Get the slotted text contents so native VO can attempt to announce it within the legend in the fieldset
  _getSlotDescriptionForAria() {
    const o18 = this.shadowRoot?.querySelector(
      'slot[name="description"]'
    )?.assignedNodes({ flatten: true }) || [];
    this._slottedDescriptionText = o18.map((e5) => e5.textContent?.trim()).filter(Boolean).join(", ");
  }
  _forwardRadioDescriptions() {
    this._radios.forEach((t11) => {
      const o18 = t11.querySelector(
        ':scope > [slot="description"]'
      );
      if (!o18) return;
      const e5 = this.shadowRoot?.querySelector(`#${t11.id}-label`);
      e5 && o18.parentElement !== e5 && e5.appendChild(o18);
    });
  }
  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */
  async _handleInvalid(t11) {
    t11.preventDefault();
    const e5 = this._getAllRadios().find((i21) => i21.other && i21.checked);
    if (e5 && e5.value.trim() === "") {
      this.showError = true, this._hasUserInteracted = true, this._validateOtherAndEmitError(e5), await this.updateComplete;
      const i21 = this.shadowRoot?.querySelector("nys-textinput");
      if (i21) {
        await i21.updateComplete, i21.focus();
        return;
      }
    }
    this.showError = true, await this._manageRequire();
    const r13 = this._getAllRadios().find(
      (i21) => !i21.disabled
    );
    if (r13) {
      const i21 = () => {
        const l17 = this.shadowRoot?.querySelector(
          `#input-${r13.id}`
        );
        l17?.focus(), l17?.classList.add("nys-radiobutton__radio--invalid-focus");
      }, n13 = this.internals?.form;
      n13 ? Array.from(n13.elements).find(
        (u17) => typeof u17.checkValidity == "function" && !u17.checkValidity()
      ) === this && i21() : i21();
    }
  }
  _handleTextInput(t11, o18) {
    const e5 = o18.target;
    t11.value = e5.value, this.selectedValue = e5.value, this.setFormValue(e5.value), this._hasUserInteracted && this._validateOtherAndEmitError(t11), this.dispatchEvent(
      new CustomEvent("nys-other-input", {
        detail: { id: t11.id, name: t11.name, value: t11.value },
        bubbles: true,
        composed: true
      })
    );
  }
  _handleTextInputBlur(t11) {
    this._hasUserInteracted = true, this._validateOtherAndEmitError(t11);
  }
  _validateOtherAndEmitError(t11) {
    if (!t11.other) return;
    if (!t11.checked || !this._hasUserInteracted) {
      this._showOtherError = false;
      return;
    }
    const o18 = t11.value.trim() === "";
    this._showOtherError = o18;
    const e5 = this.shadowRoot?.querySelector(
      `#input-${t11.id}`
    );
    o18 ? (this.setValidityFromState(
      {
        customError: true
      },
      "Please enter a value for this option.",
      e5 ?? t11
    ), this.showError = true) : (this.clearValidity(), this.showError = false);
  }
  _handleOtherKeydown(t11) {
    (t11.key == "Space" || t11.key === " ") && t11.stopPropagation();
  }
  _handleGroupFocusout(t11) {
    const o18 = t11.relatedTarget;
    if (o18 && this.shadowRoot?.contains(o18)) return;
    const e5 = this._getAllRadios().find(
      (r13) => r13.other && r13.checked
    );
    e5 && e5.value.trim() === "" && (this._hasUserInteracted = true, this._validateOtherAndEmitError(e5));
  }
  _handleRadiobtnFocus(t11) {
    t11.dispatchEvent(
      new CustomEvent("nys-focus", { bubbles: true, composed: true })
    );
  }
  _handleRadiobtnBlur(t11) {
    this.shadowRoot?.querySelector(
      `#input-${t11.id}`
    )?.classList.remove("nys-radiobutton__radio--invalid-focus"), t11.dispatchEvent(
      new CustomEvent("nys-blur", { bubbles: true, composed: true })
    );
  }
  render() {
    return html` <slot
        style="display:none"
        @slotchange=${this._handleSlotChange}
      ></slot>
      <fieldset
        aria-label="${this.label}${this._slottedDescriptionText ? ` ${this._slottedDescriptionText}` : this.description ? ` ${this.description}` : ""}"
        role="radiogroup"
        aria-required=${this.required ? "true" : "false"}
        class="nys-radiogroup"
        @focusout=${this._handleGroupFocusout}
      >
        <legend>
          <nys-label
            label=${this.label}
            description=${this.description}
            flag=${this.required ? "required" : this.optional ? "optional" : ""}
            tooltip=${this.tooltip}
          >
            <slot name="description" slot="description"
              >${this.description}</slot
            >
          </nys-label>
        </legend>
        <div class="nys-radiogroup__content" @keydown=${this._handleKeyDown}>
          ${this._radios.map(
      (t11, o18) => html`
              <div
                class="nys-radiobutton"
                @click=${() => this._handleRadiobtnClick(t11)}
              >
                <div class="nys-radiobutton__main-container">
                  <!-- <span class="nys-radiobutton__radio" tabindex="-1"></span> -->
                  <input
                    id="input-${t11.id}"
                    type="radio"
                    class="nys-radiobutton__radio"
                    name="${ifDefined(t11.name || void 0)}"
                    .checked=${t11.checked}
                    ?disabled=${t11.disabled}
                    .value=${t11.value}
                    ?required=${this.required && o18 === 0}
                    form=${ifDefined(t11.form || void 0)}
                    aria-labelledby=${ifDefined(
        t11.label || t11.other ? `${t11.id}-label` : void 0
      )}
                    aria-invalid=${this.showError ? "true" : "false"}
                    aria-errormessage=${`${this.id}--error`}
                    aria-describedby=${ifDefined(
        this.showError ? `${this.id}--error` : void 0
      )}
                    @change=${() => this._selectRadio(t11)}
                    @focus=${() => this._handleRadiobtnFocus(t11)}
                    @blur=${() => this._handleRadiobtnBlur(t11)}
                  />
                  ${(t11.label || t11.other) && html`<nys-label
                    id="${t11.id}-label"
                    label="${t11.label || (t11.other ? "Other" : "")}"
                    description=${ifDefined(t11.description || void 0)}
                  >
                  </nys-label>`}
                </div>
                <div class="nys-radiobutton__other-container">
                  ${t11.other && t11.checked ? html`
                        <nys-textinput
                          .value=${t11.value}
                          id=${"radiobutton-other-" + t11.id}
                          @nys-input=${(e5) => this._handleTextInput(t11, e5)}
                          @nys-blur=${() => this._handleTextInputBlur(t11)}
                          @keydown=${this._handleOtherKeydown}
                          @nys-focus=${() => t11.classList.remove("focused")}
                          ariaLabel="Other"
                          aria-invalid=${t11.showOtherError ? "true" : "false"}
                          width=${this.isMobile ? "full" : "md"}
                          ?disabled=${t11.disabled}
                        ></nys-textinput>
                      ` : ""}
                </div>
              </div>
            `
    )}
        </div>
        <nys-errormessage
          id="${this.id}--error"
          ?showError=${this.showError}
          errorMessage=${this.internals.validationMessage || this.errorMessage}
          .showDivider=${!this.tile}
        ></nys-errormessage>
      </fieldset>`;
  }
};
_9.styles = unsafeCSS(A3), _9.shadowRootOptions = __spreadProps(__spreadValues({}, LitElement.shadowRootOptions), {
  delegatesFocus: true
});
var s8 = _9;
a11([
  property({ type: String, reflect: true })
], s8.prototype, "id");
a11([
  property({ type: String, reflect: true })
], s8.prototype, "name");
a11([
  property({ type: Boolean, reflect: true })
], s8.prototype, "required");
a11([
  property({ type: Boolean, reflect: true })
], s8.prototype, "optional");
a11([
  property({ type: Boolean, reflect: true })
], s8.prototype, "showError");
a11([
  property({ type: String })
], s8.prototype, "errorMessage");
a11([
  property({ type: String })
], s8.prototype, "label");
a11([
  property({ type: String })
], s8.prototype, "description");
a11([
  property({ type: Boolean, reflect: true })
], s8.prototype, "tile");
a11([
  property({ type: String })
], s8.prototype, "tooltip");
a11([
  property({ type: String, reflect: true })
], s8.prototype, "form");
a11([
  property({ type: String, reflect: true })
], s8.prototype, "size");
a11([
  property({ type: Boolean })
], s8.prototype, "_showOtherError");
a11([
  state()
], s8.prototype, "selectedValue");
a11([
  state()
], s8.prototype, "_slottedDescriptionText");
a11([
  state()
], s8.prototype, "_radios");
a11([
  state()
], s8.prototype, "isMobile");
customElements.get("nys-radiogroup") || customElements.define("nys-radiogroup", s8);

// ../../nys-radiobutton/dist/nys-radiobutton.js
var p9 = `nys-radiobutton{--_nys-radiobutton-size: var(--nys-size-400, 32px);--_nys-radiobutton-border-radius: var(--nys-radius-md, 4px);--_nys-radiobutton-border-width: var(--nys-border-width-md, 2px);--_nys-radiobutton-outline-color: var(--nys-color-focus, #004dd1);--_nys-radiobutton-outline-width: var(--nys-border-width-md, 2px);--_nys-radiobutton-outline-offset: var(--nys-space-2px, 2px);--_nys-radiobutton-gap: var(--nys-space-150, 12px);--_nys-radiogroup-gap: var(--nys-space-200, 16px);--_nys-radiobutton-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-radiobutton-font-size: var(--nys-font-size-ui-md, 16px);--_nys-radiobutton-font-weight--label: var(--nys-font-weight-regular, 400);--_nys-radiobutton-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-radiobutton-color: var( --nys-color-text, var(--nys-color-neutral-900, #1b1b1b) );--_nys-radiobutton-background-color: var(--nys-color-ink-reverse, #ffffff);--_nys-radiobutton-border-color: var(--nys-color-neutral-600, #62666a);--_nys-radiobutton-background-color--hover: var( --nys-color-neutral-50, #ededed );--_nys-radiobutton-border-color--hover: var(--nys-color-ink, #1b1b1b);--_nys-radiobutton-background-color--active: var( --nys-color-neutral-100, #d0d0ce );--_nys-radiobutton-border-color--active: var(--nys-color-ink, #1b1b1b);--_nys-radiobutton-background-color--checked: var(--nys-color-theme, #154973);--_nys-radiobutton-background-color--disabled: var( --nys-color-ink-reverse, #f0f0f0 );--_nys-radiobutton-color--disabled: var(--nys-color-text-disabled, #bec0c1);--_nys-radiobutton-border-color--disabled: var( --nys-color-neutral-100, #d0d0ce );--_nys-radiobutton-background-color--checked--disabled: var( --nys-color-neutral-100, #d0d0ce );--_nys-radiobutton-border-color--checked--disabled: var( --nys-color-neutral-100, #d0d0ce )}nys-radiobutton[size=sm]{--_nys-radiobutton-size: var(--nys-size-300, 24px);--_nys-radiobutton-border-radius: var(--nys-radius-sm, 2px);--_nys-radiogroup-gap: var(--nys-space-100, 8px);--_nys-radiobutton-gap: var(--nys-space-100, 8px)}nys-radiobutton[size=md]{--_nys-radiobutton-size: var(--nys-size-400, 32px);--_nys-radiobutton-border-radius: var(--nys-radius-md, 4px);--_nys-radiogroup-gap: var(--nys-space-200, 16px);--_nys-radiobutton-gap: var(--nys-space-150, 12px)}nys-radiobutton[tile]{--_nys-radiobutton-font-weight--label: var(--nys-font-weight-semibold, 600);--_nys-radiobutton-border-width--tile: var(--nys-border-width-sm, 1px);--_nys-radiobutton-border-radius--tile: var(--nys-radius-md, 4px);--_nys-radiobutton-border-color--tile: var(--nys-color-neutral-100, #d0d0ce);--_nys-radiobutton-background-color--tile: var( --nys-color-ink-reverse, #ffffff );--_nys-radiobutton-padding--x--tile: var(--nys-space-250, 20px);--_nys-radiobutton-padding--y--tile: var(--nys-space-200, 16px);--_nys-radiobutton-border-color--tile--hover: var( --nys-color-neutral-700, #4a4d4f );--_nys-radiobutton-background-color--tile--hover: var( --nys-color-ink-reverse, #ffffff );--_nys-radiobutton-border-color--tile--active: var( --nys-color-neutral-900, #1b1b1b );--_nys-radiobutton-background-color--tile--active: var( --nys-color-ink-reverse, #ffffff );--_nys-radiobutton-border-color--tile--checked: var( --nys-color-theme-mid, #457aa5 );--_nys-radiobutton-background-color--tile--checked: var( --nys-color-theme-faint, #f7fafd );--_nys-radiobutton-border-color--tile--disabled: var( --nys-color-neutral-100, #d0d0ce );--_nys-radiobutton-background-color--tile--disabled: var( --nys-color-ink-reverse, #ffffff )}nys-radiobutton[tile][size=sm]{--_nys-radiobutton-padding--x--tile: var(--nys-space-200, 16px);--_nys-radiobutton-padding--y--tile: var(--nys-space-150, 12px)}.nys-radiogroup{display:flex;flex-direction:column;gap:var(--nys-space-200, 16px);font-family:var(--_nys-radiobutton-font-family);font-size:var(--_nys-radiobutton-font-size);line-height:var(--_nys-radiobutton-line-height)}.nys-radiogroup legend{margin-bottom:var(--nys-space-200, 16px)}.nys-radiogroup__content{gap:var(--_nys-radiogroup-gap);display:flex;flex-direction:column}.nys-radiobutton{display:flex;flex-direction:column;font-family:var(--_nys-radiobutton-font-family);font-size:var(--_nys-radiobutton-font-size);line-height:var(--_nys-radiobutton-line-height);border-radius:var(--_nys-radiobutton-border-radius--tile);border:var(--_nys-radiobutton-border-width--tile) solid var(--_nys-radiobutton-border-color--tile);background-color:var(--_nys-radiobutton-background-color--tile);padding:var(--_nys-radiobutton-padding--y--tile) var(--_nys-radiobutton-padding--x--tile)}.nys-radiobutton__radio{appearance:none;width:var(--_nys-radiobutton-size);height:var(--_nys-radiobutton-size);min-width:var(--_nys-radiobutton-size);min-height:var(--_nys-radiobutton-size);max-width:var(--_nys-radiobutton-size);max-height:var(--_nys-radiobutton-size);border:solid var(--_nys-radiobutton-border-width) var(--_nys-radiobutton-border-color);border-radius:100%;background-size:contain;outline-offset:var(--_nys-radiobutton-outline-offset);outline:none;margin:0 0 auto;box-sizing:border-box}.nys-radiobutton:hover,.nys-radiobutton:hover *{cursor:pointer}.nys-radiobutton__radio:not(:disabled):checked{background-image:url('data:image/svg+xml;utf8,<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="11" stroke="white" stroke-width="6"/></svg>');background-color:var(--_nys-radiobutton-background-color--checked)}nys-radiobutton[tile] .nys-radiobutton:has(.nys-radiobutton__radio:not(:disabled):checked){border-color:var(--_nys-radiobutton-border-color--tile--checked);background-color:var(--_nys-radiobutton-background-color--tile--checked)}nys-radiobutton[tile] .nys-radiobutton:has(.nys-radiobutton__radio:not(:disabled):checked:hover){cursor:default}.nys-radiobutton__radio:disabled:checked{background-image:url('data:image/svg+xml;utf8,<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="11" stroke="white" stroke-width="6"/></svg>');border-color:var(--_nys-radiobutton-border-color--checked--disabled);background-color:var(--_nys-radiobutton-background-color--checked--disabled)}nys-radiobutton[tile] .nys-radiobutton:has(.nys-radiobutton__radio:disabled){border-color:var(--_nys-radiobutton-border-color--tile--disabled);background-color:var(--_nys-radiobutton-background-color--tile--disabled)}.nys-radiobutton__radio:disabled{background-color:var(--_nys-radiobutton-background-color--disabled);border-color:var(--_nys-radiobutton-border-color--disabled);cursor:not-allowed}.nys-radiobutton__radio:hover:not(:disabled):not(:checked),.nys-radiobutton:hover .nys-radiobutton__radio:not(:disabled):not(:checked){border-color:var(--_nys-radiobutton-border-color--hover);background-color:var(--_nys-radiobutton-background-color--hover)}nys-radiobutton[tile] .nys-radiobutton:hover:has(.nys-radiobutton__radio:not(:disabled):not(:checked)){border-color:var(--_nys-radiobutton-border-color--tile--hover);background-color:var(--_nys-radiobutton-background-color--tile--hover);outline:solid var(--_nys-radiobutton-border-width--tile) var(--_nys-radiobutton-border-color--tile--hover)}.nys-radiobutton__radio:active:not(:disabled):not(:checked),.nys-radiobutton:active .nys-radiobutton__radio:not(:disabled):not(:checked){border-color:var(--_nys-radiobutton-border-color--active);background-color:var(--_nys-radiobutton-background-color--active)}nys-radiobutton[tile] .nys-radiobutton:active:has(.nys-radiobutton__radio:not(:disabled):not(:checked)){border-color:var(--_nys-radiobutton-border-color--tile--active);background-color:var(--_nys-radiobutton-background-color--tile--active);outline:solid var(--_nys-radiobutton-border-width--tile) var(--_nys-radiobutton-border-color--tile--active)}nys-radiobutton:focus-visible{outline:none}nys-radiobutton:focus-visible .nys-radiobutton__radio{outline:solid var(--_nys-radiobutton-outline-width) var(--_nys-radiobutton-outline-color)}.nys-radiobutton__radio:focus-visible,.nys-radiobutton__radio--force-outline{outline:solid var(--_nys-radiobutton-outline-width) var(--_nys-radiobutton-outline-color);outline-offset:var(--_nys-radiobutton-outline-offset)}.nys-radiobutton__main-container{display:flex;align-items:center}.nys-radiobutton__other-container{display:flex;padding-inline-start:calc(var(--_nys-radiobutton-size) + var(--_nys-radiobutton-gap))}.nys-radiobutton__main-container>nys-label{--_nys-label-font-weight: var(--_nys-radiobutton-font-weight--label);display:flex;padding-inline-start:var(--_nys-radiobutton-gap)}nys-radiobutton[tile] .nys-radiobutton__main-container>nys-label{--_nys-description-font-style: normal}.nys-radiobutton:has(.nys-radiobutton__radio:disabled) .nys-radiobutton__main-container>nys-label,.nys-radiobutton:has(.nys-radiobutton__radio:disabled) .nys-radiobutton__main-container>nys-label *{cursor:not-allowed;--_nys-label-cursor: not-allowed;--_nys-label-color: var(--_nys-radiobutton-color--disabled);--_nys-description-color: var(--_nys-radiobutton-color--disabled);color:var(--_nys-radiobutton-color--disabled)}`;
var v17 = Object.defineProperty;
var r4 = (b24, o18, i21, n13) => {
  for (var a12 = void 0, s13 = b24.length - 1, l17; s13 >= 0; s13--)
    (l17 = b24[s13]) && (a12 = l17(o18, i21, a12) || a12);
  return a12 && v17(o18, i21, a12), a12;
};
var u11 = null;
function f15() {
  u11 || typeof document > "u" || (u11 = new CSSStyleSheet(), u11.replaceSync(p9), document.adoptedStyleSheets = [...document.adoptedStyleSheets, u11]);
}
var t6 = class extends R2 {
  constructor() {
    super(...arguments), this.checked = false, this.disabled = false, this.required = false, this.label = "", this.description = "", this.id = "", this.name = "", this.value = "", this.form = null, this.size = "md", this.tile = false, this.other = false, this.showOtherError = false, this.labelledby = "", this.hideLabel = false, this._handleInvalid = () => {
      this._inputEl?.classList.add("nys-radiobutton__radio--force-outline");
    }, this._handleFocusOut = () => {
      this._inputEl?.classList.remove("nys-radiobutton__radio--force-outline");
    }, this._handleWrapperClick = () => {
      this.disabled || this._inputEl?.click();
    };
  }
  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback(), f15();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("invalid", this._handleInvalid);
  }
  firstUpdated() {
    this._isGrouped() || (this._updateGroupValidity(), this._forwardDescriptionSlot());
  }
  updated(o18) {
    o18.has("checked") && this.setHostAria("ariaChecked", String(this.checked)), o18.has("disabled") && this.setHostAria("ariaDisabled", String(this.disabled)), o18.has("required") && this.setHostAria("ariaRequired", String(this.required)), (o18.has("checked") || o18.has("value") || o18.has("disabled")) && this.setFormValue(null), (o18.has("checked") || o18.has("required") || o18.has("disabled")) && this._updateGroupValidity(), o18.has("description") && (this._isGrouped() || this._forwardDescriptionSlot());
  }
  /**
   * Public validation API (Form Association)
   * --------------------------------------------------------------------------
   */
  get validity() {
    return this.internals?.validity;
  }
  get validationMessage() {
    return this.internals?.validationMessage ?? "";
  }
  // Check if any radios in the individual "name" group is checked.
  _isGroupChecked() {
    return this._getGroupMembers().some((o18) => o18.checked);
  }
  // Invalid only when required AND no member of the group is checked.
  // Grouped instances defer to nys-radiogroup.
  _updateValidity() {
    this._isGrouped() || !this._inputEl || (this.required && !this.disabled && !this._isGroupChecked() ? this.setValidityFromState(
      { valueMissing: true },
      "Please select an option.",
      this._inputEl
    ) : this.clearValidity());
  }
  _updateGroupValidity() {
    this._isGrouped() || this._getGroupMembers().forEach((o18) => o18._updateValidity());
  }
  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  _isGrouped() {
    return !!this.closest("nys-radiogroup");
  }
  _getGroupMembers() {
    const o18 = this.getRootNode();
    return Array.from(
      o18.querySelectorAll(
        `nys-radiobutton[name="${this.name}"]`
      )
    ).filter((n13) => !n13.closest("nys-radiogroup"));
  }
  // Unchecks every group member except the one just selected
  _uncheckOtherRadios(o18) {
    this._getGroupMembers().filter((i21) => i21 !== o18).forEach((i21) => i21.checked = false);
  }
  focus(o18) {
    this._inputEl?.focus(o18);
  }
  _forwardDescriptionSlot() {
    const o18 = this.querySelector('[slot="description"]'), i21 = this.querySelector("nys-label");
    o18 && i21 && i21.appendChild(o18);
  }
  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */
  async _handleChange() {
    this.checked || this.disabled || (this._inputEl?.classList.remove("nys-radiobutton__radio--force-outline"), this.checked = true, this._isGrouped() || this._uncheckOtherRadios(this), this.dispatchEvent(
      new CustomEvent("nys-change", {
        detail: {
          id: this.id,
          checked: this.checked,
          name: this.name,
          value: this.value
        },
        bubbles: true,
        composed: true
      })
    ));
  }
  // Note to self:
  // Theoretically this function is no longer needed with the new change. But account for future revamp to "eat our own dog food"
  // within the radiogroup, we may need this function to keep track of navigation into the "other option". So keeping function until then.
  async _handleKeydown(o18) {
    if (this._isGrouped()) return;
    const i21 = { ArrowUp: -1, ArrowLeft: -1, ArrowDown: 1, ArrowRight: 1 }[o18.key];
    if (i21 === void 0 || this.closest("nys-radiogroup")) return;
    o18.preventDefault();
    const n13 = this._getGroupMembers().filter((l17) => !l17.disabled);
    if (n13.length <= 1) return;
    const a12 = (n13.indexOf(this) + i21 + n13.length) % n13.length, s13 = n13[a12];
    s13.checked = true, this._uncheckOtherRadios(s13), await s13.updateComplete, s13.focus();
  }
  /** The text the internal `<nys-label>` shows, and the last-resort name. */
  get _labelText() {
    return this.label || (this.other ? "Other" : "");
  }
  /**
   * This component renders into the light DOM (see createRenderRoot), so the
   * native <input>, the internal <nys-label>, and any external labelling element
   * all share one tree scope: a plain aria-labelledby IDREF resolves natively and
   * needs none of the cross-shadow machinery (associateControlRefs) that
   * nys-checkbox requires.
   *
   * When the referenced element is a <nys-label>, its text lives in ITS shadow
   * root; the reference still names the input because nys-label mirrors `label`
   * onto its host via ElementInternals.ariaLabel — do not remove that mirror.
   * That mirror is also why the internal label must NOT be aria-hidden: the name
   * is read from the element the user can see, which is the whole point.
   */
  get _hasExternalLabel() {
    return !!this.labelledby;
  }
  // The internal <nys-label> is dropped when hidden, when an external label
  // supersedes it, or when there is nothing to label with. `nothing` (not a
  // boolean) so lit never renders the literal string "false".
  get _renderInternalLabel() {
    return !this.hideLabel && !this._hasExternalLabel && !!this._labelText;
  }
  /** Id of the internal `<nys-label>`, which is also what names the input. */
  get _internalLabelId() {
    return `${this.id}-label`;
  }
  /**
   * The `aria-labelledby` IDREF for the native input, resolved in priority order:
   * an author-supplied `labelledby` first, then the visible internal label.
   *
   * Naming the input from the element the user can actually see is what keeps the
   * accessible name and the visible text identical (WCAG 2.5.3 Label in Name).
   * The old path built a separate `aria-label` string from the same `label` prop,
   * which is a copy that can drift and that voice-control users cannot rely on
   * (#1820). This component renders into the light DOM, so a plain IDREF resolves
   * natively in one tree scope.
   */
  get _labelledById() {
    if (this._hasExternalLabel) return this.labelledby;
    if (this._renderInternalLabel) return this._internalLabelId;
  }
  /**
   * Last-resort accessible name, used only when `hideLabel` suppressed the visible
   * label and no external `labelledby` was given. There is no element left to point
   * at, and a nameless radio is worse than a duplicated string.
   */
  get _fallbackAriaLabel() {
    return this._labelledById ? void 0 : this._labelText || void 0;
  }
  render() {
    return html`
      <div class="nys-radiobutton" @click=${this._handleWrapperClick}>
        <div class="nys-radiobutton__main-container">
          <input
            id="input-${this.id}"
            type="radio"
            class="nys-radiobutton__radio"
            name="${ifDefined(
      this.name && !this._isGrouped() ? this.name : void 0
    )}"
            .checked=${this.checked}
            ?disabled=${this.disabled}
            .value=${this.value}
            ?required="${this.required}"
            form=${ifDefined(this.form || void 0)}
            @change="${this._handleChange}"
            @keydown="${this._handleKeydown}"
            @blur="${this._handleFocusOut}"
            aria-labelledby=${ifDefined(this._labelledById)}
            aria-label=${ifDefined(this._fallbackAriaLabel)}
          />
          ${this._renderInternalLabel ? html`<nys-label
                id="${this._internalLabelId}"
                label="${this._labelText}"
                description=${ifDefined(this.description || void 0)}
              >
              </nys-label>` : nothing}
        </div>
      </div>
    `;
  }
};
r4([
  property({ type: Boolean, reflect: true })
], t6.prototype, "checked");
r4([
  property({ type: Boolean, reflect: true })
], t6.prototype, "disabled");
r4([
  property({ type: Boolean, reflect: true })
], t6.prototype, "required");
r4([
  property({ type: String })
], t6.prototype, "label");
r4([
  property({ type: String })
], t6.prototype, "description");
r4([
  property({ type: String, reflect: true })
], t6.prototype, "id");
r4([
  property({ type: String, reflect: true })
], t6.prototype, "name");
r4([
  property({ type: String })
], t6.prototype, "value");
r4([
  property({ type: String, reflect: true })
], t6.prototype, "form");
r4([
  property({ type: String, reflect: true })
], t6.prototype, "size");
r4([
  property({ type: Boolean, reflect: true })
], t6.prototype, "tile");
r4([
  property({ type: Boolean, reflect: true })
], t6.prototype, "other");
r4([
  property({ type: Boolean })
], t6.prototype, "showOtherError");
r4([
  property({ type: String })
], t6.prototype, "labelledby");
r4([
  property({ type: Boolean })
], t6.prototype, "hideLabel");
r4([
  query("input")
], t6.prototype, "_inputEl");
customElements.get("nys-radiobutton") || customElements.define("nys-radiobutton", t6);

// ../../nys-select/dist/nys-select.js
var m19 = 0;
function g9(c21) {
  return `${c21}-${Date.now()}-${m19++}`;
}
var w20 = (c21) => {
  class e5 extends c21 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = g9(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return e5;
};
var E11 = (c21) => {
  class e5 extends w20(c21) {
    constructor() {
      super(...arguments), this.__internals = null;
    }
    get internals() {
      if (this.__internals) return this.__internals;
      if (typeof this.attachInternals == "function")
        try {
          this.__internals = this.attachInternals();
        } catch {
          this.__internals = null;
        }
      return this.__internals;
    }
    get defaultRole() {
      return null;
    }
    setHostAria(d21, l17) {
      const h23 = this.internals;
      if (h23 && d21 in h23) {
        h23[d21] = l17;
        return;
      }
      const s13 = x17(d21);
      l17 === null ? this.removeAttribute(s13) : this.setAttribute(s13, l17);
    }
    reflectDefaultSemantics() {
      const d21 = this.defaultRole;
      d21 && this.setHostAria("role", d21);
    }
    connectedCallback() {
      super.connectedCallback(), this.reflectDefaultSemantics();
    }
  }
  return e5;
};
function x17(c21) {
  if (c21 === "role") return "role";
  const e5 = c21.replace(/^aria/, "");
  return "aria-" + e5.charAt(0).toLowerCase() + e5.slice(1);
}
var C7 = (c21) => {
  const e5 = class extends E11(c21) {
    setFormValue(l17) {
      this.internals?.setFormValue(l17 ?? null);
    }
    setValidityFromState(l17, h23, s13) {
      const r13 = this.internals;
      if (!r13) return;
      const o18 = Object.values(l17).some(Boolean);
      o18 ? r13.setValidity(l17, h23 ?? "Invalid value", s13) : r13.setValidity({}), this.setHostAria("ariaInvalid", o18 ? "true" : "false");
    }
    clearValidity() {
      this.internals?.setValidity({}), this.setHostAria("ariaInvalid", "false");
    }
    checkValidity() {
      return this.internals?.checkValidity() ?? true;
    }
    reportValidity() {
      return this.internals?.reportValidity() ?? true;
    }
    formResetCallback() {
      this.clearValidity();
    }
  };
  return e5.formAssociated = true, e5;
};
var V6 = C7(LitElement);
var $11 = ':host{--_nys-select-width: 100%;--_nys-select-height: var(--nys-size-500, 40px);--_nys-select-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-select-font-size: var(--nys-font-size-ui-md, 16px);--_nys-select-font-weight: var(--nys-font-weight-regular, 400);--_nys-select-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-select-gap: var(--nys-space-50, 4px);--_nys-select-border-radius: var(--nys-radius-md, 4px);--_nys-select-padding: var(--nys-space-100, 8px) var(--nys-space-400, 32px) var(--nys-space-100, 8px) var(--nys-space-100, 8px);--_nys-select-color: var(--nys-color-text, #1b1b1b);--_nys-select-color--error: var( --nys-color-danger, var(--nys-color-red-600, #b52c2c) );--_nys-select-background-color: var(--nys-color-ink-reverse, #ffffff);--_nys-select-background-color--disabled: var( --nys-color-neutral-10, #f6f6f6 );--_nys-select-color--disabled: var(--nys-color-text-disabled, #bec0c1);--_nys-select-border-width: var(--nys-border-width-sm, 1px);--_nys-select-border-color: var(--nys-color-neutral-400, #909395);--_nys-select-border-color--hover: var(--nys-color-neutral-900, #1b1b1b);--_nys-select-border-color--focus: var(--nys-color-focus, #004dd1);--_nys-select-border-color--disabled: var(--nys-color-neutral-200, #bec0c1);--_nys-select-border-default: var(--nys-border-width-sm, 1px) solid var(--nys-color-neutral-400, #909395)}:host([inverted]){--_nys-select-border-color--focus: var(--nys-color-focus-reverse, #7aa5e7)}.nys-select{display:flex;flex-direction:column;gap:var(--_nys-select-gap);font-family:var(--_nys-select-font-family)}.nys-select__select{color:var(--_nys-select-color);font-weight:var(--_nys-select-font-weight);font-family:var(--_nys-select-font-family);border-radius:var(--_nys-select-border-radius);border:solid var(--_nys-select-border-width) var(--_nys-select-border-color);font-size:var(--_nys-select-font-size);padding:var(--_nys-select-padding);width:var(--_nys-select-width);height:var(--_nys-select-height);max-width:100%;text-indent:1px;background:var(--_nys-select-background-color);appearance:none;text-overflow:ellipsis}.nys-select__selectwrapper{position:relative;display:inline-block;width:var(--_nys-select-width);max-width:100%}.nys-select__icon{color:var(--_nys-select-color);position:absolute;right:10px;top:50%;transform:translateY(-50%);pointer-events:none}:host([width=sm]){--_nys-select-width: var(--nys-select-form-width-sm, 88px)}:host([width=md]){--_nys-select-width: var(--nys-select-form-width-md, 200px)}:host([width=lg]){--_nys-select-width: var(--nys-select-form-width-lg, 384px)}:host([width=full]){--_nys-select-width: 100%;flex:1}.nys-select__select:hover:not(:disabled){cursor:pointer;border-color:var(--_nys-select-border-color--hover);outline:solid var(--_nys-select-border-width) var(--_nys-select-border-color--hover)}.nys-select__select:focus{border-color:var(--_nys-select-border-color--focus);outline:solid var(--_nys-select-border-width) var(--_nys-select-border-color--focus)}.nys-select__select:disabled{background-color:var(--_nys-select-background-color--disabled);border-color:var(--_nys-select-border-color--disabled);cursor:not-allowed;color:var(--_nys-select-color--disabled)}.nys-select__select:disabled~.nys-select__icon{color:var(--_nys-select-color--disabled)}:host([showError]){--_nys-select-border-default: var(--nys-border-width-sm, 1px) solid var(--_nys-select-color--error)}';
var k11 = Object.defineProperty;
var n11 = (c21, e5, t11, d21) => {
  for (var l17 = void 0, h23 = c21.length - 1, s13; h23 >= 0; h23--)
    (s13 = c21[h23]) && (l17 = s13(e5, t11, l17) || l17);
  return l17 && k11(e5, t11, l17), l17;
};
var p10 = class p11 extends V6 {
  constructor() {
    super(...arguments), this.id = "", this.name = "", this.label = "", this.description = "", this.ariaLabel = "", this.value = "", this.disabled = false, this.required = false, this.optional = false, this.tooltip = "", this.form = null, this.inverted = false, this.showError = false, this.errorMessage = "", this.width = "full", this._originalErrorMessage = "", this._hasUserInteracted = false;
  }
  // need this flag for "eager mode"
  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   * Form association, ElementInternals, and id generation are provided by
   * NysFormControlElement (@nysds/internals).
   */
  connectedCallback() {
    super.connectedCallback(), this._originalErrorMessage = this.errorMessage ?? "", this.addEventListener("invalid", this._handleInvalid);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("invalid", this._handleInvalid);
  }
  firstUpdated() {
    this._setValue();
  }
  _handleSlotChange() {
    const e5 = this.shadowRoot?.querySelector(
      'slot:not([name="description"])'
    ), t11 = this.shadowRoot?.querySelector("select");
    if (!e5 || !t11) return;
    if (Array.from(t11.children).forEach((s13) => {
      s13.hasAttribute("data-native") || s13.remove();
    }), e5.assignedElements({ flatten: true }).forEach((s13) => {
      if (s13 instanceof s7) {
        const r13 = document.createElement("option");
        r13.value = s13.value, r13.textContent = s13.label || s13.textContent?.trim() || "", r13.disabled = s13.disabled, r13.selected = s13.selected, t11.appendChild(r13);
        return;
      }
      if (s13.tagName === "OPTION") {
        const r13 = s13, o18 = r13.cloneNode(true);
        o18.disabled = r13.disabled, o18.selected = r13.selected, t11.appendChild(o18);
        return;
      }
      if (s13.tagName === "OPTGROUP") {
        const r13 = document.createElement("optgroup");
        r13.label = s13.label, s13.disabled && (r13.disabled = true), Array.from(s13.children).forEach((o18) => {
          if (o18 instanceof s7) {
            const u17 = document.createElement("option");
            u17.value = o18.value, u17.textContent = o18.label || o18.textContent?.trim() || "", u17.disabled = o18.disabled, u17.selected = o18.selected, r13.appendChild(u17);
          } else if (o18.tagName === "OPTION") {
            const u17 = o18.cloneNode(true);
            r13.appendChild(u17);
          }
        }), t11.appendChild(r13);
        return;
      }
    }), !!this.value && Array.from(t11.options).some((s13) => s13.value === this.value)) {
      t11.value = this.value;
      return;
    }
    const h23 = Array.from(t11.options).find((s13) => s13.selected);
    h23 && (this.value = h23.value, this.setFormValue(this.value));
  }
  /**
   * Form Integration
   * --------------------------------------------------------------------------
   */
  _setValue() {
    this.setFormValue(this.value), this._manageRequire();
  }
  _manageRequire() {
    const e5 = this.shadowRoot?.querySelector("select");
    if (!e5) return;
    const t11 = this.errorMessage || "This field is required.";
    this.required && !this.value ? this.setValidityFromState({ valueMissing: true }, t11, e5) : (this.clearValidity(), this._hasUserInteracted = false);
  }
  _setValidityMessage(e5 = "") {
    const t11 = this.shadowRoot?.querySelector("select");
    t11 && (this.showError = !!e5, this._originalErrorMessage?.trim() && e5 !== "" ? this.errorMessage = this._originalErrorMessage : this.errorMessage = e5, e5 ? this.setValidityFromState(
      { customError: true },
      this.errorMessage,
      t11
    ) : this.clearValidity());
  }
  _validate() {
    const e5 = this.shadowRoot?.querySelector("select");
    if (!e5) return;
    let t11 = e5.validationMessage;
    this._manageRequire(), this._setValidityMessage(t11);
  }
  // This callback is automatically called when the parent form is reset.
  formResetCallback() {
    this.value = "";
    const e5 = this.shadowRoot?.querySelector("select");
    e5 && (e5.value = "", Array.from(e5.options).forEach((t11) => t11.selected = false)), this.showError = false, this.errorMessage = "", this.clearValidity(), this.requestUpdate();
  }
  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  // This helper function is called to perform the element's native validation.
  checkValidity() {
    const e5 = this.shadowRoot?.querySelector("select");
    return e5 ? e5.checkValidity() : true;
  }
  _handleInvalid(e5) {
    e5.preventDefault(), this._hasUserInteracted = true, this._validate(), this.showError = true;
    const t11 = this.shadowRoot?.querySelector("select");
    if (t11) {
      const d21 = this.internals?.form;
      d21 ? Array.from(d21.elements).find(
        (s13) => typeof s13.checkValidity == "function" && !s13.checkValidity()
      ) === this && t11.focus() : t11.focus();
    }
  }
  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */
  // Handle change event to bubble up selected value
  _handleChange(e5) {
    const t11 = e5.target;
    this.value = t11.value, this.setFormValue(this.value), this.required && this.value && (this.showError = false, this.errorMessage = "", this.clearValidity()), this._hasUserInteracted && this._validate(), this.dispatchEvent(
      new CustomEvent("nys-change", {
        detail: { id: this.id, value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }
  // Handle focus event
  _handleFocus() {
    this.dispatchEvent(
      new Event("nys-focus", { bubbles: true, composed: true })
    );
  }
  // Handle blur event
  _handleBlur() {
    this._hasUserInteracted || (this._hasUserInteracted = true), this._validate(), this.dispatchEvent(
      new Event("nys-blur", { bubbles: true, composed: true })
    );
  }
  // Check if the current value matches any option, and if so, set it as selected
  updated(e5) {
    if (super.updated(e5), e5.has("value")) {
      const t11 = this.shadowRoot?.querySelector("select");
      t11 && (t11.value = this.value), this._setValue();
    }
  }
  render() {
    return html`
      <div class="nys-select">
        <nys-label
          id="${this.id}--label"
          label=${this.label}
          description=${this.description}
          flag=${this.required ? "required" : this.optional ? "optional" : ""}
          tooltip=${this.tooltip}
          ?inverted=${this.inverted}
        >
          <slot name="description" slot="description">${this.description}</slot>
        </nys-label>
        <div class="nys-select__selectwrapper">
          <select
            class="nys-select__select"
            name=${this.name}
            id=${this.id + "--native"}
            form=${ifDefined(this.form || void 0)}
            ?disabled=${this.disabled}
            ?required=${this.required}
            aria-disabled="${this.disabled}"
            aria-labelledby=${ifDefined(
      this.label ? this.id + "--label" : void 0
    )}
            aria-label=${ifDefined(
      !this.label && this.ariaLabel ? this.ariaLabel : void 0
    )}
            aria-invalid=${this.showError ? "true" : "false"}
            aria-errormessage=${this.id + "--error"}
            aria-describedby=${ifDefined(
      this.showError ? this.id + "--error" : void 0
    )}
            .value=${this.value}
            @focus="${this._handleFocus}"
            @blur="${this._handleBlur}"
            @change="${this._handleChange}"
          >
            <option data-native hidden disabled value=""></option>
          </select>
          <slot
            style="display: none;"
            @slotchange=${this._handleSlotChange}
          ></slot>
          <nys-icon
            name="chevron_down"
            size="2xl"
            class="nys-select__icon"
          ></nys-icon>
        </div>
        <nys-errormessage
          id=${this.id + "--error"}
          ?showError=${this.showError}
          errorMessage=${this.errorMessage}
        ></nys-errormessage>
      </div>
    `;
  }
};
p10.styles = unsafeCSS($11), p10.shadowRootOptions = __spreadProps(__spreadValues({}, LitElement.shadowRootOptions), {
  delegatesFocus: true
});
var i14 = p10;
n11([
  property({ type: String, reflect: true })
], i14.prototype, "id");
n11([
  property({ type: String, reflect: true })
], i14.prototype, "name");
n11([
  property({ type: String })
], i14.prototype, "label");
n11([
  property({ type: String })
], i14.prototype, "description");
n11([
  property({ type: String })
], i14.prototype, "ariaLabel");
n11([
  property({ type: String })
], i14.prototype, "value");
n11([
  property({ type: Boolean, reflect: true })
], i14.prototype, "disabled");
n11([
  property({ type: Boolean, reflect: true })
], i14.prototype, "required");
n11([
  property({ type: Boolean, reflect: true })
], i14.prototype, "optional");
n11([
  property({ type: String })
], i14.prototype, "tooltip");
n11([
  property({ type: String, reflect: true })
], i14.prototype, "form");
n11([
  property({ type: Boolean, reflect: true })
], i14.prototype, "inverted");
n11([
  property({ type: Boolean, reflect: true })
], i14.prototype, "showError");
n11([
  property({ type: String })
], i14.prototype, "errorMessage");
n11([
  property({ type: String, reflect: true })
], i14.prototype, "width");
customElements.get("nys-select") || customElements.define("nys-select", i14);

// ../../nys-skipnav/dist/nys-skipnav.js
var y11 = 0;
function f16(e5) {
  return `${e5}-${Date.now()}-${y11++}`;
}
var k12 = (e5) => {
  class n13 extends e5 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = f16(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return n13;
};
var u12 = k12(LitElement);
var h16 = '@charset "UTF-8";:host{--_nys-skipnav-padding--y: var(--nys-space-100, 8px);--_nys-skipnav-padding--x: var(--nys-space-200, 16px);--_nys-skipnav-gap: var(--nys-space-100, 8px);--_nys-skipnav-border-width: var(--nys-border-width-md, 2px);--_nys-skipnav-border-color: var(--nys-color-link, #004dd1);--_nys-skipnav-border-radius: var(--nys-radius-sm, 2px);--_nys-skipnav-outline-width: var(--nys-border-width-md, 2px);--_nys-skipnav-outline-offset: var(--nys-space-2px, 2px);--_nys-skipnav-outline-color: var(--nys-color-focus, #004dd1);--_nys-skipnav-font-size: var(--nys-font-size-ui-md, 16px);--_nys-skipnav-font-weight: var(--nys-font-weight-semibold, 600);--_nys-skipnav-letter-spacing: var(--nys-font-letterspacing-ui-md, .044px);--_nys-skipnav-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-skipnav-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-skipnav-color: var(--nys-color-link, #004dd1);--_nys-skipnav-background-color: var(--nys-color-surface, #ffffff)}.nys-skipnav__link{position:absolute;left:auto;top:-4.8rem;display:inline-flex;padding:var(--_nys-skipnav-padding--y) var(--_nys-skipnav-padding--x);align-items:flex-end;gap:var(--_nys-skipnav-gap);background:var(--_nys-skipnav-background-color);color:var(--_nys-skipnav-color);border:var(--_nys-skipnav-border-width) solid var(--_nys-skipnav-border-color);border-radius:var(--_nys-skipnav-border-radius);font-family:var(--_nys-skipnav-font-family);font-size:var(--_nys-skipnav-font-size);font-style:normal;font-weight:var(--_nys-skipnav-font-weight);line-height:var(--_nys-skipnav-line-height);letter-spacing:var(--_nys-skipnav-letter-spacing);text-decoration-line:underline;text-decoration-style:solid;text-decoration-skip-ink:auto;text-decoration-thickness:7%;text-underline-offset:auto;text-underline-position:from-font;z-index:100;transition:.15s ease-in-out}.nys-skipnav__link:focus,.nys-skipnav__link.show{top:0;left:auto}.nys-skipnav__link:focus-visible{outline:solid var(--_nys-skipnav-outline-width) var(--_nys-skipnav-outline-color);outline-offset:var(--_nys-skipnav-outline-offset)}';
var _11 = Object.defineProperty;
var d15 = (e5, n13, s13, m32) => {
  for (var i21 = void 0, a12 = e5.length - 1, r13; a12 >= 0; a12--)
    (r13 = e5[a12]) && (i21 = r13(n13, s13, i21) || i21);
  return i21 && _11(n13, s13, i21), i21;
};
var o11 = class o12 extends u12 {
  constructor() {
    super(), this.id = "", this.href = "";
  }
  // super.connectedCallback() (NysElement) auto-assigns a unique id
  // (prefix = localName) when one is not provided. The accessible "skip link"
  // role lives on the inner native <a> element, so defaultRole stays null and no
  // role is reflected onto the host.
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */
  _handleFocus() {
    this.shadowRoot?.querySelector(".nys-skipnav__link")?.classList.add("show");
  }
  _handleBlur() {
    this.shadowRoot?.querySelector(".nys-skipnav__link")?.classList.remove("show");
  }
  _handleClick() {
    const n13 = (this.href || "#main-content").replace("#", ""), s13 = document.getElementById(n13);
    s13 && (s13.setAttribute("tabindex", "-1"), s13.focus(), s13.style.outline = "none");
  }
  render() {
    return html`
      <div class="nys-skipnav">
        <a
          href=${this.href ? this.href : "#main-content"}
          tabindex="0"
          class="nys-skipnav__link"
          @focus="${this._handleFocus}"
          @blur="${this._handleBlur}"
          @click="${this._handleClick}"
        >
          Skip to main content
        </a>
      </div>
    `;
  }
};
o11.styles = unsafeCSS(h16);
var t7 = o11;
d15([
  property({ type: String, reflect: true })
], t7.prototype, "id");
d15([
  property({ type: String })
], t7.prototype, "href");
customElements.get("nys-skipnav") || customElements.define("nys-skipnav", t7);

// ../../nys-stepper/dist/chunks/nys-step-BQsOhKPZ.js
var u13 = 0;
function v18(o18) {
  return `${o18}-${Date.now()}-${u13++}`;
}
var x18 = (o18) => {
  class s13 extends o18 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = v18(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return s13;
};
var b16 = x18(LitElement);
var _12 = ':host{--_nys-stepper-font-size: var(--nys-font-size-ui-md, 16px);--_nys-stepper-font-weight: var(--nys-font-weight-semibold, 600);--_nys-stepper-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-stepper-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-step-color: var(--nys-color-text, #1b1b1b);--_nys-stepper-background-color: var(--nys-color-surface-raised, #f6f6f6)}.nys-stepper{font-family:var(--_nys-stepper-font-family);font-size:var(--_nys-stepper-font-size);font-weight:var(--_nys-stepper-font-weight);line-height:var(--_nys-stepper-line-height);display:flex;flex-direction:column;counter-reset:step;background-color:var(--_nys-stepper-background-color);max-width:100%;height:100%}.nys-stepper__header{display:flex;flex-direction:column;padding:var(--nys-space-400, 32px) var(--nys-space-400, 32px) var(--nys-space-150, 12px)}::slotted(div[slot=actions]){display:flex;flex-wrap:wrap;justify-content:flex-start;gap:var(--nys-space-100, 8px);margin-bottom:var(--nys-space-300, 24px)}.nys-stepper__counter{display:none;text-decoration:underline;text-decoration-style:solid;text-decoration-skip-ink:auto;text-decoration-thickness:7%;text-underline-offset:auto;text-underline-position:from-font;color:var(--nys-color-text, #1b1b1b);text-overflow:ellipsis;font-family:var(--nys-font-family-ui, "Proxima Nova");font-size:var(--nys-font-size-ui-md, 16px);font-style:normal;font-weight:400;line-height:var(--nys-font-size-ui-md, 16px);cursor:pointer;width:fit-content}.nys-stepper__steps{list-style:none;margin:0;display:flex;flex-direction:column;padding:var(--nys-space-150, 12px) var(--nys-space-400, 32px) var(--nys-space-400, 32px);overflow-y:scroll;height:fit-content;height:-moz-available;scrollbar-width:none;background:linear-gradient(var(--nys-color-surface-raised, #f6f6f6) 30%,rgba(255,255,255,0)) center top,linear-gradient(rgba(255,255,255,0),var(--nys-color-surface-raised, #f6f6f6) 70%) center bottom,linear-gradient(to bottom,#63636333,#0000) top,linear-gradient(to top,#63636333,#0000) bottom;background-repeat:no-repeat;background-size:100% 40px,100% 40px,100% 14px,100% 14px;background-attachment:local,local,scroll,scroll;background-color:var(--nys-color-surface-raised, #f6f6f6)}.nys-step{position:relative;counter-increment:step;display:flex;flex-direction:column}.nys-step__contentwrapper{appearance:none;-webkit-appearance:none;background:none;border:none;margin:0;padding:0;font:inherit;color:inherit;text-align:inherit;display:flex;flex-direction:row;align-items:center;gap:var(--nys-space-150, 12px);cursor:default;width:fit-content}.nys-step__contentwrapper:focus-visible{outline:solid var(--nys-color-focus, #004dd1) var(--nys-border-width-md, 2px);outline-offset:var(--nys-space-2px, 2px);border-radius:var(--nys-radius-md, 4px)}.nys-step__linewrapper{width:24px;display:flex;justify-content:center}.nys-step__line{width:var(--nys-size-1px, 1px);height:var(--nys-size-300, 24px);border-radius:var(--nys-radius-round, 1776px);background:var(--nys-color-black-transparent-200, rgba(27, 27, 27, .2));margin:var(--nys-space-100, 8px) 0}.nys-step__number{border-radius:var(--nys-radius-round, 1776px);border:var(--nys-size-1px, 1px) solid var(--nys-color-neutral-400, #909395);background:var(--nys-color-white-transparent-900, rgba(255, 255, 255, .9));width:var(--nys-size-300, 24px);min-width:var(--nys-size-300, 24px);max-width:var(--nys-size-300, 24px);height:var(--nys-size-300, 24px);min-height:var(--nys-size-300, 24px);max-height:var(--nys-size-300, 24px);display:flex;align-items:center;justify-content:center;text-align:center;color:var(--nys-color-text, #1b1b1b)}:host([previous]) .nys-step__number,:host([previous]) .nys-step__line,:host([current]) .nys-step__number,:host([current]) .nys-step__line{background-color:var(--nys-color-theme-stronger, #081b2b);color:var(--nys-color-text-reverse, #ffffff);border-color:var(--nys-color-theme-stronger, #081b2b)}:host([selected]) .nys-step__number{background-color:var(--nys-color-theme, #154973);color:var(--nys-color-text-reverse, #ffffff);border-color:var(--nys-color-theme, #154973);outline:var(--nys-size-50, 4px) solid var(--nys-color-theme-weak, #cddde9)}:host([first]) .nys-step__linewrapper{display:none!important}.nys-step__content{display:flex;flex-direction:column;gap:var(--nys-space-100, 8px)}.nys-step__label{color:var(--_nys-step-color);font-family:var(--_nys-stepper-font-family);font-size:var(--_nys-stepper-font-size);font-weight:var(--_nys-stepper-font-weight);line-height:var(--_nys-stepper-line-height);line-height:var(--nys-font-size-ui-md, 16px);letter-spacing:var(--nys-font-letterspacing-ui-md, .044px);text-decoration-style:solid;text-decoration-skip-ink:auto;text-decoration-thickness:var(7%, 1.12px);text-underline-offset:auto}:host([current]) .nys-step__label,:host([previous]) .nys-step__label{text-decoration-line:underline}:host([current]) .nys-step__contentwrapper,:host([previous]) .nys-step__contentwrapper{cursor:pointer}:host([selected]) .nys-step__label{font-weight:700;text-decoration-line:none}:host([selected]) .nys-step__contentwrapper{cursor:default}:host([selected]) .nys-step__contentwrapper:focus-visible{outline-offset:6px}@media(max-width:1023px){.nys-stepper{max-width:1023px;width:100%}.nys-stepper__header{flex-direction:row-reverse;justify-content:space-between;padding:var(--nys-space-150, 12px);gap:var(--nys-space-200, 16px)}.nys-stepper__headertext{flex:1 1 0;min-width:0}::slotted(div[slot=actions]){margin-bottom:0;min-width:0;justify-content:end}.nys-stepper__counter{display:block}.nys-stepper__steps{flex-direction:row;gap:var(--nys-space-2px, 2px);padding:0}.nys-stepper__steps slot::slotted(*){flex:1}.nys-step__number{border-radius:0;border:none;background-color:var(--nys-color-neutral-200, #bec0c1);height:var(--nys-size-100, 8px);min-height:var(--nys-size-100, 8px);max-height:var(--nys-size-100, 8px);width:100%;min-width:100%;max-width:100%;color:transparent}:host([previous]) .nys-step__number,:host([current]) .nys-step__number{background-color:var(--nys-color-neutral-900, #1b1b1b);color:transparent}:host([selected]) .nys-step__number{background-color:var(--nys-color-theme-mid, #457aa5);outline:none}.nys-step__content,.nys-step__linewrapper{display:none}.nys-step__contentwrapper{cursor:default;pointer-events:none;width:auto}:host([isCompactExpanded]) .nys-step__content,:host([isCompactExpanded]) .nys-step__linewrapper{display:flex}:host([isCompactExpanded]) .nys-stepper__header{padding-bottom:var(--nys-space-250, 20px)}:host([isCompactExpanded]) .nys-stepper__steps{width:-webkit-fill-available;width:-moz-available;z-index:9999;overflow-y:auto;flex-direction:column;gap:0;padding:var(--nys-space-150, 12px) var(--nys-space-400, 32px) var(--nys-space-400, 32px)}:host([isCompactExpanded]) .nys-stepper__steps slot::slotted(*){flex:none}:host([isCompactExpanded]) .nys-step__number{border-radius:var(--nys-radius-round, 1776px);border:1px solid var(--nys-color-neutral-400, #909395);background:var(--nys-color-white-transparent-900, rgba(255, 255, 255, .9));width:var(--nys-space-300, 24px);min-width:var(--nys-space-300, 24px);max-width:var(--nys-space-300, 24px);height:var(--nys-space-300, 24px);min-height:var(--nys-space-300, 24px);max-height:var(--nys-space-300, 24px);color:var(--nys-color-text, #1b1b1b)}:host([isCompactExpanded][previous]) .nys-step__number,:host([isCompactExpanded][previous]) .nys-step__line,:host([isCompactExpanded][current]) .nys-step__number,:host([isCompactExpanded][current]) .nys-step__line{background:var(--nys-color-theme-stronger, #081b2b);color:var(--nys-color-text-reverse, #ffffff);border-color:var(--nys-color-theme-stronger, #081b2b)}:host([isCompactExpanded][selected]) .nys-step__number{background:var(--nys-color-theme, #154973);color:var(--nys-color-text-reverse, #ffffff);border-color:var(--nys-color-theme, #154973);outline:4px solid var(--nys-color-theme-weak, #cddde9)}:host([isCompactExpanded]) .nys-step__contentwrapper{pointer-events:all}}';
var m20 = Object.defineProperty;
var r5 = (o18, s13, t11, p19) => {
  for (var a12 = void 0, l17 = o18.length - 1, d21; l17 >= 0; l17--)
    (d21 = o18[l17]) && (a12 = d21(s13, t11, a12) || a12);
  return a12 && m20(s13, t11, a12), a12;
};
var c12 = class c13 extends b16 {
  constructor() {
    super(...arguments), this.selected = false, this.current = false, this.label = "", this.href = "", this.previous = false, this.isCompactExpanded = false, this.stepNumber = 0;
  }
  /** A step is navigable (focusable + activatable) when it is the displayed,
   * current, or a previously-reached step. Future steps are inert. */
  get _navigable() {
    return this.selected || this.current || this.hasAttribute("previous");
  }
  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------
  /**
   * Sets `role="listitem"` on the host so the parent stepper's `<ol>` (which
   * only ever slots `<nys-step>` elements, never real `<li>`s) still forms a
   * valid ARIA list. This is what lets assistive technology announce each
   * step's position and count. Uses a plain attribute (not ElementInternals)
   * so `getAttribute("role")` keeps working for existing consumers/tests,
   * matching the convention used by `<nys-tab>`.
   */
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "listitem");
  }
  _handleActivate(s13) {
    typeof this.onClick == "function" && this.onClick(s13);
    const t11 = new CustomEvent("nys-step-click", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: { href: this.href, label: this.label }
    });
    (this.hasAttribute("previous") || this.current) && !this.selected && (this.dispatchEvent(t11), !t11.defaultPrevented && this.href && (window.location.href = this.href));
  }
  render() {
    const s13 = this._navigable, t11 = this.stepNumber ? `${this.label}, step ${this.stepNumber}` : `${this.label} Step`, p19 = html`
      <div class="nys-step__number" aria-hidden="true">${this.stepNumber}</div>
      <div class="nys-step__content">
        <div class="nys-step__label">${this.label}</div>
      </div>
    `;
    return html`
      <div class="nys-step">
        <div class="nys-step__linewrapper">
          <div class="nys-step__line"></div>
        </div>
        ${s13 ? html`
              <button
                type="button"
                class="nys-step__contentwrapper"
                @click=${this._handleActivate}
                aria-label=${t11}
                aria-current=${ifDefined(this.current ? "step" : void 0)}
              >
                ${p19}
              </button>
            ` : html`
              <div
                class="nys-step__contentwrapper"
                aria-label=${t11}
              >
                ${p19}
              </div>
            `}
      </div>
    `;
  }
};
c12.styles = unsafeCSS(_12);
var e3 = c12;
r5([
  property({ type: Boolean, reflect: true })
], e3.prototype, "selected");
r5([
  property({ type: Boolean, reflect: true })
], e3.prototype, "current");
r5([
  property({ type: String })
], e3.prototype, "label");
r5([
  property({ type: String })
], e3.prototype, "href");
r5([
  property({ type: Boolean, reflect: true })
], e3.prototype, "previous");
r5([
  property({ type: Boolean })
], e3.prototype, "isCompactExpanded");
r5([
  property({ attribute: false })
], e3.prototype, "onClick");
r5([
  property({ type: Number })
], e3.prototype, "stepNumber");
customElements.get("nys-step") || customElements.define("nys-step", e3);

// ../../nys-stepper/dist/nys-stepper.js
var m21 = Object.defineProperty;
var l10 = (d21, t11, n13, s13) => {
  for (var i21 = void 0, e5 = d21.length - 1, r13; e5 >= 0; e5--)
    (r13 = d21[e5]) && (i21 = r13(t11, n13, i21) || i21);
  return i21 && m21(t11, n13, i21), i21;
};
var c14 = class c15 extends b16 {
  constructor() {
    super(...arguments), this.id = "", this.name = "", this.label = "", this.counterText = "initial", this.isCompactExpanded = false, this._stepsNumbered = false, this._onStepClick = async (t11) => {
      const n13 = t11.composedPath().find(
        (r13) => r13 instanceof HTMLElement && r13.tagName.toLowerCase() === "nys-step"
      );
      if (!n13) return;
      const s13 = Array.from(this.querySelectorAll("nys-step")), i21 = s13.findIndex(
        (r13) => r13.hasAttribute("current")
      ), e5 = s13.indexOf(n13);
      i21 !== -1 && e5 > i21 || n13.hasAttribute("selected") || (s13.forEach((r13) => r13.removeAttribute("selected")), n13.setAttribute("selected", ""), this._updateCounter(), this.isCompactExpanded = false);
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("nys-step-click", this._onStepClick), requestAnimationFrame(() => this._validateSteps());
  }
  disconnectedCallback() {
    this.removeEventListener("nys-step-click", this._onStepClick), super.disconnectedCallback();
  }
  _validateSteps() {
    Array.from(this.children).forEach((t11) => {
      const n13 = t11 instanceof HTMLElement && t11.tagName.toLowerCase() === "nys-step", s13 = t11 instanceof HTMLElement && t11.hasAttribute("slot") && t11.getAttribute("slot") === "actions";
      !n13 && !s13 && (console.warn(
        "Only <nys-step> elements or the <div slot='actions'> container are allowed as direct children of <nys-stepper>. Removing:",
        t11
      ), t11.remove());
    });
  }
  _validateButtonSlot(t11) {
    const s13 = t11.target.assignedElements();
    if (s13.length !== 1 || s13[0].tagName.toLowerCase() !== "div") {
      console.warn(
        "The 'actions' slot must have exactly one <div> as a direct child."
      );
      return;
    }
    const i21 = s13[0];
    Array.from(i21.children).forEach((e5) => {
      e5 instanceof HTMLElement && e5.tagName.toLowerCase() === "nys-button" ? (e5.setAttribute("size", "sm"), e5.hasAttribute("fullWidth") && (e5.style.flex = "1 1 0")) : (console.warn(
        "The <div> inside 'actions' slot only accepts <nys-button> elements. Removing invalid node:",
        e5
      ), e5.remove());
    });
  }
  _updateCounter() {
    let t11;
    if (this.isCompactExpanded)
      t11 = "Back to Form", this.style.height = "-webkit-fit-content", this.style.height = "-moz-fit-content", this.style.height = "fit-content";
    else {
      this.style.height = "auto";
      const n13 = this.querySelectorAll("nys-step"), s13 = Array.from(n13).findIndex(
        (e5) => e5.hasAttribute("selected")
      ), i21 = n13.length;
      t11 = s13 >= 0 ? `Step ${s13 + 1} of ${i21}` : `Step 1 of ${i21}`;
    }
    t11 !== this.counterText && (this.counterText = t11);
  }
  willUpdate() {
    const t11 = this.querySelectorAll("nys-step");
    this._stepsNumbered || (t11.forEach((e5, r13) => {
      e5.stepNumber = r13 + 1;
    }), this._stepsNumbered = true);
    let n13 = false, s13 = false, i21 = false;
    t11.forEach((e5, r13) => {
      e5.current && (i21 ? e5.current = false : i21 = true), r13 === 0 ? e5.setAttribute("first", "") : e5.removeAttribute("first"), e5.current ? (n13 = true, e5.previous = false) : n13 ? e5.previous = false : e5.previous = true, e5.selected && (n13 || s13 ? e5.selected = false : s13 = true), this.isCompactExpanded ? e5.setAttribute("isCompactExpanded", "") : e5.removeAttribute("isCompactExpanded");
    }), s13 || (i21 ? t11.forEach((e5) => {
      e5.current && !s13 && (e5.setAttribute("selected", ""), s13 = true);
    }) : t11.length > 0 && (t11[0].setAttribute("current", ""), t11[0].setAttribute("selected", ""))), this._updateCounter();
  }
  _toggleCompact() {
    this.isCompactExpanded = !this.isCompactExpanded;
  }
  _handleCounterKeydown(t11) {
    (t11.key === " " || t11.key === "Enter") && (t11.preventDefault(), this._toggleCompact());
  }
  render() {
    return html`
      <div class="nys-stepper" name=${this.name}>
        <div class="nys-stepper__header">
          <slot name="actions" @slotchange=${this._validateButtonSlot}></slot>
          <div class="nys-stepper__headertext">
            <div class="nys-stepper__label">${this.label}</div>
            <div
              class="nys-stepper__counter"
              @click=${this._toggleCompact}
              @keydown=${this._handleCounterKeydown}
              role="button"
              tabindex="0"
              aria-label=${this.isCompactExpanded ? "Collapse step navigation to view the form" : `Expand step navigation. You are on ${this.counterText}`}
              aria-expanded=${this.isCompactExpanded ? "true" : "false"}
            >
              ${this.counterText}
            </div>
          </div>
        </div>
        <nav
          class="nys-stepper__nav"
          aria-label=${this.label?.trim() ? `${this.label} progress` : "Progress"}
        >
          <ol class="nys-stepper__steps" role="list">
            <slot></slot>
          </ol>
        </nav>
      </div>
    `;
  }
};
c14.styles = unsafeCSS(_12);
var o13 = c14;
l10([
  property({ type: String, reflect: true })
], o13.prototype, "id");
l10([
  property({ type: String, reflect: true })
], o13.prototype, "name");
l10([
  property({ type: String })
], o13.prototype, "label");
l10([
  property({ type: String })
], o13.prototype, "counterText");
l10([
  property({ type: Boolean, reflect: true })
], o13.prototype, "isCompactExpanded");
customElements.get("nys-stepper") || customElements.define("nys-stepper", o13);

// ../../nys-tab/dist/chunks/index-BjbztYaz.js
var i15 = 0;
function r6(e5) {
  return `${e5}-${Date.now()}-${i15++}`;
}
var s9 = (e5) => {
  class t11 extends e5 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = r6(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return t11;
};
var d16 = s9(LitElement);

// ../../nys-tab/dist/chunks/nys-tabgroup-DW9Xw5kp.js
var p12 = ':host{--_nys-tabgroup-gap: var(--nys-space-100, 8px);--_nys-tabgroup-padding: var(--nys-space-50, 4px);--_nys-tabgroup-background-color: var(--nys-color-surface, #ffffff);--_nys-tab-border-width: 3px;--_nys-tab-border-radius: var(--nys-radius-md, 4px);--_nys-tab-border-color: var(--nys-color-neutral-50);--_nys-tab-border-color--hover: var(--nys-color-theme-weak, #cddde9);--_nys-tab-border-color--active: var(--nys-color-theme-mid, #457aa5);--_nys-tab-border-color--disabled: var(--_nys-tab-border-color);--_nys-tab-border-color--selected: var(--nys-color-theme, #154973);--_nys-tab-border-color--selected--hover: var( --nys-color-theme-strong, #0e324f );--_nys-tab-border-color--selected--active: var( --nys-color-theme-stronger, #081b2b );--_nys-tab-background-color: var(--nys-color-surface, #ffffff);--_nys-tab-background-color--hover: var(--nys-color-theme-weaker, #eff6fb);--_nys-tab-background-color--active: var(--nys-color-theme-weak, #cddde9);--_nys-tab-background-color--disabled: var(--_nys-tab-background-color);--_nys-tab-background-color--selected: var(--nys-color-neutral-10, #f6f6f6);--_nys-tab-color: var(--nys-color-text-weak, #4a4d4f);--_nys-tab-color--selected: var(--nys-color-text, #1b1b1b);--_nys-tab-color--disabled: var(--nys-color-text-disabled, #bec0c1);--_nys-tab-padding--x: var(--nys-space-150, 12px);--_nys-tab-padding--y: var(--nys-space-200, 16px);--_nys-tabpanel-padding: var(--nys-space-400, 32px);--_nys-tabpanel-max-height: var(--nys-tabpanel-max-height)}.nys-tab{display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;cursor:pointer;appearance:none;-webkit-appearance:none;padding:var(--_nys-tab-padding--y) var(--_nys-tab-padding--x);border-color:var(--_nys-tab-border-color);border-style:none none solid;border-width:var(--_nys-tab-border-width);border-radius:var(--_nys-tab-border-radius) var(--_nys-tab-border-radius) 0 0;background-color:var(--_nys-tab-background-color);color:var(--_nys-tab-color);font-family:var(--nys-font-family-ui, var(--nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif));font-size:var(--nys-font-size-ui-md, 16px);font-weight:var(--nys-font-weight-semibold, 600);line-height:var(--nys-size-200, 16px);text-decoration:none}:host(:not([disabled])) .nys-tab:hover{background-color:var(--_nys-tab-background-color--hover);border-color:var(--_nys-tab-border-color--hover);color:var(--_nys-tab-color)}:host(:not([disabled])) .nys-tab:active{background-color:var(--_nys-tab-background-color--active);border-color:var(--_nys-tab-border-color--active);color:var(--_nys-tab-color)}:host([disabled]) .nys-tab{background-color:var(--_nys-tab-background-color--disabled);border-color:var(--_nys-tab-border-color--disabled);color:var(--_nys-tab-color--disabled);cursor:not-allowed;pointer-events:auto}:host(:focus-visible){outline:none}:host(:focus-visible) .nys-tab{outline:solid var(--nys-border-width-md, 2px) var(--nys-color-focus, #004dd1);outline-offset:var(--nys-space-2px, 2px)}:host([selected]) .nys-tab{background-color:var(--_nys-tab-background-color--selected);border-color:var(--_nys-tab-border-color--selected);color:var(--_nys-tab-color--selected)}:host([selected]:not([disabled])) .nys-tab:hover{border-color:var(--_nys-tab-border-color--selected--hover)}:host([selected]:not([disabled])) .nys-tab:active{border-color:var(--_nys-tab-border-color--selected--active)}.nys-tabgroup{background-color:var(--_nys-tabgroup-background-color)}.nys-tabgroup__tabs-container{position:relative}.nys-tabgroup__tabs-container .scroll-shadow{position:absolute;top:50%;transform:translateY(-50%);z-index:2;opacity:0;pointer-events:none;transition:opacity .2s;height:calc(var(--nys-space-600, 48px) + var(--_nys-tab-border-width));width:var(--nys-space-200, 16px)}.nys-tabgroup__tabs-container .scroll-shadow--left{left:0;background-image:linear-gradient(to left,transparent,var(--nys-color-neutral-100, #d0d0ce))}.nys-tabgroup__tabs-container .scroll-shadow--right{right:0;background-image:linear-gradient(to right,transparent,var(--nys-color-neutral-100, #d0d0ce))}.nys-tabgroup__tabs-container .scroll-shadow.is-visible{opacity:1}.nys-tabgroup__tabs-container .nys-tabgroup__tabs-background{position:absolute;inset:0;margin:var(--_nys-tabgroup-padding);border-bottom:solid var(--_nys-tab-border-color) var(--_nys-tab-border-width)}.nys-tabgroup__tabs-container .nys-tabgroup__tabs{position:relative;display:flex;gap:var(--_nys-tabgroup-gap);overflow-x:auto;white-space:nowrap;-ms-overflow-style:none;scrollbar-width:none;padding:var(--_nys-tabgroup-padding)}.nys-tabgroup__tabs-container .nys-tabgroup__tabs::-webkit-scrollbar{display:none}.nys-tabgroup__tabs-container .nys-tabgroup__tabs slot{display:contents}';
var u14 = Object.defineProperty;
var b17 = (c21, t11, o18, a12) => {
  for (var r13 = void 0, s13 = c21.length - 1, e5; s13 >= 0; s13--)
    (e5 = c21[s13]) && (r13 = e5(t11, o18, r13) || r13);
  return r13 && u14(t11, o18, r13), r13;
};
var i16 = class i17 extends d16 {
  constructor() {
    super(...arguments), this.id = "", this.name = "", this._updateScrollShadows = () => {
      const { scrollLeft: t11, scrollWidth: o18, clientWidth: a12 } = this._tabsEl, r13 = t11 > 0, s13 = t11 + a12 < o18;
      this._shadowLeft.classList.toggle("is-visible", r13), this._shadowRight.classList.toggle("is-visible", s13);
    }, this._syncChildren = () => {
      const t11 = this._getTabs(), o18 = Array.from(this.children).filter(
        (e5) => e5.tagName.toLowerCase() === "nys-tabpanel"
      );
      t11.forEach((e5) => {
        e5.getAttribute("slot") !== "tab" && e5.setAttribute("slot", "tab");
      }), o18.forEach((e5) => {
        e5.getAttribute("slot") !== "panel" && e5.setAttribute("slot", "panel");
      });
      const a12 = this._pairPanels(t11, o18), r13 = t11.findIndex(
        (e5) => e5.hasAttribute("selected")
      ), s13 = r13 !== -1 ? r13 : 0;
      this._applySelection(t11, a12, s13);
    }, this._handleWheel = (t11) => {
      t11.deltaY !== 0 && (t11.preventDefault(), this._tabsEl.scrollLeft += t11.deltaY);
    };
  }
  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------
  /**
   * Called when the element is inserted into the document.
   * Auto-generates a unique `id` if one was not provided.
   */
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * Called after the element's shadow DOM has been rendered for the first time.
   *
   * Caches references to the tab list and scroll-shadow elements, performs an
   * initial scroll-shadow evaluation, and attaches:
   * - A `scroll` event listener on `_tabsEl` to update shadows on scroll.
   * - A `ResizeObserver` on `_tabsEl` to update shadows when the container
   *   is resized.
   */
  firstUpdated() {
    const t11 = this.shadowRoot;
    this._tabsEl = t11.querySelector(".nys-tabgroup__tabs"), this._shadowLeft = t11.querySelector(".scroll-shadow--left"), this._shadowRight = t11.querySelector(".scroll-shadow--right"), this._updateScrollShadows(), this._tabsEl.addEventListener("scroll", this._updateScrollShadows), this._tabsEl.addEventListener("wheel", this._handleWheel, {
      passive: false
    }), this._resizeObserver = new ResizeObserver(
      () => this._updateScrollShadows()
    ), this._resizeObserver.observe(this._tabsEl);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._tabsEl?.removeEventListener("scroll", this._updateScrollShadows), this._tabsEl?.removeEventListener("wheel", this._handleWheel), this._resizeObserver?.disconnect(), this._resizeObserver = void 0;
  }
  /**
   * Returns all `<nys-tab>` light-DOM children in DOM order.
   *
   * Tabs are projected into the shadow-DOM tablist via the `tab` slot but
   * remain light-DOM children of the group, so they stay reachable by consumer
   * CSS and JavaScript.
   *
   * @returns An array of `HTMLElement` references to every `<nys-tab>` child.
   */
  _getTabs() {
    return Array.from(this.children).filter(
      (t11) => t11.tagName.toLowerCase() === "nys-tab"
    );
  }
  /**
   * Returns the `<nys-tabpanel>` light-DOM children ordered to align with
   * `_getTabs()` — i.e. `panels[i]` is the panel paired with `tabs[i]`.
   *
   * Pairing honors explicit `aria-labelledby` references first, then falls
   * back to source order for the remaining panels. See {@link _pairPanels}.
   *
   * @returns An array of `HTMLElement` references to every `<nys-tabpanel>`,
   *   in tab-paired order.
   */
  _getPanels() {
    const t11 = Array.from(this.children).filter(
      (o18) => o18.tagName.toLowerCase() === "nys-tabpanel"
    );
    return this._pairPanels(this._getTabs(), t11);
  }
  /**
   * Orders `panels` to align 1:1 with `tabs`.
   *
   * A panel is paired with a tab when its `aria-labelledby` matches that tab's
   * `id`; explicit references win over position. Panels without a reference
   * fill the remaining tab slots in source order. Any panels whose reference
   * does not resolve to a tab are appended at the end.
   *
   * Idempotent: after `_applySelection` writes `aria-labelledby` onto every
   * panel, re-running this yields the same order.
   *
   * @param tabs - Ordered `<nys-tab>` elements.
   * @param panels - `<nys-tabpanel>` elements in source order.
   * @returns The panels reordered to tab-paired order.
   */
  _pairPanels(t11, o18) {
    const a12 = /* @__PURE__ */ new Map(), r13 = [];
    o18.forEach((e5) => {
      const n13 = e5.getAttribute("aria-labelledby");
      n13 ? a12.set(n13, e5) : r13.push(e5);
    });
    const s13 = [];
    return t11.forEach((e5) => {
      e5.id && a12.has(e5.id) ? (s13.push(a12.get(e5.id)), a12.delete(e5.id)) : r13.length > 0 && s13.push(r13.shift());
    }), a12.forEach((e5) => s13.push(e5)), s13;
  }
  /**
   * Single source of truth for ARIA wiring, `tabindex`, and panel visibility.
   *
   * For each index `i`:
   * - Sets `selected` / removes `selected` attribute on `tabs[i]`.
   * - Sets `aria-controls` on `tabs[i]` to the `id` of `panels[i]`.
   * - Sets `aria-labelledby` on `panels[i]` to the `id` of `tabs[i]`.
   * - Removes `hidden` from `panels[selectedIndex]`; adds it to all others.
   *
   * Must be called any time the selected tab changes (initial render and
   * subsequent user interactions).
   *
   * @param tabs - Ordered array of `<nys-tab>` elements to update.
   * @param panels - Ordered array of `<nys-tabpanel>` elements to update.
   *   Must be the same length as `tabs` for correct pairing.
   * @param selectedIndex - Zero-based index of the tab/panel pair to activate.
   * @returns void
   */
  _applySelection(t11, o18, a12) {
    t11.forEach((r13, s13) => {
      const e5 = s13 === a12, n13 = o18[s13];
      r13.setAttribute("aria-selected", e5 ? "true" : "false"), r13.setAttribute("tabindex", e5 ? "0" : "-1"), n13?.id && r13.setAttribute("aria-controls", n13.id), e5 ? r13.setAttribute("selected", "") : r13.removeAttribute("selected");
    }), o18.forEach((r13, s13) => {
      const e5 = s13 === a12, n13 = t11[s13];
      n13 && r13.setAttribute("aria-labelledby", n13.id), e5 ? r13.removeAttribute("hidden") : r13.setAttribute("hidden", "");
    });
  }
  /**
   * Handles the `nys-tab-select` custom event bubbled up from a child
   * `<nys-tab>`.
   *
   * Resolves the originating `<nys-tab>` via `composedPath()` (required
   * because the event crosses shadow DOM boundaries), determines its index
   * among the current tab list, and delegates to `_applySelection`.
   *
   * @param e - The `Event` (cast to `CustomEvent`) dispatched by `<nys-tab>`.
   * @returns void
   */
  _handleTabSelect(t11) {
    const o18 = t11.composedPath().find(
      (e5) => e5.tagName?.toLowerCase() === "nys-tab"
    );
    if (!o18) return;
    const a12 = this._getTabs(), r13 = this._getPanels(), s13 = a12.indexOf(o18);
    s13 !== -1 && this._applySelection(a12, r13, s13);
  }
  /**
   * Implements the
   * {@link https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ ARIA Tabs Pattern}
   * keyboard interaction for a horizontal tablist:
   * - `ArrowRight` — moves focus to the next enabled tab (wraps).
   * - `ArrowLeft` — moves focus to the previous enabled tab (wraps).
   * - `Home` — moves focus to the first enabled tab.
   * - `End` — moves focus to the last enabled tab.
   *
   * Handled keys call `preventDefault()` so they don't trigger the browser's
   * default behavior (e.g. Home/End scrolling the page) — WCAG 2.1.1 Keyboard.
   *
   * Focus is moved without changing selection; Enter / Space on the newly
   * focused tab (handled by `<nys-tab>._onKeydown`) confirm selection.
   *
   * The currently focused tab is resolved via `composedPath()` because focus
   * may sit on a shadow-DOM descendant of `<nys-tab>` rather than the host
   * itself.
   *
   * Disabled tabs are excluded from navigation and will never receive focus
   * via arrow keys.
   *
   * @param e - The `KeyboardEvent` from the tablist `keydown` listener.
   * @returns void
   */
  _handleKeydown(t11) {
    const o18 = this._getTabs().filter((e5) => !e5.hasAttribute("disabled"));
    if (o18.length === 0) return;
    const a12 = t11.composedPath().find(
      (e5) => e5.tagName?.toLowerCase() === "nys-tab"
    ), r13 = a12 ? o18.indexOf(a12) : -1;
    if (r13 === -1) return;
    let s13 = r13;
    switch (t11.key) {
      case "ArrowLeft":
        s13 = (r13 - 1 + o18.length) % o18.length;
        break;
      case "ArrowRight":
        s13 = (r13 + 1) % o18.length;
        break;
      case "Home":
        s13 = 0;
        break;
      case "End":
        s13 = o18.length - 1;
        break;
      default:
        return;
    }
    t11.preventDefault(), s13 !== r13 && o18[s13].focus?.();
  }
  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  render() {
    return html`
      <div class="nys-tabgroup" @nys-tab-select=${this._handleTabSelect}>
        <div class="nys-tabgroup__tabs-container">
          <div class="nys-tabgroup__tabs-background"></div>
          <div class="scroll-shadow scroll-shadow--left"></div>
          <div
            class="nys-tabgroup__tabs"
            role="tablist"
            aria-orientation="horizontal"
            aria-label=${this.name}
            @keydown=${this._handleKeydown}
          >
            <slot name="tab" @slotchange=${this._syncChildren}></slot>
          </div>
          <div class="scroll-shadow scroll-shadow--right"></div>
        </div>
        <div class="nys-tabgroup__panels">
          <slot name="panel" @slotchange=${this._syncChildren}></slot>
        </div>
        <slot @slotchange=${this._syncChildren}></slot>
      </div>
    `;
  }
};
i16.styles = unsafeCSS(p12);
var l11 = i16;
b17([
  property({ type: String, reflect: true })
], l11.prototype, "id");
b17([
  property({ type: String })
], l11.prototype, "name");
customElements.get("nys-tabgroup") || customElements.define("nys-tabgroup", l11);

// ../../nys-tab/dist/nys-tabpanel.js
var h17 = ":host{display:block}:host([hidden]){display:none}";
var y12 = "nys-tabpanel{box-sizing:border-box;padding:var(--_nys-tabpanel-padding);background-color:var(--_nys-tabpanel-background-color);max-height:var(--_nys-tabpanel-max-height);overflow-y:auto}";
var b18 = Object.defineProperty;
var f17 = (s13, l17, a12, S12) => {
  for (var t11 = void 0, o18 = s13.length - 1, i21; o18 >= 0; o18--)
    (i21 = s13[o18]) && (t11 = i21(l17, a12, t11) || t11);
  return t11 && b18(l17, a12, t11), t11;
};
var e4 = null;
function m22() {
  e4 || typeof document > "u" || (e4 = new CSSStyleSheet(), e4.replaceSync(y12), document.adoptedStyleSheets = [...document.adoptedStyleSheets, e4]);
}
var r7 = class r8 extends d16 {
  constructor() {
    super(...arguments), this.id = "";
  }
  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------
  connectedCallback() {
    super.connectedCallback(), m22(), this.setAttribute("role", "tabpanel"), this.setAttribute("tabindex", "0");
  }
  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  render() {
    return html`<slot></slot>`;
  }
};
r7.styles = unsafeCSS(h17);
var n12 = r7;
f17([
  property({ type: String, reflect: true })
], n12.prototype, "id");
customElements.get("nys-tabpanel") || customElements.define("nys-tabpanel", n12);

// ../../nys-tab/dist/nys-tab.js
var p13 = Object.defineProperty;
var r9 = (o18, e5, a12, f21) => {
  for (var s13 = void 0, n13 = o18.length - 1, d21; n13 >= 0; n13--)
    (d21 = o18[n13]) && (s13 = d21(e5, a12, s13) || s13);
  return s13 && p13(e5, a12, s13), s13;
};
var l12 = class l13 extends d16 {
  constructor() {
    super(...arguments), this.id = "", this.label = "", this.selected = false, this.disabled = false, this._onKeydown = (e5) => {
      this.disabled || e5.key !== "Enter" && e5.key !== " " || (e5.preventDefault(), this._handleClick());
    }, this._onFocus = () => {
      this.dispatchEvent(
        new CustomEvent("nys-tab-focus", {
          bubbles: true,
          composed: true,
          detail: { id: this.id }
        })
      );
    }, this._onBlur = () => {
      this.dispatchEvent(
        new CustomEvent("nys-tab-blur", {
          bubbles: true,
          composed: true,
          detail: { id: this.id }
        })
      );
    }, this._onClick = () => {
      this._handleClick();
    };
  }
  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------
  /**
   * Sets `role="tab"` and `tabindex="-1"` on the host (the element that AT
   * will read and that receives keyboard focus). Attaches host-level listeners
   * for keydown, focus, blur, and click so that interaction events work
   * correctly on the host element itself.
   *
   * Click is handled at the host level so iOS VoiceOver double-tap (which
   * dispatches `click` directly on the host because of `role="tab"`, bypassing
   * shadow-DOM children) activates the tab. Normal taps land on the inner
   * `<span>` and bubble up to this listener.
   *
   * `<nys-tabgroup>` overrides `tabindex` to `"0"` on the selected tab.
   */
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("role", "tab"), this.setAttribute("tabindex", "-1"), this.hasAttribute("aria-selected") || this.setAttribute("aria-selected", this.selected ? "true" : "false"), this.addEventListener("keydown", this._onKeydown), this.addEventListener("focus", this._onFocus), this.addEventListener("blur", this._onBlur), this.addEventListener("click", this._onClick);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("keydown", this._onKeydown), this.removeEventListener("focus", this._onFocus), this.removeEventListener("blur", this._onBlur), this.removeEventListener("click", this._onClick);
  }
  /**
   * Keeps `aria-disabled` on the host in sync with the `disabled` property so
   * AT perceives the disabled state on the element it actually focuses.
   */
  updated(e5) {
    e5.has("disabled") && (this.disabled ? this.setAttribute("aria-disabled", "true") : this.removeAttribute("aria-disabled"));
  }
  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------
  /**
   * Focuses the host element. The host carries `role="tab"` and `tabindex`,
   * so it is the correct element for AT to land on.
   */
  focus(e5) {
    super.focus(e5);
  }
  /**
   * Focuses the host then dispatches `nys-tab-select`. Called from both the
   * click handler and the keydown handler.
   */
  _handleClick() {
    this.disabled || (this.focus(), this.dispatchEvent(
      new CustomEvent("nys-tab-select", {
        bubbles: true,
        composed: true,
        detail: { id: this.id, label: this.label }
      })
    ));
  }
  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  render() {
    return html`<span class="nys-tab">${this.label}</span>`;
  }
};
l12.styles = unsafeCSS(p12);
var t8 = l12;
r9([
  property({ type: String, reflect: true })
], t8.prototype, "id");
r9([
  property({ type: String })
], t8.prototype, "label");
r9([
  property({ type: Boolean, reflect: true })
], t8.prototype, "selected");
r9([
  property({ type: Boolean, reflect: true })
], t8.prototype, "disabled");
customElements.get("nys-tab") || customElements.define("nys-tab", t8);

// ../../nys-table/dist/nys-table.js
var x19 = 0;
function S9(y17) {
  return `${y17}-${Date.now()}-${x19++}`;
}
var C8 = (y17) => {
  class t11 extends y17 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = S9(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return t11;
};
var A4 = C8(LitElement);
var k13 = ':host{--_nys-table-width: 100%;--_nys-table-radius: var(--nys-radius-xl, 12px);--_nys-table-padding: var(--nys-space-100, 8px);--_nys-table-border-color: transparent;--_nys-table-border-width: 0;--_nys-table-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", Helvetica, Arial, sans-serif ) );--_nys-table-font-size: var(--nys-font-size-ui-md, 16px);--_nys-table-font-weight: var(--nys-font-weight-regular, 400);--_nys-table-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-table-font-weight--th: 700;--_nys-table-padding--caption: var(--nys-space-250, 20px) var(--nys-space-150, 12px);--_nys-table-font-size--caption: var(--nys-font-size-ui-lg, 18px);--_nys-table-font-weight--caption: var(--nys-font-weight-bold, 700);--_nys-table-padding--cell--x: var(--nys-space-150, 12px);--_nys-table-padding--cell--y: var( --nys-table-padding--cell--y, var(--nys-space-200, 16px) );--_nys-table-background-color: var(--nys-color-ink-reverse, #ffffff);--_nys-table-background-color--striped: var(--nys-color-neutral-10, #f6f6f6);--_nys-table-color--code: var(--nys-color-red-600, #b52c2c);--_nys-table-background-color--code: var(--nys-color-neutral-10, #f6f6f6)}:host([bordered]){--_nys-table-border-color: var(--nys-color-neutral-100, #d0d0ce);--_nys-table-border-width: var(--nys-space-1px, 1px)}:host([download]){display:flex;flex-direction:column;gap:var(--nys-space-150, 12px)}.nys-table{width:var(--_nys-table-width)}';
var E12 = 'nys-table table{width:var(--_nys-table-width);border-collapse:collapse;background-color:var(--_nys-table-background-color);font:var(--_nys-table-font-weight) var(--_nys-table-font-size)/var(--_nys-table-line-height) var(--_nys-table-font-family)}nys-table caption{padding:var(--_nys-table-padding--caption);font-size:var(--_nys-table-font-size--caption);font-weight:var(--_nys-table-font-weight--caption);text-align:start}nys-table caption div{display:flex;justify-content:space-between;align-items:center}nys-table td{padding:var(--_nys-table-padding--cell--y) var(--_nys-table-padding--cell--x);border:var(--_nys-table-border-width) solid var(--_nys-table-border-color)}nys-table td code{color:var(--_nys-table-color--code);background-color:var(--_nys-table-background-color--code);padding:var(--nys-space-1px) var(--nys-space-2px);border-radius:var(--nys-radius-md)}nys-table th{border:var(--_nys-table-border-width) solid var(--_nys-table-border-color);overflow:hidden;text-overflow:ellipsis;padding:var(--_nys-table-padding--cell--y) var(--_nys-table-padding--cell--x);text-align:left;font-weight:var(--_nys-table-font-weight--th)}nys-table th:has(nys-button){padding:0}nys-table th nys-button{margin:0;width:-moz-available;width:-webkit-fill-available;width:fill-available;justify-content:space-between;--_nys-button-border-width: 0;--_nys-button-border-radius: 0;--_nys-button-padding--x: var(--_nys-table-padding--cell--x);--_nys-button-justify-content: space-between;--_nys-button-outline-offset: -2px}nys-table th.nys-table__sortedcolumn{background-color:var(--nys-color-theme-weak, #cddde9)}nys-table td.nys-table__sortedcolumn{position:relative;z-index:0}nys-table td.nys-table__sortedcolumn:after{content:"";position:absolute;inset:0;background-color:var(--nys-color-theme, #154973);opacity:.1;pointer-events:none;z-index:-1}nys-table[striped] tbody tr:nth-child(odd){background-color:var(--_nys-table-background-color--striped)}nys-table[sortable] th{cursor:pointer}nys-table .sr-only{border:0!important;clip-path:inset(50%)!important;height:1px!important;overflow:hidden!important;margin:-1px!important;padding:0!important;position:absolute!important;width:1px!important;white-space:nowrap!important}';
var T2 = Object.defineProperty;
var d17 = (y17, t11, r13, e5) => {
  for (var n13 = void 0, s13 = y17.length - 1, o18; s13 >= 0; s13--)
    (o18 = y17[s13]) && (n13 = o18(t11, r13, n13) || n13);
  return n13 && T2(t11, r13, n13), n13;
};
var f18 = null;
function q4() {
  f18 || typeof document > "u" || (f18 = new CSSStyleSheet(), f18.replaceSync(E12), document.adoptedStyleSheets = [...document.adoptedStyleSheets, f18]);
}
var m23 = class m24 extends A4 {
  /**************** Lifecycle Methods ****************/
  constructor() {
    super(), this.id = "", this.name = "", this.striped = false, this.sortable = false, this.bordered = false, this.download = "", this._sortColumn = null, this._sortDirection = "none", this._captionText = "", this._observer = null, this._enhancing = false;
  }
  connectedCallback() {
    super.connectedCallback(), q4();
  }
  firstUpdated() {
    this._setupMutationObserver(), this._handleSlotChange();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._observer?.disconnect();
  }
  willUpdate() {
    const t11 = Array.from(this.children).find(
      (n13) => n13.tagName === "TABLE"
    );
    if (!t11) return;
    const e5 = t11.querySelector("caption")?.textContent?.trim() ?? "";
    this._captionText !== e5 && (this._captionText = e5);
  }
  /******************** Functions ********************/
  // Returns the real slotted <table>. It stays a light-DOM child of the host
  // (projected through the <slot>, never cloned), so it remains reachable by
  // consumer CSS/JS and any embedded components stay interactive.
  _getSlottedTable() {
    return (this.shadowRoot?.querySelector(
      "slot"
    )?.assignedElements({ flatten: true }) ?? []).find((e5) => e5.tagName === "TABLE");
  }
  _observeTable(t11) {
    this._observer?.observe(t11, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
  // Runs `fn` (which mutates the slotted table) with the MutationObserver
  // detached, then re-attaches it. Because we now enhance the real table in
  // place, our own writes would otherwise re-trigger the observer and loop.
  _withObserverPaused(t11, r13) {
    if (this._enhancing) {
      r13();
      return;
    }
    this._enhancing = true, this._observer?.disconnect();
    try {
      r13();
    } finally {
      this._observeTable(t11), this._enhancing = false;
    }
  }
  _handleSlotChange() {
    const t11 = this._getSlottedTable();
    !t11 || this._enhancing || this._withObserverPaused(t11, () => {
      this._normalizeTableDOM(t11), this._applyHeaderScopes(t11), this.sortable && this._addSortIcons(t11);
    });
  }
  _setupMutationObserver() {
    this._observer = new MutationObserver(() => this._handleSlotChange());
    const t11 = this._getSlottedTable();
    t11 && this._observeTable(t11);
  }
  _normalizeTableDOM(t11) {
    const r13 = t11.querySelector("thead"), e5 = t11.querySelector("tbody");
    if (r13 && e5) return;
    const n13 = t11.querySelector(
      "caption"
    ), s13 = Array.from(t11.querySelectorAll("tr"));
    if (s13.length === 0) return;
    const o18 = document.createElement("thead"), l17 = document.createElement("tbody"), c21 = s13.findIndex((a12) => a12.querySelector("th"));
    if (c21 === -1)
      s13.forEach((a12) => l17.appendChild(a12));
    else {
      const a12 = s13[c21];
      o18.appendChild(a12), s13.forEach((b24, p19) => {
        p19 !== c21 && l17.appendChild(b24);
      });
    }
    if (t11.innerHTML = "", n13 && t11.appendChild(n13), this.sortable) {
      const a12 = document.createElement("span");
      if (a12.setAttribute("class", "sr-only"), a12.textContent = "Column headers with buttons are sortable.", n13)
        n13.appendChild(a12);
      else {
        const b24 = document.createElement("caption");
        b24.appendChild(a12), t11.appendChild(b24);
      }
    }
    t11.appendChild(o18), t11.appendChild(l17);
  }
  /**
   * Adds scope="col" to every column-header cell in the table head. Header cells
   * inside the body (row headers) are left untouched so authors can still mark
   * them scope="row" themselves; we only set a scope where one is missing.
   */
  _applyHeaderScopes(t11) {
    t11.querySelectorAll("thead th").forEach((e5) => {
      e5.hasAttribute("scope") || e5.setAttribute("scope", "col");
    });
  }
  _addSortIcons(t11) {
    const r13 = Array.from(t11.querySelectorAll("thead th"));
    r13.length !== 0 && r13.forEach((e5, n13) => {
      if (e5.querySelector("nys-button[part='sort-button']")) return;
      const s13 = e5.textContent?.trim();
      if (!s13) return;
      e5.textContent = "";
      const o18 = document.createElement("nys-button");
      o18.setAttribute("part", "sort-button"), o18.setAttribute("variant", "ghost"), o18.setAttribute("label", s13), o18.setAttribute("fullWidth", "true");
      const l17 = document.createElement("nys-icon");
      l17.setAttribute("slot", "suffix-icon"), l17.setAttribute("name", "height"), l17.setAttribute("size", "24"), l17.setAttribute("color", "var(--nys-color-text-weak, #4a4d4f)"), o18.appendChild(l17), o18.addEventListener("nys-click", (c21) => {
        c21.stopPropagation(), this._onSortClick(n13, t11);
      }), e5.appendChild(o18);
    });
  }
  _updateSortIcons(t11) {
    t11.querySelectorAll("thead th").forEach((e5, n13) => {
      const s13 = e5.querySelector("nys-button[part='sort-button']"), o18 = s13?.querySelector(
        "nys-icon[slot='suffix-icon']"
      );
      if (!(!s13 || !o18))
        if (n13 === this._sortColumn)
          switch (e5.classList.add("nys-table__sortedcolumn"), this._sortDirection) {
            case "asc":
              o18.setAttribute("name", "straight"), o18.setAttribute("color", "var(--nys-color-ink, #1b1b1b)"), o18.style.transform = "rotate(0deg)", e5.setAttribute("aria-sort", "ascending");
              break;
            case "desc":
              o18.setAttribute("name", "straight"), o18.setAttribute("color", "var(--nys-color-ink, #1b1b1b)"), o18.style.transform = "rotate(180deg)", e5.setAttribute("aria-sort", "descending");
              break;
          }
        else
          e5.classList.remove("nys-table__sortedcolumn"), o18.setAttribute("name", "height"), o18.setAttribute("color", "var(--nys-color-text-weak, #4a4d4f)"), o18.style.transform = "", e5.removeAttribute("aria-sort");
    });
  }
  _onSortClick(t11, r13) {
    const n13 = Array.from(r13.querySelectorAll("thead th"))[t11]?.querySelector("nys-button[part='sort-button']")?.getAttribute("label") ?? "", s13 = this._sortColumn !== t11 ? "asc" : this._sortDirection === "asc" ? "desc" : "asc";
    this._emitColumnSortEvent(
      t11,
      n13,
      s13
    ) || (this._sortColumn = t11, this._sortDirection = s13, this._withObserverPaused(r13, () => {
      this._updateSortIcons(r13), this._sortTable(r13, t11, s13);
    }));
  }
  _sortTable(t11, r13, e5) {
    const n13 = t11.querySelector("tbody");
    if (!n13) return;
    const s13 = Array.from(n13.querySelectorAll("tr"));
    s13.sort((o18, l17) => {
      const c21 = o18.children[r13]?.textContent?.trim() ?? "", a12 = l17.children[r13]?.textContent?.trim() ?? "", b24 = Number(c21), p19 = Number(a12);
      let u17;
      return !isNaN(b24) && !isNaN(p19) ? u17 = b24 - p19 : u17 = c21.localeCompare(a12), e5 === "asc" ? u17 : -u17;
    }), s13.forEach((o18) => n13.appendChild(o18)), this._updateSortedColumnStyles(t11);
  }
  _updateSortedColumnStyles(t11) {
    t11.querySelectorAll("tbody tr").forEach((e5) => {
      Array.from(e5.children).forEach((n13, s13) => {
        s13 === this._sortColumn ? n13.classList.add("nys-table__sortedcolumn") : n13.classList.remove("nys-table__sortedcolumn");
      });
    });
  }
  downloadFile() {
    const t11 = document.createElement("a");
    t11.href = this.download, t11.download = this.download.split("/").pop() || "table-data.csv", document.body.appendChild(t11), t11.click(), document.body.removeChild(t11);
  }
  /****************** Event Handlers ******************/
  /**
   * Dispatches the `nys-column-sort` custom event.
   *
   * @param columnIndex - Zero-based index of the sorted column.
   * @param columnLabel - The text label of the sorted column header.
   * @param sortDirection - The new sort direction: "asc", "desc", or "none".
   */
  _emitColumnSortEvent(t11, r13, e5) {
    const n13 = new CustomEvent("nys-column-sort", {
      detail: { columnIndex: t11, columnLabel: r13, sortDirection: e5 },
      bubbles: true,
      composed: true,
      cancelable: true
    });
    return this.dispatchEvent(n13), n13.defaultPrevented;
  }
  /****************** Render ******************/
  render() {
    return html`
      <div class="nys-table">
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
      ${this.download ? html` <nys-button
            id="${this.id}-download-button"
            label=${this._captionText ? `Download ${this._captionText}` : "Download table"}
            size="sm"
            variant="outline"
            prefixIcon="download"
            @nys-click=${this.downloadFile}
          ></nys-button>` : ""}
    `;
  }
};
m23.styles = unsafeCSS(k13);
var i18 = m23;
d17([
  property({ type: String, reflect: true })
], i18.prototype, "id");
d17([
  property({ type: String, reflect: true })
], i18.prototype, "name");
d17([
  property({ type: Boolean, reflect: true })
], i18.prototype, "striped");
d17([
  property({ type: Boolean, reflect: true })
], i18.prototype, "sortable");
d17([
  property({ type: Boolean, reflect: true })
], i18.prototype, "bordered");
d17([
  property({ type: String, reflect: true })
], i18.prototype, "download");
d17([
  state()
], i18.prototype, "_sortColumn");
d17([
  state()
], i18.prototype, "_sortDirection");
d17([
  state()
], i18.prototype, "_captionText");
customElements.get("nys-table") || customElements.define("nys-table", i18);

// ../../nys-textarea/dist/nys-textarea.js
var x20 = 0;
function _13(o18) {
  return `${o18}-${Date.now()}-${x20++}`;
}
var b19 = (o18) => {
  class e5 extends o18 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = _13(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return e5;
};
var m25 = (o18) => {
  class e5 extends b19(o18) {
    constructor() {
      super(...arguments), this.__internals = null;
    }
    get internals() {
      if (this.__internals) return this.__internals;
      if (typeof this.attachInternals == "function")
        try {
          this.__internals = this.attachInternals();
        } catch {
          this.__internals = null;
        }
      return this.__internals;
    }
    get defaultRole() {
      return null;
    }
    setHostAria(n13, i21) {
      const l17 = this.internals;
      if (l17 && n13 in l17) {
        l17[n13] = i21;
        return;
      }
      const d21 = g10(n13);
      i21 === null ? this.removeAttribute(d21) : this.setAttribute(d21, i21);
    }
    reflectDefaultSemantics() {
      const n13 = this.defaultRole;
      n13 && this.setHostAria("role", n13);
    }
    connectedCallback() {
      super.connectedCallback(), this.reflectDefaultSemantics();
    }
  }
  return e5;
};
function g10(o18) {
  if (o18 === "role") return "role";
  const e5 = o18.replace(/^aria/, "");
  return "aria-" + e5.charAt(0).toLowerCase() + e5.slice(1);
}
var w21 = (o18) => {
  const e5 = class extends m25(o18) {
    setFormValue(i21) {
      this.internals?.setFormValue(i21 ?? null);
    }
    setValidityFromState(i21, l17, d21) {
      const u17 = this.internals;
      if (!u17) return;
      const y17 = Object.values(i21).some(Boolean);
      y17 ? u17.setValidity(i21, l17 ?? "Invalid value", d21) : u17.setValidity({}), this.setHostAria("ariaInvalid", y17 ? "true" : "false");
    }
    clearValidity() {
      this.internals?.setValidity({}), this.setHostAria("ariaInvalid", "false");
    }
    checkValidity() {
      return this.internals?.checkValidity() ?? true;
    }
    reportValidity() {
      return this.internals?.reportValidity() ?? true;
    }
    formResetCallback() {
      this.clearValidity();
    }
  };
  return e5.formAssociated = true, e5;
};
var $12 = w21(LitElement);
var S10 = ':host{--_nys-textarea-width: 100%;--_nys-textarea-border-radius: var(--nys-radius-md, 4px);--_nys-textarea-border-width: var(--nys-border-width-sm, 1px);--_nys-textarea-border-color: var(--nys-color-neutral-400, #909395);--_nys-textarea-padding: var(--nys-space-200, 16px);--_nys-textarea-gap: var(--nys-space-50, 4px);--_nys-textarea-color: var(--nys-color-ink, #1b1b1b);--_nys-textarea-color--placeholder: var( --nys-color-text-weaker, var(--nys-color-neutral-500, #797c7f) );--_nys-textarea-outline-color--hover: var(--nys-color-neutral-900, #1b1b1b);--_nys-textarea-outline-width: var(--nys-border-width-sm, 1px);--_nys-textarea-outline-color--focus: var(--nys-color-focus, #004dd1);--_nys-textarea-background-color--disabled: var( --nys-color-neutral-10, #f6f6f6 );--_nys-textarea-border-color--disabled: var(--nys-color-neutral-200, #bec0c1);--_nys-textarea-color--disabled: var( --nys-color-text-disabled, var(--nys-color-neutral-200, #bec0c1) );--_nys-textarea-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-textarea-font-size: var(--nys-font-size-ui-md, 16px);--_nys-textarea-font-weight: var(--nys-font-weight-regular, 400);--_nys-textarea-line-height: var(--nys-font-lineheight-ui-md, 24px);--nys-textarea-letterspacing-ui: var( --nys-font-letterspacing-ui-md, var(--nys-font-letterspacing-400, .044px) )}:host([width=sm]){--_nys-textarea-width: var(--nys-form-width-sm, 88px)}:host([width=md]){--_nys-textarea-width: var(--nys-form-width-md, 200px)}:host([width=lg]){--_nys-textarea-width: var(--nys-form-width-lg, 384px)}:host([width=full]){--_nys-textarea-width: 100%;flex:1}:host([showError]){--_nys-textarea-border-color: var(--nys-color-danger, #b52c2c)}:host([inverted]){--_nys-textarea-outline-color--focus: var(--nys-color-focus-reverse, #7aa5e7)}.nys-textarea{font-weight:var(--_nys-textarea-font-weight);font-family:var(--_nys-textarea-font-family);line-height:var(--_nys-textarea-line-height);letter-spacing:var(--nys-textarea-letterspacing-ui);color:var(--_nys-textarea-color);gap:var(--_nys-textarea-gap);display:flex;flex-direction:column}.nys-textarea__textarea{color:var(--_nys-textarea-color);font-size:var(--_nys-textarea-font-size);font-family:var(--_nys-textarea-font-family);border-radius:var(--_nys-textarea-border-radius);border:solid var(--_nys-textarea-border-color) var(--_nys-textarea-border-width);padding:var(--_nys-textarea-padding);width:var(--_nys-textarea-width);line-height:var(--_nys-textarea-line-height);max-width:var(--_nys-textarea-width);box-sizing:border-box}.nys-textarea__textarea::placeholder{color:var(--_nys-textarea-color--placeholder)}.nys-textarea__textarea.none{resize:none}.nys-textarea__textarea:hover:not(:disabled):not(:focus):not([readonly]){outline:solid var(--_nys-textarea-outline-width) var(--_nys-textarea-outline-color--hover);border-color:var(--_nys-textarea-outline-color--hover)}.nys-textarea__textarea:focus:not([readonly]){outline:solid var(--_nys-textarea-outline-width) var(--_nys-textarea-outline-color--focus);border-color:var(--_nys-textarea-outline-color--focus);caret-color:var(--_nys-textarea-outline-color--focus)}.nys-textarea__textarea:disabled,.nys-textarea__textarea:disabled::placeholder{background-color:var(--_nys-textarea-background-color--disabled);border-color:var(--_nys-textarea-border-color--disabled);color:var(--_nys-textarea-color--disabled);cursor:not-allowed}';
var V7 = Object.defineProperty;
var s10 = (o18, e5, t11, n13) => {
  for (var i21 = void 0, l17 = o18.length - 1, d21; l17 >= 0; l17--)
    (d21 = o18[l17]) && (i21 = d21(e5, t11, i21) || i21);
  return i21 && V7(e5, t11, i21), i21;
};
var c16 = class c17 extends $12 {
  constructor() {
    super(...arguments), this.id = "", this.name = "", this.label = "", this.description = "", this.placeholder = "", this.value = "", this.disabled = false, this.readonly = false, this.required = false, this.optional = false, this.tooltip = "", this.inverted = false, this.form = null, this.maxlength = null, this.width = "full", this.rows = 4, this.resize = "vertical", this.showError = false, this.errorMessage = "", this.ariaLabel = "", this._hasUserInteracted = false;
  }
  // need this flag for "eager mode"
  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   * Form association, ElementInternals, and id generation are provided by
   * NysFormControlElement (@nysds/internals).
   */
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("invalid", this._handleInvalid);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeEventListener("invalid", this._handleInvalid);
  }
  firstUpdated() {
    this._setValue();
  }
  async updated(e5) {
    if (await Promise.resolve(), e5.has("value") && this._setValue(), e5.has("rows") && (this.rows = this.rows ?? 4), e5.has("readonly") || e5.has("required")) {
      const t11 = this.shadowRoot?.querySelector("textarea");
      t11 && (t11.required = this.required && !this.readonly);
    }
  }
  /**
   * Form Integration
   * --------------------------------------------------------------------------
   */
  _setValue() {
    this.setFormValue(this.value), this._manageRequire();
  }
  _manageRequire() {
    const e5 = this.shadowRoot?.querySelector("textarea");
    if (!e5) return;
    const t11 = this.errorMessage || "This field is required";
    this.required && !this.value ? this.setValidityFromState({ valueMissing: true }, t11, e5) : (this.clearValidity(), this._hasUserInteracted = false);
  }
  _setValidityMessage(e5 = "") {
    const t11 = this.shadowRoot?.querySelector("textarea");
    t11 && (this.showError = !!e5, this.errorMessage?.trim() && e5 !== "" && (e5 = this.errorMessage), e5 ? this.setValidityFromState({ customError: true }, e5, t11) : this.clearValidity());
  }
  _validate() {
    const e5 = this.shadowRoot?.querySelector("textarea");
    if (!e5) return;
    let t11 = e5.validationMessage;
    this._setValidityMessage(t11);
  }
  // This callback is automatically called when the parent form is reset.
  formResetCallback() {
    this.value = "";
    const e5 = this.shadowRoot?.querySelector("textarea");
    e5 && (e5.value = "", e5.setAttribute("aria-invalid", "false")), this.showError = false, this.clearValidity(), this.requestUpdate();
  }
  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  // This helper function is called to perform the element's native validation.
  checkValidity() {
    const e5 = this.shadowRoot?.querySelector("textarea");
    return e5 ? e5.checkValidity() : true;
  }
  _handleInvalid(e5) {
    e5.preventDefault(), this._hasUserInteracted = true, this._validate();
    const t11 = this.shadowRoot?.querySelector("textarea");
    if (t11) {
      const n13 = this.internals?.form;
      n13 ? Array.from(n13.elements).find(
        (d21) => typeof d21.checkValidity == "function" && !d21.checkValidity()
      ) === this && t11.focus() : t11.focus();
    }
  }
  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */
  // Handle input event to check pattern validity
  _handleInput(e5) {
    const t11 = e5.target;
    this.value = t11.value, this.setFormValue(this.value), this._hasUserInteracted && this._validate(), this.dispatchEvent(
      new CustomEvent("nys-input", {
        detail: { id: this.id, value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }
  // Handle focus event
  _handleFocus() {
    this.dispatchEvent(
      new Event("nys-focus", { bubbles: true, composed: true })
    );
  }
  // Handle blur event
  _handleBlur() {
    this._hasUserInteracted || (this._hasUserInteracted = true), this._validate(), this.dispatchEvent(
      new Event("nys-blur", { bubbles: true, composed: true })
    );
  }
  _handleSelect(e5) {
    const t11 = e5.target;
    this.value = t11.value, this.dispatchEvent(
      new CustomEvent("nys-select", {
        detail: { id: this.id, value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }
  _handleSelectionChange(e5) {
    const t11 = e5.target;
    this.value = t11.value, this.dispatchEvent(
      new CustomEvent("nys-selectionchange", {
        detail: { id: this.id, value: this.value },
        bubbles: true,
        composed: true
      })
    );
  }
  render() {
    return html`
      <div class="nys-textarea">
        <nys-label
          id="${this.id}--label"
          label=${this.label}
          description=${this.description}
          flag=${this.required && !this.readonly ? "required" : this.optional ? "optional" : ""}
          tooltip=${this.tooltip}
          ?inverted=${this.inverted}
        >
          <slot name="description" slot="description">${this.description}</slot>
        </nys-label>
        <textarea
          class="nys-textarea__textarea ${this.resize}"
          name=${this.name}
          id=${this.id}
          .value=${this.value}
          ?disabled=${this.disabled}
          ?required=${this.required && !this.readonly}
          ?readonly=${this.readonly}
          aria-disabled=${ifDefined(this.disabled ? "true" : void 0)}
          aria-required=${ifDefined(this.required ? "true" : void 0)}
          aria-labelledby=${ifDefined(
      this.label ? this.id + "--label" : void 0
    )}
          aria-label=${ifDefined(
      !this.label && this.ariaLabel ? this.ariaLabel : void 0
    )}
          aria-description=${ifDefined(this.description || void 0)}
          aria-invalid=${this.showError ? "true" : "false"}
          aria-errormessage=${this.id + "--error"}
          aria-describedby=${ifDefined(
      this.showError ? this.id + "--error" : void 0
    )}
          placeholder=${ifDefined(
      this.placeholder ? this.placeholder : void 0
    )}
          maxlength=${ifDefined(this.maxlength ?? void 0)}
          .rows=${this.rows}
          form=${ifDefined(this.form || void 0)}
          @input=${this._handleInput}
          @focus="${this._handleFocus}"
          @blur="${this._handleBlur}"
          @select="${this._handleSelect}"
          @selectionchange="${this._handleSelectionChange}"
        ></textarea>
        <nys-errormessage
          id=${this.id + "--error"}
          ?showError=${this.showError}
          errorMessage=${this.internals.validationMessage || this.errorMessage}
        ></nys-errormessage>
      </div>
    `;
  }
};
c16.styles = unsafeCSS(S10), c16.shadowRootOptions = __spreadProps(__spreadValues({}, LitElement.shadowRootOptions), {
  delegatesFocus: true
});
var r10 = c16;
s10([
  property({ type: String, reflect: true })
], r10.prototype, "id");
s10([
  property({ type: String, reflect: true })
], r10.prototype, "name");
s10([
  property({ type: String })
], r10.prototype, "label");
s10([
  property({ type: String })
], r10.prototype, "description");
s10([
  property({ type: String })
], r10.prototype, "placeholder");
s10([
  property({ type: String })
], r10.prototype, "value");
s10([
  property({ type: Boolean, reflect: true })
], r10.prototype, "disabled");
s10([
  property({ type: Boolean, reflect: true })
], r10.prototype, "readonly");
s10([
  property({ type: Boolean, reflect: true })
], r10.prototype, "required");
s10([
  property({ type: Boolean, reflect: true })
], r10.prototype, "optional");
s10([
  property({ type: String })
], r10.prototype, "tooltip");
s10([
  property({ type: Boolean, reflect: true })
], r10.prototype, "inverted");
s10([
  property({ type: String, reflect: true })
], r10.prototype, "form");
s10([
  property({ type: Number })
], r10.prototype, "maxlength");
s10([
  property({ type: String, reflect: true })
], r10.prototype, "width");
s10([
  property({ type: Number })
], r10.prototype, "rows");
s10([
  property({ type: String, reflect: true })
], r10.prototype, "resize");
s10([
  property({ type: Boolean, reflect: true })
], r10.prototype, "showError");
s10([
  property({ type: String })
], r10.prototype, "errorMessage");
s10([
  property({ type: String })
], r10.prototype, "ariaLabel");
customElements.get("nys-textarea") || customElements.define("nys-textarea", r10);

// ../../nys-toggle/dist/nys-toggle.js
var b20 = 0;
function p14(s13) {
  return `${s13}-${Date.now()}-${b20++}`;
}
var k14 = (s13) => {
  class e5 extends s13 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = p14(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return e5;
};
var f19 = (s13) => {
  class e5 extends k14(s13) {
    constructor() {
      super(...arguments), this.__internals = null;
    }
    get internals() {
      if (this.__internals) return this.__internals;
      if (typeof this.attachInternals == "function")
        try {
          this.__internals = this.attachInternals();
        } catch {
          this.__internals = null;
        }
      return this.__internals;
    }
    get defaultRole() {
      return null;
    }
    setHostAria(r13, t11) {
      const i21 = this.internals;
      if (i21 && r13 in i21) {
        i21[r13] = t11;
        return;
      }
      const a12 = m26(r13);
      t11 === null ? this.removeAttribute(a12) : this.setAttribute(a12, t11);
    }
    reflectDefaultSemantics() {
      const r13 = this.defaultRole;
      r13 && this.setHostAria("role", r13);
    }
    connectedCallback() {
      super.connectedCallback(), this.reflectDefaultSemantics();
    }
  }
  return e5;
};
function m26(s13) {
  if (s13 === "role") return "role";
  const e5 = s13.replace(/^aria/, "");
  return "aria-" + e5.charAt(0).toLowerCase() + e5.slice(1);
}
var w22 = (s13) => {
  const e5 = class extends f19(s13) {
    setFormValue(t11) {
      this.internals?.setFormValue(t11 ?? null);
    }
    setValidityFromState(t11, i21, a12) {
      const h23 = this.internals;
      if (!h23) return;
      const u17 = Object.values(t11).some(Boolean);
      u17 ? h23.setValidity(t11, i21 ?? "Invalid value", a12) : h23.setValidity({}), this.setHostAria("ariaInvalid", u17 ? "true" : "false");
    }
    clearValidity() {
      this.internals?.setValidity({}), this.setHostAria("ariaInvalid", "false");
    }
    checkValidity() {
      return this.internals?.checkValidity() ?? true;
    }
    reportValidity() {
      return this.internals?.reportValidity() ?? true;
    }
    formResetCallback() {
      this.clearValidity();
    }
  };
  return e5.formAssociated = true, e5;
};
var x21 = w22(LitElement);
var z5 = ':host{--_nys-toggle-width: var(--nys-font-size-8xl, 44px);--_nys-toggle-height: var(--nys-size-300, 24px);--_nys-toggle-border-radius: var(--nys-radius-round, 1776px);--_nys-toggle-border-width: var(--nys-border-width-md, 2px);--_nys-toggle-size--knob: var(--nys-font-size-lg, 18px);--_nys-toggle-margin--knob: calc( (var(--_nys-toggle-height) - var(--_nys-toggle-size--knob)) / 2 );--_nys-toggle-transform--translateX: calc( var(--_nys-toggle-width) - var(--_nys-toggle-size--knob) - var( --_nys-toggle-margin--knob ) - 2px );--_nys-toggle-gap: var(--nys-space-150, 12px);--_nys-toggle-transition-duration: .3s;--_nys-toggle-outline-color: var(--nys-color-focus, #004dd1);--_nys-toggle-outline-width: var(--nys-border-width-md, 2px);--_nys-toggle-background-color: var(--nys-color-neutral-500, #797c7f);--_nys-toggle-background-color--disabled: var( --nys-color-neutral-100, #d0d0ce );--_nys-toggle-background-color--checked: var(--nys-color-theme, #154973);--_nys-toggle-background-color--hover: var(--nys-color-neutral-600, #62666a);--_nys-toggle-background-color--active: var(--nys-color-neutral-700, #4a4d4f);--_nys-toggle-background-color--checked--hover: var( --nys-color-theme-strong, #0e324f );--_nys-toggle-background-color--checked--active: var( --nys-color-theme-stronger, #081b2b );--_nys-toggle-color-ink-reverse: var(--nys-color-ink-reverse, #ffffff);--_nys-toggle-color--disabled: var(--nys-color-neutral-500, #797c7f)}:host([inverted]){--_nys-toggle-outline-color: var(--nys-color-focus-reverse, #7aa5e7)}.nys-toggle__content{display:flex;gap:var(--_nys-toggle-gap)}.nys-toggle__content nys-label{--_nys-label-font-weight: var(--nys-font-weight-semibold, 600)}.nys-toggle__content:has(input:disabled) nys-label{--_nys-label-color: var(--_nys-toggle-color--disabled);cursor:not-allowed}.nys-toggle__toggle{position:relative;display:inline-block;width:var(--_nys-toggle-width);min-width:var(--_nys-toggle-width);max-width:var(--_nys-toggle-width);height:var(--_nys-toggle-height);min-height:var(--_nys-toggle-height);max-height:var(--_nys-toggle-height)}.nys-toggle__toggle input{opacity:0;width:0;height:0}.nys-toggle__toggle input:checked+.slider{background-color:var(--_nys-toggle-background-color--checked)}.nys-toggle__toggle input:checked+.slider:hover{background-color:var(--_nys-toggle-background-color--checked--hover)}.nys-toggle__toggle input:checked+.slider:hover .knob .toggle-icon{color:var(--_nys-toggle-background-color--checked--hover)}.nys-toggle__toggle input:checked+.slider .knob{transform:translate(var(--_nys-toggle-transform--translateX))}.nys-toggle__toggle input:checked+.slider .knob .toggle-icon{color:var(--_nys-toggle-background-color--checked)}.nys-toggle__toggle input:active:not(:disabled)+.slider{background-color:var(--_nys-toggle-background-color--active);outline:solid var(--_nys-toggle-outline-width) var(--_nys-toggle-outline-color)}.nys-toggle__toggle input:active:not(:disabled)+.slider .knob .toggle-icon{color:var(--_nys-toggle-background-color--active)}.nys-toggle__toggle input:active:not(:disabled)+.slider:checked{background-color:var(--_nys-toggle-background-color--checked--active)}.nys-toggle__toggle input:active:not(:disabled)+.slider:checked .knob .toggle-icon{color:var(--_nys-toggle-background-color--checked--active)}.nys-toggle__toggle input:focus+.slider{outline:solid var(--_nys-toggle-outline-width) var(--_nys-toggle-outline-color)}.nys-toggle__toggle input:disabled+.slider{background-color:var(--_nys-toggle-background-color--disabled);cursor:not-allowed}.nys-toggle__toggle input:disabled+.slider:hover{background-color:var(--_nys-toggle-background-color--disabled)}.nys-toggle__toggle input:disabled+.slider .knob .toggle-icon{color:var(--_nys-toggle-background-color--disabled)}.slider{position:absolute;cursor:pointer;border-radius:var(--_nys-toggle-border-radius);outline-offset:var(--_nys-toggle-border-width);width:var(--_nys-toggle-width);inset:0;background-color:var(--_nys-toggle-background-color);display:flex;align-items:center}.slider:hover{background-color:var(--_nys-toggle-background-color--hover)}.slider:hover .knob .toggle-icon{color:var(--_nys-toggle-background-color--hover)}.knob{content:"";height:var(--_nys-toggle-size--knob);width:var(--_nys-toggle-size--knob);margin:var(--_nys-toggle-margin--knob);border-radius:var(--nys-radius-round, 1776px);background-color:var(--_nys-toggle-color-ink-reverse);transition:all var(--_nys-toggle-transition-duration) cubic-bezier(.27,.2,.25,1.51);overflow:hidden;display:flex;align-items:center;justify-content:center}.toggle-icon{position:absolute;color:var(--_nys-toggle-background-color)}:host([size=sm]){--_nys-toggle-width: var(--nys-size-450, 36px);--_nys-toggle-height: var(--nys-size-250, 20px);--_nys-toggle-size--knob: var(--nys-size-200, 16px);--_nys-toggle-gap: var(--nys-space-100, 8px)}:host([size=sm]) .toggle-icon{font-size:var(--nys-font-size-body-xs, 12px)}@supports not (font-size: 1cap){:host([size=sm]) .toggle-icon{font-size:var(--nys-font-size-body-xs, 12px)}}:host([size=md]){--_nys-toggle-width: var(--nys-size-550, 44px);--_nys-toggle-height: var(--nys-size-300, 24px);--_nys-toggle-size--knob: var(--nys-size-250, 20px)}:host([size=md]) .toggle-icon{font-size:var(--nys-font-size-body-sm, 14px)}@supports not (font-size: 1cap){:host([size=md]) .toggle-icon{font-size:calc(var(--nys-font-size-body-sm, 14px) - 1px)}}@media(prefers-reduced-motion:reduce){:host{--_nys-toggle-transition-duration: 0s}}';
var $13 = Object.defineProperty;
var l14 = (s13, e5, c21, r13) => {
  for (var t11 = void 0, i21 = s13.length - 1, a12; i21 >= 0; i21--)
    (a12 = s13[i21]) && (t11 = a12(e5, c21, t11) || t11);
  return t11 && $13(e5, c21, t11), t11;
};
var d18 = class d19 extends x21 {
  constructor() {
    super(...arguments), this.id = "", this.name = "", this.value = "", this.label = "", this.description = "", this.form = null, this.checked = false, this.disabled = false, this.noIcon = false, this.inverted = false, this.size = "md";
  }
  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   * Form association, ElementInternals, and id generation are provided by
   * NysFormControlElement (@nysds/internals). super.connectedCallback() assigns
   * an id (prefix = localName) when one is not provided.
   */
  /**
   * Form Integration
   * --------------------------------------------------------------------------
   */
  // Update the internals whenever `checked` or `value` changes.
  updated(e5) {
    (e5.has("checked") || e5.has("value")) && this.setFormValue(this.checked ? this.value : null);
  }
  formResetCallback() {
    this.checked = false, this.setFormValue(this.checked ? this.value : null), this.requestUpdate();
  }
  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */
  _emitChangeEvent() {
    this.dispatchEvent(
      new CustomEvent("nys-change", {
        detail: { id: this.id, checked: this.checked },
        bubbles: true,
        composed: true
      })
    );
  }
  // Handle focus event
  _handleFocus() {
    this.dispatchEvent(
      new Event("nys-focus", { bubbles: true, composed: true })
    );
  }
  // Handle blur event
  _handleBlur() {
    this.dispatchEvent(
      new Event("nys-blur", { bubbles: true, composed: true })
    );
  }
  _handleClick() {
    this.disabled || (this.checked = !this.checked, this._emitChangeEvent());
  }
  _handleSliderClick(e5) {
    e5.stopPropagation(), this._handleClick();
  }
  _handleKeyDown(e5) {
    !this.disabled && (e5.key === " " || e5.key === "Enter") && (e5.preventDefault(), this.checked = !this.checked, this._emitChangeEvent());
  }
  render() {
    return html`
      <div class="nys-toggle">
        <div class="nys-toggle__content">
          <div class="nys-toggle__toggle">
            <input
              id=${this.id}
              type="checkbox"
              name="${ifDefined(this.name ? this.name : void 0)}"
              .value=${this.value}
              form=${ifDefined(this.form || void 0)}
              .checked=${this.checked}
              ?disabled=${this.disabled}
              role="switch"
              aria-checked="${this.checked ? "true" : "false"}"
              aria-disabled="${this.disabled ? "true" : "false"}"
              aria-labelledby=${ifDefined(
      this.label ? this.id + "--label" : void 0
    )}
              aria-label=${ifDefined(this.label ? void 0 : "Toggle switch")}
              @click=${this._handleClick}
              @focus=${this._handleFocus}
              @blur=${this._handleBlur}
              @keydown=${this._handleKeyDown}
            />
            <span class="slider" @click=${this._handleSliderClick}>
              <div class="knob">
                ${this.noIcon ? "" : html`<nys-icon
                      class="toggle-icon"
                      name="${this.checked ? "check" : "close"}"
                      size="2xl"
                    ></nys-icon>`}
              </div>
            </span>
          </div>
          ${this.label && html`<nys-label
            id="${this.id}--label"
            label=${this.label}
            description=${ifDefined(this.description || void 0)}
            ?inverted=${this.inverted}
            @nys-label-click=${this._handleClick}
          >
            <slot name="description" slot="description"
              >${this.description}</slot
            >
          </nys-label> `}
        </div>
      </div>
    `;
  }
};
d18.styles = unsafeCSS(z5), d18.shadowRootOptions = __spreadProps(__spreadValues({}, LitElement.shadowRootOptions), {
  delegatesFocus: true
});
var o14 = d18;
l14([
  property({ type: String, reflect: true })
], o14.prototype, "id");
l14([
  property({ type: String, reflect: true })
], o14.prototype, "name");
l14([
  property({ type: String })
], o14.prototype, "value");
l14([
  property({ type: String })
], o14.prototype, "label");
l14([
  property({ type: String })
], o14.prototype, "description");
l14([
  property({ type: String, reflect: true })
], o14.prototype, "form");
l14([
  property({ type: Boolean, reflect: true })
], o14.prototype, "checked");
l14([
  property({ type: Boolean, reflect: true })
], o14.prototype, "disabled");
l14([
  property({ type: Boolean })
], o14.prototype, "noIcon");
l14([
  property({ type: Boolean, reflect: true })
], o14.prototype, "inverted");
l14([
  property({ type: String, reflect: true })
], o14.prototype, "size");
customElements.get("nys-toggle") || customElements.define("nys-toggle", o14);

// ../../nys-unavfooter/dist/nys-unavfooter.js
var d20 = 0;
function p15(C10) {
  return `${C10}-${Date.now()}-${d20++}`;
}
var y13 = (C10) => {
  class t11 extends C10 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = p15(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return t11;
};
var h18 = y13(LitElement);
var g11 = `<svg xmlns="http://www.w3.org/2000/svg" width="91" height="55" viewBox="0 0 91 55" fill="none">
  <path d="M55.1158 7.50499L58.2905 12.6494V7.5189C58.2905 7.5189 58.6487 7.26356 59.5098 7.26356C60.3708 7.26356 60.7378 7.5189 60.7378 7.5189V16.4327C60.7378 16.4327 60.3942 16.689 59.5215 16.689C58.6487 16.689 58.3295 16.4605 58.3295 16.4605L55.1421 11.3171V16.4337C55.1421 16.4337 54.7848 16.69 53.9111 16.69C53.0374 16.69 52.7065 16.4337 52.7065 16.4337V7.51989C52.7065 7.51989 53.0384 7.26456 53.9248 7.26456C54.8112 7.26456 55.1148 7.50697 55.1148 7.50697L55.1158 7.50499Z" fill="white"/>
  <path d="M67.2209 12.5948H64.9063V14.8709H68.2538C68.2538 14.8709 68.5047 15.1531 68.5047 15.772C68.5047 16.391 68.2538 16.688 68.2538 16.688H62.4589V7.26257H67.9892C67.9892 7.26257 68.2538 7.54572 68.2538 8.17859C68.2538 8.81146 67.9892 9.09362 67.9892 9.09362H64.9063V10.7637H67.2209C67.2209 10.7637 67.4728 11.0598 67.4728 11.6787C67.4728 12.2977 67.2209 12.5948 67.2209 12.5948Z" fill="white"/>
  <path d="M71.4802 16.4327L68.9791 7.5189C68.9791 7.5189 69.3491 7.26356 70.2101 7.26356C71.0711 7.26356 71.4275 7.5189 71.4275 7.5189L72.6839 12.0434C72.7766 12.3802 72.8166 12.6365 72.8557 12.7845C72.8557 12.7428 72.9221 12.3663 73.0011 12.0573L74.0984 7.5189C74.0984 7.5189 74.5211 7.26356 75.1176 7.26356C75.7141 7.26356 76.084 7.5189 76.084 7.5189L77.3004 12.7845C77.3004 12.6623 77.3795 12.3255 77.4586 12.0573L78.756 7.5189C78.7686 7.5189 79.1132 7.26356 79.9596 7.26356C80.806 7.26356 81.1897 7.5189 81.1897 7.5189L78.6496 16.4327C78.6496 16.4327 78.2922 16.6751 77.4859 16.689C76.5468 16.689 76.2158 16.4327 76.2158 16.4327L75.223 12.2987C75.1449 11.9887 75.0902 11.6529 75.0785 11.5844L74.9184 12.2987L73.9266 16.4327C73.9266 16.4327 73.583 16.689 72.7092 16.689C71.8355 16.689 71.4802 16.4327 71.4802 16.4327Z" fill="white"/>
  <path d="M54.3485 19.2195L55.4331 21.1579C55.804 21.8176 56.0022 22.5587 56.0285 22.6521C56.0559 22.5587 56.2404 21.8315 56.624 21.1579L57.735 19.2195C57.735 19.2195 58.0659 18.9771 58.8723 18.9771C59.786 18.9771 60.1697 19.2861 60.1697 19.2861L57.2449 24.4295V28.1453C57.2449 28.1453 56.9013 28.4026 56.0276 28.4026C55.1539 28.4026 54.8239 28.1453 54.8239 28.1453V24.3898L51.8991 19.2871C51.8991 19.2871 52.2965 18.9781 53.2082 18.9781C53.9892 18.9781 54.3465 19.2205 54.3465 19.2205L54.3485 19.2195Z" fill="white"/>
  <path d="M64.6017 28.497C61.4788 28.497 60.117 26.6381 60.117 23.7033C60.117 20.7684 61.4798 18.8827 64.6017 18.8827C67.7237 18.8827 69.0865 20.7674 69.0865 23.7033C69.0865 26.6391 67.711 28.497 64.6017 28.497ZM64.6017 26.6778C65.9235 26.6778 66.6391 25.4667 66.6391 23.7033C66.6391 21.9398 65.9235 20.7138 64.6017 20.7138C63.2799 20.7138 62.5653 21.9398 62.5653 23.7033C62.5653 25.4667 63.2789 26.6778 64.6017 26.6778Z" fill="white"/>
  <path d="M72.844 28.1463C72.844 28.1463 72.4867 28.4036 71.6129 28.4036C70.7392 28.4036 70.4083 28.1463 70.4083 28.1463V19.3546C70.4083 19.3546 71.4011 18.8837 73.2266 18.8837C75.9913 18.8837 77.275 19.9607 77.275 21.8454C77.275 23.7301 75.8722 24.4563 75.7004 24.4712L77.8432 28.0936C77.5796 28.2675 76.8523 28.4026 76.3623 28.4026C75.7267 28.4026 75.225 28.1741 75.225 28.1741L73.6113 25.3068C73.5175 25.1041 73.3858 24.9561 73.1612 24.9561H72.844V28.1463ZM73.5322 20.7148C73.1349 20.7148 72.844 20.7952 72.844 20.7952V23.138H73.5049C74.4694 23.138 74.8413 22.4514 74.8413 21.9269C74.8413 21.2403 74.3786 20.7148 73.5322 20.7148Z" fill="white"/>
  <path d="M87.211 28.0787C87.211 28.0787 86.5901 28.4026 85.5836 28.4026C84.7236 28.4026 84.3663 28.1741 84.3663 28.1741L81.2317 23.8384V28.1463C81.2317 28.1463 80.9007 28.4036 80.027 28.4036C79.1533 28.4036 78.797 28.1463 78.797 28.1463V19.2344C78.797 19.2344 79.1533 18.9781 80.027 18.9781C80.9007 18.9781 81.2317 19.2344 81.2317 19.2344V23.4221L84.2618 19.2205C84.2618 19.2205 84.6182 18.9781 85.4782 18.9781C86.4701 18.9781 86.8684 19.3139 86.8684 19.3139L83.9045 23.4221L87.212 28.0797L87.211 28.0787Z" fill="white"/>
  <path d="M58.9806 31.3374C59.1515 32.1988 58.7014 32.8853 58.1987 33.0602C57.7096 32.7244 56.9296 32.4273 56.1096 32.4273C55.2895 32.4273 54.8122 32.7502 54.8122 33.2082C54.8122 33.6394 55.1958 33.7874 56.214 34.1252L57.4841 34.5415C58.8479 34.9985 59.6933 35.7 59.6933 37.1803C59.6933 38.8911 58.5823 40.2105 55.8831 40.2105C53.9912 40.2105 52.8256 39.5637 52.4029 39.1335C52.2711 38.5007 52.6137 37.7059 53.1057 37.4505C53.5284 37.7744 54.7848 38.3934 56.0676 38.3934C56.8359 38.3934 57.2596 38.1112 57.2596 37.5986C57.2596 37.2359 57.034 37.0064 56.5049 36.8306L54.3758 36.1719C53.2365 35.8073 52.3775 34.9737 52.3775 33.6126C52.3775 31.6732 53.6729 30.5973 56.0676 30.5973C57.5895 30.5973 58.4779 31.0145 58.9806 31.3374Z" fill="white"/>
  <path d="M60.3542 32.5227C60.3542 32.5227 60.1023 32.2534 60.1023 31.6067C60.1023 30.9599 60.3542 30.6906 60.3542 30.6906H67.5382C67.5382 30.6906 67.7901 30.9738 67.7901 31.6067C67.7901 32.2395 67.5382 32.5227 67.5382 32.5227H65.1562V39.8608C65.1562 39.8608 64.8136 40.1161 63.9525 40.1161C63.0915 40.1161 62.7088 39.8608 62.7088 39.8608V32.5227H60.3542Z" fill="white"/>
  <path d="M72.7502 30.9341L76.3232 39.8201C76.3232 39.8201 75.9659 40.1171 75.0658 40.1171C74.2321 40.1171 73.9032 39.8747 73.9032 39.8747L73.254 38.3258H69.8538L69.2446 39.8747C69.2446 39.8747 68.901 40.1171 68.081 40.1171C67.1819 40.1171 66.7972 39.8201 66.7972 39.8201L70.3702 30.9341C70.3702 30.9341 70.7002 30.6916 71.5592 30.6916C72.4183 30.6916 72.7502 30.9341 72.7502 30.9341ZM70.5674 36.5216H72.5394L71.8775 34.9051C71.7457 34.5822 71.5729 33.9226 71.5583 33.855C71.5329 33.9226 71.3337 34.5822 71.2156 34.9051L70.5674 36.5216Z" fill="white"/>
  <path d="M75.5949 32.5227C75.5949 32.5227 75.3431 32.2534 75.3431 31.6067C75.3431 30.9599 75.5949 30.6906 75.5949 30.6906H82.779C82.779 30.6906 83.0298 30.9738 83.0298 31.6067C83.0298 32.2395 82.779 32.5227 82.779 32.5227H80.397V39.8608C80.397 39.8608 80.0543 40.1161 79.1933 40.1161C78.3323 40.1161 77.9496 39.8608 77.9496 39.8608V32.5227H75.5949Z" fill="white"/>
  <path d="M88.9047 36.0228H86.5891V38.299H89.9356C89.9356 38.299 90.1875 38.5821 90.1875 39.2001C90.1875 39.8181 89.9356 40.1161 89.9356 40.1161H84.1408V30.6897H89.6711C89.6711 30.6897 89.9356 30.9728 89.9356 31.6057C89.9356 32.2385 89.6711 32.5217 89.6711 32.5217H86.5882V34.1908H88.9038C88.9038 34.1908 89.1547 34.4879 89.1547 35.1078C89.1547 35.7278 88.9038 36.0219 88.9038 36.0219L88.9047 36.0228Z" fill="white"/>
  <path d="M51.7107 54.9999C51.577 54.9999 51.4335 54.974 51.2939 54.8965C51.085 54.7803 50.9395 54.5876 50.8858 54.3551C50.8233 54.0868 50.8936 53.7868 51.082 53.5116L51.1426 53.4202C51.2041 53.3268 51.2685 53.2354 51.3407 53.1519C51.4218 53.0595 51.5047 52.995 51.5741 52.9493C51.5243 52.6691 51.5418 52.4267 51.5682 52.2061C51.5877 52.0233 51.6346 51.8683 51.6726 51.7451C51.6892 51.6925 51.7058 51.6388 51.7185 51.5812C51.8201 51.145 51.8855 50.7397 51.9206 50.3453C51.9528 49.9916 51.947 49.9846 51.8864 49.9061C51.7 49.6707 51.3847 49.5018 51.0498 49.3229C50.8878 49.2365 50.7286 49.1491 50.5754 49.0557C49.607 48.4536 48.6376 47.8505 47.6701 47.2465L47.3294 47.0339C47.2513 46.9862 47.1147 46.9156 46.9516 46.8282C45.8817 46.2659 45.172 45.8526 45.0539 45.2595C45.0363 45.173 44.9465 44.9644 44.884 44.864C44.8411 44.8611 44.7307 44.8521 44.6546 44.8471C44.3032 44.8183 43.7711 44.7726 43.3484 44.3196C43.2635 44.2272 43.1786 44.1408 43.1005 44.0583C42.5098 43.4443 42.0003 42.9148 41.9329 41.5993C41.9241 41.4275 41.9251 41.2506 41.928 41.0728C41.9339 40.5283 41.927 40.1836 41.7103 39.962C41.6078 39.8567 41.435 39.7862 41.2349 39.7037C40.9889 39.6034 40.7097 39.4881 40.45 39.2686C40.37 39.2 40.2792 39.1007 40.1776 38.9854C40.0712 38.8602 39.9082 38.6724 39.7969 38.6337C38.974 38.3436 37.986 38.3178 36.96 38.3178L3.07245 38.2909C2.85964 38.2909 2.66927 38.3138 2.48477 38.3347C2.07378 38.3823 1.60812 38.437 1.2313 38.0962C0.866192 37.7664 0.815429 37.2607 0.814452 36.8076L0.8125 34.3993C0.8125 34.2722 0.847644 34.147 0.913051 34.0387C1.22544 33.529 1.83265 33.2558 2.3686 33.0144C2.56872 32.924 2.77666 32.8316 2.88795 32.7571C3.17593 32.5623 3.43561 32.302 3.7109 32.0248C3.91688 31.8182 4.13068 31.6046 4.36887 31.4059C4.69786 31.1317 5.07078 30.931 5.43296 30.7372C5.74535 30.5703 6.03821 30.4124 6.24127 30.2395C6.38575 30.1173 6.49216 29.9146 6.61906 29.6792C6.75476 29.4238 6.90998 29.1337 7.15208 28.8804C7.41273 28.6081 7.7427 28.4194 8.03263 28.2535C8.69744 27.871 8.68182 27.8322 8.57736 27.5769C8.52855 27.4577 8.48072 27.3553 8.43972 27.2639C8.24447 26.8357 8.07754 26.4681 8.19078 25.7051C8.2025 25.6306 8.21616 25.5521 8.22983 25.4706C8.25619 25.3325 8.30305 25.0772 8.27571 25.0037C8.27571 25.0037 8.26204 24.9927 8.23471 24.9778C8.21128 24.9659 8.12928 24.9669 8.06875 24.9679C7.87448 24.9659 7.51914 24.9768 7.2497 24.6689C6.98124 24.3629 6.99686 23.9555 7.03982 23.6356C7.08179 23.3127 7.06032 23.1051 7.03982 22.9223C6.95684 22.1453 7.21358 21.7817 8.10097 21.424C10.7524 20.351 12.901 19.9884 14.8613 20.2805C14.9775 20.2974 15.1356 20.2656 15.3182 20.2269C15.5944 20.1702 15.9351 20.1017 16.312 20.1752L18.3952 20.5766C19.2475 20.7415 19.6653 20.9054 20.3047 21.4995C20.6327 21.8046 20.7655 21.7718 21.3327 21.5661C21.6168 21.4638 21.9399 21.3485 22.3323 21.2949C22.9727 21.2084 23.5731 21.2661 24.153 21.3227C24.4136 21.3475 24.6762 21.3734 24.9408 21.3843C25.2356 21.3952 25.6085 21.2561 25.9717 21.121C26.1318 21.0614 26.2889 21.0028 26.4412 20.9541C26.78 20.8468 27.0973 20.7991 27.4038 20.7514C27.5551 20.7266 27.7064 20.7037 27.8607 20.6729C27.8714 20.6531 27.8821 20.6332 27.8939 20.6113C27.9417 20.5249 27.9944 20.4345 28.0598 20.3411C28.3419 19.9497 28.7471 19.7003 29.0722 19.4966L29.2078 19.4122C29.5564 19.1916 29.8629 18.9879 30.105 18.7386C30.5423 18.2796 31.1232 18.3114 31.5108 18.3312C31.6455 18.3392 31.8495 18.3481 31.91 18.3223C32.1678 18.207 31.9413 17.3993 31.8065 16.9165C31.7119 16.5777 31.6299 16.2846 31.6133 16.0183C31.5664 15.2642 31.9764 14.7317 32.3064 14.3045C32.5651 13.9687 32.7213 13.7481 32.7164 13.5355C32.7164 13.4948 32.7027 13.4382 32.6851 13.3845C32.4587 13.4948 32.0955 13.6369 31.6796 13.4421C31.0129 13.1302 30.6468 12.0264 30.8508 11.3985C31.0197 10.8779 31.54 10.5421 31.9198 10.2957L32.0565 10.2053C32.3806 9.98471 32.7242 9.79792 33.0542 9.6181C33.5159 9.36873 33.9513 9.13227 34.2949 8.82726C34.4404 8.69711 34.5761 8.56994 34.7089 8.44376C35.0076 8.1626 35.3161 7.8715 35.6792 7.61319C35.7056 7.5188 35.728 7.34096 35.7437 7.22571C35.7729 7.00714 35.8022 6.78062 35.8803 6.5849C36.2513 5.64304 37.1592 4.90884 37.9597 4.25908C38.2252 4.04448 38.4771 3.84081 38.6743 3.65602C38.7992 3.53878 38.9222 3.42055 39.0452 3.30332C39.6388 2.73701 40.2509 2.15084 40.9967 1.68289C41.601 1.30536 42.3898 0.833439 43.1249 0.552274C44.0972 0.1807 44.5579 0.208518 45.4766 0.262168L45.6474 0.27111C47.3607 0.371455 49.1384 0.32476 50.8575 0.281045C51.7205 0.258194 52.5796 0.235343 53.4347 0.230376C53.6651 0.230376 54.0156 0.185667 54.3836 0.138972C55.6078 -0.0140291 56.994 -0.188888 57.7818 0.503592C58.1118 0.792705 58.2924 1.19806 58.3031 1.67594C58.311 2.05248 58.1567 2.33464 58.0435 2.54129C58.0064 2.60686 57.9527 2.7082 57.9458 2.74297C57.9488 2.73205 57.9849 2.78768 58.0103 2.82742C58.1362 3.01718 58.3686 3.37088 58.2748 3.89843C58.2397 4.10111 58.1811 4.3167 58.1216 4.53528C58.0464 4.81147 57.9693 5.09761 57.9624 5.31419C57.9498 5.69073 57.6335 5.99376 57.2703 5.97289C56.9013 5.95998 56.6104 5.64603 56.6231 5.26849C56.6367 4.89195 56.7392 4.50944 56.831 4.17264C56.8788 3.9948 56.9276 3.82094 56.9569 3.65502C56.9481 3.65502 56.9218 3.62323 56.8993 3.58746C56.791 3.42254 56.6065 3.14535 56.6065 2.73701C56.6065 2.36345 56.7607 2.08328 56.873 1.87862C56.9072 1.81702 56.9589 1.72462 56.9657 1.69084C56.9608 1.58354 56.9267 1.55274 56.9072 1.53685C56.5694 1.23979 55.2544 1.40372 54.5496 1.49313C54.1386 1.5438 53.752 1.59348 53.4435 1.59547C52.5971 1.60043 51.7439 1.62229 50.8907 1.64315C49.1442 1.68886 47.3382 1.73654 45.5722 1.63421L45.3985 1.62328C44.5345 1.57162 44.3022 1.55871 43.5964 1.82894C42.9618 2.07235 42.2101 2.5244 41.7006 2.84431C41.0699 3.23973 40.533 3.75338 39.9648 4.29683C39.8379 4.41804 39.712 4.53925 39.5831 4.65947C39.3479 4.87804 39.0794 5.09661 38.7953 5.32611C38.1237 5.87056 37.3642 6.48555 37.1231 7.09457C37.1065 7.14425 37.085 7.30221 37.0713 7.40753C37.0147 7.84666 36.9424 8.3931 36.5041 8.69016C36.1927 8.90277 35.9145 9.16704 35.6187 9.44523C35.4771 9.57935 35.3317 9.71546 35.1774 9.85257C34.7186 10.2629 34.1924 10.548 33.6838 10.8222C33.3675 10.9931 33.0698 11.1541 32.8033 11.3369C32.7554 11.3707 32.6978 11.4064 32.6373 11.4462C32.5114 11.5276 32.2332 11.7065 32.1346 11.8217C32.1424 11.8992 32.1726 12.0115 32.2117 12.1009C32.3757 12.0214 32.6041 11.924 32.8804 11.9459C33.6633 12.0135 34.0401 12.8937 34.0558 13.4988C34.0743 14.2191 33.677 14.7337 33.3587 15.145C33.0971 15.4868 32.9351 15.7074 32.9487 15.9319C32.9565 16.0511 33.0288 16.3114 33.0932 16.5419C33.3314 17.3933 33.7746 18.978 32.4479 19.5701C32.0965 19.7281 31.7314 19.7082 31.4375 19.6933C31.3126 19.6864 31.1046 19.6764 31.047 19.7023C30.7171 20.051 30.3227 20.3113 29.9166 20.5706L29.7692 20.663C29.5212 20.816 29.2654 20.976 29.1405 21.1488C29.1083 21.1935 29.0819 21.2412 29.0585 21.2859C28.9345 21.5085 28.7256 21.884 28.174 21.9993C27.9827 22.04 27.7943 22.0708 27.6059 22.0996C27.3364 22.1414 27.0807 22.1811 26.8386 22.2566C26.7087 22.2993 26.5711 22.35 26.4334 22.4017C25.9697 22.5745 25.4435 22.7732 24.8871 22.7474C24.5981 22.7355 24.3131 22.7087 24.027 22.6808C23.4989 22.6282 22.9981 22.5805 22.511 22.6481C22.2572 22.6828 22.0258 22.7653 21.7817 22.8537C21.1716 23.0733 20.3369 23.3733 19.4046 22.508C18.9927 22.1265 18.8267 22.049 18.1473 21.9178L16.065 21.5164C15.942 21.4936 15.775 21.5264 15.5818 21.5651C15.3289 21.6168 15.0136 21.6784 14.6719 21.6297C12.9508 21.3724 11.0218 21.7112 8.59689 22.6928C8.49829 22.7325 8.42703 22.7643 8.37431 22.7891C8.39579 22.9779 8.42312 23.2491 8.39091 23.6217C8.53343 23.6416 8.69353 23.6843 8.86047 23.7737C9.81228 24.2834 9.63461 25.256 9.5487 25.724C9.53601 25.7876 9.52528 25.8511 9.51551 25.9127C9.4628 26.2694 9.49501 26.3429 9.65511 26.6917C9.70392 26.798 9.75664 26.9162 9.81326 27.0543C10.3941 28.4681 9.28415 29.1039 8.68865 29.4447C8.46705 29.5719 8.23764 29.701 8.11268 29.8331C7.99944 29.9524 7.89987 30.1372 7.79541 30.3329C7.62945 30.6448 7.44104 30.9975 7.10522 31.2847C6.79088 31.5529 6.41894 31.7536 6.05871 31.9454C5.74144 32.1153 5.44077 32.2762 5.21623 32.464C5.02782 32.6219 4.84527 32.8048 4.65295 32.9985C4.34252 33.3085 4.02524 33.6294 3.62499 33.8976C3.41901 34.0347 3.17203 34.147 2.9104 34.2652C2.69661 34.3606 2.33443 34.5225 2.14992 34.6626L2.15383 36.8096C2.15383 36.8881 2.15578 36.9527 2.15871 37.0023C2.21533 36.9974 2.27586 36.9904 2.32662 36.9835C2.5287 36.9606 2.77959 36.9308 3.06952 36.9308L36.9581 36.9566C38.0573 36.9566 39.2141 36.9884 40.2304 37.3471C40.6755 37.5021 40.9801 37.8538 41.1812 38.0853C41.2281 38.1399 41.2681 38.1896 41.3052 38.2234C41.4018 38.3048 41.5551 38.3674 41.7328 38.441C42.0129 38.5562 42.3615 38.7003 42.6572 39.0043C43.2811 39.6411 43.2713 40.4469 43.2645 41.0927C43.2606 41.2417 43.2606 41.3897 43.2664 41.5328C43.3084 42.3326 43.5261 42.5581 44.0532 43.1055C44.1372 43.1929 44.2251 43.2853 44.3188 43.3847C44.3842 43.4542 44.5287 43.4701 44.761 43.491C45.0412 43.5138 45.3897 43.5417 45.6953 43.7751C46.0291 44.0275 46.2546 44.5888 46.3376 44.8809C46.5455 45.0846 47.2777 45.4711 47.5647 45.6211C47.7639 45.7264 47.9298 45.8158 48.0265 45.8754L48.3672 46.088C49.3346 46.6891 50.3011 47.2922 51.2705 47.8943C51.3993 47.9727 51.533 48.0463 51.6707 48.1188C52.0924 48.3443 52.5698 48.6006 52.9291 49.0567C53.3215 49.5544 53.2942 50.0045 53.259 50.4029C53.3156 50.2936 53.3781 50.1893 53.4513 50.0879C53.5841 49.8982 53.7393 49.7541 53.877 49.626C54.0136 49.4998 54.1073 49.4104 54.1396 49.3388C54.1132 49.2772 54.0527 49.1739 54.0117 49.1034C53.8487 48.8232 53.6271 48.4387 53.7315 47.9857C53.7725 47.8108 53.8789 47.6588 54.0283 47.5634C54.0849 47.5276 54.205 47.4591 54.3631 47.3717C54.5818 47.2495 55.1373 46.9405 55.475 46.71C54.9723 45.5913 55.1392 44.2163 55.2886 42.9843C55.3345 42.6038 55.3784 42.2451 55.3989 41.9222C55.4204 41.5467 55.7337 41.2606 56.1076 41.2834C56.4776 41.3063 56.7588 41.6301 56.7353 42.0057C56.7148 42.3693 56.667 42.7498 56.6182 43.1522C56.4776 44.3166 56.3165 45.637 56.833 46.3911C56.954 46.5669 56.994 46.7895 56.9452 47.0021C56.8417 47.4502 56.3898 47.7879 55.1958 48.4606C55.352 48.7308 55.5395 49.0904 55.4731 49.5167C55.4623 49.5812 55.4487 49.6428 55.4321 49.7015C55.766 49.5793 56.1154 49.464 56.4845 49.3577C57.8775 48.9543 59.3409 48.7745 61.225 48.7745C62.0587 48.7745 62.8006 48.5053 63.5874 48.2211C64.2103 47.9946 64.8546 47.7621 65.576 47.6508C66.1852 47.5555 66.5005 47.7562 66.7728 47.9688C66.8636 48.0403 66.93 48.09 67.0442 48.1357C67.3625 48.2619 67.7325 48.2211 68.1601 48.1754C68.5925 48.1277 69.0836 48.0731 69.5844 48.2042C69.8821 48.2837 70.09 48.5579 70.0861 48.8709C70.0744 50.0571 68.5076 50.5459 67.7549 50.7814L67.0384 51.0099C66.4985 51.1848 65.9567 51.3586 65.41 51.5176C65.1631 51.5881 64.918 51.6587 64.672 51.7223C64.3889 51.7948 64.099 51.9597 63.7944 52.1316C63.481 52.3094 63.1579 52.4922 62.786 52.6174C62.1426 52.83 61.4837 52.9413 60.6471 52.9761C60.4069 52.987 60.1746 53.0943 59.9295 53.2056C59.5674 53.3735 59.1154 53.5801 58.6107 53.4132C58.3949 53.3864 57.5534 53.6775 57.1502 53.8196C56.832 53.9289 56.5577 54.0242 56.3419 54.0759C55.598 54.2528 54.8415 54.3918 54.1103 54.527L53.5968 54.6223C53.1516 54.7058 52.7035 54.7922 52.2613 54.8926L52.2076 54.9085C52.0797 54.9482 51.9021 55.0038 51.7078 55.0038L51.7107 54.9999ZM53.0735 51.6746C53.0569 51.7471 53.0403 51.8196 53.0237 51.8941C53.0032 51.9806 52.9788 52.064 52.9544 52.1455C52.9281 52.2359 52.9066 52.3055 52.8988 52.3651C52.8793 52.5379 52.8773 52.6313 52.8978 52.7247C52.9495 52.9791 52.9388 53.1907 52.8949 53.3645C53.0482 53.3347 53.2024 53.3049 53.3566 53.2751L53.875 53.1808C54.5896 53.0486 55.3296 52.9125 56.0412 52.7436C56.1906 52.7078 56.4483 52.6194 56.7217 52.525C57.7721 52.1604 58.4994 51.9359 59.0295 52.1127C59.0646 52.1058 59.2559 52.0173 59.3828 51.9597C59.7001 51.8137 60.0945 51.6328 60.5924 51.611C61.3021 51.5812 61.8498 51.4908 62.372 51.3169C62.622 51.2345 62.8748 51.0914 63.1442 50.9374C63.5123 50.7298 63.892 50.5142 64.3469 50.3969C64.5793 50.3373 64.8136 50.2707 65.0459 50.2042C65.5789 50.0482 66.11 49.8773 66.6362 49.7064L67.1253 49.5514C66.9388 49.5246 66.7504 49.4779 66.56 49.4014C66.2672 49.2862 66.0836 49.1411 65.9616 49.0457C65.9313 49.0229 65.906 48.999 65.8757 48.9812C65.8737 48.9851 65.8405 48.9851 65.7781 48.9941C65.1845 49.0855 64.6281 49.2862 64.0394 49.4998C63.1794 49.8107 62.293 50.1326 61.2279 50.1326C59.4717 50.1326 58.1235 50.2966 56.8535 50.6642C55.7142 50.992 54.7868 51.3984 54.0166 51.9031C53.7901 52.0521 53.5001 52.0481 53.2776 51.8951C53.1917 51.8365 53.1214 51.76 53.0735 51.6716V51.6746Z" fill="white"/>
  <path d="M67.6348 51.8019C67.6348 51.8019 67.6173 51.782 67.6173 51.7303C67.6173 51.6787 67.6348 51.6588 67.6348 51.6588H68.5564C68.5564 51.6588 68.5749 51.6806 68.5749 51.7303C68.5749 51.78 68.5564 51.8019 68.5564 51.8019H68.1932V52.9205C68.1932 52.9205 68.1659 52.9404 68.0976 52.9404C68.0292 52.9404 67.998 52.9205 67.998 52.9205V51.8019H67.6348Z" fill="white"/>
  <path d="M69.4282 52.8659C69.4135 52.8748 69.3891 52.8858 69.3471 52.8858C69.3178 52.8858 69.2837 52.8798 69.27 52.8659L68.9889 52.1476C68.9723 52.1088 68.9459 52.0323 68.944 52.0214C68.944 52.0264 68.9371 52.1277 68.9332 52.1565L68.8815 52.9205C68.8815 52.9205 68.8561 52.9404 68.7858 52.9404C68.7155 52.9404 68.6862 52.9205 68.6862 52.9205L68.7839 51.6787C68.7839 51.6787 68.8112 51.6588 68.8776 51.6588C68.9518 51.6588 68.9781 51.6787 68.9781 51.6787L69.3042 52.5162L69.3471 52.6533C69.3481 52.6473 69.3774 52.5559 69.392 52.5162L69.7181 51.6787C69.7181 51.6787 69.7464 51.6588 69.8206 51.6588C69.886 51.6588 69.9124 51.6787 69.9124 51.6787L70.01 52.9205C70.01 52.9205 69.9807 52.9404 69.9104 52.9404C69.8401 52.9404 69.8167 52.9205 69.8167 52.9205L69.763 52.1546L69.7523 52.0194C69.7523 52.0194 69.722 52.1148 69.7093 52.1456L69.4282 52.8659Z" fill="white"/>
</svg>`;
var L6 = ':host{--_nys-unavfooter-color: var( --nys-color-link-reverse-neutral, var(--nys-color-white, #ffffff) );--_nys-unavfooter-background-color: var(--nys-color-surface-reverse, #1b1b1b);--_nys-unavfooter-gap: var(--nys-space-200, 16px);--_nys-unavfooter-padding: var(--nys-space-250, 20px);--_nys-unavfooter-padding--gutter: var(--nys-gutter-sm, 20px);--_nys-unavfooter-font-size: var( --nys-font-size-body-md, var(--nys-font-size-md, 16px) );--_nys-unavfooter-font-weight: var(--nys-font-weight-semibold, 600);--_nys-unavfooter-max-width--content: var( --nys-unavfooter-max-width--content, 1280px );--_nys-unavfooter-row-gap: var(--nys-space-250, 20px);--_nys-unavfooter-column-gap: var(--nys-space-600, 48px);--_nys-unavfooter-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-unavfooter-letter-spacing: var( --nys-font-letterspacing-ui-md, var(--nys-font-letterspacing-400, .044px) );--_nys-unavfooter-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-unavfooter-text-decoration-thickness: var(--nys-size-2px, 2px)}ul{list-style-type:none;padding:0;margin:0}li{margin:0;padding:0}a{color:var(--_nys-unavfooter-color);text-decoration:none;font-family:var(--_nys-unavfooter-font-family);font-size:var(--_nys-unavfooter-font-size);font-style:normal;font-weight:var(--_nys-unavfooter-font-weight);line-height:var(--_nys-unavfooter-line-height);letter-spacing:var(--_nys-unavfooter-letter-spacing);text-decoration-style:solid;text-decoration-skip-ink:auto;text-decoration-thickness:7%;text-underline-offset:auto;text-underline-position:from-font}a:hover{text-decoration-line:underline}a:active{text-decoration-thickness:var(--_nys-unavfooter-text-decoration-thickness)}.nys-unavfooter{display:flex;flex-direction:column;gap:var(--_nys-unavfooter-gap);align-items:flex-start;background-color:var(--_nys-unavfooter-background-color);width:100%;box-sizing:border-box}.nys-unavfooter__main-container{display:flex;justify-content:center;width:100%}.nys-unavfooter__container_menu{display:flex;flex-direction:column;justify-content:center;align-items:center;width:100%;max-width:var(--_nys-unavfooter-max-width--content);padding:var(--_nys-unavfooter-padding) var(--_nys-unavfooter-padding--gutter);gap:var(--_nys-unavfooter-gap);box-sizing:border-box}.nys-unavfooter__logo a{display:flex;align-items:center;line-height:0}.nys-unavfooter__content{display:flex;align-items:center}.nys-unavfooter__content ul{display:flex;justify-content:center;gap:var(--_nys-unavfooter-row-gap) var(--_nys-unavfooter-column-gap);flex-wrap:wrap}@media(min-width:768px){.nys-unavfooter__container_menu{flex-direction:row}.nys-unavfooter__content ul{justify-content:flex-start}:host{--_nys-unavfooter-padding--gutter: var(--nys-gutter-lg, 32px);--_nys-unavfooter-column-gap: var(--nys-space-600, 48px);--_nys-unavfooter-gap-spacing: var(--nys-space-800, 64px)}}@media(min-width:1280px){:host{--_nys-unavfooter-padding--gutter: var(--nys-gutter-xl, 64px)}}';
var _14 = Object.defineProperty;
var m27 = (C10, t11, n13, a12) => {
  for (var e5 = void 0, r13 = C10.length - 1, i21; r13 >= 0; r13--)
    (i21 = C10[r13]) && (e5 = i21(t11, n13, e5) || e5);
  return e5 && _14(t11, n13, e5), e5;
};
var l15 = "New York State";
var s11 = class s12 extends h18 {
  constructor() {
    super(...arguments), this.landmarkLabel = l15;
  }
  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  _getNysLogo() {
    const a12 = new DOMParser().parseFromString(g11, "image/svg+xml").documentElement;
    return a12.setAttribute("aria-hidden", "true"), a12.setAttribute("focusable", "false"), a12;
  }
  /**
   * The contentinfo's accessible name. A blank override would put the page back
   * where #1795 found it — two unnamed contentinfo landmarks — so it falls back
   * to the default.
   */
  get _landmarkLabel() {
    return this.landmarkLabel?.trim() || l15;
  }
  render() {
    return html`
      <footer class="nys-unavfooter" aria-label=${this._landmarkLabel}>
        <div class="nys-unavfooter__main-container">
          <div class="nys-unavfooter__container_menu">
            <div class="nys-unavfooter__logo">
              <a
                href="https://www.ny.gov"
                target="_blank"
                rel="noopener noreferrer"
                id="nys-unavheader__logolink"
                aria-label="New York State home page (opens in a new tab)"
                >${this._getNysLogo()}</a
              >
            </div>
            <nav class="nys-unavfooter__content" aria-label="New York State">
              <ul>
                <li><a href="https://www.ny.gov/agencies">Agencies</a></li>
                <li>
                  <a href="https://www.ny.gov/mobileapps">App Directory</a>
                </li>
                <li><a href="https://www.ny.gov/counties">Counties</a></li>
                <li><a href="https://www.ny.gov/events">Events</a></li>
                <li><a href="https://www.ny.gov/programs">Programs</a></li>
                <li><a href="https://www.ny.gov/services">Services</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    `;
  }
};
s11.styles = unsafeCSS(L6);
var o15 = s11;
m27([
  property({ type: String })
], o15.prototype, "landmarkLabel");
customElements.get("nys-unavfooter") || customElements.define("nys-unavfooter", o15);

// ../../nys-unavheader/dist/nys-unavheader.js
var w23 = 0;
function m28(t11) {
  return `${t11}-${Date.now()}-${w23++}`;
}
var x22 = (t11) => {
  class e5 extends t11 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = m28(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return e5;
};
var k15 = x22(LitElement);
var L7 = `<svg xmlns="http://www.w3.org/2000/svg" width="91" height="55" viewBox="0 0 91 55" fill="none">
  <path d="M55.1158 7.50499L58.2905 12.6494V7.5189C58.2905 7.5189 58.6487 7.26356 59.5098 7.26356C60.3708 7.26356 60.7378 7.5189 60.7378 7.5189V16.4327C60.7378 16.4327 60.3942 16.689 59.5215 16.689C58.6487 16.689 58.3295 16.4605 58.3295 16.4605L55.1421 11.3171V16.4337C55.1421 16.4337 54.7848 16.69 53.9111 16.69C53.0374 16.69 52.7065 16.4337 52.7065 16.4337V7.51989C52.7065 7.51989 53.0384 7.26456 53.9248 7.26456C54.8112 7.26456 55.1148 7.50697 55.1148 7.50697L55.1158 7.50499Z" fill="#457AA5"/>
  <path d="M67.2209 12.5948H64.9063V14.8709H68.2538C68.2538 14.8709 68.5047 15.1531 68.5047 15.772C68.5047 16.391 68.2538 16.688 68.2538 16.688H62.4589V7.26257H67.9892C67.9892 7.26257 68.2538 7.54572 68.2538 8.17859C68.2538 8.81146 67.9892 9.09362 67.9892 9.09362H64.9063V10.7637H67.2209C67.2209 10.7637 67.4728 11.0598 67.4728 11.6787C67.4728 12.2977 67.2209 12.5948 67.2209 12.5948Z" fill="#457AA5"/>
  <path d="M71.4802 16.4327L68.9791 7.5189C68.9791 7.5189 69.3491 7.26356 70.2101 7.26356C71.0711 7.26356 71.4275 7.5189 71.4275 7.5189L72.6839 12.0434C72.7766 12.3802 72.8166 12.6365 72.8557 12.7845C72.8557 12.7428 72.9221 12.3663 73.0011 12.0573L74.0984 7.5189C74.0984 7.5189 74.5211 7.26356 75.1176 7.26356C75.7141 7.26356 76.084 7.5189 76.084 7.5189L77.3004 12.7845C77.3004 12.6623 77.3795 12.3255 77.4586 12.0573L78.756 7.5189C78.7686 7.5189 79.1132 7.26356 79.9596 7.26356C80.806 7.26356 81.1897 7.5189 81.1897 7.5189L78.6496 16.4327C78.6496 16.4327 78.2922 16.6751 77.4859 16.689C76.5468 16.689 76.2158 16.4327 76.2158 16.4327L75.223 12.2987C75.1449 11.9887 75.0902 11.6529 75.0785 11.5844L74.9184 12.2987L73.9266 16.4327C73.9266 16.4327 73.583 16.689 72.7092 16.689C71.8355 16.689 71.4802 16.4327 71.4802 16.4327Z" fill="#457AA5"/>
  <path d="M54.3485 19.2195L55.4331 21.1579C55.804 21.8176 56.0022 22.5587 56.0285 22.6521C56.0559 22.5587 56.2404 21.8315 56.624 21.1579L57.735 19.2195C57.735 19.2195 58.0659 18.9771 58.8723 18.9771C59.786 18.9771 60.1697 19.2861 60.1697 19.2861L57.2449 24.4295V28.1453C57.2449 28.1453 56.9013 28.4026 56.0276 28.4026C55.1539 28.4026 54.8239 28.1453 54.8239 28.1453V24.3898L51.8991 19.2871C51.8991 19.2871 52.2965 18.9781 53.2082 18.9781C53.9892 18.9781 54.3465 19.2205 54.3465 19.2205L54.3485 19.2195Z" fill="#457AA5"/>
  <path d="M64.6017 28.497C61.4788 28.497 60.117 26.6381 60.117 23.7033C60.117 20.7684 61.4798 18.8827 64.6017 18.8827C67.7237 18.8827 69.0865 20.7674 69.0865 23.7033C69.0865 26.6391 67.711 28.497 64.6017 28.497ZM64.6017 26.6778C65.9235 26.6778 66.6391 25.4667 66.6391 23.7033C66.6391 21.9398 65.9235 20.7138 64.6017 20.7138C63.2799 20.7138 62.5653 21.9398 62.5653 23.7033C62.5653 25.4667 63.2789 26.6778 64.6017 26.6778Z" fill="#457AA5"/>
  <path d="M72.844 28.1463C72.844 28.1463 72.4867 28.4036 71.6129 28.4036C70.7392 28.4036 70.4083 28.1463 70.4083 28.1463V19.3546C70.4083 19.3546 71.4011 18.8837 73.2266 18.8837C75.9913 18.8837 77.275 19.9607 77.275 21.8454C77.275 23.7301 75.8722 24.4563 75.7004 24.4712L77.8432 28.0936C77.5796 28.2675 76.8523 28.4026 76.3623 28.4026C75.7267 28.4026 75.225 28.1741 75.225 28.1741L73.6113 25.3068C73.5175 25.1041 73.3858 24.9561 73.1612 24.9561H72.844V28.1463ZM73.5322 20.7148C73.1349 20.7148 72.844 20.7952 72.844 20.7952V23.138H73.5049C74.4694 23.138 74.8413 22.4514 74.8413 21.9269C74.8413 21.2403 74.3786 20.7148 73.5322 20.7148Z" fill="#457AA5"/>
  <path d="M87.211 28.0787C87.211 28.0787 86.5901 28.4026 85.5836 28.4026C84.7236 28.4026 84.3663 28.1741 84.3663 28.1741L81.2317 23.8384V28.1463C81.2317 28.1463 80.9007 28.4036 80.027 28.4036C79.1533 28.4036 78.797 28.1463 78.797 28.1463V19.2344C78.797 19.2344 79.1533 18.9781 80.027 18.9781C80.9007 18.9781 81.2317 19.2344 81.2317 19.2344V23.4221L84.2618 19.2205C84.2618 19.2205 84.6182 18.9781 85.4782 18.9781C86.4701 18.9781 86.8684 19.3139 86.8684 19.3139L83.9045 23.4221L87.212 28.0797L87.211 28.0787Z" fill="#457AA5"/>
  <path d="M58.9806 31.3374C59.1515 32.1988 58.7014 32.8853 58.1987 33.0602C57.7096 32.7244 56.9296 32.4273 56.1096 32.4273C55.2895 32.4273 54.8122 32.7502 54.8122 33.2082C54.8122 33.6394 55.1958 33.7874 56.214 34.1252L57.4841 34.5415C58.8479 34.9985 59.6933 35.7 59.6933 37.1803C59.6933 38.8911 58.5823 40.2105 55.8831 40.2105C53.9912 40.2105 52.8256 39.5637 52.4029 39.1335C52.2711 38.5007 52.6137 37.7059 53.1057 37.4505C53.5284 37.7744 54.7848 38.3934 56.0676 38.3934C56.8359 38.3934 57.2596 38.1112 57.2596 37.5986C57.2596 37.2359 57.034 37.0064 56.5049 36.8306L54.3758 36.1719C53.2365 35.8073 52.3775 34.9737 52.3775 33.6126C52.3775 31.6732 53.6729 30.5973 56.0676 30.5973C57.5895 30.5973 58.4779 31.0145 58.9806 31.3374Z" fill="#457AA5"/>
  <path d="M60.3542 32.5227C60.3542 32.5227 60.1023 32.2534 60.1023 31.6067C60.1023 30.9599 60.3542 30.6906 60.3542 30.6906H67.5382C67.5382 30.6906 67.7901 30.9738 67.7901 31.6067C67.7901 32.2395 67.5382 32.5227 67.5382 32.5227H65.1562V39.8608C65.1562 39.8608 64.8136 40.1161 63.9525 40.1161C63.0915 40.1161 62.7088 39.8608 62.7088 39.8608V32.5227H60.3542Z" fill="#457AA5"/>
  <path d="M72.7502 30.9341L76.3232 39.8201C76.3232 39.8201 75.9659 40.1171 75.0658 40.1171C74.2321 40.1171 73.9032 39.8747 73.9032 39.8747L73.254 38.3258H69.8538L69.2446 39.8747C69.2446 39.8747 68.901 40.1171 68.081 40.1171C67.1819 40.1171 66.7972 39.8201 66.7972 39.8201L70.3702 30.9341C70.3702 30.9341 70.7002 30.6916 71.5592 30.6916C72.4183 30.6916 72.7502 30.9341 72.7502 30.9341ZM70.5674 36.5216H72.5394L71.8775 34.9051C71.7457 34.5822 71.5729 33.9226 71.5583 33.855C71.5329 33.9226 71.3337 34.5822 71.2156 34.9051L70.5674 36.5216Z" fill="#457AA5"/>
  <path d="M75.5949 32.5227C75.5949 32.5227 75.3431 32.2534 75.3431 31.6067C75.3431 30.9599 75.5949 30.6906 75.5949 30.6906H82.779C82.779 30.6906 83.0298 30.9738 83.0298 31.6067C83.0298 32.2395 82.779 32.5227 82.779 32.5227H80.397V39.8608C80.397 39.8608 80.0543 40.1161 79.1933 40.1161C78.3323 40.1161 77.9496 39.8608 77.9496 39.8608V32.5227H75.5949Z" fill="#457AA5"/>
  <path d="M88.9047 36.0228H86.5891V38.299H89.9356C89.9356 38.299 90.1875 38.5821 90.1875 39.2001C90.1875 39.8181 89.9356 40.1161 89.9356 40.1161H84.1408V30.6897H89.6711C89.6711 30.6897 89.9356 30.9728 89.9356 31.6057C89.9356 32.2385 89.6711 32.5217 89.6711 32.5217H86.5882V34.1908H88.9038C88.9038 34.1908 89.1547 34.4879 89.1547 35.1078C89.1547 35.7278 88.9038 36.0219 88.9038 36.0219L88.9047 36.0228Z" fill="#457AA5"/>
  <path d="M51.7107 54.9999C51.577 54.9999 51.4335 54.974 51.2939 54.8965C51.085 54.7803 50.9395 54.5876 50.8858 54.3551C50.8233 54.0868 50.8936 53.7868 51.082 53.5116L51.1426 53.4202C51.2041 53.3268 51.2685 53.2354 51.3407 53.1519C51.4218 53.0595 51.5047 52.995 51.5741 52.9493C51.5243 52.6691 51.5418 52.4267 51.5682 52.2061C51.5877 52.0233 51.6346 51.8683 51.6726 51.7451C51.6892 51.6925 51.7058 51.6388 51.7185 51.5812C51.8201 51.145 51.8855 50.7397 51.9206 50.3453C51.9528 49.9916 51.947 49.9846 51.8864 49.9061C51.7 49.6707 51.3847 49.5018 51.0498 49.3229C50.8878 49.2365 50.7286 49.1491 50.5754 49.0557C49.607 48.4536 48.6376 47.8505 47.6701 47.2465L47.3294 47.0339C47.2513 46.9862 47.1147 46.9156 46.9516 46.8282C45.8817 46.2659 45.172 45.8526 45.0539 45.2595C45.0363 45.173 44.9465 44.9644 44.884 44.864C44.8411 44.8611 44.7307 44.8521 44.6546 44.8471C44.3032 44.8183 43.7711 44.7726 43.3484 44.3196C43.2635 44.2272 43.1786 44.1408 43.1005 44.0583C42.5098 43.4443 42.0003 42.9148 41.9329 41.5993C41.9241 41.4275 41.9251 41.2506 41.928 41.0728C41.9339 40.5283 41.927 40.1836 41.7103 39.962C41.6078 39.8567 41.435 39.7862 41.2349 39.7037C40.9889 39.6034 40.7097 39.4881 40.45 39.2686C40.37 39.2 40.2792 39.1007 40.1776 38.9854C40.0712 38.8602 39.9082 38.6724 39.7969 38.6337C38.974 38.3436 37.986 38.3178 36.96 38.3178L3.07245 38.2909C2.85964 38.2909 2.66927 38.3138 2.48477 38.3347C2.07378 38.3823 1.60812 38.437 1.2313 38.0962C0.866192 37.7664 0.815429 37.2607 0.814452 36.8076L0.8125 34.3993C0.8125 34.2722 0.847644 34.147 0.913051 34.0387C1.22544 33.529 1.83265 33.2558 2.3686 33.0144C2.56872 32.924 2.77666 32.8316 2.88795 32.7571C3.17593 32.5623 3.43561 32.302 3.7109 32.0248C3.91688 31.8182 4.13068 31.6046 4.36887 31.4059C4.69786 31.1317 5.07078 30.931 5.43296 30.7372C5.74535 30.5703 6.03821 30.4124 6.24127 30.2395C6.38575 30.1173 6.49216 29.9146 6.61906 29.6792C6.75476 29.4238 6.90998 29.1337 7.15208 28.8804C7.41273 28.6081 7.7427 28.4194 8.03263 28.2535C8.69744 27.871 8.68182 27.8322 8.57736 27.5769C8.52855 27.4577 8.48072 27.3553 8.43972 27.2639C8.24447 26.8357 8.07754 26.4681 8.19078 25.7051C8.2025 25.6306 8.21616 25.5521 8.22983 25.4706C8.25619 25.3325 8.30305 25.0772 8.27571 25.0037C8.27571 25.0037 8.26204 24.9927 8.23471 24.9778C8.21128 24.9659 8.12928 24.9669 8.06875 24.9679C7.87448 24.9659 7.51914 24.9768 7.2497 24.6689C6.98124 24.3629 6.99686 23.9555 7.03982 23.6356C7.08179 23.3127 7.06032 23.1051 7.03982 22.9223C6.95684 22.1453 7.21358 21.7817 8.10097 21.424C10.7524 20.351 12.901 19.9884 14.8613 20.2805C14.9775 20.2974 15.1356 20.2656 15.3182 20.2269C15.5944 20.1702 15.9351 20.1017 16.312 20.1752L18.3952 20.5766C19.2475 20.7415 19.6653 20.9054 20.3047 21.4995C20.6327 21.8046 20.7655 21.7718 21.3327 21.5661C21.6168 21.4638 21.9399 21.3485 22.3323 21.2949C22.9727 21.2084 23.5731 21.2661 24.153 21.3227C24.4136 21.3475 24.6762 21.3734 24.9408 21.3843C25.2356 21.3952 25.6085 21.2561 25.9717 21.121C26.1318 21.0614 26.2889 21.0028 26.4412 20.9541C26.78 20.8468 27.0973 20.7991 27.4038 20.7514C27.5551 20.7266 27.7064 20.7037 27.8607 20.6729C27.8714 20.6531 27.8821 20.6332 27.8939 20.6113C27.9417 20.5249 27.9944 20.4345 28.0598 20.3411C28.3419 19.9497 28.7471 19.7003 29.0722 19.4966L29.2078 19.4122C29.5564 19.1916 29.8629 18.9879 30.105 18.7386C30.5423 18.2796 31.1232 18.3114 31.5108 18.3312C31.6455 18.3392 31.8495 18.3481 31.91 18.3223C32.1678 18.207 31.9413 17.3993 31.8065 16.9165C31.7119 16.5777 31.6299 16.2846 31.6133 16.0183C31.5664 15.2642 31.9764 14.7317 32.3064 14.3045C32.5651 13.9687 32.7213 13.7481 32.7164 13.5355C32.7164 13.4948 32.7027 13.4382 32.6851 13.3845C32.4587 13.4948 32.0955 13.6369 31.6796 13.4421C31.0129 13.1302 30.6468 12.0264 30.8508 11.3985C31.0197 10.8779 31.54 10.5421 31.9198 10.2957L32.0565 10.2053C32.3806 9.98471 32.7242 9.79792 33.0542 9.6181C33.5159 9.36873 33.9513 9.13227 34.2949 8.82726C34.4404 8.69711 34.5761 8.56994 34.7089 8.44376C35.0076 8.1626 35.3161 7.8715 35.6792 7.61319C35.7056 7.5188 35.728 7.34096 35.7437 7.22571C35.7729 7.00714 35.8022 6.78062 35.8803 6.5849C36.2513 5.64304 37.1592 4.90884 37.9597 4.25908C38.2252 4.04448 38.4771 3.84081 38.6743 3.65602C38.7992 3.53878 38.9222 3.42055 39.0452 3.30332C39.6388 2.73701 40.2509 2.15084 40.9967 1.68289C41.601 1.30536 42.3898 0.833439 43.1249 0.552274C44.0972 0.1807 44.5579 0.208518 45.4766 0.262168L45.6474 0.27111C47.3607 0.371455 49.1384 0.32476 50.8575 0.281045C51.7205 0.258194 52.5796 0.235343 53.4347 0.230376C53.6651 0.230376 54.0156 0.185667 54.3836 0.138972C55.6078 -0.0140291 56.994 -0.188888 57.7818 0.503592C58.1118 0.792705 58.2924 1.19806 58.3031 1.67594C58.311 2.05248 58.1567 2.33464 58.0435 2.54129C58.0064 2.60686 57.9527 2.7082 57.9458 2.74297C57.9488 2.73205 57.9849 2.78768 58.0103 2.82742C58.1362 3.01718 58.3686 3.37088 58.2748 3.89843C58.2397 4.10111 58.1811 4.3167 58.1216 4.53528C58.0464 4.81147 57.9693 5.09761 57.9624 5.31419C57.9498 5.69073 57.6335 5.99376 57.2703 5.97289C56.9013 5.95998 56.6104 5.64603 56.6231 5.26849C56.6367 4.89195 56.7392 4.50944 56.831 4.17264C56.8788 3.9948 56.9276 3.82094 56.9569 3.65502C56.9481 3.65502 56.9218 3.62323 56.8993 3.58746C56.791 3.42254 56.6065 3.14535 56.6065 2.73701C56.6065 2.36345 56.7607 2.08328 56.873 1.87862C56.9072 1.81702 56.9589 1.72462 56.9657 1.69084C56.9608 1.58354 56.9267 1.55274 56.9072 1.53685C56.5694 1.23979 55.2544 1.40372 54.5496 1.49313C54.1386 1.5438 53.752 1.59348 53.4435 1.59547C52.5971 1.60043 51.7439 1.62229 50.8907 1.64315C49.1442 1.68886 47.3382 1.73654 45.5722 1.63421L45.3985 1.62328C44.5345 1.57162 44.3022 1.55871 43.5964 1.82894C42.9618 2.07235 42.2101 2.5244 41.7006 2.84431C41.0699 3.23973 40.533 3.75338 39.9648 4.29683C39.8379 4.41804 39.712 4.53925 39.5831 4.65947C39.3479 4.87804 39.0794 5.09661 38.7953 5.32611C38.1237 5.87056 37.3642 6.48555 37.1231 7.09457C37.1065 7.14425 37.085 7.30221 37.0713 7.40753C37.0147 7.84666 36.9424 8.3931 36.5041 8.69016C36.1927 8.90277 35.9145 9.16704 35.6187 9.44523C35.4771 9.57935 35.3317 9.71546 35.1774 9.85257C34.7186 10.2629 34.1924 10.548 33.6838 10.8222C33.3675 10.9931 33.0698 11.1541 32.8033 11.3369C32.7554 11.3707 32.6978 11.4064 32.6373 11.4462C32.5114 11.5276 32.2332 11.7065 32.1346 11.8217C32.1424 11.8992 32.1726 12.0115 32.2117 12.1009C32.3757 12.0214 32.6041 11.924 32.8804 11.9459C33.6633 12.0135 34.0401 12.8937 34.0558 13.4988C34.0743 14.2191 33.677 14.7337 33.3587 15.145C33.0971 15.4868 32.9351 15.7074 32.9487 15.9319C32.9565 16.0511 33.0288 16.3114 33.0932 16.5419C33.3314 17.3933 33.7746 18.978 32.4479 19.5701C32.0965 19.7281 31.7314 19.7082 31.4375 19.6933C31.3126 19.6864 31.1046 19.6764 31.047 19.7023C30.7171 20.051 30.3227 20.3113 29.9166 20.5706L29.7692 20.663C29.5212 20.816 29.2654 20.976 29.1405 21.1488C29.1083 21.1935 29.0819 21.2412 29.0585 21.2859C28.9345 21.5085 28.7256 21.884 28.174 21.9993C27.9827 22.04 27.7943 22.0708 27.6059 22.0996C27.3364 22.1414 27.0807 22.1811 26.8386 22.2566C26.7087 22.2993 26.5711 22.35 26.4334 22.4017C25.9697 22.5745 25.4435 22.7732 24.8871 22.7474C24.5981 22.7355 24.3131 22.7087 24.027 22.6808C23.4989 22.6282 22.9981 22.5805 22.511 22.6481C22.2572 22.6828 22.0258 22.7653 21.7817 22.8537C21.1716 23.0733 20.3369 23.3733 19.4046 22.508C18.9927 22.1265 18.8267 22.049 18.1473 21.9178L16.065 21.5164C15.942 21.4936 15.775 21.5264 15.5818 21.5651C15.3289 21.6168 15.0136 21.6784 14.6719 21.6297C12.9508 21.3724 11.0218 21.7112 8.59689 22.6928C8.49829 22.7325 8.42703 22.7643 8.37431 22.7891C8.39579 22.9779 8.42312 23.2491 8.39091 23.6217C8.53343 23.6416 8.69353 23.6843 8.86047 23.7737C9.81228 24.2834 9.63461 25.256 9.5487 25.724C9.53601 25.7876 9.52528 25.8511 9.51551 25.9127C9.4628 26.2694 9.49501 26.3429 9.65511 26.6917C9.70392 26.798 9.75664 26.9162 9.81326 27.0543C10.3941 28.4681 9.28415 29.1039 8.68865 29.4447C8.46705 29.5719 8.23764 29.701 8.11268 29.8331C7.99944 29.9524 7.89987 30.1372 7.79541 30.3329C7.62945 30.6448 7.44104 30.9975 7.10522 31.2847C6.79088 31.5529 6.41894 31.7536 6.05871 31.9454C5.74144 32.1153 5.44077 32.2762 5.21623 32.464C5.02782 32.6219 4.84527 32.8048 4.65295 32.9985C4.34252 33.3085 4.02524 33.6294 3.62499 33.8976C3.41901 34.0347 3.17203 34.147 2.9104 34.2652C2.69661 34.3606 2.33443 34.5225 2.14992 34.6626L2.15383 36.8096C2.15383 36.8881 2.15578 36.9527 2.15871 37.0023C2.21533 36.9974 2.27586 36.9904 2.32662 36.9835C2.5287 36.9606 2.77959 36.9308 3.06952 36.9308L36.9581 36.9566C38.0573 36.9566 39.2141 36.9884 40.2304 37.3471C40.6755 37.5021 40.9801 37.8538 41.1812 38.0853C41.2281 38.1399 41.2681 38.1896 41.3052 38.2234C41.4018 38.3048 41.5551 38.3674 41.7328 38.441C42.0129 38.5562 42.3615 38.7003 42.6572 39.0043C43.2811 39.6411 43.2713 40.4469 43.2645 41.0927C43.2606 41.2417 43.2606 41.3897 43.2664 41.5328C43.3084 42.3326 43.5261 42.5581 44.0532 43.1055C44.1372 43.1929 44.2251 43.2853 44.3188 43.3847C44.3842 43.4542 44.5287 43.4701 44.761 43.491C45.0412 43.5138 45.3897 43.5417 45.6953 43.7751C46.0291 44.0275 46.2546 44.5888 46.3376 44.8809C46.5455 45.0846 47.2777 45.4711 47.5647 45.6211C47.7639 45.7264 47.9298 45.8158 48.0265 45.8754L48.3672 46.088C49.3346 46.6891 50.3011 47.2922 51.2705 47.8943C51.3993 47.9727 51.533 48.0463 51.6707 48.1188C52.0924 48.3443 52.5698 48.6006 52.9291 49.0567C53.3215 49.5544 53.2942 50.0045 53.259 50.4029C53.3156 50.2936 53.3781 50.1893 53.4513 50.0879C53.5841 49.8982 53.7393 49.7541 53.877 49.626C54.0136 49.4998 54.1073 49.4104 54.1396 49.3388C54.1132 49.2772 54.0527 49.1739 54.0117 49.1034C53.8487 48.8232 53.6271 48.4387 53.7315 47.9857C53.7725 47.8108 53.8789 47.6588 54.0283 47.5634C54.0849 47.5276 54.205 47.4591 54.3631 47.3717C54.5818 47.2495 55.1373 46.9405 55.475 46.71C54.9723 45.5913 55.1392 44.2163 55.2886 42.9843C55.3345 42.6038 55.3784 42.2451 55.3989 41.9222C55.4204 41.5467 55.7337 41.2606 56.1076 41.2834C56.4776 41.3063 56.7588 41.6301 56.7353 42.0057C56.7148 42.3693 56.667 42.7498 56.6182 43.1522C56.4776 44.3166 56.3165 45.637 56.833 46.3911C56.954 46.5669 56.994 46.7895 56.9452 47.0021C56.8417 47.4502 56.3898 47.7879 55.1958 48.4606C55.352 48.7308 55.5395 49.0904 55.4731 49.5167C55.4623 49.5812 55.4487 49.6428 55.4321 49.7015C55.766 49.5793 56.1154 49.464 56.4845 49.3577C57.8775 48.9543 59.3409 48.7745 61.225 48.7745C62.0587 48.7745 62.8006 48.5053 63.5874 48.2211C64.2103 47.9946 64.8546 47.7621 65.576 47.6508C66.1852 47.5555 66.5005 47.7562 66.7728 47.9688C66.8636 48.0403 66.93 48.09 67.0442 48.1357C67.3625 48.2619 67.7325 48.2211 68.1601 48.1754C68.5925 48.1277 69.0836 48.0731 69.5844 48.2042C69.8821 48.2837 70.09 48.5579 70.0861 48.8709C70.0744 50.0571 68.5076 50.5459 67.7549 50.7814L67.0384 51.0099C66.4985 51.1848 65.9567 51.3586 65.41 51.5176C65.1631 51.5881 64.918 51.6587 64.672 51.7223C64.3889 51.7948 64.099 51.9597 63.7944 52.1316C63.481 52.3094 63.1579 52.4922 62.786 52.6174C62.1426 52.83 61.4837 52.9413 60.6471 52.9761C60.4069 52.987 60.1746 53.0943 59.9295 53.2056C59.5674 53.3735 59.1154 53.5801 58.6107 53.4132C58.3949 53.3864 57.5534 53.6775 57.1502 53.8196C56.832 53.9289 56.5577 54.0242 56.3419 54.0759C55.598 54.2528 54.8415 54.3918 54.1103 54.527L53.5968 54.6223C53.1516 54.7058 52.7035 54.7922 52.2613 54.8926L52.2076 54.9085C52.0797 54.9482 51.9021 55.0038 51.7078 55.0038L51.7107 54.9999ZM53.0735 51.6746C53.0569 51.7471 53.0403 51.8196 53.0237 51.8941C53.0032 51.9806 52.9788 52.064 52.9544 52.1455C52.9281 52.2359 52.9066 52.3055 52.8988 52.3651C52.8793 52.5379 52.8773 52.6313 52.8978 52.7247C52.9495 52.9791 52.9388 53.1907 52.8949 53.3645C53.0482 53.3347 53.2024 53.3049 53.3566 53.2751L53.875 53.1808C54.5896 53.0486 55.3296 52.9125 56.0412 52.7436C56.1906 52.7078 56.4483 52.6194 56.7217 52.525C57.7721 52.1604 58.4994 51.9359 59.0295 52.1127C59.0646 52.1058 59.2559 52.0173 59.3828 51.9597C59.7001 51.8137 60.0945 51.6328 60.5924 51.611C61.3021 51.5812 61.8498 51.4908 62.372 51.3169C62.622 51.2345 62.8748 51.0914 63.1442 50.9374C63.5123 50.7298 63.892 50.5142 64.3469 50.3969C64.5793 50.3373 64.8136 50.2707 65.0459 50.2042C65.5789 50.0482 66.11 49.8773 66.6362 49.7064L67.1253 49.5514C66.9388 49.5246 66.7504 49.4779 66.56 49.4014C66.2672 49.2862 66.0836 49.1411 65.9616 49.0457C65.9313 49.0229 65.906 48.999 65.8757 48.9812C65.8737 48.9851 65.8405 48.9851 65.7781 48.9941C65.1845 49.0855 64.6281 49.2862 64.0394 49.4998C63.1794 49.8107 62.293 50.1326 61.2279 50.1326C59.4717 50.1326 58.1235 50.2966 56.8535 50.6642C55.7142 50.992 54.7868 51.3984 54.0166 51.9031C53.7901 52.0521 53.5001 52.0481 53.2776 51.8951C53.1917 51.8365 53.1214 51.76 53.0735 51.6716V51.6746Z" fill="#154973"/>
  <path d="M67.6348 51.8019C67.6348 51.8019 67.6173 51.782 67.6173 51.7303C67.6173 51.6787 67.6348 51.6588 67.6348 51.6588H68.5564C68.5564 51.6588 68.5749 51.6806 68.5749 51.7303C68.5749 51.78 68.5564 51.8019 68.5564 51.8019H68.1932V52.9205C68.1932 52.9205 68.1659 52.9404 68.0976 52.9404C68.0292 52.9404 67.998 52.9205 67.998 52.9205V51.8019H67.6348Z" fill="#154973"/>
  <path d="M69.4282 52.8659C69.4135 52.8748 69.3891 52.8858 69.3471 52.8858C69.3178 52.8858 69.2837 52.8798 69.27 52.8659L68.9889 52.1476C68.9723 52.1088 68.9459 52.0323 68.944 52.0214C68.944 52.0264 68.9371 52.1277 68.9332 52.1565L68.8815 52.9205C68.8815 52.9205 68.8561 52.9404 68.7858 52.9404C68.7155 52.9404 68.6862 52.9205 68.6862 52.9205L68.7839 51.6787C68.7839 51.6787 68.8112 51.6588 68.8776 51.6588C68.9518 51.6588 68.9781 51.6787 68.9781 51.6787L69.3042 52.5162L69.3471 52.6533C69.3481 52.6473 69.3774 52.5559 69.392 52.5162L69.7181 51.6787C69.7181 51.6787 69.7464 51.6588 69.8206 51.6588C69.886 51.6588 69.9124 51.6787 69.9124 51.6787L70.01 52.9205C70.01 52.9205 69.9807 52.9404 69.9104 52.9404C69.8401 52.9404 69.8167 52.9205 69.8167 52.9205L69.763 52.1546L69.7523 52.0194C69.7523 52.0194 69.722 52.1148 69.7093 52.1456L69.4282 52.8659Z" fill="#154973"/>
</svg>`;
var A5 = '@charset "UTF-8";:host{--_nys-unavheader-padding--gutter: var(--nys-gutter-xs, 20px);--_nys-unavheader-background-color: var( --nys-color-surface, var(--nys-color-white, #ffffff) );--_nys-unavheader-color: var( --nys-color-text, var(--nys-color-neutral-900, #1b1b1b) );--_nys-unavheader-max-width--content: var( --nys-unavheader-max-width--content, 1280px );--_nys-unavheader-background-color--section-raised: var( --nys-color-surface-raised, var(--nys-color-neutral-10, #f6f6f6) );font-size:var(--nys-font-size-ui-md, 16px);font-weight:var(--nys-font-weight-semibold, 600);line-height:var(--nys-font-lineheight-ui-md, 24px);font-family:var(--nys-font-family-ui, var(--nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif))}.nys-unavheader{display:flex;flex-direction:column}.nys-unavheader>*{padding:0 var(--_nys-unavheader-padding--gutter)}.nys-unavheader__alert.wrapper{order:3;background-color:var(--_nys-unavheader-alert-background-color)}.nys-unavheader__alert.wrapper[data-type=info]{--_nys-unavheader-alert-background-color: var(--nys-color-info, #004dd1);--_nys-alert-color: var(--nys-color-ink-reverse, #ffffff);--_nys-alert-color--link: var(--nys-color-ink-reverse, #ffffff);--_nys-alert-color--link--hover: var(--nys-color-ink-reverse, #ffffff);--_nys-alert-color--link--active: var(--nys-color-ink-reverse, #ffffff)}.nys-unavheader__alert.wrapper[data-type=success]{--_nys-unavheader-alert-background-color: var(--nys-color-success, #1e752e);--_nys-alert-color: var(--nys-color-ink-reverse, #ffffff);--_nys-alert-color--link: var(--nys-color-ink-reverse, #ffffff);--_nys-alert-color--link--hover: var(--nys-color-ink-reverse, #ffffff);--_nys-alert-color--link--active: var(--nys-color-ink-reverse, #ffffff)}.nys-unavheader__alert.wrapper[data-type=warning]{--_nys-unavheader-alert-background-color: var(--nys-color-warning, #face00);--_nys-alert-color: var(--nys-color-ink, #1b1b1b);--_nys-alert-color--link: var(--nys-color-ink, #1b1b1b);--_nys-alert-color--link--hover: var(--nys-color-ink, #1b1b1b);--_nys-alert-color--link--active: var(--nys-color-ink, #1b1b1b)}.nys-unavheader__alert.wrapper[data-type=danger]{--_nys-unavheader-alert-background-color: var(--nys-color-danger, #b52c2c);--_nys-alert-color: var(--nys-color-ink-reverse, #ffffff);--_nys-alert-color--link: var(--nys-color-ink-reverse, #ffffff);--_nys-alert-color--link--hover: var(--nys-color-ink-reverse, #ffffff);--_nys-alert-color--link--active: var(--nys-color-ink-reverse, #ffffff)}.nys-unavheader__alert.wrapper[data-type=emergency]{--_nys-unavheader-alert-background-color: var( --nys-color-emergency, #721c1c );--_nys-alert-color: var(--nys-color-ink-reverse, #ffffff);--_nys-alert-color--link: var(--nys-color-ink-reverse, #ffffff);--_nys-alert-color--link--hover: var(--nys-color-ink-reverse, #ffffff);--_nys-alert-color--link--active: var(--nys-color-ink-reverse, #ffffff)}.nys-unavheader__alert.wrapper[data-type=base]{--_nys-unavheader-alert-background-color: var(--nys-color-base, #62666a);--_nys-alert-color: var(--nys-color-ink-reverse, #ffffff);--_nys-alert-color--link: var(--nys-color-ink-reverse, #ffffff);--_nys-alert-color--link--hover: var(--nys-color-ink-reverse, #ffffff);--_nys-alert-color--link--active: var(--nys-color-ink-reverse, #ffffff)}.nys-unavheader__alert.wrapper nys-alert{--_nys-alert-background-color: var( --_nys-unavheader-alert-background-color );--_nys-alert-border-radius: 0;--_nys-alert-border-width: 0;--_nys-alert-padding: var(--nys-space-250, 20px) 0;display:block;max-width:var(--_nys-unavheader-max-width--content);margin:0 auto}.nys-unavheader__alert-text{font-weight:var(--nys-font-weight-regular, 400)}.nys-unavheader__main.wrapper{background-color:var(--_nys-unavheader-background-color)}.nys-unavheader__main.content{display:flex;align-items:center;justify-content:space-between;gap:var(--nys-space-300, 24px);padding-top:var(--nys-space-100, 8px);padding-bottom:var(--nys-space-100, 8px)}.nys-unavheader__spacer{flex:1}.nys-unavheader__trustbar.wrapper{background-color:var(--nys-color-neutral-100, #d0d0ce);padding-top:var(--nys-space-100, 8px);padding-bottom:var(--nys-space-100, 8px)}.nys-unavheader__trustbar.wrapper>.content,.nys-unavheader__trustbar.wrapper>.content *{cursor:pointer}.nys-unavheader__trustbar.inline,.nys-unavheader__trustbar.inline #nys-unavheader__official{background-color:transparent;cursor:default}.nys-unavheader__trustbar>.content,.nys-unavheader__trustbar.inline{display:flex;align-items:center;gap:var(--nys-space-100, 8px);height:fit-content;font-size:var(--nys-font-size-ui-xs, 12px);font-weight:var(--nys-font-weight-regular, 400);line-height:var(--nys-font-lineheight-ui-xs, 20px);font-family:var(--nys-font-family-ui, var(--nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif))}a#nys-unavheader__logolink{outline-offset:var(--nys-space-2px, 2px)}.nys-unavheader__logo svg{vertical-align:top;height:var(--nys-size-500, 40px);width:auto}#nys-unavheader__know,#nys-unavheader__know--inline{width:max-content;display:flex;align-items:center;cursor:pointer;gap:var(--nys-space-50, 4px);--_nys-button-padding--x: var(--nys-space-50, 4px);--_nys-button-padding--y: var(--nys-space-2px, 2px);--_nys-button-height: var(--nys-font-lineheight-ui-xs, 20px);--_nys-button-border-radius: var(--nys-radius-md, 4px);--_nys-button-border-width: 0px;--_nys-button-font-size: var(--nys-font-size-ui-xs, 12px);--_nys-button-font-weight: var(--nys-font-weight-regular, 400);--_nys-button-line-height: var(--nys-font-lineheight-ui-xs, 20px);--_nys-button-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) )}.hide{display:none}.nys-unavheader__trustpanel.wrapper.show{background-color:var(--_nys-unavheader-background-color--section-raised);display:flex;padding-top:var(--nys-space-400, 32px);padding-bottom:var(--nys-space-400, 32px)}.nys-unavheader__messagewrapper{display:flex;gap:var(--nys-space-400, 32px)}.nys-unavheader__trustpanel.content{display:flex;flex-direction:row-reverse}.nys-unavheader__trustcontentmessage{flex:1;display:flex;flex-direction:column;gap:var(--nys-space-100, 8px);font-family:var(--nys-font-family-ui, "Proxima Nova");font-size:var(--nys-font-size-ui-sm, 14px);font-style:normal;font-weight:400;line-height:var(--nys-font-lineheight-ui-sm, 24px);letter-spacing:var(--nys-font-letterspacing-ui-sm, .044px)}.nys-unavheader__searchdropdown.wrapper{background-color:var(--_nys-unavheader-background-color--section-raised);padding-top:var(--nys-space-250, 20px);padding-bottom:var(--nys-space-250, 20px)}.nys-unavheader__trustpanel.wrapper>.content,.nys-unavheader__main.wrapper>.content,.nys-unavheader__trustbar>.content,.nys-unavheader__searchdropdown.wrapper>.content{max-width:var(--_nys-unavheader-max-width--content);margin:0 auto}.nys-unavheader__search{max-width:var(--nys-form-width-md, 200px);transition:max-width .5s ease;--_nys-textinput-gap: 0px}.nys-unavheader__search:focus{width:var(--nys-form-width-lg, 384px);max-width:var(--nys-form-width-lg, 384px)}#nys-unavheader__translate--desktop,#nys-unavheader__translate--mobile,#nys-unavheader__searchbutton{--nys-button-color: var(--nys-color-state-blue-700, #154973);--nys-button-color--hover: var(--nys-color-state-blue-700, #154973);--nys-button-color--active: var(--nys-color-state-blue-700, #154973);--_nys-button-border-width: 0px}.nys-unavheader__iconbutton{--_nys-button-width: var(--nys-size-400, 32px);--_nys-button-height: var(--nys-size-400, 32px);--_nys-button-padding--y: 0;--_nys-button-padding--x: 0}.nys-unavheader__translatewrapper{position:relative}.nys-unavheader__languagelist.show{position:absolute;display:flex;flex-direction:column;min-width:fit-content;width:max-content;z-index:99999;background-color:var(--_nys-unavheader-background-color--section-raised);color:var(--nys-color-state-blue-700, #154973);margin-top:var(--nys-space-150, 12px);right:0}.nys-unavheader__languagelink{--_nys-button-padding: var(--nys-space-200, 16px) var(--nys-space-250, 20px);--nys-button-color: var(--nys-color-state-blue-700, #154973);--nys-button-color--hover: var(--nys-color-state-blue-700, #154973);--nys-button-color--active: var(--nys-color-state-blue-700, #154973);--_nys-button-border-radius: 0;--_nys-button-justify-content: start;--_nys-button-outline-width: var(--nys-border-width-md, 2px);--_nys-button-outline-offset: calc(-1 * var(--nys-border-width-md, 2px))}@media(min-width:0)and (max-width:479px){:host{--_nys-unavheader-padding--gutter: var(--nys-gutter-xs, 20px)}#nys-unavheader__know{--_nys-button-padding--x: 0px;--_nys-button-padding--y: 0px;--_nys-button-height: var(--nys-space-200, 16px)}.nys-unavheader__trustbar>.content{flex-direction:column;align-items:flex-start;gap:0;line-height:16px}.nys-unavheader__trustbar.wrapper{padding-top:var(--nys-space-50, 4px);padding-bottom:var(--nys-space-50, 4px)}.nys-unavheader__trustbar.inline{display:none}.nys-unavheader__messagewrapper{flex-direction:column}#nys-unavheader__translate--desktop,#nys-unavheader__searchbar{display:none}}@media(min-width:480px)and (max-width:767px){:host{--_nys-unavheader-padding--gutter: var(--nys-gutter-sm, 20px)}.nys-unavheader__trustbar.inline{display:none}.nys-unavheader__messagewrapper{flex-direction:column}#nys-unavheader__translate--desktop,#nys-unavheader__searchbar{display:none}}@media(min-width:768px)and (max-width:1023px){:host{--_nys-unavheader-padding--gutter: var(--nys-gutter-md, 32px)}.nys-unavheader__trustbar.wrapper,#nys-unavheader__translate--desktop,#nys-unavheader__searchbar{display:none}.nys-unavheader__trustpanel.wrapper.show{order:2}}@media(min-width:1024px)and (max-width:1279px){:host{--_nys-unavheader-padding--gutter: var(--nys-gutter-lg, 32px)}.nys-unavheader__trustbar.wrapper,#nys-unavheader__translate--mobile,#nys-unavheader__searchbutton[circle],.nys-unavheader__searchdropdown.wrapper{display:none}.nys-unavheader__languagelist.show{margin-top:var(--nys-space-100, 8px)}.nys-unavheader__trustpanel.wrapper.show{order:2}}@media(min-width:1280px){:host{--_nys-unavheader-padding--gutter: var(--nys-gutter-xl, 64px)}.nys-unavheader__trustbar.wrapper,#nys-unavheader__translate--mobile,#nys-unavheader__searchbutton[circle],.nys-unavheader__searchdropdown.wrapper{display:none}.nys-unavheader__languagelist.show{margin-top:var(--nys-space-100, 8px)}.nys-unavheader__trustpanel.wrapper.show{order:2}}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}';
var V8 = Object.defineProperty;
var i19 = (t11, e5, a12, n13) => {
  for (var s13 = void 0, h23 = t11.length - 1, _17; h23 >= 0; h23--)
    (_17 = t11[h23]) && (s13 = _17(e5, a12, s13) || s13);
  return s13 && V8(e5, a12, s13), s13;
};
var $14 = "https://alerts-cta.static-assets.ny.gov/alerts.json";
var S11 = {
  high: "emergency",
  medium: "warning",
  low: "info",
  // Feed authors may also use the design system's own vocabulary
  emergency: "emergency",
  danger: "danger",
  warning: "warning",
  success: "success",
  info: "info",
  base: "base"
};
var E13 = {
  virus: "coronavirus",
  coronavirus: "coronavirus",
  snow: "ac_unit",
  snowflake: "ac_unit",
  winter: "ac_unit",
  ac_unit: "ac_unit",
  wind: "air",
  air: "air",
  sun: "clear_day",
  heat: "clear_day",
  clear_day: "clear_day",
  rain: "rainy",
  flood: "rainy",
  rainy: "rainy",
  alert: "warning",
  warning: "warning",
  emergency: "emergency_home",
  emergency_home: "emergency_home",
  error: "error",
  info: "info",
  notifications: "notifications",
  schedule: "schedule",
  location_on: "location_on"
};
var T3 = (t11) => t11?.trim().toLowerCase() === "on";
var u15 = "nys-unavheader__languagelist";
var H3 = "Translate";
var y14 = "nys-unavheader__languagelink";
var c18 = [
  "nys-unavheader__translate--desktop",
  "nys-unavheader__translate--mobile"
];
var v19 = (t11) => t11.shadowRoot?.querySelector("button") ?? t11;
var z6 = {
  zh: "zh-Hans",
  "zh-traditional": "zh-Hant"
};
var D4 = (t11) => z6[t11] ?? t11;
var C9 = "New York State";
var p16 = class p17 extends k15 {
  constructor() {
    super(...arguments), this.trustbarVisible = false, this.searchDropdownVisible = false, this.languageVisible = false, this.isSearchFocused = false, this.hideTranslate = false, this.hideSearch = false, this.searchUrl = "", this.landmarkLabel = C9, this.languages = [
      { code: "en", label: "English" },
      { code: "es", label: "Español" },
      { code: "zh", label: "中文" },
      { code: "zh-traditional", label: "繁體中文" },
      { code: "yi", label: "יידיש" },
      { code: "ru", label: "Русский" },
      { code: "bn", label: "বাংলা" },
      { code: "ko", label: "한국어" },
      { code: "ht", label: "Kreyòl Ayisyen" },
      { code: "it", label: "Italiano" },
      { code: "ar", label: "العربية" },
      { code: "pl", label: "Polski" },
      { code: "fr", label: "Français" },
      { code: "ur", label: "اردو" }
    ], this._translateTrigger = c18[0], this._activeOption = 0, this._openWithFocus = null, this._alerts = [], this._alertRequest = null;
  }
  /**
   * Lifecycle Methods
   * --------------------------------------------------------------------------
   * connectedCallback is inherited from NysElement, which assigns an
   * auto-generated host id (prefix "nys-unavheader") when none is provided. The
   * banner landmark intentionally lives on the inner <header> element, so this
   * component keeps defaultRole = null and does not move a role onto the host.
   */
  connectedCallback() {
    super.connectedCallback(), this._loadAlerts();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._alertRequest?.abort(), this._alertRequest = null;
  }
  updated(e5) {
    if (super.updated(e5), this.hideTranslate || (this._syncTranslateTriggerAria(), this._syncLanguageMenuAria(), !e5.has("languageVisible"))) return;
    if (!this.languageVisible) {
      this._openWithFocus = null, this._activeOption = 0;
      return;
    }
    const a12 = this._openWithFocus;
    this._openWithFocus = null, a12 && this._focusOption(a12 === "first" ? 0 : -1);
  }
  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  _getNysLogo() {
    return new DOMParser().parseFromString(L7, "image/svg+xml").documentElement;
  }
  _toggleTrustbar(e5) {
    if (this.trustbarVisible = !this.trustbarVisible, this.trustbarVisible && (this.languageVisible = false, this.searchDropdownVisible = false), e5 === "no focus") return;
    if (e5 === "nys-unavheader__know--inline" || !e5) {
      const n13 = this.trustbarVisible ? "nys-unavheader__closetrustbar" : "nys-unavheader__know--inline";
      this.updateComplete.then(() => {
        this.shadowRoot?.getElementById(n13)?.focus();
      });
    }
  }
  _toggleLanguageList(e5) {
    e5 && (this._translateTrigger = e5), this.languageVisible = !this.languageVisible, this.languageVisible && (this.trustbarVisible = false, this.searchDropdownVisible = false);
  }
  /**
   * Closes the menu and puts focus back on the trigger. The open list is the only
   * thing keeping the language buttons focusable, so closing it while focus sits on
   * one would drop focus to the top of the page (WCAG 2.4.3).
   */
  _closeLanguageList() {
    this.languageVisible && (this.languageVisible = false, this.updateComplete.then(() => {
      (this.shadowRoot?.getElementById(this._translateTrigger) ?? this.shadowRoot?.getElementById(c18[1]))?.focus();
    }));
  }
  /**
   * `nys-button` renders the real `<button>` inside its own shadow root, so an
   * `aria-expanded` written on the host never reaches the element that carries the
   * button role — assistive tech was never told the translate menu collapses. Mirror
   * the state onto the inner control, the same way `nys-dropdownmenu` does for its
   * trigger (WCAG 4.1.2).
   */
  async _syncTranslateTriggerAria() {
    for (const e5 of c18) {
      const a12 = this.shadowRoot?.getElementById(
        e5
      );
      a12 && (await a12.updateComplete, v19(a12).setAttribute("aria-haspopup", "menu"));
    }
  }
  /** The language options, in the order they are rendered. */
  _languageOptions() {
    return Array.from(
      this.shadowRoot?.querySelectorAll(
        `.${y14}`
      ) ?? []
    );
  }
  /**
   * Menu semantics for the options, and the same shadow-root problem as the trigger:
   * `role="menuitem"` and the tab stop have to land on the real `<button>`, not on
   * the `nys-button` host. The hosts carry `role="presentation"` in the template so
   * they don't sit between the menu and its items in the accessibility tree.
   */
  async _syncLanguageMenuAria() {
    const e5 = this._languageOptions();
    e5.length && (this._activeOption > e5.length - 1 && (this._activeOption = 0), await Promise.all(e5.map((a12) => a12.updateComplete)), e5.forEach((a12, n13) => {
      const s13 = v19(a12);
      s13.setAttribute("role", "menuitem"), s13.setAttribute(
        "tabindex",
        n13 === this._activeOption ? "0" : "-1"
      );
    }));
  }
  /**
   * Moves both focus and the tab stop to an option, wrapping at either end. Index
   * -1 is the last option, so "previous from the first" and "End" are the same call.
   */
  async _focusOption(e5) {
    const a12 = this._languageOptions();
    if (!a12.length) return;
    const n13 = a12.length;
    this._activeOption = (e5 % n13 + n13) % n13, await this._syncLanguageMenuAria(), a12[this._activeOption]?.focus();
  }
  _toggleSearchDropdown() {
    this.searchDropdownVisible = !this.searchDropdownVisible, this.searchDropdownVisible && (this.trustbarVisible = false, this.languageVisible = false);
  }
  _handleLanguageSelect(e5) {
    this._closeLanguageList();
    const a12 = new CustomEvent("nys-language-select", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: { language: e5 }
    });
    if (this.dispatchEvent(a12), !a12.defaultPrevented)
      if (e5.url)
        window.location.href = e5.url;
      else {
        const n13 = e5.code === "en" ? "" : `${e5.code}.`;
        window.location.href = `https://${n13}${window.location.hostname}`;
      }
  }
  /**
   * Keyboard model for the translate menu (APG menu button):
   * - on the trigger: Down/Up open the menu on its first/last option, Enter/Space
   *   open it on the first option, Escape closes it
   * - in the menu: Down/Up step and wrap, Home/End jump to either end, Enter/Space
   *   pick the option (native `<button>` activation), Escape closes the menu and
   *   returns focus to the trigger
   *
   * Type-ahead is deliberately left out. Each label is written in its own script, so
   * matching typed characters would mean transliteration plus an IME to be usable —
   * "e" finds nothing in "Español" for anyone who would need it. The pattern lists
   * type-ahead as optional.
   */
  _handleTranslateKeydown(e5) {
    const a12 = e5.target;
    if (a12) {
      if (e5.key === "Escape") {
        if (!this.languageVisible) return;
        e5.stopPropagation(), this._closeLanguageList();
        return;
      }
      c18.includes(a12.id) ? this._handleTriggerKeydown(e5, a12.id) : a12.classList.contains(y14) && this._handleOptionKeydown(e5);
    }
  }
  _handleTriggerKeydown(e5, a12) {
    switch (e5.key) {
      case "ArrowDown":
      case "ArrowUp": {
        e5.preventDefault();
        const n13 = e5.key === "ArrowDown" ? "first" : "last";
        this.languageVisible ? this._focusOption(n13 === "first" ? 0 : -1) : (this._openWithFocus = n13, this._toggleLanguageList(a12));
        break;
      }
      case "Enter":
      case " ":
      case "Spacebar":
        this._openWithFocus = this.languageVisible ? null : "first";
        break;
    }
  }
  _handleOptionKeydown(e5) {
    const a12 = this._languageOptions().indexOf(e5.target);
    if (!(a12 < 0))
      switch (e5.key) {
        case "ArrowDown":
          e5.preventDefault(), this._focusOption(a12 + 1);
          break;
        case "ArrowUp":
          e5.preventDefault(), this._focusOption(a12 - 1);
          break;
        case "Home":
          e5.preventDefault(), this._focusOption(0);
          break;
        case "End":
          e5.preventDefault(), this._focusOption(-1);
          break;
      }
  }
  /**
   * Focus leaving the menu closes it — that is what Tab and Shift+Tab do under the
   * menu button pattern, and it also covers clicking away. Closing without touching
   * focus is the point here: the browser is already moving it somewhere else.
   */
  _handleTranslateFocusout(e5) {
    if (!this.languageVisible) return;
    const a12 = e5.currentTarget, n13 = e5.relatedTarget;
    n13 && a12.contains(n13) || (this.languageVisible = false);
  }
  _handleSearchFocus() {
    this.isSearchFocused = true, this.trustbarVisible = false, this.languageVisible = false;
  }
  _handleSearchBlur() {
    this.isSearchFocused = false;
  }
  _handleSearchKeyup(e5) {
    if (e5.key === "Escape" && (this._handleSearchBlur(), e5.target.blur()), e5.key === "Enter") {
      const a12 = e5.target.value?.trim();
      a12 !== "" && this._handleSearch(a12);
    }
  }
  _handleSearchButton(e5) {
    const n13 = (this.shadowRoot?.getElementById(
      e5
    )).value?.trim();
    n13 !== "" && this._handleSearch(n13);
  }
  _handleSearch(e5) {
    const a12 = new CustomEvent("nys-search-submit", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: { query: e5 }
    });
    this.dispatchEvent(a12), a12.defaultPrevented || (this.searchUrl ? window.location.href = `${this.searchUrl}${encodeURIComponent(e5)}` : window.location.href = `https://search.its.ny.gov/search/search.html?q=${encodeURIComponent(e5)}+inurl:${window.location.hostname}&site=default_collection`);
  }
  async _loadAlerts() {
    if (typeof fetch != "function") return;
    this._alertRequest?.abort();
    const e5 = new AbortController();
    this._alertRequest = e5;
    const a12 = await this._readFeed(e5);
    if (!a12) return;
    const n13 = Array.isArray(a12.alert) ? a12.alert : a12.alert ? [a12.alert] : [];
    this._alerts = n13.filter((s13) => T3(s13?.status));
  }
  /** Fetches the alert feed. Resolves to null on any failure. */
  async _readFeed(e5) {
    try {
      const a12 = await fetch($14, {
        signal: e5.signal,
        credentials: "omit",
        // An alert that is switched off must go away everywhere on the next page
        // load, so never read (or write) the HTTP cache for this
        cache: "no-store"
      });
      if (!a12.ok)
        throw new Error(`Responded with ${a12.status}`);
      const n13 = await a12.json();
      return e5.signal.aborted ? null : n13;
    } catch {
      return null;
    }
  }
  /** Feed severity → `nys-alert` type. */
  _alertType(e5) {
    return S11[e5?.trim().toLowerCase() ?? ""] ?? "info";
  }
  /**
   * Feed icon name → `nys-icon` name. Unknown names resolve to "", which leaves
   * `nys-alert` to draw the default icon for the alert's type.
   */
  _alertIcon(e5) {
    const a12 = e5?.trim().toLowerCase().replace(/\s+/g, "_");
    return a12 && E13[a12] || "";
  }
  /**
   * One full-bleed band per published alert, so alerts of different severities keep
   * their own background instead of sharing one. The body is slotted rather than
   * passed as `text`/`primaryAction` so the link can carry the feed's `linkAriaLabel`.
   */
  _renderAlerts() {
    return this._alerts.map((e5) => this._renderAlert(e5));
  }
  _renderAlert(e5) {
    if (!e5.headline?.trim() && !e5.description?.trim()) return nothing;
    const a12 = this._alertType(e5.severity), n13 = this._alertIcon(e5.icon), s13 = e5.linkTitle?.trim() || "Learn more";
    return html`
      <div class="nys-unavheader__alert wrapper" data-type=${a12}>
        <nys-alert
          class="content"
          type=${a12}
          heading=${e5.headline ?? ""}
          icon=${n13}
        >
          ${e5.description ? html`<p class="nys-unavheader__alert-text">
                ${e5.description}
              </p>` : nothing}
          ${e5.link ? html`<a
                class="nys-unavheader__alert-link"
                href=${e5.link}
                aria-label=${e5.linkAriaLabel?.trim() || nothing}
                >${s13}</a
              >` : nothing}
        </nys-alert>
      </div>
    `;
  }
  /**
   * The banner's accessible name. A blank override would put the page back where
   * #1795 found it — two unnamed banners — so it falls back to the default.
   */
  get _landmarkLabel() {
    return this.landmarkLabel?.trim() || C9;
  }
  render() {
    return html`
      <header class="nys-unavheader" aria-label=${this._landmarkLabel}>
        <div
          class="nys-unavheader__trustbar wrapper"
          @click="${(e5) => {
      e5.target.closest("nys-button") || this._toggleTrustbar("no focus");
    }}"
        >
          <div class="content">
            <span class="nys-unavheader__official"
              >An official website of New York State</span
            >
            <nys-button
              id="nys-unavheader__know"
              label="Here's how you know"
              variant="text"
              size="sm"
              ariaControls="nys-unavheader__trustpanel"
              ariaExpanded="${this.trustbarVisible}"
              @nys-click="${(e5) => {
      e5.preventDefault(), e5.stopPropagation(), this._toggleTrustbar("nys-unavheader__know");
    }}"
            >
              <nys-icon
                slot="suffix-icon"
                size="12"
                name="${this.trustbarVisible ? "chevron_up" : "chevron_down"}"
              ></nys-icon>
            </nys-button>
          </div>
        </div>
        <div
          id="nys-unavheader__trustpanel"
          id="nys-unavheader__trustpanel"
          class="nys-unavheader__trustpanel wrapper ${this.trustbarVisible ? "show" : "hide"}"
        >
          <div class="nys-unavheader__trustpanel content">
            <nys-button
              id="nys-unavheader__closetrustbar"
              class="nys-unavheader__iconbutton"
              variant="ghost"
              circle
              icon="close"
              size="sm"
              label="Close this notice"
              ariaControls="nys-unavheader__trustpanel"
              ariaExpanded="${this.trustbarVisible}"
              @nys-click="${() => this._toggleTrustbar("nys-unavheader__know--inline")}"
            ></nys-button>
            <div class="nys-unavheader__messagewrapper">
              <div
                class="nys-unavheader__trustcontentmessage"
                id="trust_official"
              >
                <nys-icon size="3xl" name="account_balance_filled"></nys-icon>
                <span><b>Official websites use ny.gov</b></span>
                <span
                  >A <b>ny.gov</b> website belongs to an official New York State
                  government organization.</span
                >
              </div>
              <div
                class="nys-unavheader__trustcontentmessage"
                id="trust_secure"
              >
                <nys-icon size="3xl" name="lock_filled"></nys-icon>
                <span><b>Secure ny.gov websites use HTTPS</b></span>
                <span
                  >A <b>lock icon</b> or <b>https://</b> means you've safely
                  connected to the ny.gov website. Share sensitive information
                  only on official, secure websites.</span
                >
              </div>
            </div>
          </div>
        </div>
        <div class="nys-unavheader__main wrapper" id="nys-universal-navigation">
          <div class="nys-unavheader__main content">
            <a
              href="https://www.ny.gov"
              id="nys-unavheader__logolink"
              aria-label="Visit the NY.gov homepage"
            >
              <div class="nys-unavheader__logo">${this._getNysLogo()}</div></a
            >
            <div class="nys-unavheader__trustbar inline">
              <span id="nys-unavheader__official"
                >An official website of New York State</span
              >
              <nys-button
                id="nys-unavheader__know--inline"
                label="Here's how you know"
                ariaControls="nys-unavheader__trustpanel"
                ariaExpanded="${this.trustbarVisible}"
                variant="text"
                size="sm"
                @nys-click="${() => this._toggleTrustbar("nys-unavheader__know--inline")}"
              >
                <nys-icon
                  slot="suffix-icon"
                  size="12"
                  name="${this.trustbarVisible ? "chevron_up" : "chevron_down"}"
                ></nys-icon>
              </nys-button>
            </div>
            <div class="nys-unavheader__spacer"></div>
            ${this.hideTranslate ? null : html`<div
                  class="nys-unavheader__translatewrapper"
                  @keydown=${this._handleTranslateKeydown}
                  @focusout=${this._handleTranslateFocusout}
                >
                  <nys-button
                    variant="ghost"
                    circle
                    label="Translate"
                    ariaControls="${u15}"
                    ariaExpanded="${this.languageVisible}"
                    id="nys-unavheader__translate--mobile"
                    class="nys-unavheader__iconbutton"
                    @nys-click=${() => this._toggleLanguageList(c18[1])}
                  >
                    <nys-icon
                      slot="circle-icon"
                      name="language"
                      size="16"
                    ></nys-icon>
                  </nys-button>
                  ${this.isSearchFocused ? null : html`
                        <nys-button
                          variant="ghost"
                          label="Translate"
                          ariaControls="${u15}"
                          ariaExpanded="${this.languageVisible}"
                          size="sm"
                          prefixIcon="language"
                          suffixIcon=${this.languageVisible ? "chevron_up" : "chevron_down"}
                          id="nys-unavheader__translate--desktop"
                          @nys-click="${() => this._toggleLanguageList(c18[0])}"
                        ></nys-button>
                      `}
                  <div
                    id="${u15}"
                    role="menu"
                    aria-label="${H3}"
                    class="nys-unavheader__languagelist ${this.languageVisible ? "show" : "hide"}"
                  >
                    ${this.languages.map(
      (e5) => (
        // role="presentation" drops the nys-button host out of the
        // accessibility tree, so the menu owns the menuitem inside
        // it directly instead of a generic wrapper. The menuitem
        // role and the roving tabindex are written onto that inner
        // button by _syncLanguageMenuAria.
        html`<nys-button
                          role="presentation"
                          variant="ghost"
                          fullWidth
                          lang="${D4(e5.code)}"
                          label="${e5.label}"
                          class="${y14}"
                          @click="${() => this._handleLanguageSelect(e5)}"
                        ></nys-button>`
      )
    )}
                  </div>
                </div>`}
            ${this.hideSearch ? null : html`
                  <nys-button
                    variant="ghost"
                    circle
                    label="Search"
                    ariaControls="nys-unavheader__searchdropdown"
                    ariaExpanded="${this.searchDropdownVisible}"
                    id="nys-unavheader__searchbutton"
                    class="nys-unavheader__iconbutton"
                    @nys-click=${this._toggleSearchDropdown}
                  >
                    <nys-icon
                      slot="circle-icon"
                      name="search"
                      size="16"
                    ></nys-icon>
                  </nys-button>
                  <nys-textinput
                    class="nys-unavheader__search"
                    id="nys-unavheader__searchbar"
                    placeholder="Search"
                    type="search"
                    @focus="${this._handleSearchFocus}"
                    @blur="${this._handleSearchBlur}"
                    @keyup="${this._handleSearchKeyup}"
                  >
                    <nys-button
                      id="nys-unavheader__searchbar--button"
                      slot="endButton"
                      type="submit"
                      prefixIcon="search"
                      @nys-click=${() => {
      this._handleSearchButton("nys-unavheader__searchbar");
    }}
                      ><span class="sr-only">Search</span></nys-button
                    >
                  </nys-textinput>
                `}
          </div>
        </div>
        <div
          id="nys-unavheader__searchdropdown"
          class="nys-unavheader__searchdropdown wrapper ${this.searchDropdownVisible ? "show" : "hide"}"
        >
          <div class="content">
            <nys-textinput
              class="nys-unavheader__search"
              id="nys-unavheader__searchbardropdown"
              placeholder="Search"
              type="search"
              @focus="${this._handleSearchFocus}"
              @blur="${this._handleSearchBlur}"
              @keyup="${this._handleSearchKeyup}"
            >
              <nys-button
                id="nys-unavheader__searchbardropdown--button"
                slot="endButton"
                type="submit"
                prefixIcon="search"
                @nys-click=${() => {
      this._handleSearchButton("nys-unavheader__searchbardropdown");
    }}
                ><span class="sr-only">Search</span></nys-button
              ></nys-textinput
            >
          </div>
        </div>
        ${this._renderAlerts()}
      </header>
    `;
  }
};
p16.styles = unsafeCSS(A5);
var r11 = p16;
i19([
  property({ type: Boolean })
], r11.prototype, "trustbarVisible");
i19([
  property({ type: Boolean })
], r11.prototype, "searchDropdownVisible");
i19([
  property({ type: Boolean })
], r11.prototype, "languageVisible");
i19([
  property({ type: Boolean })
], r11.prototype, "isSearchFocused");
i19([
  property({ type: Boolean })
], r11.prototype, "hideTranslate");
i19([
  property({ type: Boolean })
], r11.prototype, "hideSearch");
i19([
  property({ type: String })
], r11.prototype, "searchUrl");
i19([
  property({ type: String })
], r11.prototype, "landmarkLabel");
i19([
  property({ type: Array })
], r11.prototype, "languages");
i19([
  state()
], r11.prototype, "_alerts");
customElements.get("nys-unavheader") || customElements.define("nys-unavheader", r11);

// ../../nys-verticalnav/dist/chunks/nys-verticalnavgroup-DurcOWjB.js
var u16 = 0;
function h19(e5) {
  return `${e5}-${Date.now()}-${u16++}`;
}
function _15(e5) {
  return e5.filter((r13) => !!r13);
}
var b21 = {
  labelledby: "ariaLabelledByElements",
  describedby: "ariaDescribedByElements"
};
var m29 = {
  labelledby: "aria-label",
  describedby: "aria-description"
};
function B4(e5, r13, i21) {
  const l17 = _15(i21), n13 = b21[r13], a12 = m29[r13], v20 = e5;
  n13 in e5 && (v20[n13] = l17.length ? l17 : null);
  const d21 = l17.map((y17) => y17.textContent?.trim() ?? "").filter(Boolean).join(" ");
  d21 ? e5.setAttribute(a12, d21) : e5.removeAttribute(a12);
}
var x23 = (e5) => {
  class r13 extends e5 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = h19(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return r13;
};
var w24 = x23(LitElement);
var k16 = ':host{--_nys-verticalnav-color: var(--nys-color-text-weak, #4a4d4f);--_nys-verticalnav-background-color: var(--nys-color-surface, #ffffff);--_nys-verticalnav-border-color: var(--nys-color-neutral-50, #bec0c1);--_nys-verticalnav-font-size: var(--nys-font-size-ui-md, 16px);--_nys-verticalnav-font-size--header: var(--nys-font-size-ui-lg, 18px);--_nys-verticalnav-font-weight--header: var(--nys-font-weight-semibold, 600);--_nys-verticalnav-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-verticalnav-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-verticalnav-trigger--hover: var(--nys-color-neutral-10, #f6f6f6);--_nys-verticalnav-trigger--active: var(--nys-color-neutral-50, #ededed);--_nys-verticalnav-trigger--disabled: var(--nys-color-text-disabled, #bec0c1);--_nys-verticalnav-trigger--focus: var(--nys-color-focus, #004dd1);--_nys-verticalnav-trigger--current: var(--nys-color-theme-faint, #f7fafd);--_nys-verticalnav-trigger--current--hover: var( --nys-color-theme-weaker, #eff6fb );--_nys-verticalnav-trigger--current--active: var( --nys-color-theme-weak, #cddde9 )}nys-accordion{--nys-accordionitem-padding: var(--nys-space-100, 8px) var(--nys-space-150, 12px);--nys-accordion-content-max-width: 100%}.nys-verticalnav{display:flex;flex-direction:column;background-color:var(--_nys-verticalnav-background-color);font-family:var(--_nys-verticalnav-font-family);font-size:var(--_nys-verticalnav-font-size);font-weight:var(--_nys-verticalnav-font-weight);line-height:var(--_nys-verticalnav-line-height);padding:0;width:auto;height:100%;box-sizing:border-box}@media(min-width:1024px){.nys-verticalnav{max-width:249px;min-width:204px;width:100%;border-right:1px solid var(--_nys-verticalnav-border-color);gap:10px}}.nys-verticalnav .nys-verticalnav__heading{color:var(--_nys-verticalnav-color);border-top:none;font-size:var(--_nys-verticalnav-font-size--header);font-weight:var(--_nys-verticalnav-font-weight--header);text-transform:none;margin:0;margin-left:var(--nys-space-150, 12px)}.nys-verticalnavgroup__trigger{display:flex;align-items:center;justify-content:space-between;width:100%;padding:var(--nys-space-100, 8px) var(--nys-space-200, 16px) var(--nys-space-100, 8px) var(--nys-space-150, 12px);background-color:transparent;border:none;cursor:pointer;color:var(--_nys-verticalnav-color);font-family:var(--_nys-verticalnav-font-family);font-size:var(--_nys-verticalnav-font-size);font-weight:var(--_nys-verticalnav-font-weight--header);line-height:var(--_nys-verticalnav-line-height)}.nys-verticalnavgroup__trigger:not(:disabled):hover{background-color:var(--_nys-verticalnav-trigger--hover)}.nys-verticalnavgroup__trigger:not(:disabled):active{background-color:var(--_nys-verticalnav-trigger--active)}.nys-verticalnavgroup__trigger:focus-visible{outline:var(--nys-border-width-md, 2px) solid var(--_nys-verticalnav-trigger--focus);outline-offset:-2px}.nys-verticalnavgroup__trigger:disabled{color:var(--_nys-verticalnav-trigger--disabled)}.nys-verticalnavgroup__chevron{transition:transform .3s cubic-bezier(.4,0,.2,1) 0ms}@media(prefers-reduced-motion:reduce){.nys-verticalnavgroup__chevron{transition:none}}.nys-verticalnavgroup__items{display:none;--_nys-verticalnav-link-indent: var(--nys-space-300, 24px)}:host([disabled]) .nys-verticalnavgroup__trigger:disabled{color:var(--_nys-verticalnav-trigger--disabled);cursor:not-allowed}:host([expanded]) .nys-verticalnavgroup__chevron{transform:rotate(180deg)}:host([expanded]) .nys-verticalnavgroup__items{display:block}:host([active]:not([expanded])) .nys-verticalnavgroup__trigger{background-color:var(--_nys-verticalnav-trigger--current)}:host([active]:not([expanded])) .nys-verticalnavgroup__trigger:hover{background-color:var(--_nys-verticalnav-trigger--current--hover)}:host([active]:not([expanded])) .nys-verticalnavgroup__trigger:active{background-color:var(--_nys-verticalnav-trigger--current--active)}';
var z7 = Object.defineProperty;
var o16 = (e5, r13, i21, l17) => {
  for (var n13 = void 0, a12 = e5.length - 1, v20; a12 >= 0; a12--)
    (v20 = e5[a12]) && (n13 = v20(r13, i21, n13) || n13);
  return n13 && z7(r13, i21, n13), n13;
};
var c19 = class c20 extends w24 {
  constructor() {
    super(...arguments), this.id = "", this.label = "", this.expanded = false, this.disabled = false, this.active = false;
  }
  // Ids come from NysElement (prefix = localName, shape
  // "nys-verticalnavgroup-<ts>-<n>"). The previous local counter generated ids
  // prefixed "nys-verticalnav-" from a counter that started at 0 independently of
  // the nav's, so a group and a nav created in the same millisecond could collide
  // and the group's aria-controls could resolve to the wrong element.
  _toggle() {
    this.disabled || (this.expanded = !this.expanded, this.dispatchEvent(
      new CustomEvent("nys-child-resize", {
        bubbles: true,
        composed: true
      })
    ), this.dispatchEvent(
      new CustomEvent("nys-verticalnavgroup-toggle", {
        detail: { id: this.id, label: this.label, expanded: this.expanded },
        bubbles: true,
        composed: true
      })
    ));
  }
  render() {
    const r13 = `${this.id}-content`;
    return html`
      <button
        class="nys-verticalnavgroup__trigger"
        @click=${this._toggle}
        aria-controls=${r13}
        aria-expanded=${this.expanded}
        ?disabled=${this.disabled}
      >
        <span class="nys-verticalnavgroup__label">${this.label}</span>
        <nys-icon
          name="chevron_down"
          class="nys-verticalnavgroup__chevron"
          size="16"
        ></nys-icon>
      </button>
      <div class="nys-verticalnavgroup__items" id=${r13}>
        <slot></slot>
      </div>
    `;
  }
};
c19.styles = unsafeCSS(k16);
var t9 = c19;
o16([
  property({ type: String, reflect: true })
], t9.prototype, "id");
o16([
  property({ type: String })
], t9.prototype, "label");
o16([
  property({ type: Boolean, reflect: true })
], t9.prototype, "expanded");
o16([
  property({ type: Boolean, reflect: true })
], t9.prototype, "disabled");
o16([
  property({ type: Boolean, reflect: true })
], t9.prototype, "active");
customElements.get("nys-verticalnavgroup") || customElements.define("nys-verticalnavgroup", t9);

// ../../nys-verticalnav/dist/nys-verticalnav.js
var b22 = 'nys-verticalnav{--_nys-verticalnav-font-size: var(--nys-font-size-ui-md, 16px);--_nys-verticalnav-font-size--header: var(--nys-font-size-ui-lg, 18px);--_nys-verticalnav-font-size--subheader: var(--nys-font-size-ui-sm, 14px);--_nys-verticalnav-font-weight: var(--nys-font-weight-semibold, 600);--_nys-verticalnav-font-weight--group-links: var( --nys-font-weight-regular, 400 );--_nys-verticalnav-font-weight--subheader: var(--nys-font-weight-bold, 700);--_nys-verticalnav-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-verticalnav-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) )}nys-verticalnav ul{list-style-type:none;padding:0;margin:0;display:flex;flex-direction:column;gap:var(--nys-space-100, 8px)}@media(min-width:1024px){nys-verticalnav ul{gap:0}}nys-verticalnav ul ul{display:flex;flex-direction:column}nys-verticalnav ul li{display:flex;flex-direction:column;margin:0}nys-verticalnav ul a{color:var(--nys-color-text-weak, #4a4d4f);display:flex;padding:var(--nys-space-100, 8px) var(--nys-space-100, 8px) var(--nys-space-100, 8px) var(--nys-space-150, 12px);text-decoration:none;font-family:var(--_nys-verticalnav-font-family);font-size:var(--_nys-verticalnav-font-size);font-weight:var(--_nys-verticalnav-font-weight);line-height:var(--_nys-verticalnav-line-height)}nys-verticalnav ul a:not([aria-disabled=true]):hover{color:var(--nys-color-text, #1b1b1b);background-color:var(--nys-color-neutral-10, #f6f6f6);text-decoration:none}nys-verticalnav ul a:not([aria-disabled=true]):active{background-color:var(--nys-color-neutral-50, #ededed)}nys-verticalnav ul a:focus-visible{outline:var(--nys-border-width-md, 2px) solid var(--nys-color-focus, #004dd1);outline-offset:-2px}nys-verticalnav ul a:focus{color:var(--nys-color-text, #1b1b1b);text-decoration:none}nys-verticalnav ul a[aria-disabled=true]{color:var(--nys-color-text-disabled, #bec0c1);cursor:not-allowed;text-decoration:none}nys-verticalnav ul a[aria-current=page]{color:var(--nys-color-text, #1b1b1b);background-color:var(--nys-color-theme-faint, #f7fafd);border-left:var(--nys-border-width-md, 2px) solid var(--nys-color-theme, #154973)}nys-verticalnav ul a[aria-current=page]:not(:disabled):hover{background-color:var(--nys-color-theme-weaker, #eff6fb)}nys-verticalnav ul a[aria-current=page]:not(:disabled):active{background-color:var(--nys-color-theme-weak, #cddde9)}nys-verticalnav ul li :is(h1,h2,h3,h4,h5,h6){font-family:var(--_nys-verticalnav-font-family);font-size:var(--_nys-verticalnav-font-size--subheader);font-weight:var(--_nys-verticalnav-font-weight--subheader);line-height:var(--_nys-verticalnav-line-height);padding:var(--nys-space-250, 20px) var(--nys-space-100, 8px) var(--nys-space-100, 8px) var(--nys-space-150, 12px);margin:0;text-transform:uppercase;color:var(--nys-color-text, #1b1b1b)}nys-verticalnavgroup ul{gap:0}nys-verticalnavgroup ul li{margin-bottom:0}nys-verticalnavgroup ul li a{color:var(--nys-color-text, #1b1b1b);padding:var(--nys-space-100, 8px) var(--nys-space-100, 8px) var(--nys-space-100, 8px) var(--nys-space-300, 24px);font-family:var(--_nys-verticalnav-font-family);font-size:var(--_nys-verticalnav-font-size);font-weight:var(--_nys-verticalnav-font-weight--group-links);line-height:var(--_nys-verticalnav-line-height)}@media(max-width:1023px){nys-verticalnav ul>li:not(:last-child){border-bottom:var(--nys-size-1px, 1px) solid var(--nys-color-neutral-100, #e4e5e6)}nys-verticalnav ul>li:not(:last-child) a{margin-bottom:var(--nys-space-100, 8px)}nys-verticalnav nys-verticalnavgroup ul>li:not(:last-child){border-bottom:none}}';
var m30 = Object.defineProperty;
var r12 = (c21, e5, n13, o18) => {
  for (var i21 = void 0, d21 = c21.length - 1, v20; d21 >= 0; d21--)
    (v20 = c21[d21]) && (i21 = v20(e5, n13, i21) || i21);
  return i21 && m30(e5, n13, i21), i21;
};
var l16 = null;
function _16() {
  l16 || typeof document > "u" || (l16 = new CSSStyleSheet(), l16.replaceSync(b22), document.adoptedStyleSheets = [...document.adoptedStyleSheets, l16]);
}
var h20 = class h21 extends w24 {
  constructor() {
    super(...arguments), this.id = "", this.heading = "Page navigation", this.hideHeading = false, this.headingLevel = "h2", this.expanded = false, this._isMobile = false, this._mediaQuery = null, this._handleAccordionToggle = (e5) => {
      this.expanded = e5.detail.expanded, this.dispatchEvent(
        new CustomEvent("nys-verticalnav-toggle", {
          detail: { id: this.id, expanded: this.expanded },
          bubbles: true,
          composed: true
        })
      );
    }, this._handleResize = (e5) => {
      this._isMobile = e5.matches;
    }, this._handleSlotChange = () => {
      this._applyActiveState();
    }, this._handleHeaderSlotChange = () => {
      this._syncNavLabel();
    };
  }
  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */
  connectedCallback() {
    super.connectedCallback(), _16(), this._mediaQuery = window.matchMedia("(max-width: 1023px)") ?? null, this._isMobile = this._mediaQuery.matches ?? false, this._mediaQuery.addEventListener("change", this._handleResize);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._mediaQuery?.removeEventListener("change", this._handleResize);
  }
  updated() {
    this._syncNavLabel();
  }
  /**
   * Public API for controlling the mobile accordion from outside the component
   * --------------------------------------------------------------------------
   */
  open() {
    this.expanded = true;
  }
  close() {
    this.expanded = false;
  }
  toggle() {
    this.expanded = !this.expanded;
  }
  /**
   * The element a consumer supplied to the `header` slot, or null when the slot is
   * empty (in which case the generated heading renders as the slot's fallback).
   */
  _slottedHeader() {
    return (this.shadowRoot?.querySelector(
      'slot[name="header"]'
    )?.assignedElements({ flatten: false }) ?? [])[0] ?? null;
  }
  /**
   * Give the <nav> landmark an accessible name.
   *
   * The generated heading is the header slot's FALLBACK content, so it does not
   * exist once a consumer fills that slot — an `aria-labelledby` IDREF pointing at
   * it would dangle and leave the landmark unnamed (WCAG 4.1.2 / 2.4.1). When the
   * slot is filled, the name comes from the consumer's heading, which lives in the
   * light DOM and cannot be reached by an IDREF from inside the shadow root:
   * `associateControlRefs` sets the nav's own `ariaLabelledByElements` (element
   * references may point into an enclosing scope) plus a string fallback for engines
   * that do not yet honor them. The `heading` property is the intended name, so it
   * overrides the fallback string derived from the slotted content's full text.
   *
   * When the slot is empty the same-root IDREF to the generated heading is used, and
   * a hidden heading falls back to `aria-label`. All of this is applied imperatively
   * (never as template bindings) so Lit cannot fight the attributes written here.
   */
  _syncNavLabel() {
    const e5 = this.shadowRoot?.querySelector("nav");
    if (!e5) return;
    const n13 = this._slottedHeader();
    if (n13) {
      e5.removeAttribute("aria-labelledby"), B4(e5, "labelledby", [n13]), this.heading && e5.setAttribute("aria-label", this.heading);
      return;
    }
    B4(e5, "labelledby", []);
    const o18 = this.shadowRoot?.querySelector(
      ".nys-verticalnav__heading"
    );
    o18 && !this.hideHeading ? (e5.setAttribute("aria-labelledby", o18.id), e5.removeAttribute("aria-label")) : (e5.removeAttribute("aria-labelledby"), e5.setAttribute("aria-label", this.heading));
  }
  _applyActiveState() {
    this.querySelectorAll('a[aria-disabled="true"]:not([href])').forEach(
      (e5) => {
        e5.hasAttribute("role") || e5.setAttribute("role", "link"), e5.hasAttribute("tabindex") || e5.setAttribute("tabindex", "0");
      }
    ), this.querySelectorAll("nys-verticalnavgroup").forEach((e5) => {
      e5.querySelector('a[aria-current="page"]') && (e5.setAttribute("expanded", ""), e5.setAttribute("active", ""));
    });
  }
  /**
   * Helper Render Functions
   * --------------------------------------------------------------------------
   */
  _renderHeading() {
    if (this.hideHeading) return html``;
    const e5 = `${this.id}-heading`, n13 = {
      h1: html`<h1 id=${e5} class="nys-verticalnav__heading">
        ${this.heading}
      </h1>`,
      h2: html`<h2 id=${e5} class="nys-verticalnav__heading">
        ${this.heading}
      </h2>`,
      h3: html`<h3 id=${e5} class="nys-verticalnav__heading">
        ${this.heading}
      </h3>`,
      h4: html`<h4 id=${e5} class="nys-verticalnav__heading">
        ${this.heading}
      </h4>`,
      h5: html`<h5 id=${e5} class="nys-verticalnav__heading">
        ${this.heading}
      </h5>`,
      h6: html`<h6 id=${e5} class="nys-verticalnav__heading">
        ${this.heading}
      </h6>`
    };
    return html`<slot name="header" @slotchange=${this._handleHeaderSlotChange}>
      ${n13[this.headingLevel]}
    </slot>`;
  }
  // The <nav> landmark's accessible name is applied imperatively in
  // _syncNavLabel(); see the note there on why it is not bound in the template.
  renderContentDesktop() {
    return html` <nav class="nys-verticalnav nys-verticalnav--desktop">
      ${this._renderHeading()}
      <slot @slotchange=${this._handleSlotChange}></slot>
      <slot name="footer"></slot>
    </nav>`;
  }
  /**
   * The heading level for the mobile disclosure trigger.
   *
   * Below 1024px the navigation heading IS the accordion trigger, so it has to
   * land at the same outline position the desktop heading occupies — otherwise
   * the nav's place in the outline changes with the viewport. `nys-accordion`
   * runs h2-h6 (a disclosure trigger is never a page title), so the one level
   * this nav offers that it does not, `h1`, maps to the next valid level.
   */
  _accordionHeadingLevel() {
    return this.headingLevel === "h1" ? "h2" : this.headingLevel;
  }
  renderContentMobile() {
    return html` <nav class="nys-verticalnav nys-verticalnav--mobile">
      <nys-accordion bordered>
        <nys-accordionitem
          id="${this.id}-accordion"
          heading="${this.heading}"
          headingLevel="${this._accordionHeadingLevel()}"
          ?expanded=${this.expanded}
          @nys-accordionitem-toggle=${this._handleAccordionToggle}
        >
          <!-- The header slot is rendered here too: omitting it below 1024px made a
          consumer's custom header vanish entirely (WCAG 1.3.1). No fallback heading
          is needed — the accordion's own header already shows the heading text. -->
          <slot
            name="header"
            @slotchange=${this._handleHeaderSlotChange}
          ></slot>
          <slot @slotchange=${this._handleSlotChange}></slot>
          <slot name="footer"></slot>
        </nys-accordionitem>
      </nys-accordion>
    </nav>`;
  }
  render() {
    return this._isMobile ? this.renderContentMobile() : this.renderContentDesktop();
  }
};
h20.styles = unsafeCSS(k16);
var t10 = h20;
r12([
  property({ type: String, reflect: true })
], t10.prototype, "id");
r12([
  property({ type: String, reflect: true })
], t10.prototype, "heading");
r12([
  property({ type: Boolean, reflect: true })
], t10.prototype, "hideHeading");
r12([
  property({ type: String, reflect: true })
], t10.prototype, "headingLevel");
r12([
  property({ type: Boolean, reflect: true })
], t10.prototype, "expanded");
r12([
  state()
], t10.prototype, "_isMobile");
customElements.get("nys-verticalnav") || customElements.define("nys-verticalnav", t10);

// ../../nys-video/dist/nys-video.js
var h22 = 0;
function p18(a12) {
  return `${a12}-${Date.now()}-${h22++}`;
}
var b23 = (a12) => {
  class e5 extends a12 {
    get idPrefix() {
      return this.localName || "nys-element";
    }
    ensureId() {
      this.id || (this.id = p18(this.idPrefix));
    }
    connectedCallback() {
      super.connectedCallback(), this.ensureId();
    }
  }
  return e5;
};
var m31 = b23(LitElement);
var f20 = '@charset "UTF-8";:host{--_nys-video-width: fit-content;--_nys-video-height: var(--nys-size-600, 48px);--_nys-video-radius: var(--nys-radius-lg, 8px);--_nys-video-padding: var(--nys-space-100, 8px);--_nys-video-gap: var(--nys-space-100, 8px);--_nys-video-font-size: var(--nys-font-size-ui-md, 16px);--_nys-video-font-weight: var(--nys-font-weight-semibold, 600);--_nys-video-line-height: var(--nys-font-lineheight-ui-md, 24px);--_nys-video-font-family: var( --nys-font-family-ui, var( --nys-font-family-sans, "Proxima Nova", "Helvetica Neue", "Helvetica", "Arial", sans-serif ) );--_nys-video-background-color--play-button: var( --nys-color-black-transparent-600, rgba(27, 27, 27, .6) );--_nys-video-outline-color--play-button: var(--nys-color-focus, #004dd1);--_nys-video-outline-width--play-button: 3.5px;--_nys-video-svg-color--play-button: var( --nys-color-white-transparent-400, rgba(255, 255, 255, .4) );--_nys-video-color--title-text: var(--nys-color-text-reverse, #ffffff);--_nys-video-background-color--title-text: var( --nys-color-ink, var(--nys-color-neutral-900, #1b1b1b) );--_nys-video-padding--title-text: var(--nys-space-250, 20px);display:block;width:100%;max-width:675px}:host([size=full]){max-width:none}:host([size=sm]){min-width:320px;max-width:439px}:host([size=full]) .nys-video .nys-video__title-text{position:absolute;bottom:0;--_nys-video-background-color--title-text: var( --nys-color-black-transparent-900, rgba(27, 27, 27, .9) )}@media(min-width:480px){.nys-video:not(.nys-video--sm):not(.nys-video--md) .nys-video__title-text{position:absolute;bottom:0;--_nys-video-background-color--title-text: var( --nys-color-black-transparent-900, rgba(27, 27, 27, .9) )}}.nys-video{border-radius:var(--_nys-video-radius);display:flex;flex-direction:column;position:relative;overflow:hidden}.nys-video .nys-video__ratio-box{aspect-ratio:16/9;position:relative}.nys-video .nys-video__ratio-box iframe,.nys-video .nys-video__ratio-box .nys-video__thumbnail{position:absolute;top:0;left:0;width:100%;height:100%;display:block;border:none}.nys-video .nys-video__ratio-box .nys-video__thumbnail{padding:0;background-color:transparent}.nys-video .nys-video__ratio-box .nys-video__thumbnail img{width:100%;height:100%;object-fit:cover}.nys-video .nys-video__ratio-box .nys-video__thumbnail .nys-video__play-icon{position:absolute;inset:0;width:100%;height:100%;padding:0;border:none;background-color:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center}.nys-video .nys-video__ratio-box .nys-video__thumbnail .nys-video__play-icon .nys-video__play-badge{width:96px;height:96px;background-color:var(--_nys-video-background-color--play-button);border-radius:50%;display:flex;align-items:center;justify-content:center}.nys-video .nys-video__ratio-box .nys-video__thumbnail .nys-video__play-icon svg{display:flex;margin-left:10px}.nys-video .nys-video__ratio-box .nys-video__thumbnail .nys-video__play-icon:focus-visible{outline:var(--_nys-video-outline-width--play-button) solid var(--_nys-video-outline-color--play-button);outline-offset:calc(-1 * var(--_nys-video-outline-width--play-button))}.nys-video .nys-video__ratio-box .nys-video__thumbnail .nys-video__play-icon:hover{--_nys-video-background-color--play-button: var( --nys-color-black-transparent-700, rgba(27, 27, 27, .7) )}.nys-video .nys-video__ratio-box .nys-video__thumbnail .nys-video__play-icon:active{--_nys-video-background-color--play-button: var( --nys-color-black-transparent-800, rgba(27, 27, 27, .8) )}.nys-video .nys-video__ratio-box .nys-video__thumbnail .nys-video__play-icon:disabled{cursor:not-allowed}.nys-video--disabled .nys-video__ratio-box{cursor:not-allowed}.nys-video--disabled .nys-video__ratio-box .nys-video__thumbnail .nys-video__play-icon,.nys-video--disabled .nys-video__ratio-box .nys-video__thumbnail .nys-video__play-icon:hover,.nys-video--disabled .nys-video__ratio-box .nys-video__thumbnail .nys-video__play-icon:active{--_nys-video-background-color--play-button: var( --nys-color-black-transparent-200, rgba(27, 27, 27, .2) )}.nys-video--disabled .nys-video__ratio-box .nys-video__thumbnail .nys-video__play-icon svg{fill:var(--_nys-video-svg-color--play-button)}.nys-video .nys-video__title-text{width:100%;padding:var(--_nys-video-padding--title-text);background-color:var(--_nys-video-background-color--title-text);box-sizing:border-box;color:var(--_nys-video-color--title-text);display:flex;justify-content:start;font-family:var(--_nys-video-font-family);font-size:var(--_nys-video-font-size);font-weight:var(--_nys-video-font-weight);line-height:var(--_nys-video-line-height)}.nys-video .nys-video__title-text p{margin:0}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;border:0}';
var g12 = Object.defineProperty;
var o17 = (a12, e5, t11, d21) => {
  for (var r13 = void 0, l17 = a12.length - 1, v20; l17 >= 0; l17--)
    (v20 = a12[l17]) && (r13 = v20(e5, t11, r13) || r13);
  return r13 && g12(e5, t11, r13), r13;
};
var y15 = class y16 extends m31 {
  constructor() {
    super(...arguments), this.id = "", this.titleText = "", this.videourl = "", this.size = "", this.loading = "lazy", this.starttime = 0, this.thumbnail = null, this.autoplay = false, this.disabled = false, this._playerActive = false, this._announcement = "", this._adPlaying = false;
  }
  /**
   * Lifecycle methods
   * --------------------------------------------------------------------------
   */
  // super.connectedCallback() (NysElement) assigns an auto-generated
  // id (prefix = localName) when one is not provided. The assertive live region
  // stays on the inner .nys-video__announcer element so only playback/ad state is
  // announced; the host carries no role (defaultRole stays null) — the <iframe>
  // and the play <button> carry their own semantics.
  connectedCallback() {
    super.connectedCallback(), this.autoplay && this._announceVideoVO();
  }
  /**
   * Functions
   * --------------------------------------------------------------------------
   */
  _isValidYouTubeUrl() {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(
      this.videourl
    );
  }
  _getVideoId() {
    const e5 = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^?&]+)/, t11 = this.videourl.match(e5);
    return t11 ? t11[1] : null;
  }
  _getThumbnailUrl() {
    return this.thumbnail ? this.thumbnail : `https://img.youtube.com/vi/${this._getVideoId()}/maxresdefault.jpg`;
  }
  _getEmbedUrl() {
    const e5 = this._getVideoId();
    if (!e5) return null;
    const t11 = new URLSearchParams(__spreadValues(__spreadValues({
      autoplay: "1",
      enablejsapi: "1"
    }, this.autoplay && { mute: "1" }), this.starttime > 0 && { start: String(this.starttime) }));
    return `https://www.youtube.com/embed/${e5}?${t11}`;
  }
  /**
   * Because I need to know if Youtube ADs are playing, I need to call YT's API.
   * Hence, the YT API setup below. The VO has 2 types of announcements:
   * - "Advertisement is playing"
   * - "Video is playing"
   *
   * YT IFrame Player API: https://developers.google.com/youtube/iframe_api_reference
   */
  _announceVideoVO() {
    const e5 = () => {
      this.updateComplete.then(() => {
        const t11 = this.shadowRoot?.querySelector("iframe");
        t11 && new window.YT.Player(t11, {
          events: {
            onStateChange: (d21) => {
              this._adPlaying || d21.data === window.YT.PlayerState.PLAYING && (this._announcement = this.autoplay ? "Video is playing, muted" : "Video is playing", setTimeout(() => this._announcement = "", 1e3));
            },
            // // NOTE: onAdStateChange is not officially documented by YouTube.
            // It is a real event fired by the IFrame player, discovered through community reverse-engineering
            onAdStateChange: (d21) => {
              this._adPlaying = d21.data === window.YT.PlayerState.PLAYING, this._adPlaying && (this._announcement = "Advertisement is playing", setTimeout(() => this._announcement = "", 1e3));
            }
          }
        });
      });
    };
    if (window.YT?.Player)
      e5();
    else {
      if (!document.getElementById("yt-iframe-api")) {
        const t11 = document.createElement("script");
        t11.id = "yt-iframe-api", t11.src = "https://www.youtube.com/iframe_api", document.head.appendChild(t11);
      }
      window.onYouTubeIframeAPIReady = e5;
    }
  }
  /**
   * Event Handlers
   * --------------------------------------------------------------------------
   */
  _handleThumbnailClick() {
    this.disabled || (this._playerActive = true, this.updateComplete.then(() => {
      const e5 = this.shadowRoot?.querySelector("iframe");
      e5 && e5.addEventListener(
        "load",
        () => {
          e5.focus();
        },
        { once: true }
      );
    }), this._announceVideoVO());
  }
  /**
   * Render Helpers
   * --------------------------------------------------------------------------
   */
  _renderAnnouncer() {
    return html`
      <div
        aria-live="assertive"
        aria-atomic="true"
        class="nys-video__announcer sr-only"
      >
        ${this._announcement}
      </div>
    `;
  }
  _renderPlayIcon() {
    return this.disabled ? html`<svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="31"
          height="35"
          viewBox="0 0 31 35"
          fill="none"
        >
          <path
            d="M29.4221 15.7357L2.568 0.231711C1.42656 -0.426849 0 0.396831 0 1.71395V32.7229C0 34.041 1.42656 34.8647 2.568 34.2052L29.4221 18.7012C30.5635 18.0426 30.5635 16.3952 29.4221 15.7357Z"
            fill="white"
            fill-opacity="0.4"
          />
        </svg>` : html`<svg
          aria-hidden="true"
          width="31"
          height="35"
          viewBox="0 0 31 35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M29.4221 15.7357L2.568 0.231711C1.42656 -0.426849 0 0.396831 0 1.71395V32.7229C0 34.041 1.42656 34.8647 2.568 34.2052L29.4221 18.7012C30.5635 18.0426 30.5635 16.3952 29.4221 15.7357Z"
            fill="white"
          />
        </svg>`;
  }
  render() {
    if (!this._isValidYouTubeUrl())
      return html``;
    const e5 = this._getEmbedUrl();
    if (!e5) return html``;
    const t11 = this.size || "md";
    return !this._playerActive && !this.autoplay ? html`
        <div
          class="nys-video nys-video--${t11} ${this.disabled ? "nys-video--disabled" : ""}"
        >
          ${this._renderAnnouncer()}
          <div class="nys-video__ratio-box">
            <div class="nys-video__thumbnail">
              <img src=${this._getThumbnailUrl()} alt="" />
              <button
                class="nys-video__play-icon"
                aria-label="Play ${this.titleText}"
                ?disabled=${this.disabled}
                @click=${this._handleThumbnailClick}
              >
                <span class="nys-video__play-badge">
                  ${this._renderPlayIcon()}
                </span>
              </button>
            </div>
          </div>
          ${this.titleText && html`<div class="nys-video__title-text">
            <p>${this.titleText}</p>
          </div>`}
        </div>
      ` : html`<div class="nys-video nys-video--${t11}">
      ${this._renderAnnouncer()}
      <div class="nys-video__ratio-box">
        <iframe
          tabindex="0"
          src=${e5}
          title=${this.titleText}
          aria-label=${this.titleText}
          loading=${this.loading}
          allowfullscreen
          frameborder="0"
          allow="accelerometer;autoplay;clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>
    </div>`;
  }
};
y15.styles = unsafeCSS(f20);
var i20 = y15;
o17([
  property({ type: String, reflect: true })
], i20.prototype, "id");
o17([
  property({ type: String, reflect: true })
], i20.prototype, "titleText");
o17([
  property({ type: String })
], i20.prototype, "videourl");
o17([
  property({ type: String, reflect: true })
], i20.prototype, "size");
o17([
  property({ type: String })
], i20.prototype, "loading");
o17([
  property({ type: Number })
], i20.prototype, "starttime");
o17([
  property({ type: String })
], i20.prototype, "thumbnail");
o17([
  property({ type: Boolean })
], i20.prototype, "autoplay");
o17([
  property({ type: Boolean, reflect: true })
], i20.prototype, "disabled");
o17([
  state()
], i20.prototype, "_playerActive");
o17([
  state()
], i20.prototype, "_announcement");
customElements.get("nys-video") || customElements.define("nys-video", i20);

// ../dist/fesm2022/nysds-angular.mjs
var _c0 = ["*"];
var proxyInputs = (componentClass, inputs) => {
  const prototype = componentClass.prototype;
  inputs.forEach((name) => {
    Object.defineProperty(prototype, name, {
      get() {
        return this.el[name];
      },
      set(value) {
        this.z.runOutsideAngular(() => this.el[name] = value);
      },
      configurable: true
    });
  });
};
var proxyOutputs = (instance, el, events) => {
  events.forEach((eventName) => instance[eventName] = fromEvent(el, eventName));
};
function ProxyCmp(opts) {
  return (componentClass) => {
    if (opts.inputs?.length) {
      proxyInputs(componentClass, opts.inputs);
    }
    return componentClass;
  };
}
var NysAccordionComponent = class NysAccordionComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
  }
  static ɵfac = function NysAccordionComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysAccordionComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysAccordionComponent2,
    selectors: [["nys-accordion"]],
    inputs: {
      bordered: "bordered",
      headingLevel: "headingLevel",
      id: "id",
      singleSelect: "singleSelect"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysAccordionComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysAccordionComponent = __decorate([ProxyCmp({
  inputs: ["bordered", "headingLevel", "id", "singleSelect"]
})], NysAccordionComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysAccordionComponent, [{
    type: Component,
    args: [{
      selector: "nys-accordion",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["bordered", "headingLevel", "id", "singleSelect"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysAccordionItemComponent = class NysAccordionItemComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-accordionitem-toggle"]);
  }
  static ɵfac = function NysAccordionItemComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysAccordionItemComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysAccordionItemComponent2,
    selectors: [["nys-accordionitem"]],
    inputs: {
      bordered: "bordered",
      expanded: "expanded",
      heading: "heading",
      headingLevel: "headingLevel",
      id: "id"
    },
    outputs: {
      "nys-accordionitem-toggle": "nys-accordionitem-toggle"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysAccordionItemComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysAccordionItemComponent = __decorate([ProxyCmp({
  inputs: ["bordered", "expanded", "heading", "headingLevel", "id"]
})], NysAccordionItemComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysAccordionItemComponent, [{
    type: Component,
    args: [{
      selector: "nys-accordionitem",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["bordered", "expanded", "heading", "headingLevel", "id"],
      outputs: ["nys-accordionitem-toggle"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysAlertComponent = class NysAlertComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-close"]);
  }
  static ɵfac = function NysAlertComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysAlertComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysAlertComponent2,
    selectors: [["nys-alert"]],
    inputs: {
      ariaAttributes: "ariaAttributes",
      dismissible: "dismissible",
      duration: "duration",
      heading: "heading",
      icon: "icon",
      id: "id",
      primaryAction: "primaryAction",
      primaryLabel: "primaryLabel",
      secondaryAction: "secondaryAction",
      secondaryLabel: "secondaryLabel",
      text: "text",
      type: "type"
    },
    outputs: {
      "nys-close": "nys-close"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysAlertComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysAlertComponent = __decorate([ProxyCmp({
  inputs: ["ariaAttributes", "dismissible", "duration", "heading", "icon", "id", "primaryAction", "primaryLabel", "secondaryAction", "secondaryLabel", "text", "type"]
})], NysAlertComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysAlertComponent, [{
    type: Component,
    args: [{
      selector: "nys-alert",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["ariaAttributes", "dismissible", "duration", "heading", "icon", "id", "primaryAction", "primaryLabel", "secondaryAction", "secondaryLabel", "text", "type"],
      outputs: ["nys-close"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysAvatarComponent = class NysAvatarComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
  }
  static ɵfac = function NysAvatarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysAvatarComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysAvatarComponent2,
    selectors: [["nys-avatar"]],
    inputs: {
      ariaLabel: "ariaLabel",
      color: "color",
      disabled: "disabled",
      icon: "icon",
      id: "id",
      image: "image",
      initials: "initials",
      interactive: "interactive",
      lazy: "lazy"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysAvatarComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysAvatarComponent = __decorate([ProxyCmp({
  inputs: ["ariaLabel", "color", "disabled", "icon", "id", "image", "initials", "interactive", "lazy"]
})], NysAvatarComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysAvatarComponent, [{
    type: Component,
    args: [{
      selector: "nys-avatar",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["ariaLabel", "color", "disabled", "icon", "id", "image", "initials", "interactive", "lazy"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysBacktotopComponent = class NysBacktotopComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
  }
  static ɵfac = function NysBacktotopComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysBacktotopComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysBacktotopComponent2,
    selectors: [["nys-backtotop"]],
    inputs: {
      id: "id",
      position: "position",
      visible: "visible"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysBacktotopComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysBacktotopComponent = __decorate([ProxyCmp({
  inputs: ["id", "position", "visible"]
})], NysBacktotopComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysBacktotopComponent, [{
    type: Component,
    args: [{
      selector: "nys-backtotop",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["id", "position", "visible"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysBadgeComponent = class NysBadgeComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
  }
  static ɵfac = function NysBadgeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysBadgeComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysBadgeComponent2,
    selectors: [["nys-badge"]],
    inputs: {
      id: "id",
      intent: "intent",
      label: "label",
      name: "name",
      prefixIcon: "prefixIcon",
      prefixLabel: "prefixLabel",
      size: "size",
      srText: "srText",
      strong: "strong",
      suffixIcon: "suffixIcon"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysBadgeComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysBadgeComponent = __decorate([ProxyCmp({
  inputs: ["id", "intent", "label", "name", "prefixIcon", "prefixLabel", "size", "srText", "strong", "suffixIcon"]
})], NysBadgeComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysBadgeComponent, [{
    type: Component,
    args: [{
      selector: "nys-badge",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["id", "intent", "label", "name", "prefixIcon", "prefixLabel", "size", "srText", "strong", "suffixIcon"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysBreadcrumbsComponent = class NysBreadcrumbsComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-breadcrumbs-expand", "nys-expand"]);
  }
  static ɵfac = function NysBreadcrumbsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysBreadcrumbsComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysBreadcrumbsComponent2,
    selectors: [["nys-breadcrumbs"]],
    inputs: {
      ariaLabel: "ariaLabel",
      backToParent: "backToParent",
      backgroundBar: "backgroundBar",
      collapsed: "collapsed",
      disabled: "disabled",
      id: "id",
      size: "size"
    },
    outputs: {
      "nys-breadcrumbs-expand": "nys-breadcrumbs-expand",
      "nys-expand": "nys-expand"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysBreadcrumbsComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysBreadcrumbsComponent = __decorate([ProxyCmp({
  inputs: ["ariaLabel", "backToParent", "backgroundBar", "collapsed", "disabled", "id", "size"]
})], NysBreadcrumbsComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysBreadcrumbsComponent, [{
    type: Component,
    args: [{
      selector: "nys-breadcrumbs",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["ariaLabel", "backToParent", "backgroundBar", "collapsed", "disabled", "id", "size"],
      outputs: ["nys-breadcrumbs-expand", "nys-expand"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysButtonComponent = class NysButtonComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-blur", "nys-click", "nys-focus"]);
  }
  static ɵfac = function NysButtonComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysButtonComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysButtonComponent2,
    selectors: [["nys-button"]],
    inputs: {
      ariaControls: "ariaControls",
      ariaCurrent: "ariaCurrent",
      ariaDescribedBy: "ariaDescribedBy",
      ariaExpanded: "ariaExpanded",
      circle: "circle",
      disabled: "disabled",
      form: "form",
      fullWidth: "fullWidth",
      href: "href",
      icon: "icon",
      id: "id",
      inverted: "inverted",
      label: "label",
      name: "name",
      onClick: "onClick",
      prefixIcon: "prefixIcon",
      size: "size",
      suffixIcon: "suffixIcon",
      target: "target",
      type: "type",
      value: "value",
      variant: "variant"
    },
    outputs: {
      "nys-blur": "nys-blur",
      "nys-click": "nys-click",
      "nys-focus": "nys-focus"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysButtonComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysButtonComponent = __decorate([ProxyCmp({
  inputs: ["ariaControls", "ariaCurrent", "ariaDescribedBy", "ariaExpanded", "circle", "disabled", "form", "fullWidth", "href", "icon", "id", "inverted", "label", "name", "onClick", "prefixIcon", "size", "suffixIcon", "target", "type", "value", "variant"]
})], NysButtonComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysButtonComponent, [{
    type: Component,
    args: [{
      selector: "nys-button",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["ariaControls", "ariaCurrent", "ariaDescribedBy", "ariaExpanded", "circle", "disabled", "form", "fullWidth", "href", "icon", "id", "inverted", "label", "name", "onClick", "prefixIcon", "size", "suffixIcon", "target", "type", "value", "variant"],
      outputs: ["nys-blur", "nys-click", "nys-focus"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysCardComponent = class NysCardComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-blur", "nys-click", "nys-focus"]);
  }
  static ɵfac = function NysCardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysCardComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysCardComponent2,
    selectors: [["nys-card"]],
    inputs: {
      description: "description",
      elevated: "elevated",
      heading: "heading",
      headingLevel: "headingLevel",
      href: "href",
      id: "id",
      inset: "inset",
      onClick: "onClick",
      preheading: "preheading",
      subheading: "subheading",
      target: "target"
    },
    outputs: {
      "nys-blur": "nys-blur",
      "nys-click": "nys-click",
      "nys-focus": "nys-focus"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysCardComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysCardComponent = __decorate([ProxyCmp({
  inputs: ["description", "elevated", "heading", "headingLevel", "href", "id", "inset", "onClick", "preheading", "subheading", "target"]
})], NysCardComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysCardComponent, [{
    type: Component,
    args: [{
      selector: "nys-card",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["description", "elevated", "heading", "headingLevel", "href", "id", "inset", "onClick", "preheading", "subheading", "target"],
      outputs: ["nys-blur", "nys-click", "nys-focus"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysCheckboxComponent = class NysCheckboxComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-blur", "nys-change", "nys-error", "nys-error-clear", "nys-focus", "nys-other-input"]);
  }
  // ControlValueAccessor — bridges Angular forms (ngModel / formControlName)
  // to the element's `checked` property and its `nys-change` event.
  onChange = () => {
  };
  onTouched = () => {
  };
  writeValue(value) {
    this.el.checked = !!value;
  }
  registerOnChange(fn2) {
    this.onChange = fn2;
  }
  registerOnTouched(fn2) {
    this.onTouched = fn2;
  }
  setDisabledState(isDisabled) {
    this.el.disabled = isDisabled;
  }
  handleChangeEvent() {
    this.onChange(this.el.checked);
  }
  handleBlurEvent() {
    this.onTouched();
  }
  static ɵfac = function NysCheckboxComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysCheckboxComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysCheckboxComponent2,
    selectors: [["nys-checkbox"]],
    hostBindings: function NysCheckboxComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("nys-change", function NysCheckboxComponent_nys_change_HostBindingHandler() {
          return ctx.handleChangeEvent();
        })("nys-blur", function NysCheckboxComponent_nys_blur_HostBindingHandler() {
          return ctx.handleBlurEvent();
        });
      }
    },
    inputs: {
      checked: "checked",
      description: "description",
      disabled: "disabled",
      errorMessage: "errorMessage",
      form: "form",
      groupExist: "groupExist",
      hideLabel: "hideLabel",
      id: "id",
      label: "label",
      labelledby: "labelledby",
      name: "name",
      other: "other",
      required: "required",
      showError: "showError",
      showOtherError: "showOtherError",
      size: "size",
      tile: "tile",
      tooltip: "tooltip",
      value: "value"
    },
    outputs: {
      "nys-blur": "nys-blur",
      "nys-change": "nys-change",
      "nys-error": "nys-error",
      "nys-error-clear": "nys-error-clear",
      "nys-focus": "nys-focus",
      "nys-other-input": "nys-other-input"
    },
    features: [ɵɵProvidersFeature([{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysCheckboxComponent2),
      multi: true
    }])],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysCheckboxComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysCheckboxComponent = __decorate([ProxyCmp({
  inputs: ["checked", "description", "disabled", "errorMessage", "form", "groupExist", "hideLabel", "id", "label", "labelledby", "name", "other", "required", "showError", "showOtherError", "size", "tile", "tooltip", "value"]
})], NysCheckboxComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysCheckboxComponent, [{
    type: Component,
    args: [{
      selector: "nys-checkbox",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["checked", "description", "disabled", "errorMessage", "form", "groupExist", "hideLabel", "id", "label", "labelledby", "name", "other", "required", "showError", "showOtherError", "size", "tile", "tooltip", "value"],
      outputs: ["nys-blur", "nys-change", "nys-error", "nys-error-clear", "nys-focus", "nys-other-input"],
      providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NysCheckboxComponent),
        multi: true
      }]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], {
    handleChangeEvent: [{
      type: HostListener,
      args: ["nys-change"]
    }],
    handleBlurEvent: [{
      type: HostListener,
      args: ["nys-blur"]
    }]
  });
})();
var NysCheckboxgroupComponent = class NysCheckboxgroupComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
  }
  static ɵfac = function NysCheckboxgroupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysCheckboxgroupComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysCheckboxgroupComponent2,
    selectors: [["nys-checkboxgroup"]],
    inputs: {
      description: "description",
      errorMessage: "errorMessage",
      form: "form",
      id: "id",
      label: "label",
      name: "name",
      optional: "optional",
      required: "required",
      showError: "showError",
      size: "size",
      tile: "tile",
      tooltip: "tooltip"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysCheckboxgroupComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysCheckboxgroupComponent = __decorate([ProxyCmp({
  inputs: ["description", "errorMessage", "form", "id", "label", "name", "optional", "required", "showError", "size", "tile", "tooltip"]
})], NysCheckboxgroupComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysCheckboxgroupComponent, [{
    type: Component,
    args: [{
      selector: "nys-checkboxgroup",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["description", "errorMessage", "form", "id", "label", "name", "optional", "required", "showError", "size", "tile", "tooltip"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysComboboxComponent = class NysComboboxComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-blur", "nys-change", "nys-focus", "nys-input"]);
  }
  // ControlValueAccessor — bridges Angular forms (ngModel / formControlName)
  // to the element's `value` property and its `nys-change` event.
  onChange = () => {
  };
  onTouched = () => {
  };
  writeValue(value) {
    this.el.value = value ?? "";
  }
  registerOnChange(fn2) {
    this.onChange = fn2;
  }
  registerOnTouched(fn2) {
    this.onTouched = fn2;
  }
  setDisabledState(isDisabled) {
    this.el.disabled = isDisabled;
  }
  handleChangeEvent() {
    this.onChange(this.el.value);
  }
  handleBlurEvent() {
    this.onTouched();
  }
  static ɵfac = function NysComboboxComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysComboboxComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysComboboxComponent2,
    selectors: [["nys-combobox"]],
    hostBindings: function NysComboboxComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("nys-change", function NysComboboxComponent_nys_change_HostBindingHandler() {
          return ctx.handleChangeEvent();
        })("nys-blur", function NysComboboxComponent_nys_blur_HostBindingHandler() {
          return ctx.handleBlurEvent();
        });
      }
    },
    inputs: {
      description: "description",
      disabled: "disabled",
      errorMessage: "errorMessage",
      form: "form",
      id: "id",
      inverted: "inverted",
      label: "label",
      name: "name",
      optional: "optional",
      required: "required",
      showError: "showError",
      tooltip: "tooltip",
      value: "value",
      width: "width"
    },
    outputs: {
      "nys-blur": "nys-blur",
      "nys-change": "nys-change",
      "nys-focus": "nys-focus",
      "nys-input": "nys-input"
    },
    features: [ɵɵProvidersFeature([{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysComboboxComponent2),
      multi: true
    }])],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysComboboxComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysComboboxComponent = __decorate([ProxyCmp({
  inputs: ["description", "disabled", "errorMessage", "form", "id", "inverted", "label", "name", "optional", "required", "showError", "tooltip", "value", "width"]
})], NysComboboxComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysComboboxComponent, [{
    type: Component,
    args: [{
      selector: "nys-combobox",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["description", "disabled", "errorMessage", "form", "id", "inverted", "label", "name", "optional", "required", "showError", "tooltip", "value", "width"],
      outputs: ["nys-blur", "nys-change", "nys-focus", "nys-input"],
      providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NysComboboxComponent),
        multi: true
      }]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], {
    handleChangeEvent: [{
      type: HostListener,
      args: ["nys-change"]
    }],
    handleBlurEvent: [{
      type: HostListener,
      args: ["nys-blur"]
    }]
  });
})();
var NysDatepickerComponent = class NysDatepickerComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-blur", "nys-input"]);
  }
  // ControlValueAccessor — bridges Angular forms (ngModel / formControlName)
  // to the element's `value` property and its `nys-input` event.
  onChange = () => {
  };
  onTouched = () => {
  };
  writeValue(value) {
    this.el.value = value ?? "";
  }
  registerOnChange(fn2) {
    this.onChange = fn2;
  }
  registerOnTouched(fn2) {
    this.onTouched = fn2;
  }
  setDisabledState(isDisabled) {
    this.el.disabled = isDisabled;
  }
  handleChangeEvent() {
    this.onChange(this.el.value);
  }
  handleBlurEvent() {
    this.onTouched();
  }
  static ɵfac = function NysDatepickerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysDatepickerComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysDatepickerComponent2,
    selectors: [["nys-datepicker"]],
    hostBindings: function NysDatepickerComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("nys-input", function NysDatepickerComponent_nys_input_HostBindingHandler() {
          return ctx.handleChangeEvent();
        })("nys-blur", function NysDatepickerComponent_nys_blur_HostBindingHandler() {
          return ctx.handleBlurEvent();
        });
      }
    },
    inputs: {
      description: "description",
      disabled: "disabled",
      errorMessage: "errorMessage",
      form: "form",
      hideClearButton: "hideClearButton",
      hideTodayButton: "hideTodayButton",
      id: "id",
      inverted: "inverted",
      label: "label",
      maxDate: "maxDate",
      minDate: "minDate",
      name: "name",
      optional: "optional",
      required: "required",
      showError: "showError",
      startDate: "startDate",
      tooltip: "tooltip",
      type: "type",
      value: "value",
      width: "width"
    },
    outputs: {
      "nys-blur": "nys-blur",
      "nys-input": "nys-input"
    },
    features: [ɵɵProvidersFeature([{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysDatepickerComponent2),
      multi: true
    }])],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysDatepickerComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysDatepickerComponent = __decorate([ProxyCmp({
  inputs: ["description", "disabled", "errorMessage", "form", "hideClearButton", "hideTodayButton", "id", "inverted", "label", "maxDate", "minDate", "name", "optional", "required", "showError", "startDate", "tooltip", "type", "value", "width"]
})], NysDatepickerComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysDatepickerComponent, [{
    type: Component,
    args: [{
      selector: "nys-datepicker",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["description", "disabled", "errorMessage", "form", "hideClearButton", "hideTodayButton", "id", "inverted", "label", "maxDate", "minDate", "name", "optional", "required", "showError", "startDate", "tooltip", "type", "value", "width"],
      outputs: ["nys-blur", "nys-input"],
      providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NysDatepickerComponent),
        multi: true
      }]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], {
    handleChangeEvent: [{
      type: HostListener,
      args: ["nys-input"]
    }],
    handleBlurEvent: [{
      type: HostListener,
      args: ["nys-blur"]
    }]
  });
})();
var NysDividerComponent = class NysDividerComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
  }
  static ɵfac = function NysDividerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysDividerComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysDividerComponent2,
    selectors: [["nys-divider"]],
    inputs: {
      inverted: "inverted",
      subtle: "subtle"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysDividerComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysDividerComponent = __decorate([ProxyCmp({
  inputs: ["inverted", "subtle"]
})], NysDividerComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysDividerComponent, [{
    type: Component,
    args: [{
      selector: "nys-divider",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["inverted", "subtle"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysDropdownMenuComponent = class NysDropdownMenuComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
  }
  static ɵfac = function NysDropdownMenuComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysDropdownMenuComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysDropdownMenuComponent2,
    selectors: [["nys-dropdownmenu"]],
    inputs: {
      for: "for",
      label: "label",
      position: "position",
      showDropdown: "showDropdown"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysDropdownMenuComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysDropdownMenuComponent = __decorate([ProxyCmp({
  inputs: ["for", "label", "position", "showDropdown"]
})], NysDropdownMenuComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysDropdownMenuComponent, [{
    type: Component,
    args: [{
      selector: "nys-dropdownmenu",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["for", "label", "position", "showDropdown"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysDropdownMenuItemComponent = class NysDropdownMenuItemComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-click"]);
  }
  static ɵfac = function NysDropdownMenuItemComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysDropdownMenuItemComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysDropdownMenuItemComponent2,
    selectors: [["nys-dropdownmenuitem"]],
    inputs: {
      disabled: "disabled",
      divider: "divider",
      href: "href",
      label: "label",
      prefixIcon: "prefixIcon",
      target: "target"
    },
    outputs: {
      "nys-click": "nys-click"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysDropdownMenuItemComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysDropdownMenuItemComponent = __decorate([ProxyCmp({
  inputs: ["disabled", "divider", "href", "label", "prefixIcon", "target"]
})], NysDropdownMenuItemComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysDropdownMenuItemComponent, [{
    type: Component,
    args: [{
      selector: "nys-dropdownmenuitem",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["disabled", "divider", "href", "label", "prefixIcon", "target"],
      outputs: ["nys-click"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysErrorMessageComponent = class NysErrorMessageComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
  }
  static ɵfac = function NysErrorMessageComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysErrorMessageComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysErrorMessageComponent2,
    selectors: [["nys-errormessage"]],
    inputs: {
      errorMessage: "errorMessage",
      id: "id",
      showDivider: "showDivider",
      showError: "showError"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysErrorMessageComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysErrorMessageComponent = __decorate([ProxyCmp({
  inputs: ["errorMessage", "id", "showDivider", "showError"]
})], NysErrorMessageComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysErrorMessageComponent, [{
    type: Component,
    args: [{
      selector: "nys-errormessage",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["errorMessage", "id", "showDivider", "showError"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysFileinputComponent = class NysFileinputComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-blur", "nys-change"]);
  }
  // ControlValueAccessor — bridges Angular forms (ngModel / formControlName)
  // to the element's `value` property and its `nys-change` event.
  onChange = () => {
  };
  onTouched = () => {
  };
  writeValue(value) {
    this.el.value = value ?? "";
  }
  registerOnChange(fn2) {
    this.onChange = fn2;
  }
  registerOnTouched(fn2) {
    this.onTouched = fn2;
  }
  setDisabledState(isDisabled) {
    this.el.disabled = isDisabled;
  }
  handleChangeEvent() {
    this.onChange(this.el.value);
  }
  handleBlurEvent() {
    this.onTouched();
  }
  static ɵfac = function NysFileinputComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysFileinputComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysFileinputComponent2,
    selectors: [["nys-fileinput"]],
    hostBindings: function NysFileinputComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("nys-change", function NysFileinputComponent_nys_change_HostBindingHandler() {
          return ctx.handleChangeEvent();
        })("nys-blur", function NysFileinputComponent_nys_blur_HostBindingHandler() {
          return ctx.handleBlurEvent();
        });
      }
    },
    inputs: {
      accept: "accept",
      description: "description",
      disabled: "disabled",
      dropzone: "dropzone",
      errorMessage: "errorMessage",
      files: "files",
      form: "form",
      id: "id",
      inverted: "inverted",
      label: "label",
      multiple: "multiple",
      name: "name",
      optional: "optional",
      required: "required",
      showError: "showError",
      tooltip: "tooltip",
      value: "value",
      width: "width"
    },
    outputs: {
      "nys-blur": "nys-blur",
      "nys-change": "nys-change"
    },
    features: [ɵɵProvidersFeature([{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysFileinputComponent2),
      multi: true
    }])],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysFileinputComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysFileinputComponent = __decorate([ProxyCmp({
  inputs: ["accept", "description", "disabled", "dropzone", "errorMessage", "files", "form", "id", "inverted", "label", "multiple", "name", "optional", "required", "showError", "tooltip", "value", "width"]
})], NysFileinputComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysFileinputComponent, [{
    type: Component,
    args: [{
      selector: "nys-fileinput",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["accept", "description", "disabled", "dropzone", "errorMessage", "files", "form", "id", "inverted", "label", "multiple", "name", "optional", "required", "showError", "tooltip", "value", "width"],
      outputs: ["nys-blur", "nys-change"],
      providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NysFileinputComponent),
        multi: true
      }]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], {
    handleChangeEvent: [{
      type: HostListener,
      args: ["nys-change"]
    }],
    handleBlurEvent: [{
      type: HostListener,
      args: ["nys-blur"]
    }]
  });
})();
var NysFileItemComponent = class NysFileItemComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-fileRemove"]);
  }
  static ɵfac = function NysFileItemComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysFileItemComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysFileItemComponent2,
    selectors: [["nys-fileitem"]],
    inputs: {
      errorMessage: "errorMessage",
      filename: "filename",
      progress: "progress",
      status: "status"
    },
    outputs: {
      "nys-fileRemove": "nys-fileRemove"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysFileItemComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysFileItemComponent = __decorate([ProxyCmp({
  inputs: ["errorMessage", "filename", "progress", "status"]
})], NysFileItemComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysFileItemComponent, [{
    type: Component,
    args: [{
      selector: "nys-fileitem",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["errorMessage", "filename", "progress", "status"],
      outputs: ["nys-fileRemove"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysGlobalFooterComponent = class NysGlobalFooterComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
  }
  static ɵfac = function NysGlobalFooterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysGlobalFooterComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysGlobalFooterComponent2,
    selectors: [["nys-globalfooter"]],
    inputs: {
      agencyName: "agencyName",
      agencySubheading: "agencySubheading",
      homepageLink: "homepageLink",
      id: "id",
      landmarkLabel: "landmarkLabel"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysGlobalFooterComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysGlobalFooterComponent = __decorate([ProxyCmp({
  inputs: ["agencyName", "agencySubheading", "homepageLink", "id", "landmarkLabel"]
})], NysGlobalFooterComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysGlobalFooterComponent, [{
    type: Component,
    args: [{
      selector: "nys-globalfooter",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["agencyName", "agencySubheading", "homepageLink", "id", "landmarkLabel"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysGlobalHeaderComponent = class NysGlobalHeaderComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
  }
  static ɵfac = function NysGlobalHeaderComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysGlobalHeaderComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysGlobalHeaderComponent2,
    selectors: [["nys-globalheader"]],
    inputs: {
      agencyName: "agencyName",
      appName: "appName",
      homepageLink: "homepageLink",
      id: "id",
      landmarkLabel: "landmarkLabel",
      nysLogo: "nysLogo"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysGlobalHeaderComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysGlobalHeaderComponent = __decorate([ProxyCmp({
  inputs: ["agencyName", "appName", "homepageLink", "id", "landmarkLabel", "nysLogo"]
})], NysGlobalHeaderComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysGlobalHeaderComponent, [{
    type: Component,
    args: [{
      selector: "nys-globalheader",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["agencyName", "appName", "homepageLink", "id", "landmarkLabel", "nysLogo"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysIconComponent = class NysIconComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
  }
  static ɵfac = function NysIconComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysIconComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysIconComponent2,
    selectors: [["nys-icon"]],
    inputs: {
      ariaLabel: "ariaLabel",
      color: "color",
      flip: "flip",
      library: "library",
      name: "name",
      rotate: "rotate",
      size: "size",
      updateComplete: "updateComplete"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysIconComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysIconComponent = __decorate([ProxyCmp({
  inputs: ["ariaLabel", "color", "flip", "library", "name", "rotate", "size", "updateComplete"]
})], NysIconComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysIconComponent, [{
    type: Component,
    args: [{
      selector: "nys-icon",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["ariaLabel", "color", "flip", "library", "name", "rotate", "size", "updateComplete"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysIconlistComponent = class NysIconlistComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
  }
  static ɵfac = function NysIconlistComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysIconlistComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysIconlistComponent2,
    selectors: [["nys-iconlist"]],
    inputs: {
      divider: "divider",
      id: "id"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysIconlistComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysIconlistComponent = __decorate([ProxyCmp({
  inputs: ["divider", "id"]
})], NysIconlistComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysIconlistComponent, [{
    type: Component,
    args: [{
      selector: "nys-iconlist",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["divider", "id"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysIconlistitemComponent = class NysIconlistitemComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
  }
  static ɵfac = function NysIconlistitemComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysIconlistitemComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysIconlistitemComponent2,
    selectors: [["nys-iconlistitem"]],
    inputs: {
      divider: "divider",
      icon: "icon"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysIconlistitemComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysIconlistitemComponent = __decorate([ProxyCmp({
  inputs: ["divider", "icon"]
})], NysIconlistitemComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysIconlistitemComponent, [{
    type: Component,
    args: [{
      selector: "nys-iconlistitem",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["divider", "icon"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysLabelComponent = class NysLabelComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-label-click"]);
  }
  static ɵfac = function NysLabelComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysLabelComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysLabelComponent2,
    selectors: [["nys-label"]],
    inputs: {
      description: "description",
      flag: "flag",
      id: "id",
      inverted: "inverted",
      label: "label",
      tooltip: "tooltip"
    },
    outputs: {
      "nys-label-click": "nys-label-click"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysLabelComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysLabelComponent = __decorate([ProxyCmp({
  inputs: ["description", "flag", "id", "inverted", "label", "tooltip"]
})], NysLabelComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysLabelComponent, [{
    type: Component,
    args: [{
      selector: "nys-label",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["description", "flag", "id", "inverted", "label", "tooltip"],
      outputs: ["nys-label-click"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysModalComponent = class NysModalComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-close", "nys-open"]);
  }
  static ɵfac = function NysModalComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysModalComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysModalComponent2,
    selectors: [["nys-modal"]],
    inputs: {
      ariaLabel: "ariaLabel",
      heading: "heading",
      id: "id",
      mandatory: "mandatory",
      open: "open",
      subheading: "subheading",
      width: "width"
    },
    outputs: {
      "nys-close": "nys-close",
      "nys-open": "nys-open"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysModalComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysModalComponent = __decorate([ProxyCmp({
  inputs: ["ariaLabel", "heading", "id", "mandatory", "open", "subheading", "width"]
})], NysModalComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysModalComponent, [{
    type: Component,
    args: [{
      selector: "nys-modal",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["ariaLabel", "heading", "id", "mandatory", "open", "subheading", "width"],
      outputs: ["nys-close", "nys-open"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysOptionComponent = class NysOptionComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
  }
  static ɵfac = function NysOptionComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysOptionComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysOptionComponent2,
    selectors: [["nys-option"]],
    inputs: {
      disabled: "disabled",
      hidden: "hidden",
      label: "label",
      selected: "selected",
      value: "value"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysOptionComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysOptionComponent = __decorate([ProxyCmp({
  inputs: ["disabled", "hidden", "label", "selected", "value"]
})], NysOptionComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysOptionComponent, [{
    type: Component,
    args: [{
      selector: "nys-option",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["disabled", "hidden", "label", "selected", "value"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysPaginationComponent = class NysPaginationComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-change"]);
  }
  static ɵfac = function NysPaginationComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysPaginationComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysPaginationComponent2,
    selectors: [["nys-pagination"]],
    inputs: {
      currentPage: "currentPage",
      id: "id",
      name: "name",
      totalPages: "totalPages"
    },
    outputs: {
      "nys-change": "nys-change"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysPaginationComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysPaginationComponent = __decorate([ProxyCmp({
  inputs: ["currentPage", "id", "name", "totalPages"]
})], NysPaginationComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysPaginationComponent, [{
    type: Component,
    args: [{
      selector: "nys-pagination",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["currentPage", "id", "name", "totalPages"],
      outputs: ["nys-change"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysProcesslistComponent = class NysProcesslistComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
  }
  static ɵfac = function NysProcesslistComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysProcesslistComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysProcesslistComponent2,
    selectors: [["nys-processlist"]],
    inputs: {
      id: "id",
      initialStep: "initialStep",
      neutral: "neutral",
      size: "size",
      strong: "strong"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysProcesslistComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysProcesslistComponent = __decorate([ProxyCmp({
  inputs: ["id", "initialStep", "neutral", "size", "strong"]
})], NysProcesslistComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysProcesslistComponent, [{
    type: Component,
    args: [{
      selector: "nys-processlist",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["id", "initialStep", "neutral", "size", "strong"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysProcesslistitemComponent = class NysProcesslistitemComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
  }
  static ɵfac = function NysProcesslistitemComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysProcesslistitemComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysProcesslistitemComponent2,
    selectors: [["nys-processlistitem"]],
    inputs: {
      description: "description",
      label: "label"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysProcesslistitemComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysProcesslistitemComponent = __decorate([ProxyCmp({
  inputs: ["description", "label"]
})], NysProcesslistitemComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysProcesslistitemComponent, [{
    type: Component,
    args: [{
      selector: "nys-processlistitem",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["description", "label"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysRadiobuttonComponent = class NysRadiobuttonComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-blur", "nys-change", "nys-focus", "nys-other-input"]);
  }
  // ControlValueAccessor — bridges Angular forms (ngModel / formControlName)
  // to the element's `checked`/`value` property and its `nys-change` event.
  onChange = () => {
  };
  onTouched = () => {
  };
  // ngModel on a radio holds the selected radio's *value*; each radio is
  // checked exactly when the model matches its own value (mirrors Angular's
  // native RadioControlValueAccessor).
  writeValue(value) {
    this.el.checked = value === this.el.value;
  }
  registerOnChange(fn2) {
    this.onChange = fn2;
  }
  registerOnTouched(fn2) {
    this.onTouched = fn2;
  }
  setDisabledState(isDisabled) {
    this.el.disabled = isDisabled;
  }
  handleChangeEvent() {
    if (this.el.checked) {
      this.onChange(this.el.value);
    }
  }
  handleBlurEvent() {
    this.onTouched();
  }
  static ɵfac = function NysRadiobuttonComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysRadiobuttonComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysRadiobuttonComponent2,
    selectors: [["nys-radiobutton"]],
    hostBindings: function NysRadiobuttonComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("nys-change", function NysRadiobuttonComponent_nys_change_HostBindingHandler() {
          return ctx.handleChangeEvent();
        })("nys-blur", function NysRadiobuttonComponent_nys_blur_HostBindingHandler() {
          return ctx.handleBlurEvent();
        });
      }
    },
    inputs: {
      checked: "checked",
      description: "description",
      disabled: "disabled",
      form: "form",
      hideLabel: "hideLabel",
      id: "id",
      label: "label",
      labelledby: "labelledby",
      name: "name",
      other: "other",
      required: "required",
      showOtherError: "showOtherError",
      size: "size",
      tile: "tile",
      validationMessage: "validationMessage",
      validity: "validity",
      value: "value"
    },
    outputs: {
      "nys-blur": "nys-blur",
      "nys-change": "nys-change",
      "nys-focus": "nys-focus",
      "nys-other-input": "nys-other-input"
    },
    features: [ɵɵProvidersFeature([{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysRadiobuttonComponent2),
      multi: true
    }])],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysRadiobuttonComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysRadiobuttonComponent = __decorate([ProxyCmp({
  inputs: ["checked", "description", "disabled", "form", "hideLabel", "id", "label", "labelledby", "name", "other", "required", "showOtherError", "size", "tile", "validationMessage", "validity", "value"]
})], NysRadiobuttonComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysRadiobuttonComponent, [{
    type: Component,
    args: [{
      selector: "nys-radiobutton",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["checked", "description", "disabled", "form", "hideLabel", "id", "label", "labelledby", "name", "other", "required", "showOtherError", "size", "tile", "validationMessage", "validity", "value"],
      outputs: ["nys-blur", "nys-change", "nys-focus", "nys-other-input"],
      providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NysRadiobuttonComponent),
        multi: true
      }]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], {
    handleChangeEvent: [{
      type: HostListener,
      args: ["nys-change"]
    }],
    handleBlurEvent: [{
      type: HostListener,
      args: ["nys-blur"]
    }]
  });
})();
var NysRadiogroupComponent = class NysRadiogroupComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-change", "nys-other-input"]);
  }
  static ɵfac = function NysRadiogroupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysRadiogroupComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysRadiogroupComponent2,
    selectors: [["nys-radiogroup"]],
    inputs: {
      description: "description",
      errorMessage: "errorMessage",
      form: "form",
      id: "id",
      label: "label",
      name: "name",
      optional: "optional",
      required: "required",
      showError: "showError",
      size: "size",
      tile: "tile",
      tooltip: "tooltip"
    },
    outputs: {
      "nys-change": "nys-change",
      "nys-other-input": "nys-other-input"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysRadiogroupComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysRadiogroupComponent = __decorate([ProxyCmp({
  inputs: ["description", "errorMessage", "form", "id", "label", "name", "optional", "required", "showError", "size", "tile", "tooltip"]
})], NysRadiogroupComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysRadiogroupComponent, [{
    type: Component,
    args: [{
      selector: "nys-radiogroup",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["description", "errorMessage", "form", "id", "label", "name", "optional", "required", "showError", "size", "tile", "tooltip"],
      outputs: ["nys-change", "nys-other-input"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysSelectComponent = class NysSelectComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-blur", "nys-change", "nys-focus"]);
  }
  // ControlValueAccessor — bridges Angular forms (ngModel / formControlName)
  // to the element's `value` property and its `nys-change` event.
  onChange = () => {
  };
  onTouched = () => {
  };
  writeValue(value) {
    this.el.value = value ?? "";
  }
  registerOnChange(fn2) {
    this.onChange = fn2;
  }
  registerOnTouched(fn2) {
    this.onTouched = fn2;
  }
  setDisabledState(isDisabled) {
    this.el.disabled = isDisabled;
  }
  handleChangeEvent() {
    this.onChange(this.el.value);
  }
  handleBlurEvent() {
    this.onTouched();
  }
  static ɵfac = function NysSelectComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysSelectComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysSelectComponent2,
    selectors: [["nys-select"]],
    hostBindings: function NysSelectComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("nys-change", function NysSelectComponent_nys_change_HostBindingHandler() {
          return ctx.handleChangeEvent();
        })("nys-blur", function NysSelectComponent_nys_blur_HostBindingHandler() {
          return ctx.handleBlurEvent();
        });
      }
    },
    inputs: {
      ariaLabel: "ariaLabel",
      description: "description",
      disabled: "disabled",
      errorMessage: "errorMessage",
      form: "form",
      id: "id",
      inverted: "inverted",
      label: "label",
      name: "name",
      optional: "optional",
      required: "required",
      showError: "showError",
      tooltip: "tooltip",
      value: "value",
      width: "width"
    },
    outputs: {
      "nys-blur": "nys-blur",
      "nys-change": "nys-change",
      "nys-focus": "nys-focus"
    },
    features: [ɵɵProvidersFeature([{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysSelectComponent2),
      multi: true
    }])],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysSelectComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysSelectComponent = __decorate([ProxyCmp({
  inputs: ["ariaLabel", "description", "disabled", "errorMessage", "form", "id", "inverted", "label", "name", "optional", "required", "showError", "tooltip", "value", "width"]
})], NysSelectComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysSelectComponent, [{
    type: Component,
    args: [{
      selector: "nys-select",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["ariaLabel", "description", "disabled", "errorMessage", "form", "id", "inverted", "label", "name", "optional", "required", "showError", "tooltip", "value", "width"],
      outputs: ["nys-blur", "nys-change", "nys-focus"],
      providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NysSelectComponent),
        multi: true
      }]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], {
    handleChangeEvent: [{
      type: HostListener,
      args: ["nys-change"]
    }],
    handleBlurEvent: [{
      type: HostListener,
      args: ["nys-blur"]
    }]
  });
})();
var NysSkipnavComponent = class NysSkipnavComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
  }
  static ɵfac = function NysSkipnavComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysSkipnavComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysSkipnavComponent2,
    selectors: [["nys-skipnav"]],
    inputs: {
      href: "href",
      id: "id"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysSkipnavComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysSkipnavComponent = __decorate([ProxyCmp({
  inputs: ["href", "id"]
})], NysSkipnavComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysSkipnavComponent, [{
    type: Component,
    args: [{
      selector: "nys-skipnav",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["href", "id"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysStepComponent = class NysStepComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-step-click"]);
  }
  static ɵfac = function NysStepComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysStepComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysStepComponent2,
    selectors: [["nys-step"]],
    inputs: {
      current: "current",
      href: "href",
      label: "label",
      onClick: "onClick",
      selected: "selected"
    },
    outputs: {
      "nys-step-click": "nys-step-click"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysStepComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysStepComponent = __decorate([ProxyCmp({
  inputs: ["current", "href", "label", "onClick", "selected"]
})], NysStepComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysStepComponent, [{
    type: Component,
    args: [{
      selector: "nys-step",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["current", "href", "label", "onClick", "selected"],
      outputs: ["nys-step-click"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysStepperComponent = class NysStepperComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
  }
  static ɵfac = function NysStepperComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysStepperComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysStepperComponent2,
    selectors: [["nys-stepper"]],
    inputs: {
      counterText: "counterText",
      id: "id",
      isCompactExpanded: "isCompactExpanded",
      label: "label",
      name: "name"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysStepperComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysStepperComponent = __decorate([ProxyCmp({
  inputs: ["counterText", "id", "isCompactExpanded", "label", "name"]
})], NysStepperComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysStepperComponent, [{
    type: Component,
    args: [{
      selector: "nys-stepper",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["counterText", "id", "isCompactExpanded", "label", "name"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysTabComponent = class NysTabComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-tab-blur", "nys-tab-focus", "nys-tab-select"]);
  }
  static ɵfac = function NysTabComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysTabComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysTabComponent2,
    selectors: [["nys-tab"]],
    inputs: {
      disabled: "disabled",
      id: "id",
      label: "label",
      selected: "selected"
    },
    outputs: {
      "nys-tab-blur": "nys-tab-blur",
      "nys-tab-focus": "nys-tab-focus",
      "nys-tab-select": "nys-tab-select"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysTabComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysTabComponent = __decorate([ProxyCmp({
  inputs: ["disabled", "id", "label", "selected"]
})], NysTabComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysTabComponent, [{
    type: Component,
    args: [{
      selector: "nys-tab",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["disabled", "id", "label", "selected"],
      outputs: ["nys-tab-blur", "nys-tab-focus", "nys-tab-select"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysTabgroupComponent = class NysTabgroupComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
  }
  static ɵfac = function NysTabgroupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysTabgroupComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysTabgroupComponent2,
    selectors: [["nys-tabgroup"]],
    inputs: {
      id: "id",
      name: "name"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysTabgroupComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysTabgroupComponent = __decorate([ProxyCmp({
  inputs: ["id", "name"]
})], NysTabgroupComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysTabgroupComponent, [{
    type: Component,
    args: [{
      selector: "nys-tabgroup",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["id", "name"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysTableComponent = class NysTableComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-click", "nys-column-sort"]);
  }
  static ɵfac = function NysTableComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysTableComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysTableComponent2,
    selectors: [["nys-table"]],
    inputs: {
      bordered: "bordered",
      download: "download",
      id: "id",
      name: "name",
      sortable: "sortable",
      striped: "striped"
    },
    outputs: {
      "nys-click": "nys-click",
      "nys-column-sort": "nys-column-sort"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysTableComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysTableComponent = __decorate([ProxyCmp({
  inputs: ["bordered", "download", "id", "name", "sortable", "striped"]
})], NysTableComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysTableComponent, [{
    type: Component,
    args: [{
      selector: "nys-table",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["bordered", "download", "id", "name", "sortable", "striped"],
      outputs: ["nys-click", "nys-column-sort"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysTabpanelComponent = class NysTabpanelComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
  }
  static ɵfac = function NysTabpanelComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysTabpanelComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysTabpanelComponent2,
    selectors: [["nys-tabpanel"]],
    inputs: {
      id: "id"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysTabpanelComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysTabpanelComponent = __decorate([ProxyCmp({
  inputs: ["id"]
})], NysTabpanelComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysTabpanelComponent, [{
    type: Component,
    args: [{
      selector: "nys-tabpanel",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["id"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysTextareaComponent = class NysTextareaComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-blur", "nys-focus", "nys-input", "nys-select", "nys-selectionchange"]);
  }
  // ControlValueAccessor — bridges Angular forms (ngModel / formControlName)
  // to the element's `value` property and its `nys-input` event.
  onChange = () => {
  };
  onTouched = () => {
  };
  writeValue(value) {
    this.el.value = value ?? "";
  }
  registerOnChange(fn2) {
    this.onChange = fn2;
  }
  registerOnTouched(fn2) {
    this.onTouched = fn2;
  }
  setDisabledState(isDisabled) {
    this.el.disabled = isDisabled;
  }
  handleChangeEvent() {
    this.onChange(this.el.value);
  }
  handleBlurEvent() {
    this.onTouched();
  }
  static ɵfac = function NysTextareaComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysTextareaComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysTextareaComponent2,
    selectors: [["nys-textarea"]],
    hostBindings: function NysTextareaComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("nys-input", function NysTextareaComponent_nys_input_HostBindingHandler() {
          return ctx.handleChangeEvent();
        })("nys-blur", function NysTextareaComponent_nys_blur_HostBindingHandler() {
          return ctx.handleBlurEvent();
        });
      }
    },
    inputs: {
      ariaLabel: "ariaLabel",
      description: "description",
      disabled: "disabled",
      errorMessage: "errorMessage",
      form: "form",
      id: "id",
      inverted: "inverted",
      label: "label",
      maxlength: "maxlength",
      name: "name",
      optional: "optional",
      placeholder: "placeholder",
      readonly: "readonly",
      required: "required",
      resize: "resize",
      rows: "rows",
      showError: "showError",
      tooltip: "tooltip",
      value: "value",
      width: "width"
    },
    outputs: {
      "nys-blur": "nys-blur",
      "nys-focus": "nys-focus",
      "nys-input": "nys-input",
      "nys-select": "nys-select",
      "nys-selectionchange": "nys-selectionchange"
    },
    features: [ɵɵProvidersFeature([{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysTextareaComponent2),
      multi: true
    }])],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysTextareaComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysTextareaComponent = __decorate([ProxyCmp({
  inputs: ["ariaLabel", "description", "disabled", "errorMessage", "form", "id", "inverted", "label", "maxlength", "name", "optional", "placeholder", "readonly", "required", "resize", "rows", "showError", "tooltip", "value", "width"]
})], NysTextareaComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysTextareaComponent, [{
    type: Component,
    args: [{
      selector: "nys-textarea",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["ariaLabel", "description", "disabled", "errorMessage", "form", "id", "inverted", "label", "maxlength", "name", "optional", "placeholder", "readonly", "required", "resize", "rows", "showError", "tooltip", "value", "width"],
      outputs: ["nys-blur", "nys-focus", "nys-input", "nys-select", "nys-selectionchange"],
      providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NysTextareaComponent),
        multi: true
      }]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], {
    handleChangeEvent: [{
      type: HostListener,
      args: ["nys-input"]
    }],
    handleBlurEvent: [{
      type: HostListener,
      args: ["nys-blur"]
    }]
  });
})();
var NysTextinputComponent = class NysTextinputComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-blur", "nys-focus", "nys-input"]);
  }
  // ControlValueAccessor — bridges Angular forms (ngModel / formControlName)
  // to the element's `value` property and its `nys-input` event.
  onChange = () => {
  };
  onTouched = () => {
  };
  writeValue(value) {
    this.el.value = value ?? "";
  }
  registerOnChange(fn2) {
    this.onChange = fn2;
  }
  registerOnTouched(fn2) {
    this.onTouched = fn2;
  }
  setDisabledState(isDisabled) {
    this.el.disabled = isDisabled;
  }
  handleChangeEvent() {
    this.onChange(this.el.value);
  }
  handleBlurEvent() {
    this.onTouched();
  }
  static ɵfac = function NysTextinputComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysTextinputComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysTextinputComponent2,
    selectors: [["nys-textinput"]],
    hostBindings: function NysTextinputComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("nys-input", function NysTextinputComponent_nys_input_HostBindingHandler() {
          return ctx.handleChangeEvent();
        })("nys-blur", function NysTextinputComponent_nys_blur_HostBindingHandler() {
          return ctx.handleBlurEvent();
        });
      }
    },
    inputs: {
      ariaLabel: "ariaLabel",
      description: "description",
      disabled: "disabled",
      errorMessage: "errorMessage",
      form: "form",
      id: "id",
      inverted: "inverted",
      label: "label",
      max: "max",
      maxlength: "maxlength",
      min: "min",
      name: "name",
      optional: "optional",
      pattern: "pattern",
      placeholder: "placeholder",
      readonly: "readonly",
      required: "required",
      showError: "showError",
      step: "step",
      tooltip: "tooltip",
      type: "type",
      value: "value",
      width: "width"
    },
    outputs: {
      "nys-blur": "nys-blur",
      "nys-focus": "nys-focus",
      "nys-input": "nys-input"
    },
    features: [ɵɵProvidersFeature([{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysTextinputComponent2),
      multi: true
    }])],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysTextinputComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysTextinputComponent = __decorate([ProxyCmp({
  inputs: ["ariaLabel", "description", "disabled", "errorMessage", "form", "id", "inverted", "label", "max", "maxlength", "min", "name", "optional", "pattern", "placeholder", "readonly", "required", "showError", "step", "tooltip", "type", "value", "width"]
})], NysTextinputComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysTextinputComponent, [{
    type: Component,
    args: [{
      selector: "nys-textinput",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["ariaLabel", "description", "disabled", "errorMessage", "form", "id", "inverted", "label", "max", "maxlength", "min", "name", "optional", "pattern", "placeholder", "readonly", "required", "showError", "step", "tooltip", "type", "value", "width"],
      outputs: ["nys-blur", "nys-focus", "nys-input"],
      providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NysTextinputComponent),
        multi: true
      }]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], {
    handleChangeEvent: [{
      type: HostListener,
      args: ["nys-input"]
    }],
    handleBlurEvent: [{
      type: HostListener,
      args: ["nys-blur"]
    }]
  });
})();
var NysToggleComponent = class NysToggleComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-blur", "nys-change", "nys-focus"]);
  }
  // ControlValueAccessor — bridges Angular forms (ngModel / formControlName)
  // to the element's `checked` property and its `nys-change` event.
  onChange = () => {
  };
  onTouched = () => {
  };
  writeValue(value) {
    this.el.checked = !!value;
  }
  registerOnChange(fn2) {
    this.onChange = fn2;
  }
  registerOnTouched(fn2) {
    this.onTouched = fn2;
  }
  setDisabledState(isDisabled) {
    this.el.disabled = isDisabled;
  }
  handleChangeEvent() {
    this.onChange(this.el.checked);
  }
  handleBlurEvent() {
    this.onTouched();
  }
  static ɵfac = function NysToggleComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysToggleComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysToggleComponent2,
    selectors: [["nys-toggle"]],
    hostBindings: function NysToggleComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("nys-change", function NysToggleComponent_nys_change_HostBindingHandler() {
          return ctx.handleChangeEvent();
        })("nys-blur", function NysToggleComponent_nys_blur_HostBindingHandler() {
          return ctx.handleBlurEvent();
        });
      }
    },
    inputs: {
      checked: "checked",
      description: "description",
      disabled: "disabled",
      form: "form",
      id: "id",
      inverted: "inverted",
      label: "label",
      name: "name",
      noIcon: "noIcon",
      size: "size",
      value: "value"
    },
    outputs: {
      "nys-blur": "nys-blur",
      "nys-change": "nys-change",
      "nys-focus": "nys-focus"
    },
    features: [ɵɵProvidersFeature([{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NysToggleComponent2),
      multi: true
    }])],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysToggleComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysToggleComponent = __decorate([ProxyCmp({
  inputs: ["checked", "description", "disabled", "form", "id", "inverted", "label", "name", "noIcon", "size", "value"]
})], NysToggleComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysToggleComponent, [{
    type: Component,
    args: [{
      selector: "nys-toggle",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["checked", "description", "disabled", "form", "id", "inverted", "label", "name", "noIcon", "size", "value"],
      outputs: ["nys-blur", "nys-change", "nys-focus"],
      providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NysToggleComponent),
        multi: true
      }]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], {
    handleChangeEvent: [{
      type: HostListener,
      args: ["nys-change"]
    }],
    handleBlurEvent: [{
      type: HostListener,
      args: ["nys-blur"]
    }]
  });
})();
var NysTooltipComponent = class NysTooltipComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
  }
  static ɵfac = function NysTooltipComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysTooltipComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysTooltipComponent2,
    selectors: [["nys-tooltip"]],
    inputs: {
      for: "for",
      id: "id",
      inverted: "inverted",
      position: "position",
      text: "text"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysTooltipComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysTooltipComponent = __decorate([ProxyCmp({
  inputs: ["for", "id", "inverted", "position", "text"]
})], NysTooltipComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysTooltipComponent, [{
    type: Component,
    args: [{
      selector: "nys-tooltip",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["for", "id", "inverted", "position", "text"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysUnavFooterComponent = class NysUnavFooterComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
  }
  static ɵfac = function NysUnavFooterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysUnavFooterComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysUnavFooterComponent2,
    selectors: [["nys-unavfooter"]],
    inputs: {
      landmarkLabel: "landmarkLabel"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysUnavFooterComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysUnavFooterComponent = __decorate([ProxyCmp({
  inputs: ["landmarkLabel"]
})], NysUnavFooterComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysUnavFooterComponent, [{
    type: Component,
    args: [{
      selector: "nys-unavfooter",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["landmarkLabel"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysUnavHeaderComponent = class NysUnavHeaderComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-language-select", "nys-search-submit"]);
  }
  static ɵfac = function NysUnavHeaderComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysUnavHeaderComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysUnavHeaderComponent2,
    selectors: [["nys-unavheader"]],
    inputs: {
      hideSearch: "hideSearch",
      hideTranslate: "hideTranslate",
      isSearchFocused: "isSearchFocused",
      landmarkLabel: "landmarkLabel",
      languageVisible: "languageVisible",
      languages: "languages",
      searchDropdownVisible: "searchDropdownVisible",
      searchUrl: "searchUrl",
      trustbarVisible: "trustbarVisible"
    },
    outputs: {
      "nys-language-select": "nys-language-select",
      "nys-search-submit": "nys-search-submit"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysUnavHeaderComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysUnavHeaderComponent = __decorate([ProxyCmp({
  inputs: ["hideSearch", "hideTranslate", "isSearchFocused", "landmarkLabel", "languageVisible", "languages", "searchDropdownVisible", "searchUrl", "trustbarVisible"]
})], NysUnavHeaderComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysUnavHeaderComponent, [{
    type: Component,
    args: [{
      selector: "nys-unavheader",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["hideSearch", "hideTranslate", "isSearchFocused", "landmarkLabel", "languageVisible", "languages", "searchDropdownVisible", "searchUrl", "trustbarVisible"],
      outputs: ["nys-language-select", "nys-search-submit"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysVerticalnavComponent = class NysVerticalnavComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
  }
  static ɵfac = function NysVerticalnavComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysVerticalnavComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysVerticalnavComponent2,
    selectors: [["nys-verticalnav"]],
    inputs: {
      expanded: "expanded",
      heading: "heading",
      headingLevel: "headingLevel",
      hideHeading: "hideHeading",
      id: "id"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysVerticalnavComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysVerticalnavComponent = __decorate([ProxyCmp({
  inputs: ["expanded", "heading", "headingLevel", "hideHeading", "id"]
})], NysVerticalnavComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysVerticalnavComponent, [{
    type: Component,
    args: [{
      selector: "nys-verticalnav",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["expanded", "heading", "headingLevel", "hideHeading", "id"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysVerticalnavGroupComponent = class NysVerticalnavGroupComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-child-resize", "nys-verticalnavgroup-toggle"]);
  }
  static ɵfac = function NysVerticalnavGroupComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysVerticalnavGroupComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysVerticalnavGroupComponent2,
    selectors: [["nys-verticalnavgroup"]],
    inputs: {
      active: "active",
      disabled: "disabled",
      expanded: "expanded",
      id: "id",
      label: "label"
    },
    outputs: {
      "nys-child-resize": "nys-child-resize",
      "nys-verticalnavgroup-toggle": "nys-verticalnavgroup-toggle"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysVerticalnavGroupComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysVerticalnavGroupComponent = __decorate([ProxyCmp({
  inputs: ["active", "disabled", "expanded", "id", "label"]
})], NysVerticalnavGroupComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysVerticalnavGroupComponent, [{
    type: Component,
    args: [{
      selector: "nys-verticalnavgroup",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["active", "disabled", "expanded", "id", "label"],
      outputs: ["nys-child-resize", "nys-verticalnavgroup-toggle"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NysVideoComponent = class NysVideoComponent2 {
  z;
  el;
  constructor(changeDetector, elementRef, z8) {
    this.z = z8;
    changeDetector.detach();
    this.el = elementRef.nativeElement;
    proxyOutputs(this, this.el, ["nys-video-play"]);
  }
  static ɵfac = function NysVideoComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NysVideoComponent2)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: NysVideoComponent2,
    selectors: [["nys-video"]],
    inputs: {
      autoplay: "autoplay",
      disabled: "disabled",
      id: "id",
      loading: "loading",
      size: "size",
      starttime: "starttime",
      thumbnail: "thumbnail",
      titleText: "titleText",
      videourl: "videourl"
    },
    outputs: {
      "nys-video-play": "nys-video-play"
    },
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function NysVideoComponent_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵprojection(0);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
NysVideoComponent = __decorate([ProxyCmp({
  inputs: ["autoplay", "disabled", "id", "loading", "size", "starttime", "thumbnail", "titleText", "videourl"]
})], NysVideoComponent);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NysVideoComponent, [{
    type: Component,
    args: [{
      selector: "nys-video",
      template: "<ng-content></ng-content>",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: ["autoplay", "disabled", "id", "loading", "size", "starttime", "thumbnail", "titleText", "videourl"],
      outputs: ["nys-video-play"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: ElementRef
  }, {
    type: NgZone
  }], null);
})();
var NYSDS_COMPONENTS = [NysAccordionComponent, NysAccordionItemComponent, NysAlertComponent, NysAvatarComponent, NysBacktotopComponent, NysBadgeComponent, NysBreadcrumbsComponent, NysButtonComponent, NysCardComponent, NysCheckboxComponent, NysCheckboxgroupComponent, NysComboboxComponent, NysDatepickerComponent, NysDividerComponent, NysDropdownMenuComponent, NysDropdownMenuItemComponent, NysErrorMessageComponent, NysFileinputComponent, NysFileItemComponent, NysGlobalFooterComponent, NysGlobalHeaderComponent, NysIconComponent, NysIconlistComponent, NysIconlistitemComponent, NysLabelComponent, NysModalComponent, NysOptionComponent, NysPaginationComponent, NysProcesslistComponent, NysProcesslistitemComponent, NysRadiobuttonComponent, NysRadiogroupComponent, NysSelectComponent, NysSkipnavComponent, NysStepComponent, NysStepperComponent, NysTabComponent, NysTabgroupComponent, NysTableComponent, NysTabpanelComponent, NysTextareaComponent, NysTextinputComponent, NysToggleComponent, NysTooltipComponent, NysUnavFooterComponent, NysUnavHeaderComponent, NysVerticalnavComponent, NysVerticalnavGroupComponent, NysVideoComponent];
export {
  NYSDS_COMPONENTS,
  NysAccordionComponent,
  NysAccordionItemComponent,
  NysAlertComponent,
  NysAvatarComponent,
  NysBacktotopComponent,
  NysBadgeComponent,
  NysBreadcrumbsComponent,
  NysButtonComponent,
  NysCardComponent,
  NysCheckboxComponent,
  NysCheckboxgroupComponent,
  NysComboboxComponent,
  NysDatepickerComponent,
  NysDividerComponent,
  NysDropdownMenuComponent,
  NysDropdownMenuItemComponent,
  NysErrorMessageComponent,
  NysFileItemComponent,
  NysFileinputComponent,
  NysGlobalFooterComponent,
  NysGlobalHeaderComponent,
  NysIconComponent,
  NysIconlistComponent,
  NysIconlistitemComponent,
  NysLabelComponent,
  NysModalComponent,
  NysOptionComponent,
  NysPaginationComponent,
  NysProcesslistComponent,
  NysProcesslistitemComponent,
  NysRadiobuttonComponent,
  NysRadiogroupComponent,
  NysSelectComponent,
  NysSkipnavComponent,
  NysStepComponent,
  NysStepperComponent,
  NysTabComponent,
  NysTabgroupComponent,
  NysTableComponent,
  NysTabpanelComponent,
  NysTextareaComponent,
  NysTextinputComponent,
  NysToggleComponent,
  NysTooltipComponent,
  NysUnavFooterComponent,
  NysUnavHeaderComponent,
  NysVerticalnavComponent,
  NysVerticalnavGroupComponent,
  NysVideoComponent,
  ProxyCmp,
  proxyInputs,
  proxyOutputs
};
//# sourceMappingURL=@nysds_angular.js.map
