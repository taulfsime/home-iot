import { existsSync, mkdirSync, PathLike, readFileSync, writeFileSync } from "fs";
import Storage from "./Storage";

const FS_PATH: PathLike = "./fs";
const DEBOUNCE_TIMER: number = 500; //in ms

if (!existsSync(FS_PATH)) {
  mkdirSync(FS_PATH);
}

export default class FileStorage extends Storage {
  private filepath: PathLike;
  private debounce: NodeJS.Timeout|null = null;

  constructor (filename: PathLike) {
    super({});

    this.addListener(() => {
      this.clearDebounce();
      this.debounce = setTimeout(this.save.bind(this), DEBOUNCE_TIMER);
    });

    this.filepath = `${FS_PATH}/${filename}.json`;

    if (existsSync(this.filepath)) {
      this.value = JSON.parse(
        String(readFileSync(this.filepath))
      );
    }
  }

  private save () {
    this.clearDebounce();

    writeFileSync(this.filepath, JSON.stringify(this.value));
  }

  private clearDebounce() {
    if (this.debounce) {
      clearTimeout(this.debounce);
      this.debounce = null;
    }
  }
}