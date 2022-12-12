<template>
  <div style="width: 100%; height: 100%; display: flex; flex-direction: column;">
    <editor v-model="code" @init="editorInit" :lang="lang" :theme="theme" :width="width"
            :height="mxRectangle.height -28"></editor>
    <div style="display: flex;justify-content: space-around;
    background: url(src/images/window-title.gif) repeat-x; background-size: auto 100%; height: 30px; padding-bottom: 5px;">
      <button class="button-dark" style="color: mediumspringgreen;"
              @click="send">Send
      </button>
      <button class="button-dark" style="color: gold;"
              @click="cancel">Cancel
      </button>
    </div>
  </div>
</template>

<script>

export default {
  name: "mxCodeEditor",
  components: {
    editor: require('vue2-ace-editor'),
  },
  props: ['cell'],
  data() {
    return {
      _editor: null,
      background: null,
      wndEditor: null,
      graph: this.$store.getters.getEditor.graph,
      mxRectangle: new mxRectangle(0, 0, 0, 0),
      lang: 'ftl',
      theme: 'chrome',
      width: '100%',
      code: "",
    }
  },
  methods: {
    getBackground: function() {
      let background = document.createElement('div');
      background.style.position = 'absolute';
      background.style.left = '0px';
      background.style.top = '0px';
      background.style.right = '0px';
      background.style.bottom = '0px';
      background.style.background = 'black';
      background.style.zIndex = '1';
      mxUtils.setOpacity(background, 50);
      return background;
    },
    showModalEditorWindow: function(graph, title, content, width, height) {
      let that = this;
      this.background = this.getBackground();
      document.body.appendChild(this.background);
      if (mxClient.IS_IE) {
        new mxDivResizer(this.background);
      }
      let x = Math.max(0, document.body.scrollWidth / 2 - width / 2);
      let y = Math.max(10, ( document.body.scrollHeight ||
          document.documentElement.scrollHeight ) / 2 - height * 2 / 3);
      this.wndEditor = new mxWindow(title, content, x, y, width, height, false, true);
      this.wndEditor.addListener(mxEvent.RESIZE, function(evt) {
        //console.dir(evt);
        let content = evt.content;
        that.mxRectangle.height = content.offsetHeight;
        that.mxRectangle.width = content.offsetWidth;
      });
      this.wndEditor.setClosable(true);
      this.wndEditor.destroyOnClose = true;
      this.wndEditor.setResizable(true);
      let minRect = new mxRectangle(0, 0, 440, 140);
      this.wndEditor.minimumSize = minRect;

      graph.setEnabled(false);
      graph.tooltipHandler.hide();
      this.wndEditor.setVisible(true);
      this.mxRectangle.height = this.wndEditor.content.offsetHeight;
      this.mxRectangle.width = this.wndEditor.content.offsetWidth;

      this.wndEditor.addListener(mxEvent.DESTROY, function(evt) {
        graph.setEnabled(true);
        // Fades the background out after after the window has been closed
        mxEffects.fadeOut(that.background, 50, true, 10, 30, true);
        that.$emit('close');
      });
    },
    send(evt) {
      this.$store.dispatch("sendCode2VX", this.cell);
      this.wndEditor.destroy();
    },
    cancel(evt) {
      this.wndEditor.destroy();
    },
    editorInit: function() {
      require('brace/ext/language_tools'); //language extension prerequsite...
      require('brace/theme/chrome');
      require('brace/mode/html');
      require('brace/mode/xml');
      require('brace/mode/ftl');
    },
    prettifyXml: function(sourceXml) {
      let xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
      let xsltDoc = new DOMParser().parseFromString([
        // describes how we want to modify the XML - indent everything
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
        '  <xsl:strip-space elements="*"/>',
        '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
        '    <xsl:value-of select="normalize-space(.)"/>',
        '  </xsl:template>',
        '  <xsl:template match="node()|@*">',
        '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
        '  </xsl:template>',
        '  <xsl:output indent="yes"/>',
        '</xsl:stylesheet>',
      ].join('\n'), 'application/xml');

      let xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsltDoc);
      let resultDoc = xsltProcessor.transformToDocument(xmlDoc);
      let resultXml = new XMLSerializer().serializeToString(resultDoc);
      return resultXml;
    },

  },
  computed: {
    getCell: function() {
      return this.cell;
    }
  },
  mounted() {
    let that = this;
    this.code = this.cell.getData().code;
    let prettyCode = this.prettifyXml(`<xml>${this.code}</xml>`);
    if (!prettyCode.includes('<h3>Below is a rendering of the page up to the first error.</h3>'))
      this.code = prettyCode.substring(6, prettyCode.length - 7);
    this.showModalEditorWindow(this.$store.getters.getEditor.graph, "Code Editor", this.$el, 500, 232);
  }
}
</script>

<style scoped>
* {
  user-select: none;
}

.button-dark {
  background: url(/src/images/button-dark.gif) repeat-x;
  width: 60px;
  margin-top: 5px;
}
</style>