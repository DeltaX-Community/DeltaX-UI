import { Component, Prop, State, h, Listen } from '@stencil/core';
import api from "../../api/request"


export interface IItem {
  title: string;
  url: string;
  color?: string;
  icon?: string;
}

export interface IHeaderMenu {
  title: string;
  home: string;
  header: string;
  logoHtml: string;
  items: IItem[];
  tabs: IItem[];
}

var defaultMenu: IHeaderMenu = {
  title: "Planta Demo",
  home: "/#home.html",
  header: "/#header.html",
  logoHtml: "<i class='fas fa-sun text-xl lg:text-4xl'></i>",
  items: [],
  tabs: [],
};

@Component({
  tag: 'dx-header-bar',
  styleUrl: 'header-bar.scss',
  shadow: false,
})
export class HeaderBar {

  @Prop() menuUrl: string = 'menu.json';
  @State() menu: IHeaderMenu = defaultMenu;
  @State() currentTab: IItem;

  componentWillLoad() {
    this.getMenu();
  }

  getMenu() {
    api.Get<IHeaderMenu>(this.menuUrl).then(json => {
      this.menu = Object.assign({}, defaultMenu, json);
      console.log("The menu:", this.menu)
      this.updateCurrentTab();
    });
  }

  @Listen('popstate', { target: 'window' })
  updateCurrentTab() {
    this.currentTab = this.menu.tabs?.find((i) => i.url == location.hash);
    console.log("updateCurrentTab", this.currentTab);
  }

  renderTabs(items: IItem[]) {
    return items.map(item => {
      return (
        <a
          href={item.url}
          style={{ '--color': item.color }}
          class={{ "active": item.url == this.currentTab?.url }} >
          {item.title}
        </a>
      )
    })
  }

  renderBreadcrumb(items: IItem[]) {
    const len = items.length;
    return items.map((item, idx) => {
      if (len > idx + 1) {
        return (
          <li class="breadcrumb-item pr-1" style={
            { "--color-text-link": item.color || "var(--color-header-text)" }}>
            <a href={item.url} >{item.title}</a>
          </li>
        )
      }
      else {
        return (
          <li class="breadcrumb-item" style={{ "color": item.color || "var(--color-header-logo)" }} aria-current="page">
            {item.title}
          </li>
        )
      }
    })
  }

  render() {
    return (
      <div class="dx-header-bar header">
        <div class="logo">
          <img alt="Antares Technologies" src="/assets/img/logo-antares.png" />
        </div>
        <div class="items">
          <div >
            {/* <div>{this.menu.title}</div> */}
            <div class="breadcrumb">
              {this.renderBreadcrumb(this.menu.items)}
            </div>
            <div class="extra-links">
              <dx-page-loader template-url={this.menu.header}></dx-page-loader>
            </div>
          </div>
          <div class="tabs">
            {this.renderTabs(this.menu.tabs)}
          </div>
        </div>
        <div class="controls">
          <dx-header-bar-control></dx-header-bar-control>
        </div>
      </div>
    );
  }
}
