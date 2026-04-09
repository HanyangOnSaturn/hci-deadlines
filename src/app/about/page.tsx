import Link from "next/link";

export const metadata = {
  title: "About — HCI Deadline Tracker",
  description: "How HCI Deadline Tracker works, data sources, and how to contribute.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        About HCI Deadline Tracker
      </h1>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          What is this?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          HCI Deadline Tracker is a curated, verified database of submission
          deadlines for top Human-Computer Interaction conferences and journals.
          It helps HCI researchers, PhD students, and graduate students plan
          their submission pipelines.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Which venues are tracked?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          We track 25 venues across 7 categories:
        </p>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
          <li><strong>Flagship:</strong> CHI, UIST, CSCW, UbiComp/IMWUT</li>
          <li><strong>Design & Creativity:</strong> DIS, TEI, C&C</li>
          <li><strong>Intelligent Interfaces:</strong> IUI, ICMI, HAI</li>
          <li><strong>Accessibility & Children:</strong> ASSETS, IDC</li>
          <li><strong>Mobile, Surfaces & Regional:</strong> MobileHCI, ISS, NordiCHI, OzCHI, INTERACT</li>
          <li><strong>Visualization:</strong> IEEE VIS</li>
          <li><strong>Journals:</strong> TOCHI, IJHCS, HCI Journal, BIT, CSCW Journal</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          How is the data collected?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Every deadline is manually verified against the official conference or
          journal website. Each venue record includes a link to the source where
          the dates were confirmed, and the date of last verification.
        </p>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          We prioritize accuracy over automation. Dates are not scraped
          automatically — they are verified by a human before publication.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Timezone policy
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          All deadlines are displayed in AoE (Anywhere on Earth, UTC-12) unless
          the conference specifies otherwise. This is the most commonly used
          timezone for academic deadlines and is the most permissive — if a
          deadline is 11:59 PM AoE, it means you have until the last timezone on
          Earth reaches that time.
        </p>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Countdown timers automatically convert to your local timezone.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Important disclaimer
        </h2>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:bg-amber-900/20 dark:border-amber-800">
          <p className="text-amber-800 dark:text-amber-300 text-sm">
            While we strive for accuracy, deadlines can change without notice.
            Conferences may extend deadlines, change submission systems, or
            modify policies. <strong>Always verify deadlines with the official
            conference website before submitting.</strong>
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Report an error
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Found an incorrect deadline or missing venue? Please open an issue or
          submit a pull request on our GitHub repository. The venue data is
          stored as a YAML file, making it easy to review and contribute.
        </p>
      </section>

      <div className="pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
