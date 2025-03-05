import { SessionProvider } from "next-auth/react";

type BaseLayoutProps = {
  children: React.ReactNode;
};

export default function BaseLayout({ children }: BaseLayoutProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
