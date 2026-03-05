import Slidebar from './Slidebar';
const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Slidebar />
      <main className="flex-1 ml-64 p-8 transition-all bg-slate-50">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;