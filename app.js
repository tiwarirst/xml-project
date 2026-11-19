/* ══════════════════════════════════════════════════════════════════
   NewsXML — app.js
   Core Logic: XML Parsing · XSLT Transformation · XPath · Search

   Technologies Demonstrated:
   ✅ XML       — Structured news data in 4 separate XML feeds
   ✅ XSLT      — Transforms XML articles into HTML cards (live in browser)
   ✅ XPath     — Extracts metadata via DOM queries (XPath equivalent)
   ✅ DOMParser — Parses XML/XSLT strings into Document objects
   ✅ XSLTProcessor — Browser's built-in XSLT 1.0 engine
   ══════════════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════════════════════════════
   XSLT STYLESHEET
   This XSLT template transforms each <article> element in the XML
   feed into a styled HTML card using xsl:for-each & xsl:value-of
══════════════════════════════════════════════════════════════════ */
const XSLT_TEMPLATE = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" indent="yes" encoding="UTF-8"/>

  <!-- ═══ Root Template ═══ -->
  <xsl:template match="/">
    <xsl:apply-templates select="newsfeed/articles/article"/>
  </xsl:template>

  <!-- ═══ Article Template: One card per article ═══ -->
  <xsl:template match="article">
    <div class="news-card" data-category="{category}" data-id="{@id}">

      <!-- XML badge (shown on hover) -->
      <span class="xml-badge">XML</span>

      <!-- Top row: Category badge + read time -->
      <div class="card-top">
        <span class="category-badge">
          <xsl:value-of select="categoryIcon"/>
          <xsl:text> </xsl:text>
          <xsl:value-of select="category"/>
        </span>
        <span class="read-time">
          <xsl:text>⏱ </xsl:text>
          <xsl:value-of select="readTime"/>
        </span>
      </div>

      <!-- Large emoji icon -->
      <div class="card-emoji-area">
        <xsl:value-of select="emoji"/>
      </div>

      <!-- Article title — extracted via XPath: article/title -->
      <h3 class="card-title">
        <xsl:value-of select="title"/>
      </h3>

      <!-- Article description — extracted via XPath: article/description -->
      <p class="card-desc">
        <xsl:value-of select="description"/>
      </p>

      <!-- Tags — iterated via xsl:for-each over article/tags/tag -->
      <div class="card-tags">
        <xsl:for-each select="tags/tag">
          <span class="tag">
            <xsl:text>#</xsl:text>
            <xsl:value-of select="."/>
          </span>
        </xsl:for-each>
      </div>

      <!-- Footer: Author, Source, Date -->
      <div class="card-footer-area">
        <div class="card-meta-left">
          <span class="card-author">
            <xsl:text>✍️ </xsl:text>
            <xsl:value-of select="author"/>
          </span>
          <span class="card-source">
            <xsl:text>📰 </xsl:text>
            <xsl:value-of select="source"/>
          </span>
        </div>
        <span class="card-date">
          <xsl:text>📅 </xsl:text>
          <xsl:value-of select="pubDate"/>
        </span>
      </div>

    </div>
  </xsl:template>

