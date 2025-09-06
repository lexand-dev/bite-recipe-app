import { Header } from "~/modules/home/ui/components/header";

const LayoutRoot = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {/* <Sidebar /> */}
      <main>{children}</main>
      {/* <Footer /> */}
    </>
  );
};

export default LayoutRoot;
