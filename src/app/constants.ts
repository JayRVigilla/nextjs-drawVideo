export const BROWSER_AGENTS = {
  EdgeBlink: "MSIE Blink",
  Firefox: "Firefox",
  Safari: "Safari",
  Chrome: "Chrome",
  OperaBlink: "OperaBlink",
  OperaPresto: "OperaPresto",
};

// Warning: using userAgent string is not reliable.
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
export function isWebKit(userAgentStr: string) {
  // Chrome for some reason has webkit in its userAgent string we we test for both WebKit and make sure Chrome isn't in the string either
  return /WebKit/.test(userAgentStr) && !/Chrome/.test(userAgentStr);
}

export const isChrome = (userAgent: string) => {
  return /Chrome/.test(userAgent) && !/Chromium/.test(userAgent);
};

export const isOperaBlink = (userAgent: string) => {
  return /OPR/.test(userAgent);
};

export const isOperaPresto = (userAgent: string) => {
  return /Opera/.test(userAgent);
};

export const isSafari = (userAgent: string) => {
  return isWebKit(userAgent) && /Safari/.test(userAgent);
};

export const isSeamonkey = (userAgent: string) => {
  return /Seamonkey/.test(userAgent);
};

export const isFirefox = (userAgent: string) => {
  return /Firefox/.test(userAgent) && !isSeamonkey(userAgent);
};

/**
 * The latest Edge browser makes use of Chrome internally, see more here:
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent#rendering_engine
 */
export const isEdgeBlink = (userAgent: string) => {
  return /Chrome/.test(userAgent);
};

/**
 * Looks for the browser's name inside the text of the
 * userAgent (which contains the complete browser's client name)
 * All these conditions came from this official table for browsers detection:
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent#browser_name
 */
export const getBrowserName = () => {
  const userAgent = window.navigator.userAgent;
  switch (true) {
    case isSafari(userAgent):
      return BROWSER_AGENTS.Safari;
    case isFirefox(userAgent):
      return BROWSER_AGENTS.Firefox;
    case isChrome(userAgent):
      return BROWSER_AGENTS.Chrome;
    case isOperaBlink(userAgent):
      return BROWSER_AGENTS.OperaBlink;
    case isOperaPresto(userAgent):
      return BROWSER_AGENTS.OperaPresto;
    case isEdgeBlink(userAgent):
      return BROWSER_AGENTS.EdgeBlink;
    default:
      return BROWSER_AGENTS.Chrome;
  }
};