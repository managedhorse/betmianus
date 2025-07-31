addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    const url       = new URL(request.url);
    const hostname  = url.hostname;                     // e.g. x9.fun, www.x9.fun, 123.x9.fun
    const originRes = await fetch(request);
  
    // Only transform HTML
    const cType = originRes.headers.get("content-type") || "";
    if (!cType.includes("text/html")) return originRes;
  
    const actualUrl = `${url.origin}${url.pathname}${url.search}`;
    let   html      = await originRes.text();
  
    // 1/ constants
    const CANONICAL_TAG = `<link rel="canonical" href="https://x9.fun" />`;
  
    const GTM_HEAD = `<!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-58ZHVC9H');</script>
  <!-- End Google Tag Manager -->`;
  
    const GTM_BODY = `<!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-58ZHVC9H"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->`;
  
    // 2/ META blocks
    const MAIN_META = `
  <meta name="google-site-verification" content="8O6nsm7XGv-G4tffP1jkB8pw-hMaXQW1lPBH5i9qzSo" />
  
  <title>Sports Betting Affiliate Network – X9.fun | Earn up to 78 % Rev-Share</title>
  <meta name="description"
        content="Sports & casino affiliate programme — Join X9.fun, promote high-converting crypto-betting brands and earn up to 78 % revenue share backed by a verified 50 M USDT prize pool." />
  <link rel="icon" href="https://cdn-img.w0zuv.live/image/2025-05-28/x9fun.png" />
  
  <!-- Open Graph -->
  <meta property="og:type"        content="website" />
  <meta property="og:title"       content="Sports Betting Affiliate Network – X9.fun | Earn up to 78 % Rev-Share" />
  <meta property="og:description" content="Sports & casino affiliate programme — Join X9.fun, promote high-converting crypto-betting brands and earn up to 78 % revenue share backed by a verified 50 M USDT prize pool." />
  <meta property="og:url"         content="https://x9.fun" />
  <meta property="og:image"       content="https://cdn-img.w0zuv.live/image/2025-05-28/x9fun.png" />
  
  <!-- Twitter -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="Sports Betting Affiliate Network – X9.fun | Earn up to 78 % Rev-Share" />
  <meta name="twitter:description" content="Sports & casino affiliate programme — Join X9.fun, promote high-converting crypto-betting brands and earn up to 78 % revenue share backed by a verified 50 M USDT prize pool." />
  <meta name="twitter:image"       content="https://cdn-img.w0zuv.live/image/2025-05-28/x9fun.png" />
  `;
  
    // sub-domains want actualUrl in og:url, but treat www.x9.fun as main
    const SUB_META = (subHost, actualUrl) => `
  <title>${subHost} | X9 Sports & Casino Affiliate Network — Earn up to 78 % Rev-Share</title>
  <meta name="robots" content="noindex, nofollow" />
  <meta name="description"
        content="Partner with X9.fun, the premier sports & casino affiliate platform. Promote high-converting crypto-betting brands and earn up to 78 % revenue share backed by a verified 50 M USDT prize pool." />
  
  <!-- Open Graph -->
  <meta property="og:type"        content="website" />
  <meta property="og:title"       content="${subHost} | X9 Sports & Casino Affiliate Network" />
  <meta property="og:description" content="Join X9.fun and unlock up to 78 % rev-share promoting top crypto sports & casino offers." />
  <meta property="og:url"         content="${actualUrl}" />
  <meta property="og:image"       content="https://cdn-img.w0zuv.live/image/2025-05-28/x9funsubdomains.png" />
  
  <!-- Twitter -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${subHost} | X9 Sports & Casino Affiliate Network" />
  <meta name="twitter:description" content="Earn up to 78 % rev-share with X9.fun’s crypto sports & casino affiliate programme. 50 M USDT prize pool verified on-chain." />
  <meta name="twitter:image"       content="https://cdn-img.w0zuv.live/image/2025-05-28/x9funsubdomains.png" />
  `;
  
    // 3/ pick which one to inject, treating 'www.x9.fun' as main
    const isMain = hostname === "x9.fun" || hostname === "www.x9.fun";
    const META   = isMain
      ? MAIN_META
      : SUB_META(hostname, actualUrl);
  
    const HEAD_INJECTION = `\n${GTM_HEAD}\n${CANONICAL_TAG}\n${META}\n`;
  
    // 4/ inject into <head> and <body>
    html = html.replace(/<head([^>]*)>/i,  m => `${m}${HEAD_INJECTION}`);
    html = html.replace(/<body([^>]*)>/i, `<body$1>\n${GTM_BODY}\n`);
  
    // 5/ return
    const headers = new Headers(originRes.headers);
    headers.delete("content-length");
    return new Response(html, {
      status:     originRes.status,
      statusText: originRes.statusText,
      headers
    });
  }