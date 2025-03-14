import { SubnavLink } from "@/components/modules/navigation/subnav/Subnav";
import { NavSegment } from "../data/types";

export const toSubnavLink = (segment: NavSegment): SubnavLink => ({
  title: segment.label,
  slug: segment.slug,
  link_to: segment.docId
    ? `/${segment.baseSegment}/${segment.slug}/${segment.docId}`
    : `/${segment.baseSegment}/${segment.slug}`,
  disabled: segment.disabled,
});
