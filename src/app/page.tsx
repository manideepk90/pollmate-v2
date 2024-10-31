import HomePage from "@/app/components/pages/Home";
import NavBar from "./components/navigation/NavBar";

export default function Home() {
  return (
    <div className="w-full h-full">
      <NavBar />
      <HomePage />
    </div>
  );
}
