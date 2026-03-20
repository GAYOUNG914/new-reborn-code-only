"use client";

import "../styles/GlobalStoryContainer.scss";
import SectionKv from './SectionKv';
import SectionInsight from './SectionInsight';
import SectionLibrary from './SectionLibrary';
import SectionToon from './SectionToon';
import SectionCTA from './SectionCTA';
export default function GlobalStoryContainer() {

  return (
      <div className="global-story">
        <SectionKv />
        <SectionInsight />
        <SectionLibrary />
        <SectionToon />
      </div>
  );
}