interface RulerProps {
  widthCm?: number; // default page width in cm, e.g. 21 (A4 width)
  scale?: number;   // zoom scale (1 = 100%)
}

export function Ruler({ widthCm = 21, scale = 1 }: RulerProps) {
  // Generate ruler tick marks from 21 down to 0 (RTL direction)
  const steps: { val: number; isMajor: boolean; isHalf: boolean }[] = [];
  for (let i = Math.floor(widthCm * 2); i >= 0; i--) {
    const val = i / 2;
    steps.push({
      val,
      isMajor: i % 2 === 0,
      isHalf: i % 2 !== 0,
    });
  }

  return (
    <div
      className="sticky top-0 z-10 w-full flex justify-center bg-[#A2A582] dark:bg-gray-800 border-b border-gray-400 dark:border-gray-700 select-none overflow-hidden"
      style={{ minHeight: '22px' }}
    >
      <div
        className="relative bg-[#EAE8D4] dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-x border-gray-400 dark:border-gray-600 shadow-inner"
        style={{
          width: `${widthCm * 37.8 * scale}px`, // 1cm approx 37.8px at 96 DPI
          height: '22px',
        }}
      >
        {/* Tick marks & Numbers */}
        <div className="absolute inset-0 flex flex-row items-end justify-between px-1 text-[9px] font-mono leading-none">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-end h-full relative"
              style={{ flex: 1 }}
            >
              {/* Number label for major numbers */}
              {step.isMajor && step.val > 0 && (
                <span className="absolute top-1 text-[8.5px] font-semibold opacity-90 transform -translate-x-1/2">
                  {step.val}
                </span>
              )}
              {step.isHalf && step.val > 0 && (
                <span className="absolute top-1 text-[7px] text-gray-500 dark:text-gray-400 transform -translate-x-1/2">
                  .{step.val % 1 === 0.5 ? '5' : ''}
                </span>
              )}

              {/* Tick Mark line */}
              <div
                className={`w-[1px] ${
                  step.isMajor
                    ? 'h-2.5 bg-gray-700 dark:bg-gray-300'
                    : 'h-1.5 bg-gray-400 dark:bg-gray-500'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Left & Right Margin boundary indicators */}
        <div
          className="absolute top-0 bottom-0 right-0 w-8 bg-black/10 dark:bg-white/10 pointer-events-none border-l border-amber-600/40"
          title="Right Margin (Hāmisy Kanan)"
        />
        <div
          className="absolute top-0 bottom-0 left-0 w-8 bg-black/10 dark:bg-white/10 pointer-events-none border-r border-amber-600/40"
          title="Left Margin (Hāmisy Kiri)"
        />
      </div>
    </div>
  );
}

export default Ruler;