</xsl:stylesheet>`;


/* ══════════════════════════════════════════════════════════════════
   XML FEED 1 — TECHNOLOGY
   XPath root: /newsfeed/articles/article
══════════════════════════════════════════════════════════════════ */
const XML_TECH = `<?xml version="1.0" encoding="UTF-8"?>
<newsfeed>
  <meta>
    <feedTitle>Technology News Feed</feedTitle>
    <category>Technology</category>
    <source>NewsXML Aggregator v1.0</source>
    <lastUpdated>2025-11-18</lastUpdated>
    <totalArticles>5</totalArticles>
  </meta>
  <articles>
    <article id="T001">
      <title>Google DeepMind's Gemini 2.0 Breaks All Language Benchmarks</title>
      <description>DeepMind's Gemini 2.0 has surpassed every existing AI language model across MMLU, HumanEval, and reasoning benchmarks. The model delivers unprecedented multilingual capability and reduces hallucinations by 60% over its predecessor, marking a new era in generative AI.</description>
      <author>Priya Sharma</author>
      <pubDate>Nov 18, 2025</pubDate>
      <source>TechCrunch India</source>
      <category>Technology</category>
      <categoryIcon>💻</categoryIcon>
      <emoji>🤖</emoji>
      <readTime>4 min read</readTime>
      <tags><tag>AI</tag><tag>DeepMind</tag><tag>LLM</tag></tags>
    </article>
    <article id="T002">
      <title>India Launches National Quantum Computing Mission — Rs 6,003 Cr</title>
      <description>The Government of India officially launched the National Quantum Mission with a budget of Rs 6,003 crore. The mission targets 50–1000 qubit quantum computers within 8 years, positioning India among the world's top five quantum-capable nations alongside the US, China, and EU.</description>
      <author>Rahul Verma</author>
      <pubDate>Nov 17, 2025</pubDate>
      <source>NDTV Tech</source>
      <category>Technology</category>
      <categoryIcon>💻</categoryIcon>
      <emoji>⚛️</emoji>
      <readTime>3 min read</readTime>
      <tags><tag>Quantum</tag><tag>India</tag><tag>MissionTech</tag></tags>
    </article>
    <article id="T003">
      <title>Cybersecurity Threats Surge 45% in 2025 — CERT-In Annual Report</title>
      <description>India's CERT-In reports a 45% rise in cyber incidents in 2025. Ransomware attacks targeting healthcare and banking sectors doubled, while AI-powered phishing became the most common attack vector. Organizations are urged to adopt zero-trust architecture immediately.</description>
      <author>Ananya Singh</author>
      <pubDate>Nov 16, 2025</pubDate>
      <source>Indian Express Tech</source>
      <category>Technology</category>
      <categoryIcon>💻</categoryIcon>
      <emoji>🔐</emoji>
      <readTime>5 min read</readTime>
      <tags><tag>Cybersecurity</tag><tag>CERT-In</tag><tag>Ransomware</tag></tags>
    </article>
    <article id="T004">
      <title>Reliance Jio Launches 6G Pilot Network in Mumbai and Delhi</title>
      <description>Reliance Jio began pilot testing of 6G technology in select Mumbai and Delhi zones, promising speeds up to 1 Tbps via terahertz frequency bands. The commercial rollout is targeted for 2028, placing India ahead of the global 6G standardization timeline set by ITU.</description>
      <author>Vikram Nair</author>
      <pubDate>Nov 15, 2025</pubDate>
      <source>Economic Times Tech</source>
      <category>Technology</category>
      <categoryIcon>💻</categoryIcon>
      <emoji>📡</emoji>
      <readTime>4 min read</readTime>
      <tags><tag>6G</tag><tag>Jio</tag><tag>Telecom</tag></tags>
    </article>
    <article id="T005">
      <title>Open Source Models Outperform GPT-4 on Code Generation — IIT Study</title>
      <description>IIT Bombay researchers confirm that Llama 3.1 and Mistral-7B now surpass GPT-4 on code generation, debugging, and documentation tasks in a 10,000-sample benchmark study. The finding democratizes advanced AI for the global developer community at zero cost.</description>
      <author>Dr. Meena Patel</author>
      <pubDate>Nov 14, 2025</pubDate>
      <source>The Hindu Tech</source>
      <category>Technology</category>
      <categoryIcon>💻</categoryIcon>
      <emoji>👨‍💻</emoji>
      <readTime>6 min read</readTime>
      <tags><tag>OpenSource</tag><tag>LLaMA</tag><tag>Coding</tag></tags>
    </article>
  </articles>
