import { KitchenSinkClient } from "../../components/kitchen-sink-client";

/**
 * A server component page: the NYSDS wrappers are client components, so
 * this page proves that a server component can render them through a
 * client boundary (`KitchenSinkClient` carries `"use client"`).
 */
export default function KitchenSinkPage() {
  return <KitchenSinkClient />;
}
