export default function StatCard({ title, value, icon: Icon, color = 'primary', trend }) {
  const colorClasses = {
    primary: 'from-primary/20 to-primary/5 text-primary border-primary/20',
    green: 'from-green-500/20 to-green-500/5 text-green-400 border-green-500/20',
    blue: 'from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/20',
    amber: 'from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/20',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-5 transition-all hover:scale-[1.02]`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-2.5 rounded-lg bg-white/5">
            <Icon className="text-xl" />
          </div>
        )}
      </div>
    </div>
  );
}
