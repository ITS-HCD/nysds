import { test, expect } from "@playwright/test";
// @ts-expect-error Plain-JS workspace package without type declarations.
import { defineKitchenSinkTests } from "@nysds/example-shared-tests/kitchen-sink";
// @ts-expect-error Plain-JS workspace package without type declarations.
import { defineFormsTests } from "@nysds/example-shared-tests/forms";
// @ts-expect-error Plain-JS workspace package without type declarations.
import { defineEventsTests } from "@nysds/example-shared-tests/events";

defineKitchenSinkTests(test, expect, "/kitchen-sink");
defineFormsTests(test, expect, "/forms");
defineEventsTests(test, expect, "/events");
