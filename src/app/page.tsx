import NavigationBar from "@/components/NavigationBar";
import HeroLanding from "@/components/HeroLanding";
import FooterLanding from "@/components/FooterLanding";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <NavigationBar />
      <HeroLanding />
      <FooterLanding />
    </div>
  );
}
