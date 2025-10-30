import { Metadata } from "next";
import CadastroView from "./components/CadastroView";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Cadastro - Finexus",
  description: "Faça cadastro na plataforma Finexus",
  openGraph: {
    title: "Cadastro - Finexus",
    description: "Faça cadastro na plataforma Finexus",
    images: ["/url-image.png"],
  },
};

export default function CadastroPage() {
  return <CadastroView />;
}
