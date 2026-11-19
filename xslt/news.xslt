<?xml version="1.0" encoding="UTF-8"?>
<!--
  ═══════════════════════════════════════════════════════════════
  NewsXML — XSLT Stylesheet  (news.xslt)

  Purpose : Transforms XML news feed articles into HTML card elements
  Version : XSLT 1.0 (browser-compatible via XSLTProcessor API)
  Input   : /newsfeed/articles/article  (from feeds/*.xml)
  Output  : HTML <div class="news-card"> elements

  XPath Expressions Used:
    /               → Root match
    newsfeed/articles/article → Selects all article nodes
    category        → article/category text value
    @id             → article's id attribute
    title           → article/title text value
    description     → article/description text value
    author          → article/author text value
    pubDate         → article/pubDate text value
    source          → article/source text value
    readTime        → article/readTime text value
    emoji           → article/emoji text value
    categoryIcon    → article/categoryIcon text value
    tags/tag        → Iterates over all tag child elements
    .               → Current node text (inside xsl:for-each)
  ═══════════════════════════════════════════════════════════════
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html" indent="yes" encoding="UTF-8"/>

  <!-- ═══════════════════════════════════
       ROOT TEMPLATE
       Matches the document root (/)
       Delegates to article template
  ═══════════════════════════════════ -->
  <xsl:template match="/">
    <xsl:apply-templates select="newsfeed/articles/article"/>
  </xsl:template>


  <!-- ═══════════════════════════════════
       ARTICLE TEMPLATE
       Matches each <article> node and
       transforms it into one HTML card
  ═══════════════════════════════════ -->
  <xsl:template match="article">

    <!--
      Attribute Value Template (AVT): {category} and {@id}
      are evaluated as XPath expressions inside {} in attributes.
    -->
    <div class="news-card" data-category="{category}" data-id="{@id}">

      <!-- Hover badge showing data source is XML -->
      <span class="xml-badge">XML</span>

      <!-- ── Top Row ── -->
      <div class="card-top">
        <!-- XPath: article/categoryIcon and article/category -->
        <span class="category-badge">
          <xsl:value-of select="categoryIcon"/>
          <xsl:text> </xsl:text>
          <xsl:value-of select="category"/>
        </span>
        <!-- XPath: article/readTime -->
        <span class="read-time">
          <xsl:text>⏱ </xsl:text>
          <xsl:value-of select="readTime"/>
        </span>
      </div>

      <!-- ── Emoji Icon ── XPath: article/emoji -->
      <div class="card-emoji-area">
        <xsl:value-of select="emoji"/>
      </div>

      <!-- ── Title ── XPath: article/title -->
      <h3 class="card-title">
        <xsl:value-of select="title"/>
      </h3>

      <!-- ── Description ── XPath: article/description -->
      <p class="card-desc">
        <xsl:value-of select="description"/>
      </p>

      <!-- ── Tags ── xsl:for-each over article/tags/tag -->
      <div class="card-tags">
        <xsl:for-each select="tags/tag">
          <span class="tag">
            <!-- . refers to the current <tag> node's text content -->
            <xsl:text>#</xsl:text>
            <xsl:value-of select="."/>
          </span>
        </xsl:for-each>
      </div>

      <!-- ── Footer: Author / Source / Date ── -->
      <div class="card-footer-area">
        <div class="card-meta-left">
          <!-- XPath: article/author -->
          <span class="card-author">
            <xsl:text>✍️ </xsl:text>
            <xsl:value-of select="author"/>
          </span>
          <!-- XPath: article/source -->
          <span class="card-source">
            <xsl:text>📰 </xsl:text>
            <xsl:value-of select="source"/>
          </span>
        </div>
        <!-- XPath: article/pubDate -->
        <span class="card-date">
          <xsl:text>📅 </xsl:text>
          <xsl:value-of select="pubDate"/>
        </span>
      </div>

    </div>
  </xsl:template>

</xsl:stylesheet>
