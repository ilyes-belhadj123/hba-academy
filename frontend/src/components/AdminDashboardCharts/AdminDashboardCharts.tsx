import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { StatFormationDemandee, StatParSource } from '../../types/stats'
import './AdminDashboardCharts.css'

const COLOR_TOTAL = '#2a78d6'
const COLOR_CONVERTIS = '#eb6834'
const COLOR_INK_MUTED = '#898781'
const COLOR_GRIDLINE = '#e1e0d9'
const COLOR_INK_PRIMARY = '#0b0b0b'

interface AdminDashboardChartsProps {
  parSource: StatParSource[]
  formationsLesPlusDemandees: StatFormationDemandee[]
}

export function AdminDashboardCharts({ parSource, formationsLesPlusDemandees }: AdminDashboardChartsProps) {
  return (
    <div className="admin-dashboard-charts">
      <div className="admin-dashboard-charts__chart">
        <h3>Leads par canal</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={parSource} barGap={2} barCategoryGap="20%">
            <CartesianGrid stroke={COLOR_GRIDLINE} vertical={false} />
            <XAxis dataKey="source" tick={{ fill: COLOR_INK_MUTED, fontSize: 12 }} axisLine={{ stroke: COLOR_GRIDLINE }} tickLine={false} />
            <YAxis tick={{ fill: COLOR_INK_MUTED, fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 12, color: COLOR_INK_PRIMARY }} />
            <Bar name="Total" dataKey="total" fill={COLOR_TOTAL} radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar name="Convertis" dataKey="convertis" fill={COLOR_CONVERTIS} radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="admin-dashboard-charts__chart">
        <h3>Formations les plus demandées</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={formationsLesPlusDemandees} layout="vertical" margin={{ left: 24 }}>
            <CartesianGrid stroke={COLOR_GRIDLINE} horizontal={false} />
            <XAxis type="number" tick={{ fill: COLOR_INK_MUTED, fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="formation_titre"
              width={160}
              tick={{ fill: COLOR_INK_MUTED, fontSize: 11 }}
              axisLine={{ stroke: COLOR_GRIDLINE }}
              tickLine={false}
            />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Bar name="Demandes" dataKey="total" fill={COLOR_TOTAL} radius={[0, 4, 4, 0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
