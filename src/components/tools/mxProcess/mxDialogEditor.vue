<template>
  <div style="display: flex; flex-direction: column;">
    <dialog-editor-toolbar :cell="cell" @save="saveCode" @lang="changeLang" @theme="changeTheme"/>
    <!-- <monaco-editor class="editor" v-model="code" :language="lang" :key="getRerender"></monaco-editor>-->
    <editor v-model="code" @init="editorInit" :lang="lang" :theme="theme" width="100%" :height="height"></editor>
  </div>
</template>

<script>
//import MonacoEditor from 'vue-monaco'
import DialogEditorToolbar from './dialogEditorToolbar'
import JavaTemplate from '!!raw-loader!./langsTemplate/java.txt';
import JavascriptTemplate from '!!raw-loader!./langsTemplate/javascript.txt';

export default {
  name: "dialogEditor",
  components: {
    //MonacoEditor,
    editor: require('vue2-ace-editor'),
    DialogEditorToolbar
  },
  data() {
    return {
      lang: this.cell.getData().lang,
      theme: this.cell.getData().theme,
      code: this.cell.getData().code,
      JavaTemplate: JavaTemplate,
      JavascriptTemplate: JavascriptTemplate,
      background: null,
      wndEditor: null,
      graph: this.$store.getters.getGraph,
      height: '339px',
    }
  },
  props: ['cell'],
  computed: {
    getCellId: function() {
      return this.cell.getId();
    },
    console: () => console,
    window: () => window,
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
    editorInit: function(editor) {
      require('brace/ext/language_tools'); //language extension prerequsite...
      require('brace/mode/html');
      require('brace/mode/javascript');   //language
      require('brace/mode/java');
      require('brace/theme/chrome');
      require('brace/theme/monokai');
      require('brace/theme/ambiance');
      require('brace/theme/dracula');
      require('brace/theme/gruvbox');
      require('brace/theme/eclipse');
      require('brace/theme/solarized_light');

      /*require('ace-builds/src-noconflict/ext-language_tools');//language extension prerequsite...
      require('ace-builds/src-noconflict/mode-html');
      require('ace-builds/src-noconflict/mode-javascript');    //language
      require('ace-builds/src-noconflict/mode-java');
      require('ace-builds/src-noconflict/theme-monokai');
      require('ace-builds/src-noconflict/theme-chrome');
      require('ace-builds/src-noconflict/theme-ambiance');
      require('ace-builds/src-noconflict/theme-dracula');
      require('ace-builds/src-noconflict/theme-gruvbox');
      require('ace-builds/src-noconflict/theme-eclipse');
      require('ace-builds/src-noconflict/theme-solarized_light');*/
      //require('brace/snippets/javascript'); //snippet
      //require('brace/snippets/json'); //snippet
      //require('brace/snippets/xml'); //snippet
      editor.setOption("vScrollBarAlwaysVisible", true);
      editor.setOption("hScrollBarAlwaysVisible", true);
    },
    saveCode(evt) {
      let data = this.cell.getData();
      let nData = JSON.parse(evt);
      data.lang = nData.lang;
      data.theme = nData.theme;
      data.fName = nData.fName;
      data.code = this.code;
      this.cell.setData(data);
    },
    changeLang(evt) {
      this.lang = evt.lang;
      if (this.lang === 'java' && ( this.code === this.JavascriptTemplate || this.code.replace(/(\r\n|\n|\r)/gm, "").trim().length === 0 )) {
        this.code = this.JavaTemplate;
      } else if (this.lang === 'javascript' && ( this.code === this.JavaTemplate || this.code.replace(/(\r\n|\n|\r)/gm, "").trim().length === 0 ))
        this.code = this.JavascriptTemplate;
    },
    changeTheme(evt) {
      this.theme = evt.theme;
      let nData = this.cell.getData();
      nData.theme = this.theme;
      this.cell.setData(nData);
    }
  },
  mounted() {
    /*this.JavaTemplate = JavaTemplate;
    this.JavascriptTemplate = JavascriptTemplate;
    if (this.cell.getData().lang && this.cell.getData().lang.length > 0)
      this.lang = this.cell.getData().lang;
    else
      this.lang = 'java';
    if (this.cell.getData().theme && this.cell.getData().theme.length > 0)
      this.theme = this.cell.getData().theme;
    else
      this.theme = 'monokai';
    if (this.cell.getData().code && this.cell.getData().code.length > 0)
      this.code = this.cell.getData().code;
    else {
      if (this.lang === "java")
        this.code = this.JavaTemplate;
      else if (this.lang === "javascript")
        this.code = this.JavascriptTemplate;
    }*/
    let that = this;
    this.background = this.getBackground();
    document.body.appendChild(this.background);
    if (mxClient.IS_IE) {
      new mxDivResizer(this.background);
    }
    let width = 600;
    let height = 390;
    let x = Math.max(0, document.body.scrollWidth / 2 - width / 2);
    let y = Math.max(10, ( document.body.scrollHeight ||
        document.documentElement.scrollHeight ) / 2 - height * 2 / 3);
    this.wndEditor = new mxWindow("JAVA Editor", this.$el, x, y, width, height, false, true);
    this.wndEditor.setClosable(true);
    this.wndEditor.setResizable(true);
    this.wndEditor.minimumSize = new mxRectangle(0, 0, 500, 180);
    this.wndEditor.destroyOnClose = true;
    this.graph.setEnabled(false);
    this.graph.tooltipHandler.hide();
    this.wndEditor.setVisible(true);
    this.wndEditor.table.nextSibling.style.right = 0
    this.wndEditor.div.style.overflow = 'visible';
    this.wndEditor.content.parentElement.style.overflow = 'unset';
    this.wndEditor.addListener(mxEvent.DESTROY, function(evt) {
      that.graph.setEnabled(true);
      mxEffects.fadeOut(that.background, 50, true, 10, 30, true);
      that.$emit('close');
    });
    this.wndEditor.addListener(mxEvent.RESIZE, function(evt) {
      that.height = ( evt.div.offsetHeight - 51 ) + 'px';
    });
  }
}
</script>

<style scoped>
.editor {
  width: 100%;
  height: 100%;
}
</style>