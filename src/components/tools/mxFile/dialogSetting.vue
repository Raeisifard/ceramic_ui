<template>
  <div>
    <Tabs>
      <!--            <TabPanel :title="'Select files'">
                      <Panel style="min-width:400px; min-height: 224.4px;">
                          <div slot="header">
                              <ButtonGroup>
                                  <FileButton
                                          style="width:100px"
                                          accept=".xml,.txt,.doc,.csv,.json"
                                          :multiple="true"
                                          @select="onFileSelect($event)"
                                  >Select Files...
                                  </FileButton>
                                  <LinkButton @click="files=[]" iconCls="icon-clearbrush" style="width:150px">Clear
                                  </LinkButton>
                              </ButtonGroup>
                              <LinkButton @click="send" style="float: right;">Send</LinkButton>
                          </div>
                          <DataList :data="files" :border="false" style="height: 100%;">
                              <template slot-scope="{row}">
                                  <div class="fileitem">
                                      <img :src="row.url">
                                      <div class="name">{{row.name}}</div>
                                      <div class="size">{{row.size}}</div>
                                      <LinkButton iconCls="icon-clear" :plain="true" @click="removeFile(row)"></LinkButton>
                                  </div>
                              </template>
                          </DataList>
                      </Panel>
                  </TabPanel>-->
      <TabPanel :title="'Watch Folder'">
        <div style="height: 100%;" class="f-full">
          <div style="display: flex;flex-direction: row;justify-content: space-around;margin: 10px 0;">
            <div style="margin-bottom:10px; display: flex;flex-direction: row;justify-content: start;">
              <Label for="filePath" align="top" style="display: flex;">Folder:</Label>
              <TextBox inputId="filePath" iconCls="icon-folder" placeholder="your\file\path"
                       v-model="filePath"
                       style="width:200px; display: flex;"></TextBox>
            </div>
            <div style="margin-bottom:10px; display: flex;flex-direction: row;justify-content: start;">
              <Label for="fileNameMask" align="top" style="display: flex;">File:</Label>
              <TextBox inputId="fileNameMask" iconCls="icon-file" placeholder="your\file\name"
                       v-model="fileNameMask"
                       style="width:140px; display: flex;"></TextBox>
            </div>
          </div>
          <div style="display: flex;flex-direction: row;justify-content: space-around;margin: 10px 0;">
            <div style="margin-bottom:10px; display: flex;flex-direction: row;justify-content: start;">
              <Label for="fileNameDoneExt" align="top" style="display: flex;">Done extension:</Label>
              <TextBox inputId="fileNameDoneExt" iconCls="icon-done" placeholder=".done"
                       v-model="fileNameDoneExt"
                       style="width:80px; display: flex;"></TextBox>
            </div>
            <div style="margin-bottom:10px; display: flex;flex-direction: row;justify-content: start;">
              <Label for="fileNameLockExt" align="top" style="display: flex;">File lock extension:</Label>
              <TextBox inputId="fileNameLockExt" iconCls="file-lock" placeholder=".$"
                       v-model="fileNameLockExt"
                       style="width:60px; display: flex;"></TextBox>
            </div>
          </div>
        </div>
        <!--                <div class="dialog-button">
                            <LinkButton style="width:80px" @click="settingOk">Ok</LinkButton>
                            <LinkButton style="width:80px" @click="settingCancel">Cancel</LinkButton>
                        </div>-->
      </TabPanel>
      <div style="display: flex;justify-content: space-around; background: url(src/images/window-title.gif) repeat-x;
                background-size: auto 100%; padding-bottom: 6px;margin-right: 2px;">
        <button class="button-dark" tabindex="11" style="color: mediumspringgreen;"
                @click="settingOk">OK
        </button>
        <button class="button-dark" tabindex="12" style="color: gold;"
                @click="settingCancel">Cancel
        </button>
      </div>
    </Tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filePath: this.prop.cell.getData().setting.filePath,
      fileNameMask: this.prop.cell.getData().setting.fileNameMask,
      fileNameDoneExt: this.prop.cell.getData().setting.fileNameDoneExt,
      fileNameLockExt: this.prop.cell.getData().setting.fileNameLockExt,
      files: [],
      background: null,
      graph: null,
    };
  },
  props: ['prop'],
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
    onFileSelect(event) {
      event.forEach(file => {
        file.url = window.URL.createObjectURL(file);
      });
      this.files = this.files.concat(event);
    },
    removeFile(file) {
      let index = this.files.indexOf(file);
      if (index >= 0) {
        this.files = this.files.filter((file, i) => i != index);
      }
    },
    send(evt) {
      /*this.prop.cell.data.setting = { files: this.files };
      this.$store.dispatch("setData2JsonGraph", {
        data: this.prop.cell.getData().setting,
        id: this.prop.cell.getId(),
        type: this.prop.cell.getType()
      });*/
      this.prop.wnd.destroy();
    },
    settingOk(evt) {
      /*let editor = this.$store.getters.getEditor;
      let graph = editor.graph;
      let model = graph.getModel();*/
      let data = this.prop.cell.getData();
      data.setting = {};
      data.setting.mode = "watch";
      data.setting.filePath = this.filePath;
      data.setting.fileNameMask = this.fileNameMask;
      data.setting.fileNameDoneExt = this.fileNameDoneExt;
      data.setting.fileNameLockExt = this.fileNameLockExt;
      this.prop.cell.setData(data);
      this.prop.store.dispatch("sendSetting2VX", this.prop.cell);
      this.prop.wnd.destroy();
    },
    settingCancel(evt) {
      this.prop.wnd.destroy();
    },
  },
  mounted() {
    let that = this;
    this.graph = this.prop.store.getters.getGraph;
    this.graph.setEnabled(false);
    this.background = this.getBackground();
    this.prop.background = this.background;
    document.body.appendChild(this.background);
    if (mxClient.IS_IE) {
      new mxDivResizer(this.background);
    }
  }
};
</script>
<style scoped>
.fileitem {
  height: 70px;
  padding: 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.fileitem img {
  width: 50px;
  height: 50px;
}

.fileitem .name {
  margin: 0 20px;
  flex: 1;
}

.fileitem .size {
  margin: 0 20px;
  text-align: right;
}

* {
  user-select: none;
}

.button-dark {
  background: url(/src/images/button-dark.gif) repeat-x;
  width: 60px;
  margin-top: 5px;
}

label {
  padding-right: 5px;
}
</style>