</newsfeed>`;


/* ══════════════════════════════════════════════════════════════════
   XML FEED 2 — WORLD
══════════════════════════════════════════════════════════════════ */
const XML_WORLD = `<?xml version="1.0" encoding="UTF-8"?>
<newsfeed>
  <meta>
    <feedTitle>World News Feed</feedTitle>
    <category>World</category>
    <source>NewsXML Aggregator v1.0</source>
    <lastUpdated>2025-11-18</lastUpdated>
    <totalArticles>5</totalArticles>
  </meta>
  <articles>
    <article id="W001">
      <title>COP31 Climate Summit Achieves Historic 1.5°C Binding Commitment</title>
      <description>The 31st Conference of Parties concluded with all G20 nations signing a legally binding agreement to limit global warming to 1.5°C. The landmark deal includes a $100 billion annual climate fund for developing nations and a full coal power phase-out deadline of 2035.</description>
      <author>Sarah Mitchell</author>
      <pubDate>Nov 18, 2025</pubDate>
      <source>BBC World</source>
      <category>World</category>
      <categoryIcon>🌍</categoryIcon>
      <emoji>🌱</emoji>
      <readTime>5 min read</readTime>
      <tags><tag>Climate</tag><tag>COP31</tag><tag>G20</tag></tags>
    </article>
    <article id="W002">
      <title>NASA-ISRO Mars Mission Successfully Enters Martian Orbit</title>
      <description>The joint NASA-ISRO Mars mission MARS-2025 successfully achieved Martian orbit insertion after a 7-month journey. The spacecraft carries advanced ground-penetrating radar to map subsurface water reserves and spectrometers to analyze the Martian atmosphere at record resolution.</description>
      <author>James Rodriguez</author>
      <pubDate>Nov 17, 2025</pubDate>
      <source>Reuters Science</source>
      <category>World</category>
      <categoryIcon>🌍</categoryIcon>
      <emoji>🚀</emoji>
      <readTime>4 min read</readTime>
      <tags><tag>Mars</tag><tag>NASA</tag><tag>ISRO</tag></tags>
    </article>
    <article id="W003">
      <title>UN Adopts First Legally Binding Global AI Governance Treaty</title>
      <description>The UN General Assembly unanimously adopted the Global AI Governance Framework requiring all 193 member states to establish national AI safety boards, mandate algorithmic transparency, and permanently ban autonomous lethal weapons — the world's first binding international AI treaty.</description>
      <author>Emma Thompson</author>
      <pubDate>Nov 16, 2025</pubDate>
      <source>Al Jazeera</source>
      <category>World</category>
      <categoryIcon>🌍</categoryIcon>
      <emoji>🤝</emoji>
      <readTime>6 min read</readTime>
      <tags><tag>AI</tag><tag>UnitedNations</tag><tag>Governance</tag></tags>
    </article>
    <article id="W004">
      <title>Global Hunger Index 2025: 735 Million Face Acute Food Insecurity</title>
      <description>The 2025 Global Hunger Index reveals 735 million people face acute food insecurity, with Sub-Saharan Africa and South Asia most affected. Climate-related crop failures and ongoing conflicts are cited as the primary drivers, stalling a decade of hard-won food security progress.</description>
      <author>Fatima Al-Hassan</author>
      <pubDate>Nov 15, 2025</pubDate>
      <source>The Guardian</source>
      <category>World</category>
      <categoryIcon>🌍</categoryIcon>
      <emoji>🌾</emoji>
      <readTime>5 min read</readTime>
      <tags><tag>HungerIndex</tag><tag>FoodSecurity</tag><tag>Development</tag></tags>
    </article>
    <article id="W005">
      <title>BRICS+ Expands to 15 Members, Launches Common Digital Trade Currency</title>
      <description>The expanded BRICS+ bloc now represents 15 nations and 46% of global GDP. The bloc launched BRICS Pay, a common digital trade currency framework designed to reduce US dollar dependence in international commerce and enable seamless multilateral cross-border settlements.</description>
      <author>Chen Wei</author>
      <pubDate>Nov 14, 2025</pubDate>
      <source>Bloomberg</source>
      <category>World</category>
      <categoryIcon>🌍</categoryIcon>
      <emoji>💱</emoji>
      <readTime>4 min read</readTime>
      <tags><tag>BRICS</tag><tag>Economy</tag><tag>Currency</tag></tags>
    </article>
  </articles>
