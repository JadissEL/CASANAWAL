import { motion } from "framer-motion";

interface HomeStatsProps {
  menuStats: any;
}

export const HomeStats = ({ menuStats }: HomeStatsProps) => (
  <motion.section className="py-16 bg-gradient-to-b from-white to-sable-50" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
    <div className="container-standard">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {[
          { value: menuStats?.stats?.total_products || 0, label: 'Plats Authentiques' },
          { value: menuStats?.stats?.average_rating || 4.8, label: 'Note Moyenne' },
          { value: menuStats?.stats?.total_reviews || 0, label: 'Avis Clients' },
          { value: menuStats?.stats?.vegetarian_count || 0, label: 'Options Végétariennes' },
        ].map((item) => (
          <div key={item.label} className="text-center p-4 rounded-2xl bg-white shadow-soft border border-sable-200">
            <div className="text-3xl md:text-4xl font-extrabold text-nuit-900 mb-1 tracking-tight">{item.value}</div>
            <p className="text-nuit-600 text-sm md:text-base">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  </motion.section>
);
