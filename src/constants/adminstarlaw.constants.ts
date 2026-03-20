export const API_HOST = "https://adminstarlaw.com";
// export const API_HOST = "http://192.168.100.64:4000";
export const KAKAO_MAIL_ID_LIST_ROUTE = "/api/send_kakao.php";
export const TOKEN_VERIFY_ROUTE = "/api/token";
export const CONSULT_REQUEST_ROUTE = "/api/write_online.php";
export const CONNECT_LOG_ACT_ROUTE = "/prod/connect-log/act";

export const CONSULT_HOST = "https://adminstarlaw.star-workflow.com";
// export const CONSULT_HOST = "http://192.168.100.64:4000";
// export const CONSULT_KAKAO = "/prod/api/automail";
export const CONSULT_KAKAO = "/prod/api/nhn-kakao-send";
export const CONSULT_KAKAO_DIRECT = "/prod/api/nhn-kakao-direct";

export const CONSULT_WORKOUT_API_HOST = "https://contact-workout-api.star-law.com";
// export const CONSULT_DASI_API_HOST = "http://192.168.100.64:4000";
export const CONSULT_WORKOUT_API_ROUTE = "/consult/create";

// window.pageConstants.REQUEST_JS_TIME 에서 사용됨
export class RequestJsDateSets {
  public REQUEST_JS_DATE;
  public REQUEST_JS_TIME;
  public REQUEST_TIME;
  public REQUEST_TIME_BASE64;
  constructor() {
    this.REQUEST_JS_DATE = new Date();
    this.REQUEST_JS_TIME = this.REQUEST_JS_DATE.getTime();
    this.REQUEST_TIME = ~~(this.REQUEST_JS_TIME / 1000);
    this.REQUEST_TIME_BASE64 = Buffer.from(String(this.REQUEST_TIME)).toString(
      "base64",
    );
  }
}

export const CALLBACK_NUMBER = "0532180626";
export const MAILLINK_ID = "n0162326";
export const SELF_TEST_CS_WORKOUT_MAIL_CODE = "AU-7429291";
export const SELF_TEST_CS_DRINK_MAIL_CODE = "AU-6322453";

export const CONSULT_REQUEST_HOST_SALT = {
  "localhost:8080": "3224003df3e11d81",
  "localhost:3000": "3224003df3e11d81",
  "test.da-si.com": "3224003df3e11d81",
  "da-si.com": "3224003df3e11d81",
  "place.da-si.com": "3224003df3e11d81",
  "star-law.com": "523e1893a50e5040",
  "star-criminal.com": "8261ee2ebdd6d9b4",
  "www.star-law.com": "369091bb35698af7",
  "star-divorce.com": "64f4aee57b5851c1",
  "star-realproperty.com": "41112add0650966e",
  "star-fairtrading.com": "f510e50202c22d49",
  "star-workout.com": "6b7041412ac17bf3",
  "star-bankruptcy.com": "e9c01284335b5c95",
  "star-driving.com": "056576f33cb16fed",
  "star-labor.com": "77d64d23effbf4e3",
  "star-intelligence.com": "bb2288b511e78444",
  "starlaw-corporation.com": "dc68fdee6b56423d",
  "star-incorporation.com": "5a8a9a45641f7777",
  "www.star-criminal.com": "1e05028638d07ea0",
  "www.star-divorce.com": "727b1205ccac7692",
  "www.star-realproperty.com": "52541f46679f2ec0",
  "www.star-fairtrading.com": "f1541491cb787365",
  "www.star-workout.com": "4c3851ce0b000667",
  "www.star-bankruptcy.com": "28adff30ed62054f",
  "www.star-driving.com": "5ff8a6d76ab10857",
  "www.star-labor.com": "6f01069a38afc166",
  "www.star-intelligence.com": "3c8d8a237ddb2ab0",
  "www.starlaw-corporation.com": "c596a5a2fd93ac6a",
  "www.star-incorporation.com": "107c551a5b88b435",
  "dev.star-law.com": "320c551a5b12b435",
  "dev.star-workout.com": "X2NNgyt1XfcpdUfU",
  "dev.star-divorce.com": "vled6zNXNAPE0+2h",
  "contents.star-workout.com": "ae93df90ee99acba",
  "contents-test.star-workout.com": "60176b4310ab294b",
  "service.star-workout.com": "4853f04113310700",
  "service-test.star-workout.com": "7bdd6f767fe7998f",
  "main.star-law.com": "5b6d3e0082abff98",
  "main.star-workout.com": "9ad4419fe57d9cbf",
  "place.star-workout.com": "6b7041412ac17bf3",
  "test.star-workout.com": "6b7041412ac17bf3",
};

export const REQUEST_SRC_TYPE_SETS = {
  service: "서비스상세상담",
  bottom: "하단상담신청",
  workout_self_test: "자격진단 상담신청",
  main_case: "사건 팝업 문의",
  container: "메인 상담 신청",
  online: "무료상담신청",
  self_test: "자격진단 상담신청",
};

export interface AdminstarlawConnectLogDatasInterface {
  REQUEST_URI: string;
  HTTP_REFERER?: string | null;
  REQUEST_URL_WITH_UTM?: string | null;
  service_id: string;
}