</newsfeed>`;


/* ══════════════════════════════════════════════════════════════════
   XML FEED 3 — SPORTS
══════════════════════════════════════════════════════════════════ */
const XML_SPORTS = `<?xml version="1.0" encoding="UTF-8"?>
<newsfeed>
  <meta>
    <feedTitle>Sports News Feed</feedTitle>
    <category>Sports</category>
    <source>NewsXML Aggregator v1.0</source>
    <lastUpdated>2025-11-18</lastUpdated>
    <totalArticles>5</totalArticles>
  </meta>
  <articles>
    <article id="S001">
      <title>India Wins ICC Cricket World Cup 2025 — Beats Australia by 6 Wickets</title>
      <description>Team India clinched the ICC ODI World Cup 2025 at Eden Gardens, Kolkata, defeating Australia by 6 wickets in a thrilling final. Rohit Sharma's breathtaking 134* and Jasprit Bumrah's match-winning 4/32 were the highlights before a sold-out crowd of 68,000.</description>
      <author>Harsha Bhogle</author>
      <pubDate>Nov 18, 2025</pubDate>
      <source>ESPNcricinfo</source>
      <category>Sports</category>
      <categoryIcon>⚽</categoryIcon>
      <emoji>🏆</emoji>
      <readTime>5 min read</readTime>
      <tags><tag>Cricket</tag><tag>WorldCup</tag><tag>TeamIndia</tag></tags>
    </article>
    <article id="S002">
      <title>Neeraj Chopra Shatters World Record with 92.5m Javelin in Zurich</title>
      <description>Olympic gold medalist Neeraj Chopra made history with a stunning 92.5m throw at the Zurich Diamond League, breaking the 20-year-old world record held by Jan Zelezny. This makes Neeraj the first Indian athlete ever to hold a world record in a track and field event.</description>
      <author>Atanu Das</author>
      <pubDate>Nov 17, 2025</pubDate>
      <source>TOI Sports</source>
      <category>Sports</category>
      <categoryIcon>⚽</categoryIcon>
      <emoji>🏅</emoji>
      <readTime>3 min read</readTime>
      <tags><tag>Athletics</tag><tag>NeerajChopra</tag><tag>WorldRecord</tag></tags>
    </article>
    <article id="S003">
      <title>Praggnanandhaa Becomes World Chess Champion at 20 — Beats Carlsen</title>
      <description>Indian chess grandmaster R. Praggnanandhaa defeated Magnus Carlsen in a dramatic 14-game match to become the youngest World Chess Champion in history at age 20. India now holds both the Men's and Women's World Chess Championship titles simultaneously — an unprecedented double.</description>
      <author>Viswanathan Anand</author>
      <pubDate>Nov 16, 2025</pubDate>
      <source>Chess.com India</source>
      <category>Sports</category>
      <categoryIcon>⚽</categoryIcon>
      <emoji>♟️</emoji>
      <readTime>4 min read</readTime>
      <tags><tag>Chess</tag><tag>Praggnanandhaa</tag><tag>India</tag></tags>
    </article>
    <article id="S004">
      <title>Mumbai Indians Defend IPL 2025 Title in Super Over Thriller</title>
      <description>Mumbai Indians captured their sixth IPL championship in a nerve-shredding Super Over final against Royal Challengers Bangalore at Wankhede Stadium. Hardik Pandya's all-round masterclass of 68 runs and 3 wickets earned him the IPL 2025 Most Valuable Player award.</description>
      <author>Sunil Gavaskar</author>
      <pubDate>Nov 15, 2025</pubDate>
      <source>BCCI Official</source>
      <category>Sports</category>
      <categoryIcon>⚽</categoryIcon>
      <emoji>🏏</emoji>
      <readTime>4 min read</readTime>
      <tags><tag>IPL</tag><tag>MumbaiIndians</tag><tag>Cricket</tag></tags>
    </article>
    <article id="S005">
      <title>FIFA Awards India Hosting Rights for 2027 U-20 World Cup</title>
      <description>FIFA officially awarded India the hosting rights for the 2027 U-20 Football World Cup. Six stadiums across Bengaluru, Mumbai, Delhi, Kolkata, Hyderabad, and Guwahati will host 52 matches, marking India's second FIFA youth World Cup after the hugely successful 2017 edition.</description>
      <author>Sunil Chhetri</author>
      <pubDate>Nov 14, 2025</pubDate>
      <source>AIFF Official</source>
      <category>Sports</category>
      <categoryIcon>⚽</categoryIcon>
      <emoji>⚽</emoji>
      <readTime>3 min read</readTime>
      <tags><tag>FIFA</tag><tag>Football</tag><tag>India</tag></tags>
    </article>
  </articles>
