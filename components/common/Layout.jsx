import { cn } from "@/lib/utils";

const Layout = ({ className = "", children, top = false }) => {
  return (
    <div
      className={cn(
        "relative h-screen w-screen overflow-hidden px-6",
        className,
        top && "pt-14",
      )}
    >
      {children}
    </div>
  );
};

export default Layout;
