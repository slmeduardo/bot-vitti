import Image from "next/image";
import TabsComponent from "./components/TabsComponent";

export default function Home() {
  return (
    <>
      <div className="bg-gray-900">
        <div className="container mx-auto py-10">
          <div>
            <Image width={100} height={100} alt="logo" src="/logo.svg" />
          </div>
          <TabsComponent />
        </div>
      </div>
    </>
  );
}
