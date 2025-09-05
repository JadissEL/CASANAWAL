import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { containerVariants } from "./about/about-animations";
import { AboutBreadcrumb } from "./about/about-breadcrumb";
import { AboutHeader } from "./about/about-header";
import { AboutHero } from "./about/about-hero";
import { AboutValues } from "./about/about-values";
import { AboutJourney } from "./about/about-journey";
import { AboutContact } from "./about/about-contact";

const About = () => {

  return (
    <div className="page-layout">
      <Navigation />

      <main className="relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16"
        >
          <AboutBreadcrumb />
          <AboutHeader />
          <AboutHero />
          <AboutValues />
          <AboutJourney />
          <AboutContact />
        </motion.div>
      </main>
    </div>
  );
};

export default About;
