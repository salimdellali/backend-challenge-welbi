import Image from "next/image"

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              GET{" "}
            </code>
            Something that:
            <ul className="list-disc list-inside mt-2 ml-6">
              <li>
                <a
                  href="api/recommend/interesting-program-names?residentname=Darla Blanda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:underline hover:underline-offset-4"
                >
                  Darla Blanda would like
                  <Image
                    aria-hidden
                    src="/open-in-new-tab.svg"
                    alt="Open in new tab icon"
                    width={16}
                    height={16}
                  />
                </a>
              </li>
              <li>
                <a
                  href="api/recommend/interesting-program-names?residentname=randal rau"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:underline hover:underline-offset-4"
                >
                  randal rau would like
                  <Image
                    aria-hidden
                    src="/open-in-new-tab.svg"
                    alt="Open in new tab icon"
                    width={16}
                    height={16}
                  />
                </a>
              </li>
              <li>
                <a
                  href="api/recommend/interesting-program-names?residentname=Gordon Freeman"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:underline hover:underline-offset-4"
                >
                  Gordon Freeman would like (no such resident)
                  <Image
                    aria-hidden
                    src="/open-in-new-tab.svg"
                    alt="Open in new tab icon"
                    width={16}
                    height={16}
                  />
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a
              href="api/recommend/most-popular-program-names"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline hover:underline-offset-4"
            >
              <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
                GET{" "}
              </code>
              Engages the highest number of residents
              <Image
                aria-hidden
                src="/open-in-new-tab.svg"
                alt="Open in new tab icon"
                width={16}
                height={16}
              />
            </a>
          </li>
          <li>
            <a
              href="api/recommend/engages-isolated-residents-program-names"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline hover:underline-offset-4"
            >
              <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
                GET{" "}
              </code>
              Engages multiple isolated residents (those who have not been to a
              program recently)
              <Image
                aria-hidden
                src="/open-in-new-tab.svg"
                alt="Open in new tab icon"
                width={16}
                height={16}
              />
            </a>
          </li>
          <li>
            <a
              href="api/recommend/address-offerings-gap-program-names"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline hover:underline-offset-4"
            >
              <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
                GET{" "}
              </code>
              Addresses a gap in offerings (lots of interest from residents, but
              no similar programs planned)
              <Image
                aria-hidden
                src="/open-in-new-tab.svg"
                alt="Open in new tab icon"
                width={16}
                height={16}
              />
            </a>
          </li>
          <li>
            <a
              href="api/recommend/address-time-gap-program-names"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline hover:underline-offset-4"
            >
              <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
                GET{" "}
              </code>
              Addresses a gap in time (a reasonable day and time with few
              programs offered)
              <Image
                aria-hidden
                src="/open-in-new-tab.svg"
                alt="Open in new tab icon"
                width={16}
                height={16}
              />
            </a>
          </li>
        </ol>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/github.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          GitHub Repo of this project
          <Image
            aria-hidden
            src="/open-in-new-tab.svg"
            alt="Open in new tab icon"
            width={16}
            height={16}
          />
        </a>
        <div className="flex items-center gap-2">
          <Image
            aria-hidden
            src="/code.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Powered by Salim Dellali
        </div>
      </footer>
    </div>
  )
}
