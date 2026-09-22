import { stageTILMedia } from "../src/lib/tilContent.ts";

try {
  console.log(`TIL media staged: ${stageTILMedia()} published asset(s)`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
