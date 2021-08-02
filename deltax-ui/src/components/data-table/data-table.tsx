import { Component, Prop, State, Host, h } from '@stencil/core';

export interface Column {
  field: string;
  label: string;
  class: string;
  rowClass: string;
  width: string;
}

export interface Row {
  [key: string]: any;
}


@Component({
  tag: 'dx-data-table',
  styleUrl: 'data-table.scss',
  shadow: false,
})
export class DataTable {
  @Prop() name: string;
  @Prop({ reflect: true }) columns: Column[] | string = [];
  @Prop({ reflect: true }) rows: Row[] | string = [];


  get Columns(): Column[] {
    if (typeof this.columns == "string") {
      return JSON.parse(this.columns) as Column[];
    }

    return this.columns || []
  }

  get Rows(): Row[] {
    if (typeof this.rows == "string") {
      return JSON.parse(this.rows) as Row[];
    }

    return this.rows || []
  }

  @State() value: Date;

  componentWillLoad() {
  }

  renderTableHeaderColumns() {
    return (
      <tr>
        {this.Columns.map(col => <th class={col.class} style={{ width: col.width || '' }} >{col.label || col.field}</th>)}
      </tr>
    )
  }

  renderRow(row: Row) {
    return this.Columns.map(col => {
      return (
        <td class={col.rowClass} innerHTML={row[col.field]} ></td>
      )
    })
  }

  renderTableBodyRows() {
    return this.Rows.map(row => {
      return (
        <tr>
          {this.renderRow(row)}
        </tr>
      )
    })
  }

  render() {
    return (
      <Host>
        <table>
          <thead>
            {this.renderTableHeaderColumns()}
          </thead>
          <tbody>
            {this.renderTableBodyRows()}
          </tbody>
        </table>
      </Host>
    );
  }
}

