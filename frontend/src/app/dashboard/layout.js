import "../globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import DashNav from "./DashNav";
import styles from "./DashShell.module.css";

export const metadata = {
  title: "Dashboard | Sidewalk",
  description: "Internal dashboard — protected access only.",
};

export default function DashboardLayout({ children }) {
  return (
    <>
      <div className={styles.shell}>
        <DashNav />
        <main className={styles.content}>{children}</main>
      </div>
      <SpeedInsights />
    </>
  );
}
