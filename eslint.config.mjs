import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "layout-check-output/**",
      "next-env.d.ts",
      "portfolio-layout-check.cjs",
    ],
  },
];

export default eslintConfig;
