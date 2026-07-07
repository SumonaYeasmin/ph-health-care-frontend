const svgPaths = {
  p18804580:
    "M8.00016 1.3335L9.41902 5.06915L13.4873 5.43184L10.2432 8.00771L11.18 12.0661L8.00016 10.1356L4.82033 12.0661L5.75711 8.00771L2.51306 5.43184L6.58142 5.06915L8.00016 1.3335Z",
  p2511de00:
    "M16.0003 2.66699L18.838 8.13821L25.9746 8.87434L20.4861 12.0154L22.36 18.6645L16.0003 15.8018L9.64055 18.6645L11.5144 12.0154L6.02592 8.87434L13.1626 8.13821L16.0003 2.66699Z",
};

export function SparkleIcon() {
  return (
    <div className="size-[15.994px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <g clipPath="url(#clip0_1_26)">
          <path
            d={svgPaths.p18804580}
            stroke="#1D4ED8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="M13.3286 1.99929V4.66501"
            stroke="#1D4ED8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="M14.6615 3.33215H11.9957"
            stroke="#1D4ED8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="M2.66572 11.3293V12.6622"
            stroke="#1D4ED8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="M3.33215 11.9957H1.99929"
            stroke="#1D4ED8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
        <defs>
          <clipPath id="clip0_1_26">
            <rect fill="white" height="15.9943" width="15.9943" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export function LargeSparkleIcon() {
  return (
    <div className="size-[31.989px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 32 32"
      >
        <g>
          <path
            d={svgPaths.p2511de00}
            stroke="#2563EB"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="M26.6572 3.99858V9.33002"
            stroke="#2563EB"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="M29.3229 6.6643H23.9915"
            stroke="#2563EB"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="M5.33144 22.6586V25.3243"
            stroke="#2563EB"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="M6.6643 23.9915H3.99858"
            stroke="#2563EB"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}