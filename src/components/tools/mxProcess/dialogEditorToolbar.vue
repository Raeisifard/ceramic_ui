<template>
  <div class="dialog-toolbar">
    <LinkButton iconCls="icon-save" :plain="true" style="height: 20px;"
                @click='$emit("save", `{"lang": "${value}", "theme": "${theme}", "fName": "${fileName}" }`)'>Save
    </LinkButton>
    <!--        <div style="margin-left:10px;display:inline-block;" class="lang">
                <ComboBox inputId="c1" v-model="value" :data="data" limitToList></ComboBox>
            </div>-->
    <!--<input type="text" size="25" v-model="fileName" placeholder="File Name" />-->
    <TextBox inputId="t1" v-model="fileName" iconCls="icon-file" placeholder="File name"
             style="height: 20px; width: 250px; margin-left: 10px;"></TextBox>
    <ComboBox inputId="h1" v-model="theme" :data="themes" limitToList style="height: 20px;margin-right: 10px;float: right;"></ComboBox>
    <!--        <LinkButton style="float: right;" iconCls="icon-help" :plain="true">Help</LinkButton>-->
  </div>
</template>

<script>
export default {
  name: "dialogEditorToolbar",
  data() {
    return {
      value: this.cell.getData().lang,
      theme: this.cell.getData().theme,
      fileName: this.cell.getData().fName,
      data: this.getData(),
      themes: this.getThemes()
    };
  },
  watch: {
    value: function(val) {
      if (val != null && val.trim().length > 1)
        this.$emit("lang", { "lang": val });
    },
    theme: function(val) {
      if (val != null && val.trim().length > 1)
        this.$emit("theme", { "theme": val });
    }
  },
  props: ['cell'],
  computed: {},
  methods: {
    save() {
      this.$emit('save', `{"lang": "${this.value}", "theme": "${this.theme}", "fName": "${this.fileName}" }`);
    },
    getData() {
      return [
        { value: "java", text: "Java" },
        { value: "javascript", text: "Javascript" }
      ];
    },
    getThemes() {
      return [
        { value: "monokai", text: "Monokai" },
        { value: "chrome", text: "Chrome" },
        { value: "ambiance", text: "Ambiance" },
        { value: "dracula", text: "Dracula" },
        { value: "gruvbox", text: "Gruvbox" },
        { value: "solarized_light", text: "Solarized Light" },
        { value: "eclipse", text: "Eclipse" },
      ];
    }
  },
  mounted() {
  }
  /* if (typeof this.cell.getData().lang != 'undefined') {
     let lang = this.cell.getData().lang;
     if (lang === 'java')
       this.value = "java";
     else //if (lang === 'javascript' || lang === 'js')
       this.value = "javascript";
   } else {
     this.value = "java";//Default lang is "Java"
   }
   if (typeof this.cell.getData().fName != 'undefined' && this.cell.getData().fName.trim().length > 0) {
     this.fileName = this.cell.getData().fName;
   }
   if (typeof this.cell.getData().theme != 'undefined' && this.cell.getData().theme.trim().length > 0) {
     this.theme = this.cell.getData().theme.trim();
   }
 }*/

}
</script>

<style scoped>
.lang {
  width: 7.1em;
}

.theme {
  width: 14em;
}
</style>