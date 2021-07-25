import { Component, Prop, State, h, Listen } from '@stencil/core';
import RtTimer from '../../services/RtTimer';
import { Get } from "../../api/request"


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
  private timeout: number = 1000;

  @Prop() menuUrl: string = 'menu.json';
  @State() date: Date;
  @State() menu: IHeaderMenu = defaultMenu;
  @State() currentTab: IItem;

  componentWillLoad() {
    this.loadTimer();
    this.getMenu();
  }

  loadTimer() {
    let timer = RtTimer.get(this.timeout);
    timer.subscribe((d) => {
      this.date = d
    })
    this.date = timer.state.date
  }

  getMenu() {
    Get<IHeaderMenu>(this.menuUrl).then(json => {
      this.menu = Object.assign({}, defaultMenu, json);
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
    return items.map(item => {
      return (
        <li class="breadcrumb-item" style={
          { "--color": item.color, "--last-child-color": item.color }}>
          <a href={item.url} >{item.title}</a>
        </li>
      )
    })
  }

  render() {
    return (
      <div class="dx-header-bar header">
        <div class="logo"></div>
        <div class="items flex">
          <div class="grow-4 flex flex-md gap-3 items-center ">
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
          <span><b> {this.date.toLocaleTimeString()}</b></span>
        </div>
      </div>
    );
  }
}
