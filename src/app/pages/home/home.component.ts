import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { userSelector } from "../../store/authentication/authentication.selector";
import { AsyncPipe } from "@angular/common";
import { HomeCardComponent } from "../../components/home-card/home-card.component";
import { EChartsOption } from "echarts";
import { NgxEchartsDirective } from "ngx-echarts";
import {
  weeklyContributionsLoadedSelector,
  weeklyContributionsSelector,
} from "../../store/weekly-contributions/weekly-contributions.selector";
import { setWeeklyContributions } from "../../store/weekly-contributions/weekly-contributions.actions";
import { LeaderboardService } from "../../services/leaderboard.service";
import { of, switchMap } from "rxjs";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [AsyncPipe, HomeCardComponent, NgxEchartsDirective],
  templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit {
  user$ = this.store.pipe(select(userSelector));
  weeklyContributionsLoaded$ = this.store.pipe(
    select(weeklyContributionsLoadedSelector),
  );
  weeklyContributions$ = this.store.pipe(select(weeklyContributionsSelector));
  chartOptions?: EChartsOption;

  constructor(
    private store: Store,
    private leaderboard: LeaderboardService,
  ) {}

  async ngOnInit() {
    this.user$ // Check if the user is loaded
      .pipe(
        switchMap((user) =>
          user ? this.weeklyContributionsLoaded$ : of(true),
        ),
      )
      .subscribe((loaded) => {
        // Check if the weekly contributions are loaded
        if (!loaded) {
          this.leaderboard.getWeeklyContributions().then((data) => {
            console.log(data);
            this.store.dispatch(setWeeklyContributions(data));
          });
        }
      });

    // Subscribe to the data till it's loaded
    this.weeklyContributions$.subscribe((data) => {
      if (data && data.length > 0) {
        this.chartOptions = this.getChartOptions(data); // Update the chart options
      }
    });
  }

  getChartOptions(data: { day: Date; value: number }[]): EChartsOption {
    return {
      xAxis: {
        data: data.map((d) => d.day.toString().slice(0, 3).toUpperCase()),
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
          data: data.map((value, idx) => ({
            value: value.value,
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
}
