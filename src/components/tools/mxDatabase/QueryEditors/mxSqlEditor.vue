<template>
  <div style="width: 100%; height: 100%;">
    <dialog-editor-buttons :cell="cell" @save="saveCode" @theme="changeTheme"/>
    <editor v-model="query" @init="editorInit" :lang="lang" :theme="theme" :width="mxRectangle.width"
            :height="mxRectangle.height -35"></editor>
  </div>
</template>

<script>
//import MonacoEditor from 'vue-monaco'
import DialogEditorButtons from './dialogEditorButtons.vue'
import sqlservertips from '!!raw-loader!../src/queryTips/sqlserver.txt';
/*  import aqltips from '!!raw-loader!./src/queryTips/aql.txt';
  import nitritetips from '!!raw-loader!./src/queryTips/nitrite.txt';*/

export default {
  name: "mxSqlEditor",
  components: {
    //MonacoEditor,
    editor: require('vue2-ace-editor'),
    DialogEditorButtons
  },
  data() {
    return {
      query: this.getQuery(),
      lang: this.getLang(),
      theme: this.cell.getData().theme
    }
  },
  props: ['mxRectangle', 'cell'],
  computed: {
    getCellId: function() {
      return this.cell.getId();
    }
  },
  methods: {
    getLang: function() {
      let lang = "sqlserver";
      switch (this.cell.getData().dbType) {
        /*case "arangodb":
          lang = "aql";
          break;
        case "nitrite":
          lang = "java";
          break;*/
        case "sqlserver":
        default:
          lang = "sqlserver";
          break;
      }
      return lang;
    },
    getQuery: function() {
      if (this.cell.getData().setting.query.trim().length > 0)
        return this.cell.getData().setting.query
      else {
        let code = "sqlservertips";
        switch (this.cell.getData().dbType) {
          /*case "arangodb":
            code = aqltips;
            break;
          case "nitrite":
            code = nitritetips;
            break;*/
          case "sqlserver":
          default:
            code = sqlservertips;
            break;
        }
        return code;
      }
    },
    editorInit: function() {
      require('brace/ext/language_tools'); //language extension prerequsite...
      require('brace/mode/aql');
      require('brace/mode/java');
      require('brace/mode/sqlserver');
      require('brace/theme/chrome');
      require('brace/theme/monokai');
      require('brace/theme/ambiance');
      require('brace/theme/dracula');
      require('brace/theme/gruvbox');
      require('brace/theme/eclipse');
      require('brace/theme/sqlserver');
      require('brace/theme/solarized_light');
    },
    saveCode(evt) {
      let data = this.cell.getData();
      data.setting.query = this.query;
      //data.dbType = evt.dbType;
      data.theme = evt.theme;
      //data = { ...data, ...evt };
      this.cell.setData(data);
    },
    changeTheme(evt) {
      this.theme = evt.theme;
      let nData = this.cell.getData();
      nData.theme = this.theme;
      this.cell.setData(nData);
    }
  }
}
</script>