import { useTranslation } from "../hooks/useTranslation";
import "./Schedule.css";

export default function Schedule() {
  const { t } = useTranslation();
  const schedule = [
    {
      month: "April 2026",
      events: [
        { date: "April 25", title: "Member Social Networking", time: "6:00 PM - 8:00 PM" },
        { date: "April 28", title: "Mineralogy Workshop", time: "9:00 AM - 4:00 PM" },
      ],
    },
    {
      month: "May 2026",
      events: [
        { date: "May 5", title: "Seismic Safety Seminar", time: "2:00 PM - 5:00 PM" },
        { date: "May 15-17", title: "Annual Geological Conference", time: "8:00 AM - 5:00 PM" },
        { date: "May 22", title: "Student Geology Challenge", time: "9:00 AM - 3:00 PM" },
      ],
    },
    {
      month: "June 2026",
      events: [
        { date: "June 1-7", title: "Field Research Expedition", time: "All Day" },
        { date: "June 15", title: "Research Presentation Session", time: "10:00 AM - 12:00 PM" },
      ],
    },
  ];

  return (
    <div className="schedule">
      {/* Page Header */}
      <div className="page-header">
        <h1>{t("schedule")}</h1>
        <p>{t("planYourParticipation")}</p>
      </div>

      {/* Schedule Timeline */}
      <section className="schedule-timeline">
        <div className="container">
          {schedule.map((month, idx) => (
            <div key={idx} className="month-section">
              <h2 className="month-title">{month.month}</h2>
              <div className="events-list">
                {month.events.map((event, eventIdx) => (
                  <div key={eventIdx} className="schedule-item">
                    <div className="schedule-left">
                      <div className="schedule-date">{event.date}</div>
                    </div>
                    <div className="schedule-middle">
                      <div className="schedule-line"></div>
                    </div>
                    <div className="schedule-right">
                      <h3>{event.title}</h3>
                      <p className="schedule-time">⏰ {event.time}</p>
                      <button className="btn-detail">{t("viewDetails")}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Calendar View */}
      <section className="calendar-section">
        <div className="container">
          <h2 className="section-title">{t("quickCalendarView")}</h2>
          <div className="calendar-cards">
            <div className="calendar-card">
              <h3>April 2026</h3>
              <div className="calendar-grid">
                <div className="cal-day">Sun</div>
                <div className="cal-day">Mon</div>
                <div className="cal-day">Tue</div>
                <div className="cal-day">Wed</div>
                <div className="cal-day">Thu</div>
                <div className="cal-day">Fri</div>
                <div className="cal-day">Sat</div>
                {[...Array(31)].map((_, i) => (
                  <div key={i} className={`cal-date ${[24, 25, 27, 28].includes(i + 1) ? "event" : ""}`}>
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
            <div className="calendar-card">
              <h3>May 2026</h3>
              <div className="calendar-grid">
                <div className="cal-day">Sun</div>
                <div className="cal-day">Mon</div>
                <div className="cal-day">Tue</div>
                <div className="cal-day">Wed</div>
                <div className="cal-day">Thu</div>
                <div className="cal-day">Fri</div>
                <div className="cal-day">Sat</div>
                {[...Array(31)].map((_, i) => (
                  <div key={i} className={`cal-date ${[4, 5, 14, 15, 16, 17, 21, 22].includes(i + 1) ? "event" : ""}`}>
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="legend-section">
        <div className="container">
          <h2 className="section-title">Event Categories</h2>
          <div className="legend-grid">
            <div className="legend-item">
              <div className="legend-icon">📋</div>
              <h3>Seminars</h3>
              <p>Educational sessions and knowledge sharing</p>
            </div>
            <div className="legend-item">
              <div className="legend-icon">🎤</div>
              <h3>Conferences</h3>
              <p>Large-scale international events</p>
            </div>
            <div className="legend-item">
              <div className="legend-icon">🏔️</div>
              <h3>Expeditions</h3>
              <p>Field research and site investigations</p>
            </div>
            <div className="legend-item">
              <div className="legend-icon">💎</div>
              <h3>Workshops</h3>
              <p>Hands-on training and skill development</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
