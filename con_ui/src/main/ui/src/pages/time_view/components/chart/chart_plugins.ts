// charts
import { Chart, Plugin } from 'chart.js';

// local
import { TimeHelper } from '../../../../utility/time_helper';

//
export interface ChartPluginProps {
    textColor: string;
    textFontSize: number;
}

//
export const chartPlugins = (props: ChartPluginProps): Plugin<'line'>[] => {
    const tickLables = (chart: Chart) => {
        const ctx = chart.ctx;
        const xScale = chart.scales.x;
        const yScale = chart.scales.y;

        ctx.save();
        ctx.fillStyle = props.textColor;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = `${props.textFontSize}px Arial`;

        yScale.ticks.forEach((tick, index) => {
            if ((index < 3 && index !== 0) || (index >= 3 && index % 3 !== 0))
                return;
            const x = xScale.getPixelForValue(xScale.min);
            const y = yScale.getPixelForTick(index);

            const date = new Date(tick.value);
            const label = TimeHelper.showTime(date);

            if (length === undefined) return;
            ctx.fillText(label, x, y - 10);
        });

        ctx.restore();
    };

    return [
        {
            id: 'timeLablePlugin',
            beforeDraw: tickLables,
        },
    ];
};
