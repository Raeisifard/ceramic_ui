<template>
  <div id="fixed">
    <table class="tg" style="border-collapse: collapse;border: 0">
      <tbody>
      <tr style="display: none">
        <td class="tg-il9k tg-out" id="td1" style="border-bottom: 5px dashed black; border-right: 5px dashed black;">
          <img v-bind:class="[selected === 'td1' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_TOP"
               data-STYLE_LABEL_POSITION="ALIGN_LEFT"
               data-STYLE_VERTICAL_ALIGN="ALIGN_BOTTOM"
               data-STYLE_ALIGN="ALIGN_RIGHT"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M16 224h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm416 192H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm3.17-384H172.83A12.82 12.82 0 0 0 160 44.83v38.34A12.82 12.82 0 0 0 172.83 96h262.34A12.82 12.82 0 0 0 448 83.17V44.83A12.82 12.82 0 0 0 435.17 32zm0 256H172.83A12.82 12.82 0 0 0 160 300.83v38.34A12.82 12.82 0 0 0 172.83 352h262.34A12.82 12.82 0 0 0 448 339.17v-38.34A12.82 12.82 0 0 0 435.17 288z'/%3e%3c/svg%3e"
               width="48" height="48"/></td>
        <td class="tg-il9k tg-out" id="td2">
          <img v-bind:class="[selected === 'td2' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_TOP"
               data-STYLE_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_VERTICAL_ALIGN="ALIGN_BOTTOM"
               data-STYLE_ALIGN="ALIGN_LEFT"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M12.83 352h262.34A12.82 12.82 0 0 0 288 339.17v-38.34A12.82 12.82 0 0 0 275.17 288H12.83A12.82 12.82 0 0 0 0 300.83v38.34A12.82 12.82 0 0 0 12.83 352zm0-256h262.34A12.82 12.82 0 0 0 288 83.17V44.83A12.82 12.82 0 0 0 275.17 32H12.83A12.82 12.82 0 0 0 0 44.83v38.34A12.82 12.82 0 0 0 12.83 96zM432 160H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0 256H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z'/%3e%3c/svg%3e"
               width="48" height="48"/></td>
        <td class="tg-il9k tg-out" id="td3">
          <img v-bind:class="[selected === 'td3' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_TOP"
               data-STYLE_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_VERTICAL_ALIGN="ALIGN_BOTTOM"
               data-STYLE_ALIGN="ALIGN_CENTER"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M432 160H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0 256H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM108.1 96h231.81A12.09 12.09 0 0 0 352 83.9V44.09A12.09 12.09 0 0 0 339.91 32H108.1A12.09 12.09 0 0 0 96 44.09V83.9A12.1 12.1 0 0 0 108.1 96zm231.81 256A12.09 12.09 0 0 0 352 339.9v-39.81A12.09 12.09 0 0 0 339.91 288H108.1A12.09 12.09 0 0 0 96 300.09v39.81a12.1 12.1 0 0 0 12.1 12.1z'/%3e%3c/svg%3e"
               width="48" height="48"/></td>
        <td class="tg-il9k tg-out" id="td4">
          <img v-bind:class="[selected === 'td4' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_TOP"
               data-STYLE_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_VERTICAL_ALIGN="ALIGN_BOTTOM"
               data-STYLE_ALIGN="ALIGN_RIGHT"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M16 224h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm416 192H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm3.17-384H172.83A12.82 12.82 0 0 0 160 44.83v38.34A12.82 12.82 0 0 0 172.83 96h262.34A12.82 12.82 0 0 0 448 83.17V44.83A12.82 12.82 0 0 0 435.17 32zm0 256H172.83A12.82 12.82 0 0 0 160 300.83v38.34A12.82 12.82 0 0 0 172.83 352h262.34A12.82 12.82 0 0 0 448 339.17v-38.34A12.82 12.82 0 0 0 435.17 288z'/%3e%3c/svg%3e"
               width="48" height="48"/></td>
        <td class="tg-il9k tg-out" id="td5" style="border-left: 5px dashed black; border-bottom: 5px dashed black;">
          <img v-bind:class="[selected === 'td5' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_TOP"
               data-STYLE_LABEL_POSITION="ALIGN_RIGHT"
               data-STYLE_VERTICAL_ALIGN="ALIGN_BOTTOM"
               data-STYLE_ALIGN="ALIGN_LEFT"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M12.83 352h262.34A12.82 12.82 0 0 0 288 339.17v-38.34A12.82 12.82 0 0 0 275.17 288H12.83A12.82 12.82 0 0 0 0 300.83v38.34A12.82 12.82 0 0 0 12.83 352zm0-256h262.34A12.82 12.82 0 0 0 288 83.17V44.83A12.82 12.82 0 0 0 275.17 32H12.83A12.82 12.82 0 0 0 0 44.83v38.34A12.82 12.82 0 0 0 12.83 96zM432 160H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0 256H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z'/%3e%3c/svg%3e"
               width="48" height="48"/></td>
      </tr>
      <tr>
        <td style="display: none" class="tg-il9k tg-out" id="td6">
          <img v-bind:class="[selected === 'td6' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_LABEL_POSITION="ALIGN_LEFT"
               data-STYLE_VERTICAL_ALIGN="ALIGN_TOP"
               data-STYLE_ALIGN="ALIGN_RIGHT"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M16 224h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm416 192H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm3.17-384H172.83A12.82 12.82 0 0 0 160 44.83v38.34A12.82 12.82 0 0 0 172.83 96h262.34A12.82 12.82 0 0 0 448 83.17V44.83A12.82 12.82 0 0 0 435.17 32zm0 256H172.83A12.82 12.82 0 0 0 160 300.83v38.34A12.82 12.82 0 0 0 172.83 352h262.34A12.82 12.82 0 0 0 448 339.17v-38.34A12.82 12.82 0 0 0 435.17 288z'/%3e%3c/svg%3e"
               width="48" height="48"></td>
        <td class="tg-il9k tg-in" id="td7"
            style="border-left: 5px solid green; border-top: 5px solid green; border-top-left-radius: 20px;">
          <img v-bind:class="[selected === 'td7' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_VERTICAL_ALIGN="ALIGN_TOP"
               data-STYLE_ALIGN="ALIGN_LEFT"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M12.83 352h262.34A12.82 12.82 0 0 0 288 339.17v-38.34A12.82 12.82 0 0 0 275.17 288H12.83A12.82 12.82 0 0 0 0 300.83v38.34A12.82 12.82 0 0 0 12.83 352zm0-256h262.34A12.82 12.82 0 0 0 288 83.17V44.83A12.82 12.82 0 0 0 275.17 32H12.83A12.82 12.82 0 0 0 0 44.83v38.34A12.82 12.82 0 0 0 12.83 96zM432 160H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0 256H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z'/%3e%3c/svg%3e"
               width="48" height="48"></td>
        <td class="tg-il9k tg-in" id="td8" style="border-top: 5px solid green;">
          <img v-bind:class="[selected === 'td8' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_VERTICAL_ALIGN="ALIGN_TOP"
               data-STYLE_ALIGN="ALIGN_CENTER"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M432 160H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0 256H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM108.1 96h231.81A12.09 12.09 0 0 0 352 83.9V44.09A12.09 12.09 0 0 0 339.91 32H108.1A12.09 12.09 0 0 0 96 44.09V83.9A12.1 12.1 0 0 0 108.1 96zm231.81 256A12.09 12.09 0 0 0 352 339.9v-39.81A12.09 12.09 0 0 0 339.91 288H108.1A12.09 12.09 0 0 0 96 300.09v39.81a12.1 12.1 0 0 0 12.1 12.1z'/%3e%3c/svg%3e"
               width="48" height="48"></td>
        <td class="tg-il9k tg-in" id="td9"
            style="border-top: 5px solid green; border-right: 5px solid green; border-top-right-radius: 20px;">
          <img v-bind:class="[selected === 'td9' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_VERTICAL_ALIGN="ALIGN_TOP"
               data-STYLE_ALIGN="ALIGN_RIGHT"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M16 224h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm416 192H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm3.17-384H172.83A12.82 12.82 0 0 0 160 44.83v38.34A12.82 12.82 0 0 0 172.83 96h262.34A12.82 12.82 0 0 0 448 83.17V44.83A12.82 12.82 0 0 0 435.17 32zm0 256H172.83A12.82 12.82 0 0 0 160 300.83v38.34A12.82 12.82 0 0 0 172.83 352h262.34A12.82 12.82 0 0 0 448 339.17v-38.34A12.82 12.82 0 0 0 435.17 288z'/%3e%3c/svg%3e"
               width="48" height="48"></td>
        <td style="display: none" class="tg-il9k tg-out" id="td10">
          <img v-bind:class="[selected === 'td10' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_LABEL_POSITION="ALIGN_RIGHT"
               data-STYLE_VERTICAL_ALIGN="ALIGN_TOP"
               data-STYLE_ALIGN="ALIGN_LEFT"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M12.83 352h262.34A12.82 12.82 0 0 0 288 339.17v-38.34A12.82 12.82 0 0 0 275.17 288H12.83A12.82 12.82 0 0 0 0 300.83v38.34A12.82 12.82 0 0 0 12.83 352zm0-256h262.34A12.82 12.82 0 0 0 288 83.17V44.83A12.82 12.82 0 0 0 275.17 32H12.83A12.82 12.82 0 0 0 0 44.83v38.34A12.82 12.82 0 0 0 12.83 96zM432 160H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0 256H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z'/%3e%3c/svg%3e"
               alt="Image" width="48" height="48"></td>
      </tr>
      <tr style="display: none">
        <td class="tg-il9k tg-out" id="td11">
          <img v-bind:class="[selected === 'td11' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_LABEL_POSITION="ALIGN_LEFT"
               data-STYLE_VERTICAL_ALIGN="ALIGN_CENTER"
               data-STYLE_ALIGN="ALIGN_RIGHT"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M16 224h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm416 192H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm3.17-384H172.83A12.82 12.82 0 0 0 160 44.83v38.34A12.82 12.82 0 0 0 172.83 96h262.34A12.82 12.82 0 0 0 448 83.17V44.83A12.82 12.82 0 0 0 435.17 32zm0 256H172.83A12.82 12.82 0 0 0 160 300.83v38.34A12.82 12.82 0 0 0 172.83 352h262.34A12.82 12.82 0 0 0 448 339.17v-38.34A12.82 12.82 0 0 0 435.17 288z'/%3e%3c/svg%3e"
               width="48" height="48"></td>
        <td class="tg-il9k tg-in" id="td12" style="border-left: 5px solid green;">
          <img v-bind:class="[selected === 'td12' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_VERTICAL_ALIGN="ALIGN_CENTER"
               data-STYLE_ALIGN="ALIGN_LEFT"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M12.83 352h262.34A12.82 12.82 0 0 0 288 339.17v-38.34A12.82 12.82 0 0 0 275.17 288H12.83A12.82 12.82 0 0 0 0 300.83v38.34A12.82 12.82 0 0 0 12.83 352zm0-256h262.34A12.82 12.82 0 0 0 288 83.17V44.83A12.82 12.82 0 0 0 275.17 32H12.83A12.82 12.82 0 0 0 0 44.83v38.34A12.82 12.82 0 0 0 12.83 96zM432 160H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0 256H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z'/%3e%3c/svg%3e"
               width="48" height="48"></td>
        <td class="tg-il9k tg-in" id="td13">
          <img v-bind:class="[selected === 'td13' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_VERTICAL_ALIGN="ALIGN_CENTER"
               data-STYLE_ALIGN="ALIGN_CENTER"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M432 160H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0 256H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM108.1 96h231.81A12.09 12.09 0 0 0 352 83.9V44.09A12.09 12.09 0 0 0 339.91 32H108.1A12.09 12.09 0 0 0 96 44.09V83.9A12.1 12.1 0 0 0 108.1 96zm231.81 256A12.09 12.09 0 0 0 352 339.9v-39.81A12.09 12.09 0 0 0 339.91 288H108.1A12.09 12.09 0 0 0 96 300.09v39.81a12.1 12.1 0 0 0 12.1 12.1z'/%3e%3c/svg%3e"
               width="48" height="48"></td>
        <td class="tg-il9k tg-in" id="td14" style="border-right: 5px solid green;">
          <img v-bind:class="[selected === 'td14' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_VERTICAL_ALIGN="ALIGN_CENTER"
               data-STYLE_ALIGN="ALIGN_RIGHT"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M16 224h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm416 192H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm3.17-384H172.83A12.82 12.82 0 0 0 160 44.83v38.34A12.82 12.82 0 0 0 172.83 96h262.34A12.82 12.82 0 0 0 448 83.17V44.83A12.82 12.82 0 0 0 435.17 32zm0 256H172.83A12.82 12.82 0 0 0 160 300.83v38.34A12.82 12.82 0 0 0 172.83 352h262.34A12.82 12.82 0 0 0 448 339.17v-38.34A12.82 12.82 0 0 0 435.17 288z'/%3e%3c/svg%3e"
               width="48" height="48"></td>
        <td class="tg-il9k tg-out" id="td15">
          <img v-bind:class="[selected === 'td15' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_LABEL_POSITION="ALIGN_RIGHT"
               data-STYLE_VERTICAL_ALIGN="ALIGN_CENTER"
               data-STYLE_ALIGN="ALIGN_LEFT"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M12.83 352h262.34A12.82 12.82 0 0 0 288 339.17v-38.34A12.82 12.82 0 0 0 275.17 288H12.83A12.82 12.82 0 0 0 0 300.83v38.34A12.82 12.82 0 0 0 12.83 352zm0-256h262.34A12.82 12.82 0 0 0 288 83.17V44.83A12.82 12.82 0 0 0 275.17 32H12.83A12.82 12.82 0 0 0 0 44.83v38.34A12.82 12.82 0 0 0 12.83 96zM432 160H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0 256H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z'/%3e%3c/svg%3e"
               alt="Image" width="48" height="48"></td>
      </tr>
      <tr>
        <td style="display: none" class="tg-il9k tg-out" id="td16">
          <img v-bind:class="[selected === 'td16' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_LABEL_POSITION="ALIGN_LEFT"
               data-STYLE_VERTICAL_ALIGN="ALIGN_BOTTOM"
               data-STYLE_ALIGN="ALIGN_RIGHT"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M16 224h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm416 192H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm3.17-384H172.83A12.82 12.82 0 0 0 160 44.83v38.34A12.82 12.82 0 0 0 172.83 96h262.34A12.82 12.82 0 0 0 448 83.17V44.83A12.82 12.82 0 0 0 435.17 32zm0 256H172.83A12.82 12.82 0 0 0 160 300.83v38.34A12.82 12.82 0 0 0 172.83 352h262.34A12.82 12.82 0 0 0 448 339.17v-38.34A12.82 12.82 0 0 0 435.17 288z'/%3e%3c/svg%3e"
               width="48" height="48"></td>
        <td class="tg-il9k tg-in" id="td17"
            style="border-left: 5px solid green; border-bottom: 5px solid green; border-bottom-left-radius: 20px;">
          <img v-bind:class="[selected === 'td17' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_VERTICAL_ALIGN="ALIGN_BOTTOM"
               data-STYLE_ALIGN="ALIGN_LEFT"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M12.83 352h262.34A12.82 12.82 0 0 0 288 339.17v-38.34A12.82 12.82 0 0 0 275.17 288H12.83A12.82 12.82 0 0 0 0 300.83v38.34A12.82 12.82 0 0 0 12.83 352zm0-256h262.34A12.82 12.82 0 0 0 288 83.17V44.83A12.82 12.82 0 0 0 275.17 32H12.83A12.82 12.82 0 0 0 0 44.83v38.34A12.82 12.82 0 0 0 12.83 96zM432 160H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0 256H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z'/%3e%3c/svg%3e"
               alt="Image" width="48" height="48"></td>
        <td class="tg-il9k tg-in" id="td18" style="border-bottom: 5px solid green;">
          <img v-bind:class="[selected === 'td18' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_VERTICAL_ALIGN="ALIGN_BOTTOM"
               data-STYLE_ALIGN="ALIGN_CENTER"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M432 160H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0 256H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM108.1 96h231.81A12.09 12.09 0 0 0 352 83.9V44.09A12.09 12.09 0 0 0 339.91 32H108.1A12.09 12.09 0 0 0 96 44.09V83.9A12.1 12.1 0 0 0 108.1 96zm231.81 256A12.09 12.09 0 0 0 352 339.9v-39.81A12.09 12.09 0 0 0 339.91 288H108.1A12.09 12.09 0 0 0 96 300.09v39.81a12.1 12.1 0 0 0 12.1 12.1z'/%3e%3c/svg%3e"
               alt="Image" width="48" height="48"></td>
        <td class="tg-il9k tg-in" id="td19"
            style="border-bottom: 5px solid green; border-right: 5px solid green; border-bottom-right-radius: 20px;">
          <img v-bind:class="[selected === 'td19' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_VERTICAL_ALIGN="ALIGN_BOTTOM"
               data-STYLE_ALIGN="ALIGN_RIGHT"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M16 224h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm416 192H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm3.17-384H172.83A12.82 12.82 0 0 0 160 44.83v38.34A12.82 12.82 0 0 0 172.83 96h262.34A12.82 12.82 0 0 0 448 83.17V44.83A12.82 12.82 0 0 0 435.17 32zm0 256H172.83A12.82 12.82 0 0 0 160 300.83v38.34A12.82 12.82 0 0 0 172.83 352h262.34A12.82 12.82 0 0 0 448 339.17v-38.34A12.82 12.82 0 0 0 435.17 288z'/%3e%3c/svg%3e"
               alt="Image" width="48" height="48"></td>
        <td style="display: none" class="tg-il9k tg-out" id="td20">
          <img v-bind:class="[selected === 'td20' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_LABEL_POSITION="ALIGN_RIGHT"
               data-STYLE_VERTICAL_ALIGN="ALIGN_BOTTOM"
               data-STYLE_ALIGN="ALIGN_LEFT"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M12.83 352h262.34A12.82 12.82 0 0 0 288 339.17v-38.34A12.82 12.82 0 0 0 275.17 288H12.83A12.82 12.82 0 0 0 0 300.83v38.34A12.82 12.82 0 0 0 12.83 352zm0-256h262.34A12.82 12.82 0 0 0 288 83.17V44.83A12.82 12.82 0 0 0 275.17 32H12.83A12.82 12.82 0 0 0 0 44.83v38.34A12.82 12.82 0 0 0 12.83 96zM432 160H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0 256H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z'/%3e%3c/svg%3e"
               alt="Image" width="48" height="48"></td>
      </tr>
      <tr style="display: none">
        <td class="tg-il9k tg-out" id="td21" style="border-top: 5px dashed black; border-right: 5px dashed black;">
          <img v-bind:class="[selected === 'td21' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_BOTTOM"
               data-STYLE_LABEL_POSITION="ALIGN_LEFT"
               data-STYLE_VERTICAL_ALIGN="ALIGN_TOP"
               data-STYLE_ALIGN="ALIGN_RIGHT"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M16 224h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm416 192H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm3.17-384H172.83A12.82 12.82 0 0 0 160 44.83v38.34A12.82 12.82 0 0 0 172.83 96h262.34A12.82 12.82 0 0 0 448 83.17V44.83A12.82 12.82 0 0 0 435.17 32zm0 256H172.83A12.82 12.82 0 0 0 160 300.83v38.34A12.82 12.82 0 0 0 172.83 352h262.34A12.82 12.82 0 0 0 448 339.17v-38.34A12.82 12.82 0 0 0 435.17 288z'/%3e%3c/svg%3e"
               width="48" height="48"></td>
        <td class="tg-il9k tg-out" id="td22">
          <img v-bind:class="[selected === 'td22' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_BOTTOM"
               data-STYLE_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_VERTICAL_ALIGN="ALIGN_TOP"
               data-STYLE_ALIGN="ALIGN_LEFT"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M12.83 352h262.34A12.82 12.82 0 0 0 288 339.17v-38.34A12.82 12.82 0 0 0 275.17 288H12.83A12.82 12.82 0 0 0 0 300.83v38.34A12.82 12.82 0 0 0 12.83 352zm0-256h262.34A12.82 12.82 0 0 0 288 83.17V44.83A12.82 12.82 0 0 0 275.17 32H12.83A12.82 12.82 0 0 0 0 44.83v38.34A12.82 12.82 0 0 0 12.83 96zM432 160H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0 256H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z'/%3e%3c/svg%3e"
               alt="Image" width="48" height="48"></td>
        <td class="tg-il9k tg-out" id="td23">
          <img v-bind:class="[selected === 'td23' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_BOTTOM"
               data-STYLE_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_VERTICAL_ALIGN="ALIGN_TOP"
               data-STYLE_ALIGN="ALIGN_CENTER"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M432 160H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0 256H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM108.1 96h231.81A12.09 12.09 0 0 0 352 83.9V44.09A12.09 12.09 0 0 0 339.91 32H108.1A12.09 12.09 0 0 0 96 44.09V83.9A12.1 12.1 0 0 0 108.1 96zm231.81 256A12.09 12.09 0 0 0 352 339.9v-39.81A12.09 12.09 0 0 0 339.91 288H108.1A12.09 12.09 0 0 0 96 300.09v39.81a12.1 12.1 0 0 0 12.1 12.1z'/%3e%3c/svg%3e"
               alt="Image" width="48" height="48"></td>
        <td class="tg-il9k tg-out" id="td24">
          <img v-bind:class="[selected === 'td24' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_BOTTOM"
               data-STYLE_LABEL_POSITION="ALIGN_CENTER"
               data-STYLE_VERTICAL_ALIGN="ALIGN_TOP"
               data-STYLE_ALIGN="ALIGN_RIGHT"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M16 224h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm416 192H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm3.17-384H172.83A12.82 12.82 0 0 0 160 44.83v38.34A12.82 12.82 0 0 0 172.83 96h262.34A12.82 12.82 0 0 0 448 83.17V44.83A12.82 12.82 0 0 0 435.17 32zm0 256H172.83A12.82 12.82 0 0 0 160 300.83v38.34A12.82 12.82 0 0 0 172.83 352h262.34A12.82 12.82 0 0 0 448 339.17v-38.34A12.82 12.82 0 0 0 435.17 288z'/%3e%3c/svg%3e"
               width="48" height="48"></td>
        <td class="tg-il9k tg-out" id="td25" style="border-left: 5px dashed black; border-top: 5px dashed black;">
          <img v-bind:class="[selected === 'td25' ? 'selectedImg' : 'unselectedImg']"
               @click="select($event)"
               data-STYLE_VERTICAL_LABEL_POSITION="ALIGN_BOTTOM"
               data-STYLE_LABEL_POSITION="ALIGN_RIGHT"
               data-STYLE_VERTICAL_ALIGN="ALIGN_TOP"
               data-STYLE_ALIGN="ALIGN_LEFT"
               src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3e%3cpath fill='%23000000' d='M12.83 352h262.34A12.82 12.82 0 0 0 288 339.17v-38.34A12.82 12.82 0 0 0 275.17 288H12.83A12.82 12.82 0 0 0 0 300.83v38.34A12.82 12.82 0 0 0 12.83 352zm0-256h262.34A12.82 12.82 0 0 0 288 83.17V44.83A12.82 12.82 0 0 0 275.17 32H12.83A12.82 12.82 0 0 0 0 44.83v38.34A12.82 12.82 0 0 0 12.83 96zM432 160H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0 256H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z'/%3e%3c/svg%3e"
               alt="Image" width="48" height="48"></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: "alignment",
  data() {
    return {
      pickerFixed: null,
      graph: null,
      content: null,
      wnd: null,
      selected: "tdxx",
    }
  },
  props: {
    cell: {
      type: Object,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    select: function($event) {
      console.dir($event);
      //this.selected = $event.target.parentElement.id;
      //console.dir(this.selected);
      console.log($event.target.dataset.style_label_position);
      console.log($event.target.dataset.style_vertical_label_position);
      console.log($event.target.dataset.style_align);
      console.log($event.target.dataset.style_vertical_align);
      /*if (that.cell != null) {
        let state = graph.view.getState(this.cell);
        state.style[ mxConstants.STYLE_FILLCOLOR ] = color.rgbaString;
        state.shape.apply(state);
        state.shape.redraw();
      }*/
      if (this.cell != null) {
        let state = this.graph.view.getState(this.cell);
        state.style[ mxConstants.STYLE_LABEL_POSITION ] = mxConstants[ $event.target.dataset[ 'style_label_position' ] ];
        state.style[ mxConstants.STYLE_VERTICAL_LABEL_POSITION ] = mxConstants[ $event.target.dataset[ 'style_vertical_label_position' ] ];
        state.style[ mxConstants.STYLE_VERTICAL_ALIGN ] = mxConstants[ $event.target.dataset[ 'style_vertical_align' ] ];
        state.style[ mxConstants.STYLE_ALIGN ] = mxConstants[ $event.target.dataset[ 'style_align' ] ];
        let cellStyleSplitted = this.cell.style.split(';');
        this.cell.style = cellStyleSplitted[ 0 ] + ';' + cellStyleSplitted[ 1 ] + ';' +
            mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=' + state.style[ mxConstants.STYLE_VERTICAL_LABEL_POSITION ] + ';' +
            mxConstants.STYLE_LABEL_POSITION + '=' + state.style[ mxConstants.STYLE_LABEL_POSITION ] + ';' +
            mxConstants.STYLE_VERTICAL_ALIGN + '=' + state.style[ mxConstants.STYLE_VERTICAL_ALIGN ] + ';' +
            mxConstants.STYLE_ALIGN + '=' + state.style[ mxConstants.STYLE_ALIGN ] + ';';
        //state.shape.initStyles();
        state.shape.apply(state);

        //state.shape.redraw();
        mxCellRenderer.prototype.redrawLabel(state, true);
        //state.shape.redrawShape();
        //state.shape.initStyles();
        //state.shape.redrawHtmlShape();
      }
    },
    showModalWindow: function(graph, title, content, width, height) {
      let that = this;
      let background = document.createElement('div');
      background.style.position = 'absolute';
      background.style.left = '0px';
      background.style.top = '0px';
      background.style.right = '0px';
      background.style.bottom = '0px';
      background.style.background = 'black';
      mxUtils.setOpacity(background, 0);
      document.body.appendChild(background);
      if (mxClient.IS_IE) {
        new mxDivResizer(background);
      }
      let x = Math.max(0, document.body.scrollWidth / 2 - width / 2);
      let y = Math.max(10, ( document.body.scrollHeight ||
          document.documentElement.scrollHeight ) / 2 - height * 2 / 3);
      //this.pickerFixed.setting.color = this.cell.getData.config.fillColor;
      //Set the color silently (doesn't trigger .onChange()):
      //this.pickerFixed.setColor(this.cell.getData().config.fillColor, true);
      let wnd = new mxWindow(title, content, x, y, width, height, false, true);
      wnd.setClosable(true);

      // Fades the background out after after the window has been closed
      wnd.addListener(mxEvent.DESTROY, function(evt) {
        if (that.cell != null) {
          let state = graph.view.getState(that.cell);
          //state.style[ STYLE_FILLCOLOR ] = that.cell.getData().config.fillColor;
          state.shape.apply(state);
          state.shape.redraw();
        }
        that.$emit('close', 'false');
        graph.setEnabled(true);
        mxEffects.fadeOut(background, 50, true, 10, 30, true);
      });

      /*graph.setEnabled(false);
      graph.tooltipHandler.hide();*/
      wnd.setVisible(true);
      return wnd;
    }
  },
  mounted() {
    let that = this;
    let graph = this.$store.getters.getEditor.graph;
    this.graph = graph;
    let content = document.createElement('div');
    this.content = content;
    content.append(this.$el);
    //this.wnd = this.showModalWindow(this.graph, 'Color Picker', this.content, 306, 338);
  },
  watch: {
    show: function(newVal, oldVal) { // watch it
      if (newVal === true)
        this.wnd = this.showModalWindow(this.graph, 'Alignment #' + this.cell.getId(), this.content, 188, 155);
    }
  }
}
</script>

<style scoped>
.tg {
  border-collapse: collapse;
  border-spacing: 0;
  margin: 0;
  padding: 0;
  user-select: none;
}

.tg td {
  border-color: black;
  border-style: solid;
  border-width: 1px;
  overflow: hidden;
  padding: 5px 5px;
  word-break: normal;
}

.tg th {
  border-color: black;
  border-style: solid;
  border-width: 1px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: normal;
  overflow: hidden;
  padding: 10px 5px;
  word-break: normal;
}

.tg .tg-il9k {
  border-color: #330001;
  text-align: left;
  vertical-align: top
}

.tg .tg-il9k.tg-in {
  background-color: #caf3b8;
}

.tg .tg-il9k.tg-out {
  background-color: #9cf0ff;
}

.tg .tg-il9k:hover {
  background-color: #93cd77;

}

.tg .tg-il9k:active {
  background-color: #90e54e;

}

.selectedImg {
  background-color: rgba(117, 125, 135, 1);
}

.unselectedImg {
  background-color: rgba(204, 204, 204, .5);
}

.tg-il9k img {
  cursor: pointer;
  border: 3px ridge;
}
</style>