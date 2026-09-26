import type { SketchVariant } from "@/content/site";

/**
 * Restrained wireframe diagrams for the secondary projects.
 * They communicate layout and intent without pretending to be screenshots.
 */
export function ProjectSketch({ variant }: { variant: SketchVariant }) {
  return (
    <div className="relative aspect-16/10 w-full overflow-hidden rounded-sm border border-line bg-surface-2">
      <div className="absolute inset-0 p-5 sm:p-6">{SKETCHES[variant]}</div>
    </div>
  );
}

const bar = "rounded-full bg-line-strong";
const softBar = "rounded-full bg-line";

const SKETCHES: Record<SketchVariant, React.ReactNode> = {
  directory: (
    <div className="flex h-full flex-col gap-2.5">
      <div className="h-6 rounded-sm border border-line bg-bg" />
      <div className="grid flex-1 grid-cols-3 gap-2.5">
        {[0, 1, 2].map((index) => (
          <div key={index} className="rounded-sm border border-line bg-bg p-2">
            <div className="h-1/2 rounded-[3px] bg-surface-2" />
            <div className={`mt-2 h-1 w-3/4 ${bar}`} />
            <div className={`mt-1.5 h-1 w-1/2 ${softBar}`} />
          </div>
        ))}
      </div>
    </div>
  ),
  template: (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className={`h-1.5 w-10 ${bar}`} />
        <div className="flex gap-1.5">
          <div className={`h-1.5 w-6 ${softBar}`} />
          <div className={`h-1.5 w-6 ${softBar}`} />
          <div className="h-1.5 w-6 rounded-full bg-accent/70" />
        </div>
      </div>
      <div className="grid flex-1 grid-cols-5 gap-3">
        <div className="col-span-3 flex flex-col justify-center gap-2">
          <div className={`h-2.5 w-full ${bar}`} />
          <div className={`h-2.5 w-4/5 ${bar}`} />
          <div className={`mt-2 h-1 w-full ${softBar}`} />
          <div className={`h-1 w-2/3 ${softBar}`} />
          <div className="mt-3 flex gap-2">
            <div className="h-5 w-16 rounded-[3px] bg-accent/80" />
            <div className="h-5 w-16 rounded-[3px] border border-line-strong" />
          </div>
        </div>
        <div className="col-span-2 rounded-sm border border-line bg-bg" />
      </div>
    </div>
  ),
  delivery: (
    <div className="flex h-full items-stretch gap-4">
      <div className="w-[38%] rounded-md border border-line-strong bg-bg p-2">
        <div className={`mx-auto h-1 w-6 ${bar}`} />
        <div className="mt-3 space-y-2">
          <div className="h-8 rounded-[3px] bg-surface-2" />
          <div className={`h-1 w-3/4 ${bar}`} />
          <div className={`h-1 w-1/2 ${softBar}`} />
        </div>
      </div>
      <ul className="flex flex-1 flex-col justify-center gap-3">
        {[0, 1, 2, 3].map((index) => (
          <li key={index} className="flex items-center gap-3">
            <span
              className={`h-2 w-2 rounded-full ${index === 1 ? "bg-accent" : "border border-line-strong"}`}
            />
            <span className={`h-1 ${index === 1 ? "w-24 bg-line-strong" : "w-16 bg-line"} rounded-full`} />
          </li>
        ))}
      </ul>
    </div>
  ),
  dashboard: (
    <div className="flex h-full gap-3">
      <div className="hidden w-1/5 flex-col gap-2 rounded-sm border border-line bg-bg p-2 sm:flex">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className={`h-1 ${index === 0 ? "w-full bg-accent/70" : "w-2/3 bg-line"} rounded-full`} />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((index) => (
            <div key={index} className="rounded-sm border border-line bg-bg p-2">
              <div className={`h-1 w-8 ${softBar}`} />
              <div className={`mt-2 h-2 w-10 ${index === 0 ? "bg-accent/80" : "bg-line-strong"} rounded-full`} />
            </div>
          ))}
        </div>
        <div className="flex flex-1 items-end gap-1.5 rounded-sm border border-line bg-bg p-3">
          {[38, 62, 45, 78, 55, 90, 48].map((height, index) => (
            <div
              key={index}
              style={{ height: `${height}%` }}
              className={`flex-1 rounded-[2px] ${index === 5 ? "bg-accent/80" : "bg-line-strong"}`}
            />
          ))}
        </div>
      </div>
    </div>
  ),
  uikit: (
    <div className="grid h-full grid-cols-2 gap-2.5" dir="rtl">
      <div className="flex flex-col justify-center gap-2 rounded-sm border border-line bg-bg p-3">
        <div className={`h-1 w-12 self-end ${bar}`} />
        <div className="h-5 rounded-[3px] border border-line-strong" />
        <div className="h-5 w-2/3 self-end rounded-[3px] bg-accent/80" />
      </div>
      <div className="flex flex-col justify-center gap-2.5 rounded-sm border border-line bg-bg p-3">
        <div className="flex items-center justify-between">
          <div className="h-3 w-6 rounded-full border border-line-strong" />
          <div className={`h-1 w-10 ${softBar}`} />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-3 w-6 rounded-full bg-accent/80" />
          <div className={`h-1 w-8 ${softBar}`} />
        </div>
        <div className={`h-1 w-full ${softBar}`} />
        <div className={`h-1 w-3/4 self-end ${softBar}`} />
      </div>
    </div>
  ),
};
