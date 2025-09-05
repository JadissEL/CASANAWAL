import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HomeHeroProps {
  heroY: any;
  heroOpacity: any;
}

export const HomeHero = ({ heroY, heroOpacity }: HomeHeroProps) => (
  <motion.section className="relative min-h-[72vh] md:min-h-[84vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
    {/* Background */}
    <motion.div className="absolute inset-0" initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: "easeOut" }}>
      <img src="https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=1920&q=80" alt="Cuisine marocaine traditionnelle authentique de CasaNawal" className="w-full h-full object-cover" loading="eager" decoding="async" />
      <div className="absolute inset-0 bg-gradient-to-b from-nuit-900/80 via-nuit-900/50 to-nuit-900/80" />
    </motion.div>

    {/* Content */}
    <div className="relative z-10 container-standard px-4 text-white" style={{ transform: `translateY(${heroY?.get?.() ?? 0}px)`, opacity: heroOpacity }}>
      <div className="grid lg:grid-cols-12 gap-8 items-center py-16">
        {/* Left: copy + CTAs */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs mb-5">
            <span className="opacity-90">Cuisine Marocaine Authentique</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-md">
            CasaNawal
          </h1>
          <p className="mt-4 text-base md:text-xl text-sable-200/90 max-w-2xl leading-relaxed">
            Découvrez l'authenticité de la cuisine marocaine dans un cadre chaleureux et convivial.
          </p>

          {/* Feature chips */}
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-xs border border-white/15">⭐ Note 4.4/5</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-xs border border-white/15">⏱️ Rapide</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-xs border border-white/15">🥗 Ingrédients frais</span>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-terracotta hover:bg-terracotta-600 text-white px-8 py-4 text-base md:text-lg rounded-2xl shadow-soft-lg">
              <Link to="/menu">Voir le Menu<ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/80 text-white hover:bg-white hover:text-nuit-900 px-8 py-4 text-base md:text-lg rounded-2xl">
              <Link to="/contact">Nous Contacter</Link>
            </Button>
          </div>
        </motion.div>

        {/* Right: glass preview card */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35 }} className="lg:col-span-5">
          <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md p-4 sm:p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]">
            <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200"
                alt="Aperçu spécialité CasaNawal"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute top-3 left-3 inline-flex items-center rounded-full bg-terracotta text-white text-xs font-semibold px-3 py-1 shadow-md">Spécialité</div>
              <div className="absolute top-3 right-3 inline-flex items-center rounded-full bg-white/90 text-nuit-900 text-xs font-bold px-3 py-1 shadow">85 MAD</div>
            </div>
            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-lg">Tagine Poulet</h3>
                <p className="text-sm text-sable-200/90 line-clamp-2">Poulet, olives, citrons confits et épices.</p>
              </div>
              <Link to="/menu" className="text-terracotta hover:underline text-sm">Voir</Link>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl border border-white/15 bg-white/10 p-2 text-center">⏱️ 45 min</div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-2 text-center">🔥 Populaire</div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-2 text-center">🥘 Tradition</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </motion.section>
);
