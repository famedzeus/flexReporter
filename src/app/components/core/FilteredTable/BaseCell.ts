import { AgRendererComponent } from 'ag-grid-angular'

export class BaseCell implements AgRendererComponent {
  params:any;
  value: any;

  agInit(params:any): void {
    try {
      this.value = params.value !== undefined ? params.value : params.data[params.colDef.field]
    } catch (e) {}
      this.params = params;
  }

  refresh () {
    return false
  }
}
