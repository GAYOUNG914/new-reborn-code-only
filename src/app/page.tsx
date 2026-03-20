// import "./styles/contents/main.scss";
import MainContainer from "./main/components/MainContainer";
// import {
//   RootLayoutClientWrapper,
// } from "@/components/Layout";
import { headers } from "next/headers";
export default async function Home() {
  // const isMobile = await getIsMobile();
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto");
  const uaString = headersList.get("user-agent");
  const uaParserUrl = `${protocol}://${host}/api/v1/ua-parse`;

  let uaParserData: UAParser.IResult | null = null;
  try {
    const uaParserResponse = await fetch(uaParserUrl, {
      method: "POST",
      body: JSON.stringify({ ua: uaString }),
    });
    if (uaParserResponse.ok) {
      uaParserData = await uaParserResponse.json();
    }
  } catch (error) {
    console.error("[SERVER] ", new Date().toISOString(), " - ua-parse api error", error);
  }
  // const isMobile = uaParserData.device.type === "mobile";
  return (
    // <>test</>
    // <RootLayoutClientWrapper>
      <MainContainer />
    // </RootLayoutClientWrapper>
  );
}
