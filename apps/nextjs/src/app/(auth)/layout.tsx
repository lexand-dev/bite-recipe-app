const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Bite <span className="text-primary">T3</span>
        </h1>

        {children}
      </div>
    </main>
  );
};

export default Layout;
