/**
 * Consumer type fixture. Compiled by `npm run test:consumer` against the
 * built package (dist/), the way an installing project sees it.
 *
 * Asserts:
 * - an unknown prop is a type error
 * - `onNysInput` receives `NysTextinputInputEvent` (typed detail)
 * - `ref` resolves to the element instance
 * - subpath imports resolve with the same types as the barrel
 */
import * as React from "react";
import {
  NysTextinput,
  NysCheckboxgroup,
  useNysField,
  type NysTextinputProps,
  type NysTextinputElement,
} from "@nysds/react";
import { NysTextinput as NysTextinputFromSubpath } from "@nysds/react/textinput";
import type {
  NysTextinputInputEvent,
  NysTextinputChangeEvent,
} from "@nysds/nys-textinput";
import type { NysCheckboxgroupChangeEvent } from "@nysds/nys-checkbox";

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;
type Expect<T extends true> = T;

export function Fixture() {
  const ref = React.useRef<NysTextinputElement>(null);
  const wrongRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <NysTextinput
        ref={ref}
        label="Name"
        value="x"
        onNysInput={(e) => {
          type _assertInput = Expect<Equal<typeof e, NysTextinputInputEvent>>;
          const value: string = e.detail.value;
          void value;
        }}
        onNysChange={(e) => {
          type _assertChange = Expect<Equal<typeof e, NysTextinputChangeEvent>>;
          void e;
        }}
      />

      {/* @ts-expect-error an unknown prop is a type error */}
      <NysTextinput label="Bad" notAProp="nope" />

      {/* @ts-expect-error ref must resolve to the element instance */}
      <NysTextinput label="Bad ref" ref={wrongRef} />

      <NysTextinputFromSubpath label="Subpath import" />

      <NysCheckboxgroup
        label="Group"
        value={["a"]}
        onNysChange={(e) => {
          type _assertGroup = Expect<
            Equal<typeof e, NysCheckboxgroupChangeEvent>
          >;
          const values: string[] = e.detail.value;
          void values;
        }}
      />
    </>
  );
}

// Props derive from the element class: `value` is a string.
type _assertProps = Expect<
  Equal<NonNullable<NysTextinputProps["value"]>, string>
>;

// The hook returns a spreadable prop bag per form kind.
const field = { value: "x", onChange: () => {}, onBlur: () => {} };
export const valueBag = useNysField(field);
export const checkedBag = useNysField(field, "checked");
export const filesBag = useNysField(field, "files");
