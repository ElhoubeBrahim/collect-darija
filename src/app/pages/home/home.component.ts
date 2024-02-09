import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { userSelector } from "../../store/authentication/authentication.selector";
import { AuthenticationService } from "../../services/authentication.service";
import { AsyncPipe } from "@angular/common";
import { HomeCardComponent } from "../../components/home-card/home-card.component";
import { EChartsOption } from "echarts";
import { NgxEchartsDirective } from "ngx-echarts";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [AsyncPipe, HomeCardComponent, NgxEchartsDirective],
  templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit {
  user$ = this.store.pipe(select(userSelector));
  stats = {
    translations: 0,
    validatedTranslations: 0,
    recordings: 0,
    validatedRecordings: 0,
  };
  weeklyContributions = [10, 5, 26, 14, 3, 34, 20];
  options: EChartsOption = {};

  constructor(
    private store: Store,
    private authentication: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.options = {
      xAxis: {
        data: ["M", "T", "W", "T", "F", "S", "S"],
        silent: false,
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {},
      series: [
        {
          type: "bar",
          data: this.weeklyContributions.map((value, idx) => ({
            value,
            itemStyle: {
              color: idx % 2 === 0 ? "#F06225" : "#AEB8C5",
            },
          })),
          itemStyle: {
            borderRadius: [10, 10, 0, 0],
          },
          animationDelay: (idx) => idx * 10,
        },
      ],
      animationEasing: "elasticOut",
      animationDelayUpdate: (idx) => idx * 5,
    };
  }

  async logout() {
    await this.authentication.logout();
  }
}
