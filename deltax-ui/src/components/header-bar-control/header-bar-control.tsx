import { Component, State, h } from '@stencil/core';
import Common from '../../services/Common';
import RtTimer from '../../services/RtTimer';



@Component({
  tag: 'dx-header-bar-control',
  styleUrl: 'header-bar-control.scss',
  shadow: false,
})
export class HeaderBarControl {
  private timeout: number = 1000;

  @State() date: Date;

  componentWillLoad() {
    this.loadTimer();
  }

  loadTimer() {
    let timer = RtTimer.get(this.timeout);
    timer.subscribe((d) => {
      this.date = d
    })
    this.date = timer.state.date
  }

  render() {
    return (
      <div class="dx-header-bar-control">
        <details class="dropdown details-reset details-overlay d-inline-block">
          <summary class="p-2 d-inline" aria-haspopup="true">
            Theme
            <div class="m-2 dropdown-caret"></div>
          </summary>

          <ul class="dropdown-menu dropdown-menu-s">
            <li><a role="button" class="dropdown-item" onClick={() => Common.setTheme("light")}  >Light</a></li>
            <li><a role="button" class="dropdown-item" onClick={() => Common.setTheme("dark")}>Dark</a></li>
            <li><a role="button" class="dropdown-item" onClick={() => Common.setTheme("dark_dimmed")}>Dark Dimmed</a></li>
          </ul>
        </details>
        <span class="time mx-2">{this.date.toLocaleTimeString()}</span>
      </div>
    );
  }
}
