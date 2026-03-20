// import "./styles/globals.scss";
import "aos/dist/aos.css";
import { RootLayoutClientWrapper } from "@/components/Layout";
import { CookiesProvider } from "next-client-cookies/server";
// import { RUM } from "@/components/DatadogRum";
import { Metadata } from "next";
// import { GoogleTagManager } from "@next/third-parties/google";
import GlobalConfigProvider, {
  GlobalConfigState,
} from "@/context/ConfigContext";
import {
  CONSULT_REQUEST_HOST_SALT,
  RequestJsDateSets,
} from "@/constants/adminstarlaw.constants";
import { cookies, headers } from "next/headers";
import md5 from "md5";
import TrackingProvider from "@/components/providers/TrackingProvider";
import { FpjsProvider } from "@fingerprintjs/fingerprintjs-pro-react";
import { FINGERPRINTJS_API_KEY } from "@/constants/api.constants";
import BaseAnalyticsProvider from "@/components/providers/BaseAnalyticsProvider";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import Script from "next/script";

import './styles/globals.scss'
import 'aos/dist/aos.css'

export const metadata: Metadata = {
  metadataBase: new URL("https://star-workout.com/"),
  title: "리본회생",
  description:
    "작성필요",
  generator: "리본회생",
  applicationName: "리본회생",
  referrer: "origin-when-cross-origin",
  keywords: ["리본회생"],
  authors: [{ name: "리본회생", url: "https://star-workout.com" }],
  creator: "리본회생",
  publisher: "리본회생",
  // viewport: {
  //   width: "device-width",
  //   initialScale: 1,
  //   maximumScale: 1,
  //   userScalable: false,
  // },
  icons: {
    icon: [
      { url: '/favicon.svg', sizes: '48x48', type: 'image/x-icon' },
      { url: '/favicon.png', sizes: '100x100', type: 'image/x-icon' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/x-icon' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    images:
      "https://imagedelivery.net/e0-3jqSze_fGgLHLQnpXsA/84f380f5-6c0f-447a-aaf6-4a82b4226300/case",
  },
  twitter: {
    images:
      "https://imagedelivery.net/e0-3jqSze_fGgLHLQnpXsA/84f380f5-6c0f-447a-aaf6-4a82b4226300/case",
  },
};

export const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "리본회생",
  url: "https://star-workout.com/",
  sameAs: [
    "https://blog.naver.com/star_law",
    "https://www.youtube.com/channel/UCk7gBQeJmBt6VlA_W0NpkZw/featured",
    "https://www.instagram.com/starlawfirm_official/",
  ],
};

const FpjsProviderComponent = ({ children }: { children: React.ReactNode }) => {
  const isDev = process.env.NODE_ENV === "development";
  if (isDev) {
    return children;
  }
  return (
    <FpjsProvider
      loadOptions={{
        apiKey: FINGERPRINTJS_API_KEY,
        region: "ap",
        endpoint:
          process.env.NODE_ENV === "development"
            ? undefined
            : "https://metrics.star-workout.com",
      }}
    >
      {children}
    </FpjsProvider>
  );
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const NowSets = new RequestJsDateSets();
  const headersList = await headers();
  const cookieStore = await cookies();
  const rawHost = headersList.get("host");
  const serviceIdCookie = cookieStore.get("STAR_SERVICE_ID");
  // const pathname = headersList.get('x-url-path');

  const validHosts = [
    "localhost:3000",
    "test.star-workout.com",
    "star-workout.com",
    "place.star-workout.com",
  ] as const;
  // const acceptMainDomainPath = ["brandstory", "stories", "", "brandvalue"]

  const hostname: (typeof validHosts)[number] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rawHost && validHosts.includes(rawHost as any)
      ? (rawHost as (typeof validHosts)[number])
      : "test.star-workout.com";

  const requestIp =
    headersList.get("x-forwarded-for") &&
      headersList.get("x-forwarded-for") === "::1"
      ? "210.217.94.225"
      : headersList.get("x-forwarded-for")
        ? headersList.get("x-forwarded-for")
        : "-.-.-.-";

  const configProps: GlobalConfigState = {
    setRandString: NowSets.REQUEST_TIME_BASE64,
    requestDate: NowSets.REQUEST_JS_DATE,
    token: md5(
      `${hostname}+${hostname in CONSULT_REQUEST_HOST_SALT
        ? CONSULT_REQUEST_HOST_SALT[hostname]
        : "test.star-workout.com"
      }+${NowSets.REQUEST_TIME}+${requestIp}`,
    ),
    serviceId: serviceIdCookie ? String(serviceIdCookie.value) : "",
  };

  const isDev = process.env.NODE_ENV === "development";
  const isTest = hostname === "test.star-workout.com";
  const xff = headersList.get("x-forwarded-for");
  const checkIp = xff ? xff.split(",")[0].trim() : "-.-.-.-";

  const isLocal = checkIp === "210.217.94.225" || checkIp === "121.181.62.21";

  return (
    <FpjsProviderComponent>
      <html lang="ko">
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          ></script>

          {/* star-workout.com */}
          <link rel="preconnect" href="https://metrics.star-workout.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://metrics.star-workout.com" />

          {/* fpnpmcdn.net */}
          <link rel="preconnect" href="https://fpnpmcdn.net" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://fpnpmcdn.net" />

          {/* cloudfront.net */}
          <link rel="preconnect" href="https://d1as53h2pztvcj.cloudfront.net" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://d1as53h2pztvcj.cloudfront.net" />
        </head>

        <body suppressHydrationWarning>
          <GlobalConfigProvider props={configProps}>
            <CookiesProvider>
              {/* <RUM> */}
              {/* 이혼공감솔루션 다시 GTM - GTM-TLGNNB9Q. 2025-04-22. lawyer0626jin@gmail.com. 최영웅 */}
              {/* <GoogleTagManager gtmId="GTM-TLGNNB9Q" /> */}
              {!(isDev || isTest || isLocal) ? <TrackingProvider /> : null}
              <RootLayoutClientWrapper defaultColor={"white"}>
                <Suspense fallback={null}>
                  <BaseAnalyticsProvider />
                </Suspense>
                {children}
              </RootLayoutClientWrapper>
              {/* </RUM> */}
              {/* {children} */}
            </CookiesProvider>
          </GlobalConfigProvider>
          {/* <Script src="https://kit.fontawesome.com/6f0e311579.js" crossOrigin="anonymous" /> */}
        </body>
      </html>
    </FpjsProviderComponent>
  );
}