</newsfeed>`;


/* ══════════════════════════════════════════════════════════════════
   XML FEED 4 — INDIA
══════════════════════════════════════════════════════════════════ */
const XML_INDIA = `<?xml version="1.0" encoding="UTF-8"?>
<newsfeed>
  <meta>
    <feedTitle>India News Feed</feedTitle>
    <category>India</category>
    <source>NewsXML Aggregator v1.0</source>
    <lastUpdated>2025-11-18</lastUpdated>
    <totalArticles>5</totalArticles>
  </meta>
  <articles>
    <article id="I001">
      <title>India Becomes World's 3rd Largest Economy — GDP Surpasses Japan</title>
      <description>India's GDP has officially surpassed Japan's at $5.1 trillion, making India the world's third-largest economy. The IMF attributes this historic milestone to India's booming manufacturing sector, the rapidly expanding digital economy, and the demographic dividend fueling 7%+ growth year-on-year.</description>
      <author>Dr. Raghuram Rajan</author>
      <pubDate>Nov 18, 2025</pubDate>
      <source>RBI Publications</source>
      <category>India</category>
      <categoryIcon>🇮🇳</categoryIcon>
      <emoji>🇮🇳</emoji>
      <readTime>5 min read</readTime>
      <tags><tag>Economy</tag><tag>GDP</tag><tag>IMF</tag></tags>
    </article>
    <article id="I002">
      <title>NEP 2.0 Makes AI and Coding Mandatory from Class 6 Onwards</title>
      <description>The Union Ministry of Education released the National Education Policy 2.0, mandating Artificial Intelligence, Coding, and Robotics as core subjects from Class 6. The policy introduces a revised 5+3+3+4 academic structure with multilingual instruction and competency-based assessments replacing rote learning.</description>
      <author>Dharmendra Pradhan</author>
      <pubDate>Nov 17, 2025</pubDate>
      <source>Ministry of Education</source>
      <category>India</category>
      <categoryIcon>🇮🇳</categoryIcon>
      <emoji>📚</emoji>
      <readTime>6 min read</readTime>
      <tags><tag>Education</tag><tag>NEP</tag><tag>AI</tag></tags>
    </article>
    <article id="I003">
      <title>Vande Bharat Express Network Crosses 500 Routes Pan-India</title>
      <description>Indian Railways flagged off its 500th Vande Bharat Express route, connecting every state capital with high-speed semi-high-speed rail. The 350-strong fleet operates at 160 km/h and has reduced average inter-city travel time by 40%, with 2 million passengers using Vande Bharat monthly.</description>
      <author>Ashwini Vaishnaw</author>
      <pubDate>Nov 16, 2025</pubDate>
      <source>Indian Railways Official</source>
      <category>India</category>
      <categoryIcon>🇮🇳</categoryIcon>
      <emoji>🚄</emoji>
      <readTime>4 min read</readTime>
      <tags><tag>Railways</tag><tag>VandeBharat</tag><tag>Infrastructure</tag></tags>
    </article>
    <article id="I004">
      <title>India's Startup Ecosystem Hits 1.5 Lakh Startups — World No. 2</title>
      <description>India's startup ecosystem has crossed 1.5 lakh DPIIT-registered startups, cementing its position as the world's second-largest startup hub behind only the USA. The ecosystem boasts 112 unicorns valued at a combined $350 billion, with deep tech and climate tech startups dominating 2025 registrations.</description>
      <author>Piyush Goyal</author>
      <pubDate>Nov 15, 2025</pubDate>
      <source>DPIIT India</source>
      <category>India</category>
      <categoryIcon>🇮🇳</categoryIcon>
      <emoji>🦄</emoji>
      <readTime>5 min read</readTime>
      <tags><tag>Startup</tag><tag>Unicorn</tag><tag>Innovation</tag></tags>
    </article>
    <article id="I005">
      <title>Ayushman Bharat 2.0 Extends Free Healthcare to 70 Crore Citizens</title>
      <description>The Union Cabinet approved an expanded Ayushman Bharat PM-JAY covering 70 crore citizens with enhanced free healthcare up to Rs 10 lakh per family annually. Critically, Ayushman Bharat 2.0 covers mental health, dental, and vision care for the first time, closing major gaps in public health access.</description>
      <author>Dr. Mansukh Mandaviya</author>
      <pubDate>Nov 14, 2025</pubDate>
      <source>Health Ministry India</source>
      <category>India</category>
      <categoryIcon>🇮🇳</categoryIcon>
      <emoji>🏥</emoji>
      <readTime>4 min read</readTime>
      <tags><tag>Healthcare</tag><tag>AyushmanBharat</tag><tag>Government</tag></tags>
    </article>
  </articles>
