import Hero from "../components/Hero";
import EventList1 from "../components/EventList1";
import EventStats from "../components/EventStats";

export default function Home() {
  return (
    <div>
      <Hero />
      <EventStats />
      <EventList1 />
    </div>
  );
}
