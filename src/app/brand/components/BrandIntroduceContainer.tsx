"use client";

import "../styles/BrandIntroduceContainer.scss";
import SectionKv from './SectionKv';
import SectionOverview from "./SectionOverview";
import SectionCore from "./SectionCore";
import SectionHistory from "./SectionHistory";
import SectionLogotype from "./SectionLogotype";
import SectionIdentity from "./SectionIdentity";


export default function BrandIntroduceContainer() {

  return (
      <div className="brand-introduce">
        <SectionKv />
        <SectionOverview />
        <SectionCore />
        <SectionHistory />
        <SectionIdentity />
        <SectionLogotype />
      </div>
  );
}