</newsfeed>`;


/* ══════════════════════════════════════════════════════════════════
   ALL FEEDS REGISTRY
══════════════════════════════════════════════════════════════════ */
const FEEDS = [
  { name: 'Technology', xml: XML_TECH },
  { name: 'World',      xml: XML_WORLD },
  { name: 'Sports',     xml: XML_SPORTS },
  { name: 'India',      xml: XML_INDIA }
];


/* ══════════════════════════════════════════════════════════════════
   APPLICATION STATE
══════════════════════════════════════════════════════════════════ */
const parser    = new DOMParser();
let allCards    = [];
let currentCat  = 'all';
let currentQ    = '';
let xsltDoc     = null;    // Shared XSLT document (parsed once)


/* ══════════════════════════════════════════════════════════════════
   XML PARSER
══════════════════════════════════════════════════════════════════ */
/**
 * Parses an XML string into a Document object.
 * Returns null if there is a parse error.
 */
function parseXML(str) {
  const doc = parser.parseFromString(str, 'text/xml');
  if (doc.querySelector('parsererror')) {
    console.error('[NewsXML] XML parse error in:', str.substring(0, 100));
    return null;
  }
  return doc;
}


/* ══════════════════════════════════════════════════════════════════
   XSLT TRANSFORMER
══════════════════════════════════════════════════════════════════ */
/**
 * Applies the XSLT stylesheet to an XML document.
 * Uses the browser's built-in XSLTProcessor (XSLT 1.0).
 * Returns a DocumentFragment of transformed HTML nodes.
 */
function transformXML(xmlDoc) {
  const proc = new XSLTProcessor();
  proc.importStylesheet(xsltDoc);
  return proc.transformToFragment(xmlDoc, document);
}


/* ══════════════════════════════════════════════════════════════════
   XPATH-STYLE METADATA EXTRACTION
   (Uses querySelector as a readable XPath equivalent)
══════════════════════════════════════════════════════════════════ */
/**
 * Extracts feed metadata using DOM queries equivalent to XPath:
 *   /newsfeed/meta/feedTitle  →  querySelector('meta feedTitle')
 *   /newsfeed/meta/category   →  querySelector('meta category')
 */
function extractMeta(xmlDoc) {
  const q = sel => xmlDoc.querySelector(sel)?.textContent?.trim() || '—';
  return {
    title:    q('meta feedTitle'),
    category: q('meta category'),
    total:    q('meta totalArticles'),
    updated:  q('meta lastUpdated'),
    source:   q('meta source')
  };
}


/* ══════════════════════════════════════════════════════════════════
   FILTERING & SEARCH
══════════════════════════════════════════════════════════════════ */
function filterCards() {
  let visible = 0;

  allCards.forEach(card => {
    const cat    = card.getAttribute('data-category');
    const text   = card.textContent.toLowerCase();
    const matchC = currentCat === 'all' || cat === currentCat;
    const matchQ = currentQ === '' || text.includes(currentQ.toLowerCase());

    if (matchC && matchQ) {
      card.style.display = '';
      visible++;
    } else {
      card.style.display = 'none';
    }
  });

  document.getElementById('noResults').style.display  = visible === 0 ? 'flex' : 'none';
  document.getElementById('articleCount').textContent = `${visible} Articles`;
  return visible;
}

function updateTabCounts() {
  const categories = ['Technology', 'World', 'Sports', 'India'];
  document.getElementById('count-all').textContent = allCards.length;
  categories.forEach(cat => {
    const count = allCards.filter(c => c.getAttribute('data-category') === cat).length;
    const el    = document.getElementById(`count-${cat}`);
    if (el) el.textContent = count;
  });
}

/* Global so the inline onclick in HTML works */
window.clearSearch = function () {
  currentQ = '';
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResultsBar').style.display = 'none';
  document.getElementById('clearSearch').style.display = 'none';
  filterCards();
};


/* ══════════════════════════════════════════════════════════════════
   MODAL — View raw XML source
══════════════════════════════════════════════════════════════════ */
window.closeModal = function () {
  document.getElementById('modalOverlay').style.display = 'none';
};

function showXMLModal(feedName) {
  const feed = FEEDS.find(f => f.name === feedName);
  if (!feed) return;
  document.getElementById('modalTitle').textContent = `📄 XML Source — ${feedName} Feed`;
  document.getElementById('modalCode').textContent  = feed.xml.trim();
  document.getElementById('modalOverlay').style.display = 'flex';
}


/* ══════════════════════════════════════════════════════════════════
   MAIN INITIALISER
══════════════════════════════════════════════════════════════════ */
function initApp() {
  const grid = document.getElementById('newsGrid');
  grid.innerHTML = `
    <div class="loading" style="grid-column:1/-1">
      <div class="spinner">⚙️</div>
      <p>Parsing XML feeds &amp; applying XSLT transformation…</p>
    </div>`;

  /* Step 1 — Parse XSLT stylesheet (once, shared by all feeds) */
  xsltDoc = parseXML(XSLT_TEMPLATE);
  if (!xsltDoc) {
    grid.innerHTML = '<p style="color:red;padding:20px">❌ XSLT parse failed.</p>';
    return;
  }

  /* Step 2 — Process each XML feed */
  setTimeout(() => {
    grid.innerHTML = '';

    FEEDS.forEach(feed => {
      /* Parse XML feed */
      const xmlDoc = parseXML(feed.xml);
      if (!xmlDoc) return;

      /* XPath-style metadata extraction */
      const meta = extractMeta(xmlDoc);
      console.log(`[NewsXML] ✅ Feed: "${meta.title}" | Category: ${meta.category} | Articles: ${meta.total} | Updated: ${meta.updated}`);

      /* Step 3 — Apply XSLT transformation → HTML fragment */
      const fragment = transformXML(xmlDoc);

      /* Step 4 — Append cards to DOM */
      grid.appendChild(fragment);
    });

    /* Step 5 — Collect all cards for filtering */
    allCards = Array.from(grid.querySelectorAll('.news-card'));

    /* Step 6 — Wire up click-to-view-XML on cards */
    allCards.forEach(card => {
      card.addEventListener('click', () => {
        const cat = card.getAttribute('data-category');
        showXMLModal(cat);
      });
    });

    /* Step 7 — Finalise UI */
    updateTabCounts();
    setupEventListeners();

    console.log(`[NewsXML] 🚀 Loaded ${allCards.length} articles from ${FEEDS.length} XML feeds.`);
  }, 350);
}


/* ══════════════════════════════════════════════════════════════════
   EVENT LISTENERS
══════════════════════════════════════════════════════════════════ */
function setupEventListeners() {

  /* — Category tabs — */
  document.querySelectorAll('.cat-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.getAttribute('data-cat');
      filterCards();
    });
  });

  /* — Search input — */
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', () => {
    currentQ = searchInput.value.trim();
    const clearBtn    = document.getElementById('clearSearch');
    const resultsBar  = document.getElementById('searchResultsBar');
    const resultsText = document.getElementById('searchResultsText');

    if (currentQ) {
      clearBtn.style.display   = 'flex';
      const count              = filterCards();
      resultsBar.style.display = 'block';
      resultsText.textContent  =
        `🔍 "${currentQ}" — ${count} article${count !== 1 ? 's' : ''} found`;
    } else {
      window.clearSearch();
    }
  });

  document.getElementById('clearSearch').addEventListener('click', window.clearSearch);

  /* — Theme toggle — */
  document.getElementById('themeToggle').addEventListener('click', () => {
    const html  = document.documentElement;
    const dark  = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', dark ? 'light' : 'dark');
    document.querySelector('.ico-moon').style.display = dark ? 'block' : 'none';
    document.querySelector('.ico-sun').style.display = dark ? 'none' : 'block';
  });

  /* — Keyboard shortcut Ctrl+K → focus search — */
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('searchInput').focus();
    }
    if (e.key === 'Escape') window.closeModal();
  });
}


/* ══════════════════════════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', initApp);
