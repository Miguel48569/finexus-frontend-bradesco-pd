"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Store,
  TrendingUp,
  Shield,
  Users,
  ArrowUpRight,
  Sparkles,
  ChevronDown,
  Target,
  Zap,
  Clock,
  CheckCircle,
} from "lucide-react";

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  text: string;
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Remove o scroll interno do body
    document.body.style.overflow = "visible";
    document.body.style.height = "auto";

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.querySelector(id);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <motion.header
        animate={{
          backgroundColor: scrolled
            ? "rgba(255,255,255,0.98)"
            : "rgba(0,0,0,0.5)",
          backdropFilter: "blur(12px)",
          boxShadow: scrolled
            ? "0 4px 20px rgba(0,0,0,0.08)"
            : "0 2px 10px rgba(0,0,0,0.15)",
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 w-full z-50 px-4 md:px-16 py-4"
      >
        <div className="container mx-auto flex justify-between items-center">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Image
              src="/logo-finexus-df.png"
              alt="Finexus Logo"
              width={160}
              height={30}
              priority
              className="cursor-pointer"
              onClick={() => scrollToSection("#inicio")}
            />
          </motion.div>

          <nav className="flex items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection("#inicio")}
              className={`font-semibold transition-colors ${
                scrolled
                  ? "text-gray-900 hover:text-[#6b34c8]"
                  : "text-white hover:text-[#d43bfc]"
              }`}
              style={
                !scrolled ? { textShadow: "0 2px 4px rgba(0,0,0,0.3)" } : {}
              }
            >
              Início
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection("#sobre")}
              className={`font-semibold transition-colors ${
                scrolled
                  ? "text-gray-900 hover:text-[#6b34c8]"
                  : "text-white hover:text-[#d43bfc]"
              }`}
              style={
                !scrolled ? { textShadow: "0 2px 4px rgba(0,0,0,0.3)" } : {}
              }
            >
              Sobre
            </motion.button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/cadastro"
                className="bg-[#6b34c8] text-white font-semibold py-2 px-5 rounded-lg hover:bg-[#5520b9] transition-all shadow-md hover:shadow-xl"
              >
                Cadastre-se
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/login"
                className={`font-semibold transition-colors ${
                  scrolled
                    ? "text-gray-900 hover:text-[#6b34c8]"
                    : "text-white hover:text-[#d43bfc]"
                }`}
                style={
                  !scrolled ? { textShadow: "0 2px 4px rgba(0,0,0,0.3)" } : {}
                }
              >
                Login
              </Link>
            </motion.div>
          </nav>
        </div>
      </motion.header>

      {/* HERO */}
      <section
        id="inicio"
        className="relative h-screen flex items-center justify-center text-white overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/fundoPage.png"
            alt="Background"
            fill
            className="object-cover"
            priority
            quality={90}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-[#6b34c8]/40 to-black/60"></div>
        </div>

        {/* Partículas flutuantes */}
        <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#d43bfc]/30 rounded-full"
              animate={{
                y: [0, -150, 0],
                x: [0, i % 2 === 0 ? 50 : -50, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 8 + (i % 5),
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                left: `${(i * 7) % 100}%`,
                top: `${(i * 13) % 100}%`,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-20 container mx-auto text-left px-4 md:px-16 max-w-5xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="flex items-center gap-2 mb-6"
          >
            <Sparkles className="w-6 h-6 text-[#d43bfc]" />
            <span className="text-[#d43bfc] font-semibold text-sm uppercase tracking-wider">
              Plataforma de Crédito Colaborativo
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
          >
            Invista no <span className="text-[#d43bfc]">Futuro</span> das{" "}
            <br className="hidden md:block" />
            Empresas Brasileiras
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-lg md:text-xl max-w-2xl mb-10 text-gray-200 leading-relaxed"
          >
            Conectamos investidores a oportunidades de crescimento em empresas
            promissoras, gerando valor para todos. Crédito ágil para MEIs e
            retorno atrativo para investidores.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 40px rgba(107, 52, 200, 0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection("#sobre")}
              className="bg-[#6b34c8] text-white font-semibold py-4 px-8 rounded-lg hover:bg-[#5520b9] transition-all shadow-xl flex items-center justify-center gap-2"
            >
              Saiba Mais
              <ArrowUpRight className="w-5 h-5" />
            </motion.button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/cadastro"
                className="bg-transparent border-2 border-white text-white font-semibold py-4 px-8 rounded-lg hover:bg-white/10 transition-all backdrop-blur-sm flex items-center justify-center gap-2"
              >
                Começar Agora
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="cursor-pointer"
            onClick={() => scrollToSection("#sobre")}
          >
            <ChevronDown className="w-8 h-8 text-white/70" />
          </motion.div>
        </motion.div>
      </section>

      {/* SOBRE */}
      <motion.section
        id="sobre"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
        className="bg-gradient-to-b from-white to-gray-50 py-28"
      >
        <div className="container mx-auto px-4 md:px-16 text-center max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <span className="text-[#6b34c8] font-semibold text-sm uppercase tracking-wider">
              Nossa Missão
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            O Futuro do Crédito é{" "}
            <span className="text-[#6b34c8]">Colaborativo</span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600 mb-20 leading-relaxed">
            A Finexus nasceu para resolver um grande desafio: simplificar o
            acesso ao crédito para microempreendedores individuais (MEI) e, ao
            mesmo tempo, criar oportunidades de investimento com impacto real e
            retorno atrativo para investidores pessoas físicas.
          </p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              visible: {
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            <BenefitCard
              icon={<Store className="w-12 h-12 text-[#6b34c8] mb-4" />}
              title="Para Microempreendedores (MEI)"
              text="Acesse crédito rápido e sem burocracia para expandir seu negócio. Análise de crédito automatizada para agilizar sua aprovação."
            />
            <BenefitCard
              icon={<TrendingUp className="w-12 h-12 text-[#6b34c8] mb-4" />}
              title="Para Investidores"
              text="Diversifique sua carteira com investimentos de impacto social. Transparência total sobre rentabilidade e gestão de risco."
            />
          </motion.div>
        </div>
      </motion.section>

      {/* COMO FUNCIONA */}
      <motion.section
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.2 }}
        className="bg-white py-28"
      >
        <div className="container mx-auto px-4 md:px-16 max-w-6xl">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <span className="text-[#6b34c8] font-semibold text-sm uppercase tracking-wider">
                Processo Simples
              </span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Como Funciona a Finexus?
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Um processo 100% digital que conecta quem precisa de crédito com
              quem quer investir
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProcessStep
              number="01"
              icon={<Users className="w-10 h-10 text-[#6b34c8]" />}
              title="Cadastro Simplificado"
              description="MEIs e investidores se cadastram na plataforma de forma rápida e segura com validação via Open Finance."
            />
            <ProcessStep
              number="02"
              icon={<Target className="w-10 h-10 text-[#6b34c8]" />}
              title="Análise Automatizada"
              description="Sistema avalia automaticamente o perfil de crédito e disponibiliza projetos no marketplace para investidores."
            />
            <ProcessStep
              number="03"
              icon={<Zap className="w-10 h-10 text-[#6b34c8]" />}
              title="Investimento & Crédito"
              description="Investidores escolhem projetos, aplicam capital e MEIs recebem o crédito aprovado de forma ágil."
            />
          </div>
        </div>
      </motion.section>

      {/* DIFERENCIAIS */}
      <motion.section
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.2 }}
        className="bg-gradient-to-br from-[#6b34c8] via-[#5520b9] to-[#461592] text-white py-24 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="20" cy="20" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 md:px-16 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <span className="text-[#d43bfc] font-semibold text-sm uppercase tracking-wider">
                Diferenciais
              </span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Por que escolher a Finexus?
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-violet-100">
              Nossa plataforma oferece segurança, transparência e oportunidades
              únicas de investimento colaborativo.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              visible: {
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            <FeatureCard
              title="Processo Ágil"
              description="Análise de crédito automatizada e aprovação rápida. Receba seu crédito em poucos dias após a aprovação."
              icon={<Clock className="w-12 h-12 text-[#6b34c8]" />}
            />
            <FeatureCard
              title="Segurança Garantida"
              description="Análise de crédito rigorosa e automatizada. Todas as empresas passam por due diligence completa."
              icon={<Shield className="w-12 h-12 text-[#6b34c8]" />}
            />
            <FeatureCard
              title="100% Digital"
              description="Todo o processo online: desde o cadastro até o pagamento das parcelas via PIX integrado."
              icon={<Zap className="w-12 h-12 text-[#6b34c8]" />}
            />
          </motion.div>
        </div>
      </motion.section>

      {/* CTA FINAL */}
      <motion.section
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
        className="bg-gradient-to-br from-[#6b34c8] to-[#461592] text-white py-28"
      >
        <div className="container mx-auto px-4 md:px-16 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Pronto para Começar?
            </h2>
            <p className="text-xl text-violet-100 mb-12 max-w-2xl mx-auto">
              Seja você um empreendedor buscando crédito ou um investidor
              buscando rentabilidade, a Finexus é o lugar certo para você.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/cadastro"
                  className="inline-flex items-center gap-2 bg-white text-[#6b34c8] font-semibold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all shadow-xl"
                >
                  Cadastre-se Agora
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white font-semibold py-4 px-8 rounded-lg hover:bg-white/10 transition-all"
                >
                  Já tenho conta
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

/* SUBCOMPONENTES */
const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, text }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0 },
    }}
    transition={{ duration: 0.6 }}
    whileHover={{
      y: -8,
      boxShadow: "0 20px 40px rgba(107, 52, 200, 0.25)",
    }}
    className="bg-white rounded-2xl p-10 border border-gray-100 shadow-lg hover:border-[#6b34c8] transition-all cursor-pointer group"
  >
    <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>{icon}</motion.div>
    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#6b34c8] transition-colors">
      {title}
    </h3>
    <p className="text-gray-600 leading-relaxed">{text}</p>
  </motion.div>
);

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0 },
    }}
    transition={{ duration: 0.6 }}
    whileHover={{
      y: -8,
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
    }}
    className="bg-white p-10 rounded-2xl shadow-xl text-center group cursor-pointer"
  >
    <motion.div
      className="inline-block mb-6 p-4 bg-[#f4ecff] rounded-2xl"
      whileHover={{ scale: 1.1, rotate: 5 }}
    >
      {icon}
    </motion.div>
    <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-[#6b34c8] transition-colors">
      {title}
    </h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);

const ProcessStep: React.FC<{
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ number, icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    whileHover={{ y: -8 }}
    className="relative bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-[#6b34c8] transition-all cursor-pointer group"
  >
    <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#6b34c8] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
      {number}
    </div>
    <div className="mb-4 inline-block p-3 bg-[#f4ecff] rounded-xl group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#6b34c8] transition-colors">
      {title}
    </h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);
